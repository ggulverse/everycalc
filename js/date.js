/* ==================================================
   EveryCalc - date.js
================================================== */


let currentDate = new Date();

let activeInput = null;


const calendarArea =
document.getElementById("calendarArea");


const startButton =
document.getElementById("startCalendarButton");


const endButton =
document.getElementById("endCalendarButton");


const calculateButton =
document.getElementById("calculate");





/* ================================
   Calendar Open
================================ */


startButton.onclick = function(){

    activeInput =
    document.getElementById("startDate");

    showCalendar();

};



endButton.onclick = function(){

    activeInput =
    document.getElementById("endDate");

    showCalendar();

};





function showCalendar(){

    renderCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

}






/* ================================
   Calendar Render
================================ */


function renderCalendar(year, month){


    calendarArea.innerHTML = "";


    const calendar =
    document.createElement("div");


    calendar.className =
    "calendar";



    calendar.innerHTML = `

    <div class="calendar-header">

        <button id="prevMonth">
        ◀
        </button>

        <div class="calendar-title">
        ${year}년 ${month+1}월
        </div>

        <button id="nextMonth">
        ▶
        </button>

    </div>


    <div class="calendar-grid">

        <div class="calendar-week">일</div>
        <div class="calendar-week">월</div>
        <div class="calendar-week">화</div>
        <div class="calendar-week">수</div>
        <div class="calendar-week">목</div>
        <div class="calendar-week">금</div>
        <div class="calendar-week">토</div>

    </div>

    `;



    const grid =
    calendar.querySelector(".calendar-grid");



    const firstDay =
    new Date(year, month, 1)
    .getDay();



    const lastDay =
    new Date(year, month+1, 0)
    .getDate();



    for(let i=0;i<firstDay;i++){

        grid.appendChild(
            document.createElement("div")
        );

    }



    for(let day=1;day<=lastDay;day++){


        const button =
        document.createElement("div");


        button.className =
        "calendar-day";


        button.textContent =
        day;



        button.onclick = function(){


            activeInput.value =

            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


            calendarArea.innerHTML="";

        };



        grid.appendChild(button);

    }



    calendarArea.appendChild(calendar);





    document.getElementById("prevMonth").onclick=function(){

        currentDate.setMonth(
            currentDate.getMonth()-1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );

    };



    document.getElementById("nextMonth").onclick=function(){

        currentDate.setMonth(
            currentDate.getMonth()+1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );

    };

}





/* ================================
   Date Parse
================================ */


function parseDate(value){


    const parts =
    value.split("-");



    if(parts.length !== 3){

        return null;

    }



    const year =
    Number(parts[0]);


    const month =
    Number(parts[1]);


    const day =
    Number(parts[2]);



    const date =
    new Date(
        year,
        month-1,
        day
    );



    if(

        date.getFullYear() !== year ||

        date.getMonth() !== month-1 ||

        date.getDate() !== day

    ){

        return null;

    }



    return date;

}





/* ================================
   Calculate
================================ */


calculateButton.onclick=function(){


    const startValue =
    document.getElementById("startDate").value;


    const endValue =
    document.getElementById("endDate").value;



    const result =
    document.getElementById("result");



    const start =
    parseDate(startValue);


    const end =
    parseDate(endValue);




    if(!start || !end){


        result.innerHTML =
        "날짜 형식을 확인해주세요.<br>예: 2026-07-10";


        return;

    }



    const oneDay =
    1000*60*60*24;



    const diff =
    Math.round(
        (end-start)/oneDay
    );



    if(diff < 0){


        result.innerHTML =
        "종료 날짜가 시작 날짜보다 빠릅니다.";


        return;

    }




    result.innerHTML =

    `

    두 날짜 사이<br><br>

    <strong>${diff}일</strong>

    <br><br>

    D-${diff}

    `;


};
