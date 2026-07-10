 /* ==================================================
    EveryCalc - age.js
================================================== */


const birthInput =
document.getElementById("birthDate");


const targetInput =
document.getElementById("targetDate");


const calculateButton =
document.getElementById("calculate");


const result =
document.getElementById("result");




/* ==========================
   Default Date
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
        function(){


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


        }
    );

}



formatDateInput(birthInput);

formatDateInput(targetInput);







/* ==========================
   Date Parse
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
   Calculate Age
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




    const birthdayThisYear =
    new Date(
        target.getFullYear(),
        birth.getMonth(),
        birth.getDate()
    );



    if(target < birthdayThisYear){

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







    result.innerHTML = `


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
