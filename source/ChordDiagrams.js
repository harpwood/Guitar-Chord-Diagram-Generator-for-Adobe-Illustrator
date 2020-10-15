// Creates a new document if none exists
if ( app.documents.length < 1 ) {var doc = app.documents.add();}
else {var  doc = app.activeDocument;}

init();
createChordDiagram(100, 500, 120, 120, 6, 5, "F7#5#9", ["1","0","1","2","2","4"], ["T","-","1","3","3","4"],);

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
    
    for (var f = 0; f < numStrings; f++ )
    {
        if (fingerUsedUserInput[f] == "-") fingerUsedUserInput[f] = "";
        fingerUsedTextRef[f] = doc.textFrames.pointText([xx + (srtGap * f) - (srtGap / 8), yy - height - srtGap / 2]);
        fingerUsedTextRef[f].contents = fingerUsedUserInput[f];
        fingerUsedFontStyle[f] = fingerUsedTextRef[f].textRange.characterAttributes;
        fingerUsedFontStyle[f].textFont = app.textFonts.getByName("Calibri");
        fingerUsedFontStyle[f].size = srtGap / 2;
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
            finger.ellipse(yy - srtGap * (Number(stringPositionUserInput[(s)]) - 1 - neckGap), xx + srtGap * s - srtGap / 2, srtGap, srtGap);          
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

function init()
{
    

    //sets fill and stroke defaults to true
    doc.defaultFilled = true;
    doc.defaultStroked = true;

    //Inspecting if the active layer of the document is locked

    if (doc.activeLayer.locked) 
    {
        alert("The active layer is locked");
        return;
    } else doc = app.activeDocument.activeLayer;

    var newRGBColor = new RGBColor();
    var storeRGBColorF = new RGBColor();
    var storeRGBColorB = new RGBColor();

    //TODO: save current colors and restore them at the end of the script
    //Restore the colors
    storeRGBColorF = app.activeDocument.defaultFillColor ;
    storeRGBColorB = app.activeDocument.defaultStrokeColor;

    //Turn colors black
    newRGBColor.red = 0;
    newRGBColor.green = 0;
    newRGBColor.blue = 0;
    app.activeDocument.defaultFillColor = newRGBColor;
    app.activeDocument.defaultStrokeColor = newRGBColor;
   
}