function generateStoryOne(){
    var noun1 = $("#noun1");
    var noun2 = $("#noun2");
    var noun3 = $("#noun3");
    var verb = $("#verb");
    var adjective = $("#adjective");

    var story = "There was a time when " + noun1 + " and " + noun2 + " were plentiful in this world. However, as " + noun3 + " passed, so did their place in this world, and all has " + verb + " since then. Whatever the future holds is " + adjective + ".";
    $("#story-title").text("STORY ONE");
    $("#story").text(story);
}


