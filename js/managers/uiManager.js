/**
 * UI Manager Module
 * Handles UI interactions and DOM manipulations
 */

const UIManager = {
	/**
	 * Close the extension panel
	 */
	closePanel: function() {
		const csInterface = createCSInterface();
		csInterface.closeExtension();
	},
	
	/**
	 * Show/hide data import panel
	 */
	toggleDataSetup: function() {
		const importPanel = document.getElementById(Config.ui.importPanel);
		toggleElementVisibility(Config.ui.importPanel, "block");
		FolderManager.saveProject();
		FolderManager.getProjectPath(function(projectPath) {
			if (typeof DataManager !== "undefined" && DataManager.loadJsonUrlForProject) {
				DataManager.loadJsonUrlForProject(projectPath, function(url) {
					const input = document.getElementById(Config.ui.jsonUrlInput);
					if (input && url) input.value = url;
				});
			}
			// Refresh data field list from 02_Data comp when opening Data Setup
			if (importPanel && importPanel.style.display !== "none") {
				UIManager.populateDataFieldDropdown(true);
			}
		});
		if (importPanel && importPanel.style.display !== "none") {
			var jsonSection = document.getElementById("jsonUrlSection");
			if (jsonSection) {
				jsonSection.classList.add("json-url-emphasize");
				jsonSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
				setTimeout(function() {
					jsonSection.classList.remove("json-url-emphasize");
				}, 2500);
			}
			var jsonInput = document.getElementById(Config.ui.jsonUrlInput);
			if (jsonInput) {
				jsonInput.focus();
			}
		}
	},
	
	/**
	 * Increment data row selector
	 */
	incrementSelector: function() {
		const csInterface = createCSInterface();
		csInterface.evalScript('incrementSelector()', (result) => {
			const dataRowElement = document.getElementById(Config.ui.dataRowValue);
			if (dataRowElement) {
				dataRowElement.value = String(result);
				UIManager._lastAppliedRowValue = Math.max(0, Math.floor(Number(result)));
			}
			if (typeof ImageManager !== 'undefined') {
				ImageManager.replaceImage();
			}
			if (typeof UIManager.refreshImageReplacePreview === 'function') {
				UIManager.refreshImageReplacePreview();
			}
			if (typeof RenderManager !== "undefined" && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	},
	
	/**
	 * Decrement data row selector
	 */
	decrementSelector: function() {
		const csInterface = createCSInterface();
		csInterface.evalScript('decrementSelector()', (result) => {
			const dataRowElement = document.getElementById(Config.ui.dataRowValue);
			if (dataRowElement) {
				dataRowElement.value = String(result);
				UIManager._lastAppliedRowValue = Math.max(0, Math.floor(Number(result)));
			}
			if (typeof ImageManager !== 'undefined') {
				ImageManager.replaceImage();
			}
			if (typeof UIManager.refreshImageReplacePreview === 'function') {
				UIManager.refreshImageReplacePreview();
			}
			if (typeof RenderManager !== "undefined" && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	},

	/**
	 * Sync data row input from AE (getSelectorRow). Call on panel load.
	 */
	syncDataRowFromAE: function() {
		const dataRowElement = document.getElementById(Config.ui.dataRowValue);
		if (!dataRowElement) return;
		const csInterface = createCSInterface();
		csInterface.evalScript('getSelectorRow()', (result) => {
			const val = result != null ? Math.max(0, Math.floor(Number(result))) : 0;
			if (dataRowElement) dataRowElement.value = String(val);
			UIManager._lastAppliedRowValue = val;
			if (typeof RenderManager !== "undefined" && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	},

	/**
	 * Read data row from input, send to AE, and update input with result
	 */
	_lastAppliedRowValue: null,

	setDataRowFromInput: function() {
		const dataRowElement = document.getElementById(Config.ui.dataRowValue);
		if (!dataRowElement) return;
		const raw = dataRowElement.value.trim();
		const num = raw === "" ? 0 : parseInt(raw, 10);
		if (isNaN(num) || num < 0) {
			dataRowElement.value = "0";
			return;
		}
		if (this._lastAppliedRowValue === num) return;
		this._lastAppliedRowValue = num;
		const csInterface = createCSInterface();
		csInterface.evalScript('setSelectorRow(' + num + ')', (result) => {
			// Only update input if we got a value back from AE (avoid overwriting typed number with 0 when result is missing)
			if (result != null && result !== "") {
				const val = Math.max(0, Math.floor(Number(result)));
				if (dataRowElement) dataRowElement.value = String(val);
				UIManager._lastAppliedRowValue = val;
			}
			// If no result, sync from AE so we show actual slider value
			if ((result == null || result === "") && dataRowElement) {
				csInterface.evalScript('getSelectorRow()', function (current) {
					const val = (current != null && current !== "") ? Math.max(0, Math.floor(Number(current))) : num;
					if (dataRowElement) dataRowElement.value = String(val);
					UIManager._lastAppliedRowValue = val;
				});
			}
			if (typeof ImageManager !== 'undefined') ImageManager.replaceImage();
			if (typeof UIManager.refreshImageReplacePreview === 'function') {
				UIManager.refreshImageReplacePreview();
			}
			if (typeof RenderManager !== "undefined" && RenderManager.refreshExportFilenamePreview) RenderManager.refreshExportFilenamePreview();
		});
	},
	
	/**
	 * Populate data field quick-add buttons (and table header) from 02_Data comp.
	 * Call after CSV/JSON import or when Data Setup opens; also on panel load for auto-update.
	 * @param {boolean} [silent] - If true, do not show loading indicator
	 */
	populateDataFieldDropdown: function(silent) {
		if (!silent) {
			showLoading(true, "Loading data fields...");
		}
		var loadingTimeout = silent ? null : setTimeout(function() {
			showLoading(false);
		}, 8000);

		const csInterface = createCSInterface();
		csInterface.evalScript('dataFieldDropdown()', (results) => {
			if (loadingTimeout) clearTimeout(loadingTimeout);
			if (!silent) showLoading(false);
			if (!results || typeof results !== 'string') return;
			
			var options = results.split(',').filter(function(o) { return o && o.trim(); });

			// Update table header (field names row)
			const head = document.querySelector('thead');
			if (head) {
				var tags = "<tr>";
				for (var i = 0; i < options.length; i++) {
					tags += "<th>" + options[i] + "</th>";
				}
				tags += "</tr>";
				head.innerHTML = tags;
			}

			// Quick-add buttons: one per field (add to active comp)
			const quickAddEl = document.getElementById(Config.ui.dataFieldQuickAdd);
			if (quickAddEl) {
				quickAddEl.innerHTML = "";
				options.forEach(function (name, i) {
					const btn = document.createElement("button");
					btn.type = "button";
					btn.className = "buttonblue button-adj button-quick-add";
					btn.textContent = name;
					btn.title = "Add \"" + name + "\" as text layer to the active comp";
					btn.onclick = (function (fieldName, oneBasedIndex) {
						return function () {
							UIManager.addSingleHeaderText(fieldName, oneBasedIndex);
						};
					})(name, i + 1);
					quickAddEl.appendChild(btn);
				});
			}
			// Refresh export filename label dropdown from 00_Template text layers
			if (typeof RenderManager !== "undefined" && RenderManager.populateExportLabelColumnDropdown) {
				RenderManager.populateExportLabelColumnDropdown();
			}
		});
	},

	/**
	 * Add a single data field as text layer to the active comp (quick-add)
	 */
	addSingleHeaderText: function (fieldName, headerIndex) {
		if (!fieldName || headerIndex == null) return;
		// Escape for JSX double-quoted string: backslash and double-quote
		var esc = function (s) {
			s = String(s);
			return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
		};
		var idx = Math.max(1, Math.floor(Number(headerIndex)));
		var script = 'addSingleHeaderTextJSX("' + esc(fieldName) + '", ' + idx + ')';
		var csInterface = createCSInterface();
		csInterface.evalScript(script, function (result) {
			result = (result != null) ? String(result).trim() : "";
			if (result.indexOf("ERROR:") === 0) {
				if (typeof showMessage === "function") showMessage(result, true);
				else alert(result);
				return;
			}
			if (result && (result.indexOf("EvalScript") >= 0 || result.toLowerCase().indexOf("error") >= 0)) {
				if (typeof showMessage === "function") showMessage("Quick-add failed: " + result, true);
				else alert("Quick-add failed: " + result);
				return;
			}
			if (result === "OK" && typeof showMessage === "function") {
				showMessage('Added "' + fieldName + '" to comp', false);
			}
		});
	},
	
	
	/**
	 * Populate image replace mapping: one row per image in 01_Images folder, each with a dropdown of 00_Template layer names (Source Text = path/URL).
	 * Call on load and after ADD GFX.
	 */
	populateImageReplaceMapping: function() {
		var listEl = document.getElementById(Config.ui.imageReplaceMappingList);
		if (!listEl) return;
		var saved = [];
		var selects = listEl.querySelectorAll("select.image-replace-field-select");
		for (var s = 0; s < selects.length; s++) {
			saved.push(selects[s].value || "");
		}
		var self = this;
		var csInterface = createCSInterface();
		csInterface.evalScript('getImageReplaceOptions()', function(imageNamesStr) {
			csInterface.evalScript('getTemplateLayerNamesJSX()', function(layersStr) {
				var imageNames = (imageNamesStr && imageNamesStr !== "undefined") ? imageNamesStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [];
				var fields = (layersStr && typeof layersStr === "string") ? layersStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [];
				listEl.innerHTML = "";
				imageNames.forEach(function(name, idx) {
					var row = document.createElement("div");
					row.className = "image-replace-mapping-row";
					var label = document.createElement("label");
					label.className = "panel-row-element image-replace-slot-label";
					label.textContent = (idx + 1) + ". " + name;
					var sel = document.createElement("select");
					sel.className = "export-select image-replace-field-select";
					sel.dataset.slotIndex = idx;
					sel.addEventListener("change", function() { self.refreshImageReplacePreview(); });
					var none = document.createElement("option");
					none.value = "";
					none.textContent = "— None —";
					sel.appendChild(none);
					fields.forEach(function(f) {
						var opt = document.createElement("option");
						opt.value = f;
						opt.textContent = f;
						sel.appendChild(opt);
					});
					if (saved[idx]) sel.value = saved[idx];
					var preview = document.createElement("div");
					preview.className = "image-replace-preview";
					preview.title = "Source Text from this 00_Template layer (path or URL)";
					preview.textContent = "—";
					row.appendChild(label);
					row.appendChild(sel);
					row.appendChild(preview);
					listEl.appendChild(row);
				});
				self.refreshImageReplacePreview();
			});
			// Display fallback image path (img/notFound.jpg) from panel extension path
			var el = document.getElementById('notFoundImagePath');
			if (el) {
				var fallbackPath = "";
				try {
					var cs = createCSInterface();
					if (typeof SystemPath !== "undefined" && SystemPath.EXTENSION && typeof cs.getSystemPath === "function") {
						var extRoot = cs.getSystemPath(SystemPath.EXTENSION);
						if (extRoot) {
							fallbackPath = (extRoot.replace(/\\/g, "/").replace(/\/+$/, "") + "/img/notFound.jpg").replace(/\//g, (navigator.platform && navigator.platform.indexOf("Win") !== -1) ? "\\" : "/");
						}
					}
				} catch (e) {}
				if (fallbackPath) {
					el.textContent = fallbackPath.length > 52 ? "Fallback: …" + fallbackPath.slice(-44) : "Fallback: " + fallbackPath;
					el.title = fallbackPath;
				} else {
					el.textContent = "Fallback: img/notFound.jpg";
					el.title = "img/notFound.jpg (relative to extension folder)";
				}
			}
		});
	},

	/**
	 * Refresh the "current value" preview under each Image Replace dropdown (for current data row).
	 */
	refreshImageReplacePreview: function() {
		var listEl = document.getElementById(Config.ui.imageReplaceMappingList);
		if (!listEl) return;
		var mappingStr = this.getImageReplaceMappingString();
		var esc = function(s) {
			s = String(s);
			return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
		};
		var script = 'getImageReplacePreviewJSX("' + esc(mappingStr) + '")';
		var csInterface = createCSInterface();
		csInterface.evalScript(script, function(result) {
			result = (result != null) ? String(result) : "";
			var previews = listEl.querySelectorAll(".image-replace-preview");
			if (result.indexOf("OK:") === 0) {
				var payload = result.substring(3);
				var delim = "||SLOT||";
				var parts = payload.split(delim);
				for (var i = 0; i < previews.length; i++) {
					var text = (parts[i] != null && parts[i] !== undefined) ? String(parts[i]).trim() : "";
					if (previews[i]) {
						previews[i].textContent = text || "—";
						previews[i].title = text ? ("Source Text: " + text) : "No path for this slot";
					}
				}
			} else {
				for (var j = 0; j < previews.length; j++) {
					if (previews[j]) {
						previews[j].textContent = "—";
						previews[j].title = result.indexOf("ERROR:") === 0 ? result : "Could not load preview";
					}
				}
			}
		});
	},

	/**
	 * Get current image replace mapping from UI (pipe-separated 00_Template layer names, one per slot).
	 */
	getImageReplaceMappingString: function() {
		var listEl = document.getElementById(Config.ui.imageReplaceMappingList);
		if (!listEl) return "";
		var selects = listEl.querySelectorAll("select.image-replace-field-select");
		var parts = [];
		for (var i = 0; i < selects.length; i++) {
			parts.push((selects[i].value || "").trim());
		}
		return parts.join("|");
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = UIManager;
}
