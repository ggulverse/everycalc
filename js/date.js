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



startButton.addEventListener(
    "click",
    function(){

        activeInput =
        document.getElementById("startDate");

        showCalendar();

    }
);



endButton.addEventListener(
    "click",
    function(){

        activeInput =
        document.getElementById("endDate");

        showCalendar();

    }
);





function showCalendar(){


    renderCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );


}






function renderCalendar(year, month){


    calendarArea.innerHTML = "";



    const calendar =
    document.createElement("div");

    calendar.className =
    "calendar";



    const firstDay =
    new Date(
        year,
        month,
        1
    );



    const lastDate =
    new Date(
        year,
        month + 1,
        0
    ).getDate();




    calendar.innerHTML =

    `
    <div class="calendar-header">

        <button id="prevMonth">
        ◀
        </button>

        <div class="calendar-title">
        ${year}년 ${month + 1}월
        </div>

        <button id="nextMonth">
        ▶
        </button>

    </div>


    <div class="calendar-grid">

        <div class="calendar-week">
        일
        </div>

        <div class="calendar-week">
        월
        </div>

        <div class="calendar-week">
        화
        </div>

        <div class="calendar-week">
        수
        </div>

        <div class="calendar-week">
        목
        </div>

        <div class="calendar-week">
        금
        </div>

        <div class="calendar-week">
        토
        </div>

    </div>
    `;



    const grid =
    calendar.querySelector(".calendar-grid");



    for(
        let i = 0;
        i < firstDay.getDay();
        i++
    ){

        const blank =
        document.createElement("div");

        grid.appendChild(blank);

    }



    for(
        let day = 1;
        day <= lastDate;
        day++
    ){


        const dayButton =
        document.createElement("div");


        dayButton.className =
        "calendar-day";


        dayButton.textContent =
        day;



        dayButton.addEventListener(
            "click",
            function(){


                const selectedMonth =
                String(month + 1)
                .padStart(2,"0");


                const selectedDay =
                String(day)
                .padStart(2,"0");



                activeInput.value =

                `${year}-${selectedMonth}-${selectedDay}`;



                calendarArea.innerHTML = "";


            }
        );



        grid.appendChild(dayButton);


    }



    calendarArea.appendChild(calendar);




    document
    .getElementById("prevMonth")
    .onclick = function(){


        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };



    document
    .getElementById("nextMonth")
    .onclick = function(){


        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };


}
