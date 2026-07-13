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



const days =

Number(
chartPeriod.value
);




const today =

new Date();



const end =

today.toISOString()
.split("T")[0];




const startDate =

new Date();



startDate.setDate(

today.getDate() - days

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





drawChart(data);



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

item => item.date

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

`${metalName} · 1oz 기준 ${currency}`,



data:values,



tension:0.35,



fill:false,



pointRadius:0,



pointHoverRadius:5



}]


},




options:{


responsive:true,


maintainAspectRatio:false,



interaction:{


mode:"index",

intersect:false


},




plugins:{



legend:{


display:true,


labels:{


color:textColor


}


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


color:textColor


},


grid:{


display:false


}


},




y:{


title:{


display:true,


text:

`${metalName} 가격 (${currency})`,


color:textColor


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
