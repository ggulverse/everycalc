/* ==================================================
   EveryCalc - date.js
================================================== */


const calculateButton =
document.getElementById("calculate");


calculateButton.addEventListener(
    "click",
    function(){


        const startInput =
        document.getElementById("startDate").value;


        const endInput =
        document.getElementById("endDate").value;


        const result =
        document.getElementById("result");



        if(!startInput || !endInput){

            result.innerHTML =
            "시작 날짜와 종료 날짜를 모두 선택해주세요.";

            return;

        }



        const startDate =
        new Date(
            startInput + "T00:00:00"
        );


        const endDate =
        new Date(
            endInput + "T00:00:00"
        );



        const oneDay =
        1000 * 60 * 60 * 24;



        const difference =
        Math.round(
            (endDate - startDate) / oneDay
        );



        if(difference > 0){

            result.innerHTML =

            `
            두 날짜 사이<br><br>

            <strong>${difference}일</strong>

            <br><br>

            시작일 기준 종료일까지 ${difference}일 남았습니다.
            `;

        }
        else if(difference < 0){


            result.innerHTML =

            `
            날짜 순서를 확인해주세요.
            <br><br>

            종료 날짜가 시작 날짜보다 이전입니다.
            `;


        }
        else{


            result.innerHTML =

            `
            두 날짜는 같은 날짜입니다.
            `;


        }


    }
);
