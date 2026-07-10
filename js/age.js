/* ==================================================
   EveryCalc - age.js
================================================== */


let activeInput = null;
let activeArea = null;

let viewYear;
let viewMonth;



const birthInput =
document.getElementById("birthDate");


const targetInput =
document.getElementById("targetDate");


const birthButton =
document.getElementById("birthCalendarButton");


const targetButton =
document.getElementById("targetCalendarButton");


const birthArea =
document.getElementById("birthCalendarArea");


const targetArea =
document.getElementById("targetCalendarArea");


const calculateButton =
document.getElementById("calculate");


const result =
document.getElementById("result");





/* ==========================
   Default Today
========================== */


const today = new Date();


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
+
"-"
+
value.substring(4);

}



if(value.length>=8){

value =
value.substring(0,7)
+
"-"
+
value.substring(7);

}



input.value=value;


});


}



formatDateInput(birthInput);
formatDateInput(targetInput);








/* ==========================
   Calendar Open
========================== */


birthButton.onclick=function(){


openCalendar(
birthInput,
birthArea
);


};




targetButton.onclick=function(){


openCalendar(
targetInput,
targetArea
);


};







function openCalendar(input,area){


closeCalendar();


activeInput=input;
activeArea=area;


const date =
parseDate(input.value)
||
new Date();



viewYear=date.getFullYear();
viewMonth=date.getMonth();



renderYearSelect();


}






function closeCalendar(){


birthArea.innerHTML="";
targetArea.innerHTML="";


}









/* ==========================
   Year Select
========================== */


function renderYearSelect(){


activeArea.innerHTML="";


const box =
document.createElement("div");


box.className="calendar";



box.innerHTML=`


<div class="calendar-header">

<strong>
년도 선택
</strong>

</div>


<div class="year-scroll">


<div class="calendar-grid">


${createYears()}


</div>


</div>


`;



activeArea.appendChild(box);





box.querySelectorAll(".year-select")
.forEach(item=>{


item.onclick=function(){


viewYear =
Number(item.textContent);



renderMonthSelect();


};


});



}





function createYears(){


let html="";


const current =
new Date().getFullYear();



for(
let year=current;
year>=current-100;
year--
){


html+=`

<div class="calendar-day year-select">

${year}

</div>

`;


}


return html;


}









/* ==========================
   Month Select
========================== */


function renderMonthSelect(){


activeArea.innerHTML="";


const box =
document.createElement("div");


box.className="calendar";



box.innerHTML=`


<div class="calendar-header">

<strong>
${viewYear}년 월 선택
</strong>

</div>



<div class="calendar-grid">


${Array.from(
{length:12},
(_,i)=>`

<div class="calendar-day month-select">

${i+1}월

</div>

`
).join("")}


</div>


`;



activeArea.appendChild(box);





box.querySelectorAll(".month-select")
.forEach(item=>{


item.onclick=function(){


viewMonth =
Number(
item.textContent.replace("월","")
)
-1;



renderCalendar(
viewYear,
viewMonth
);



};


});


}
/* ==========================
   Calendar Render
========================== */


function renderCalendar(year,month){


activeArea.innerHTML="";


const calendar =
document.createElement("div");


calendar.className="calendar";



calendar.innerHTML=`


<div class="calendar-header">


<button class="prev">
◀
</button>


<strong>
${year}년 ${month+1}월
</strong>


<button class="next">
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



const first =
new Date(year,month,1).getDay();



const last =
new Date(year,month+1,0).getDate();






for(let i=0;i<first;i++){


grid.appendChild(
document.createElement("div")
);


}







for(let day=1;day<=last;day++){


const cell =
document.createElement("div");


cell.className="calendar-day";


cell.textContent=day;



const week =
new Date(
year,
month,
day
).getDay();



if(week===0){

cell.classList.add("sunday");

}


if(week===6){

cell.classList.add("saturday");

}




cell.onclick=function(){


activeInput.value =
`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;



closeCalendar();


};



grid.appendChild(cell);



}





activeArea.appendChild(calendar);







calendar.querySelector(".prev")
.onclick=function(){


viewMonth--;


if(viewMonth<0){


viewMonth=11;
viewYear--;


}



renderCalendar(
viewYear,
viewMonth
);


};







calendar.querySelector(".next")
.onclick=function(){


viewMonth++;


if(viewMonth>11){


viewMonth=0;
viewYear++;


}



renderCalendar(
viewYear,
viewMonth
);


};


}









/* ==========================
   Parse Date
========================== */


function parseDate(value){


const parts =
value.split("-");



if(parts.length!==3){

return null;

}




const year =
Number(parts[0]);


const month =
Number(parts[1])-1;


const day =
Number(parts[2]);



const date =
new Date(
year,
month,
day
);



if(
date.getFullYear()!==year ||
date.getMonth()!==month ||
date.getDate()!==day
){

return null;

}



return date;


}

function isLeapYear(year){

return (
year%4===0 &&
year%100!==0
)
||
year%400===0;

}




/* ==========================
   Calculate
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


let birthday;


if(
birth.getMonth()===1 &&
birth.getDate()===29 &&
!isLeapYear(target.getFullYear())
){

birthday =
new Date(
target.getFullYear(),
1,
28
);

}else{


birthday =
new Date(
target.getFullYear(),
birth.getMonth(),
birth.getDate()
);


}



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


if(nextBirthday < target){

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



const livedDays =
Math.floor(
(target-birth)
/
(1000*60*60*24)
);



const livedMonths =
(
(target.getFullYear()-birth.getFullYear())*12
+
(target.getMonth()-birth.getMonth())
);



result.innerHTML=`


<h2>
만 나이 ${age}세
</h2>


<p>
세는 나이 ${koreanAge}세
</p>


<p>
🎂 다음 생일까지 D-${remain}일
</p>


<p>
태어난 후 ${livedDays.toLocaleString()}일 경과
</p>


<p>
총 ${livedMonths}개월 경과
</p>


`;



};
