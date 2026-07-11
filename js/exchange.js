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



loadHistory();


}




function selectTo(currency){


toCurrency =
currency.code;



toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.flag || "";



loadHistory();


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



loadHistory();


};






/* ==========================
   즐겨찾기
========================== */


function loadFavorites(){


let favorites =
JSON.parse(

localStorage.getItem(
"favorites"
)

)

|| [];



favoriteList.innerHTML =
"";



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


loadHistory();


};



favoriteList.appendChild(button);



});


}





function addFavorite(){


let favorites =
JSON.parse(

localStorage.getItem(
"favorites"
)

)

|| [];



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



exchangeInfo.onclick =
addFavorite;






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
today.getDate()-30
);


let start =
startDate.toISOString()
.split("T")[0];



let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}&from=${start}&to=${end}`

);



if(!response.ok){

throw new Error(
"차트 API 실패"
);

}



let data =
await response.json();




if(data.length){


let latest =
data[data.length-1];



recentRate.innerHTML = `

최근 환율

<br>

1 ${fromCurrency}
=
${latest.rate}
${toCurrency}

`;



drawCharts(data);



}



}

catch(error){


console.log(error);


recentRate.innerText =
"환율 정보를 불러올 수 없습니다.";


}



}




/* ==========================
   차트
========================== */


function drawCharts(data){


if(
!document.getElementById("chart7")
||
!document.getElementById("chart30")
){

return;

}



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

label:"7일 환율",

data:
values.slice(-7)

}]

}

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

label:"30일 환율",

data:values

}]

}

}

);



}





/* ==========================
   시작
========================== */


loadFavorites();


loadHistory();



});
