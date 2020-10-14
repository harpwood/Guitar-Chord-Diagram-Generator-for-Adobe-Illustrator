// Creates a new document if none exists
if ( app.documents.length < 1 ) {var doc = app.documents.add();}
else {var  doc = app.activeDocument;}

init();
createChordDiagram(100, 500, 150, 150, 6, 5, "A7#5b9", ["-","-","1","3","3","3"], ["x","x","1","2","2","2"] );




function createChordDiagram(xx, yy, width, height, numStrings, numFrets, chordNameUserInput, fingerUsedUserInput, stringPositionUserInput)
{
	//xx
	//yy
	//width
	//height
	//numStrings
	//numFrets
	//chordNameUserInput
	//fingerUsedUserInput
	//stringPositionUserInput
	//TODO Fret number

    //crate frets
    //var fingersY;
    var fretX = xx;      //We store the Starting position xx,y coordinates into temporary vars...
    var fretY = yy; 
    var fretGap = height / numFrets; // the gap between frets
    for (var i = 0 ; i < numFrets + 1 ; i++)
    {
        
        var shapePath = app.activeDocument.activeLayer.pathItems.add();

        shapePath.fillColor = makeColor(0,0,0);
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.MITERENDJOIN;
        shapePath.strokeWidth = fretGridLinesThickness;
        shapePath.filled = false;
        shapePath.stroked = true;
        
        
        shapePath.setEntirePath([[fretX, fretY], [fretX + width, fretY]]);
        fretY = fretY - fretGap;

        shapePath.closed = true;
    
    }

    
    var strX = xx;
    var srtY = yy;
    var srtGap = width / (numStrings - 1); // the gap between strings
    for (var ii = 0 ; ii < numStrings; ii++)
    {
        var shapePath = app.activeDocument.activeLayer.pathItems.add();

   
        shapePath.stroked = true;
        shapePath.fillColor = makeColor(0,0,0);
        shapePath.filled = false;
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.MITERENDJOIN;
        shapePath.strokeWidth = strGridLinesThickness;
    
        shapePath.setEntirePath([[strX, srtY], [strX, srtY - height]]);

        
        strX = strX + srtGap;
        

        shapePath.closed = true;

    }

 
    //BigBandChords
    var fsize = width / 5;
    var pathRef = doc.pathItems.rectangle(yy + fsize * 1.2, xx, width ,fsize);
    var textRef = doc.textFrames.areaText(pathRef);
    var textPar = textRef.paragraphs.add(chordNameUserInput);

    textRef.textRange.characterAttributes.size = fsize;
    textPar.textFont = app.textFonts.getByName("Calibri");
    var paraAttr = textPar.paragraphAttributes;
    paraAttr.justification = Justification.CENTER;

    

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

    //TODO: lowercase only, change zero to 'o'
//    var StringPositionUserInput = ["x","x","o","2","3","2"];
    
    var stringNumberTextRef=[];
    var stringNumberFontStyle=[];   

    for (var s=0; s < numStrings; s++ )
    {
        if (stringPositionUserInput[s] == "X" || stringPositionUserInput[s] == "x")
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
        else if (Number(stringPositionUserInput[s]) && stringPositionUserInput[s] != "0" && Number(stringPositionUserInput[s]) < numStrings -1)
        {
            var finger = doc.pathItems;
            
            finger.fillColor = makeColor(0,0,0);

            finger.filled = true;
            finger.ellipse(yy - srtGap * (Number(stringPositionUserInput[(s)]) - 1), xx + srtGap * s - srtGap / 2, srtGap, srtGap);          
        
        }
     
    }

}

function makeColor(r,g,b)
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