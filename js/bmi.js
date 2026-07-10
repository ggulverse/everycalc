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


        const result =
        document.getElementById("result");



        if(!height || !weight){

            result.innerHTML =
            "키와 몸무게를 모두 입력해주세요.";

            return;

        }



        const heightMeter =
        height / 100;



        const bmi =
        weight / (heightMeter * heightMeter);



        let whoCategory = "";
        let asiaCategory = "";



        // WHO 기준

        if(bmi < 18.5){

            whoCategory = "저체중";

        }
        else if(bmi < 25){

            whoCategory = "정상";

        }
        else if(bmi < 30){

            whoCategory = "과체중";

        }
        else{

            whoCategory = "비만";

        }



        // 아시아 기준

        if(bmi < 18.5){

            asiaCategory = "저체중";

        }
        else if(bmi < 23){

            asiaCategory = "정상";

        }
        else if(bmi < 25){

            asiaCategory = "위험체중";

        }
        else{

            asiaCategory = "비만 위험 증가";

        }



        result.innerHTML =

        `
        BMI : ${bmi.toFixed(1)}
        <br><br>

        WHO 기준 : ${whoCategory}
        <br>

        아시아 기준 : ${asiaCategory}

        <br><br>

        <small>
        BMI는 성인의 일반적인 체중 상태를 확인하는 지표이며,
        근육량과 체형에 따라 실제 건강 상태와 차이가 있을 수 있습니다.
        </small>
        `;


    }
);
