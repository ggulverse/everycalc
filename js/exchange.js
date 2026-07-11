/* ==================================================
   EveryCalc - exchange.js
   Currency Exchange Calculator
================================================== */



const amountInput =
document.getElementById("amount");


const fromOptions =
document.getElementById("fromOptions");


const toOptions =
document.getElementById("toOptions");


const fromText =
document.getElementById("fromText");


const toText =
document.getElementById("toText");


const fromIcon =
document.getElementById("fromIcon");


const toIcon =
document.getElementById("toIcon");


const calculateButton =
document.getElementById("calculate");


const swapButton =
document.getElementById("swapBtn");


const result =
document.getElementById("result");


const exchangeInfo =
document.getElementById("exchangeInfo");





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




    const expire =
    10 * 60 * 1000;




    if(
        Date.now()
        -
        parsed.time
        >
        expire
    ){


        localStorage.removeItem(key);


        return null;


    }



    return parsed.data;



}








/* ==========================
   Currency Menu
========================== */


function createCurrencyMenu(target){



    target.innerHTML = "";




    const groups = {};





    currencies.forEach(currency => {



        if(!groups[currency.group]){


            groups[currency.group] = [];


        }



        groups[currency.group]
        .push(currency);



    });







    Object.keys(groups)
    .forEach(group => {



        const wrapper =
        document.createElement("div");



        const title =
        document.createElement("div");



        title.textContent =
        group;



        title.style.fontWeight =
        "bold";



        title.style.padding =
        "10px";



        wrapper.appendChild(title);







        groups[group]
        .forEach(currency => {



            const item =
            document.createElement("div");



            item.className =
            "currency-option";



            item.innerHTML = `

                <span>
                ${currency.flag}
                ${currency.code}
                ${currency.name}
                </span>

            `;








            item.onclick = function(){





                if(target === fromOptions){



                    selectedFrom =
                    currency.code;



                    fromIcon.textContent =
                    currency.flag;



                    fromText.textContent =
                    `${currency.code} ${currency.name}`;



                }

                else{



                    selectedTo =
                    currency.code;



                    toIcon.textContent =
                    currency.flag;



                    toText.textContent =
                    `${currency.code} ${currency.name}`;



                }






                target.style.display =
                "none";



                calculateExchange();



            };







            wrapper.appendChild(item);



        });







        target.appendChild(wrapper);



    });





}
/* ==========================
   Frankfurter API
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








function makeRates(data){



    const rates = {


        EUR:1


    };





    data.forEach(item => {



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





        if(
            !amount
            ||
            amount <= 0
        ){


            result.innerHTML =
            "금액을 입력하세요.";


            return;


        }







        const data =
        await getRates();







        const rates =
        makeRates(data);








        if(
            !rates[selectedFrom]
            ||
            !rates[selectedTo]
        ){



            result.innerHTML =

            "지원하지 않는 통화입니다.";


            return;


        }








        const euroValue =

        amount
        /
        rates[selectedFrom];







        const converted =

        euroValue
        *
        rates[selectedTo];







        result.innerHTML = `



        <h2>

        ${amount.toLocaleString()}

        ${selectedFrom}

        =

        ${converted.toLocaleString(
            undefined,
            {
                maximumFractionDigits:2
            }
        )}

        ${selectedTo}


        </h2>



        `;








        exchangeInfo.innerHTML = `



        <p>

        기준 환율:
        Frankfurter API

        </p>



        <p>

        마지막 업데이트:

        ${new Date()
        .toLocaleString()}

        </p>



        `;




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


function swapCurrency(){



    const temp =
    selectedFrom;



    selectedFrom =
    selectedTo;



    selectedTo =
    temp;






    const tempText =
    fromText.textContent;



    fromText.textContent =
    toText.textContent;



    toText.textContent =
    tempText;






    const tempIcon =
    fromIcon.textContent;



    fromIcon.textContent =
    toIcon.textContent;



    toIcon.textContent =
    tempIcon;





    calculateExchange();



}








/* ==========================
   Events
========================== */



fromOptions
.previousElementSibling
.onclick = function(){



    fromOptions.style.display =

    fromOptions.style.display === "block"

    ?

    "none"

    :

    "block";



};







toOptions
.previousElementSibling
.onclick = function(){



    toOptions.style.display =

    toOptions.style.display === "block"

    ?

    "none"

    :

    "block";



};







calculateButton.onclick =

calculateExchange;







if(swapButton){



    swapButton.onclick =

    swapCurrency;



}








/* ==========================
   Start
========================== */



createCurrencyMenu(fromOptions);


createCurrencyMenu(toOptions);





fromText.textContent =

"USD 미국 달러";



toText.textContent =

"KRW 대한민국 원";





fromIcon.textContent =

"🇺🇸";



toIcon.textContent =

"🇰🇷";






calculateExchange();
