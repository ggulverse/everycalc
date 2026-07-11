/* ==================================================
   EveryCalc - exchange.js
   Currency Exchange Calculator
================================================== */


const amountInput = document.getElementById("amount");

const fromSearch = document.getElementById("fromSearch");
const toSearch = document.getElementById("toSearch");

const fromSelected = document.getElementById("fromSelected");
const toSelected = document.getElementById("toSelected");

const fromOptions = document.getElementById("fromOptions");
const toOptions = document.getElementById("toOptions");

const swapBtn = document.getElementById("swapBtn");
const calculateBtn = document.getElementById("calculateBtn");

const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const updateTime = document.getElementById("updateTime");



let selectedFrom = "USD";
let selectedTo = "KRW";





/* ==========================
   Cache
========================== */


function saveCache(key,data){

    localStorage.setItem(
        key,
        JSON.stringify({
            time: Date.now(),
            data:data
        })
    );

}



function getCache(key){

    const cache =
    localStorage.getItem(key);


    if(!cache){
        return null;
    }


    const parsed =
    JSON.parse(cache);


    const limit =
    10 * 60 * 1000;


    if(
        Date.now() - parsed.time > limit
    ){

        localStorage.removeItem(key);

        return null;
    }


    return parsed.data;

}







/* ==========================
   Currency Menu
========================== */


function renderMenu(target,searchId,type){


    const keyword =
    document
    .getElementById(searchId)
    .value
    .toLowerCase();



    target.innerHTML="";



    currencies
    .filter(currency=>{


        return (

            currency.code
            .toLowerCase()
            .includes(keyword)

            ||

            currency.name
            .includes(keyword)

        );


    })
    .forEach(currency=>{


        const item =
        document.createElement("div");


        item.className =
        "currency-option";


        item.innerHTML =

        `${currency.flag}
        <strong>${currency.code}</strong>
        ${currency.name}`;



        item.onclick=function(){



            if(type==="from"){


                selectedFrom =
                currency.code;


                fromSelected.innerHTML =

                `${currency.flag}
                ${currency.code}
                ${currency.name}`;


            }
            else{


                selectedTo =
                currency.code;


                toSelected.innerHTML =

                `${currency.flag}
                ${currency.code}
                ${currency.name}`;


            }



            target.style.display="none";


            calculateExchange();


        };



        target.appendChild(item);


    });



}







function toggleMenu(button,list){


    button.onclick=function(){


        list.style.display =

        list.style.display==="block"

        ?

        "none"

        :

        "block";


    };


}








/* ==========================
   API
========================== */


async function getRates(){


    const cache =
    getCache("exchangeRates");


    if(cache){

        return cache;

    }



    const response =

    await fetch(

    "https://api.frankfurter.dev/v2/rates?base=EUR"

    );



    const data =
    await response.json();



    saveCache(
        "exchangeRates",
        data
    );


    return data;


}







function createRates(data){


    const rates = {

        EUR:1

    };


    data.forEach(item=>{


        rates[item.quote]
        =
        item.rate;


    });


    return rates;


}








/* ==========================
   Calculate
========================== */


async function calculateExchange(){


    try{


        const amount =
        Number(amountInput.value);



        if(isNaN(amount)){

            return;

        }



        const data =
        await getRates();



        const rates =
        createRates(data);



        const euroValue =

        amount
        /
        rates[selectedFrom];



        const resultValue =

        euroValue
        *
        rates[selectedTo];




        result.innerHTML =

        `

        <h2>

        ${amount.toLocaleString()}

        ${selectedFrom}

        =

        ${resultValue.toLocaleString(
            undefined,
            {
                maximumFractionDigits:2
            }
        )}

        ${selectedTo}

        </h2>

        `;




        rateInfo.innerHTML =


        `1 ${selectedFrom}

        =

        ${(rates[selectedTo]
        /
        rates[selectedFrom])
        .toFixed(4)}

        ${selectedTo}`;



        updateTime.innerHTML =


        "업데이트 : "

        +

        new Date()
        .toLocaleString();



    }


    catch(error){


        console.error(error);


        result.innerHTML =

        "환율 정보를 불러오지 못했습니다.";


    }


}








/* ==========================
   Swap
========================== */


swapBtn.onclick=function(){


    const temp =
    selectedFrom;


    selectedFrom =
    selectedTo;


    selectedTo =
    temp;



    const tempHTML =
    fromSelected.innerHTML;


    fromSelected.innerHTML =
    toSelected.innerHTML;


    toSelected.innerHTML =
    tempHTML;



    calculateExchange();


};








/* ==========================
   Event
========================== */


fromSearch.oninput=function(){


    renderMenu(
        fromOptions,
        "fromSearch",
        "from"
    );


};



toSearch.oninput=function(){


    renderMenu(
        toOptions,
        "toSearch",
        "to"
    );


};




toggleMenu(
    fromSelected,
    fromOptions
);



toggleMenu(
    toSelected,
    toOptions
);




calculateBtn.onclick =
calculateExchange;





/* ==========================
   Start
========================== */


fromSelected.innerHTML =

"🇺🇸 USD 미국 달러";


toSelected.innerHTML =

"🇰🇷 KRW 대한민국 원";




renderMenu(
    fromOptions,
    "fromSearch",
    "from"
);


renderMenu(
    toOptions,
    "toSearch",
    "to"
);



calculateExchange();
