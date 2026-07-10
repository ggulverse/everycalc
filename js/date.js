/* ==================================================
   EveryCalc - date.js
================================================== */


let currentDate = new Date();

let activeInput = null;
let activePopup = null;



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
   Calendar Control
========================== */


function closeCalendar(){


    calendarArea.innerHTML="";


}




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


function renderCalendar(year,month){


    calendarArea.innerHTML="";



    const calendar =
    document.createElement("div");


    calendar.className =
    "calendar";



    calendar.innerHTML = `


    <div class="calendar-header">


        <button class="prev-month">
        ◀
        </button>


        <div>
        ${year}년 ${month+1}월
        </div>


        <button class="next-month">
        ▶
        </button>


    </div>



    <div class="calendar-grid">

        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>

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
        month+1,
        0
    ).getDate();





    for(let i=0;i<firstDay;i++){


        grid.appendChild(
            document.createElement("div")
        );


    }





    for(
        let day=1;
        day<=lastDate;
        day++
    ){


        const dayBox =
        document.createElement("div");


        dayBox.className =
        "calendar-day";



        const weekDay =
        new Date(
            year,
            month,
            day
        ).getDay();



        if(weekDay===0){

            dayBox.classList.add(
                "sunday"
            );

        }



        if(weekDay===6){

            dayBox.classList.add(
                "saturday"
            );

        }



        dayBox.textContent =
        day;




        dayBox.onclick=function(){


            activeInput.value =

            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;



            closeCalendar();


        };



        grid.appendChild(dayBox);


    }




    calendarArea.appendChild(calendar);






    calendar
    .querySelector(".prev-month")
    .onclick=function(){


        currentDate.setMonth(
            currentDate.getMonth()-1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };





    calendar
    .querySelector(".next-month")
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



    if(parts.length!==3){

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

        date.getFullYear()!==year ||
        date.getMonth()!==month-1 ||
        date.getDate()!==day

    ){

        return null;

    }



    return date;


}







/* ==========================
   Calculate
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
        "날짜 형식을 확인해주세요.";


        return;

    }




    const diff =

    Math.floor(
        (end-start)
        /
        (1000*60*60*24)
    );




    if(diff<0){


        result.innerHTML =
        "종료 날짜가 시작 날짜보다 빠릅니다.";


        return;

    }





    result.innerHTML = `


    <h2>
    D-${diff}
    </h2>


    <p>
    ${endInput.value} 까지
    </p>


    <p>
    총 <strong>${diff}일</strong> 남았습니다.
    </p>


    `;



    showResultCalendar(end);


};








/* ==========================
   Result Calendar
========================== */


function showResultCalendar(date){


    const area =
    document.getElementById("resultCalendar");


    if(!area){

        return;

    }


    area.innerHTML="";


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



    calendar.innerHTML = `

    <h3>
    ${year}년 ${month+1}월 D-Day
    </h3>


    <div class="calendar-grid">

    <div>일</div>
    <div>월</div>
    <div>화</div>
    <div>수</div>
    <div>목</div>
    <div>금</div>
    <div>토</div>

    </div>

    `;



    const grid =
    calendar.querySelector(".calendar-grid");



    const firstDay =
    new Date(year,month,1).getDay();


    const lastDate =
    new Date(year,month+1,0).getDate();




    for(let i=0;i<firstDay;i++){

        grid.appendChild(
            document.createElement("div")
        );

    }




    for(
        let day=1;
        day<=lastDate;
        day++
    ){


        const box =
        document.createElement("div");


        box.className =
        "calendar-day";



        const weekDay =
        new Date(
            year,
            month,
            day
        ).getDay();



        if(weekDay===0){

            box.classList.add("sunday");

        }


        if(weekDay===6){

            box.classList.add("saturday");

        }



        if(day===targetDay){

            box.classList.add("dday");

        }



        box.textContent =
        day;



        grid.appendChild(box);


    }



    area.appendChild(calendar);


}
