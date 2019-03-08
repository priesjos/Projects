$(document).ready(function(){

    var turn = 1;

    $("td").click(function(){

        if($(this).text() === ""){
            if(turn%2 === 1){
                $(this).text() === "X"
            }
            else {
                $(this).text() === "O"
            }
            turn++;
        }

    })

    $("button").click(function(){
        turn = 1;
    })
    
})

var checkWin = function(){


}

var reset = function(){


}