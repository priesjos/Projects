function generateStoryOne(){
    var noun1 = $("#noun1").val();
    var noun2 = $("#noun2").val();
    var noun3 = $("#noun3").val();
    var verb = $("#1-verb").val();
    var adjective = $("#1-adjective").val();

    var story1 = "There was a time when " + noun1 + " and " + noun2 + " were plentiful in this world. However, as " + noun3 + " passed, so did their place in this world, and all has " + verb + " since then. Whatever the future holds is " + adjective + ".";
    $("#story-title").text("STORY ONE");
    $("#story").text(story1);
}

function generateStoryTwo(){
    var noun_possessive = $("#noun_possessive").val();
    var noun_plural = $("#noun_plural").val();
    var time = $("#time").val();
    var verb = $("#2-verb").val();
    var noun_place = $("#noun_place").val();
    var emotion = $("#emotion").val();
    var reaction = $("#reaction").val();
    var number_rank = $("#number_rank").val();
    var adjective1 = $("#2-adjective1").val();
    var adjective2  = $("#2-adjective2").val();

    var story2 = "“I dreamt I cut off a " + noun_possessive + " " + noun_plural + " at  " + time + ",” he recounted. “One by one. Snip by snip.” He " + verb + ", “Was I forced to do this, or was it for " + emotion + ", in my dream? I couldn’t tell.” " + adjective1 +" " + reaction + " spattered the " + noun_place + ". He would go on to take " + number_rank + " place in the All-County Regional " + adjective2 + " Pickup Line Invitational.";
    $("#story-title").text("STORY TWO");
    $("#story").text(story2);
}

/*
function generateStoryThree(){
    var gtoiouu7y

    var story3 = "He checked his pockets and satchel against the crumpled list. Seventy-five feet of parachute line: Good. Folding ceramic knives, one clipped to his belt, one stashed in his boot holster: Good. Wireless earpiece linked to a police scanner: Good. Lock pick gun: Good. Five cannisters of colored smoke, four yellow, one blue: Good. He was ready. Now all he needed was a plan, and an objective.";
}
*/