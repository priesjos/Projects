$(document).ready(function(){
    $("#min-convert").click(function(){
        minToYearsDays();
    });

    $("#calc-grat-total").click(function(){
        calcGratTotal();
    });

    $("#calc-bmi").click(function(){
        calcBMI();
    });

    $("#hrs-convert").click(function(){
        decToHoursMins();
    })
});


function minToYearsDays(){

    var minutes;

    var input = $("#minutes-convert").val();

    $("#output-years-days").text();
}

function calcGratTotal(){

    var inputOne = $("#subtotal").val();
    var inputTwo = $("#grat").val();

    $("#output-grat-total").text();
}

function calcBMI(){

    var inputOne = $("#pounds").val();
    var inputTwo = $("#inches").val();

    $("#output-bmi").text();
}

function decToHoursMins(){

    var input = $("#hrs-float").val();

    $("#output-hrs-mins").text();
}