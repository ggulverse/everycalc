/* ==================================================
   EveryCalc 2.0
   theme.js
================================================== */


const themeButton = document.getElementById("themeButton");



/* =========================
   저장된 테마 확인
========================= */


const savedTheme = localStorage.getItem("everycalc-theme");



if(savedTheme === "dark"){

    document.body.classList.add("dark");

    if(themeButton){

        themeButton.textContent = "☀️";

    }

}




/* =========================
   시스템 테마 확인
========================= */


if(!savedTheme){

    const systemDark =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;



    if(systemDark){

        document.body.classList.add("dark");


        if(themeButton){

            themeButton.textContent="☀️";

        }

    }

}




/* =========================
   버튼 이벤트
========================= */


if(themeButton){


    themeButton.addEventListener(
        "click",
        ()=>{


            document.body.classList.toggle("dark");



            const isDark =
            document.body.classList.contains("dark");



            if(isDark){


                localStorage.setItem(
                    "everycalc-theme",
                    "dark"
                );


                themeButton.textContent="☀️";


            }else{


                localStorage.setItem(
                    "everycalc-theme",
                    "light"
                );


                themeButton.textContent="🌙";


            }


        }
    );


}
