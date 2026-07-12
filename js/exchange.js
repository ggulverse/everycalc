/* ==================================================
   EveryCalc 2.0
   exchange.js
================================================== */



const amountInput =
document.getElementById("amount");


const fromCurrency =
document.getElementById("fromCurrency");


const toCurrency =
document.getElementById("toCurrency");


const calculateButton =
document.getElementById("calculateButton");


const result =
document.getElementById("result");





/* =========================
   Default Rate Storage
========================= */


let rates = {};





/* =========================
   Load Exchange Rate
========================= */


async function loadExchangeRate(){


    try{


        const response =
        await fetch(
            "https://api.frankfurter.dev/v2/rates?base=USD"
        );



        const data =
        await response.json();




        rates["USD"] = 1;



        data.forEach(item=>{


            rates[item.quote] =
            item.rate;


        });



    }
    catch(error){


        console.error(
            "환율 데이터를 불러오지 못했습니다.",
            error
        );


    }


}






/* =========================
   Currency Convert
========================= */


function calculateExchange(){



    const amount =
    Number(amountInput.value);



    if(!amount){


        result.textContent =
        "금액을 입력하세요";


        return;


    }





    const from =
    fromCurrency.value;



    const to =
    toCurrency.value;





    if(
        !rates[from]
        ||
        !rates[to]
    ){


        result.textContent =
        "환율 정보를 불러오는 중입니다";


        return;


    }
  /* =========================
   Convert Formula
========================= */


    const usdValue =

    amount / rates[from];



    const converted =

    usdValue * rates[to];





    result.textContent =

    converted.toLocaleString(
        "ko-KR",
        {
            maximumFractionDigits:2
        }
    )
    +
    " "
    +
    to;




}






/* =========================
   Button Event
========================= */


if(calculateButton){


    calculateButton.addEventListener(
        "click",
        calculateExchange
    );


}






/* =========================
   Initial Load
========================= */


loadExchangeRate();
