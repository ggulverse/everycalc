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


        const option =
        document.createElement("option");


        option.value =
        currency.code;


        option.textContent =
        `${currency.flag} ${currency.code} (${currency.name})`;


        fromCurrency.appendChild(
            option.cloneNode(true)
        );


        toCurrency.appendChild(
            option
        );


    });



    fromCurrency.value =
    "USD";


    toCurrency.value =
    "KRW";


}





/* ==========================
   Get Exchange Rate
========================== */


async function getExchangeRates(){


    const response =
    await fetch(
        "https://api.frankfurter.dev/v2/rates?base=EUR"
    );


    if(!response.ok){

        throw new Error(
            "API 오류"
        );

    }


    return await response.json();


}





/* ==========================
   Convert Data
========================== */


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


        let amount =
        Number(
            amountInput.value.replace(/,/g,"")
        );



        if(!amount || amount <=0){


            result.innerHTML =
            "금액을 입력해주세요.";


            return;

        }




        const data =
        await getExchangeRates();



        const rates =
        createRateObject(data);




        const from =
        fromCurrency.value;


        const to =
        toCurrency.value;




        if(!rates[from] || !rates[to]){


            result.innerHTML =
            "현재 금/은 가격 데이터는 준비 중입니다.";


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

        현재 환율

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

        데이터 출처

        <br>

        Frankfurter API

        (ECB 공개 환율 데이터)


        </p>


        `;



    }


    catch(error){


        console.error(error);



        result.innerHTML =
        "환율 데이터를 불러오지 못했습니다.";



        exchangeInfo.innerHTML =
        "API 연결 오류";


    }


}







/* ==========================
   Button
========================== */


calculateButton.onclick =
calculateExchange;






/* ==========================
   Start
========================== */


loadCurrencies();


calculateExchange();
