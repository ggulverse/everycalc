/* ==================================================
   EveryCalc - percent.js
================================================== */


const calculateButton =
document.getElementById("calculate");


const numberInput =
document.getElementById("number");


const percentInput =
document.getElementById("percent");


const result =
document.getElementById("result");



calculateButton.addEventListener(
    "click",
    function(){


        const number =
        Number(numberInput.value);


        const percent =
        Number(percentInput.value);



        if(
            isNaN(number) ||
            isNaN(percent)
        ){

            result.innerHTML =
            "숫자를 입력해주세요.";

            return;

        }



        const value =
        number * (percent / 100);



        const increase =
        number + value;



        const decrease =
        number - value;



        result.innerHTML = `

        <p>
        ${number}의 ${percent}% =
        <strong>${value}</strong>
        </p>


        <p>
        증가:
        <strong>${increase}</strong>
        </p>


        <p>
        감소:
        <strong>${decrease}</strong>
        </p>

        `;


    }
);
