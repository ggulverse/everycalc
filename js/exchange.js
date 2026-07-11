/* ==================================================
   EveryCalc Exchange Calculator
   exchange.js
   Part 1/2
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



const favoriteList =
document.getElementById("favoriteList");



const recentRate =
document.getElementById("recentRate");



let fromCurrency =
"USD";


let toCurrency =
"KRW";



let chart7 =
null;


let chart30 =
null;





/* ==========================
   통화 표시
========================== */


function setCurrency(type,currency){


if(type==="from"){


fromCurrency =
currency.code;


fromText.innerText =
`${currency.code} - ${currency.name}`;


fromIcon.innerText =
currency.flag;


}
else{


toCurrency =
currency.code;


toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.flag;


}


}




/* ==========================
   국가 검색 목록
========================== */


function renderCurrencies(
container,
keyword,
type
){


container.innerHTML="";


let search =
keyword.toLowerCase();



currencies
.filter(currency=>{


return (

currency.code
.toLowerCase()
.includes(search)

||

currency.name
.toLowerCase()
.includes(search)

);


})
.forEach(currency=>{


let item =
document.createElement("div");



item.className =
"currency-option";



item.innerHTML = `

<span>
${currency.flag}
</span>

<span>
${currency.code}
-
${currency.name}
</span>

`;



item.onclick =
()=>{


setCurrency(
type,
currency
);



container.style.display =
"none";



};


container.appendChild(item);



});



container.style.display =
"block";


}






fromSearch.addEventListener(
"input",
()=>{


renderCurrencies(
fromOptions,
fromSearch.value,
"from"
);


});





toSearch.addEventListener(
"input",
()=>{


renderCurrencies(
toOptions,
toSearch.value,
"to"
);


});





fromSelected.onclick =
()=>{


renderCurrencies(
fromOptions,
"",
"from"
);


toOptions.style.display =
"none";


};





toSelected.onclick =
()=>{


renderCurrencies(
toOptions,
"",
"to"
);


fromOptions.style.display =
"none";


};





document.addEventListener(
"click",
(e)=>{


if(
!e.target.closest(".currency-selector")
){


fromOptions.style.display =
"none";


toOptions.style.display =
"none";


}


});





/* ==========================
   API 환율
========================== */


async function getRate(){


let key =
`${fromCurrency}_${toCurrency}`;



let saved =
localStorage.getItem(key);



if(saved){


let cache =
JSON.parse(saved);



if(
Date.now()-cache.time
<
3600000
){


return cache.rate;


}


}





let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}`

);



let data =
await response.json();



if(
!data.rates
||
!data.rates[toCurrency]
){


throw new Error(
"환율 데이터를 찾을 수 없습니다."
);


}




let rate =
data.rates[toCurrency];



localStorage.setItem(
key,
JSON.stringify({

rate:rate,

time:Date.now()

})
);



return rate;


}
/* ==================================================
   exchange.js
   Part 2/2
================================================== */



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


result.innerHTML =
"금액을 입력하세요.";


return;


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

${rate}

${toCurrency}

<br>

업데이트:

${new Date().toLocaleString()}

`;



loadHistory();



}


catch(error){


console.error(error);


result.innerHTML =
"환율 계산에 실패했습니다.";


}



}





calculateBtn.addEventListener(
"click",
calculate
);







/* ==========================
   환율 교환
========================== */


swapButton.addEventListener(
"click",
()=>{


let temp =
fromCurrency;


fromCurrency =
toCurrency;


toCurrency =
temp;



let tempText =
fromText.innerText;


fromText.innerText =
toText.innerText;


toText.innerText =
tempText;



let tempIcon =
fromIcon.innerText;


fromIcon.innerText =
toIcon.innerText;


toIcon.innerText =
tempIcon;



loadHistory();



}
);







/* ==========================
   즐겨찾기
========================== */


function loadFavorites(){


let favorites =
JSON.parse(
localStorage.getItem("favorites")
)
||
[];




favoriteList.innerHTML="";



favorites.forEach(pair=>{


let button =
document.createElement("button");


button.innerText =
pair;



button.onclick =
()=>{


let list =
pair.split("/");



fromCurrency =
list[0];


toCurrency =
list[1];



let from =
currencies.find(
c=>c.code===fromCurrency
);



let to =
currencies.find(
c=>c.code===toCurrency
);



if(from){


fromText.innerText =
`${from.code} - ${from.name}`;


fromIcon.innerText =
from.flag;


}



if(to){


toText.innerText =
`${to.code} - ${to.name}`;


toIcon.innerText =
to.flag;


}



loadHistory();



};



favoriteList.appendChild(button);



});



}






function addFavorite(){


let favorites =
JSON.parse(
localStorage.getItem("favorites")
)
||
[];




let pair =
`${fromCurrency}/${toCurrency}`;



if(
!favorites.includes(pair)
){


favorites.push(pair);


localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);



}


loadFavorites();



}





exchangeInfo.addEventListener(
"click",
addFavorite
);








/* ==========================
   환율 기록 + 차트
========================== */


async function loadHistory(){


try{


let end =
new Date();



let start =
new Date();


start.setDate(
end.getDate()-30
);



let format =
d=>
d.toISOString()
.split("T")[0];



let url =

`https://api.frankfurter.dev/v2/rates?from=${format(start)}&to=${format(end)}&base=${fromCurrency}&symbols=${toCurrency}`;



let response =
await fetch(url);



let data =
await response.json();



let rates =
data.map(item=>({


date:item.date,


rate:item.rates[toCurrency]


}));



recentRate.innerHTML = `

최근 환율

<br>

1 ${fromCurrency}

=

${rates.length ?
rates[rates.length-1].rate :
"-"}

${toCurrency}

`;



drawCharts(rates);



}
catch(error){


console.error(error);


recentRate.innerText =
"최근 환율 정보를 불러올 수 없습니다.";


}



}







function drawCharts(data){


let labels =
data.map(
item=>item.date
);



let values =
data.map(
item=>item.rate
);





if(chart7)
chart7.destroy();


if(chart30)
chart30.destroy();






let ctx7 =
document
.getElementById("chart7")
.getContext("2d");



chart7 =
new Chart(
ctx7,
{


type:"line",


data:{


labels:
labels.slice(-7),


datasets:[{


label:
"7일 환율",


data:
values.slice(-7),


tension:0.3


}]


},


options:{


responsive:true,


maintainAspectRatio:false


}



}
);








let ctx30 =
document
.getElementById("chart30")
.getContext("2d");



chart30 =
new Chart(
ctx30,
{


type:"line",


data:{


labels:labels,


datasets:[{


label:
"30일 환율",


data:values,


tension:0.3


}]


},


options:{


responsive:true,


maintainAspectRatio:false


}


}
);



}







/* ==========================
   시작
========================== */


function init(){


let usd =
currencies.find(
c=>c.code==="USD"
);


let krw =
currencies.find(
c=>c.code==="KRW"
);



if(usd)
setCurrency(
"from",
usd
);



if(krw)
setCurrency(
"to",
krw
);



loadFavorites();


loadHistory();



}



init();



});
