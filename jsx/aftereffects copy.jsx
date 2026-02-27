"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

function getLayerNames(arg) {
    var layerNames = [];
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        layerNames.push(comp.layer(i).name);
    }

    return JSON.stringify(layerNames);
}

function osCheck() {
    var os = $.os;
    var match = os.indexOf("Windows");
    if (match != (-1)) {
        var userOS = "PC";
    } else {
        var userOS = "MAC";
    }
    return userOS;
}


function replaceimageJSX() {
    findAll()
    var filename = (imagesCompIndex.layer(1).sourceText.value)
    //alert(filename)
    imagesFolderIndex.item(1).replace(File(filename));
}






// save project 

function saveProject(params) {
    var projectFile = app.project.dirty;

    if (projectFile === true) {
        app.project.save();
        var filePath = app.project.file.fsName;

    } else {
        infoWrite("File Saved")
    }

    return filePath;

}



//  Data Import //

function importDataFileJSX() {
    var dataFolder = findFolder(dataFolderNameS);
    var dataComp = findComp(dataCompNameS);
    var file = File.openDialog("Select a file to import");

    if (file === null) {
        return; // User cancelled the dialog
    }
    file.open('r');
    var csvContent = file.read();
    file.close();

    var rows = csvContent.split("\n");
    var data = [];
    var importOptions = new ImportOptions();
    importOptions.file = file;

    var item = app.project.importFile(importOptions);
    if (item !== null) {
        item.parentFolder = dataFolder;
        dataComp.layers.add(item);
        for (var i = 0; i < rows.length; i++) {
            data.push(rows[i].split(","));
        }
        //alert(data);

    }

    return data;
}







// Fresh Batch //
//Folder Names//
var finalFolderName = "reFresh Batch Setup";
var imagesFolderName = "01_Images";
var dataFolderName = "02_Data";
var footageFolderName = "03_Footage";
var compsFolderName = "04_Comps";
var selectorFolderName = "0S_selector";

//Folder Strings//
var finalFolderNameS = finalFolderName.toString();
var finalFolder = findFolder(finalFolderNameS);
var imagesFolderNameS = imagesFolderName.toString();
var imagesFolder = findFolder(imagesFolderNameS);
var dataFolderNameS = dataFolderName.toString();
var dataFolder = findFolder(dataFolderNameS);
var footageFolderNameS = footageFolderName.toString();
var footageFolder = findFolder(footageFolderNameS);
var compsFolderNameS = compsFolderName.toString();
var compsFolder = findFolder(compsFolderNameS);
var selectorFolderNameS = selectorFolderName.toString();
var selectorFolder = findFolder(selectorFolderNameS);

//Comp Names//
var templateCompName = "00_Template";
var imagesCompName = "01_Images";
var dataCompName = "02_Data";
var selectorCompName = "05_Selector";

//Comp Strings//
var templateCompNameS = templateCompName.toString();
var templateComp = findComp(templateCompNameS);
var imagesCompNameS = imagesCompName.toString();
var imagesComp = findComp(imagesCompNameS);
var dataCompNameS = dataCompName.toString();
var dataComp = findComp(dataCompNameS);
var selectorCompNameS = selectorCompName.toString();
var selectorComp = findComp(selectorCompNameS);

function findAll() {
    //Folder Strings//
    finalFolderNameS = finalFolderName.toString();
    finalFolder = findFolder(finalFolderNameS);
    imagesFolderNameS = imagesFolderName.toString();
    imagesFolder = findFolder(imagesFolderNameS);
    dataFolderNameS = dataFolderName.toString();
    dataFolder = findFolder(dataFolderNameS);
    footageFolderNameS = footageFolderName.toString();
    footageFolder = findFolder(footageFolderNameS);
    compsFolderNameS = compsFolderName.toString();
    compsFolder = findFolder(compsFolderNameS);
    selectorFolderNameS = selectorFolderName.toString();
    selectorFolder = findFolder(selectorFolderNameS);

    //Comp Strings//
    templateCompNameS = templateCompName.toString();
    templateComp = findComp(templateCompNameS);
    imagesCompNameS = imagesCompName.toString();
    imagesComp = findComp(imagesCompNameS);
    dataCompNameS = dataCompName.toString();
    dataComp = findComp(dataCompNameS);
    selectorCompNameS = selectorCompName.toString();
    selectorComp = findComp(selectorCompNameS);
}





//Fresh Batch // 




function infoWrite(Info) {
    var time_Str = system.callSystem('cmd.exe /c "time /t"');
    clearOutput();
    writeLn(Info + " " + time_Str);
}


//-----Create Folders -----//
function createFolder() {

    app.beginUndoGroup("Create Folders");

    var folderTarget0 = app.project.items.addFolder(finalFolderName);
    var folderTarget1 = app.project.items.addFolder(imageFolderName);
    folderTarget1.parentFolder = folderTarget0
    var folderTarget2 = app.project.items.addFolder(dataFolderName);
    folderTarget2.parentFolder = folderTarget0
    var folderTarget3 = app.project.items.addFolder(compsFolderName);
    folderTarget3.parentFolder = folderTarget0



    app.endUndoGroup();

    findAll();

    infoWrite("Folders Created");

    var newComptemplate = app.project.items.addComp(
        templateCompNameS,
        1920,
        1080,
        1,
        150,
        29.97
    );
    var newCompimages = app.project.items.addComp(
        imagesCompNameS,
        2000,
        2000,
        1,
        100,
        29.97
    );
    var newCompdata = app.project.items.addComp(
        dataCompNameS,
        500,
        500,
        1,
        100,
        29.97
    );
    var newCompselector = app.project.items.addComp(
        selectorCompNameS,
        500,
        500,
        1,
        100,
        29.97
    );

    findAll();

    newComptemplate.parentFolder = finalFolder;
    newCompimages.parentFolder = compsFolder;
    newCompdata.parentFolder = compsFolder;
    newCompselector.parentFolder = compsFolder;

    newCompselector.openInViewer();
    newCompdata.openInViewer();
    newCompimages.openInViewer();
    newComptemplate.openInViewer();
    newCompselector.openInViewer();

    findAll();

    templateComp.layers.add(newCompdata);
    templateComp.layer(1).guideLayer = true;
    templateComp.layer(1).shy = true;
    app.endUndoGroup();
    infoWrite("Comps Created");

    var selectorLayer = selectorComp.layers.addNull();
    selectorLayer.name = selectorName;
    infoWrite("Selector Layer Created");
    selectorComp.layer(selectorName).property("Effects").addProperty("Slider Control");

};




function addEffect() {
    var folderName = "Selector";
    var selectorCompName = "03_Selector";
    app.project.items.addFolder(folderNames)
    var folderFound = findFolder(dataFolderIndex);

    app.project.item(index).parentFolder = folderFound;

    app.project.items.addFolder(folderNames)
    findFolder(folderName)
    var newCompSelector = app.project.items.addComp(
        selectorCompName,
        500,
        500,
        1,
        100,
        29.97
    );
    var comp = app.project.activeItem;
    var nullLayer = comp.layers.addNull(app.project.activeItem.duration);

    if (comp != null && comp instanceof CompItem) {          // only proceeds if one comp is active

        if (comp.selectedLayers.length == 1) {          // only proceeds if one layer is selected

            var theLayer = comp.selectedLayers[0];
            if (!theLayer.Effects.property("Slider Control")) {
                var theEffect = theLayer.property("Effects").addProperty("Slider Control");          // the regular way to add an effect
            }
        }
    }
}


function findFolder(theName) {
    for (var i = 1; i <= app.project.numItems; i++) {
        if (
            app.project.item(i).name == theName &&
            app.project.item(i) instanceof FolderItem
        ) {
            return app.project.item(i);
        }
    }
    return null;
}

//-----FindComp Function----//

function findComp(theName) {
    for (var i = 1; i <= app.project.numItems; i++) {
        if (
            app.project.item(i).name == theName &&
            app.project.item(i) instanceof CompItem
        ) {
            return app.project.item(i);
        }
    }
    return null;
}


function selectorup() {
    findAll();
    var compFound_1 = findComp(selectorCompName);
    var Slider = compFound_1.layers.byName(selectorName).property("Effects")("Slider Control")("Slider");
    var rowNow = Slider.value;
    var sliderValue = Slider.setValue(rowNow + 1);
    var sliderValueNow = Slider.value;
    //alert(sliderValueNow)
    return sliderValueNow;
};

function selectordown() {
    findAll();
    var sliderValueNow;
    var sliderValue;
    var compFound_1 = findComp(selectorCompName);
    var Slider = compFound_1.layers.byName(selectorName).property("Effects")("Slider Control")("Slider");
    var rowNow = Slider.value;
    if (rowNow > 0) {
        sliderValue = Slider.setValue(rowNow - 1);
        sliderValueNow = Slider.value;
        //alert(sliderValueNow)
        return sliderValueNow;
    } else {
        infoWrite("At Row 0");
        sliderValueNow = "0";
        //alert(sliderValueNow)
        sliderValueNow = Slider.value;
        return sliderValueNow;

    }
};


function dataFieldDropdown() {
    // Open a dialog box to select the CSV file
    findAll();
    var compDataFound = findComp(dataCompName);
    var dataComp = compDataFound.layer(1);
    var arrayHeader = []
    //arrayHeader.unshift("Select a Data Field");

    for (var i = 1; i <= 99; i++) {
        try {
            var data = dataComp("Data")("Outline")(i).name;
        } catch (error) {
            break;
        }
        arrayHeader.push(data);
    }

    return arrayHeader;

};

function dataArrayCSV() {
    // Open a dialog box to select the CSV file
    findAll();
    var compDataFound = findComp(dataCompName);
    var dataComp = compDataFound.layer(1);
    var arrayCSV = dataComp("Data")("Outline")(1).name;
    //alert(arrayCSV);
    //arrayHeader.unshift("Select a Data Field");

    //for (var i = 1; i <= 99; i++) {
    //try {var data = dataComp("Data")("Outline")(i).name;} catch (error) {break;}arrayHeader.push(data)

    //return arrayHeader;

};






function headerText(params) {
    findAll();
    var headerIndex = 1;
    var compTemplateFound = findComp(templateCompName);
    var newLayer = compTemplateFound.layers.addText(title);
    newLayer.name = "Header";
    var expression =
        'var selector = comp("' + selectorCompName + '").layer("Selector").effect("Slider Control")("Slider")\nvar dataElement \ncomp("' + dataCompName + '").layer(1)("Data")("Outline")(' + headerIndex + ')(selector)';
    newLayer.text.sourceText.expression = expression;
}



function addHeaderTextJSX() {
    findAll();

    const headerTextArray = dataFieldDropdown();
    //alert(headerTextArray);

    for (var i = 0; i < headerTextArray.length; i++) {
        try {
            findAll();
            var textPosition = (i + 1) * 100;
            var headerFontSize = 60;
            var headerIndex = i + 1;
            var expression =
                'text.sourceText.createStyle().setFontSize(60) \nvar selector = comp("' + selectorCompName + '").layer("Selector").effect("Slider Control")("Slider")\nvar dataElement \ncomp("' + dataCompName + '").layer(1)("Data")("Outline")(' + headerIndex + ')(selector)';
            var compTemplateFound = findComp(templateCompName);
            var newLayer = compTemplateFound.layers.addText(headerTextArray[i]);
            newLayer.position.setValue([0, textPosition]);

            newLayer.name = headerTextArray[i];
            newLayer.text.sourceText.expression = expression;
            newLayer.text.sourceText.fontSize = headerFontSize;
        }
        catch (error) {
            alert("Error: " + error.message);
        }
    };

}



function addExpression() {
    findAll();


    var expression =
        'var selector = comp("02_Selector").layer("Selector").effect("Slider Control")("Slider")\nvar dataElement \ncomp("01_Data").layer(1)("Data")("Outline")(3)(selector) \ntext.sourceText.createStyle().setFontSize(60)';

    var comp = app.project.activeItem;

    var newLayer = comp.layers.addText(app.project.activeItem.duration);;
    newLayer.text.sourceText.expression = expression;
    // var effectsProp = newLayer.property("ADBE Effect Parade");

}



function getfilepath() {
    var filepath;
    filepath = app.project.file.fsName;
    const fixedPath = filepath.substring(0, filepath.lastIndexOf("\\") + 1);
    //alert (fixedPath);
    return fixedPath
}




function importCSVarray(params) {
    findAll();
    var compData = findComp(dataCompName);
    var csvLayer = compData.layer(1)("Data")("Outline");

    var file = File.openDialog("Select CSV File");

    if (file === null) {
        return; // User canceled the dialog
    }

    file.open('r');
    var csvContent = file.read();
    file.close();

    var rows = csvContent.split("\n");
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        data.push(rows[i].split(","));
    }
    alert(data);
    return data;
}

