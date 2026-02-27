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
     * Add expression to selected layer
     */
    addExpression: function () {
        const csInterface = createCSInterface();
        csInterface.evalScript('addExpression()');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextManager;
}
