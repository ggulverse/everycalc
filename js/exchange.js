/* ==================================================
   EveryCalc - exchange.js
   Currency Converter
================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


const amount =
document.getElementById("amount");


const calculate =
document.getElementById("calculate");


const swap =
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



let chart7 = null;

let chart30 = null;





/*
====================================
통화 선택 메뉴
지역별 그룹 표시
====================================
*/


function renderCurrencyMenu(
element,
keyword,
callback
){


element.innerHTML="";



let search =
keyword
.toLowerCase()
.trim();




currencyGroups.forEach(group=>{


let groupBox =
document.createElement("div");


let title =
document.createElement("div");


title.className =
"currency-group-title";


title.innerText =
group.group;



groupBox.appendChild(title);





group.currencies
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



item.onclick = ()=>{


callback(currency);


element.style.display =
"none";


};


groupBox.appendChild(item);



});



element.appendChild(groupBox);



});



if(element.children.length){

element.style.display =
"block";

}


}






function setFrom(currency){


fromCurrency =
currency.code;



fromText.innerText =
`${currency.code} - ${currency.name}`;


fromIcon.innerText =
currency.flag;



fromOptions.style.display =
"none";


loadHistory();


}




function setTo(currency){


toCurrency =
currency.code;



toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.flag;



toOptions.style.display =
"none";


loadHistory();


}






fromSelected.onclick=()=>{


renderCurrencyMenu(
fromOptions,
"",
setFrom
);


};





toSelected.onclick=()=>{


renderCurrencyMenu(
toOptions,
"",
setTo
);


};





fromSearch.oninput=()=>{


renderCurrencyMenu(
fromOptions,
fromSearch.value,
setFrom
);


};





toSearch.oninput=()=>{


renderCurrencyMenu(
toOptions,
toSearch.value,
setTo
);


};
====================================
환율 API
Frankfurter
캐시 적용
====================================
*/


async function getRate(){


const cacheKey =
`exchange_${fromCurrency}_${toCurrency}`;



const saved =
localStorage.getItem(cacheKey);



if(saved){


const cache =
JSON.parse(saved);



if(
Date.now()-cache.time
<
3600000
){

return cache.rate;

}


}





const response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}`

);



if(!response.ok){

throw new Error(
"환율 서버 연결 실패"
);

}



const data =
await response.json();





if(
!data.rates ||
!data.rates[toCurrency]
){

throw new Error(
"지원하지 않는 환율입니다."
);

}





const rate =
data.rates[toCurrency];





localStorage.setItem(

cacheKey,

JSON.stringify({

rate:rate,

time:Date.now()

})

);



return rate;



}






/*
====================================
계산
====================================
*/


async function calculateExchange(){


try{


const value =
Number(amount.value);



if(
isNaN(value)
){

throw new Error(
"금액을 입력하세요."
);

}





const rate =
await getRate();




const resultValue =
value * rate;





result.innerHTML = `

<strong>

${value.toLocaleString()}
${fromCurrency}

=

${resultValue.toLocaleString(
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

${new Date()
.toLocaleString()}

<br>

⭐ 클릭하면 즐겨찾기 추가

`;



}


catch(error){


result.innerHTML =
error.message;



}

}





calculate.onclick =
calculateExchange;






/*
====================================
즐겨찾기
====================================
*/


function loadFavorites(){


const favorites =
JSON.parse(

localStorage.getItem(
"exchangeFavorites"
)

)
||
[];




favoriteList.innerHTML="";




favorites.forEach(pair=>{


const button =
document.createElement("button");


button.innerText =
pair;



button.onclick=()=>{


const data =
pair.split("/");



fromCurrency =
data[0];

toCurrency =
data[1];



const from =
currencies.find(
c=>c.code===fromCurrency
);


const to =
currencies.find(
c=>c.code===toCurrency
);



if(from){

setFrom(from);

}


if(to){

setTo(to);

}



};



favoriteList.appendChild(button);



});



}





function addFavorite(){


const favorites =
JSON.parse(

localStorage.getItem(
"exchangeFavorites"
)

)
||
[];




const pair =
`${fromCurrency}/${toCurrency}`;



if(
!favorites.includes(pair)
){

favorites.push(pair);


localStorage.setItem(

"exchangeFavorites",

JSON.stringify(favorites)

);


}



loadFavorites();



}




exchangeInfo.onclick =
addFavorite;







/*
====================================
스왑
====================================
*/


swap.onclick=()=>{


const old =
fromCurrency;


fromCurrency =
toCurrency;


toCurrency =
old;





const from =
currencies.find(
c=>c.code===fromCurrency
);


const to =
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
/*
====================================
최근 환율 데이터
7일 / 30일 차트
====================================
*/


async function loadHistory(){


try{


const end =
new Date();



const start =
new Date();


start.setDate(
end.getDate()-30
);




const formatDate =
(date)=>

date
.toISOString()
.split("T")[0];






const url =

`https://api.frankfurter.dev/v2/rates?from=${formatDate(start)}&to=${formatDate(end)}&base=${fromCurrency}&symbols=${toCurrency}`;






const response =
await fetch(url);





if(!response.ok){

throw new Error();

}





const data =
await response.json();





const rates =
data.map(item=>({

date:item.date,

rate:item.rates[toCurrency]

}))
.filter(item=>item.rate);





if(!rates.length){

recentRate.innerText =
"최근 환율 데이터 없음";

return;

}





recentRate.innerHTML = `

1 ${fromCurrency}

=

${rates[rates.length-1].rate}

${toCurrency}

`;




drawCharts(rates);



}

catch(error){


recentRate.innerText =
"최근 환율 정보를 불러올 수 없습니다.";


}



}







function drawCharts(data){



const labels =
data.map(
item=>item.date
);



const values =
data.map(
item=>item.rate
);






if(chart7){

chart7.destroy();

}



if(chart30){

chart30.destroy();

}





const canvas7 =
document
.getElementById("chart7");



const canvas30 =
document
.getElementById("chart30");






if(canvas7){



chart7 =
new Chart(

canvas7,

{

type:"line",


data:{


labels:
labels.slice(-7),


datasets:[{


label:
"최근 7일 환율",


data:
values.slice(-7)



}]


}


}

);



}







if(canvas30){



chart30 =
new Chart(

canvas30,

{


type:"line",


data:{


labels:


labels,


datasets:[{


label:
"최근 30일 환율",


data:
values



}]


}


}

);



}




}






/*
====================================
초기 실행
====================================
*/


loadFavorites();


loadHistory();





});
