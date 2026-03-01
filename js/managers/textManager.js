/**
 * Text Manager Module
 * Handles text layer operations and expressions
 */

const TextManager = {
    /**
     * Add text layers with expressions
     */
    addTextLayers: function () {
        const csInterface = createCSInterface();
        csInterface.evalScript('addHeaderTextJSX()');
    },

    /**
     * Add expression to selected layer (data-link expression, column 1). Shows OK or error in status.
     */
    addExpression: function () {
        const csInterface = createCSInterface();
        csInterface.evalScript('addExpression()', function (result) {
            result = (result != null) ? String(result).trim() : "";
            if (typeof showMessage === "function") {
                if (result === "OK") showMessage("Expression added to selected layer.", false);
                else if (result.indexOf("ERROR:") === 0) showMessage(result, true);
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextManager;
}
