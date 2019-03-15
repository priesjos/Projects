$(document).ready(function(){

    var current_selection

    //update_slain()

    update_unit_total("sword", swords_total);
    //update_unit_total("sniper", snipers_total);

    update_unit_idle("sword", swords_idle);
    //update_unit_idle("sniper", snipers_idle);

    $("td").click(function(){
        if (running === false && $(this).text() === "" && current_selection === sword && swords_idle > 0 && $(this).html() !== "#tile-0" && $(this).html() !== "#tile-1"){
            $(this).text(sword)
            swords_idle --
            update_unit_idle("sword", swords_idle);
        }
    })

    $("#start").click(function(){
        if (running === false){
            spawner(110, "(<o>)", sword, 5)
        }
    })

    $("#buy_swords").click(function(){
        buy_unit("sword", 100)
    })

    /*$("#buy_snipers").click(function(){
        buy_unit("sniper", 170)
    })*/

    $("#place_sword").click(function(){
        if(swords_idle > 0){
            current_selection = sword
        }
        
    })

    /*$("#place_sniper").click(function(){
        if(snipers_idle > 0){
            current_selection = sniper
        }
    })*/
})

var sword = "<==}o"
//var sniper = "<--(|"

var swords_total = 0
//var snipers_total = 0

var swords_idle = 0
//var snipers_idle = 0

var kills_total = 0
var hits_total = 0

var unit_deaths = 0

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

        /*else if(unit === "sniper"){
            snipers_total ++
            snipers_idle ++
            update_unit_total(unit, snipers_total);
            update_unit_idle("sniper", snipers_idle);
        }*/

    }

    return
}

function update_unit_total(unit, amount){
    $("#" + unit + "_num").text(amount + " total")
}

function update_unit_idle(unit, amount){
    $("#" + unit + "_idle").text(amount + " idle")
}

function update_slain(){
    var money = parseInt($("#money").text())
    money = 50 * kills_total
    $("#money").text(money)
    $("#killcount").text(kills_total + " enemies slain")
}

var running = false

function spawner(interval, runner, blocker, iterations){
    running = true

    var iterate = 0
    var kills = 0
    var hits = 0
    var counter = 0
    var next = counter + 1
    var clear = counter - 1
    
    setInterval(function(){
        
        if (running === false){
            $("#tile-" + clear).text("")
            $("#tile-" + counter).text("")
            iterate = 0
            counter = 0
            next = counter + 1
            clear = counter - 1
            return 
        }
        
        if ($("#tile-" + next).text() === blocker){
            $("#tile-" + clear).text("")
            $("#tile-" + counter).text("")
            $("#tile-" + next).css("background-color", "red")
            hits++

            if (hits >= 3){
                $("#tile-" + next).css("background-color", "white")
                $("#tile-" + next).text("")
                swords_total --
                update_unit_total("sword", swords_total)
                hits = 0
            }

            else{
                counter = 0
                next = counter + 1
                clear = counter - 1
            }

            iterate ++
            kills = iterate

        }

        $("#tile-" + clear).text("")
        $("#tile-" + counter).text(runner)

        if (counter === read_board() + 1){
            $("#output").text("iterated " + iterate + " times")
            counter = 0
            next = counter + 1
            clear = counter - 1
            iterate ++
        }

        if (iterate === iterations){
            kills_total += kills
            update_slain()
            running = false
        }
        
        clear++
        counter++
        next++

    }, interval)
}
