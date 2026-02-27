/**
 * Tooltip Manager Module
 * Handles tooltips for UI elements
 */

const TooltipManager = {
    tooltipElement: null,

    /**
     * Initialize tooltip system
     */
    init: function () {
        this.tooltipElement = document.getElementById('tooltip');
        if (!this.tooltipElement) {
            // Create tooltip element if it doesn't exist
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.id = 'tooltip';
            this.tooltipElement.className = 'tooltip';
            this.tooltipElement.hidden = true;
            document.body.appendChild(this.tooltipElement);
        }

        this.attachTooltips();
    },

    /**
     * Attach tooltips to elements with data-tooltip attribute
     */
    attachTooltips: function () {
        // Add tooltips to buttons
        const buttons = document.querySelectorAll('button, .buttonblue, .buttonyellow, .icon');
        buttons.forEach(button => {
            const tooltipText = button.getAttribute('data-tooltip') || this.getDefaultTooltip(button);
            if (tooltipText) {
                button.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, tooltipText);
                });
                button.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            }
        });
    },

    /**
     * Get default tooltip text for button
     * @param {HTMLElement} element - Button element
     * @returns {string} Tooltip text
     */
    getDefaultTooltip: function (element) {
        const onclick = element.getAttribute('onclick');
        if (!onclick) return null;

        const tooltips = {
            'createFolder()': 'Create the folder structure and compositions for batch processing',
            'dataSetupShowHide()': 'Show/hide data import options',
            'importDataFileJS()': 'Import data from a CSV file',
            'importsheetdata()': 'Import data from Google Sheets',
            'incrementSelectorJS()': 'Go to next data row (Arrow Down)',
            'decrementSelectorJS()': 'Go to previous data row (Arrow Up)',
            'populateDataFieldDropdown()': 'Refresh data field list',
            'addTextJS()': 'Add text layers linked to data fields',
            'addExpression()': 'Add expression to selected layer',
            'replaceimageJS()': 'Replace images based on current data row',
            'addReplaceImageOption()': 'Add new image replace option',
            'addtoRenderQueueJS()': 'Add current composition to render queue',
            'batchRenderQueueJS()': 'Render all data rows automatically',
            'dataArrayCSVJS()': 'Import CSV data array',
            'closepanel()': 'Close extension (Escape)'
        };

        return tooltips[onclick] || null;
    },

    /**
     * Show tooltip
     * @param {HTMLElement} target - Target element
     * @param {string} text - Tooltip text
     */
    showTooltip: function (target, text) {
        if (!this.tooltipElement || !text) return;

        this.tooltipElement.textContent = text;
        this.tooltipElement.hidden = false;
        this.tooltipElement.classList.add('show');

        // Position tooltip
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 8;
        }

        this.tooltipElement.style.left = left + 'px';
        this.tooltipElement.style.top = top + 'px';
    },

    /**
     * Hide tooltip
     */
    hideTooltip: function () {
        if (!this.tooltipElement) return;

        this.tooltipElement.classList.remove('show');
        setTimeout(() => {
            if (this.tooltipElement) {
                this.tooltipElement.hidden = true;
            }
        }, 200);
    },

    /**
     * Add tooltip to element programmatically
     * @param {HTMLElement} element - Element to add tooltip to
     * @param {string} text - Tooltip text
     */
    addTooltip: function (element, text) {
        if (!element) return;

        element.setAttribute('data-tooltip', text);
        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, text);
        });
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TooltipManager.init();
    });
} else {
    TooltipManager.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}
