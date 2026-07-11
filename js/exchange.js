/* ==================================================
   EveryCalc - exchange.js
   Currency + Metal Exchange
================================================== */


const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const calculateButton = document.getElementById("calculate");
const result = document.getElementById("result");
const exchangeInfo = document.getElementById("exchangeInfo");



/* ==========================
   Cache
========================== */


function saveCache(key, data){

    localStorage.setItem(
        key,
        JSON.stringify({
            time: Date.now(),
            data:data
        })
    );

}



function getCache(key){

    const saved =
    localStorage.getItem(key);


    if(!saved){
        return null;
    }


    const parsed =
    JSON.parse(saved);


    const limit =
    10 * 60 * 1000;


    if(Date.now() - parsed.time > limit){

        localStorage.removeItem(key);

        return null;

    }


    return parsed.data;

}





/* ==========================
   Currency Select
========================== */


function loadCurrencies(){


    currencies.forEach(item=>{


        const option1 =
        document.createElement("option");


        option1.value =
        item.code;


        option1.textContent =
        `${item.flag} ${item.code} (${item.name})`;



        const option2 =
        option1.cloneNode(true);



        fromCurrency.appendChild(option1);

        toCurrency.appendChild(option2);


    });



    fromCurrency.value="USD";

    toCurrency.value="KRW";


}







/* ==========================
   Frankfurter
========================== */


async function getExchangeRates(){


    const cached =
    getCache("exchangeRates");


    if(cached){

        return cached;

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





function makeRates(data){


    const rates={
        EUR:1
    };


    data.forEach(item=>{


        rates[item.quote]=item.rate;


    });



    return rates;


}







/* ==========================
   XAUS Metal API
========================== */


async function getMetalData(){


    const cached =
    getCache("metalData");


    if(cached){

        return cached;

    }



    const response =
    await fetch(
        "https://xaus.com/api/v1/spot"
    );


    const data =
    await response.json();



    saveCache(
        "metalData",
        data
    );


    return data;


}








/* ==========================
   Metal Calculate
========================== */


async function calculateMetal(amount, from, to){


    const data =
    await getMetalData();



    const krwRate =
    data.fx_rates.KRW;



    let usdPrice;



    if(from==="XAU"){

        usdPrice =
        data.per_gram_usd;

    }


    if(from==="XAG"){

        usdPrice =
        data.silver_usd_oz / 31.1035;

    }




    const krwPerGram =
    usdPrice * krwRate;



    const don =
    krwPerGram * 3.75;



    result.innerHTML = `

    <h2>

    ${amount} ${from}

    </h2>

    <p>

    1g =
    ${Math.round(krwPerGram).toLocaleString()}
    원

    </p>


    <p>

    1돈(3.75g) =
    ${Math.round(don).toLocaleString()}
    원

    </p>

    `;



    exchangeInfo.innerHTML = `

    <p>

    기준:
    XAUS API

    </p>

    <p>

    업데이트:
    ${new Date(data.updated_at)
    .toLocaleString()}

    </p>

    `;


}







/* ==========================
   Main Calculate
========================== */


async function calculateExchange(){


try{


    const amount =
    Number(amountInput.value);



    const from =
    fromCurrency.value;



    const to =
    toCurrency.value;



    const fromInfo =
    currencies.find(
        c=>c.code===from
    );



    const toInfo =
    currencies.find(
        c=>c.code===to
    );





    if(
        fromInfo.type==="metal"
        ||
        toInfo.type==="metal"
    ){

        await calculateMetal(
            amount,
            from,
            to
        );

        return;

    }







    const data =
    await getExchangeRates();



    const rates =
    makeRates(data);



    const eur =
    amount / rates[from];



    const converted =
    eur * rates[to];



    result.innerHTML = `

    <h2>

    ${amount.toLocaleString()}
    ${from}

    =

    ${converted.toLocaleString(
        undefined,
        {
            maximumFractionDigits:2
        }
    )}

    ${to}

    </h2>

    `;



    exchangeInfo.innerHTML = `

    <p>

    기준:
    Frankfurter API

    </p>

    `;



}


catch(error){


    console.error(error);


    result.innerHTML =
    "계산 중 오류가 발생했습니다.";


}


}







/* ==========================
   Events
========================== */


calculateButton.onclick =
calculateExchange;


fromCurrency.onchange =
calculateExchange;


toCurrency.onchange =
calculateExchange;





/* Start */

loadCurrencies();

calculateExchange();
