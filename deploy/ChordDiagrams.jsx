if ( app.documents.length < 1 ) {doc = app.documents.add();}
else {doc = app.activeDocument;}
init();

var myWindow = new Window("dialog", "Chord Diagram Creator");

// Chord name input
var chordNameInput = myWindow.add('group {orientation: "row"}');
chordNameInput.alignment = "left"

chordNameInput.add("statictext", undefined, "Chord Name:");
var chordName = chordNameInput.add("edittext", undefined, "");

chordName.characters = 6;
chordName.active = true;


//Number of Strings dropdown menu 
var strFretsGroup = myWindow.add('group {orientation: "row"}');
strFretsGroup.alignment = "left"

var numberOfStrings = strFretsGroup.add("statictext", undefined, "Number of Strings:");
var numberOfStringsDropDown = strFretsGroup.add("dropdownlist", undefined, ["4 Strings", "5 Strings", "6 Strings", "7 Strings", "8 Strings", "9 Strings"]);
numberOfStringsDropDown.selection = numberOfStringsDropDown.items[2];

//Number of Frets dropdown menu
var numberOfFrets = strFretsGroup.add("statictext", undefined, "Number of Frets:");
var numberOfFretsDropDown = strFretsGroup.add("dropdownlist", undefined, ["4 Frets", "5 Frets", "6 Frets", "7 Frets", "8 Frets", "9 Frets"]);
numberOfFretsDropDown.selection = numberOfFretsDropDown.items[1];

//finger position input
var fingerPositions = myWindow.add('group {orientation: "row"}');
fingerPositions.alignment = "left"

fingerPositions.add("statictext", undefined, "Fingers Used:");

var fingerPosStr = [];

for (i = 0; i < 9; i++)
{
    fingerPosStr.push(fingerPositions.add("edittext", undefined, ""));
    //fingerPosStr[i] = fingerPositions.add("edittext", undefined, "");
    fingerPosStr[i].characters = 2;

    if (i > 5) fingerPosStr[i].visible = false;
}


// Fret Position Input
var fretPositions = myWindow.add('group {orientation: "row"}');
fretPositions.alignment = "left"

fretPositions.add("statictext", undefined, "Fret Positions:");

var fretPosStr = [];

for (i = 0; i < 9; i++)
{
    fretPosStr.push(fretPositions.add("edittext", undefined, ""));
    
    fretPosStr[i].characters = 2;

    if (i > 5) fretPosStr[i].visible = false;
}

// X,Y Position Input
var xyPosition = myWindow.add('group {orientation: "row"}');
xyPosition.alignment = "left"

xyPosition.add("statictext", undefined, "Position X:");
var xPosistion = xyPosition.add("edittext", undefined, "0");

xyPosition.add("statictext", undefined, "Position Y:");
var yPosistion = xyPosition.add("edittext", undefined, "0");

xPosistion.characters = 4;
yPosistion.characters = 4;

// Width,Height Diagram Size Input
var diagramSize = myWindow.add('group {orientation: "row"}');
diagramSize.alignment = "left"

diagramSize.add("statictext", undefined, "Diagram Size X:");
var diagramWidth = diagramSize.add("edittext", undefined, "100");

diagramSize.add("statictext", undefined, "Diagram Size Y:");
var diagramHeight = diagramSize.add("edittext", undefined, "100");

diagramWidth.characters = 4;
diagramHeight.characters = 4;

//String and Fret Thickness
var stringAndFretThickness = myWindow.add('group {orientation: "row"}');
stringAndFretThickness.alignment = "left"

stringAndFretThickness.add("statictext", undefined, "String Thickness:");
var stringThickness = stringAndFretThickness.add("edittext", undefined, "auto");

stringAndFretThickness.add("statictext", undefined, "Fret Thickness:");
var fretThickness = stringAndFretThickness.add("edittext", undefined, "auto");

stringThickness.characters = 4;
fretThickness.characters = 4;

 //Dynamic UI Changes
 numberOfStringsDropDown.onChange = function () {

    for (i = 4; i < 10; i++)
    {
        if (numberOfStringsDropDown.selection == numberOfStringsDropDown.items[i-4]) 
        {
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
            var w = parseInt(diagramWidth.text);
            var currentString = (numberOfStringsDropDown.selection).text;
            var currentFret = (numberOfFretsDropDown.selection).text;
            var s = parseInt(currentString.charAt(0));
            var f = parseInt(currentFret.charAt(0)) + 1;
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
            var valW = parseInt(diagramWidth.text);
            var currentString = (numberOfStringsDropDown.selection).text;
            var valP = parseInt(currentString.charAt(0));
            var changedHeight =  (i) * valW / valP;
            diagramHeight.text = String(changedHeight);
            myWindow.update();
        } 
        
    }

 }

//Buttons
var myButtonGroup = myWindow.add("group");
myButtonGroup.alignment = "right";
myWindow.createBtn = myButtonGroup.add("button", undefined, "Create Chord");
myWindow.closeBtn = myButtonGroup.add("button", undefined, "Close");

myWindow.layout.layout(true);

myWindow.createBtn.onClick = function () {

    
    
    
    
    
    
    var xPosArg = parseFloat(xPosistion.text.replace(",", ".")); 
    var yPosArg = parseFloat(yPosistion.text.replace(",", "."));
    var dWArg = parseFloat(diagramWidth.text.replace(",", "."));
    var dHArg = parseFloat(diagramHeight.text.replace(",", "."));
    
    var numberOfStringsArg = parseFloat(numberOfStringsDropDown.selection.text.replace(",", ".").charAt(0));
    var numberOfFretsArg = parseFloat(numberOfFretsDropDown.selection.text.replace(",", ".").charAt(0));
    var nameOfChord = chordName.text; 
    
    var fretPosArg = [];
    for (var i = 0; i < fretPosStr.length; i++)
    {
        if (fretPosStr[i].text == "") fretPosArg.push("x");
        else fretPosArg.push(fretPosStr[i].text);
    }

    var fingerPosArg = [];
    for (var i = 0; i < fingerPosStr.length; i++)
    {
        fingerPosArg.push(fingerPosStr[i].text);
    }
    
   // var thickStrings = stringThickness.text;
    //var thickFrets = fretThickness.text;

    if (nameOfChord == "") nameOfChord = " ";
    createChordDiagram(xPosArg, yPosArg, dWArg, dHArg, numberOfStringsArg, numberOfFretsArg, nameOfChord, fretPosArg, fingerPosArg);

    myWindow.close();

}
myWindow.closeBtn.onClick = function () {


    myWindow.close();

}

myWindow.show();






//createChordDiagram(100, 500, 120, 120, 6, 5, "F7#5#9", ["1","0","1","2","2","4"], ["T","-","1","3","3","4"],);

/**
 * @param {*} xx                        x position of the diagram
 * @param {*} yy                        y position of the diagram
 * @param {*} width                     width of diagram
 * @param {*} height                    height of diagram 
 * @param {*} numStrings                number of strings 
 * @param {*} numFrets                  number of frets
 * @param {*} chordNameUserInput        name of chord
 * @param {*} fingerUsedUserInput       fingering as array eg ["-", "-", "1", "2", "3", "-"] for the chord A
 * @param {*} stringPositionUserInput   open ("o"), close ("x") strings and number of fret for each finger as array eg ["x", "o", "2", "2", "2", "o"]
 * @param {*} [strGridLinesThickness]   (optional) The thickness of the strings. If no value passes then it is autocalculated
 * @param {*} [fretGridLinesThickness]  (optional) The thickness of the frets. If no value passes then it is autocalculated
 */
function createChordDiagram(xx, yy, width, height, numStrings, numFrets, chordNameUserInput, stringPositionUserInput, fingerUsedUserInput, strGridLinesThickness, fretGridLinesThickness)
{
    // Creates a new document if none exists


    //create frets
    var fretX = xx;      
    var fretY = yy; 
    var fretGap = height / numFrets; // the gap between frets
    //if no fretGridLinesThickness input then autosize
    if(fretGridLinesThickness == undefined) fretGridLinesThickness = width / 300;
    
    var frets = [];
    for (var i = 0 ; i < numFrets + 1 ; i++)
    {
        
        var shapePath = app.activeDocument.activeLayer.pathItems.add();

        shapePath.strokeColor = makeColor(0,0,0);
        shapePath.fillColor = makeColor(0,0,0);
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        shapePath.strokeWidth = fretGridLinesThickness;
        shapePath.filled = false;
        shapePath.stroked = true;
        
        shapePath.setEntirePath([[fretX, fretY], [fretX + width, fretY]]);

        fretY = fretY - fretGap;

        shapePath.closed = true;

        frets.push(shapePath);
    }

    
    //create strings
    var strX = xx;
    var srtY = yy;
    var srtGap = width / (numStrings - 1); // the gap between strings
    //if no strGridLinesThickness input then autosize
    if(strGridLinesThickness == undefined) strGridLinesThickness = width / 100;
    var strings = [];
    for (var ii = 0 ; ii < numStrings; ii++)
    {
        var shapePath = app.activeDocument.activeLayer.pathItems.add();
   
        shapePath.stroked = true;
        shapePath.strokeColor = makeColor(0,0,0);
        shapePath.fillColor = makeColor(0,0,0);
        shapePath.filled = false;
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.MITERENDJOIN;
        shapePath.strokeWidth = strGridLinesThickness;
    
        shapePath.setEntirePath([[strX, srtY], [strX, srtY - height]]);

        strX = strX + srtGap;
        
        shapePath.closed = true;

        strings.push(shapePath);
    }

 
    //Placing the name of the chord
    var fsize = width / 5;
    var pathRef = doc.pathItems.rectangle(yy + fsize * 1.2, xx, width ,fsize);
    var textRef = doc.textFrames.areaText(pathRef);
    var textPar = textRef.paragraphs.add(chordNameUserInput);

    textRef.textRange.characterAttributes.size = fsize;
    textPar.textFont = app.textFonts.getByName("Calibri");
    var paraAttr = textPar.paragraphAttributes;
    paraAttr.justification = Justification.CENTER;
    

    //Placing the fingering, fingers wise
    var fingerUsedTextRef=[];
    var fingerUsedFontStyle=[];   
    var frtGap = height / (numFrets);
    for (var f = 0; f < numStrings; f++ )
    {
        if (fingerUsedUserInput[f] == "-") fingerUsedUserInput[f] = "";
        fingerUsedTextRef[f] = doc.textFrames.pointText([xx + (srtGap * f) - (srtGap / 8), yy - height - frtGap / 2]);
        fingerUsedTextRef[f].contents = fingerUsedUserInput[f];
        fingerUsedFontStyle[f] = fingerUsedTextRef[f].textRange.characterAttributes;
        fingerUsedFontStyle[f].textFont = app.textFonts.getByName("Calibri");
        fingerUsedFontStyle[f].size = frtGap / 2;
    }

    fingersCopy = []; //helper array to figure the neck position

    //lowercase only, change zero to 'o'
    for (var s = 0; s < numStrings; s++ )
    {
        if (stringPositionUserInput[s] == "X") stringPositionUserInput[s] = "x";
        
        if (stringPositionUserInput[s] == "O" || stringPositionUserInput[s] == "0") stringPositionUserInput[s] = "o";


        if(parseInt(stringPositionUserInput[s]))
        {
            var val = stringPositionUserInput[s];
            fingersCopy.push(val);
        }

    }

    //sort fingered frets from low to high
    fingersCopy.sort(function(a, b) {return a - b;}); 
    
    var neckGap = 0; 
    if(Number(fingersCopy[0]) > numFrets + 1) //if the lowest fretted fret is less than the total strings
    {
        neckGap = Number(fingersCopy[0]) - 1; //determing the fret number of the diagram

        neckGapTextRef = doc.textFrames.pointText([xx - srtGap / 2, yy - srtGap * .75]);
        neckGapTextRef.contents = (neckGap + 1).toString();
        neckGapFontStyle = neckGapTextRef.textRange.characterAttributes;
        neckGapFontStyle.textFont = app.textFonts.getByName("Calibri");
        neckGapFontStyle.size = srtGap * .75;
    }
    else
    {
         

        if(Number(fingersCopy[fingersCopy.length - 1]) > numFrets) // && Number(fingersCopy[fingersCopy.length - 1]) - Number(fingersCopy[0]) <= numStrings)
        {
            neckGap = Number(fingersCopy[0]) - 1;

            neckGapTextRef = doc.textFrames.pointText([xx - srtGap / 2, yy - srtGap * .75]);
            neckGapTextRef.contents = (neckGap+1).toString();
            neckGapFontStyle = neckGapTextRef.textRange.characterAttributes;
            neckGapFontStyle.textFont = app.textFonts.getByName("Calibri");
            neckGapFontStyle.size = srtGap * .75;
        }
        else frets[0].strokeWidth *= 10; // fret 0 aka nut, so make it bold
    }
   
    //Placing the fingering, frets wise
    var stringNumberTextRef=[];
    var stringNumberFontStyle=[];   

    for (var s = 0; s < numStrings; s++ )
    {   
        if (stringPositionUserInput[s] == "x")
        {
            stringNumberTextRef[s] = doc.textFrames.pointText([xx + (srtGap * s) - (srtGap / 8), yy + srtGap / 8]);
            stringNumberTextRef[s].contents = stringPositionUserInput[s];
            stringNumberFontStyle[s] = stringNumberTextRef[s].textRange.characterAttributes;
            stringNumberFontStyle[s].textFont = app.textFonts.getByName("Calibri");
            stringNumberFontStyle[s].size = srtGap / 2;
        } 
        else  if (stringPositionUserInput[s] == "O" || stringPositionUserInput[s] == "o" || stringPositionUserInput[s] == "0")
        {
            stringNumberTextRef[s] = doc.textFrames.pointText([xx + (srtGap * s) - (srtGap / 8), yy + srtGap / 8]);
            stringNumberTextRef[s].contents = stringPositionUserInput[s];
            stringNumberFontStyle[s] = stringNumberTextRef[s].textRange.characterAttributes;
            stringNumberFontStyle[s].textFont = app.textFonts.getByName("Calibri");
            stringNumberFontStyle[s].size = srtGap / 2;
        } 
        else if (Number(stringPositionUserInput[s]) < numFrets + 1 + neckGap) //|| (Number(stringPositionUserInput[s]) < (numStrings + 2 - neckGap) && Number(fingersCopy[fingersCopy.length - 1]) > numStrings - 1) )
        {
            var finger = doc.pathItems;
            finger.strokeColor = makeColor(0,0,0);
            finger.fillColor = makeColor(0,0,0);
            finger.filled = true;
            var radius;

            if (srtGap < frtGap) radius = srtGap; else radius = frtGap;
            finger.ellipse(yy - frtGap * (Number(stringPositionUserInput[(s)]) - 1 - neckGap), xx + srtGap * s - srtGap / 2 * frtGap / srtGap, radius, radius);          
        }
        else //invalid fingered fret, make the string red
        {
            var red = makeColor(255,0,0);
            strings[s].strokeColor = red;
            strings[s].strokeWidth *= 3;
            fingerUsedTextRef[s].contents = "!!";
        }
    }
}

function makeColor(r,g,b) //TODO: change to CMYK
{
    var c = new RGBColor();
    c.red   = r;
    c.green = g;
    c.blue  = b;
    return c;
}

