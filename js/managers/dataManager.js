/**
 * Data Manager Module
 * Handles all data import/export operations (CSV, Google Sheets)
 */

const JSON_URL_STORAGE_KEY_PREFIX = "refresh_json_url_";

const DataManager = {
	/**
	 * Normalize project path for use as storage key (consistent across sessions)
	 */
	_normalizeProjectKey: function (projectPath) {
		if (!projectPath || typeof projectPath !== "string") return "";
		return projectPath.replace(/\\/g, "/").toLowerCase().trim();
	},

	/**
	 * Save JSON data URL for the current project (so it can be restored when reopening)
	 */
	saveJsonUrlForProject: function (projectPath, url) {
		var key = this._normalizeProjectKey(projectPath);
		if (!key) return;
		try {
			if (window.__adobe_cep__) {
				localStorage.setItem(JSON_URL_STORAGE_KEY_PREFIX + key, url || "");
			}
		} catch (e) {}
	},

	/**
	 * Load saved JSON data URL for the given project path
	 * @param {string} projectPath - Project folder path from getfilepath()
	 * @param {function(string)} callback - Called with the saved URL or ""
	 */
	loadJsonUrlForProject: function (projectPath, callback) {
		var key = this._normalizeProjectKey(projectPath);
		if (!key || typeof callback !== "function") return;
		try {
			var url = (window.__adobe_cep__ && localStorage.getItem(JSON_URL_STORAGE_KEY_PREFIX + key)) || "";
			callback(url || "");
		} catch (e) {
			callback("");
		}
	},

    /**
     * Import CSV file
     */
    importCSV: function () {
        const csInterface = createCSInterface();

        // Clear any previous errors
        if (typeof ErrorHandler !== 'undefined') {
            ErrorHandler.clearError();
        }

        // Disable buttons during import
        if (typeof ButtonStateManager !== 'undefined') {
            ButtonStateManager.disableAllActions();
        }

        // Show loading state
        showLoading(true, "Importing CSV file...");
        showMessage("", false);

        csInterface.evalScript('importDataFileJSX()', (csvString) => {
            try {
                // Check for error codes from JSX
                if (csvString && csvString.startsWith('ERROR:')) {
                    showLoading(false);
                    // Re-enable buttons on error
                    if (typeof ButtonStateManager !== 'undefined') {
                        ButtonStateManager.enableAllActions();
                    }
                    const errorCode = csvString.replace('ERROR:', '');
                    if (typeof ErrorHandler !== 'undefined') {
                        ErrorHandler.showError(errorCode);
                    } else {
                        showMessage("Error: " + csvString, true);
                    }
                    return;
                }

                if (!csvString || csvString === "undefined" || csvString.length === 0) {
                    showLoading(false);
                    // Re-enable buttons on error
                    if (typeof ButtonStateManager !== 'undefined') {
                        ButtonStateManager.enableAllActions();
                    }
                    if (typeof ErrorHandler !== 'undefined') {
                        ErrorHandler.showError(ErrorHandler.ERROR_CODES.FILE_EMPTY);
                    } else {
                        showMessage("Error: No data returned from file import. Please check the file format.", true);
                    }
                    return;
                }

                // Estimate file size for performance planning
                const sizeInfo = estimateCSVSize(csvString);

                if (sizeInfo.isLarge) {
                    showLoading(true, `Processing large file (${sizeInfo.rowCount} rows, ${sizeInfo.sizeKB} KB)...`);
                    showMessage(`Large file detected. Processing in batches. Estimated time: ${sizeInfo.estimatedProcessingTime}`, false);
                }

                // Parse with progress callback for large files
                const progressCallback = sizeInfo.isLarge ? (current, total) => {
                    const percent = Math.round((current / total) * 100);
                    showLoading(true, `Processing CSV: ${percent}% (${current}/${total} rows)`);
                } : null;

                const dataArray = parseCSV(csvString, progressCallback);

                showLoading(false);

                if (dataArray.length === 0) {
                    if (typeof ErrorHandler !== 'undefined') {
                        ErrorHandler.showError(ErrorHandler.ERROR_CODES.DATA_EMPTY);
                    } else {
                        showMessage("Error: No valid data found in CSV file.", true);
                    }
                    return;
                }

                // Validate data
                const validation = typeof PreviewManager !== 'undefined' ?
                    PreviewManager.validateData(dataArray) :
                    { isValid: true, rowCount: dataArray.length - 1, columnCount: dataArray[0] ? dataArray[0].length : 0 };

                // Prepare statistics
                const stats = {
                    rowCount: validation.rowCount,
                    columnCount: validation.columnCount,
                    sizeKB: sizeInfo.sizeKB,
                    isValid: validation.isValid,
                    warnings: validation.warnings || []
                };

                // Re-enable buttons
                if (typeof ButtonStateManager !== 'undefined') {
                    ButtonStateManager.enableAllActions();
                }

                // Show preview before importing
                if (typeof PreviewManager !== 'undefined') {
                    PreviewManager.showPreview(dataArray, stats, (confirmedData) => {
                        // User confirmed - proceed with import
                        this.finalizeImport(confirmedData, stats);
                    });
                } else {
                    // No preview manager - import directly
                    this.finalizeImport(dataArray, stats);
                }
            } catch (error) {
                showLoading(false);
                // Re-enable buttons on error
                if (typeof ButtonStateManager !== 'undefined') {
                    ButtonStateManager.enableAllActions();
                }
                if (typeof ErrorHandler !== 'undefined') {
                    ErrorHandler.handleException(error, 'CSV Import');
                } else {
                    showMessage("Error parsing CSV data: " + error.toString(), true);
                }
            }
        });
    },

    /**
     * Finalize data import after preview confirmation
     * @param {Array} dataArray - Data to import
     * @param {Object} stats - Statistics
     */
    finalizeImport: function (dataArray, stats) {
        showMessage(`CSV imported successfully. ${stats.rowCount} rows processed.`, false);

        // Show statistics panel
        if (typeof PreviewManager !== 'undefined') {
            PreviewManager.showStatsPanel(stats);
        }

        // Populate dropdown and add text layers
        if (typeof UIManager !== 'undefined') {
            UIManager.populateDataFieldDropdown();
        }
        if (typeof TextManager !== 'undefined') {
            TextManager.addTextLayers();
        }
    },

    /**
     * Import Google Sheet data
     * @param {string} sheetId - Google Sheet ID
     * @param {string} sheetName - Name of the sheet tab
     */
    importGoogleSheet: function (sheetId, sheetName) {
        // Input validation with better error messages
        if (!validateSheetId(sheetId)) {
            if (typeof ErrorHandler !== 'undefined') {
                ErrorHandler.showError(ErrorHandler.ERROR_CODES.SHEETS_INVALID_ID);
            } else {
                alert("Please enter a valid Sheet ID (minimum 10 characters)");
            }
            const sheetIdElement = document.getElementById(Config.ui.sheetId);
            if (sheetIdElement) sheetIdElement.focus();
            return;
        }

        if (!validateSheetName(sheetName)) {
            if (typeof ErrorHandler !== 'undefined') {
                ErrorHandler.showError(ErrorHandler.ERROR_CODES.SHEETS_INVALID_NAME);
            } else {
                alert("Please enter a Sheet Name");
            }
            const sheetNameElement = document.getElementById(Config.ui.sheetName);
            if (sheetNameElement) sheetNameElement.focus();
            return;
        }

        // Show loading state
        showLoading(true, "Importing from Google Sheets...");
        showMessage("", false);

        const csInterface = createCSInterface();
        // Escape quotes to prevent script injection
        const escapedSheetId = escapeQuotes(sheetId);
        const escapedSheetName = escapeQuotes(sheetName);

        csInterface.evalScript('importGoogleSheet("' + escapedSheetId + '", "' + escapedSheetName + '")', function (result) {
            showLoading(false);
            if (result && result !== "undefined" && result.indexOf("Error") === -1) {
                showMessage("Data imported successfully", false);
                if (typeof UIManager !== 'undefined') {
                    UIManager.populateDataFieldDropdown();
                }
                if (typeof TextManager !== 'undefined') {
                    TextManager.addTextLayers();
                }
            } else {
                showMessage("Error importing Google Sheet data: " + result + ". Please check your credentials and try again.", true);
            }
        });
    },

    /**
     * Get data array from CSV
     */
    getDataArray: function () {
        const csInterface = createCSInterface();
        csInterface.evalScript('importCSVarray()', function (result) {
            // Handle result if needed
            return result;
        });
	},

	/**
	 * Convert rows (array of arrays) to a CSV string (header + data, quoted as needed).
	 */
	rowsToCSVString: function (rows) {
		if (!rows || rows.length === 0) return "";
		function escapeCell(val) {
			var s = val === null || val === undefined ? "" : String(val);
			if (s.indexOf(",") >= 0 || s.indexOf('"') >= 0 || s.indexOf("\n") >= 0 || s.indexOf("\r") >= 0) {
				return '"' + s.replace(/"/g, '""') + '"';
			}
			return s;
		}
		return rows.map(function (row) {
			return row.map(escapeCell).join(",");
		}).join("\n");
	},

	/**
	 * Render data preview (summary + table) into an element (e.g. mySheetResults).
	 */
	renderPreviewInElement: function (rows, stats, elementId) {
		var el = document.getElementById(elementId || Config.ui.mySheetResults);
		if (!el) return;
		var rowCount = stats.rowCount != null ? stats.rowCount : (rows.length - 1);
		var colCount = stats.columnCount != null ? stats.columnCount : (rows[0] ? rows[0].length : 0);
		var previewRows = Math.min(15, rows.length);
		var header = rows[0] || [];
		var html = '<p class="preview-summary">' + rowCount + ' rows, ' + colCount + ' columns';
		if (stats.sizeKB != null) html += ' &middot; ' + stats.sizeKB + ' KB';
		html += '</p><table class="preview-table"><thead><tr>';
		header.forEach(function (h) {
			html += '<th>' + (h !== undefined && h !== null ? String(h).replace(/</g, "&lt;") : "") + '</th>';
		});
		html += '</tr></thead><tbody>';
		for (var i = 1; i < previewRows; i++) {
			html += '<tr>';
			var row = rows[i] || [];
			for (var c = 0; c < header.length; c++) {
				var cell = row[c];
				html += '<td>' + (cell !== undefined && cell !== null ? String(cell).replace(/</g, "&lt;") : "") + '</td>';
			}
			html += '</tr>';
		}
		html += '</tbody></table>';
		if (rows.length > previewRows) {
			html += '<p class="preview-summary">Showing first ' + (previewRows - 1) + ' data rows.</p>';
		}
		el.innerHTML = html;
		el.classList.remove("is-status");
	},

	/**
	 * Import JSON data from a URL: fetch → preview in mySheetResults → CSV temp file → AE import.
	 * Supports array-of-objects or array-of-arrays JSON.
	 */
	importJsonFromUrl: function (url) {
		var self = this;
		url = (url || "").trim();

		if (!url) {
			showMessage("Please enter a JSON URL.", true);
			return;
		}
		if (!/^https?:\/\//i.test(url)) {
			showMessage("JSON URL must start with http:// or https://", true);
			return;
		}

		showLoading(true, "Loading JSON data...");
		showMessage("", false);

		fetch(url)
			.then(function (res) {
				if (!res.ok) throw new Error("HTTP " + res.status);
				return res.text();
			})
			.then(function (text) {
				var json;
				try {
					json = JSON.parse(text);
				} catch (e) {
					throw new Error("Invalid JSON: " + e.message);
				}

				var rows = [];
				if (Array.isArray(json) && json.length > 0) {
					if (Array.isArray(json[0])) {
						rows = json;
					} else if (typeof json[0] === "object") {
						var header = Object.keys(json[0]);
						rows.push(header);
						json.forEach(function (obj) {
							var row = header.map(function (key) {
								var v = obj[key];
								return v === null || v === undefined ? "" : String(v);
							});
							rows.push(row);
						});
					}
				}

				if (!rows.length) {
					throw new Error("JSON did not contain a supported array structure.");
				}

				var stats = {
					rowCount: rows.length - 1,
					columnCount: rows[0].length,
					sizeKB: (text.length / 1024).toFixed(2),
					isValid: true
				};

				showLoading(false);
				self.renderPreviewInElement(rows, stats, Config.ui.mySheetResults);

				var csvString = self.rowsToCSVString(rows);
				var csInterface = createCSInterface();

				csInterface.evalScript("getfilepath()", function (projectFolder) {
					projectFolder = (projectFolder != null) ? String(projectFolder).trim() : "";
					if (!projectFolder || projectFolder.indexOf("ERROR") === 0 || projectFolder.indexOf("EvalScript error") >= 0) {
						showMessage("Save the project first, then load the JSON URL again.", true);
						return;
					}
					showLoading(true, "Importing into After Effects...");

					var fs, pathModule, csvPath, folderForJSX, fileNameForJSX;
					try {
						fs = require("fs");
						pathModule = require("path");
					} catch (e) {
						showLoading(false);
						showMessage("Node.js not available in panel. Use CSV file import for this data.", true);
						return;
					}

					var fileName = "RefreshBatch_import.csv";
					csvPath = pathModule.join(projectFolder, fileName);
					folderForJSX = projectFolder.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
					fileNameForJSX = fileName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

					try {
						fs.writeFileSync(csvPath, csvString, "utf8");
					} catch (err) {
						showLoading(false);
						showMessage("Could not write file to project folder: " + err.message, true);
						return;
					}

					csInterface.evalScript('importDataFileFromPath("' + folderForJSX + '", "' + fileNameForJSX + '")', function (result) {
						showLoading(false);
						result = (result != null) ? String(result) : "";
						if (result.indexOf("ERROR:") === 0) {
							showMessage("AE import failed: " + result, true);
							return;
						}
						if (result.indexOf("OK:") !== 0) {
							showMessage("Import result unclear (got: " + (result.length > 50 ? result.substring(0, 50) + "..." : result) + "). Check AE Info panel. CSV saved to: " + csvPath, true);
							return;
						}
						showMessage("JSON URL imported into AE. " + stats.rowCount + " rows. CSV file: " + csvPath, false);
						self.saveJsonUrlForProject(projectFolder, url);
						if (typeof UIManager !== "undefined") UIManager.populateDataFieldDropdown(true);
						if (typeof TextManager !== "undefined") TextManager.addTextLayers();
					});
				});
			})
			.catch(function (err) {
				showLoading(false);
				showMessage("Error loading JSON URL: " + err.message, true);
			});
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
