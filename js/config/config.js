/**
 * Configuration Module
 * Centralized configuration for the extension
 */

const Config = {
    // Folder names
    folders: {
        final: "reFresh Batch Setup",
        images: "01_Images",
        data: "02_Data",
        footage: "03_Footage",
        comps: "04_Comps",
        selector: "0S_selector"
    },

    // Composition names
    comps: {
        template: "00_Template",
        images: "01_Images",
        data: "02_Data",
        selector: "03_Selector"
    },

    // Layer names
    layers: {
        selector: "Selector"
    },

    // Default values
    defaults: {
        sheetId: "",
        sheetName: "",
        templateWidth: 1920,
        templateHeight: 1080,
        templateDuration: 150,
        templateFrameRate: 29.97
    },

    // UI Element IDs
    ui: {
        dataRowValue: "data-row-value",
        dropdownName: "dropdown-name",
        sheetId: "sheetId",
        sheetName: "sheetName",
        importPanel: "importPanel",
        gDriveSetupPanel: "gDriveSetupPanel",
		imageReplaceList: "imageReplaceList",
		imageReplaceMappingList: "imageReplaceMappingList",
        mySheetResults: "mySheetResults",
        myError: "myError",
        outputModuleSelect: "outputModuleSelect",
        exportFolderPath: "exportFolderPath",
		exportPresetSelect: "exportPresetSelect",
		jsonUrlInput: "jsonUrlInput",
		dataFieldQuickAdd: "dataFieldQuickAdd"
    },

    // Validation rules
    validation: {
        minSheetIdLength: 10,
        minSheetNameLength: 1
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
