$(document).ready(function(){

    var turn = 1;
    var play = true;
    var p1score = 0;
    var p2score = 0;
    var tiescore = 0;

    $("td").click(function(){

        if($(this).text() === "" && play === true){
            if(turn%2 === 1){
                $(this).text("X");
            }
            else 
                $(this).text("O");
            turn++;
        }

        if(checkWin() === "X"){
            $("#output").text("PLAYER 1 WINS");
            play = false;
        }

        else if(checkWin() === "O"){
            $("#output").text("PLAYER 2 WINS");
            play = false;
        }

        else if(checkWin() === -1 && turn === 10){
            $("#output").text("YOU BOTH SUCK");
            play = false;
        }

    })

    $("button").click(function(){
        turn = 1;
        play = true;
        reset();
    })
    
})

var checkWin = function(){

    var tile = [];

    for (var i = 0; i < 9; i++){
        tile.push($("#tile-" + i).text());
    }

    //Column check, returns winning value
    if((tile[0]===tile[3]) && (tile[3] === tile[6])){return tile[6]}
    else if((tile[1]===tile[4]) && (tile[4] === tile[7])){return tile[7]}
    else if((tile[2]===tile[5]) && (tile[5] === tile[8])){return tile[8]}

    //Row check
    else if((tile[0]===tile[1]) && (tile[1] === tile[2])){return tile[2]}
    else if((tile[3]===tile[4]) && (tile[4] === tile[5])){return tile[5]}
    else if((tile[6]===tile[7]) && (tile[7] === tile[8])){return tile[8]}

    //Diagonal check
    else if((tile[0]===tile[4]) && (tile[4] === tile[8])){return tile[8]}
    else if((tile[2]===tile[4]) && (tile[4] === tile[6])){return tile[6]}

    else {return -1}
}

var reset = function(){

    for(var i  = 0; i < 9; i++){
        $("#tile-" + i).text("");
    }

    $("#output").text("");

}