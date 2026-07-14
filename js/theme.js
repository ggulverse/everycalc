/* ==================================================
   EveryCalc - theme.js
================================================== */


const darkModeToggle =
document.getElementById("darkModeToggle");

// 다크모드 아이콘 업데이트

function updateDarkModeIcon(){

    if(
        document.body.classList.contains("dark-mode")
    ){

        darkModeToggle.textContent = "☀️";

    }

    else{

        darkModeToggle.textContent = "🌙";

    }

}

// 저장된 테마 확인

const savedTheme =
localStorage.getItem("theme");


if(savedTheme === "dark"){

    document.body.classList.add("dark-mode");

}



// 차트 업데이트 연결용

function refreshCharts(){

    if(window.updateCharts){

        window.updateCharts();

    }


    if(window.updateMetalChart){

        window.updateMetalChart();
    }

}


window.refreshCharts =
refreshCharts;




// 버튼 클릭

darkModeToggle.addEventListener(
    "click",
    function(){


        document.body.classList.toggle(
            "dark-mode"
        );



        if(
            document.body.classList.contains("dark-mode")
        ){

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

        else{

            localStorage.setItem(
                "theme",
                "light"
            );

        }



        refreshCharts();



    }
);
