/* ==================================================
   EveryCalc 2.0
   search.js
================================================== */


const searchInput = document.getElementById("searchInput");



/* =========================
   Calculator Data
========================= */


const calculators = [


    {
        name:"환율 계산기",
        keyword:[
            "환율",
            "달러",
            "엔화",
            "외환"
        ],
        url:"pages/exchange.html"
    },


    {
        name:"귀금속 계산기",
        keyword:[
            "금",
            "은",
            "귀금속",
            "시세"
        ],
        url:"pages/metal.html"
    },


    {
        name:"퍼센트 계산기",
        keyword:[
            "퍼센트",
            "%",
            "증가",
            "감소"
        ],
        url:"pages/percent.html"
    },


    {
        name:"날짜 계산기",
        keyword:[
            "날짜",
            "기간",
            "일수"
        ],
        url:"pages/date.html"
    },


    {
        name:"BMI 계산기",
        keyword:[
            "bmi",
            "체질량",
            "비만"
        ],
        url:"pages/bmi.html"
    },


    {
        name:"평균 계산기",
        keyword:[
            "평균",
            "평균값"
        ],
        url:"pages/average.html"
    },


    {
        name:"나이 계산기",
        keyword:[
            "나이",
            "생년월일",
            "만나이"
        ],
        url:"pages/age.html"
    }


];





/* =========================
   Search Event
========================= */


if(searchInput){


    searchInput.addEventListener(
        "keydown",
        function(e){



            if(e.key === "Enter"){



                const value =
                searchInput.value
                .trim()
                .toLowerCase();




                if(!value){

                    return;

                }




                const result =
                calculators.find(item=>{


                    return item.keyword.some(word=>{


                        return value.includes(
                            word.toLowerCase()
                        );


                    });


                });





                if(result){


                    location.href=result.url;


                }else{


                    alert(
                        "해당 계산기를 찾을 수 없습니다."
                    );


                }



            }


        }
    );


}
