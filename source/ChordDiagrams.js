
init(); 
chordFont = ScriptUI.newFont("palette").name;
chordFontLaber = ScriptUI.newFont("palette").name;
drawBarre = false;
canRepositionX = false;
canRepositionY = false;
isReversed = false;

createUI();

function createUI()
{
    var myWindow = new Window("palette", "Chord Diagram Creator");          // UI base dialog box

    // Chord name input, font selection, font size group --------
    var chordNameInput = myWindow.add('group {orientation: "row"}');        // container 
    chordNameInput.alignment = "right";
    chordNameInput.add("statictext", undefined, "Chord Name:");             // text obj

    var chordName = chordNameInput.add("edittext", undefined, "");          // input obj
    chordName.characters = 6;
    chordName.active = true;

    // custom fonts group 1----
    chordNameInput.add("statictext", undefined, "Chord Font:");             // text obj
    var fontListMenu = chordNameInput.add("dropdownlist", undefined, []);   // dropdown menu obj
    fontListMenu.maximumSize = [130, 20];
    

    chordNameInput.add("statictext", undefined, "Font Size:");                   // text obj
    var chordLabelFontSize = chordNameInput.add("edittext", undefined, "auto");  // input obj
    chordLabelFontSize.characters = 3;

    // custom fonts group 2----
    var customFontsGroup = myWindow.add('group {orientation: "row"}');          // container 
    customFontsGroup.alignment = "right"

   // customFontsGroup.add("statictext", undefined, "Frets Font:");             // text obj
   // var favorites = customFontsGroup.add("dropdownlist", undefined, ["Your favorite chords   "]);   // dropdown menu obj (TODO impl)
   //favorites.selection = favorites.items[0];                                    // default selected item
    

    customFontsGroup.add("statictext", undefined, "Frets Font:");             // text obj
    var fontListMenuFrets = customFontsGroup.add("dropdownlist", undefined, []);   // dropdown menu obj
    fontListMenuFrets.maximumSize = [130, 20];

    customFontsGroup.add("statictext", undefined, "Font Size:");                // text obj
    var chordFontSize = customFontsGroup.add("edittext", undefined, "auto");    // input obj
    chordFontSize.characters = 3;
    
    // populate dropdown menus with fonts
    var iCount = textFonts.length;
    var newItem;
    var fontList = []
    for (var i=0; i<iCount; i++) {
        sFontName = textFonts[i].name;
        fontList.push(textFonts[i].name);
        sFontName += " ";
        sFontNames = sFontName + textFonts[i].style;
        newItem = fontListMenu.add("item", sFontName);
        newItem = fontListMenuFrets.add("item", sFontName);
    }
    
    //customize fonts events
    fontListMenu.onChange = function () {
    
        for(var i = 0; i < iCount; i++)
        {
           if (fontListMenu.selection == fontListMenu.items[i])
           {
            chordFontLaber = fontList[i];
           }
        }
    }

    fontListMenuFrets.onChange = function () {
    
        for(var i = 0; i < iCount; i++)
        {
           if (fontListMenuFrets.selection == fontListMenuFrets.items[i])
           {
            chordFont = fontList[i];
           }
        }
    }


    // dropdown menus group, barre ---------
    var strFretsGroup = myWindow.add('group {orientation: "row"}');                             // container
    strFretsGroup.alignment = "left"
    // Number of Strings dropdown menu
    var numberOfStrings = strFretsGroup.add("statictext", undefined, "Number of Strings:");     // text obj
    var numberOfStringsDropDown = strFretsGroup.add("dropdownlist", undefined, 
        ["4 Strings", "5 Strings", "6 Strings", "7 Strings", "8 Strings", "9 Strings"]);        // dropdown menu obj
    numberOfStringsDropDown.selection = numberOfStringsDropDown.items[2];                       // default selected item

    // Number of Frets dropdown menu
    var numberOfFrets = strFretsGroup.add("statictext", undefined, "Number of Frets:");         // text obj
    var numberOfFretsDropDown = strFretsGroup.add("dropdownlist", undefined, 
        ["4 Frets", "5 Frets", "6 Frets", "7 Frets", "8 Frets", "9 Frets"]);                    // dropdown menu obj
    numberOfFretsDropDown.selection = numberOfFretsDropDown.items[1];                           // default selected item

    var drawBarreBox =  strFretsGroup.add('checkbox', undefined, "draw barre");                                           // tick box
    drawBarreBox.value = drawBarre;
    drawBarreBox.onClick = function () {drawBarre = drawBarreBox.value;}

    // finger position input group ---------
    var fingerPositions = myWindow.add('group {orientation: "row"}');       // container
    fingerPositions.alignment = "left"

    fingerPositions.add("statictext", undefined, "Fingers Used:");          // text obj

    var fingerPosStr = [];  // input obj array
    for (i = 0; i < 9; i++)
    {
        fingerPosStr.push(fingerPositions.add("edittext", undefined, ""));  // input obj
        fingerPosStr[i].characters = 2;

        //visibility based on available strings 
        if (i > 5) fingerPosStr[i].visible = false;
    }

    // fret Position input group ---------
    var fretPositions = myWindow.add('group {orientation: "row"}');     // container
    fretPositions.alignment = "left"

    fretPositions.add("statictext", undefined, "Fret Positions:");      // text obj

    var fretPosStr = [];    // input obj array
    for (i = 0; i < 9; i++)
    {
        fretPosStr.push(fretPositions.add("edittext", undefined, ""));      // input obj
        fretPosStr[i].characters = 2;

        //visibility based on available strings
        if (i > 5) fretPosStr[i].visible = false;
    }

    // X,Y Position input, group ---------
    var xyPosition = myWindow.add('group {orientation: "row"}');        // container
    xyPosition.alignment = "left"

    xyPosition.add("statictext", undefined, "Position X:");             // text obj
    var xPosistion = xyPosition.add("edittext", undefined, "0");        // input obj
    xPosistion.characters = 4;

    xyPosition.add("statictext", undefined, "Position Y:");             // text obj
    var yPosistion = xyPosition.add("edittext", undefined, "0");        // input obj
    yPosistion.characters = 4;

    xyPosition.add("statictext", undefined, "Reposition: ");            // text obj
    var repositionXBox = xyPosition.add('checkbox', undefined, "x");                         // tick box obj
    var repositionYBox = xyPosition.add('checkbox', undefined, "y");                         // tick box obj
    var reversedBox = xyPosition.add('checkbox', undefined, "↲");                  // tick box obj
    //xyPosition.add("statictext", undefined, "s:");            // text obj
    var rePosSpacing = xyPosition.add("edittext", undefined, "spc");    // input obj
    repositionXBox.onClick = function (){canRepositionX = repositionXBox.value;}
    repositionYBox.onClick = function (){canRepositionY = repositionYBox.value;}
    reversedBox.onClick = function ()   {isReversed     = reversedBox.value;}

    // Width, Height Diagram Size input group ---------
    var diagramSize = myWindow.add('group {orientation: "row"}');       // container
    diagramSize.alignment = "left"

    diagramSize.add("statictext", undefined, "Diagram Width:");         // text obj
    var diagramWidth = diagramSize.add("edittext", undefined, "100");   // input obj
    diagramWidth.characters = 4;

    //var linkWH = diagramSize.add('checkbox', undefined, "☍");        // tick box obj (TODO impl)

    diagramSize.add("statictext", undefined, "Diagram Height:");        // text obj
    var diagramHeight = diagramSize.add("edittext", undefined, "100");  // input obj
    diagramHeight.characters = 4;
    
    //var linkHS = diagramSize.add('checkbox', undefined, "☍ to frets");  // tick box obj (TODO impl)

    // String and Fret Thickness input group ---------
    var stringAndFretThickness = myWindow.add('group {orientation: "row"}');            // container
    stringAndFretThickness.alignment = "left"

    // String Thickness
    stringAndFretThickness.add("statictext", undefined, "String Thickness:");           // text obj
    var stringThickness = stringAndFretThickness.add("edittext", undefined, "auto");    // input obj
    stringThickness.characters = 4;

    // Fret Thickness
    stringAndFretThickness.add("statictext", undefined, "Fret Thickness:");             // text obj
    var fretThickness = stringAndFretThickness.add("edittext", undefined, "auto");      // input obj
    fretThickness.characters = 4;

    //Dynamic UI Changes -------
    numberOfStringsDropDown.onChange = function () {

        for (i = 4; i < 10; i++)
        {
            if (numberOfStringsDropDown.selection == numberOfStringsDropDown.items[i-4]) 
            {
                //change input visibility based on selected dropmenu option
                for (var j = 0; j < 9; j++)
                if (j < i) 
                {
                    fingerPosStr[j].visible = true;
                    fretPosStr[j].visible = true;
                }
                else
                {
                    fingerPosStr[j].visible = false;  
                    fretPosStr[j].visible = false;
                }
            
                //change the diagram height accordingly
                var currentString = (numberOfStringsDropDown.selection).text;   // number of strings as text
                var currentFret = (numberOfFretsDropDown.selection).text;       // number of frets as text

                var w = parseFloat(diagramWidth.text.replace(",", ".")); 
                //get the first char of the text (contains number of strings and frets)
                var s = parseInt(currentString.charAt(0));                      // number of strings as Int
                var f = parseInt(currentFret.charAt(0)) + 1;                    // number of frets as Int plus the nut
                //determine the new diagram height with rule of three
                var changedHeight =  f * w / s;
                diagramHeight.text = String(changedHeight);

                myWindow.update();
            } 
        }
    }
    
    numberOfFretsDropDown.onChange = function () {

        for (i = 5; i < 11; i++)
        {
            if (numberOfFretsDropDown.selection == numberOfFretsDropDown.items[i-5]) 
            {
                //change the diagram height accordingly 
                var currentString = (numberOfStringsDropDown.selection).text;       // number of strings as text
                var w = parseFloat(diagramWidth.text.replace(",", ".")); 
                //get the first char of the text (contains number of strings). The number of frets is the (i)
                var s = parseInt(currentString.charAt(0));                          // number of strings as Int
                //determine the new diagram height with rule of three
                var changedHeight =  i * w / s;
                diagramHeight.text = String(changedHeight);

                myWindow.update();
            } 
        }
    }

    //Buttons ------
    var myButtonGroup = myWindow.add("group");                                          // container
    myButtonGroup.alignment = "center";

    myWindow.newBtn = myButtonGroup.add("button", undefined, "Clear");                  // button obj
    myWindow.createBtn = myButtonGroup.add("button", undefined, "Draw Chord");          // button obj
    myWindow.saveBtn = myButtonGroup.add("button", undefined, "Save as");                  // button obj
    myWindow.manageBtn = myButtonGroup.add("button", undefined, "Favorites");    // button obj
    myWindow.closeBtn = myButtonGroup.add("button", undefined, "Close");                // button obj

    myWindow.layout.layout(true);   

    //Buttons events
    myWindow.createBtn.onClick = function () {
        
        xPosArg = parseFloat(xPosistion.text.replace(",", ".")); 
        yPosArg = parseFloat(yPosistion.text.replace(",", "."));
        dWArg = parseFloat(diagramWidth.text.replace(",", "."));
        dHArg = parseFloat(diagramHeight.text.replace(",", "."));
        
        numberOfStringsArg = parseFloat(numberOfStringsDropDown.selection.text.replace(",", ".").charAt(0));
        numberOfFretsArg = parseFloat(numberOfFretsDropDown.selection.text.replace(",", ".").charAt(0));

        nameOfChord = chordName.text; 
        if (nameOfChord == "") nameOfChord = " ";   // if a completely empty string is passed, the text object will vanish uppon creation
        
        fretPosArg = [];
        for (var i = 0; i < fretPosStr.length; i++)
        {
            if (fretPosStr[i].text == "") fretPosArg.push("x");
            else fretPosArg.push(fretPosStr[i].text);
        }

        fingerPosArg = [];
        for (var i = 0; i < fingerPosStr.length; i++)
        {
            fingerPosArg.push(fingerPosStr[i].text);
        }
        
        thickStrings = isNaN(parseFloat(stringThickness.text.replace(",", "."))) ? undefined : parseFloat(stringThickness.text.replace(",", "."));
        thickFrets = isNaN(parseFloat(fretThickness.text.replace(",", "."))) ? undefined : parseFloat(fretThickness.text.replace(",", "."));
        
        //Pass the arguments and call the function to create the diagram via BridgeTalk
        try {btExecute('createChordDiagram', ['xPosArg', 'yPosArg', 'dWArg', 'dHArg', 'numberOfStringsArg', 'numberOfFretsArg', 'nameOfChord', 'fretPosArg', 'fingerPosArg', 'thickStrings', 'thickFrets']);}
        catch(e){alert("Some went wrong: " + e, "Oops!!!")};

        if(canRepositionX)
        {
            var spc = parseInt(diagramWidth.text) / 2;
            if(!isNaN(parseInt(rePosSpacing.text))) spc = parseInt(rePosSpacing.text);

            var xpos = parseInt(xPosistion.text);
            xPosistion.text = isReversed ? String(xpos - parseInt(diagramWidth.text) - spc) : String(xpos + parseInt(diagramWidth.text) + spc);

            myWindow.update();
        }
        if(canRepositionY)
        {
            var spc = parseInt(diagramWidth.text) / 2;
            if(!isNaN(parseInt(rePosSpacing.text))) spc = parseInt(rePosSpacing.text);

            var ypos = parseInt(yPosistion.text);
            yPosistion.text = isReversed ? String(ypos + parseInt(diagramHeight.text) + spc) : String(ypos - parseInt(diagramHeight.text) - spc);
           
            myWindow.update();
        }
    }

    myWindow.closeBtn.onClick = function () {myWindow.close();}

    myWindow.show();
}

/**
 * Example: createChordDiagram(100, 500, 120, 120, 6, 5, "F7#5#9", ["1", "0", "1", "2", "2", "4"], ["T", "-", "1", "3", "3", "4"], 1.5, .5);
 * @param {* Float} xx                      - The x position of the diagram
 * @param {* Float} yy                      - The y position of the diagram
 * @param {* Float} width                   - The width of diagram
 * @param {* Float} height                  - The height of diagram 
 * @param {* Int} numStrings                - The number of strings 
 * @param {* Int} numFrets                  - The number of frets
 * @param {* String} chordNameUserInput     - The name of chord
 * @param {* Array} fingerUsedUserInput     - The fingers used as Array<String> eg ["-", "-", "1", "2", "3", "-"] for the chord A
 * @param {* Array} stringPositionUserInput - The fingers position as Array<String>, open ("o"), close ("x") strings and number of fret for each finger, eg ["x", "o", "2", "2", "2", "o"]
 * @param {* Float} strGridLinesThickness   [optional] - The thickness of the strings. If no value passes then it is autocalculated
 * @param {* Float} fretGridLinesThickness  [optional] - The thickness of the frets. If no value passes then it is autocalculated
 */
function createChordDiagram(xx, yy, width, height, numStrings, numFrets, chordNameUserInput, stringPositionUserInput, fingerUsedUserInput, strGridLinesThickness, fretGridLinesThickness)
{
    //The obj that will group the chord diagram elements together
    var chordGroup = app.activeDocument.groupItems.add();

    // create the frets -----
    var fretX = xx;      
    var fretY = yy; 
    var fretGap = height / numFrets; // the gap between frets

    // if no fretGridLinesThickness input then autosize
    if(fretGridLinesThickness == undefined) fretGridLinesThickness = width / 300;
    
    var frets = []; // array of shape paths
    for (var i = 0 ; i < numFrets + 1 ; i++)    // we add +1 because of the "nut" 
    {
        var shapePath = chordGroup.pathItems.add();         // shape obj
        shapePath.strokeColor = makeColor(0, 0, 0, 100);
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        shapePath.strokeWidth = fretGridLinesThickness;
        shapePath.filled = false;
        shapePath.stroked = true;
        shapePath.setEntirePath([[fretX, fretY], [fretX + width, fretY]]);  // draw fret
        shapePath.closed = true;

        fretY = fretY - fretGap;    // change the value for the next fret

        frets.push(shapePath);      // add fret to array for easy manipulation later
    }
    
    
    // create strings -----
    var strX = xx;
    var srtY = yy;
    var srtGap = width / (numStrings - 1); // the gap between strings

    // if no strGridLinesThickness input then autosize
    if(strGridLinesThickness == undefined) strGridLinesThickness = width / 100;

    var strings = [];   // array of shape paths
    for (var ii = 0 ; ii < numStrings; ii++)
    {
        var shapePath = chordGroup.pathItems.add();             // shape obj
        shapePath.stroked = true;
        shapePath.strokeColor = makeColor(0, 0, 0, 100);
        shapePath.fillColor = makeColor(0, 0, 0, 100);
        shapePath.filled = false;
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.MITERENDJOIN;
        shapePath.strokeWidth = strGridLinesThickness;
        shapePath.setEntirePath([[strX, srtY], [strX, srtY - height]]);     // draw string
        shapePath.closed = true;

        strX = strX + srtGap;      // change the value for the next string

        strings.push(shapePath);    // add string to array easy manipulation later
    }
 
    //Placing the name of the chord -----
    var textRef = chordGroup.textFrames.add();      // text obj
    var fsize = width / 5; // TODO Figure out a better way to set font size 
    textRef.position = Array(xx + width /2, yy + fsize * 1.2);
    textRef.contents = chordNameUserInput;
    textRef.textRange.size = fsize;
    textRef.textRange.justification = Justification.CENTER;
    //textRef.textFont = app.textFonts.getByName(chordFontLaber);
    textRef.textRange.characterAttributes.textFont = textFonts.getByName(chordFontLaber);
    
    
    //Placing the fingering, fingers wise -----
    var fingerUsedTextRef = [];           // array of text oj
    var fingerUsedFontStyle = [];         // array of font attributes
    var frtGap = height / (numFrets);   // the gap between frets

    // positioning the fingering on diagram
    for (var f = 0; f < numStrings; f++ )
    {
        if (isNaN(parseInt(fingerUsedUserInput[f])) || parseInt(fingerUsedUserInput[f]) == 0) fingerUsedUserInput[f] = "";       // if string is empty (""), will vanish (desired)
        fingerUsedTextRef[f] = chordGroup.textFrames.pointText(
                [xx + (srtGap * f) - (srtGap / 8), yy - height - frtGap / 2]);          // pointText obj
        fingerUsedTextRef[f].contents = fingerUsedUserInput[f];                         // apply user input text in contents
        fingerUsedFontStyle[f] = fingerUsedTextRef[f].textRange.characterAttributes;    
        fingerUsedFontStyle[f].textFont = app.textFonts.getByName(chordFont); //TODO determine font
        fingerUsedFontStyle[f].size = frtGap / 2;   // TODO Figure out a better way to set font size
    }

    fingersCopy = []; //helper array to figure the neck position
    for (var s = 0; s < numStrings; s++ )
    {
        //lowercase only, change zero to 'o'
        if (stringPositionUserInput[s] == "X") stringPositionUserInput[s] = "x";
        if (stringPositionUserInput[s] == "O" || stringPositionUserInput[s] == "0") stringPositionUserInput[s] = "o";

        if(!isNaN(parseInt(stringPositionUserInput[s])))
        {
            var val = stringPositionUserInput[s];
            fingersCopy.push(val);
        }
    }

    //sort fingered frets from low to high
    fingersCopy.sort(function(a, b) {return a - b;}); 
    
    // the gap from nut to start of diagram
    var neckGap = 0; 
    // if the lowest fretted fret is higher than the 2rd fret
    if(Number(fingersCopy[0]) > 2) 
    {
        //determing the fret number of the diagram
        neckGap = Number(fingersCopy[0]) - 1; 
        
        neckGapTextRef = chordGroup.textFrames.pointText([xx - srtGap * 1.05, yy - frtGap * .75]);        // pointText obj
        neckGapTextRef.contents = (neckGap + 1).toString();                                     // apply the neckGap as text in contents
        neckGapFontStyle = neckGapTextRef.textRange.characterAttributes;
        neckGapFontStyle.textFont = app.textFonts.getByName(chordFont); //TODO determine font
        neckGapFontStyle.size = srtGap * .75;   // TODO Figure out a better way to set font size
    }
    else    // if the lowest fretted fret is not higher than the the 2rd fret....
    {
        // ...check if the highest fret is bigger than the total frets in diagram... 
        if(Number(fingersCopy[fingersCopy.length - 1]) > numFrets) 
        {
            // ...so the neckGap will reach the lowest fingered fret.
            neckGap = Number(fingersCopy[0]) - 1;

            neckGapTextRef = chordGroup.textFrames.pointText([xx - srtGap * 1.05, yy - frtGap * .75]);
            neckGapTextRef.contents = (neckGap+1).toString();
            neckGapFontStyle = neckGapTextRef.textRange.characterAttributes;
            neckGapFontStyle.textFont = app.textFonts.getByName(chordFont);
            neckGapFontStyle.size = srtGap * .75;
        }   
        // else the fret 0 is the "nut", so make it bold
        else frets[0].strokeWidth *= 10; 
    }
   
    //Placing the fingering, frets wise -----
    var stringNumberTextRef=[];     // array of text oj
    var stringNumberFontStyle=[];   // array of font attributes 

    // positioning the fingering on diagram
    for (var s = 0; s < numStrings; s++ )
    {   
        // if is closed string
        if (stringPositionUserInput[s] == "x")
        {
            stringNumberTextRef[s] = chordGroup.textFrames.pointText([xx + (srtGap * s) - (srtGap / 8), yy + srtGap / 8]);     // pointText obj
            stringNumberTextRef[s].contents = stringPositionUserInput[s];                                               // apply user input text in contents
            stringNumberFontStyle[s] = stringNumberTextRef[s].textRange.characterAttributes;
            stringNumberFontStyle[s].textFont = app.textFonts.getByName(chordFont); //TODO determine font
            stringNumberFontStyle[s].size = srtGap / 2; // TODO Figure out a better way to set font size
        } 
        // if is open string
        else  if (stringPositionUserInput[s] == "o")
        {
            stringNumberTextRef[s] = chordGroup.textFrames.pointText([xx + (srtGap * s) - (srtGap / 8), yy + srtGap / 8]);
            stringNumberTextRef[s].contents = stringPositionUserInput[s];
            stringNumberFontStyle[s] = stringNumberTextRef[s].textRange.characterAttributes;
            stringNumberFontStyle[s].textFont = app.textFonts.getByName(chordFont);
            stringNumberFontStyle[s].size = srtGap / 2; // TODO Figure out a better way to set font size
        } 
        // if is fingering draw circle
        else if (Number(stringPositionUserInput[s]) < numFrets + 1 + neckGap)
        {
            var shapeItem = chordGroup.pathItems;

            var radius;
            radius = srtGap < frtGap ? srtGap : frtGap;
            radius *= .9;
            var offset = srtGap < frtGap ? (srtGap - radius) / 2 : (frtGap - radius) / 2;

            var finger = shapeItem.ellipse(yy - frtGap * (Number(stringPositionUserInput[(s)]) - 1 - neckGap) - offset, xx + srtGap * s - srtGap / 2 * frtGap / srtGap + offset, radius, radius);          
            finger.strokeWidth = 0;
            finger.fillColor = makeColor(0, 0, 0, 100);
            finger.strokeColor = makeColor(0, 0, 0, 100);
            finger.filled = true;
            
        }
        else //invalid fingered fret, make the string red
        {
            var red = makeColor(0, 99, 100, 0);
            strings[s].strokeColor = red;
            strings[s].strokeWidth *= 3;
            fingerUsedTextRef[s].contents = "!!";
        }
    }

    if (drawBarre)
    {  
        for (var i = 1; i < 5; i++)
        {
        //if same finger is on more than 1 fret, draw barre
            var l = getIndexOf(fingerUsedUserInput, i);
            var h = getLastIndexOf(fingerUsedUserInput, i);

            if (l != h)
            {
                var barre = chordGroup.pathItems.add();       
                barre.setEntirePath([[xx + srtGap * l * frtGap / srtGap + offset, yy - frtGap * (Number(stringPositionUserInput[(l)]) - 1 - neckGap) - frtGap/2], 
                    [xx + srtGap * h * frtGap / srtGap + offset, yy - frtGap * (Number(stringPositionUserInput[(l)]) - 1 - neckGap) - frtGap/2]]);  // draw barret
                barre.strokeWidth = radius * .7;
                barre.strokeColor = makeColor(0, 0, 0, 100);
                barre.stroked = true;
                barre.closed = true;
            }
        }
    }
    
}

function getIndexOf(arr, value)
{
    var index = -1;
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] == value)
        {
            index = i;
            break;

        }
    }

    return index;
}

function getLastIndexOf(arr, value)
{
    var index = -1;
    for (var i = arr.length - 1; i > -1; i--)
    {
        if (arr[i] == value)
        {
            index = i;
            break;

        }
    }

    return index;
}

function makeColor(c, m, y, k) // TODO: change to CMYK
{
    var col = new CMYKColor();
    
    col.cyan = c;
    col.magenta = m;
    col.yellow = y;
    col.black = k;

    return col;
}

/** Sends a function with its arguments to be executed on Illustrator via BridgeTalk
 * 
 * @param {*String} func The name of the function to sent as String
 * @param {*Array} args The arguments of the function to sent as Array of Strings. Single arguments can be sent without being inside an Array
 */
function btExecute(func, args) 
{
    var bridgeTalk = new BridgeTalk();
   
    //bake the arguments
    if (args != undefined) 
    {
        if ((typeof args == 'string') || (args instanceof String)) 
            stringArgs = ((args != undefined) ? ('"' + args + '"') : '');
		 else stringArgs = args;
	} 
    else stringArgs = '';
    
    //prepare the message
    var msg = (eval(func) + '\r ' + func + '(' + stringArgs + ');');
	bridgeTalk.target = "Illustrator";
    bridgeTalk.body = msg;
    
	return bridgeTalk.send();
}

function init()
{
    // Creates a new document if none exists
    if ( app.documents.length < 1 ) {doc = app.documents.add();}
    else {doc = app.activeDocument;}

    // Inspecting if the active layer of the document is locked
    if (doc.activeLayer.locked) 
    {
        alert("The active layer is locked");
        return;     // TODO: unlock layer or create a new layer)
    } else doc = app.activeDocument.activeLayer;
}
