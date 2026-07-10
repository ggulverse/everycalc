/* ==================================================
   EveryCalc - age.js
================================================== */


let currentDate = new Date();

let activeInput = null;



const calendarArea =
document.getElementById("calendarArea");


const birthButton =
document.getElementById("birthCalendarButton");


const targetButton =
document.getElementById("targetCalendarButton");


const birthInput =
document.getElementById("birthDate");


const targetInput =
document.getElementById("targetDate");


const calculateButton =
document.getElementById("calculate");


const result =
document.getElementById("result");





/* ==========================
   Today Default
========================== */


const today =
new Date();


targetInput.value =
`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;








/* ==========================
   Input Format
========================== */


function formatDateInput(input){


    input.addEventListener(
        "input",
        ()=>{


            let value =
            input.value.replace(/[^0-9]/g,"");


            value =
            value.substring(0,8);



            if(value.length>=5){

                value =
                value.substring(0,4)
                + "-"
                + value.substring(4);

            }


            if(value.length>=8){

                value =
                value.substring(0,7)
                + "-"
                + value.substring(7);

            }


            input.value=value;


        }
    );


}


formatDateInput(birthInput);

formatDateInput(targetInput);








/* ==========================
   Calendar Open
========================== */


birthButton.onclick=function(){

    activeInput=birthInput;

    openCalendar();

};



targetButton.onclick=function(){

    activeInput=targetInput;

    openCalendar();

};






function openCalendar(){


    renderCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );


}





function closeCalendar(){

    calendarArea.innerHTML="";

}









/* ==========================
   Calendar Render
========================== */


function renderCalendar(year,month){


    calendarArea.innerHTML="";



    const calendar =
    document.createElement("div");


    calendar.className="calendar";



    calendar.innerHTML=`


    <div class="calendar-header">


        <button class="prev-month">
        ◀
        </button>


        <strong>
        ${year}년 ${month+1}월
        </strong>


        <button class="next-month">
        ▶
        </button>


    </div>



    <div class="calendar-grid">


        <div class="sunday">
        일
        </div>

        <div>
        월
        </div>

        <div>
        화
        </div>

        <div>
        수
        </div>

        <div>
        목
        </div>

        <div>
        금
        </div>

        <div class="saturday">
        토
        </div>


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






    for(let day=1;day<=lastDate;day++){


        const box =
        document.createElement("div");


        box.className="calendar-day";



        const week =
        new Date(
            year,
            month,
            day
        ).getDay();




        if(week===0){

            box.classList.add("sunday");

        }


        if(week===6){

            box.classList.add("saturday");

        }




        box.textContent=day;



        box.onclick=function(){


            activeInput.value =
            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


            closeCalendar();


        };



        grid.appendChild(box);


    }






    calendarArea.appendChild(calendar);








    calendar.querySelector(".prev-month")
    .onclick=function(){


        currentDate.setMonth(
            currentDate.getMonth()-1
        );


        renderCalendar(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );


    };






    calendar.querySelector(".next-month")
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
   Date Parse
========================== */


function parseDate(value){


    const parts =
    value.split("-");



    if(parts.length!==3){

        return null;

    }



    return new Date(
        Number(parts[0]),
        Number(parts[1])-1,
        Number(parts[2])
    );


}









/* ==========================
   Age Calculate
========================== */


calculateButton.onclick=function(){


    const birth =
    parseDate(
        birthInput.value
    );


    const target =
    parseDate(
        targetInput.value
    );



    if(!birth || !target){


        result.innerHTML =
        "날짜 형식을 확인해주세요.";


        return;

    }




    let age =
    target.getFullYear()
    -
    birth.getFullYear();




    const birthday =
    new Date(
        target.getFullYear(),
        birth.getMonth(),
        birth.getDate()
    );



    if(target < birthday){

        age--;

    }





    const koreanAge =
    target.getFullYear()
    -
    birth.getFullYear()
    +
    1;





    const nextBirthday =
    new Date(
        target.getFullYear(),
        birth.getMonth(),
        birth.getDate()
    );



    if(nextBirthday <= target){

        nextBirthday.setFullYear(
            target.getFullYear()+1
        );

    }




    const remain =
    Math.ceil(
        (nextBirthday-target)
        /
        (1000*60*60*24)
    );






    result.innerHTML=`


    <div class="age-result-item">

        <h3>
        만 나이
        </h3>

        <div class="age-result-number">
        ${age}세
        </div>

    </div>



    <div class="age-result-item">

        <h3>
        세는 나이
        </h3>

        <div class="age-result-number">
        ${koreanAge}세
        </div>

    </div>




    <div class="age-result-item">

        <h3>
        다음 생일까지
        </h3>

        <div class="age-result-number">
        ${remain}일
        </div>

    </div>


    `;


};
