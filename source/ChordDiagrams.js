//#target illustrator
//#targetengine 'main'

// Constants
DEFAULT_FONT            = getDefaultFont();
DEFAULT_NUMERIC_FONT    = ScriptUI.newFont("palette").name;
AUTO                    = "auto";
SPC                     = "spc";
CHORD_FONT              = "chordFont";
CHORD_FONT_SIZE         = "chordFontSize";
CHORD_FONT_LABEL        = "chordFontLabel";
CHORD_LABEL_FONT_SIZE   = "chordLabelFontSize";
NUMBER_OF_STRINGS_ITEM  = "numberOfStringsItem";
NUMBER_OF_FRETS_ITEM    = "numberOfFretsItem"; 
DRAW_BARRE              = "drawBarre";
POS_X                   = "posX";
POS_Y                   = "posY";
CAN_REPOSITION_X        = "canRepositionX";
CAN_REPOSITION_Y        = "canRepositionY";
IS_REVERSED             = "isReversed";
WIDTH                   = "width";
HEIGHT                  = "height"; 
RE_POS_SPACING          = "rePosSpacing";
IS_LINK_HEIGHT_TO_FRETS = "isLinkHeightToFrets";
IS_LINK_WIDTH_TO_HEIGHT = "isLinkWidthToHeight";
STRING_THICKNESS        = "stringThickness";
FRET_THICKNESS          = "fretThickness";
IS_LINK_THICKNESS       = "isLinkThickness";
NUT_THICKNESS           = "nutThickness";
FRET_NUMBER_SIZE        = "fretNumberSize";

canReset = false;

init(); 

function loadPreferences()
{
    prefs = {};     // object that handles prefs data (save/load)
    var prefsFile = File(Folder.userData + "/ChordDiagramPrefs.json"); 

    if (!prefsFile.exists)  
    {
        // if prefs file does not exist apply default prefs and save it
        prefs.chordFontLabel = DEFAULT_FONT;
        prefs.chordLabelFontSize = AUTO;
        prefs.chordFont = DEFAULT_NUMERIC_FONT;
        prefs.chordFontSize = AUTO;
        prefs.numberOfStringsItem = 2;
        prefs.numberOfFretsItem = 1;
        prefs.drawBarre = false;
        prefs.posX = "0";
        prefs.posY = "0";
        prefs.canRepositionX = false;
        prefs.canRepositionY = false;
        prefs.isReversed = false;
        prefs.rePosSpacing = SPC;
        prefs.width = "100";
        prefs.height = "100";
        prefs.isLinkHeightToFrets = true;
        prefs.isLinkWidthToHeight = true;
        prefs.stringThickness = AUTO;
        prefs.fretThickness = AUTO;
        prefs.isLinkThickness = true;
        prefs.nutThickness = AUTO;
        prefs.fretNumberSize = AUTO;

        savePrefs();
    }
    else
    {
        // if prefs file exist load the prefs data and parse them
        prefsFile.open("r");
        var data = prefsFile.read();
        prefsFile.close();

        data = JSON.parse(data);

        for (var i in data)
        {
            switch (i)  // evaluate loaded data and apply them to prefs obj, if evaluation fails apply default value
            {
                case CHORD_FONT_LABEL:
                    prefs.chordFontLabel = (data[i] == undefined) ? DEFAULT_FONT : data[i];
                    break;       
                case CHORD_LABEL_FONT_SIZE:
                    prefs.chordLabelFontSize = (data[i] == undefined) ? AUTO : data[i];
                    break;
                case CHORD_FONT:
                    prefs.chordFont = (data[i] == undefined) ? DEFAULT_NUMERIC_FONT : data[i];
                    break;
                case CHORD_FONT_SIZE: 
                    prefs.chordFontSize = (data[i] == undefined) ? AUTO : data[i];
                    break;
                case NUMBER_OF_STRINGS_ITEM:
                    prefs.numberOfStringsItem = (data[i] == undefined) ? 2 : data[i];
                    break;  
                case NUMBER_OF_FRETS_ITEM:
                    prefs.numberOfFretsItem = (data[i] == undefined) ? 1 : data[i];
                    break;    
                case DRAW_BARRE:
                    prefs.drawBarre = (data[i] == undefined) ? false : data[i];
                    break;              
                case POS_X:
                    prefs.posX = (data[i] == undefined) ? "0" : data[i];
                    break;                   
                case POS_Y:
                    prefs.posY = (data[i] == undefined) ? "0" : data[i]; 
                    break;                
                case CAN_REPOSITION_X:
                    prefs.canRepositionX = (data[i] == undefined) ? false : data[i];
                    break;        
                case CAN_REPOSITION_Y:
                    prefs.canRepositionY = (data[i] == undefined) ? false : data[i];
                    break;
                case IS_REVERSED:
                    prefs.isReversed = (data[i] == undefined) ? false : data[i];
                    break; 
                case RE_POS_SPACING: 
                    prefs.rePosSpacing = (data[i] == undefined) ? SPC : data[i];
                    break;
                case WIDTH:
                    prefs.width = (data[i] == undefined) ? "100" : data[i];
                    break;             
                case HEIGHT: 
                    prefs.height = (data[i] == undefined) ? "100" : data[i];
                    break;               
                case IS_LINK_HEIGHT_TO_FRETS:
                    prefs.isLinkHeightToFrets = (data[i] == undefined) ? true : data[i];
                    break;
                case IS_LINK_WIDTH_TO_HEIGHT:
                    prefs.isLinkWidthToHeight = (data[i] == undefined) ? true : data[i];
                    break; 
                case STRING_THICKNESS:
                    prefs.stringThickness = (data[i] == undefined) ? AUTO : data[i];
                    break;
                case FRET_THICKNESS:
                    prefs.fretThickness = (data[i] == undefined) ? AUTO : data[i];
                    break;          
                case IS_LINK_THICKNESS:
                    prefs.isLinkThickness = (data[i] == undefined) ? true : data[i];
                    break;   
                case NUT_THICKNESS:
                    prefs.nutThickness = (data[i] == undefined) ? AUTO : data[i];
                    break; 
                case FRET_NUMBER_SIZE:
                    prefs.fretNumberSize = (data[i] == undefined) ? AUTO : data[i];
                    break;
            }
        }
    }

   createUI();
}

function createUI()
{
    var myWindow = new Window("palette", "Chord Diagram Creator");          // UI base dialog box

    // Chord name input, font selection, font size group -------------------------------------------------------
    var chordNameInput = myWindow.add('group {orientation: "row"}');        // container 
    chordNameInput.alignment = "right";
    chordNameInput.add("statictext", undefined, "Chord Name:");             // text obj

    var chordName = chordNameInput.add("edittext", undefined, "");          // input obj
    chordName.characters = 6;
    chordName.active = true;

    // custom fonts group 1-------------------------------------------------------------------------------------
    chordNameInput.add("statictext", undefined, "Chord Font:");             // text obj
    var fontListMenu = chordNameInput.add("dropdownlist", undefined, []);   // dropdown menu obj
    fontListMenu.maximumSize = [130, 20];
    
    chordNameInput.add("statictext", undefined, "Font Size:");   // text obj
    var chordLabelFontSize = chordNameInput.add("edittext", undefined, prefs.chordLabelFontSize);  // input obj
    chordLabelFontSize.characters = 3;

      // apply user input and save prefs.chordLabelFontSize
      chordLabelFontSize.onChange = function()
      {
          prefs.chordLabelFontSize = chordLabelFontSize.text.replace(",", ".");
          
          try {btExecute('savePrefs');}
          catch(e){alert("Some went wrong: " + e, "Oops!!!");};
      }
    
    // custom fonts group 2---------------------------------------------------------------------------------------
    var customFontsGroup = myWindow.add('group {orientation: "row"}');          // container 
    customFontsGroup.alignment = "right"

    customFontsGroup.add("statictext", undefined, "Fret Number Size:");             // text obj
    var fretNumberSize = customFontsGroup.add("edittext", undefined, prefs.fretNumberSize);    // input obj
    fretNumberSize.characters = 3;

    // apply user input and save prefs.fretNumberSize
    fretNumberSize.onChange = function()
    {
        prefs.fretNumberSize = fretNumberSize.text.replace(",", ".");

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    customFontsGroup.add("statictext", undefined, "Frets Font:");             // text obj
    var fontListMenuFrets = customFontsGroup.add("dropdownlist", undefined, []);   // dropdown menu obj
    fontListMenuFrets.maximumSize = [130, 20];

    customFontsGroup.add("statictext", undefined, "Font Size:");                // text obj
    var chordFontSize = customFontsGroup.add("edittext", undefined, prefs.chordFontSize);    // input obj
    chordFontSize.characters = 3;

    // apply user input and save prefs.chordFontSize
    chordFontSize.onChange = function()
    {
        prefs.chordFontSize = chordFontSize.text.replace(",", ".");

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

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

    fontListMenu.selection = fontListMenu.items[getIndexOf(fontList, prefs.chordFontLabel)];
    fontListMenuFrets.selection = fontListMenuFrets.items[getIndexOf(fontList, prefs.chordFont)];
    
    // apply user input and save  prefs.chordFontLabel, prefs.chordFont
    fontListMenu.onChange = function () {
    
        for(var i = 0; i < iCount; i++)
        {
           if (fontListMenu.selection == fontListMenu.items[i])
           {
            prefs.chordFontLabel = fontList[i];
           }
        }

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    fontListMenuFrets.onChange = function () {
    
        for(var i = 0; i < iCount; i++)
        {
           if (fontListMenuFrets.selection == fontListMenuFrets.items[i])
           {
            prefs.chordFont = fontList[i];
           }
        }

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    // dropdown menus group, barre ------------------------------------------------------------------------------------
    var strFretsGroup = myWindow.add('group {orientation: "row"}');                             // container
    strFretsGroup.alignment = "left"

    // Number of Strings dropdown menu
    var numberOfStrings = strFretsGroup.add("statictext", undefined, "Number of Strings:");     // text obj
    var numberOfStringsDropDown = strFretsGroup.add("dropdownlist", undefined, 
        ["4 Strings", "5 Strings", "6 Strings", "7 Strings", "8 Strings", "9 Strings"]);        // dropdown menu obj
    numberOfStringsDropDown.selection = numberOfStringsDropDown.items[prefs.numberOfStringsItem];                       // default selected item

    // Number of Frets dropdown menu
    var numberOfFrets = strFretsGroup.add("statictext", undefined, "Number of Frets:");         // text obj
    var numberOfFretsDropDown = strFretsGroup.add("dropdownlist", undefined, 
        ["4 Frets", "5 Frets", "6 Frets", "7 Frets", "8 Frets", "9 Frets"]);                    // dropdown menu obj
    numberOfFretsDropDown.selection = numberOfFretsDropDown.items[prefs.numberOfFretsItem];                           // default selected item
    
    var drawBarreBox =  strFretsGroup.add('checkbox', undefined, "draw barre");                                           // tick box
    drawBarreBox.value = prefs.drawBarre;

    // apply user input and save prefs.drawBarre
    drawBarreBox.onClick = function () 
    {
        prefs.drawBarre = drawBarreBox.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    // finger position input group ---------------------------------------------------------------------------------
    var fingerPositions = myWindow.add('group {orientation: "row"}');       // container
    fingerPositions.alignment = "left"

    fingerPositions.add("statictext", undefined, "Fingers Used:");          // text obj

    var fingerPosStr = [];  // input obj array
    for (i = 0; i < 9; i++)
    {
        fingerPosStr.push(fingerPositions.add("edittext", undefined, ""));  // input obj
        fingerPosStr[i].characters = 2;

        //visibility based on available strings 
        if (i > prefs.numberOfStringsItem + 3) fingerPosStr[i].visible = false;
    }

    // fret Position input group ---------------------------------------------------------------------------------
    var fretPositions = myWindow.add('group {orientation: "row"}');     // container
    fretPositions.alignment = "left"

    fretPositions.add("statictext", undefined, "Fret Positions:");      // text obj

    var fretPosStr = [];    // input obj array
    for (i = 0; i < 9; i++)
    {
        fretPosStr.push(fretPositions.add("edittext", undefined, ""));      // input obj
        fretPosStr[i].characters = 2;

        //visibility based on available strings
        if (i > prefs.numberOfStringsItem + 3) fretPosStr[i].visible = false;
    }

    // X,Y Position input, group -------------------------------------------------------------------------------------
    var xyPosition = myWindow.add('group {orientation: "row"}');        // container
    xyPosition.alignment = "left"

    xyPosition.add("statictext", undefined, "Position X:");             // text obj
    var xPosistion = xyPosition.add("edittext", undefined, prefs.posX);        // input obj
    xPosistion.characters = 4;

    // apply user input and save prefs.posX
    xPosistion.onChange = function()
    {
        prefs.posX = xPosistion.text.replace(",", ".");
        
        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    xyPosition.add("statictext", undefined, "Position Y:");             // text obj
    var yPosistion = xyPosition.add("edittext", undefined, prefs.posY);        // input obj
    yPosistion.characters = 4;

    // apply user input and save prefs.posY
    yPosistion.onChange = function()
    {
        prefs.posY = yPosistion.text.replace(",", ".");
        
        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }
    
    xyPosition.add("statictext", undefined, "Reposition: ");            // text obj
    var repositionXBox = xyPosition.add('checkbox', undefined, "x");                         // tick box obj
    repositionXBox.value =  prefs.canRepositionX;
    
    // apply user input and save prefs.canRepositionX
    repositionXBox.onClick = function ()
    {
        prefs.canRepositionX = repositionXBox.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    var repositionYBox = xyPosition.add('checkbox', undefined, "y");                         // tick box obj
    repositionYBox.value =  prefs.canRepositionY;

    // apply user input and save prefs.canRepositionY
    repositionYBox.onClick = function ()
    {
        prefs.canRepositionY = repositionYBox.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    var reversedBox = xyPosition.add('checkbox', undefined, "R");                  // tick box obj
    reversedBox.value =  prefs.isReversed;

    // apply user input and save prefs.canRepositionY
    reversedBox.onClick = function ()
    {
        prefs.isReversed = reversedBox.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    var rePosSpacing = xyPosition.add("edittext", undefined, "spc");    // input obj

    // apply user input and save prefs.rePosSpacing
    rePosSpacing.onChange = function()
    {
        prefs.rePosSpacing = rePosSpacing.text;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    // Width, Height Diagram Size input group -----------------------------------------------------------------------
    var diagramSize = myWindow.add('group {orientation: "row"}');       // container
    diagramSize.alignment = "left"

    diagramSize.add("statictext", undefined, "Diagram Width:");         // text obj
    var diagramWidth = diagramSize.add("edittext", undefined, prefs.width);   // input obj
    diagramWidth.characters = 4;
    var lastWidth =  parseFloat((prefs.width).replace(",", "."));

    diagramWidth.onChange = function()
    {
        // if width and height are linked, change both values with rule of 3
        if (prefs.isLinkWidthToHeight) 
        {
            var newWidth = parseFloat(diagramWidth.text.replace(",", ".")); 
            var h = parseFloat(diagramHeight.text.replace(",", "."));
            //determine the new diagram height with rule of three
            var changedHeight =  newWidth * h / lastWidth;
            diagramHeight.text = String(changedHeight); 
        }

        // apply user input and save prefs.width, prefs.height
        lastWidth = parseFloat(diagramWidth.text.replace(",", "."));
        lastHeight = parseFloat(diagramHeight.text.replace(",", "."));
        prefs.width = diagramWidth.text.replace(",", ".");
        prefs.height = diagramHeight.text;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

   var linkWidthToHeight = diagramSize.add('checkbox', undefined, "");        // tick box obj 
   linkWidthToHeight.value = prefs.isLinkWidthToHeight;

   // apply user input and save prefs.isLinkWidthToHeight
   linkWidthToHeight.onClick = function () 
   {
       prefs.isLinkWidthToHeight = linkWidthToHeight.value;

       try {btExecute('savePrefs');}
       catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }
    
    diagramSize.add("statictext", undefined, "Diagram Height:");                            // text obj
    var diagramHeight = diagramSize.add("edittext", undefined, prefs.height);               // input obj
    diagramHeight.characters = 4;
    var lastHeight = parseFloat((prefs.height).replace(",", "."));

    diagramHeight.onChange = function()
    {
        // if width and height are linked, change both values with rule of 3
        if (prefs.isLinkWidthToHeight)
        {
            var newHeight = parseFloat(diagramHeight.text.replace(",", ".")); 
            var w = parseFloat(diagramWidth.text.replace(",", "."));
            //determine the new diagram height with rule of three
            var changedWidth =  newHeight * w / lastHeight;
            diagramWidth.text = String(changedWidth);
        }

        // apply user input and save it
        lastHeight = parseFloat(diagramHeight.text.replace(",", "."));
        lastWidth = parseFloat(diagramWidth.text.replace(",", "."));
        prefs.height = diagramHeight.text.replace(",", ".");
        prefs.width = diagramWidth.text;
    
        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    
    var linkHeightToFrets = diagramSize.add('checkbox', undefined, "L to strings & frets");     // tick box obj 
    linkHeightToFrets.value = prefs.isLinkHeightToFrets;

    // apply user input and save  prefs.isLinkHeightToFrets
    linkHeightToFrets.onClick = function () 
    {
        prefs.isLinkHeightToFrets = linkHeightToFrets.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    // String and Fret Thickness input group, nut thickness ----------------------------------------------------------
    var stringAndFretThickness = myWindow.add('group {orientation: "row"}');            // container
    stringAndFretThickness.alignment = "left"

    // String Thickness
    stringAndFretThickness.add("statictext", undefined, "String Thickness:");           // text obj
    var stringThickness = stringAndFretThickness.add("edittext", undefined, prefs.stringThickness);    // input obj
    stringThickness.characters = 4;
    var lastStringThickness = prefs.stringThickness;

    stringThickness.onChange = function()
    {
        // if string and fret Thickness are linked, change both values with rule of 3, if the values are numeric (not AUTO)
        var lastStringThicknessFloat =  parseFloat(lastStringThickness.replace(",", "."));
        var lastFretThicknessFloat =  parseFloat(lastFretThickness.replace(",", "."));
        if (!isNaN(lastStringThicknessFloat) && (!isNaN(lastFretThicknessFloat)))
        {
            if(prefs.isLinkThickness)
            {
                var newStringThickness = parseFloat(stringThickness.text.replace(",", ".")); 
                var t = parseFloat(fretThickness.text.replace(",", "."));
                //determine the new diagram height with rule of three
                var changedThickness =  newStringThickness * t / lastStringThicknessFloat;
                fretThickness.text = isNaN(String(changedThickness)) ? AUTO : String(changedThickness);
            }
        }

        // apply user input and save it
        lastStringThickness = stringThickness.text.replace(",", ".");
        lastFretThickness = fretThickness.text.replace(",", ".");
        prefs.stringThickness = stringThickness.text.replace(",", ".");
        prefs.lastFretThickness = fretThickness.text.replace(",", ".");

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    var linkThickness = stringAndFretThickness.add('checkbox', undefined, "");             // tick box obj
    linkThickness.value = prefs.isLinkThickness;
    
    // apply user input and save it
    linkThickness.onClick = function () 
    {
        prefs.isLinkThickness = linkThickness.value;

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    // Fret Thickness
    stringAndFretThickness.add("statictext", undefined, "Fret Thickness:");                         // text obj
    var fretThickness = stringAndFretThickness.add("edittext", undefined, prefs.fretThickness);      // input obj
    fretThickness.characters = 4;
    var lastFretThickness = prefs.fretThickness;
    
    fretThickness.onChange = function()
    {
        // if string and fret Thickness are linked, change both values with rule of 3, if the values are numeric (not AUTO)
        var lastStringThicknessFloat =  parseFloat(lastStringThickness.replace(",", "."));
        var lastFretThicknessFloat =  parseFloat(lastFretThickness.replace(",", "."));
        if (!isNaN(lastStringThicknessFloat) && (!isNaN(lastFretThicknessFloat)))
        {
            if(prefs.isLinkThickness)
            {
                var newFretThickness = parseFloat(fretThickness.text.replace(",", ".")); 
                var t = parseFloat(stringThickness.text.replace(",", "."));
                //determine the new diagram height with rule of three
                var changedThickness =  newFretThickness * t / lastFretThicknessFloat;
                stringThickness.text = isNaN(String(changedThickness)) ? AUTO : String(changedThickness);
            }
        }

        // apply user input and save it
        lastStringThickness = stringThickness.text.replace(",", ".");
        lastFretThickness = fretThickness.text.replace(",", ".");
        prefs.stringThickness = stringThickness.text.replace(",", ".");
        prefs.lastFretThickness = fretThickness.text.replace(",", ".");

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    stringAndFretThickness.add("statictext", undefined, "Nut Thickness:");                          // text obj
    var nutThickness = stringAndFretThickness.add("edittext", undefined, prefs.nutThickness);       // input obj
    nutThickness.characters = 4;
    
    // apply user input and save it
    nutThickness.onChange = function ()
    {
        prefs.nutThickness = nutThickness.text.replace(",", ".");

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }
    
    //Dynamic UI Changes (TODO : REFACTOR)---------------------------------------------------------------------------
    numberOfStringsDropDown.onChange = function () 
    {
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
                if (prefs.isLinkHeightToFrets)
                {
                    var currentString = (numberOfStringsDropDown.selection).text;   // number of strings as text
                    var currentFret = (numberOfFretsDropDown.selection).text;       // number of frets as text

                    var w = parseFloat(diagramWidth.text.replace(",", ".")); 
                    //get the first char of the text (contains number of strings and frets)
                    var s = parseInt(currentString.charAt(0));                      // number of strings as Int
                    var f = parseInt(currentFret.charAt(0)) + 1;                    // number of frets as Int plus the nut
                    //determine the new diagram height with rule of three
                    var changedHeight =  f * w / s;
                    diagramHeight.text = String(changedHeight);
                    prefs.height = diagramHeight.text;
                }
                myWindow.update();
 
                prefs.numberOfStringsItem = i-4;
            } 
        }
 
        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }
     
    numberOfFretsDropDown.onChange = function () 
    {
        for (i = 5; i < 11; i++)
        {
            if (numberOfFretsDropDown.selection == numberOfFretsDropDown.items[i-5]) 
            {
                prefs.numberOfFretsItem = i - 5;
                //change the diagram height accordingly 
                if (prefs.isLinkHeightToFrets)
                {
                    var currentString = (numberOfStringsDropDown.selection).text;       // number of strings as text
                    var w = parseFloat(diagramWidth.text.replace(",", ".")); 
                    //get the first char of the text (contains number of strings). The number of frets is the (i)
                    var s = parseInt(currentString.charAt(0));                          // number of strings as Int
                    //determine the new diagram height with rule of three
                    var changedHeight =  i * w / s;
                    diagramHeight.text = String(changedHeight);
                }   
                myWindow.update();   
            } 
        }

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    //Buttons -----------------------------------------------------------------------------------------------
    var myButtonGroup = myWindow.add("group");                                          // container
    myButtonGroup.alignment = "center";

    myWindow.createBtn = myButtonGroup.add("button", undefined, "Draw Chord");          // button obj

    myButtonGroup.add("statictext", undefined, "|");                                    // text obj
    var resetBox = myButtonGroup.add('checkbox', undefined, "Reset all?");              // tick box obj
    resetBox.value = canReset;
    resetBox.onClick = function (){canReset = resetBox.value;}

    myWindow.newBtn = myButtonGroup.add("button", undefined, "Clear");                  // button obj
    myButtonGroup.add("statictext", undefined, "|");                                    // text obj
    
    //myWindow.aboutBtn = myButtonGroup.add("button", undefined, "About");                // button obj
    myWindow.closeBtn = myButtonGroup.add("button", undefined, "Close");                // button obj

    myWindow.layout.layout(true);  

    myWindow.newBtn.onClick = function ()
    {
        chordName.text = "";
        
        for (var i = 0; i < fretPosStr.length; i++)
        {
            fretPosStr[i].text = ""
            
        }
        for (var i = 0; i < fingerPosStr.length; i++)
        {
            fingerPosStr[i].text = ""
            
        }
        if (canReset)  // reset prefs values to default
        {
            xPosistion.text = "0";
            prefs.posX = "0";

            yPosistion.text = "0";
            prefs.posY = "0";

            diagramWidth.text = "100";
            prefs.width = "100";

            diagramHeight.text = "100";
            prefs.height = "100";

            prefs.numberOfStringsItem = 2;
            numberOfStringsDropDown.selection = numberOfStringsDropDown.items[2]; 

            prefs.numberOfFretsItem = 1;
            numberOfFretsDropDown.selection = numberOfFretsDropDown.items[1];

            prefs.stringThickness = AUTO;
            stringThickness.text = AUTO;

            prefs.fretThickness = AUTO;
            fretThickness.text = AUTO;

            prefs.chordFontSize = AUTO;
            chordFontSize.text = AUTO;

            prefs.chordLabelFontSize = AUTO;
            chordLabelFontSize.text = AUTO;

            prefs.chordFontLabel = DEFAULT_FONT;
            prefs.chordFont = DEFAULT_NUMERIC_FONT;

            fontListMenu.selection = fontListMenu.items[getIndexOf(fontList, prefs.chordFontLabel)];
            fontListMenuFrets.selection = fontListMenuFrets.items[getIndexOf(fontList, prefs.chordFont)];

            prefs.drawBarre = false;
            drawBarreBox.value = prefs.drawBarre;

            prefs.canRepositionX = false;
            prefs.canRepositionY = false;
            repositionXBox.value = prefs.canRepositionX;
            repositionYBox.value = prefs.canRepositionY;

            prefs.isReversed = false;
            reversedBox.value = prefs.isReversed;

            prefs.isLinkHeightToFrets = true;
            linkHeightToFrets.value = prefs.isLinkHeightToFrets;
            
            prefs.isLinkWidthToHeight = true;
            linkWidthToHeight.value = prefs.isLinkWidthToHeight;

            prefs.isLinkThickness = true;
            linkThickness.value = prefs.isLinkThickness;

            prefs.rePosSpacing = SPC;
            rePosSpacing.text = SPC;

            prefs.nutThickness = AUTO;
            nutThickness.text = AUTO;

            prefs.chordFontSize = AUTO;
            fretNumberSize.text = AUTO;

            myWindow.update();
        }

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }

    myWindow.createBtn.onClick = function () {
        
        nameOfChord = chordName.text; 
        if (nameOfChord == "") nameOfChord = " ";   // if a completely empty string is passed, the text object will vanish uppon creation
        
        chordFontLabelArg = prefs.chordFontLabel;
        chordFontLabelSizeArg = isNaN(parseFloat(chordLabelFontSize.text.replace(",", "."))) ? undefined : parseFloat(chordLabelFontSize.text.replace(",", "."));
        chordFontArg = prefs.chordFont;
        chordFontSizeArg = isNaN(parseFloat(chordFontSize.text.replace(",", "."))) ? undefined : parseFloat(chordFontSize.text.replace(",", "."));
        fretNumberSizeArg = isNaN(parseFloat(fretNumberSize.text.replace(",", "."))) ? undefined : parseFloat(fretNumberSize.text.replace(",", "."));

        xPosArg = parseFloat(xPosistion.text.replace(",", ".")); 
        yPosArg = parseFloat(yPosistion.text.replace(",", "."));
        dWArg = parseFloat(diagramWidth.text.replace(",", "."));
        dHArg = parseFloat(diagramHeight.text.replace(",", "."));
        
        numberOfStringsArg = parseFloat(numberOfStringsDropDown.selection.text.replace(",", ".").charAt(0));
        numberOfFretsArg = parseFloat(numberOfFretsDropDown.selection.text.replace(",", ".").charAt(0));

        
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
        nutThicknessArg = isNaN(parseFloat(nutThickness.text.replace(",", "."))) ? undefined : parseFloat(nutThickness.text.replace(",", "."));
        

        drawBarreArg = prefs.drawBarre;
        

        //HERE

        //Pass the arguments and call the function to create the diagram via BridgeTalk
        try {
                btExecute('createChordDiagram', 
                [
                    'nameOfChord',
                    'chordFontLabelArg', 'chordFontLabelSizeArg',
                    'chordFontArg', 'chordFontSizeArg', 'fretNumberSizeArg',
                    'numberOfStringsArg', 'numberOfFretsArg', 
                    'drawBarreArg',
                    'fretPosArg', 'fingerPosArg',
                    'xPosArg', 'yPosArg', 
                    'dWArg', 'dHArg',  
                    'thickStrings', 'thickFrets', 'nutThicknessArg'               
                ]);
            }catch(e){alert("Some went wrong: " + e, "Oops!!!")};

        // if apropriate prepare the reposition of the next chord
        if(prefs.canRepositionX)
        {
            var spc = parseInt(diagramWidth.text) / 2;
            if(!isNaN(parseInt(rePosSpacing.text))) spc = parseInt(rePosSpacing.text);

            var xpos = parseInt(xPosistion.text);
            xPosistion.text = prefs.isReversed ? String(xpos - parseInt(diagramWidth.text) - spc) : String(xpos + parseInt(diagramWidth.text) + spc);
            prefs.posX = xPosistion.text;

            myWindow.update();
        }

        if(prefs.canRepositionY)
        {
            var spc = parseInt(diagramWidth.text) / 2;
            if(!isNaN(parseInt(rePosSpacing.text))) spc = parseInt(rePosSpacing.text);

            var ypos = parseInt(yPosistion.text);
            yPosistion.text = prefs.isReversed ? String(ypos + parseInt(diagramHeight.text) + spc) : String(ypos - parseInt(diagramHeight.text) - spc);
            prefs.posY = yPosistion.text;

            myWindow.update();
        }
    }

    myWindow.closeBtn.onClick = function () 
    {
        myWindow.close();

        try {btExecute('savePrefs');}
        catch(e){alert("Some went wrong: " + e, "Oops!!!");};
    }


    myWindow.show();
}

/**
 * Example: createChordDiagram(100, 500, 120, 120, 6, 5, "F7#5#9", ["1", "0", "1", "2", "2", "4"], ["T", "-", "1", "3", "3", "4"], 1.5, .5);
 * @param {* String}    _chordNameUserInput      - The name of chord
 * @param (* String)    _chordFontLabel          - The name of font of the chord name
 * @param (* Float)     _chordFontLabelSize      - The size of font of the chord name
 * @param (* String)    _chordFont               - The name of font of the chord numeric data
 * @param (* Float)     _chordFontSize           - The size of font  of the chord numeric data 
 * @param (* Float)     _fretNumberSize          - The size of font  of the fret number indicator 
 * @param {* Int}       _numStrings              - The number of strings 
 * @param {* Int}       _numFrets                - The number of frets
 * @param (* Boolean)   _drawBarre 
 * @param {* Array}     _fingerUsedUserInput     - The fingers used as Array<String> eg ["-", "-", "1", "2", "3", "-"] for the chord A
 * @param {* Array}     _stringPositionUserInput - The fingers position as Array<String>, open ("o"), close ("x") strings and number of fret for each finger, eg ["x", "o", "2", "2", "2", "o"]
 * @param {* Float}     _xx                      - The x position of the diagram
 * @param {* Float}     _yy                      - The y position of the diagram
 * @param {* Float}     _width                   - The width of diagram
 * @param {* Float}     _height                  - The _height of diagram
 * @param {* Float}     _strGridLinesThickness   [optional] - The thickness of the strings. If no value passes then it is autocalculated
 * @param {* Float}     _fretGridLinesThickness  [optional] - The thickness of the frets. If no value passes then it is autocalculated
 * @param {* Float}     _nutThickness
 */
function createChordDiagram(_chordNameUserInput, _chordFontLabel, _chordFontLabelSize, _chordFont, _chordFontSize, _fretNumberSize, _numStrings, _numFrets, _drawBarre,  _stringPositionUserInput, _fingerUsedUserInput, _xx, _yy, _width, _height, _strGridLinesThickness, _fretGridLinesThickness, _nutThickness)
{
    //The obj that will group the chord diagram elements together
    var chordGroup = app.activeDocument.groupItems.add();

    // create the frets -----
    var fretX = _xx;      
    var fretY = _yy; 
    var fretGap = _height / _numFrets; // the gap between frets

    // if no _fretGridLinesThickness input then autosize
    if(_fretGridLinesThickness == undefined) _fretGridLinesThickness = _width / 300;
    
    var frets = []; // array of shape paths
    for (var i = 0 ; i < _numFrets + 1 ; i++)    // we add +1 because of the "nut" 
    {
        var shapePath = chordGroup.pathItems.add();         // shape obj
        shapePath.strokeColor = makeColor(0, 0, 0, 100);
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        shapePath.strokeWidth = _fretGridLinesThickness;
        shapePath.filled = false;
        shapePath.stroked = true;
        shapePath.setEntirePath([[fretX, fretY], [fretX + _width, fretY]]);  // draw fret
        shapePath.closed = true;

        fretY = fretY - fretGap;    // change the value for the next fret

        frets.push(shapePath);      // add fret to array for easy manipulation later
    }
    
    
    // create strings -----
    var strX = _xx;
    var srtY = _yy;
    var srtGap = _width / (_numStrings - 1); // the gap between strings

    // if no _strGridLinesThickness input then autosize
    if(_strGridLinesThickness == undefined) _strGridLinesThickness = _width / 100;

    var strings = [];   // array of shape paths
    for (var ii = 0 ; ii < _numStrings; ii++)
    {
        var shapePath = chordGroup.pathItems.add();             // shape obj
        shapePath.stroked = true;
        shapePath.strokeColor = makeColor(0, 0, 0, 100);
        shapePath.fillColor = makeColor(0, 0, 0, 100);
        shapePath.filled = false;
        shapePath.strokeCap = StrokeCap.BUTTENDCAP;
        shapePath.strokeJoin = StrokeJoin.MITERENDJOIN;
        shapePath.strokeWidth = _strGridLinesThickness;
        shapePath.setEntirePath([[strX, srtY], [strX, srtY - _height]]);     // draw string
        shapePath.closed = true;

        strX = strX + srtGap;      // change the value for the next string

        strings.push(shapePath);    // add string to array easy manipulation later
    }
 
    //Placing the name of the chord -----
    if (_chordFontLabelSize == undefined)  var fsize = _width / 5; else var fsize = _chordFontLabelSize;
    
    var textRef = chordGroup.textFrames.add();      // text obj
    textRef.position = Array(_xx + _width /2, _yy + fsize * 1.2);
    textRef.contents = _chordNameUserInput;
    textRef.textRange.size = fsize;
    textRef.textRange.justification = Justification.CENTER;
    textRef.textRange.characterAttributes.textFont = textFonts.getByName(_chordFontLabel);
    
    
    //Placing the fingering, fingers wise -----
    var fUsedTextRef
    var fingerUsedTextRef = [];           // array of text oj
    var frtGap = _height / (_numFrets);   // the gap between frets
    if (_chordFontSize == undefined) var fsize = frtGap / 2; else var fsize = _chordFontSize;
    // positioning the fingering on diagram
    for (var f = 0; f < _numStrings; f++ )
    {
        if (isNaN(parseInt(_fingerUsedUserInput[f])) || parseInt(_fingerUsedUserInput[f]) == 0) _fingerUsedUserInput[f] = "";       // if string is empty (""), will vanish (desired)
        var fUsedTextRef = chordGroup.textFrames.add();      // text obj
        fUsedTextRef.position = Array(_xx + (srtGap * f), _yy - _height - frtGap / 2);          // pointText obj
        fUsedTextRef.contents = _fingerUsedUserInput[f];                         // apply user input text in contents
        fUsedTextRef.textRange.size = fsize; //frtGap / 2;   // TODO Figure out a better way to set font size
        if(fUsedTextRef.contents != "") fUsedTextRef.textRange.justification = Justification.CENTER;
        fUsedTextRef.textRange.characterAttributes.textFont = app.textFonts.getByName(_chordFont); //TODO determine font
        fingerUsedTextRef.push(fUsedTextRef);
    }

    fingersCopy = []; //helper array to figure the neck position
    for (var s = 0; s < _numStrings; s++ )
    {
        //lowercase only, change zero to 'o'
        if (_stringPositionUserInput[s] == "X") _stringPositionUserInput[s] = "x";
        if (_stringPositionUserInput[s] == "O" || _stringPositionUserInput[s] == "0") _stringPositionUserInput[s] = "o";

        if(!isNaN(parseInt(_stringPositionUserInput[s])))
        {
            var val = _stringPositionUserInput[s];
            fingersCopy.push(val);
        }
    }

    //sort fingered frets from low to high
    fingersCopy.sort(function(a, b) {return a - b;}); 
    
    // the gap from nut to start of diagram
    var neckGap = 0; 
    if (_fretNumberSize == undefined) var fsize = srtGap * .75; else var fsize = _fretNumberSize;
    
    if (_yy - fsize > _yy - fretGap) 
    {
        
        if ( _yy - fsize > _yy - fretGap / 2) var _fretNumberSizePos = _yy - fretGap / 2;
        else var _fretNumberSizePos = _yy - fsize;
        
    } 
     else var _fretNumberSizePos = _yy - fretGap;
    // if the lowest fretted fret is higher than the 2rd fret
    if(Number(fingersCopy[0]) > 2) 
    {
        //determing the fret number of the diagram
        neckGap = Number(fingersCopy[0]) - 1; 
        
        neckGapTextRef = chordGroup.textFrames.pointText([_xx - fsize * .75, _fretNumberSizePos]);        // pointText obj
        neckGapTextRef.contents = (neckGap + 1).toString();                                     // apply the neckGap as text in contents
        neckGapTextRef.textRange.size = fsize; //srtGap * .75;   // TODO Figure out a better way to set font size
        neckGapTextRef.textRange.justification = Justification.RIGHT;
        neckGapTextRef.textRange.characterAttributes.textFont = app.textFonts.getByName(_chordFont); //TODO determine font
       
    }
    else    // if the lowest fretted fret is not higher than the the 2rd fret....
    {
        // ...check if the highest fret is bigger than the total frets in diagram... 
        if(Number(fingersCopy[fingersCopy.length - 1]) > _numFrets) 
        {
            // ...so the neckGap will reach the lowest fingered fret.
            neckGap = Number(fingersCopy[0]) - 1;

            neckGapTextRef = chordGroup.textFrames.pointText([_xx - fsize * .75, _fretNumberSizePos]);
            neckGapTextRef.contents = (neckGap+1).toString();
            neckGapTextRef.textRange.size = fsize; //srtGap * .75;   // TODO Figure out a better way to set font size
            neckGapTextRef.textRange.justification = Justification.RIGHT;
            neckGapTextRef.textRange.characterAttributes.textFont = app.textFonts.getByName(_chordFont); //TODO determine font
            
        }   
        // else the fret 0 is the "nut", so make it bold
        else 
        {
            if (_nutThickness == undefined) var nutThic = _width / 10; else var nutThic = _nutThickness;
            frets[0].strokeWidth *= nutThic;
        }
    }
   
    //Placing the fingering, frets wise -----
    var stringNumberTextRef=[];     // array of text oj

    if (_chordFontSize == undefined) var fsize = srtGap / 2; else var fsize = _chordFontSize;
    // positioning the fingering on diagram
    for (var s = 0; s < _numStrings; s++ )
    {   
        // if is closed string
        if (_stringPositionUserInput[s] == "x")
        {
            stringNumberTextRef[s] = chordGroup.textFrames.pointText([_xx + (srtGap * s) - (srtGap / 8), _yy + srtGap / 8]);     // pointText obj
            stringNumberTextRef[s].contents = _stringPositionUserInput[s];                                               // apply user input text in contents
            stringNumberTextRef[s].textRange.size = fsize; // srtGap / 2; // TODO Figure out a better way to set font size
            stringNumberTextRef[s].textRange.characterAttributes.textFont = app.textFonts.getByName(_chordFont); //TODO determine font
        } 
        // if is open string
        else  if (_stringPositionUserInput[s] == "o")
        {
            stringNumberTextRef[s] = chordGroup.textFrames.pointText([_xx + (srtGap * s) - (srtGap / 8), _yy + srtGap / 8]);
            stringNumberTextRef[s].contents = _stringPositionUserInput[s];
            stringNumberTextRef[s].textRange.size = fsize; // srtGap / 2; // TODO Figure out a better way to set font size
            stringNumberTextRef[s].textRange.characterAttributes.textFont = app.textFonts.getByName(_chordFont); //TODO determine font
        } 
        // if is fingering draw circle
        else if (Number(_stringPositionUserInput[s]) < _numFrets + 1 + neckGap)
        {
            var shapeItem = chordGroup.pathItems;

            var radius;
            radius = srtGap < frtGap ? srtGap : frtGap;
            radius *= .9;
            var offset = srtGap < frtGap ? (srtGap - radius) / 2 : (frtGap - radius) / 2;

            var finger = shapeItem.ellipse(_yy - frtGap * (Number(_stringPositionUserInput[(s)]) - 1 - neckGap) - offset, _xx + srtGap * s - srtGap / 2 * frtGap / srtGap + offset, radius, radius);          
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

    if (_drawBarre)
    {  
        for (var i = 1; i < 5; i++)
        {
            //if same finger is on more than 1 fret, draw barre
            var l = getIndexOf(_fingerUsedUserInput, i);
            var h = getLastIndexOf(_fingerUsedUserInput, i);

            if (l != h)
            {
                var barre = chordGroup.pathItems.add();       
                barre.setEntirePath([[_xx + srtGap * l * frtGap / srtGap + offset, _yy - frtGap * (Number(_stringPositionUserInput[(l)]) - 1 - neckGap) - frtGap/2], 
                    [_xx + srtGap * h * frtGap / srtGap + offset, _yy - frtGap * (Number(_stringPositionUserInput[(l)]) - 1 - neckGap) - frtGap/2]]);  // draw barret
                barre.strokeWidth = radius * .7;
                barre.strokeColor = makeColor(0, 0, 0, 100);
                barre.stroked = true;
                barre.closed = true;
            }
        }
    }
}

// TODO About dialog


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

function makeColor(c, m, y, k) 
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

function getDefaultFont()
{
    var fontCount = textFonts.length;
   
    var defaultFont = ScriptUI.newFont("palette").name;
    for (var i = 0; i < fontCount; i++) {
        
        if (textFonts[i].name == "PetalumaScript" || textFonts[i].name == "Petaluma Script")  defaultFont = textFonts[i].name;
    }

    return defaultFont;
}

function savePrefs()
{
    var prefsFile = File(Folder.userData + "/ChordDiagramPrefs.json");

    prefsFile.open("w");
    prefsFile.write(JSON.stringify(prefs));
    prefsFile.close();
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

    //Turn colors black
    doc.defaultFillColor = makeColor(0, 0, 0, 100);
    doc.defaultStrokeColor = makeColor(0, 0, 0, 100);

    
    ///////////////////////////////////////////////////////////////
    /* minified json2 code * NOT part of the script source code */
    /**/ "object"!=typeof JSON&&(JSON={}),function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
    ////////////////////////////////////////////////////////////    

    loadPreferences();
}

