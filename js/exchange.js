document.addEventListener("DOMContentLoaded", () => {


const amountInput = document.getElementById("amount");
const calculateBtn = document.getElementById("calculate");
const swapBtn = document.getElementById("swapButton");

const result = document.getElementById("result");
const exchangeInfo = document.getElementById("exchangeInfo");

const fromSelected = document.getElementById("fromSelected");
const toSelected = document.getElementById("toSelected");

const fromSearch = document.getElementById("fromSearch");
const toSearch = document.getElementById("toSearch");

const fromOptions = document.getElementById("fromOptions");
const toOptions = document.getElementById("toOptions");

const fromText = document.getElementById("fromText");
const toText = document.getElementById("toText");

const fromIcon = document.getElementById("fromIcon");
const toIcon = document.getElementById("toIcon");

const favoriteList = document.getElementById("favoriteList");
const recentRate = document.getElementById("recentRate");


let fromCurrency = "USD";
let toCurrency = "KRW";


let chart7;
let chart30;



/*
================================
통화 목록 출력
지역 그룹 유지
================================
*/


function renderCurrencies(
container,
keyword,
callback
){


container.innerHTML="";


const search =
keyword.toLowerCase();



currencyGroups.forEach(group=>{


let matched =
group.currencies.filter(currency=>{


return (

currency.code.toLowerCase().includes(search)

||

currency.name.toLowerCase().includes(search)

);


});



if(matched.length){


const title =
document.createElement("div");


title.className="currency-group-title";

title.innerText =
group.group;


container.appendChild(title);



matched.forEach(currency=>{


const item =
document.createElement("div");


item.className =
"currency-option";


item.innerHTML = `

<span>
${currency.flag}
</span>

<span>
${currency.code} - ${currency.name}
</span>

`;



item.onclick=()=>{


callback(currency);


container.style.display="none";


};



container.appendChild(item);



});


}



});



container.style.display="block";


}





function selectFrom(currency){


fromCurrency =
currency.code;


fromText.innerText =
`${currency.code} - ${currency.name}`;


fromIcon.innerText =
currency.flag;


}



function selectTo(currency){


toCurrency =
currency.code;


toText.innerText =
`${currency.code} - ${currency.name}`;


toIcon.innerText =
currency.flag;


}







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




fromSearch.oninput=()=>{


renderCurrencies(
fromOptions,
fromSearch.value,
selectFrom
);


};



toSearch.oninput=()=>{


renderCurrencies(
toOptions,
toSearch.value,
selectTo
);


};






document.addEventListener(
"click",
(e)=>{


if(
!fromSelected.contains(e.target)
&&
!fromOptions.contains(e.target)
){

fromOptions.style.display="none";

}


if(
!toSelected.contains(e.target)
&&
!toOptions.contains(e.target)
){

toOptions.style.display="none";

}



});







/*
================================
환율 API
================================
*/


async function getRate(){


const key =
`${fromCurrency}_${toCurrency}`;



const cache =
localStorage.getItem(key);



if(cache){


const data =
JSON.parse(cache);



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
!data.rates
||
!data.rates[toCurrency]
){

throw new Error(
"지원하지 않는 환율입니다."
);

}



const rate =
data.rates[toCurrency];



localStorage.setItem(

key,

JSON.stringify({

rate,

time:Date.now()

})

);



return rate;


}







async function calculate(){


try{


const amount =
Number(amountInput.value);



const rate =
await getRate();



const value =
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


result.innerText =
error.message;


}



}






calculateBtn.onclick =
calculate;







swapBtn.onclick=()=>{


[
fromCurrency,
toCurrency
]=
[
toCurrency,
fromCurrency
];


[
fromText.innerText,
toText.innerText
]=
[
toText.innerText,
fromText.innerText
];


[
fromIcon.innerText,
toIcon.innerText
]=
[
toIcon.innerText,
fromIcon.innerText
];



calculate();


loadHistory();


};








/*
================================
즐겨찾기
================================
*/


function loadFavorites(){


favoriteList.innerHTML="";


const list =
JSON.parse(
localStorage.getItem("favorites")
)||[];



list.forEach(pair=>{


const button =
document.createElement("button");


button.innerText =
pair;



button.onclick=()=>{


const arr =
pair.split("/");


fromCurrency =
arr[0];

toCurrency =
arr[1];


calculate();


};



favoriteList.appendChild(button);



});



}




exchangeInfo.onclick=()=>{


const list =
JSON.parse(
localStorage.getItem("favorites")
)||[];



const pair =
`${fromCurrency}/${toCurrency}`;



if(!list.includes(pair)){


list.push(pair);


localStorage.setItem(
"favorites",
JSON.stringify(list)
);


}


loadFavorites();


};
// ==================================
// 최근 환율 데이터
// 7일 / 30일 차트
// ==================================


async function loadHistory(){


try{


const end =
new Date();



const start =
new Date();


start.setDate(
end.getDate()-30
);





const formatDate = (date)=>{


return date
.toISOString()
.split("T")[0];


};





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
data.map(item=>{


return {

date:item.date,

rate:item.rates[toCurrency]

};


})
.filter(item=>item.rate);






if(rates.length){


recentRate.innerHTML = `

최근 환율

<br>

1 ${fromCurrency}

=

${rates[rates.length-1].rate}

${toCurrency}

`;



drawCharts(rates);


}



}

catch(error){


recentRate.innerText =
"최근 환율 정보를 불러올 수 없습니다.";


}



}







function drawCharts(data){



const labels =
data.map(item=>item.date);



const values =
data.map(item=>item.rate);






if(chart7){

chart7.destroy();

}



if(chart30){

chart30.destroy();

}






const chart7Element =
document.getElementById("chart7");



const chart30Element =
document.getElementById("chart30");





if(chart7Element){


chart7 =
new Chart(

chart7Element,

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


},


options:{


responsive:true,


maintainAspectRatio:true


}



}


);



}








if(chart30Element){


chart30 =

new Chart(

chart30Element,

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


},



options:{


responsive:true,


maintainAspectRatio:true


}



}


);



}





}








// ==================================
// 초기 실행
// ==================================


loadFavorites();


calculate();


loadHistory();



});
