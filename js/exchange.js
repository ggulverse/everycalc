document.addEventListener("DOMContentLoaded", () => {


const amount =
document.getElementById("amount");


const calculate =
document.getElementById("calculate");


const swapButton =
document.getElementById("swapButton");


const favoriteButton =
document.getElementById("favoriteButton");



const result =
document.getElementById("result");


const exchangeInfo =
document.getElementById("exchangeInfo");


const recentRate =
document.getElementById("recentRate");



const fromText =
document.getElementById("fromText");

const toText =
document.getElementById("toText");



const fromFlag =
document.getElementById("fromFlag");

const toFlag =
document.getElementById("toFlag");



const fromSearch =
document.getElementById("fromSearch");

const toSearch =
document.getElementById("toSearch");



const fromOptions =
document.getElementById("fromOptions");

const toOptions =
document.getElementById("toOptions");



const favoriteList =
document.getElementById("favoriteList");



let fromCurrency = "USD";

let toCurrency = "KRW";


let chart7;

let chart30;







/* =========================
   통화 선택 메뉴
========================= */


function showCurrencyList(
target,
keyword,
callback
){


target.innerHTML="";


const search =
keyword.toLowerCase();



currencies
.filter(currency => {


return (

currency.code
.toLowerCase()
.includes(search)

||

currency.name
.includes(search)

);


})
.forEach(currency => {



const item =
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



item.onclick = () => {


callback(currency);


target.style.display="none";


};



target.appendChild(item);



});



target.style.display="block";


}







function setFrom(currency){


fromCurrency =
currency.code;


fromText.innerText =
`${currency.code} - ${currency.name}`;


fromFlag.innerText =
currency.flag;



loadHistory();


}




function setTo(currency){


toCurrency =
currency.code;


toText.innerText =
`${currency.code} - ${currency.name}`;


toFlag.innerText =
currency.flag;



loadHistory();


}






fromSearch.addEventListener(
"input",
()=>{


showCurrencyList(
fromOptions,
fromSearch.value,
setFrom
);


});



toSearch.addEventListener(
"input",
()=>{


showCurrencyList(
toOptions,
toSearch.value,
setTo
);


});






fromText.parentElement.onclick =
()=>{


showCurrencyList(
fromOptions,
"",
setFrom
);


};





toText.parentElement.onclick =
()=>{


showCurrencyList(
toOptions,
"",
setTo
);


};










/* =========================
   환율 API
========================= */


async function getRate(){



const key =
`rate_${fromCurrency}_${toCurrency}`;



const saved =
localStorage.getItem(key);



if(saved){


const data =
JSON.parse(saved);


if(
Date.now()-data.time
<
3600000
){


return data.rate;


}


}




const response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}`

);



const data =
await response.json();



if(
!data[0]
){


throw new Error(
"환율 정보를 찾을 수 없습니다."
);


}



const rate =
data[0].rate;



localStorage.setItem(

key,

JSON.stringify({

rate,

time:Date.now()

})

);



return rate;



}








/* =========================
   계산
========================= */


async function calculateExchange(){


try{


const value =
Number(amount.value);



const rate =
await getRate();



const resultValue =
value * rate;



result.innerHTML = `

<h2>

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

</h2>

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


result.innerText =
error.message;


}


}



calculate.onclick =
calculateExchange;









/* =========================
   스왑
========================= */


swapButton.onclick = ()=>{


const temp =
fromCurrency;


fromCurrency =
toCurrency;


toCurrency =
temp;



const text =
fromText.innerText;


fromText.innerText =
toText.innerText;


toText.innerText =
text;



const flag =
fromFlag.innerText;


fromFlag.innerText =
toFlag.innerText;


toFlag.innerText =
flag;



loadHistory();


};









/* =========================
   즐겨찾기
========================= */


favoriteButton.onclick = ()=>{


let favorites =
JSON.parse(
localStorage.getItem("favorites")
)
|| [];



const pair =
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



renderFavorites();


};






function renderFavorites(){


let favorites =
JSON.parse(
localStorage.getItem("favorites")
)
|| [];



favoriteList.innerHTML="";



favorites.forEach(pair=>{


const button =
document.createElement("button");


button.innerText =
pair;



button.onclick = ()=>{


const split =
pair.split("/");


fromCurrency =
split[0];


toCurrency =
split[1];



loadHistory();


};



favoriteList.appendChild(button);



});



}



 





/* =========================
   차트
========================= */


async function loadHistory(){


try{


const end =
new Date();



const start =
new Date();


start.setDate(
end.getDate()-30
);



const format =
date =>
date.toISOString()
.substring(0,10);



const url =

`https://api.frankfurter.dev/v2/rates?from=${format(start)}&to=${format(end)}&base=${fromCurrency}&symbols=${toCurrency}`;



const response =
await fetch(url);



const data =
await response.json();



const rates =
data.map(item=>({


date:item.date,


rate:item.rate


}));




recentRate.innerHTML =

`

1 ${fromCurrency}

=

${rates.at(-1)?.rate ?? "-"}

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




if(chart7)
chart7.destroy();


if(chart30)
chart30.destroy();





chart7 =
new Chart(

document
.getElementById("chart7"),

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
.getElementById("chart30"),

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







renderFavorites();

loadHistory();



});
