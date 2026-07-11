/* ==================================================
   EveryCalc - exchange.js
   Custom Currency Selector Version
================================================== */


const amountInput =
document.getElementById("amount");


const calculateButton =
document.getElementById("calculate");


const result =
document.getElementById("result");


const exchangeInfo =
document.getElementById("exchangeInfo");



const fromSelector =
document.getElementById("fromSelector");


const toSelector =
document.getElementById("toSelector");


const fromOptions =
document.getElementById("fromOptions");


const toOptions =
document.getElementById("toOptions");


const fromIcon =
document.getElementById("fromIcon");


const toIcon =
document.getElementById("toIcon");


const fromText =
document.getElementById("fromText");


const toText =
document.getElementById("toText");



let fromCurrency =
"USD";


let toCurrency =
"KRW";





/* ==========================
   Currency List Create
========================== */


function createOption(currency, target){


    const item =
    document.createElement("div");


    item.className =
    "currency-option";



    item.innerHTML = `

        <img src="../images/${currency.icon}"
        alt="${currency.code}">

        <span>
        ${currency.code}
        (${currency.name})
        </span>

    `;



    item.onclick = ()=>{


        if(target==="from"){


            fromCurrency =
            currency.code;


            fromIcon.src =
            "../images/" + currency.icon;


            fromText.textContent =
            `${currency.code} (${currency.name})`;


            fromOptions.style.display =
            "none";


        }
        else{


            toCurrency =
            currency.code;


            toIcon.src =
            "../images/" + currency.icon;


            toText.textContent =
            `${currency.code} (${currency.name})`;


            toOptions.style.display =
            "none";


        }


    };



    target==="from"
    ?
    fromOptions.appendChild(item)
    :
    toOptions.appendChild(item);


}





function loadCurrencies(){



    currencies.forEach(currency=>{


        createOption(
            currency,
            "from"
        );


        createOption(
            currency,
            "to"
        );


    });



    const usd =
    currencies.find(
        c=>c.code==="USD"
    );


    const krw =
    currencies.find(
        c=>c.code==="KRW"
    );



    fromIcon.src =
    "../images/" + usd.icon;


    toIcon.src =
    "../images/" + krw.icon;


}






/* ==========================
   Selector Open
========================== */


fromSelector.onclick = ()=>{


    fromOptions.style.display =
    fromOptions.style.display==="block"
    ?
    "none"
    :
    "block";


};



toSelector.onclick = ()=>{


    toOptions.style.display =
    toOptions.style.display==="block"
    ?
    "none"
    :
    "block";


};






/* ==========================
   Get API Data
========================== */


async function getExchangeRates(){


    const response =
    await fetch(
    "https://api.frankfurter.dev/v2/rates?base=EUR"
    );


    if(!response.ok){

        throw new Error(
        "API Error"
        );

    }


    return await response.json();


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
    Number(
        amountInput.value.replace(/,/g,"")
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



    if(!rates[fromCurrency] ||
       !rates[toCurrency]){


        result.innerHTML =
        "지원하지 않는 통화입니다.";


        return;

    }



    const euroAmount =
    amount / rates[fromCurrency];



    const converted =
    euroAmount * rates[toCurrency];




    result.innerHTML = `

    <h2>
    ${amount.toLocaleString()}
    ${fromCurrency}
    =
    ${converted.toLocaleString(
        undefined,
        {
        maximumFractionDigits:2
        }
    )}
    ${toCurrency}
    </h2>

    `;




    const unitRate =
    rates[toCurrency] /
    rates[fromCurrency];




    const today =
    data[0].date;



    exchangeInfo.innerHTML = `

    <p>
    적용 환율
    <br>

    1 ${fromCurrency}
    =
    ${unitRate.toLocaleString(
        undefined,
        {
        maximumFractionDigits:6
        }
    )}
    ${toCurrency}

    </p>


    <p>
    기준일
    <br>
    ${today}
    </p>


    <p>
    데이터 출처
    <br>
    Frankfurter API
    </p>


    `;



}

catch(error){


    console.error(error);


    result.innerHTML =
    "환율 데이터를 불러오지 못했습니다.";


}



}







/* ==========================
   Number Format
========================== */


amountInput.addEventListener(
"input",
()=>{


    let value =
    amountInput.value.replace(/,/g,"");


    if(value){


        amountInput.value =
        Number(value).toLocaleString();


    }


});







calculateButton.onclick =
calculateExchange;






loadCurrencies();

calculateExchange();
