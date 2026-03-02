/**
 * Folder Manager Module
 * Handles folder creation and project setup operations
 */

const FolderManager = {
    /**
     * Create the initial folder structure
     */
    createFolderStructure: function () {
        showLoading(true, "Creating folder structure...");
        const csInterface = createCSInterface();
        var extensionPath = "";
        try {
            if (typeof SystemPath !== "undefined" && SystemPath.EXTENSION && typeof csInterface.getSystemPath === "function") {
                extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION) || "";
            }
        } catch (e) {}
        var esc = function (s) {
            return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "");
        };
        var script = extensionPath.length > 0 ? ('createFolder("' + esc(extensionPath) + '")') : "createFolder()";
        csInterface.evalScript(script, function(result) {
            showLoading(false);
            var scriptTip = " If setup failed: Edit > Preferences > General — enable \"Allow Scripts to Write Files and Access Network\"; then Preferences > Scripting & Expressions — enable the same. Restart AE.";
            if (result && String(result).indexOf("ERROR:") === 0) {
                showMessage(String(result) + scriptTip, true);
            } else if (result === "OK" || result === true) {
                showMessage("Folder structure and compositions created successfully.", false);
            } else {
                showMessage("Setup finished. Check the project and AE Info panel for details." + scriptTip, false);
            }
        });
    },

    /**
     * Save the current project
     * @param {Function} callback - Optional callback function
     */
    saveProject: function (callback) {
        const csInterface = createCSInterface();
        csInterface.evalScript('saveProject()', (projectFilePathResult) => {
            if (callback && typeof callback === 'function') {
                callback(projectFilePathResult);
            }
            // Also get project path
            this.getProjectPath();
        });
    },

    /**
     * Get the current project file path
     * @param {Function} callback - Optional callback function
     */
    getProjectPath: function (callback) {
        const csInterface = createCSInterface();
        csInterface.evalScript('getfilepath()', (result) => {
            if (result) {
                const globalfilepath = result.replace(/\//g, "\\");
                if (callback && typeof callback === 'function') {
                    callback(globalfilepath);
                }
                return globalfilepath;
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FolderManager;
}
