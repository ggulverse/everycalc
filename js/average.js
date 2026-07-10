const calculateButton = document.getElementById("calculate");

calculateButton.addEventListener("click", function () {

    const input = document.getElementById("numbers").value;

    const numbers = input
        .split(/[, ]+/)
        .map(Number)
        .filter(num => !isNaN(num));


    if (numbers.length === 0) {

        document.getElementById("result").innerHTML =
            "올바른 숫자를 입력해주세요.";

        return;

    }


    const sum = numbers.reduce(
        (total, num) => total + num,
        0
    );


    const average = sum / numbers.length;


    document.getElementById("result").innerHTML =

        `
        입력 개수: ${numbers.length}개<br><br>

        합계: ${sum}<br><br>

        평균: ${average.toFixed(2)}
        `;

});
