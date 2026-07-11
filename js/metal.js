/* ==================================================
   EveryCalc - metal.js
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



let chart7 = null;

let chart30 = null;



const OZ_TO_GRAM =
31.1035;


const DON_TO_GRAM =
3.75;



async function getMetalRate(){


let metal =
metalSelect.value;


let currency =
currencySelect.value;


let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}`

);



if(!response.ok){

throw new Error(
"귀금속 API 연결 실패"
);

}



let data =
await response.json();



let target =
data.find(

item=>

item.quote === currency

);



if(!target){

throw new Error(
"시세 정보를 찾을 수 없습니다."
);

}



return target.rate;


}





function convertUnit(
price,
unit
){


if(unit==="oz"){

return price;

}


if(unit==="g"){

return price / OZ_TO_GRAM;

}


if(unit==="don"){

return (price / OZ_TO_GRAM)
*
DON_TO_GRAM;

}


}




async function calculate(){


try{


let amount =
Number(
amountInput.value
);



if(
isNaN(amount)
){

throw new Error(
"수량을 입력하세요."
);

}



let rate =
await getMetalRate();



let unitPrice =
convertUnit(

rate,

unitSelect.value

);



let total =
unitPrice * amount;



result.innerHTML = `

<strong>

${amount.toLocaleString()}
${unitSelect.value}

=

${total.toLocaleString(
undefined,
{
maximumFractionDigits:2
}
)}
${currencySelect.value}

</strong>

`;



metalInfo.innerHTML = `

<h3>
${metalSelect.options[metalSelect.selectedIndex].text}
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

console.log(error);

result.innerText =
error.message;

}


}



calculateBtn.onclick =
calculate;


metalSelect.addEventListener(
"change",
()=>{

loadHistory();

}
);



currencySelect.addEventListener(
"change",
()=>{

loadHistory();

}
);



async function loadHistory(){


try{


let metal =
metalSelect.value;


let currency =
currencySelect.value;



let today =
new Date();



let end =
today.toISOString()
.split("T")[0];



let startDate =
new Date();



startDate.setDate(
today.getDate()-30
);



let start =
startDate.toISOString()
.split("T")[0];



let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}&from=${start}&to=${end}`

);



let data =
await response.json();



drawCharts(data);


}

catch(error){

console.log(error);

}


}
function drawCharts(data){


if(chart7){

chart7.destroy();

}


if(chart30){

chart30.destroy();

}



let labels =
data.map(
item=>item.date
);



let values =
data.map(
item=>item.rate
);



let textColor =
document.body.classList.contains("dark-mode")
?
"#ffffff"
:
"#222222";




const chartOptions = {


plugins:{


legend:{


labels:{


color:textColor


}


}


},



scales:{


x:{


ticks:{


color:textColor


},


grid:{


color:textColor + "33"


}


},



y:{


ticks:{


color:textColor


},


grid:{


color:textColor + "33"


}


}



}



};





chart7 =
new Chart(

document
.getElementById("chart7")
.getContext("2d"),

{

type:"line",


data:{


labels:
labels.slice(-7),


datasets:[{

label:
`7일 ${metalSelect.options[metalSelect.selectedIndex].text} 시세 (1oz 기준)`,

data:
values.slice(-7)

}]


},


options:chartOptions


}

);






chart30 =
new Chart(

document
.getElementById("chart30")
.getContext("2d"),

{


type:"line",


data:{


labels,


datasets:[{

label:
`30일 ${metalSelect.options[metalSelect.selectedIndex].text} 시세 (1oz 기준)`,

data:values

}]


},


options:chartOptions


}

);



}





window.updateMetalCharts =
function(){

loadHistory();

};



loadHistory();



});
