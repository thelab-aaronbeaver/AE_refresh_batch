// ============================================================================
// JSON2 Library (for older After Effects versions without native JSON support)
// ============================================================================
"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

// ============================================================================
// CONFIGURATION - Folder and Composition Names
// ============================================================================

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
var selectorCompName = "03_Selector";
var selectorName = "Selector";

//Comp Strings//
var templateCompNameS = templateCompName.toString();
var templateComp = findComp(templateCompNameS);
var imagesCompNameS = imagesCompName.toString();
var imagesComp = findComp(imagesCompNameS);
var dataCompNameS = dataCompName.toString();
var dataComp = findComp(dataCompNameS);
var selectorCompNameS = selectorCompName.toString();
var selectorComp = findComp(selectorCompNameS);

// Stored for batch continuation (output template and folder chosen in UI)
var _batchOutputTemplate = "QT +";
var _batchExportFolder = "";
var _batchLabelSource = "template"; // "template" = 00_Template layer 1 Source Text, "column" = data column value
var _batchLabelColumn = "";         // When _batchLabelSource === "column", the column header name

/**
 * Set export options from panel (template name, folder path, and optional filename label source).
 * Call this before addtoRenderQueue so the selected output module is used.
 * @param {string} templateName - e.g. "H.264", "QT +"
 * @param {string} folderPath - Full path or ""
 * @param {string} [labelSource] - "template" or "column"
 * @param {string} [columnName] - When labelSource is "column", the data column header name
 */
function setExportOptions(templateName, folderPath, labelSource, columnName) {
    _batchOutputTemplate = (templateName && templateName.length > 0) ? String(templateName) : "QT +";
    _batchExportFolder = (folderPath != null) ? String(folderPath) : "";
    _batchLabelSource = (labelSource === "column") ? "column" : "template";
    _batchLabelColumn = (_batchLabelSource === "column" && columnName != null) ? String(columnName) : "";
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check operating system
 * @returns {string} "PC" or "MAC"
 */
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

/**
 * Trim whitespace from start and end (ES3-safe; ExtendScript has no String.prototype.trim)
 * @param {string} s - String to trim
 * @returns {string}
 */
function trimStr(s) {
    if (s == null || s === undefined) return "";
    s = String(s);
    return s.replace(/^\s+/, "").replace(/\s+$/, "");
}

/**
 * Get extension path dynamically (cross-platform)
 * @returns {string} Extension folder path
 */
function getExtensionPath() {
    var scriptFile = new File($.fileName);
    var extensionPath = scriptFile.parent.parent.fsName;
    return extensionPath;
}

/**
 * Get full path to the fallback image (img/notFound.jpg) used when a mapped image is missing.
 * @returns {string} Full file path or empty on error
 */
function getNotFoundImagePathJSX() {
    try {
        var ext = getExtensionPath();
        var sep = (osCheck() === "PC") ? "\\" : "/";
        return ext + sep + "img" + sep + "notFound.jpg";
    } catch (e) {
        return "";
    }
}

/**
 * Write info message to After Effects info panel
 * @param {string} Info - Message to display
 */
function infoWrite(Info) {
    var time_Str = system.callSystem('cmd.exe /c "time /t"');
    clearOutput();
    writeLn(Info + " " + time_Str);
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

/**
 * Save the current project
 * @returns {string} File path of saved project
 */

function saveProject(params) {
    var projectFile = app.project.dirty;
    var filePath = null;

    if (projectFile === true) {
        app.project.save();
        if (app.project.file !== null) {
            filePath = app.project.file.fsName;
        }
    } else {
        if (app.project.file !== null) {
            filePath = app.project.file.fsName;
        }
        infoWrite("File Saved");
    }
    findAll();
    return filePath;

}










function getLayerNames(arg) {
    var layerNames = [];
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        layerNames.push(comp.layer(i).name);
    }

    return JSON.stringify(layerNames);
}



// ============================================================================
// DATA IMPORT & MANAGEMENT
// ============================================================================

/**
 * Import CSV data file
 * @returns {string} CSV content as string
 */
function importDataFileJSX() {
    try {
        var dataFolder = findFolder(dataFolderNameS);
        var dataComp = findComp(dataCompNameS);

        if (dataFolder === null) {
            infoWrite("Error: Data folder not found. Please run 'Fresh Batch Setup' first.");
            return "ERROR:SETUP_002"; // Return error code for JS handling
        }

        if (dataComp === null) {
            infoWrite("Error: Data comp not found. Please run 'Fresh Batch Setup' first.");
            return "ERROR:SETUP_003"; // Return error code for JS handling
        }

        var file = File.openDialog("Select a CSV file to import");
        if (file === null) {
            return "ERROR:FILE_006"; // User cancelled
        }

        // Check file size (warn if > 10MB)
        if (file.length > 10485760) { // 10MB
            infoWrite("Warning: Large file detected. Processing may take time.");
        }

        // Validate file extension
        var fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
            infoWrite("Warning: File may not be a CSV file. Continuing anyway...");
        }

        try {
            file.open('r');
            var csvContent = file.read();
            file.close();
        } catch (error) {
            infoWrite("Error reading file: " + error.toString());
            return "ERROR:FILE_005";
        }

        if (!csvContent || csvContent.length === 0) {
            infoWrite("Error: File is empty");
            return "ERROR:FILE_002";
        }

        var rows = csvContent.split("\n");
        var data = [];
        var importOptions = new ImportOptions();
        importOptions.file = file;

        var item = app.project.importFile(importOptions);
        if (item !== null) {
            item.parentFolder = dataFolder;
            dataComp.layers.add(item);

            // Optimized parsing for large files
            var rowCount = rows.length;
            if (rowCount > 1000) {
                infoWrite("Processing " + rowCount + " rows...");
            }

            // Use optimized loop
            for (var i = 0; i < rowCount; i++) {
                var row = trimStr(rows[i]);
                if (row.length > 0) {
                    data.push(row.split(","));
                }

                // Progress update for very large files
                if (rowCount > 5000 && i % 500 === 0) {
                    infoWrite("Processing row " + i + " of " + rowCount);
                }
            }

            infoWrite("CSV imported successfully. Rows: " + data.length);
        } else {
            infoWrite("Error: Failed to import file");
            return "ERROR:DATA_001";
        }

        // Return as string for JS communication
        return csvContent;
    } catch (error) {
        infoWrite("Error in importDataFileJSX: " + error.toString());
        return "ERROR:DATA_001";
    }
}

/**
 * Import CSV from project folder (no dialog). Used by JSON URL flow.
 * Path is built in JSX so AE finds the file reliably.
 * @param {string} folderPath - Project folder path (from getfilepath())
 * @param {string} fileName - File name e.g. "RefreshBatch_import.csv"
 * @returns {string} CSV content or "ERROR:..." code
 */
function importDataFileFromPath(folderPath, fileName) {
    try {
        var dataFolder = findFolder(dataFolderNameS);
        var dataComp = findComp(dataCompNameS);

        if (dataFolder === null) {
            infoWrite("JSON import: Data folder not found. Run Fresh Batch Setup first.");
            return "ERROR:SETUP_002";
        }
        if (dataComp === null) {
            infoWrite("JSON import: Data comp not found. Run Fresh Batch Setup first.");
            return "ERROR:SETUP_003";
        }

        var sep = (osCheck() === "PC") ? "\\" : "/";
        var normalizedFolder = folderPath.replace(/[\/\\]+$/, "");
        var filePath = normalizedFolder + sep + fileName;

        infoWrite("JSON import: trying file path " + filePath);

        var file = new File(filePath);
        if (!file.exists) {
            infoWrite("JSON import: File does NOT exist at path above.");
            alert("CSV file not found at:\n" + filePath + "\nCheck that the project is saved and the path matches where the panel wrote the file.");
            return "ERROR:FILE_004";
        }

        file.open('r');
        var csvContent = file.read();
        file.close();

        if (!csvContent || csvContent.length === 0) {
            infoWrite("JSON import: File is empty after read.");
            return "ERROR:FILE_002";
        }

        var importOptions = new ImportOptions();
        importOptions.file = file;

        var item = app.project.importFile(importOptions);
        if (item === null) {
            infoWrite("JSON import: app.project.importFile returned null (AE may not import CSV this way).");
            alert("After Effects could not import the CSV file. The file was saved to the project folder.\nYou can use Data Setup > CSV button and choose RefreshBatch_import.csv to import it.");
            return "ERROR:DATA_001";
        }

        item.parentFolder = dataFolder;
        dataComp.layers.add(item);
        infoWrite("JSON import: imported item '" + item.name + "' into folder '" + dataFolder.name + "'.");
        infoWrite("JSON import: CSV rows (by newline count): " + csvContent.split("\n").length);
        return "OK:" + item.name;
    } catch (error) {
        infoWrite("Error in importDataFileFromPath: " + error.toString());
        alert("Import error: " + error.toString());
        return "ERROR:DATA_001";
    }
}




// Fresh Batch //





/**
 * Refresh all folder and composition references
 * Call this after creating new items to update global references
 */
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

/**
 * Find a folder by name in the project
 * @param {string} theName - Name of folder to find
 * @returns {FolderItem|null} Found folder or null
 */





/**
 * Create the initial folder structure and compositions
 * This sets up the entire batch processing structure
 */
function createFolder() {
    if (findFolder(finalFolderName) !== null) {
        alert("Setup already complete. Re-running would create duplicates. Skipping.");
        infoWrite("Create folders: Already set up.");
        return;
    }

    app.beginUndoGroup("Create Folders");
    var folderTarget0 = app.project.items.addFolder(finalFolderName);
    var folderTarget1 = app.project.items.addFolder(imagesFolderName);
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



    newCompdata.openInViewer();
    newCompselector.openInViewer();
    newComptemplate.openInViewer();

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

/**
 * Find a composition by name in the project
 * @param {string} theName - Name of composition to find
 * @returns {CompItem|null} Found composition or null
 */
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

/**
 * Get project file path
 * @returns {string} Project folder path
 */
function getfilepath() {
    var filepath = app.project.file.fsName;
    return getProjectFolderPath(filepath);
}

/**
 * Get project folder path for import (safe when project not saved).
 * @returns {string} Project folder path with trailing separator, or "" if not saved
 */
function getProjectFolderForImport() {
    try {
        if (app.project.file === null) return "";
        return getfilepath();
    } catch (e) {
        return "";
    }
}

/**
 * Get folder path from a file path (cross-platform: Windows and Mac)
 * @param {string} filePath - Full file path (e.g. project .aep path)
 * @returns {string} Folder path with trailing separator
 */
function getProjectFolderPath(filePath) {
    if (!filePath || filePath.length === 0) return "";
    var lastSlash = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
    if (lastSlash < 0) return filePath;
    return filePath.substring(0, lastSlash + 1);
}

/**
 * Sanitize a string for use in a file/folder name (allow only safe chars, no path chars).
 * @param {string} str - Raw label (e.g. from data comp, may contain paths)
 * @param {number} maxLen - Max length (default 80)
 * @returns {string} Safe filename-safe string
 */
function sanitizeForFileName(str, maxLen) {
    if (str === null || str === undefined) return "row";
    str = trimStr(String(str));
    if (str.length === 0) return "row";
    var out = "";
    var len = str.length;
    var max = (typeof maxLen === "number" && maxLen > 0) ? maxLen : 80;
    for (var i = 0; i < len && out.length < max; i++) {
        var c = str.charAt(i);
        var code = str.charCodeAt(i);
        if (code >= 48 && code <= 57) { out += c; }       // 0-9
        else if (code >= 65 && code <= 90) { out += c; } // A-Z
        else if (code >= 97 && code <= 122) { out += c; }// a-z
        else if (c === "_" || c === "-" || c === " ") { out += (c === " ") ? "_" : c; }
        else if (code > 127) { out += "_"; }             // allow or replace unicode
    }
    out = out.replace(/_+/g, "_").replace(/^_|_$/g, "");
    return out.length > 0 ? out : "row";
}

/**
 * Get the export filename label from 00_Template: layer 1, Source Text.
 * Used to build export filenames (rowNumber_label_outputName).
 * @param {CompItem} templateComp - The 00_Template composition
 * @returns {string} Raw label (caller should sanitize for filename)
 */
function getExportLabelFromTemplateLayer(templateComp) {
    if (!templateComp || templateComp.numLayers < 1) return "row";
    try {
        var layer1 = templateComp.layer(1);
        var srcText = layer1.property("Source Text");
        if (!srcText) return "row";
        var v = srcText.value;
        if (!v || !v.text) return "row";
        return String(v.text);
    } catch (e) {
        return "row";
    }
}

/**
 * Get export label from a data column value for a given row (for filename configuration).
 * @param {string} columnName - Column header name from 02_Data
 * @param {number} rowIndex0Based - 0-based row index
 * @returns {string} Raw cell value or "row" on error
 */
function getExportLabelForRow(columnName, rowIndex0Based) {
    try {
        findAll();
        var compDataFound = findComp(dataCompName);
        if (!compDataFound || compDataFound.numLayers < 1) return "row";
        var dataLayer = compDataFound.layer(1);
        var footage = dataLayer.source;
        if (!footage || typeof footage.dataValue !== "function") return "row";
        var colIndex = getCSVColumnIndexByName(footage, columnName);
        if (colIndex < 1) return "row";
        var val = readCSVCell(footage, colIndex, rowIndex0Based);
        return (val != null && String(val).length > 0) ? String(val) : "row";
    } catch (e) {
        return "row";
    }
}

/**
 * Build the export filename preview string for the panel (row_label.ext). Does not modify render queue.
 * @param {number} rowIndex0Based - 0-based row index (e.g. current selector row)
 * @param {string} labelSource - "template" or "column"
 * @param {string} columnName - When labelSource is "column", the column header name
 * @returns {string} Filename only, e.g. "1_Acme.mov" (extension .mov for preview; actual render uses template default)
 */
function getExportFilenamePreview(rowIndex0Based, labelSource, columnName) {
    try {
        findAll();
        var compTemplateFound = findComp(templateCompNameS);
        var labelRaw = "row";
        if (labelSource === "column" && columnName && String(columnName).length > 0) {
            labelRaw = getExportLabelForRow(String(columnName), rowIndex0Based);
        } else if (compTemplateFound && compTemplateFound.numLayers >= 1) {
            labelRaw = getExportLabelFromTemplateLayer(compTemplateFound);
        }
        var label = sanitizeForFileName(labelRaw, 80);
        var rowNum = Math.max(0, Math.floor(Number(rowIndex0Based)));
        return rowNum + "_" + label + ".mov";
    } catch (e) {
        return "—";
    }
}

/**
 * Get comma-separated layer names from 00_Template (for Image Replace: map slot to layer whose Source Text = path/URL).
 * @returns {string} "Layer1,Layer2,..." or ""
 */
function getTemplateLayerNamesJSX() {
    try {
        findAll();
        var comp = findComp(templateCompName);
        if (!comp || comp.numLayers < 1) return "";
        var names = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            try {
                var name = comp.layer(i).name;
                if (name && String(name).length > 0) names.push(String(name));
            } catch (e) {}
        }
        return names.join(",");
    } catch (e) {
        return "";
    }
}

/**
 * Read file path or URL from a layer in 00_Template: Source Text value (valid path or URL).
 * @param {CompItem} templateComp - 00_Template comp
 * @param {string} layerName - Layer name in that comp
 * @returns {string} Trimmed Source Text or ""
 */
function getPathFromTemplateLayerSourceText(templateComp, layerName) {
    if (!templateComp || !layerName || trimStr(String(layerName)).length === 0) return "";
    try {
        var layer = templateComp.layers.byName(layerName);
        if (!layer) return "";
        var prop = layer.property("Source Text");
        if (!prop) return "";
        var v = prop.value;
        if (!v) return "";
        var text = (typeof v.text !== "undefined") ? v.text : String(v);
        if (text == null || String(text).indexOf("[object") === 0) return "";
        return trimStr(String(text));
    } catch (e) {
        return "";
    }
}

/**
 * Get total data row count from data comp (safe)
 * @returns {number} Row count or 0
 */
function getDataRowCount() {
    try {
        var compData = findComp(dataCompName);
        if (compData === null || compData.numLayers < 1) return 0;
        var layer = compData.layer(1);
        if (!layer.property("Data")) return 0;
        return layer("Data")("Number of Rows").value;
    } catch (e) {
        return 0;
    }
}

// ============================================================================
// FOLDER & COMPOSITION SETUP
// ============================================================================




// ============================================================================
// DATA SELECTOR MANAGEMENT
// ============================================================================

/**
 * Increment the data row selector
 * @returns {number} New row number
 */
function incrementSelector() {
    var compFound = findComp(selectorCompName);
    if (compFound === null) {
        infoWrite("Selector comp not found");
        return 0;
    }
    var slider = compFound.layers.byName(selectorName).property("Effects")("Slider Control")("Slider");
    var newRow = slider.value + 1;
    slider.setValue(newRow);
    replaceimageJSX();
    return newRow;
};

/**
 * Decrement the data row selector
 * @returns {number} New row number (or 0 if at minimum)
 */
function decrementSelector() {
    var compFound = findComp(selectorCompName);
    var slider = compFound.layers.byName(selectorName).property("Effects").property("Slider Control").property("Slider");
    var currentValue = slider.value;
    if (currentValue > 0) {
        slider.setValue(currentValue - 1);
        replaceimageJSX();
        return slider.value;
    } else {
        infoWrite("At Row 0");
        return 0;
    }
}

/**
 * Get current data row (selector slider value). 0-based.
 * @returns {number}
 */
function getSelectorRow() {
    try {
        var compFound = findComp(selectorCompName);
        if (compFound === null) return 0;
        var slider = compFound.layers.byName(selectorName).property("Effects")("Slider Control")("Slider");
        return Math.max(0, Math.floor(slider.value));
    } catch (e) {
        return 0;
    }
}

/**
 * Set data row selector by number (0-based). Clamps to >= 0.
 * @param {number} row - 0-based row index
 * @returns {number} Actual row value set
 */
function setSelectorRow(row) {
    try {
        var compFound = findComp(selectorCompName);
        if (compFound === null) {
            infoWrite("Selector comp not found");
            return 0;
        }
        var slider = compFound.layers.byName(selectorName).property("Effects")("Slider Control")("Slider");
        var val = Math.max(0, Math.floor(Number(row)));
        slider.setValue(val);
        replaceimageJSX();
        return slider.value;
    } catch (e) {
        return 0;
    }
}



// ============================================================================
// IMAGE MANAGEMENT
// ============================================================================

/**
 * Get 1-based column index for a data field name from the data comp layer.
 * @returns {number} 1-based index or 0 if not found
 */
function getDataColumnIndexByName(fieldName) {
    if (!fieldName || !dataComp || dataComp.numLayers < 1) return 0;
    var dataLayer = dataComp.layer(1);
    for (var i = 1; i <= 99; i++) {
        try {
            if (dataLayer("Data")("Outline")(i).name === fieldName) return i;
        } catch (e) { break; }
    }
    return 0;
}

/**
 * Get CSV footage from the data comp (layer 1 or any layer whose source has dataValue).
 * Used when Data/Outline cell read throws "invalid text layer".
 * @param {CompItem} dataCompFound - 02_Data comp
 * @returns {FootageItem|null} Footage with dataValue or null
 */
function getCSVFootageFromDataComp(dataCompFound) {
    if (!dataCompFound || dataCompFound.numLayers < 1) return null;
    for (var L = 1; L <= dataCompFound.numLayers; L++) {
        try {
            var layer = dataCompFound.layer(L);
            var src = layer.source;
            if (src && typeof src.dataValue === "function") return src;
        } catch (e) {}
    }
    return null;
}

/**
 * Read one cell from CSV footage. Tries common argument orders (column/row vs row/column, 0-based row vs 1-based).
 * @param {FootageItem} footage - CSV footage with dataValue
 * @param {number} colIndex1Based - 1-based column index
 * @param {number} rowIndex0Based - 0-based row index (first data row = 0)
 * @returns {string} Cell value or empty string
 */
function readCSVCell(footage, colIndex1Based, rowIndex0Based) {
    var c = colIndex1Based - 1;
    var r = rowIndex0Based;
    var tried = [
        [c, r],
        [r, c],
        [c, r + 1],
        [r + 1, c]
    ];
    for (var t = 0; t < tried.length; t++) {
        try {
            var v = footage.dataValue(tried[t]);
            if (v != null && String(v).indexOf("[object") !== 0) return trimStr(String(v));
        } catch (e) {}
    }
    return "";
}

/**
 * Get 1-based column index by matching field name to CSV header (row 0 or row 1).
 * Use when Data/Outline is not available (e.g. invalid text layer).
 * @param {FootageItem} footage - CSV footage with dataValue
 * @param {string} fieldName - Column header name
 * @returns {number} 1-based index or 0 if not found
 */
function getCSVColumnIndexByName(footage, fieldName) {
    if (!footage || !fieldName || typeof footage.dataValue !== "function") return 0;
    var norm = trimStr(String(fieldName));
    for (var col = 0; col < 200; col++) {
        try {
            var v = footage.dataValue([col, 0]);
            if (v == null) break;
            if (trimStr(String(v)) === norm) return col + 1;
        } catch (e) {
            break;
        }
    }
    try {
        for (var col = 0; col < 200; col++) {
            var v = footage.dataValue([0, col]);
            if (v == null) break;
            if (trimStr(String(v)) === norm) return col + 1;
        }
    } catch (e2) {}
    return 0;
}

/**
 * Replace images based on current data row. Optionally map each folder slot to a CSV column (file path).
 * @param {string} [mappingStr] - Pipe-separated 00_Template layer names; each layer's Source Text is used as file path or URL. Empty entry = skip that slot.
 * @param {string} [notFoundPathFromPanel] - Optional full path to img/notFound.jpg from panel (use when JSX extension path differs).
 * @returns {string} "OK:n" (n = count replaced) or "ERROR: message"
 */
function replaceimageJSX(mappingStr, notFoundPathFromPanel) {
    try {
        findAll();
        if (imagesFolder === null) {
            return "ERROR: 01_Images folder not found. Run Fresh Batch Setup.";
        }
        if (imagesFolder.numItems === 0) {
            return "ERROR: 01_Images folder is empty. Add at least one footage item to the folder.";
        }
        var templateCompFound = findComp(templateCompName);
        if (!templateCompFound || templateCompFound.numLayers < 1) {
            return "ERROR: 00_Template comp not found or has no layers. Run Fresh Batch Setup.";
        }
        var mapping = (mappingStr && mappingStr.length) ? mappingStr.split("|") : [];
        var notFoundPath = "";
        if (notFoundPathFromPanel && trimStr(String(notFoundPathFromPanel)).length > 0) {
            notFoundPath = trimStr(String(notFoundPathFromPanel));
            if (osCheck() === "PC") notFoundPath = notFoundPath.replace(/\//g, "\\");
        }
        if (!notFoundPath) {
            var extensionPath = getExtensionPath();
            var os = osCheck();
            var pathSeparator = (os === "PC") ? "\\" : "/";
            notFoundPath = extensionPath + pathSeparator + "img" + pathSeparator + "notFound.jpg";
        }
        var notFoundFile = File(notFoundPath);
        if (!notFoundFile.exists && notFoundPath.indexOf("/") >= 0) {
            notFoundFile = File(notFoundPath.replace(/\//g, "\\"));
        }
        if (!notFoundFile.exists && notFoundPath.indexOf("\\") >= 0) {
            notFoundFile = File(notFoundPath.replace(/\\/g, "/"));
        }
        var replaced = 0;
        var report = [];

        for (var i = 1; i <= imagesFolder.numItems; i++) {
            var slotName = imagesFolder.item(i).name;
            var layerName = (mapping[i - 1] != null) ? trimStr(String(mapping[i - 1])) : "";
            var filePath = "";
            var slotWhy = "";
            if (layerName) {
                filePath = getPathFromTemplateLayerSourceText(templateCompFound, layerName);
                if (!filePath) slotWhy = "layer \"" + layerName + "\" has no Source Text or it is empty in 00_Template";
            } else {
                slotWhy = "no mapping (select a 00_Template layer whose Source Text is the file path or URL)";
            }
            var file = File(filePath);
            if (!file.exists && notFoundFile.exists) file = notFoundFile;
            if (file.exists) {
                try {
                    imagesFolder.item(i).replace(file);
                    replaced++;
                    report.push("Slot " + i + " (" + slotName + "): " + (layerName || "—") + " -> replaced");
                } catch (e) {
                    infoWrite("Replace failed for slot " + i + ": " + e.toString());
                    return "ERROR: Could not replace slot " + i + " (" + slotName + "): " + e.toString();
                }
            } else {
                if (filePath) {
                    report.push("Slot " + i + " (" + slotName + "): \"" + layerName + "\" path not found: " + filePath);
                    return "ERROR: File not found, slot " + i + " (" + slotName + "): " + filePath;
                } else {
                    report.push("Slot " + i + " (" + slotName + "): " + (slotWhy || "no path"));
                }
            }
        }
        if (replaced === 0) {
            return "ERROR: No image replaced. " + report.join(" | ");
        }
        return "OK:" + replaced + " | " + report.join(" | ");
    } catch (error) {
        infoWrite("Error in replaceimageJSX: " + error.toString());
        return "ERROR: " + (error.toString() || "Unknown error");
    }
}

/** Delimiter between slot preview values (not in file paths). */
var PREVIEW_SLOT_DELIM = "||SLOT||";

/**
 * Return the path (or status) that would be used for each image slot from 00_Template layer Source Text.
 * Used so the panel can show "current value" next to each dropdown.
 * @param {string} [mappingStr] - Pipe-separated 00_Template layer names, one per folder item.
 * @returns {string} "OK:val1||SLOT||val2||SLOT||..." or "ERROR: message"
 */
function getImageReplacePreviewJSX(mappingStr) {
    try {
        findAll();
        if (imagesFolder === null) return "ERROR: 01_Images folder not found.";
        if (imagesFolder.numItems === 0) return "ERROR: 01_Images folder is empty.";
        var templateCompFound = findComp(templateCompName);
        if (!templateCompFound || templateCompFound.numLayers < 1) return "ERROR: 00_Template not found or empty.";
        var mapping = (mappingStr && mappingStr.length) ? mappingStr.split("|") : [];
        var parts = [];
        for (var i = 1; i <= imagesFolder.numItems; i++) {
            var layerName = (mapping[i - 1] != null) ? trimStr(String(mapping[i - 1])) : "";
            var filePath = "";
            var status = "";
            if (layerName) {
                filePath = getPathFromTemplateLayerSourceText(templateCompFound, layerName);
                if (!filePath) status = "— Layer \"" + layerName + "\" has no or empty Source Text";
            } else {
                status = "— No mapping";
            }
            parts.push(filePath ? filePath : (status || "— No path"));
        }
        return "OK:" + parts.join(PREVIEW_SLOT_DELIM);
    } catch (e) {
        return "ERROR: " + (e.toString() || "Unknown error");
    }
}


/**
 * Get data field names from imported CSV
 * Returns comma-separated string so CEP callback always receives a value (no spinner stuck).
 * @returns {string} Comma-separated field names, or empty string on error
 */
function dataFieldDropdown() {
    try {
        findAll();
        var compDataFound = findComp(dataCompName);
        if (compDataFound === null) {
            return "";
        }
        if (compDataFound.numLayers < 1) {
            return "";
        }
        var dataLayer = compDataFound.layer(1);
        var arrayHeader = [];

        for (var i = 1; i <= 99; i++) {
            try {
                var data = dataLayer("Data")("Outline")(i).name;
                arrayHeader.push(data);
            } catch (e) {
                break;
            }
        }

        return arrayHeader.join(",");
    } catch (error) {
        return "";
    }
}




// ============================================================================
// TEXT LAYER MANAGEMENT
// ============================================================================

/**
 * Add text layers with expressions linked to data
 */
function addHeaderTextJSX() {
    findAll();

    var dropdownResult = dataFieldDropdown();
    var headerTextArray = (dropdownResult && dropdownResult.length) ? dropdownResult.split(",") : [];

    for (var i = 0; i < headerTextArray.length; i++) {
        try {
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

/**
 * Add a single text layer for one data field to the active comp (quick-add).
 * Requires a composition to be selected in the Project panel (app.project.activeItem).
 * Returns "OK" or "ERROR: message" so the panel can show feedback.
 * @param {string} headerName - Display name for the layer
 * @param {number} headerIndex - 1-based index into Data/Outline
 * @returns {string}
 */
function addSingleHeaderTextJSX(headerName, headerIndex) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "ERROR: Select the composition first. Click your comp in the Project panel so it is highlighted, then click the quick-add button again.";
        }
        findAll();
        var headerIndexNum = Math.max(1, Math.floor(Number(headerIndex)));
        var expression =
            'text.sourceText.createStyle().setFontSize(60)\nvar selector = comp("' + selectorCompName + '").layer("Selector").effect("Slider Control")("Slider")\nvar dataElement\ncomp("' + dataCompName + '").layer(1)("Data")("Outline")(' + headerIndexNum + ')(selector)';
        var safeName = (headerName && headerName.length) ? String(headerName).replace(/[\r\n]/g, " ").substring(0, 100) : "Field " + headerIndexNum;
        var newLayer = comp.layers.addText(safeName);
        newLayer.position.setValue([0, comp.numLayers * 100]);
        newLayer.name = safeName;
        newLayer.text.sourceText.expression = expression;
        newLayer.text.sourceText.fontSize = 60;
        return "OK";
    } catch (error) {
        return "ERROR: " + (error.message || String(error));
    }
}

/**
 * Add the data-link expression to the selected text layer in the active comp.
 * Uses column index 1 (first data field) by default. Returns "OK" or "ERROR: message".
 * @returns {string}
 */
function addExpression() {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "ERROR: Select a composition first.";
        }
        var layer = comp.selectedLayers[0];
        if (!layer) {
            return "ERROR: Select a text layer in the comp.";
        }
        var srcText = layer.property("Source Text");
        if (!srcText) {
            return "ERROR: Selected layer is not a text layer.";
        }
        findAll();
        var headerIndexNum = 1;
        var expression =
            'text.sourceText.createStyle().setFontSize(60)\nvar selector = comp("' + selectorCompName + '").layer("Selector").effect("Slider Control")("Slider")\nvar dataElement\ncomp("' + dataCompName + '").layer(1)("Data")("Outline")(' + headerIndexNum + ')(selector)';
        layer.text.sourceText.expression = expression;
        return "OK";
    } catch (error) {
        return "ERROR: " + (error.message || String(error));
    }
}


// ============================================================================
// RENDER QUEUE MANAGEMENT
// ============================================================================

/**
 * Get available output module template names from AE (includes user-added templates).
 * Uses render queue item's outputModule.templates when RQ has items; otherwise fallback list.
 * @returns {string} Comma-separated template names
 */
function getOutputModuleTemplateNames() {
    var names = [];
    try {
        var rq = app.project.renderQueue;
        if (rq.numItems >= 1) {
            var om = rq.item(1).outputModule(1);
            if (om && om.templates && om.templates.length > 0) {
                for (var i = 0; i < om.templates.length; i++) {
                    names.push(String(om.templates[i]));
                }
            }
        }
    } catch (e) { }
    if (names.length === 0) {
        names = [
            "QT +",
            "H.264",
            "H.264 (Software)",
            "Lossless",
            "PNG +",
            "Uncompressed (Alpha)",
            "Photoshop 8-bit",
            "Photoshop 16-bit",
            "AVI (Photoshop)",
            "DV NTSC 48kHz",
            "DV PAL 48kHz"
        ];
    }
    return names.join(",");
}

/**
 * Open folder picker for export destination. Returns selected folder path or empty string.
 * @returns {string} Folder path or ""
 */
function chooseExportFolder() {
    var folder = Folder.selectDialog("Select folder for exports");
    if (folder === null) return "";
    return folder.fsName;
}

/**
 * Import CSV array data
 * @returns {Array} Array of CSV rows
 */
function importCSVarray(params) {
    findAll();
    var compData = findComp(dataCompName);
    if (compData === null || compData.numLayers === 0) {
        alert("Data comp not found or has no layers");
        return;
    }

    try {
        var csvLayer = compData.layer(1)("Data")("Number of Rows").value;
        var data = [];

        // Get the data from the imported CSV file
        var dataFolder = findFolder(dataFolderNameS);
        if (dataFolder === null || dataFolder.numItems === 0) {
            alert("No data file found. Please import a CSV file first.");
            return;
        }

        // Read from the imported file
        var file = File.openDialog("Select CSV File");
        if (file === null) {
            return; // User canceled the dialog
        }

        file.open('r');
        var csvContent = file.read();
        file.close();

        var rows = csvContent.split("\n");
        for (var i = 0; i < rows.length; i++) {
            if (trimStr(rows[i]) !== "") {
                data.push(rows[i].split(","));
            }
        }

        return data;
    } catch (error) {
        alert("Error reading CSV data: " + error.toString());
        return [];
    }
}



/**
 * Add single item to render queue (legacy function)
 */
function singleAddRenderQueue() {
    addtoRenderQueue(false);
}


















/**
 * Add current composition to render queue
 * @param {boolean} batchRender - Whether this is part of a batch render
 * @param {string} [outputTemplateName] - Output module template (e.g. "H.264", "QT +"). Default "QT +".
 * @param {string} [exportFolderPath] - Full path to export folder. Default project folder + "Exports".
 */
function addtoRenderQueue(batchRender, outputTemplateName, exportFolderPath) {
    try {
        findAll();

        if (app.project.file === null) {
            alert("Please save the project before batch export.");
            infoWrite("Batch export: Save project first.");
            return;
        }

        var comp = app.project.activeItem;
        if (comp === null || !(comp instanceof CompItem)) {
            alert("Please select the template composition (00_Template) before batch export.");
            infoWrite("Batch export: Select template comp.");
            return;
        }

        var compTemplateFound = findComp(templateCompNameS);
        if (compTemplateFound === null) {
            alert("Template composition (00_Template) not found. Run Fresh Batch Setup first.");
            infoWrite("Batch export: Template comp missing.");
            return;
        }
        if (compTemplateFound.numLayers < 1) {
            alert("Template comp has no layers. Add the data comp as layer 1.");
            infoWrite("Batch export: No data layer in template.");
            return;
        }

        var compFound = findComp(selectorCompName);
        if (compFound === null) {
            alert("Selector composition (03_Selector) not found. Run Fresh Batch Setup first.");
            infoWrite("Batch export: Selector comp missing.");
            return;
        }
        var sliderLayer = compFound.layers.byName(selectorName);
        if (sliderLayer === null) {
            alert("Selector layer not found in 03_Selector comp.");
            infoWrite("Batch export: Selector layer missing.");
            return;
        }
        var slider = sliderLayer.property("Effects")("Slider Control")("Slider");
        var rowNumber = Math.round(slider.value);

        // Export filename label: from 00_Template layer 1 Source Text, or from selected data column value
        var dataCompLabelRaw = "row";
        if (_batchLabelSource === "column" && _batchLabelColumn && _batchLabelColumn.length > 0) {
            dataCompLabelRaw = getExportLabelForRow(_batchLabelColumn, rowNumber);
        } else {
            dataCompLabelRaw = getExportLabelFromTemplateLayer(compTemplateFound);
        }
        var dataCompLabel = sanitizeForFileName(dataCompLabelRaw, 80);

        // Use passed-in args or fall back to values set by setExportOptions() from panel
        var templateName = (outputTemplateName && outputTemplateName.length > 0) ? outputTemplateName : _batchOutputTemplate;
        var exportPath = (exportFolderPath != null && exportFolderPath.length > 0) ? exportFolderPath : _batchExportFolder;
        _batchOutputTemplate = templateName;
        _batchExportFolder = exportPath;

        var exportFolder;
        if (exportPath.length > 0) {
            exportFolder = new Folder(exportPath);
            if (!exportFolder.exists && !exportFolder.create()) {
                alert("Unable to create export folder. Check path.");
                infoWrite("Batch export: Cannot create export folder.");
                return;
            }
        } else {
            var folderPath = getProjectFolderPath(app.project.file.fsName);
            exportFolder = new Folder(folderPath + "Exports");
            if (!exportFolder.exists && !exportFolder.create()) {
                alert("Unable to create Exports folder. Check project path.");
                infoWrite("Batch export: Cannot create Exports folder.");
                return;
            }
        }

        var item = app.project.renderQueue.items.add(comp);
        var outputModule = item.outputModule(1);
        try {
            outputModule.applyTemplate(templateName);
        } catch (e) {
            outputModule.applyTemplate("QT +");
            infoWrite("Output template \"" + templateName + "\" not found, using QT +");
        }
        item.applyTemplate("Best Settings");

        // Build filename explicitly: rowNumber_label.ext (extension from template default or .mov)
        var omFileName = outputModule.file ? String(outputModule.file.name) : "";
        var ext = ".mov";
        if (omFileName.length > 0) {
            var lastDot = omFileName.lastIndexOf(".");
            if (lastDot > 0 && lastDot < omFileName.length - 1) {
                ext = omFileName.substring(lastDot);
                if (ext.indexOf("\\") >= 0 || ext.indexOf("/") >= 0) ext = ".mov";
            }
        }
        var baseName = rowNumber + "_" + dataCompLabel + ext;
        var sep = (exportFolder.fsName.indexOf("/") >= 0) ? "/" : "\\";
        var outputPath = exportFolder.fsName + sep + baseName;
        var myFile = new File(outputPath);
        outputModule.file = myFile;

        infoWrite("Batch export: Rendering row " + rowNumber + " - " + dataCompLabel);

        app.project.renderQueue.render();

        var renderItem = app.project.renderQueue.item(app.project.renderQueue.numItems);
        if (renderItem !== null && typeof renderItem.onStatusChanged !== "undefined") {
            renderItem.onStatusChanged = function () {
                if (renderItem.status === RQItemStatus.DONE) {
                    myStatusChanged(batchRender);
                }
            };
        } else {
            myStatusChanged(batchRender);
        }
    } catch (error) {
        alert("Batch export error: " + error.toString());
        infoWrite("Batch export error: " + error.toString());
    }
}

/**
 * Handle render status change callback
 * @param {boolean} batchRender - Whether to continue batch rendering
 */
function myStatusChanged(batchRender) {
    try {
        var renderQueue = app.project.renderQueue;
        while (renderQueue.numItems > 0) {
            renderQueue.item(1).remove();
        }
        doneAfterRender(batchRender);
    } catch (e) {
        infoWrite("Batch render callback: " + e.toString());
    }
}


/**
 * Called after render completes
 * @param {boolean} batchRender - Whether to continue batch rendering
 */
function doneAfterRender(batchRender) {
    $.sleep(1000);
    incrementSelector();
    findAll();

    if (batchRender !== true) return;

    var totalRows = getDataRowCount();
    var compFound = findComp(selectorCompName);
    if (compFound === null) return;
    var sliderLayer = compFound.layers.byName(selectorName);
    if (sliderLayer === null) return;
    var slider = sliderLayer.property("Effects")("Slider Control")("Slider");
    var rowNumber = Math.round(slider.value);

    if (totalRows <= 0) {
        infoWrite("Batch export complete (no row count).");
        return;
    }
    if (rowNumber <= totalRows) {
        addtoRenderQueue(true, _batchOutputTemplate, _batchExportFolder);
    } else {
        infoWrite("Batch export complete. Rendered " + totalRows + " row(s).");
    }
}





function createFolder1() {
    findAll();
    var compTemplateFound = findComp(templateCompNameS);
    if (compTemplateFound === null || compTemplateFound.numLayers < 1) {
        alert("Template comp or data layer not found.");
        return;
    }
    var dataComp = compTemplateFound.layer(1).property("Source Text").value.text;
    if (app.project.file === null) {
        alert("Save the project first.");
        return;
    }
    var folderPath = getProjectFolderPath(app.project.file.fsName);
    var myFolder = new Folder(folderPath + "Exports/" + dataComp);
    if (!myFolder.exists && !myFolder.create()) {
        alert("Unable to create folder.");
    }
}



/**
 * Start batch rendering process
 */
function batchRender() {
    addtoRenderQueue(true);
}

// ============================================================================
// IMAGE REPLACE OPTIONS
// ============================================================================

/**
 * Add image replace option
 * @returns {string} "Success" or "Error"
 */
function addReplaceImageOptionJSX() {
    try {
        findAll();
        if (imagesComp === null) {
            infoWrite("Error: Images comp not found");
            return "Error";
        }
        // Add logic to add image replace option
        // This would typically add a new layer or option to the images comp
        infoWrite("Image replace option added");
        return "Success";
    } catch (error) {
        infoWrite("Error in addReplaceImageOptionJSX: " + error.toString());
        return "Error";
    }
}

/**
 * Get list of available image replace options
 * @returns {string} Comma-separated list of image names
 */
function getImageReplaceOptions() {
    try {
        findAll();
        var options = [];
        if (imagesFolder !== null && imagesFolder.numItems > 0) {
            for (var i = 1; i <= imagesFolder.numItems; i++) {
                options.push(imagesFolder.item(i).name);
            }
        }
        return options.join(",");
    } catch (error) {
        infoWrite("Error in getImageReplaceOptions: " + error.toString());
        return "";
    }
}

// ============================================================================
// GOOGLE SHEETS INTEGRATION
// ============================================================================

/**
 * Import data from Google Sheets
 * @param {string} sheetId - Google Sheet ID
 * @param {string} sheetName - Name of the sheet tab
 * @returns {string} Success or error message
 * @note This is a placeholder - needs OAuth implementation
 */
function importGoogleSheet(sheetId, sheetName) {
    try {
        // Validate inputs
        if (!sheetId || sheetId.length < 10) {
            infoWrite("Error: Invalid Sheet ID");
            return "Error: Invalid Sheet ID";
        }

        if (!sheetName || sheetName.length === 0) {
            infoWrite("Error: Sheet Name is required");
            return "Error: Sheet Name is required";
        }

        // This function needs to be implemented with proper Google Sheets API integration
        // For now, it returns an error message
        infoWrite("Google Sheets import not yet fully implemented. Please use CSV import instead.");
        return "Error: Google Sheets import requires OAuth setup";
    } catch (error) {
        infoWrite("Error in importGoogleSheet: " + error.toString());
        return "Error: " + error.toString();
    }
}


