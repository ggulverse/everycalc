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


const startInput =
document.getElementById("startDate");


const endInput =
document.getElementById("endDate");





/* ==========================
   Input Format
========================== */


function formatDateInput(input){


    input.addEventListener(
        "input",
        function(){


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


        }
    );

}



formatDateInput(startInput);

formatDateInput(endInput);






/* ==========================
   Calendar Open
========================== */


startButton.onclick=function(){


    activeInput=startInput;


    openCalendar();


};



endButton.onclick=function(){


    activeInput=endInput;


    openCalendar();


};





function openCalendar(){


    renderCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );


}

/* ==========================
   Calendar Render
========================== */


function renderCalendar(year, month){


    calendarArea.innerHTML="";



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
        ${year}년 ${month + 1}월
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
    new Date(
        year,
        month,
        1
    ).getDay();



    const lastDate =
    new Date(
        year,
        month + 1,
        0
    ).getDate();




    for(
        let i=0;
        i<firstDay;
        i++
    ){

        grid.appendChild(
            document.createElement("div")
        );

    }




    for(
        let day=1;
        day<=lastDate;
        day++
    ){


        const dayElement =
        document.createElement("div");



        dayElement.className =
        "calendar-day";



        dayElement.textContent =
        day;



        dayElement.onclick=function(){


            const value =

            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;



            activeInput.value =
            value;



            calendarArea.innerHTML="";


        };



        grid.appendChild(dayElement);


    }




    calendarArea.appendChild(calendar);





    document
    .getElementById("prevMonth")
    .onclick=function(){


        currentDate.setMonth(
            currentDate.getMonth()-1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };





    document
    .getElementById("nextMonth")
    .onclick=function(){


        currentDate.setMonth(
            currentDate.getMonth()+1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };


}

/* ==========================
   Date Validation
========================== */


function parseDate(value){


    if(!value){

        return null;

    }



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
        month - 1,
        day
    );



    // 잘못된 날짜 검사
    if(

        date.getFullYear() !== year ||

        date.getMonth() !== month - 1 ||

        date.getDate() !== day

    ){

        return null;

    }



    return date;


}






/* ==========================
   Date Calculate
========================== */


calculateButton.onclick=function(){



    const start =
    parseDate(
        startInput.value
    );



    const end =
    parseDate(
        endInput.value
    );



    const result =
    document.getElementById("result");





    if(!start || !end){


        result.innerHTML =

        `날짜 형식을 확인해주세요.<br>
        예: 2026-07-10`;


        return;

    }





    const oneDay =
    1000 * 60 * 60 * 24;



    const diff =
    Math.floor(
        (end - start) / oneDay
    );





    if(diff < 0){


        result.innerHTML =

        "종료 날짜가 시작 날짜보다 빠릅니다.";


        return;

    }






    result.innerHTML =

    `

    <h2>
    D-${diff}
    </h2>


    <p>

    시작일:
    ${startInput.value}

    <br>

    종료일:
    ${endInput.value}

    </p>


    <p>

    총
    <strong>${diff}일</strong>
    남았습니다.

    </p>

    `;
   
   showResultCalendar(end);



};

function showResultCalendar(date){


    const area =
    document.getElementById("resultCalendar");


    if(!area){

        return;

    }



    area.innerHTML = "";



    const year =
    date.getFullYear();


    const month =
    date.getMonth();


    const targetDay =
    date.getDate();





    const calendar =
    document.createElement("div");


    calendar.className =
    "calendar result-calendar";



    calendar.innerHTML =

    `

    <h3>
    ${year}년 ${month+1}월 D-Day
    </h3>


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
    new Date(
        year,
        month,
        1
    ).getDay();



    const lastDate =
    new Date(
        year,
        month + 1,
        0
    ).getDate();





    // 시작 요일 빈칸

    for(
        let i=0;
        i<firstDay;
        i++
    ){

        grid.appendChild(
            document.createElement("div")
        );

    }






    // 날짜 생성

    for(
        let day=1;
        day<=lastDate;
        day++
    ){


        const dayBox =
        document.createElement("div");


        dayBox.className =
        "calendar-day";



        dayBox.textContent =
        day;



        if(day === targetDay){


            dayBox.classList.add(
                "dday"
            );


            dayBox.title =
            "D-Day";


        }



        grid.appendChild(dayBox);


    }




    area.appendChild(calendar);


}
