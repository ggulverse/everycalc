/* ==================================================
   EveryCalc - search.js
================================================== */


document.addEventListener("DOMContentLoaded", function(){


    const searchInput = document.getElementById("searchInput");

    const searchButton = document.getElementById("searchButton");

    const cards = document.querySelectorAll(".calculator-card");


    if(!searchInput || !searchButton){

        return;

    }



    function searchCalculator(){


        const keyword =
            searchInput.value
            .trim()
            .toLowerCase();



        cards.forEach(function(card){


            const title =
                card.querySelector("h3");


            if(!title){

                return;

            }


            const name =
                title.textContent
                .toLowerCase();



            if(name.includes(keyword)){


                card.style.display="flex";


            }else{


                card.style.display="none";


            }


        });


    }



    searchButton.addEventListener(
        "click",
        searchCalculator
    );



    searchInput.addEventListener(
        "keydown",
        function(e){


            if(e.key==="Enter"){

                searchCalculator();

            }


        }
    );



    searchInput.addEventListener(
        "input",
        searchCalculator
    );


});
