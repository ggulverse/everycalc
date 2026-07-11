document.addEventListener("DOMContentLoaded", () => {


const amountInput = document.getElementById("amount");

const calculateBtn =
document.getElementById("calculate");

const swapBtn =
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




let fromCurrency = "USD";

let toCurrency = "KRW";



let chart7 = null;

let chart30 = null;






/*
==========================
통화 목록 생성
==========================
*/


function renderCurrencies(
container,
keyword,
callback
){


container.innerHTML="";


let search =
keyword.toLowerCase();



currencies
.filter(currency => {


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
.forEach(currency => {



let item =
document.createElement("div");


item.className =
"currency-item";



item.innerHTML = `

<span>
${currency.icon || ""}
</span>

<span>
${currency.code}
-
${currency.name}
</span>

`;



item.onclick = () => {

callback(currency);

container.innerHTML="";

};



container.appendChild(item);



});



}






function selectFrom(currency){


fromCurrency =
currency.code;


fromText.innerText =
`${currency.code} - ${currency.name}`;


fromIcon.innerText =
currency.icon || "";


loadHistory();


}





function selectTo(currency){


toCurrency =
currency.code;


toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.icon || "";


loadHistory();


}







fromSearch.addEventListener(
"input",
()=>{


renderCurrencies(
fromOptions,
fromSearch.value,
selectFrom
);


});





toSearch.addEventListener(
"input",
()=>{


renderCurrencies(
toOptions,
toSearch.value,
selectTo
);


});







fromSelected.onclick=()=>{


renderCurrencies(
fromOptions,
"",
selectFrom
);


};




toSelected.onclick=()=>{


renderCurrencies(
toOptions,
"",
selectTo
);


};







/*
==========================
환율 계산
==========================
*/


async function getRate(){


let cacheKey =
`${fromCurrency}_${toCurrency}`;



let cache =
localStorage.getItem(cacheKey);



if(cache){


let data =
JSON.parse(cache);


if(
Date.now()
-
data.time
<
3600000
){


return data.rate;


}


}





let response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}`

);



let data =
await response.json();





if(
!data.rates ||
!data.rates[toCurrency]
){


throw new Error(
"지원하지 않는 환율입니다."
);


}





let rate =
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








async function calculate(){


try{


let amount =
Number(amountInput.value);



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



exchangeInfo.innerHTML =

`

1 ${fromCurrency}
=
${rate}
${toCurrency}

<br>

업데이트:
${new Date().toLocaleString()}

`;




}


catch(error){


result.innerHTML =
error.message;


}


}







calculateBtn.onclick =
calculate;









/*
==========================
스왑
==========================
*/


swapBtn.onclick=()=>{


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



loadHistory();


};









/*
==========================
즐겨찾기
==========================
*/


function loadFavorites(){


let favorites =
JSON.parse(

localStorage.getItem(
"favorites"
)

)||[];



favoriteList.innerHTML="";



favorites.forEach(pair=>{


let button =
document.createElement("button");



button.innerText =
pair;



button.onclick=()=>{


let arr =
pair.split("/");


fromCurrency =
arr[0];

toCurrency =
arr[1];



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

)||[];



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






document
.getElementById("exchangeInfo")
.onclick =
addFavorite;









/*
==========================
차트 데이터
==========================
*/


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
date =>
date.toISOString()
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



recentRate.innerHTML =

`

최근 환율:

1 ${fromCurrency}
=
${rates.at(-1)?.rate || "-"}

${toCurrency}

`;



drawCharts(rates);



}

catch(e){


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
values.slice(-7)

}]

}

});







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

labels,

datasets:[{

label:
"30일 환율",

data:values

}]

}

});




}






loadFavorites();

loadHistory();



});
