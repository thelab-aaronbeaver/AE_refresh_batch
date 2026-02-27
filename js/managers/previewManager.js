/**
 * Preview Manager Module
 * Handles data preview, validation, and statistics
 */

const PreviewManager = {
    previewData: null,
    previewCallback: null,

    /**
     * Show data preview modal
     * @param {Array<Array<string>>} data - Data array to preview
     * @param {Object} stats - Statistics object
     * @param {Function} confirmCallback - Callback when user confirms import
     */
    showPreview: function (data, stats, confirmCallback) {
        this.previewData = data;
        this.previewCallback = confirmCallback;

        // Show statistics
        this.displayStats(stats);

        // Populate preview table
        this.populatePreviewTable(data);

        // Show modal (use display so it isn't overridden by .modal { display: flex })
        const modal = document.getElementById('dataPreviewModal');
        if (modal) {
            modal.removeAttribute('hidden');
            modal.style.display = 'flex';
            this._boundEscapeHandler = this._boundEscapeHandler || this._handleEscape.bind(this);
            document.addEventListener('keydown', this._boundEscapeHandler);
        }
    },

    /**
     * Handle Escape key to close modal
     * @private
     */
    _handleEscape: function (e) {
        if (e.key === 'Escape') {
            this.closePreview();
            document.removeEventListener('keydown', this._boundEscapeHandler);
        }
    },

    /**
     * Close data preview modal
     */
    closePreview: function () {
        document.removeEventListener('keydown', this._boundEscapeHandler);
        const modal = document.getElementById('dataPreviewModal');
        if (modal) {
            modal.setAttribute('hidden', '');
            modal.style.display = 'none';
        }
        this.previewData = null;
        this.previewCallback = null;
    },

    /**
     * Confirm and import data
     */
    confirmImport: function () {
        if (this.previewCallback && typeof this.previewCallback === 'function') {
            this.previewCallback(this.previewData);
        }
        this.closePreview();
    },

    /**
     * Display data statistics
     * @param {Object} stats - Statistics object
     */
    displayStats: function (stats) {
        const statsElement = document.getElementById('dataPreviewStats');
        if (!statsElement) return;

        const html = `
            <div class="data-stats-content">
                <div class="stat-item">
                    <div class="stat-label">Total Rows</div>
                    <div class="stat-value">${stats.rowCount || 0}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Columns</div>
                    <div class="stat-value">${stats.columnCount || 0}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">File Size</div>
                    <div class="stat-value">${stats.sizeKB || 0} KB</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Status</div>
                    <div class="stat-value" style="color: ${stats.isValid ? '#28a745' : '#dc3545'}">
                        ${stats.isValid ? 'Valid' : 'Invalid'}
                    </div>
                </div>
            </div>
        `;

        statsElement.innerHTML = html;
    },

    /**
     * Populate preview table
     * @param {Array<Array<string>>} data - Data array
     */
    populatePreviewTable: function (data) {
        if (!data || data.length === 0) return;

        const headerElement = document.getElementById('dataPreviewHeader');
        const bodyElement = document.getElementById('dataPreviewBody');

        if (!headerElement || !bodyElement) return;

        // Clear existing content
        headerElement.innerHTML = '';
        bodyElement.innerHTML = '';

        // Get header (first row)
        const header = data[0];
        const headerRow = document.createElement('tr');

        header.forEach((cell, index) => {
            const th = document.createElement('th');
            th.textContent = cell || `Column ${index + 1}`;
            headerRow.appendChild(th);
        });

        headerElement.appendChild(headerRow);

        // Show first 50 rows for preview
        const previewRows = Math.min(50, data.length - 1);

        for (let i = 1; i <= previewRows; i++) {
            const row = data[i];
            const tr = document.createElement('tr');

            header.forEach((_, index) => {
                const td = document.createElement('td');
                const cellValue = row && row[index] ? row[index] : '';
                td.textContent = cellValue;
                td.title = cellValue; // Tooltip for long values
                tr.appendChild(td);
            });

            bodyElement.appendChild(tr);
        }

        // Show message if more rows exist
        if (data.length > 51) {
            const messageRow = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = header.length;
            messageCell.textContent = `... and ${data.length - 51} more rows (showing first 50)`;
            messageCell.style.textAlign = 'center';
            messageCell.style.fontStyle = 'italic';
            messageCell.style.color = '#666';
            messageRow.appendChild(messageCell);
            bodyElement.appendChild(messageRow);
        }
    },

    /**
     * Show data statistics panel
     * @param {Object} stats - Statistics object
     */
    showStatsPanel: function (stats) {
        const panel = document.getElementById('dataStatsPanel');
        const content = document.getElementById('dataStatsContent');

        if (!panel || !content) return;

        const html = `
            <div class="data-stats-content">
                <div class="stat-item">
                    <div class="stat-label">Total Rows</div>
                    <div class="stat-value">${stats.rowCount || 0}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Columns</div>
                    <div class="stat-value">${stats.columnCount || 0}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">File Size</div>
                    <div class="stat-value">${stats.sizeKB || 0} KB</div>
                </div>
                ${stats.processingTime ? `
                <div class="stat-item">
                    <div class="stat-label">Processed In</div>
                    <div class="stat-value">${stats.processingTime}</div>
                </div>
                ` : ''}
            </div>
        `;

        content.innerHTML = html;
        panel.hidden = false;
    },

    /**
     * Validate data structure
     * @param {Array<Array<string>>} data - Data array
     * @returns {Object} Validation result
     */
    validateData: function (data) {
        if (!data || data.length === 0) {
            return {
                isValid: false,
                errors: ['Data is empty'],
                warnings: []
            };
        }

        const errors = [];
        const warnings = [];

        // Check if header exists
        if (data.length < 2) {
            warnings.push('Data contains only header row, no data rows');
        }

        // Check column consistency
        const headerLength = data[0] ? data[0].length : 0;
        let inconsistentRows = 0;

        for (let i = 1; i < data.length; i++) {
            if (data[i] && data[i].length !== headerLength) {
                inconsistentRows++;
            }
        }

        if (inconsistentRows > 0) {
            warnings.push(`${inconsistentRows} row(s) have inconsistent column counts`);
        }

        // Check for empty cells
        let emptyCells = 0;
        for (let i = 1; i < Math.min(100, data.length); i++) {
            if (data[i]) {
                data[i].forEach(cell => {
                    if (!cell || cell.trim() === '') {
                        emptyCells++;
                    }
                });
            }
        }

        if (emptyCells > 0) {
            warnings.push(`Found ${emptyCells} empty cells in first 100 rows`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            rowCount: data.length - 1, // Exclude header
            columnCount: headerLength
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewManager;
}
