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
        csInterface.evalScript('createFolder()', function(result) {
            showLoading(false);
            if (result) {
                showMessage("Folder structure created successfully", false);
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
