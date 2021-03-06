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
    });
});


function minToYearsDays(){

    var minutes = $("#minutes-convert").val();
    var days = Math.floor(minutes/60/24);
    var years = Math.floor(days/365);
    var daysLeft = days%365;

    $("#output-years-days").text(years + " years, " + daysLeft + " days");
    $("#output-years-days").slideDown("slow");

}

function calcGratTotal(){

    var subtotal = parseInt($("#subtotal").val());
    var gratuity = parseInt($("#grat").val());
    var outputGrat = subtotal*(gratuity/100);
    var total = subtotal + outputGrat;

    $("#output-grat-total").text("Gratuity: $" + outputGrat + ", Total: $" + total);
    $("#output-grat-total").slideDown("slow");

}

function calcBMI(){

    var pounds = $("#pounds").val();
    var inches = $("#inches").val();
    var kilograms = pounds*.45359237;
    var meters = inches*.0254;
    var bmi = kilograms/(Math.pow(meters,2));

    $("#output-bmi").text(bmi);
    $("#output-bmi").slideDown("slow");

}

function decToHoursMins(){

    var hours = $("#hrs-float").val();
    var tenth = (Math.floor(hours*100/10))%10;
    var hundredth = (Math.floor(hours*100))%10;
    var integerDigit = Math.floor(hours);
    var decimalDigits = tenth + "" + hundredth;
    var hoursToMinutes = Math.round((decimalDigits*60)/100);

    $("#output-hrs-mins").text("Hours: " + integerDigit + ", Minutes: " + hoursToMinutes);
    $("#output-hrs-mins").slideDown("slow");

}