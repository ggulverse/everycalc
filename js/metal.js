/* ==================================================
   EveryCalc 2.0
   Precious Metals Calculator
================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


const metalSelect =
document.getElementById("metalSelect");


const currencySelect =
document.getElementById("currencySelect");


const unitSelect =
document.getElementById("unitSelect");


const amountInput =
document.getElementById("amount");


const calculateBtn =
document.getElementById("calculate");


const result =
document.getElementById("result");


const metalInfo =
document.getElementById("metalInfo");


const chartCanvas =
document.getElementById("metalChart");


let metalChart = null;
let selectedPeriod = 7;



const OZ_TO_GRAM = 31.1035;

const DON_TO_GRAM = 3.75;




/* =========================
   Metal Name
========================= */


function getMetalName(){


return metalSelect.options[
metalSelect.selectedIndex
].text;


}






/* =========================
   API Rate
========================= */


async function getMetalRate(){


const metal =
metalSelect.value;


const currency =
currencySelect.value;



const response =
await fetch(

`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}`

);



if(!response.ok){

throw new Error(
"귀금속 시세 정보를 불러올 수 없습니다."
);

}



const data =
await response.json();



const target =
data.find(

item =>
item.quote === currency

);



if(!target){

throw new Error(
"시세 데이터를 찾을 수 없습니다."
);

}



return target.rate;


}

/* =========================
   Unit Convert
========================= */


function convertUnit(
price,
unit
){


if(unit === "oz"){

return price;

}



if(unit === "g"){

return price / OZ_TO_GRAM;

}



if(unit === "don"){

return (

price / OZ_TO_GRAM

)

*

DON_TO_GRAM;

}



return price;


}







/* =========================
   Calculate
========================= */


async function calculate(){


try{


const amount =

Number(
amountInput.value
);




if(isNaN(amount) || amount <= 0){


throw new Error(
"수량을 입력하세요."
);


}





const rate =

await getMetalRate();





const unitPrice =

convertUnit(

rate,

unitSelect.value

);





const total =

unitPrice * amount;





result.innerHTML =


`

<span>

${amount.toLocaleString()}

${unitSelect.value}

</span>


<strong>

${total.toLocaleString(

undefined,

{

maximumFractionDigits:2

}

)}

${currencySelect.value}

</strong>

`;






metalInfo.innerHTML =


`

<h3>

${getMetalName()}

국제 시세

</h3>



<p>

1 트로이온스(oz)

=

${rate.toLocaleString(

undefined,

{

maximumFractionDigits:2

}

)}

${currencySelect.value}

</p>



<p>

환산 기준

<br>

1 oz = 31.1035g

<br>

1 돈 = 3.75g

</p>

`;





loadHistory();



}


catch(error){


result.innerText =

error.message;


}



}

/* =========================
   Load History
========================= */


async function loadHistory(){


try{


const metal =

metalSelect.value;



const currency =

currencySelect.value;



const requestDays = selectedPeriod;

const today =

new Date();



const end =

today.toISOString()
.split("T")[0];




const startDate =

new Date();



startDate.setDate(

today.getDate() - requestDays

);




const start =

startDate.toISOString()
.split("T")[0];






const response =

await fetch(


`https://api.frankfurter.dev/v2/rates?base=${metal}&quotes=${currency}&from=${start}&to=${end}`


);





const data =

await response.json();

console.log(
    data[0].date,
    data[data.length - 1].date
);

let chartData = data;


if(selectedPeriod === 365){

    chartData =
    data.filter(item=>{

        return item.date.endsWith("-01");

    });

}


drawChart(chartData);


}


catch(error){


console.log(error);


}



}








/* =========================
   Draw Chart
========================= */


function drawChart(data){

    if(metalChart){

        metalChart.destroy();

    }

    const labels =
    data.map(item=>{

        if(selectedPeriod === 365){

            return item.date.substring(0,7);

        }

        return item.date;

    });

    const values =
    data.map(
        item=>Number(item.rate)
    );

    const chartTextColor =
    document.body.classList.contains("dark-mode")
    ?
    "#ffffff"
    :
    "#222222";

    metalChart =
    new Chart(
        chartCanvas.getContext("2d"),
        {

            type:"line",

            data:{

                labels:labels,

                datasets:[{

                    label:
                    selectedPeriod === 7
                    ?
                    "7일 귀금속"
                    :
                    selectedPeriod === 30
                    ?
                    "1개월 귀금속"
                    :
                    "1년 귀금속",

                    data:values,

                    fill:false,

                    tension:0,

                    borderWidth:2,

                    pointRadius:3,

                    pointHoverRadius:5,

                    pointHitRadius:10

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                interaction:{

                    mode:"index",

                    intersect:false

                },

                plugins:{

                    legend:{
                        display:false
                    },

                    tooltip:{
                        callbacks:{
                            label:function(context){

                                return context.raw.toLocaleString()
                                + " "
                                + currencySelect.value;

                            }
                        }
                    }

                },

                scales:{

                    x:{

    ticks:{

        color:chartTextColor,

        autoSkip:true,

        maxTicksLimit:

        selectedPeriod === 365
        ?
        12
        :
        selectedPeriod === 30
        ?
        10
        :
        7

    },

    grid:{

        color:chartTextColor + "33"

    }

},

                    y:{

                        ticks:{

                            color:chartTextColor,

                            callback:function(value){

                                return value.toLocaleString();

                            }

                        },

                        grid:{

                            color:chartTextColor + "33"

                        }

                    }

                }

            }

        }

    );

}

/* =========================
   Events
========================= */


calculateBtn.addEventListener(

"click",

calculate

);






metalSelect.addEventListener(

"change",

()=>{


loadHistory();


}

);






currencySelect.addEventListener(

"change",

()=>{


updateChartUnit();


loadHistory();


}

);

document
.querySelectorAll(".period-button")
.forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        document
        .querySelectorAll(".period-button")
        .forEach(btn=>{

            btn.classList.remove("active");

        });


        button.classList.add("active");


        selectedPeriod =
        Number(
            button.dataset.period
        );


        loadHistory();


    });

});



/* =========================
   Chart Unit
========================= */


function updateChartUnit(){


const unit =

document.getElementById(
"metalChartUnit"
);



if(unit){


unit.innerText =


`1 트로이온스(oz)당 ${currencySelect.value}`;


}



}








/* =========================
   Dark Mode Update
========================= */


window.updateMetalChart = function(){

    if(metalChart){

        metalChart.destroy();

        metalChart = null;

    }

    loadHistory();

};

/* =========================
   Initial Load
========================= */


updateChartUnit();


loadHistory();



});
