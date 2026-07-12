/* ==================================================
   EveryCalc 2.0
   app.js
================================================== */


/*
    공통 애플리케이션 관리 파일

    현재:
    - 초기 실행 관리

    추후:
    - 즐겨찾기
    - 최근 사용 계산기
    - 사용자 설정
    - 계산기 추천 기능

    확장 예정
*/





document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        console.log(
            "EveryCalc loaded"
        );



        initializeApp();



    }
);






/* =========================
   APP INITIALIZE
========================= */


function initializeApp(){



    setupCardAnimation();



}






/* =========================
   CARD MOTION
========================= */


function setupCardAnimation(){



    const cards =
    document.querySelectorAll(
        ".calculator-card, .category-item"
    );



    cards.forEach(card=>{


        card.addEventListener(
            "touchstart",
            ()=>{


                card.style.transform =
                "scale(.97)";


            },
            {
                passive:true
            }
        );




        card.addEventListener(
            "touchend",
            ()=>{


                card.style.transform =
                "";


            },
            {
                passive:true
            }
        );



    });



}
