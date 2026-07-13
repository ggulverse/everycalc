/* ==================================================
   EveryCalc - exchange.js
   Exchange Calculator
================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


const amountInput =
document.getElementById("amount");


const calculateBtn =
document.getElementById("calculate");


const swapButton =
document.getElementById("swapButton");


const result =
document.getElementById("result");


const exchangeInfo =
document.getElementById("exchangeInfo");



const fromSelected =
document.getElementById("fromSelected");


const toSelected =
document.getElementById("toSelected");


const fromSearch =
document.getElementById("fromSearch");


const toSearch =
document.getElementById("toSearch");


const fromOptions =
document.getElementById("fromOptions");


const toOptions =
document.getElementById("toOptions");



const fromText =
document.getElementById("fromText");


const toText =
document.getElementById("toText");


const fromIcon =
document.getElementById("fromIcon");


const toIcon =
document.getElementById("toIcon");


let fromCurrency =
"USD";


let toCurrency =
"KRW";



let exchangeChart = null;

let selectedPeriod = 7;



/* ==========================
   통화 선택
========================== */


function renderCurrencies(
container,
keyword,
callback
){

container.innerHTML="";


let search =
keyword.toLowerCase();



/* ==========================
   검색 중
========================== */

if(search !== ""){


let results = [];


currencyGroups.forEach(group=>{


group.currencies.forEach(currency=>{


if(

currency.code
.toLowerCase()
.includes(search)

||

currency.name
.toLowerCase()
.includes(search)

){

results.push(currency);

}


});


});



if(results.length === 0){


let empty =
document.createElement("div");


empty.className =
"currency-option";


empty.innerText =
"검색 결과가 없습니다.";


container.appendChild(empty);


}

else{


results.forEach(currency=>{


let item =
document.createElement("div");


item.className =
"currency-option";


item.innerHTML = `

<span>
${currency.flag || ""}
</span>

<span>
${currency.code}
-
${currency.name}
</span>

`;



item.onclick =
()=>{


callback(currency);


container.style.display =
"none";


};



container.appendChild(item);



});


}


}


/* ==========================
   일반 목록
========================== */

else{


currencyGroups.forEach(group=>{


let groupTitle =
document.createElement("div");


groupTitle.className =
"currency-group-title";


groupTitle.innerText =
group.group;



container.appendChild(groupTitle);



group.currencies.forEach(currency=>{


let item =
document.createElement("div");


item.className =
"currency-option";


item.innerHTML = `

<span>
${currency.flag || ""}
</span>

<span>
${currency.code}
-
${currency.name}
</span>

`;



item.onclick =
()=>{


callback(currency);


container.style.display =
"none";


};



container.appendChild(item);



});


});


}



container.style.display =
"block";


}



function selectFrom(currency){


fromCurrency =
currency.code;



fromText.innerText =
`${currency.code} - ${currency.name}`;


fromIcon.innerText =
currency.flag || "";

updateExchangeChartUnit();

loadHistory();


}




function selectTo(currency){


toCurrency =
currency.code;



toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.flag || "";

updateExchangeChartUnit();

loadHistory();


}

function updateExchangeChartUnit(){

    const unit =
    document.getElementById("exchangeChartUnit");


    if(unit){

        unit.innerText =
        `1 ${fromCurrency}당 ${toCurrency}`;

    }

}



fromSelected.onclick =
()=>{


renderCurrencies(

fromOptions,

"",

selectFrom

);


};




toSelected.onclick =
()=>{


renderCurrencies(

toOptions,

"",

selectTo

);


};





fromSearch.addEventListener(

"input",

()=>{


renderCurrencies(

fromOptions,

fromSearch.value,

selectFrom

);


}

);




toSearch.addEventListener(

"input",

()=>{


renderCurrencies(

toOptions,

toSearch.value,

selectTo

);


}

);





document.addEventListener(

"click",

(e)=>{


if(
!e.target.closest(".currency-selector")
){


fromOptions.style.display="none";

toOptions.style.display="none";


}


}

);





/* ==========================
   환율 API
========================== */


async function getRate(){


let cacheKey =
`${fromCurrency}_${toCurrency}`;



let cache =
localStorage.getItem(cacheKey);



if(cache){


let saved =
JSON.parse(cache);



if(
Date.now()-saved.time
<
3600000
){


return saved.rate;


}


}





let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}`

);




if(!response.ok){


throw new Error(
"환율 API 연결 실패"
);


}




let data =
await response.json();





let target =
data.find(

item=>

item.quote === toCurrency

);





if(!target){


throw new Error(
"환율 정보를 찾을 수 없습니다."
);


}





let rate =
target.rate;





localStorage.setItem(

cacheKey,

JSON.stringify({

rate:rate,

time:Date.now()

})

);





return rate;


}
/* ==========================
   계산
========================== */


async function calculate(){


try{


let amount =
Number(amountInput.value);



if(
isNaN(amount)
){

throw new Error(
"금액을 입력하세요."
);

}



let rate =
await getRate();



let value =
amount * rate;



result.innerHTML = `

<strong>

${amount.toLocaleString()}
${fromCurrency}

=

${value.toLocaleString(
undefined,
{
maximumFractionDigits:2
}
)}
${toCurrency}

</strong>

`;




exchangeInfo.innerHTML = `

1 ${fromCurrency}
=
${Number(rate).toLocaleString(
undefined,
{
maximumFractionDigits:2
}
)}
${toCurrency}

<br>

업데이트:
${new Date().toLocaleString()}

`;



loadHistory();



}


catch(error){


console.error(error);


result.innerText =
error.message;


}


}




calculateBtn.onclick =
calculate;





/* ==========================
   스왑
========================== */


swapButton.onclick =
()=>{


let currencyTemp =
fromCurrency;


fromCurrency =
toCurrency;


toCurrency =
currencyTemp;




let textTemp =
fromText.innerText;


fromText.innerText =
toText.innerText;


toText.innerText =
textTemp;




let iconTemp =
fromIcon.innerText;


fromIcon.innerText =
toIcon.innerText;


toIcon.innerText =
iconTemp;

updateExchangeChartUnit();

loadHistory();


};





/* ==========================
   최근 환율
========================== */


async function loadHistory(){

try{


let today =
new Date();


let end =
today.toISOString()
.split("T")[0];


let startDate =
new Date();


startDate.setDate(
today.getDate()-selectedPeriod
);


let start =
startDate.toISOString()
.split("T")[0];



let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}&from=${start}&to=${end}`

);



if(!response.ok){

throw new Error(
"차트 API 실패"
);

}



let data =
await response.json();


data =
data.filter(
item =>
item.rate
);


/* ==========================
   기간별 데이터 보정
========================== */

if(selectedPeriod === 365){

    data =
    data.filter(
        (item,index)=>
        index % 7 === 0
    );

}



if(data.length){

    drawCharts(data);

}



}

catch(error){


console.log(error);


}



}




/* ==========================
   차트
========================== */


function drawCharts(data){


const canvas =
document.getElementById("exchangeChart");


if(!canvas){

return;

}


if(exchangeChart){

exchangeChart.destroy();

}



const labels =
data.map(
item=>item.date
);



const values =
data.map(
item=>Number(item.rate)
);



const chartTextColor =
document.body.classList.contains("dark-mode")
?
"#ffffff"
:
"#222222";



exchangeChart =
new Chart(
canvas.getContext("2d"),
{

type:"line",

data:{

labels:labels,

datasets:[{

label:
selectedPeriod === 7
?
"7일 환율"
:
selectedPeriod === 30
?
"1개월 환율"
:
"1년 환율",

data:values

}]

},


options:{

responsive:true,

plugins:{

legend:{

labels:{

color:chartTextColor

}

}

},

scales:{

x:{

ticks:{

color:chartTextColor

}

},

y:{

ticks:{

color:chartTextColor

}

}

}

}

}

);

}

window.updateCharts = function(){

    loadHistory();

};


/* ==========================
   시작
========================== */

updateExchangeChartUnit();

loadHistory();



});
