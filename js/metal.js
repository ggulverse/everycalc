/* ==================================================
   EveryCalc 2.0
   Precious Metals Calculator
================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


const metalSelect =
document.getElementById("metalSelect");


const currencySelect =
document.getElementById("currencySelect");


const unitSelect =
document.getElementById("unitSelect");


const amountInput =
document.getElementById("amount");


const calculateBtn =
document.getElementById("calculate");


const result =
document.getElementById("result");


const metalInfo =
document.getElementById("metalInfo");


const chartCanvas =
document.getElementById("metalChart");


let metalChart = null;
let selectedPeriod = 7;



const OZ_TO_GRAM = 31.1035;

const DON_TO_GRAM = 3.75;




/* =========================
   Metal Name
========================= */


function getMetalName(){


return metalSelect.options[
metalSelect.selectedIndex
].text;


}






/* =========================
   API Rate
========================= */


async function getMetalRate(){


const metal =
metalSelect.value;


const currency =
currencySelect.value;



const response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}`

);



if(!response.ok){

throw new Error(
"귀금속 시세 정보를 불러올 수 없습니다."
);

}



const data =
await response.json();



const target =
data.find(

item =>
item.quote === currency

);



if(!target){

throw new Error(
"시세 데이터를 찾을 수 없습니다."
);

}



return target.rate;


}

/* =========================
   Unit Convert
========================= */


function convertUnit(
price,
unit
){


if(unit === "oz"){

return price;

}



if(unit === "g"){

return price / OZ_TO_GRAM;

}



if(unit === "don"){

return (

price / OZ_TO_GRAM

)

*

DON_TO_GRAM;

}



return price;


}







/* =========================
   Calculate
========================= */


async function calculate(){


try{


const amount =

Number(
amountInput.value
);




if(isNaN(amount) || amount <= 0){


throw new Error(
"수량을 입력하세요."
);


}





const rate =

await getMetalRate();





const unitPrice =

convertUnit(

rate,

unitSelect.value

);





const total =

unitPrice * amount;





result.innerHTML =


`

<span>

${amount.toLocaleString()}

${unitSelect.value}

</span>


<strong>

${total.toLocaleString(

undefined,

{

maximumFractionDigits:2

}

)}

${currencySelect.value}

</strong>

`;






metalInfo.innerHTML =


`

<h3>

${getMetalName()}

국제 시세

</h3>



<p>

1 트로이온스(oz)

=

${rate.toLocaleString(

undefined,

{

maximumFractionDigits:2

}

)}

${currencySelect.value}

</p>



<p>

환산 기준

<br>

1 oz = 31.1035g

<br>

1 돈 = 3.75g

</p>

`;





loadHistory();



}


catch(error){


result.innerText =

error.message;


}



}

/* =========================
   Load History
========================= */


async function loadHistory(){


try{


const metal =

metalSelect.value;



const currency =

currencySelect.value;



const days = selectedPeriod;

const requestDays =
selectedPeriod === 365
?
730
:
selectedPeriod;

const today =

new Date();



const end =

today.toISOString()
.split("T")[0];




const startDate =

new Date();



startDate.setDate(

today.getDate() - requestDays

);




const start =

startDate.toISOString()
.split("T")[0];






const response =

await fetch(


`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}&from=${start}&to=${end}`


);





const data =

await response.json();


let chartData = data;


if(selectedPeriod === 365){

    chartData =
    data.filter(
        (item,index)=>
        index % 3 === 0
    );

}


drawChart(chartData);


}


catch(error){


console.log(error);


}



}








/* =========================
   Draw Chart
========================= */


function drawChart(data){



if(metalChart){


metalChart.destroy();


}




const labels =

data.map(

(item,index)=>{


if(selectedPeriod === 365){

    return index % 12 === 0
    ?
    item.date
    :
    "";

}


return item.date;


}

);





const values =

data.map(

item => item.rate

);





const metalName =

getMetalName();





const currency =

currencySelect.value;





const isDark =

document.body.classList.contains(
"dark-mode"
);





const textColor =

isDark

?

"#eeeeee"

:

"#222222";






metalChart =

new Chart(

chartCanvas,

{


type:"line",




data:{


labels,


datasets:[{

label:

selectedPeriod === 7

?

`${metalName} · 7일`

:

selectedPeriod === 30

?

`${metalName} · 1개월`

:

`${metalName} · 1년`,


data:values,

fill:false,

tension:0,

pointRadius:3,

pointHoverRadius:5

}]


},




options:{


responsive:true,


maintainAspectRatio:false,
aspectRatio:2,


interaction:{


mode:"index",

intersect:false


},




plugins:{



legend:{
    display:false
},



tooltip:{


callbacks:{


label:function(context){


return (

context.raw.toLocaleString()

+

" "

+

currency

);


}


}


}



},





scales:{



x:{

ticks:{

color:textColor,

maxRotation:0,

minRotation:0,

autoSkip:true,

maxTicksLimit:

selectedPeriod === 365

?

12

:

selectedPeriod === 30

?

10

:

7

},

grid:{

color:

isDark

?

"rgba(255,255,255,0.08)"

:

"rgba(0,0,0,0.08)"

}

},


y:{


title:{

display:false

},


ticks:{


color:textColor,


callback:function(value){


return value.toLocaleString();


}


},




grid:{


color:

isDark

?

"rgba(255,255,255,0.08)"

:

"rgba(0,0,0,0.08)"


}



}



}



}



}

);



}

/* =========================
   Events
========================= */


calculateBtn.addEventListener(

"click",

calculate

);






metalSelect.addEventListener(

"change",

()=>{


loadHistory();


}

);






currencySelect.addEventListener(

"change",

()=>{


updateChartUnit();


loadHistory();


}

);

document
.querySelectorAll(".period-button")
.forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        document
        .querySelectorAll(".period-button")
        .forEach(btn=>{

            btn.classList.remove("active");

        });


        button.classList.add("active");


        selectedPeriod =
        Number(
            button.dataset.period
        );


        loadHistory();


    });

});



/* =========================
   Chart Unit
========================= */


function updateChartUnit(){


const unit =

document.getElementById(
"metalChartUnit"
);



if(unit){


unit.innerText =


`1 트로이온스(oz)당 ${currencySelect.value}`;


}



}








/* =========================
   Dark Mode Update
========================= */


window.updateMetalChart =

function(){


loadHistory();


};

/* =========================
   Initial Load
========================= */


updateChartUnit();


loadHistory();



});
