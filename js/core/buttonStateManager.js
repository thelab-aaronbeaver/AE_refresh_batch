/**
 * Button State Manager Module
 * Manages button states (enabled/disabled) during operations
 */

const ButtonStateManager = {
    disabledButtons: new Set(),

    /**
     * Disable buttons during operation
     * @param {Array<string>} buttonSelectors - Array of button selectors or onclick function names
     */
    disableButtons: function (buttonSelectors) {
        buttonSelectors.forEach(selector => {
            if (typeof selector === 'string') {
                // Try to find by onclick attribute
                const buttons = document.querySelectorAll(`[onclick*="${selector}"]`);
                buttons.forEach(btn => {
                    btn.disabled = true;
                    btn.classList.add('processing');
                    this.disabledButtons.add(btn);
                });
            }
        });
    },

    /**
     * Enable all disabled buttons
     */
    enableButtons: function () {
        this.disabledButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('processing');
        });
        this.disabledButtons.clear();
    },

    /**
     * Disable all action buttons
     */
    disableAllActions: function () {
        const actionButtons = [
            'createFolder',
            'importDataFileJS',
            'importsheetdata',
            'incrementSelectorJS',
            'decrementSelectorJS',
            'addTextJS',
            'addExpression',
            'replaceimageJS',
            'addtoRenderQueueJS',
            'batchRenderQueueJS'
        ];

        this.disableButtons(actionButtons);
    },

    /**
     * Enable all action buttons
     */
    enableAllActions: function () {
        this.enableButtons();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonStateManager;
}
