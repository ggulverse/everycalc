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
   Get Exchange Rate
========================== */


async function getExchangeRates(){


    const response =
    await fetch(
        "https://api.frankfurter.dev/v2/rates?base=EUR"
    );


    if(!response.ok){

        throw new Error(
            "API 응답 오류"
        );

    }


    const data =
    await response.json();


    return data;


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


        const amount =
        Number(
            amountInput.value
        );



        if(!amount || amount<=0){


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

        환율 기준

        <br>

        최신 ECB 기준 공개 환율 데이터

        </p>



        <p>

        데이터 출처

        <br>

        European Central Bank(ECB) 기준

        </p>


        `;



    }


    catch(error){


        console.error(error);


        result.innerHTML =
        "환율 데이터를 불러오지 못했습니다.";


        exchangeInfo.innerHTML =
        "환율 API 연결을 확인해주세요.";


    }


}







/* ==========================
   Button
========================== */


calculateButton.onclick =
calculateExchange;







/* ==========================
   First Load
========================== */


calculateExchange();
