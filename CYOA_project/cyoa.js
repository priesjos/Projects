$(document).ready(function(){

    //Initialize narrative
    $("footer").html(createButton("B1", N1_O1) + createButton("B2", "unused") + createButton("B3", "unused"));
    $("#B2").hide();
    $("#B3").hide();
    updatePage(N1, true, true, N1_O1);

    $("#B1").click(function(){

        //Starts the story
        if ($("#B1").text() === N1_O1){
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }  

        //Approach light option, without jewel
        else if ($("#B1").text() === N2_O1 && hasJewel === false){
            updatePage(N2_A1, false, true, N2_A1_O1, N2_A1_O2);
            //update image, unique one
        }   

        //Approach light option, with jewel
        else if ($("#B1").text() === N2_O1 && hasJewel === true){
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3);
            //update image, unique one, serves as visual for narrative 3
        }   

        //Take jewel
        else if ($("#B1").text() === N2_B1_O1){
            hasJewel = true;
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }   

        //Return from opening
        else if ($("#B1").text() === N2_A1_O1){
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }

        //Return from opening after shouting
        else if ($("#B1").text() === N2_A2_O1){
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }

        //Return from hall
        else if ($("#B1").text() === N2_C1_O1){
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }

        //Return from pit
        else if ($("#B1").text() === N2_C2_O1){
            updatePage(N2_1, false, false, N2_O1, N2_O2, N2_O3);
            updateImage("4637561241_6d77f97087_z.jpg");
        }

        //Examine lantern without rod
        else if ($("#B1").text() === N3_O1 && hasRod === false){
            updatePage(N3_A1, true, true, N3_A1_O1);
        } 

        //Return from lantern
        else if ($("#B1").text() === N3_A1_O1){
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3);
        }

        //Examine lantern with rod
        else if ($("#B1").text() === N3_O1 && hasRod === true && hasLantern == false){
            updatePage(N3_A2, true, true, N3_A2_O1);
        } 

        //Examine lantern with lantern
        else if ($("#B1").text() === N3_O1 && hasLantern === true){
            $("article").text("The glow of the lantern persists.");
        } 

        //Take lantern and return
        else if ($("#B1").text() === N3_A2_O1){
            hasLantern = true;
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3_alt);
        } 

        //Take eye
        else if ($("#B1").text() === N3_B1_O1){
            hasEye = true;
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3);
        }

        //Return from corridor
        else if ($("#B1").text() === N3_C1_O1){
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3);
        }

        //Take rod
        else if ($("#B1").text() === N3_C2_O1){
            hasRod = true;
            updatePage(N3_1, false, false, N3_O1, N3_O2, N3_O3_alt);
        }

        //Advance
        else if ($("#B1").text() === N3_C3_O1){
            $("article").fadeOut();
            $("#B1").hide();
            $("#B2").hide();
            $("#B3").hide();
        }
    });


    $("#B2").click(function(){

        //Call out
        if ($("#B2").text() === N2_A1_O2){
            updatePage(N2_A2, true, true, N2_A2_O1);
        }

        //Investigate remains
        else if ($("#B2").text() === N2_O2 && hasJewel === false){
            updatePage(N2_B1, true, true, N2_B1_O1);
            //Update image here, unique
        }

        //Investigate remains, jewel added
        else if ($("#B2").text() === N2_O2 && hasJewel === true){
            $("article").text(N2_2);
        }

        //Drop bone
        else if ($("#B2").text() === N2_C1_O2){
            updatePage(N2_C2, true, true, N2_C2_O1);
        }
        
        //Investigate other cells
        else if ($("#B2").text() === N3_O2 && hasEye === false){
            updatePage(N3_B1, true, true, N3_B1_O1);
        }

        //Investigate other cells, eye obtained
        else if ($("#B2").text() === N3_O2 && hasEye === true){
            $("article").text(N3_2);
        }
    });


    $("#B3").click(function(){

        //Investigate hole
        if ($("#B3").text() === N2_O3){
            updatePage(N2_C1, false, true, N2_C1_O1, N2_C1_O2);
            //Update image here, unique
        }

        //Go to corridor's end, without eye
        else if ($("#B3").text() === N3_O3 && hasEye === false){
            updatePage(N3_C1, true, true, N3_C1_O1);
        }

        //Go to corridor's end, with eye
        else if ($("#B3").text() === N3_O3 && hasEye === true){
            updatePage(N3_C2, true, true, N3_C2_O1);
        }

        //Go to corridor's end, with rod already obtained and no lantern
        else if ($("#B3").text() === N3_O3_alt && hasLantern === false){
            updatePage(N3_3, false, false, N3_O1, N3_O2, N3_O3_alt);
        }

        //Go to corridor's end, lantern obtained
        else if ($("#B3").text() === N3_O3_alt && hasLantern === true){
            updatePage(N3_C3, true, true, N3_C3_O1);
        }
    });

});

var hasJewel = false;
var hasEye = false;
var hasRod = false;
var hasLantern = false;

var N1 = "You awake in an unlit chamber, and a faint glow of light emanates from a distance. It is blurred by fog.";
var N1_O1 = "Continue";

var N2_1 = "Gradually, your vision takes in the surrounding area. Remains are scattered throughout the ground, some of them human, and a rusted wall encloses the area, save for a hallway that breaks off into a pit. The light is coming from a dilapidated opening in the wall.";
var N2_O1 = "Approach light";
var N2_O2 = "Investigate remains";
var N2_O3 = "Investigate hole";

var N2_2 = "There's nothing more of use in the remains."

var N2_A1 = "From the hole in the wall, you can see a pale red lantern across the horizon. It brings to light a number of cell doors in a corridor, but your's seems to have been sealed off.";
var N2_A1_O1 = "Return from opening";
var N2_A1_O2 = "Call out";

var N2_A2 = "No sound is capable of exiting your mouth, and only a prolonged, black mist comes forth.";
var N2_A2_O1 = "Return to chamber";

var N2_B1 = "Skeletal remains litter the ground, few with their flesh remaining. Among the dead is a large, black jewel of unusual shape. It seems to be designed for insertion into a specific place.";
var N2_B1_O1 = "Take jewel and return";

var N2_C1 = "At the rear of the chamber is a hall which quickly breaks off into darkness. A gaping pit is at its end, and the concrete of the walls fade away into its cavernous stone. You can't recall whether it was an entrance or a deathtrap.";
var N2_C1_O1 = "Return from hall";
var N2_C1_O2 = "Assess the fall with a bone";

var N2_C2 = "You take a bone from the remains and let it drop into the pit. A few moments pass, but no sound is heard to indicate its landing.";
var N2_C2_O1 = "Return from pit";

var N3_1 = "The jewel fits evenly within the opening, returning the room to a state of darkness. The walls begin to rumble, and after a while they sink into the ground, leaving exposed the corridor of the cells. The light is brighter than ever.";
var N3_O1 = "Examine lantern";
var N3_O2 = "Investigate other cells";
var N3_O3 = "Go to corridor's end";
var N3_O3_alt = "Go to corridor's end ";

var N3_2 = "Nothing left of use is in the cells."

var N3_3 = "It's too dark to go any further."

var N3_A1 = "The lantern is hanging from an arch between two walls. There is no way for you to reach it.";
var N3_A1_O1 = "Return to corridor";

var N3_A2 = "With the rod's length, you're able to bring the lantern down from the arch. Its red glow brings the entire corridor to light.";
var N3_A2_O1 = "Take lantern and return";

var N3_B1 = "All of the cell doors are locked, though one of the rooms holds an eye of unknown make. The bars are wide enough for you to take it.";
var N3_B1_O1 = "Take eye and return";

var N3_C1 = "You walk down the corridor for some time, but there doesn't seem to be an end to its length. Moreover, wandering further away from the light bears risks of its own.";
var N3_C1_O1 = "Return to the cells";

var N3_C2 = "Strangely, it only takes a few moments to reach the corridor's end. Although the next room is too dark to enter, a long rod is leaning against the wall.";
var N3_C2_O1 = "Take rod and return";

var N3_C3 = "Even with the lantern, the room at the end is still shrouded in a thick, dark mist. You can barely manage to make out the details of what's ahead.";
var N3_C3_O1 = "Advance";

var createButton = function(id, text){
    return "<button type=button id=" + id + ">" + text + "</button>"
}

var updatePage = function(nar, hide2, hide3, a, b, c){

    $("article").text(nar);

    if (hide2 === true){
        $("#B2").hide();
    }
    else if (hide2 === false){
        $("#B2").show();
    }

    if (hide3 === true){
        $("#B3").hide();
    }
    else if (hide3 === false){
        $("#B3").show();
    }

    $("#B1").text(a);
    $("#B2").text(b);
    $("#B3").text(c);
}

var imageChange = function(a){
    $("img").attr("src", a);
}

var updateImage = function(a){

    $("img").fadeOut(imageChange(a));
    $("img").fadeIn();
    
}