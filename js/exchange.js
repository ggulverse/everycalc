/* ==================================================
   EveryCalc - exchange.js
================================================== */


const amountInput =
document.getElementById("amount");


const fromCurrency =
document.getElementById("fromCurrency");


const toCurrency =
document.getElementById("toCurrency");


const calculateButton =
document.getElementById("calculate");


const result =
document.getElementById("result");


const exchangeInfo =
document.getElementById("exchangeInfo");



/* ==========================
   Load Currency List
========================== */


function loadCurrencies(){


    currencies.forEach(currency=>{


        const fromOption =
        document.createElement("option");


        fromOption.value =
        currency.code;


        fromOption.textContent =
        `${currency.flag} ${currency.code} (${currency.name})`;


        const toOption =
        fromOption.cloneNode(true);


        fromCurrency.appendChild(fromOption);

        toCurrency.appendChild(toOption);


    });



    fromCurrency.value =
    "USD";


    toCurrency.value =
    "KRW";


}





/* ==========================
   Cache
========================== */


function saveCache(key,data){


    localStorage.setItem(

        key,

        JSON.stringify({

            time:Date.now(),

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



    const tenMinutes =
    10 * 60 * 1000;



    if(Date.now() - parsed.time > tenMinutes){

        localStorage.removeItem(key);

        return null;

    }



    return parsed.data;


}







/* ==========================
   Exchange API
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



    if(!response.ok){

        throw new Error(
            "환율 API 오류"
        );

    }



    const data =
    await response.json();



    saveCache(
        "exchangeRates",
        data
    );


    return data;


}







function createRateObject(data){


    const rates = {

        EUR:1

    };



    data.forEach(item=>{


        rates[item.quote] =
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



        if(!amount || amount <=0){


            result.innerHTML =
            "금액을 입력해주세요.";


            return;


        }





        const from =
        fromCurrency.value;



        const to =
        toCurrency.value;





        const data =
        await getExchangeRates();



        const rates =
        createRateObject(data);





        if(!rates[from] || !rates[to]){


            result.innerHTML =
            "지원하지 않는 통화입니다.";


            return;

        }





        const euroAmount =
        amount / rates[from];



        const converted =
        euroAmount * rates[to];





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





        const unitRate =
        rates[to] / rates[from];





        exchangeInfo.innerHTML = `

        <p>

        적용 환율

        <br>

        1 ${from}

        =

        ${unitRate.toLocaleString(
            undefined,
            {
                maximumFractionDigits:6
            }
        )}

        ${to}

        </p>


        <p>

        데이터 기준

        <br>

        Frankfurter 공개 환율 데이터

        </p>


        `;



    }


    catch(error){


        console.error(error);


        result.innerHTML =
        "환율 데이터를 불러오지 못했습니다.";


        exchangeInfo.innerHTML =
        "API 연결을 확인해주세요.";


    }


}







/* ==========================
   Event
========================== */


calculateButton.onclick =
calculateExchange;





fromCurrency.onchange =
calculateExchange;


toCurrency.onchange =
calculateExchange;







/* ==========================
   Start
========================== */


loadCurrencies();


calculateExchange();
