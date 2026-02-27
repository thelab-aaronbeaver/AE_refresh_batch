/**
 * Keyboard Manager Module
 * Handles keyboard shortcuts and navigation
 */

const KeyboardManager = {
    /**
     * Initialize keyboard event listeners
     */
    init: function () {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    },

    /**
     * Handle key press events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyPress: function (e) {
        // Don't handle shortcuts if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Escape key - close modals
        if (e.key === 'Escape') {
            const modal = document.getElementById('dataPreviewModal');
            if (modal && !modal.hidden) {
                PreviewManager.closePreview();
            }
        }

        // Arrow keys - navigate data rows
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (e.key === 'ArrowUp') {
                UIManager.decrementSelector();
            } else {
                UIManager.incrementSelector();
            }
        }

        // Enter key - confirm operations (when in modal)
        if (e.key === 'Enter' && e.ctrlKey) {
            const modal = document.getElementById('dataPreviewModal');
            if (modal && !modal.hidden) {
                PreviewManager.confirmImport();
            }
        }

        // Ctrl+S - Save project
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            FolderManager.saveProject();
        }

        // Ctrl+R - Refresh data fields
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            UIManager.populateDataFieldDropdown();
        }
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        KeyboardManager.init();
    });
} else {
    KeyboardManager.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardManager;
}
