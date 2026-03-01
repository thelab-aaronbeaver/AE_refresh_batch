/**
 * Render Manager Module
 * Handles render queue operations and selectable export presets
 */

const RENDER_PRESETS_KEY = "refresh_export_presets";

const RenderManager = {
    /**
     * Get selected output template and export folder from UI (or from selected preset)
     * @returns {{ template: string, folder: string }}
     */
    getExportSettings: function () {
        const preset = this.getSelectedPreset();
        if (preset) {
            return { template: preset.template || "QT +", folder: preset.folder || "" };
        }
        const templateEl = document.getElementById(Config.ui.outputModuleSelect);
        const folderEl = document.getElementById(Config.ui.exportFolderPath);
        return {
            template: templateEl ? (templateEl.value || "QT +") : "QT +",
            folder: folderEl ? (folderEl.value || "").trim() : ""
        };
    },

    /**
     * Get preset list from storage
     * @returns {Array<{ id: string, name: string, template: string, folder: string }>}
     */
    getPresets: function () {
        try {
            const raw = window.__adobe_cep__ ? (localStorage.getItem(RENDER_PRESETS_KEY) || "[]") : "[]";
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save presets to storage
     */
    setPresets: function (list) {
        try {
            if (window.__adobe_cep__) localStorage.setItem(RENDER_PRESETS_KEY, JSON.stringify(list));
        } catch (e) {}
    },

    /**
     * Get the currently selected preset from dropdown (or null if "None")
     */
    getSelectedPreset: function () {
        const sel = document.getElementById(Config.ui.exportPresetSelect);
        if (!sel || !sel.value) return null;
        const presets = this.getPresets();
        return presets.find(function (p) { return p.id === sel.value; }) || null;
    },

    /**
     * Apply a preset to the UI (output + folder)
     * @param {string} presetId - Preset id or empty for "None"
     */
    applyPreset: function (presetId) {
        const templateEl = document.getElementById(Config.ui.outputModuleSelect);
        const folderEl = document.getElementById(Config.ui.exportFolderPath);
        if (!presetId) {
            return;
        }
        const presets = this.getPresets();
        const preset = presets.find(function (p) { return p.id === presetId; });
        if (!preset) return;
        if (templateEl) {
            var t = preset.template || "QT +";
            for (var i = 0; i < templateEl.options.length; i++) {
                if (templateEl.options[i].value === t) {
                    templateEl.selectedIndex = i;
                    break;
                }
            }
        }
        if (folderEl) {
            folderEl.value = preset.folder || "";
            folderEl.title = preset.folder ? preset.folder : "Click Choose to set";
        }
    },

    /**
     * Populate preset dropdown and set change handler
     */
    populatePresetDropdown: function () {
        const selectEl = document.getElementById(Config.ui.exportPresetSelect);
        if (!selectEl) return;
        const currentId = selectEl.value || "";
        const presets = this.getPresets();
        selectEl.innerHTML = "";
        const none = document.createElement("option");
        none.value = "";
        none.textContent = "None (use below)";
        selectEl.appendChild(none);
        presets.forEach(function (p) {
            const o = document.createElement("option");
            o.value = p.id;
            o.textContent = p.name;
            if (p.id === currentId) o.selected = true;
            selectEl.appendChild(o);
        });
        const self = this;
        selectEl.onchange = function () {
            self.applyPreset(this.value);
        };
    },

    /**
     * Save current export settings as a named preset
     * @param {string} name - Display name for the preset
     */
    saveCurrentAsPreset: function (name) {
        if (!name || !name.trim()) return;
        const settings = this.getExportSettings();
        const presets = this.getPresets();
        const id = "p_" + Date.now();
        presets.push({
            id: id,
            name: name.trim(),
            template: settings.template || "QT +",
            folder: settings.folder || ""
        });
        this.setPresets(presets);
        this.populatePresetDropdown();
        const sel = document.getElementById(Config.ui.exportPresetSelect);
        if (sel) sel.value = id;
    },

    /**
     * Escape string for use inside single-quoted JSX string (for CEP evalScript)
     */
    escSingle: function (s) {
        return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    },

    /**
     * Run render: set export options then addtoRenderQueue (uses selected preset or current UI).
     * @param {boolean} batchRender - If true, batch is driven from JS (one row per evalScript callback).
     * @param {function} [callback] - Called when this render completes (used for JS-driven batch loop).
     */
    runRender: function (batchRender, callback) {
        const settings = this.getExportSettings();
        const template = settings.template || "QT +";
        const folder = settings.folder || "";
        const labelSourceEl = document.getElementById(Config.ui.exportLabelSource);
        const columnEl = document.getElementById(Config.ui.exportLabelColumn);
        const labelSource = (labelSourceEl && labelSourceEl.value === "column") ? "column" : "template";
        const columnName = (columnEl && columnEl.value) ? columnEl.value : "";
        const csInterface = createCSInterface();
        const setScript = "setExportOptions('" + this.escSingle(template) + "','" + this.escSingle(folder) + "','" + this.escSingle(labelSource) + "','" + this.escSingle(columnName) + "')";
        csInterface.evalScript(setScript, function () {
            csInterface.evalScript("addtoRenderQueue(" + (batchRender ? "true" : "false") + ")", function (result) {
                if (typeof callback === "function") callback(result);
            });
        });
    },

    /**
     * Set the "Filename label" column dropdown options from an array (e.g. from dataFieldDropdown callback).
     */
    setExportLabelColumnOptions: function (options) {
        const columnEl = document.getElementById(Config.ui.exportLabelColumn);
        if (!columnEl) return;
        const currentValue = columnEl.value || "";
        const list = Array.isArray(options) ? options : [];
        columnEl.innerHTML = "";
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "—";
        columnEl.appendChild(empty);
        list.forEach(function (name) {
            const o = document.createElement("option");
            o.value = name;
            o.textContent = name;
            if (name === currentValue) o.selected = true;
            columnEl.appendChild(o);
        });
        if (typeof this.refreshExportFilenamePreview === "function") this.refreshExportFilenamePreview();
    },

    /**
     * Populate the "Filename label" column dropdown from 02_Data headers (same as data fields).
     */
    populateExportLabelColumnDropdown: function () {
        const self = this;
        const csInterface = createCSInterface();
        csInterface.evalScript("dataFieldDropdown()", function (results) {
            if (!results || typeof results !== "string") return;
            const options = results.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
            self.setExportLabelColumnOptions(options);
        });
    },

    /**
     * Refresh the export filename preview (e.g. "1_Acme.mov") from AE using current row and label settings.
     */
    refreshExportFilenamePreview: function () {
        const previewEl = document.getElementById(Config.ui.exportFilenamePreview);
        const rowEl = document.getElementById(Config.ui.dataRowValue);
        const labelSourceEl = document.getElementById(Config.ui.exportLabelSource);
        const columnEl = document.getElementById(Config.ui.exportLabelColumn);
        if (!previewEl) return;
        const rowStr = (rowEl && rowEl.value != null) ? String(rowEl.value).trim() : "0";
        const row = Math.max(0, Math.floor(parseInt(rowStr, 10) || 0));
        const labelSource = (labelSourceEl && labelSourceEl.value === "column") ? "column" : "template";
        const columnName = (columnEl && columnEl.value) ? columnEl.value : "";
        const csInterface = createCSInterface();
        const script = "getExportFilenamePreview(" + row + ",'" + this.escSingle(labelSource) + "','" + this.escSingle(columnName) + "')";
        csInterface.evalScript(script, function (result) {
            if (previewEl) previewEl.value = (result != null && result !== "") ? String(result) : "—";
        });
    },

    /**
     * Populate output module dropdown from AE (keeps current selection if still in list)
     */
    populateOutputModuleDropdown: function () {
        const selectEl = document.getElementById(Config.ui.outputModuleSelect);
        if (!selectEl) return;
            const hadOnlyDefault = selectEl.options.length <= 1 && (selectEl.value || "").trim() === "QT +";
            const currentValue = hadOnlyDefault ? "" : (selectEl.value || "").trim();
            const csInterface = createCSInterface();
            csInterface.evalScript('getOutputModuleTemplateNames()', (result) => {
                if (!result || typeof result !== "string") return;
                const options = result.split(",").map(s => s.trim()).filter(Boolean);
                if (options.length === 0) return;
                selectEl.innerHTML = "";
                let selectedIndex = 0;
                options.forEach((opt, i) => {
                    const o = document.createElement("option");
                    o.value = opt;
                    o.textContent = opt;
                    if (currentValue && opt === currentValue) selectedIndex = i;
                    selectEl.appendChild(o);
                });
                selectEl.selectedIndex = selectedIndex;
            });
    },

    /**
     * Open folder picker and set export folder path in UI
     */
    chooseExportFolder: function (callback) {
        const csInterface = createCSInterface();
        csInterface.evalScript('chooseExportFolder()', (path) => {
            const el = document.getElementById(Config.ui.exportFolderPath);
            if (el) {
                el.value = path || "";
                el.title = path ? path : "Click Choose to set";
            }
            if (typeof callback === "function") callback(path);
        });
    },

    /**
     * Render only the current row (single export with selected output and folder)
     */
    renderCurrentRow: function () {
        this.runRender(false);
    },

    /**
     * Add current composition to render queue (legacy; uses selected output and folder)
     */
    addToRenderQueue: function () {
        this.runRender(false);
    },

    /**
     * Start batch rendering process (JS-driven loop: one row per evalScript, reliable across AE versions).
     */
    batchRender: function () {
        const csInterface = createCSInterface();
        const self = this;
        csInterface.evalScript("getDataRowCount()", function (totalRowsResult) {
            const totalRows = Math.max(0, Math.floor(Number(totalRowsResult)));
            if (totalRows === 0) {
                if (typeof showMessage === "function") showMessage("No data rows to render.", true);
                return;
            }
            let currentRow = 0;
            function doOneRow() {
                if (currentRow >= totalRows) {
                    if (typeof showMessage === "function") showMessage("Batch render complete. Rendered " + totalRows + " row(s).", false);
                    return;
                }
                csInterface.evalScript("setSelectorRow(" + currentRow + ")", function () {
                    self.runRender(false, function () {
                        currentRow++;
                        doOneRow();
                    });
                });
            }
            doOneRow();
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RenderManager;
}
