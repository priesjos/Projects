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
    var days;
    var years;

    minutes = $("#minutes-convert").val();

    days = Math.floor(minutes/60/24);
    years = Math.floor(days/365);

    $("#output-years-days").text(years + " years, " + days + " days");

}

function calcGratTotal(){

    var subtotal;
    var gratuity;
    var output-grat;
    var total;

    var subtotal = $("#subtotal").val();
    var gratuity = $("#grat").val();

    


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