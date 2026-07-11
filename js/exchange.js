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
   Currency API
========================== */


async function getExchangeRates(){


    const response =
    await fetch(
        "https://api.frankfurter.app/latest?from=EUR"
    );


    const data =
    await response.json();


    return data;


}





/* ==========================
   Calculate Exchange
========================== */


async function calculateExchange(){


    const amount =
    Number(amountInput.value);



    if(!amount || amount <= 0){


        result.innerHTML =
        "금액을 입력해주세요.";


        return;


    }



    try{


        const data =
        await getExchangeRates();



        const rates =
        data.rates;



        const baseDate =
        data.date;



        /*
            Frankfurter는 EUR 기준 제공

            EUR = 1
            다른 통화 = rates 값

        */


        const from =
        fromCurrency.value;


        const to =
        toCurrency.value;



        let resultValue;



        if(from === "EUR"){


            resultValue =
            amount * rates[to];


        }


        else if(to === "EUR"){


            resultValue =
            amount / rates[from];


        }


        else{


            const euroValue =
            amount / rates[from];


            resultValue =
            euroValue * rates[to];


        }





        result.innerHTML = `


        <h2>

        ${amount.toLocaleString()}
        ${from}

        =

        ${resultValue.toLocaleString(
            undefined,
            {
                maximumFractionDigits:2
            }
        )}

        ${to}

        </h2>


        `;




        let oneRate;



        if(from === "EUR"){


            oneRate =
            rates[to];


        }

        else if(to === "EUR"){


            oneRate =
            1 / rates[from];


        }

        else{


            oneRate =
            rates[to] / rates[from];


        }




        exchangeInfo.innerHTML = `


        <p>

        적용 환율

        <br>

        1 ${from}

        =

        ${oneRate.toLocaleString(
            undefined,
            {
                maximumFractionDigits:6
            }
        )}

        ${to}

        </p>



        <p>

        환율 기준일

        <br>

        ${baseDate}

        </p>



        <p>

        데이터 출처

        <br>

        유럽중앙은행(ECB) 기준 공개 환율 데이터

        </p>


        `;



    }


    catch(error){


        result.innerHTML =
        "환율 데이터를 불러오지 못했습니다.";


        exchangeInfo.innerHTML =
        "잠시 후 다시 시도해주세요.";


        console.error(error);


    }



}






/* ==========================
   Button
========================== */


calculateButton.onclick =
calculateExchange;






/* ==========================
   Initial
========================== */


calculateExchange();
