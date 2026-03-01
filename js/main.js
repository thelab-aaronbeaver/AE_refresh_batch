/**
 * Main Entry Point
 * Refactored to use modular architecture
 * 
 * This file now acts as a bridge between the HTML UI and the modular managers
 */

// Note: In CEP extensions, modules are loaded via script tags in HTML
// All manager modules and utilities are loaded before this file

// Global variables (kept for backward compatibility)
let globalfilepath = null;
var globalAuth;
var projectFilePath;

// ============================================================================
// UI Event Handlers - These functions are called from HTML onclick handlers
// ============================================================================

/**
 * Close the extension panel
 */
function closepanel() {
	UIManager.closePanel();
}

/**
 * Create folder structure
 */
function createFolder() {
	FolderManager.createFolderStructure();
}

/**
 * Show/hide data setup panel
 */
function dataSetupShowHide() {
	UIManager.toggleDataSetup();
}

/**
 * Show/hide Google Drive setup panel
 */
function gDriveSetupShowHide() {
	UIManager.toggleGDriveSetup();
}

/**
 * Increment data row selector
 */
function incrementSelectorJS() {
	UIManager.incrementSelector();
}

/**
 * Decrement data row selector
 */
function decrementSelectorJS() {
	UIManager.decrementSelector();
}

/**
 * Apply data row from the text input (on Enter). Parses number and sets selector in AE.
 */
function applyDataRowFromInput() {
	UIManager.setDataRowFromInput();
}

/** Debounce timer for blur-driven row apply (avoids rapid replaceImage calls when tabbing). */
var _dataRowBlurDebounce = null;

/**
 * Debounced apply data row (use for onblur so we only run after user stops).
 */
function applyDataRowFromInputDebounced() {
	if (_dataRowBlurDebounce) clearTimeout(_dataRowBlurDebounce);
	_dataRowBlurDebounce = setTimeout(function () {
		_dataRowBlurDebounce = null;
		UIManager.setDataRowFromInput();
	}, 300);
}

/**
 * Quick-add: add a single data field as text layer to the template comp
 */
function addSingleHeaderTextJS(fieldName, headerIndex) {
	UIManager.addSingleHeaderText(fieldName, headerIndex);
}

/**
 * Import CSV data file
 */
function importDataFileJS() {
	DataManager.importCSV();
}

/**
 * Import JSON data from URL (Data Setup)
 */
function importJsonUrlJS() {
	const input = document.getElementById(Config.ui.jsonUrlInput);
	const url = input ? input.value : "";
	if (typeof DataManager !== "undefined" && DataManager.importJsonFromUrl) {
		DataManager.importJsonFromUrl(url);
	}
}

/**
 * Import Google Sheet data
 */
function importsheetdata() {
	const sheetId = document.getElementById(Config.ui.sheetId).value.trim();
	const sheetName = document.getElementById(Config.ui.sheetName).value.trim();
	DataManager.importGoogleSheet(sheetId, sheetName);
}

/**
 * Populate data field quick-add buttons from 02_Data comp (refresh)
 */
function populateDataFieldDropdown() {
	UIManager.populateDataFieldDropdown();
}

/**
 * Add text layers
 */
function addTextJS() {
	TextManager.addTextLayers();
}

/**
 * Add expression to layer
 */
function addExpression() {
	TextManager.addExpression();
}

/**
 * Replace image
 */
function replaceimageJS() {
	ImageManager.replaceImage();
}

/**
 * Add image replace option
 */
function addReplaceImageOption() {
	ImageManager.addReplaceImageOption();
}

/**
 * Populate image replace mapping (00_Template layer dropdowns per image slot)
 */
function populateImageReplaceList() {
	if (typeof UIManager !== "undefined" && UIManager.populateImageReplaceMapping) {
		UIManager.populateImageReplaceMapping();
	}
}

/**
 * Get data array from CSV
 */
function dataArrayCSVJS() {
	DataManager.getDataArray();
}

/**
 * Choose export folder (opens AE folder picker)
 */
function chooseExportFolderJS() {
	RenderManager.chooseExportFolder();
}

/**
 * Refresh output module dropdown from AE (use after adding new templates)
 */
function refreshOutputModulesJS() {
	if (typeof RenderManager !== "undefined" && RenderManager.populateOutputModuleDropdown) {
		RenderManager.populateOutputModuleDropdown();
	}
}

/**
 * Save current export settings (output + folder) as a named preset
 */
function saveExportPresetJS() {
	var name = window.prompt("Preset name (e.g. YouTube, Client A):", "");
	if (name == null) return;
	if (typeof RenderManager !== "undefined" && RenderManager.saveCurrentAsPreset) {
		RenderManager.saveCurrentAsPreset(name);
	}
}

/**
 * Render only the current data row (uses selected output module and folder)
 */
function renderCurrentRowJS() {
	RenderManager.renderCurrentRow();
}

/**
 * Add to render queue
 */
function addtoRenderQueueJS() {
	RenderManager.addToRenderQueue();
}

/**
 * Batch render
 */
function batchRenderQueueJS() {
	RenderManager.batchRender();
}

/**
 * Get project path (kept for backward compatibility)
 */
function getprojectpath() {
	FolderManager.getProjectPath((path) => {
		globalfilepath = path;
		return globalfilepath;
	});
}

/**
 * Save current project (kept for backward compatibility)
 */
function saveCurrentProject() {
	FolderManager.saveProject((path) => {
		projectFilePath = path;
		getprojectpath();
	});
}

// ============================================================================
// Legacy Functions (kept for compatibility, but should be migrated)
// ============================================================================

/**
 * Add effect (legacy - may need refactoring)
 */
function addEffect() {
	const csInterface = createCSInterface();
	csInterface.evalScript('addEffect()');
}

/**
 * Close data preview modal (always works, even if PreviewManager not loaded)
 */
function closeDataPreview() {
	if (typeof PreviewManager !== 'undefined') {
		PreviewManager.closePreview();
	} else {
		var modal = document.getElementById('dataPreviewModal');
		if (modal) {
			modal.setAttribute('hidden', '');
			modal.style.display = 'none';
		}
	}
}

/**
 * Confirm data import from preview
 */
function confirmDataImport() {
	if (typeof PreviewManager !== 'undefined') {
		PreviewManager.confirmImport();
	}
}

// Populate export options when panel is ready; load project-specific JSON URL; sync data row from AE
function initExportOptions() {
	if (typeof RenderManager === "undefined") return;
	if (RenderManager.populateOutputModuleDropdown) RenderManager.populateOutputModuleDropdown();
	if (RenderManager.populatePresetDropdown) RenderManager.populatePresetDropdown();
	if (RenderManager.populateExportLabelColumnDropdown) RenderManager.populateExportLabelColumnDropdown();
	// When user changes filename label source or column, refresh the preview
	var labelSourceEl = document.getElementById(Config.ui.exportLabelSource);
	var columnEl = document.getElementById(Config.ui.exportLabelColumn);
	if (labelSourceEl) {
		labelSourceEl.addEventListener("change", function () {
			if (RenderManager && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	}
	if (columnEl) {
		columnEl.addEventListener("change", function () {
			if (RenderManager && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	}
	FolderManager.getProjectPath(function (path) {
		if (path && typeof DataManager !== "undefined" && DataManager.loadJsonUrlForProject) {
			DataManager.loadJsonUrlForProject(path, function (url) {
				var input = document.getElementById(Config.ui.jsonUrlInput);
				if (input && url) input.value = url;
			});
		}
	});
	// Sync data row selector from AE
	if (typeof UIManager !== "undefined" && UIManager.syncDataRowFromAE) {
		UIManager.syncDataRowFromAE();
	}
	// Auto-update data field quick-add from 02_Data when panel loads (if CSV/data already in project)
	if (typeof UIManager !== "undefined" && UIManager.populateDataFieldDropdown) {
		UIManager.populateDataFieldDropdown(true);
	}
	// Build image replace mapping UI (image slot → data field) when panel loads
	if (typeof UIManager !== "undefined" && UIManager.populateImageReplaceMapping) {
		UIManager.populateImageReplaceMapping();
	}
}
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initExportOptions);
} else {
	initExportOptions();
}
