$(document).ready(function(){

    var money = parseInt($("#money").text())
    testing_spawn()
    update_unit_total("sword", swords_total);
    update_unit_total("sniper", snipers_total);

    update_unit_idle("sword", swords_idle);
    update_unit_idle("sniper", snipers_idle);

    $("td").click(function(){
        
    })

    $("#buy_swords").click(function(){
        buy_unit("sword", 100)
    })

    $("#buy_snipers").click(function(){
        buy_unit("sniper", 170)
    })

    $("#place_sword").click(function(){
        $("#board tr td").css()
    })

    $("#place_sniper").click(function(){

    })
})

function read_board(){

    var tile = [];

    for (var i = 0; i < 25; i++){
        tile.push($("#tile-" + i).text());
    }

    return tile.length
}

function buy_unit(unit, price){
    var money = parseInt($("#money").text())

    if(money >= price){

        $("#test").text("bought " + unit)
        money -= price
        $("#money").text(money)

        if(unit === "sword"){
            swords_total ++
            swords_idle ++
            update_unit_total(unit, swords_total);
            update_unit_idle("sword", swords_idle);
        }

        else if(unit === "sniper"){
            snipers_total ++
            snipers_idle ++
            update_unit_total(unit, snipers_total);
            update_unit_idle("sniper", snipers_idle);
        }

    }

    return
}

function update_unit_total(unit, amount){
    $("#" + unit + "_num").text(amount + " total")
}

function update_unit_idle(unit, amount){
    $("#" + unit + "_idle").text(amount + " idle")
}

var running = false

function spawner(interval, runner, blocker, iterations){
    running = true

    var iterate = 0
    var counter = 0
    var next = counter + 1
    var clear = counter - 1
    
    setInterval(function(){
        
        if (running === false){
            $("#output").text("end")
            $("#tile-" + clear).text("")
            iterate = 0
            counter = 0
            next = counter + 1
            clear = counter - 1
            return
        }
        $("#tile-" + num).text("a")
        num ++
        $("#tile-" + clear).text("")
        
    }, 500)
}

var sword = "<==}o"
var sniper = "<--(|"

var swords_total = 0
var snipers_total = 0

var swords_idle = 0
var snipers_idle = 0

var sword_selected = false;
var sniper_selected = false;