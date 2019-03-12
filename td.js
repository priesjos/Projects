$(document).ready(function(){
    $("td").click(function(){
        
    })
    $("#test").text(read_board)
})

function read_board(){

    var tile = [];

    for (var i = 0; i < 25; i++){
        tile.push($("#tile-" + i).text());
    }

    return tile
}

var sword = "<==}o"
var sniper = "<--(|"
