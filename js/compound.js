/* ==================================================
   EveryCalc - Compound Calculator
================================================== */


let compoundChart = null;



const calculateButton =
document.getElementById("calculate");



if(calculateButton){


calculateButton.addEventListener(
"click",
calculateCompound
);


}




function calculateCompound(){



const principal =
Number(
document.getElementById("principal").value
) || 0;



const monthlyDeposit =
Number(
document.getElementById("monthlyDeposit").value
) || 0;



const interestRate =
Number(
document.getElementById("interestRate").value
) || 0;



const investmentPeriod =
Number(
document.getElementById("investmentPeriod").value
) || 0;



const compoundPeriod =
Number(
document.getElementById("compoundPeriod").value
);




if(
principal <= 0 ||
investmentPeriod <= 0
){

alert("초기 원금과 투자 기간을 입력해주세요.");

return;

}




const result =
calculateCompoundAmount(
principal,
monthlyDeposit,
interestRate,
investmentPeriod,
compoundPeriod
);



displayResult(result);



drawCompoundChart(result.chartData);



}

function calculateCompoundAmount(
principal,
monthlyDeposit,
interestRate,
years,
compoundPeriod
){


const rate =
interestRate / 100;



const months =
years * 12;



const periodRate =
rate / compoundPeriod;



let amount =
principal;



let totalPrincipal =
principal;



const chartData = [];



chartData.push({

year:0,

amount:amount

});





for(
let month = 1;
month <= months;
month++
){



// 매월 추가 투자금 반영

amount += monthlyDeposit;

totalPrincipal += monthlyDeposit;





// 복리 적용 주기 계산

if(
month % (12 / compoundPeriod) === 0
){


amount =
amount *
Math.pow(
1 + periodRate,
1
);


}



if(
month % 12 === 0
){


chartData.push({

year:
month / 12,

amount:
amount

});


}



}





const totalInterest =
amount - totalPrincipal;



const profitRate =
totalPrincipal > 0
?
(totalInterest / totalPrincipal) * 100
:
0;





return {


finalAmount:
amount,


totalPrincipal:
totalPrincipal,


totalInterest:
totalInterest,


profitRate:
profitRate,


compoundPeriod:
compoundPeriod,


chartData:
chartData


};



}

function displayResult(result){



document.getElementById("finalAmount").textContent =
formatCurrency(
result.finalAmount
);



document.getElementById("totalPrincipal").textContent =
formatCurrency(
result.totalPrincipal
);



document.getElementById("totalInterest").textContent =
formatCurrency(
result.totalInterest
);



document.getElementById("profitRate").textContent =
result.profitRate.toFixed(2) + "%";



document.getElementById("compoundPeriodText").textContent =
getCompoundPeriodText(
result.compoundPeriod
);



}





function formatCurrency(value){



return Math.round(value)
.toLocaleString("ko-KR")
+ "원";



}







function getCompoundPeriodText(period){



switch(period){


case 365:

return "매일 복리";


case 12:

return "매월 복리";


case 4:

return "분기 복리";


case 2:

return "반기 복리";


case 1:

return "매년 복리";


default:

return "-";


}



}

function drawCompoundChart(data){



const canvas =
document.getElementById("compoundChart");



if(!canvas){

return;

}





if(compoundChart){

compoundChart.destroy();

}





const labels =
data.map(item=>{

return item.year + "년";

});





const values =
data.map(item=>{

return Math.round(item.amount);

});





compoundChart =
new Chart(
canvas,
{

type:"line",


data:{


labels:labels,


datasets:[{


label:"예상 자산",

data:values,


borderWidth:2,


tension:0.3


}]


},



options:{


responsive:true,


maintainAspectRatio:false,


plugins:{


legend:{


display:true


}


},



scales:{


y:{


ticks:{


callback:function(value){


return value.toLocaleString("ko-KR")
+ "원";


}


}


}


}



}


}

);




}
