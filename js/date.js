/* ==================================================
   EveryCalc - date.js
================================================== */


let currentDate = new Date();

let activeInput = null;


const calendarArea = document.getElementById("calendarArea");

const startButton = document.getElementById("startCalendarButton");

const endButton = document.getElementById("endCalendarButton");

const calculateButton = document.getElementById("calculate");

const startInput = document.getElementById("startDate");

const endInput = document.getElementById("endDate");





/* =========================
   Auto Date Format
========================= */


function autoFormatDate(input){


    input.addEventListener("input",function(){


        let value =
        input.value.replace(/[^0-9]/g,"");


        if(value.length > 8){

            value =
            value.substring(0,8);

        }


        if(value.length >= 5){

            value =
            value.substring(0,4)
            + "-"
            + value.substring(4);

        }


        if(value.length >= 8){

            value =
            value.substring(0,7)
            + "-"
            + value.substring(7);

        }


        input.value=value;


    });


}


autoFormatDate(startInput);

autoFormatDate(endInput);






/* =========================
   Calendar Button
========================= */


startButton.onclick=function(){

    activeInput=startInput;

    renderCalendar();

};



endButton.onclick=function(){

    activeInput=endInput;

    renderCalendar();

};







/* =========================
   Calendar
========================= */


function renderCalendar(){


    calendarArea.innerHTML="";


    let year=currentDate.getFullYear();

    let month=currentDate.getMonth();



    const calendar=document.createElement("div");

    calendar.className="calendar";



    calendar.innerHTML=

    `

    <div class="calendar-header">

    <button id="prevMonth">◀</button>

    <div class="calendar-title">
    ${year}년 ${month+1}월
    </div>

    <button id="nextMonth">▶</button>

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



    let start =
    new Date(year,month,1).getDay();



    let days =
    new Date(year,month+1,0).getDate();



    for(let i=0;i<start;i++){

        grid.appendChild(document.createElement("div"));

    }



    for(let d=1;d<=days;d++){


        let day=document.createElement("div");

        day.className="calendar-day";

        day.textContent=d;



        day.onclick=function(){


            activeInput.value=

            `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;


            calendarArea.innerHTML="";

        };



        grid.appendChild(day);


    }



    calendarArea.appendChild(calendar);





    document.getElementById("prevMonth").onclick=function(){

        currentDate.setMonth(currentDate.getMonth()-1);

        renderCalendar();

    };



    document.getElementById("nextMonth").onclick=function(){

        currentDate.setMonth(currentDate.getMonth()+1);

        renderCalendar();

    };


}






/* =========================
   Date Check
========================= */


function checkDate(value){


    if(!value) return null;


    let parts=value.split("-");


    if(parts.length!==3)
    return null;


    let y=Number(parts[0]);

    let m=Number(parts[1]);

    let d=Number(parts[2]);



    let date=new Date(y,m-1,d);



    if(

        date.getFullYear()!==y ||

        date.getMonth()!==m-1 ||

        date.getDate()!==d

    ){

        return null;

    }


    return date;

}







/* =========================
   Calculate
========================= */


calculateButton.onclick=function(){


    let start =
    checkDate(startInput.value);


    let end =
    checkDate(endInput.value);



    let result =
    document.getElementById("result");



    if(!start || !end){


        result.innerHTML=
        "날짜 형식을 확인해주세요.<br>예: 2026-07-10";


        return;

    }



    let diff =
    Math.floor(
        (end-start)/(1000*60*60*24)
    );



    if(diff<0){


        result.innerHTML=
        "종료 날짜가 시작 날짜보다 빠릅니다.";


        return;

    }



    result.innerHTML=

    `

    두 날짜 사이<br><br>

    <strong>${diff}일</strong>

    `;


};
