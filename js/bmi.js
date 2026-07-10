/* ==================================================
   EveryCalc - bmi.js
================================================== */


const calculateButton =
document.getElementById("calculate");


calculateButton.addEventListener(
    "click",
    function(){


        const height =
        Number(document.getElementById("height").value);


        const weight =
        Number(document.getElementById("weight").value);



        if(!height || !weight){

            document.getElementById("result").innerHTML =
            "키와 몸무게를 입력해주세요.";

            return;

        }



        const heightMeter =
        height / 100;



        const bmi =
        weight / (heightMeter * heightMeter);



        let category = "";



        if(bmi < 18.5){

            category = "저체중";

        }
        else if(bmi < 25){

            category = "정상";

        }
        else if(bmi < 30){

            category = "과체중";

        }
        else{

            category = "비만";

        }



        document.getElementById("result").innerHTML =

        `
        BMI : ${bmi.toFixed(1)}<br><br>

        판정 : ${category}
        `;


    }
);
