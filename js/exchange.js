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

let chart7 = null;
let chart30 = null;



/*
==============================
통화 선택
==============================
*/


function renderCurrencies(container, keyword, callback){


container.innerHTML = "";


const search =
keyword.toLowerCase();



currencyGroups.forEach(group=>{


const matches =
group.currencies.filter(currency=>{


return (

currency.code
.toLowerCase()
.includes(search)

||

currency.name
.toLowerCase()
.includes(search)

);


});



if(matches.length){


const title =
document.createElement("div");


title.className =
"currency-group-title";


title.textContent =
group.group;


container.appendChild(title);



matches.forEach(currency=>{


const item =
document.createElement("div");


item.className =
"currency-option";


item.innerHTML = `

<span>${currency.flag}</span>

<span>
${currency.code} - ${currency.name}
</span>

`;



item.onclick = ()=>{


callback(currency);


container.style.display =
"none";


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


fromText.textContent =
`${currency.code} - ${currency.name}`;


fromIcon.textContent =
currency.flag;


}



function selectTo(currency){


toCurrency =
currency.code;


toText.textContent =
`${currency.code} - ${currency.name}`;


toIcon.textContent =
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





document.addEventListener(
"click",
e=>{


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
==============================
환율 API
==============================
*/


async function getRate(){


const cacheKey =
`${fromCurrency}_${toCurrency}`;



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
"환율 서버 오류"
);

}





const data =
await response.json();



let rate = null;



// Frankfurter v2 배열 대응

if(Array.isArray(data)){


if(data.length > 0){

rate =
data[0].rate;

}


}


// 객체 응답 대응

else if(data.rates){


rate =
data.rates[toCurrency];


}





if(!rate){


throw new Error(
"지원하지 않는 환율입니다."
);


}



localStorage.setItem(

cacheKey,

JSON.stringify({

rate:rate,

time:Date.now()

})

);



return rate;


}
return rate;

}






/*
==========================
환율 계산
==========================
*/


async function calculate(){


    try{


        let amount =
        Number(amountInput.value);



        if(
            isNaN(amount) ||
            amount < 0
        ){

            result.innerHTML =
            "올바른 금액을 입력하세요.";

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

        ${rate.toLocaleString()}

        ${toCurrency}

        <br>

        업데이트:

        ${new Date().toLocaleString()}

        `;



    }
    catch(error){


        result.innerHTML =
        "환율 정보를 불러오지 못했습니다.";


        console.error(error);


    }


}






calculateBtn.addEventListener(
"click",
calculate
);






/*
==========================
통화 교환
==========================
*/


swapBtn.addEventListener(
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







/*
==========================
즐겨찾기
==========================
*/


function loadFavorites(){


    let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];



    favoriteList.innerHTML="";



    favorites.forEach(pair=>{


        let button =
        document.createElement("button");


        button.className =
        "favorite-button";


        button.innerText =
        pair;



        button.onclick = ()=>{


            let data =
            pair.split("/");



            fromCurrency =
            data[0];


            toCurrency =
            data[1];



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
    ) || [];



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
.addEventListener(
"click",
addFavorite
);






/*
==========================
환율 기록
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

        `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&symbols=${toCurrency}&from=${format(start)}&to=${format(end)}`;



        let response =
        await fetch(url);



        let data =
        await response.json();



        let rates =
        data.map(item=>({


            date:item.date,


            rate:item.rate || item.rates[toCurrency]


        }));



        recentRate.innerHTML = `

        최근 환율:

        1 ${fromCurrency}

        =

        ${rates.length ? rates[rates.length-1].rate : "-"}

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



    if(chart7){

        chart7.destroy();

    }


    if(chart30){

        chart30.destroy();

    }





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
                    `${fromCurrency} → ${toCurrency} 7일`,


                    data:
                    values.slice(-7),


                    tension:0.3


                }]


            },


            options:{


                responsive:true,


                maintainAspectRatio:false,


                plugins:{


                    legend:{


                        display:true


                    }


                }


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


                labels:
                labels,


                datasets:[{


                    label:
                    `${fromCurrency} → ${toCurrency} 30일`,


                    data:
                    values,


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







/*
==========================
초기 설정
==========================
*/



function initCurrency(){


    let from =
    currencies.find(
        c=>c.code==="USD"
    );



    let to =
    currencies.find(
        c=>c.code==="KRW"
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


}






initCurrency();


loadFavorites();


loadHistory();





/*
==========================
선택창 외부 클릭 닫기
==========================
*/


document.addEventListener(
"click",
(e)=>{


    if(
        !e.target.closest(".currency-selector")
    ){

        fromOptions.style.display="none";

        toOptions.style.display="none";


    }


});







fromSelected.addEventListener(
"click",
()=>{


    fromOptions.style.display="block";

    toOptions.style.display="none";


});






toSelected.addEventListener(
"click",
()=>{


    toOptions.style.display="block";

    fromOptions.style.display="none";


});








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

        ${currency.flag}

        </span>


        <span>

        ${currency.code}

        -

        ${currency.name}

        </span>

        `;



        item.onclick=()=>{


            callback(currency);


            container.style.display="none";


        };



        container.appendChild(item);



    });


}
                        
