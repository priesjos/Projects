$(document).ready(function(){

    //Initialize narrative
    updateNarrative(N1);
    updateButtons(true, true, N1_O1);

    $("#B1").click(function(){

        //Starts the story
        if ($("#B1").text() === N1_O1){
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }  

        //Approach light option, without jewel
        else if ($("#B1").text() === N2_O1 && hasJewel === false){
            updatePage(N3_A1, false, true, N3_A1_O1, N3_A1_O2);
        }   

        //Approach light option, with jewel
        else if ($("#B1").text() === N2_O1 && hasJewel === true){
            updatePage(N4, false, false, N4_O1, N4_O2, N4_O3);
        }   

        //Take jewel
        else if ($("#B1").text() === N3_B1_O1){
            hasJewel = true;
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }   

        //Return from opening
        else if ($("#B1").text() === N3_A1_O1){
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }

        //Return from opening after shouting
        else if ($("#B1").text() === N3_A2_O1){
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }

        //Return from hall
        else if ($("#B1").text() === N3_C1_O1){
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }

        //Return from pit
        else if ($("#B1").text() === N3_C2_O1){
            updatePage(N2_A1, false, false, N2_O1, N2_O2, N2_O3);
        }
    });

    $("#B2").click(function(){

        //Call out
        if ($("#B2").text() === N3_A1_O2){
            updatePage(N3_A2, true, true, N3_A2_O1);
        }

        //Investigate remains
        else if ($("#B2").text() === N2_O2 && hasJewel === false){
            updatePage(N3_B1, true, true, N3_B1_O1);
        }

        //Investigate remains, jewel added
        else if ($("#B2").text() === N2_O2 && hasJewel === true){
            updatePage(N2_B1, false, false, N2_O1, N2_O2, N2_O3);
        }

        //Drop bone
        else if ($("#B2").text() === N3_C1_O2){
            updatePage(N3_C2, true, true, N3_C2_O1);
        }

    });

    $("#B3").click(function(){

        //Investigate hole
        if ($("#B3").text() === N2_O3){
            updatePage(N3_C1, false, true, N3_C1_O1, N3_C1_O2);
        }

        
    });

});

var hasJewel = false;

var N1 = "You awake in an unlit chamber, and a faint glow of light emanates from a distance. It is blurred by fog.";
var N1_O1 = "Continue";

var N2_A1 = "Gradually, your vision takes in the surrounding area. Remains are scattered throughout the ground, some of them human, and a rusted wall encloses the area, save for a hallway that breaks off into a pit. The light is coming from a dilapidated opening in the wall.";
var N2_O1 = "Approach light";
var N2_O2 = "Investigate remains";
var N2_O3 = "Investigate hole";

var N2_B1 = "There's nothing more of use in the remains."

var N3_A1 = "From the hole in the wall, you can see a pale red lantern across the horizon. It brings to light a number of cell doors in a corridor, but your's seems to have been sealed off.";
var N3_A1_O1 = "Return from opening";
var N3_A1_O2 = "Call out";

var N3_A2 = "No sound is capable of exiting your mouth, and only a prolonged, black mist comes forth.";
var N3_A2_O1 = "Return to chamber";

var N3_B1 = "Skeletal remains litter the ground, few with their flesh remaining. Among the dead is a large, black jewel of unusual shape. It seems to be designed for insertion into a specific place.";
var N3_B1_O1 = "Take the jewel and return";

var N3_C1 = "At the rear of the chamber is a hall which quickly breaks off into darkness. A gaping pit is at its end, and the concrete of the walls fade away into its cavernous stone. You can't recall whether it was an entrance or a deathtrap.";
var N3_C1_O1 = "Return from hall";
var N3_C1_O2 = "Assess the fall with a bone";

var N3_C2 = "You take a bone from the remains and let it drop into the pit. A few moments pass, but no sound is heard to indicate its landing.";
var N3_C2_O1 = "Return from pit";

var N4 = "The jewel fits evenly within the opening, returning the room to a state of darkness. The walls begin to rumble, and after a while they sink into the ground, leaving exposed the corridor of the cells. The light is brighter than ever.";
var N4_O1 = "A";
var N4_O2 = "B";
var N4_O3 = "C";

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