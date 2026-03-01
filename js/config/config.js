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
        templateWidth: 1920,
        templateHeight: 1080,
        templateDuration: 150,
        templateFrameRate: 29.97
    },

    // UI Element IDs
    ui: {
        dataRowValue: "data-row-value",
        dropdownName: "dropdown-name",
        importPanel: "importPanel",
		imageReplaceList: "imageReplaceList",
		imageReplaceMappingList: "imageReplaceMappingList",
        mySheetResults: "mySheetResults",
        myError: "myError",
        outputModuleSelect: "outputModuleSelect",
        exportFolderPath: "exportFolderPath",
		exportPresetSelect: "exportPresetSelect",
		jsonUrlInput: "jsonUrlInput",
		dataFieldQuickAdd: "dataFieldQuickAdd",
		exportFilenamePreview: "exportFilenamePreview",
		exportLabelSource: "exportLabelSource",
		exportLabelColumn: "exportLabelColumn"
    },

    // Validation rules
    validation: {}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
