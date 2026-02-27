/**
 * Error Handler Module
 * Provides comprehensive error handling with specific error codes and user-friendly messages
 */

const ErrorHandler = {
    // Error codes
    ERROR_CODES: {
        // Setup errors
        SETUP_NOT_RUN: 'SETUP_001',
        FOLDER_NOT_FOUND: 'SETUP_002',
        COMP_NOT_FOUND: 'SETUP_003',
        
        // File errors
        FILE_NOT_FOUND: 'FILE_001',
        FILE_EMPTY: 'FILE_002',
        FILE_INVALID_FORMAT: 'FILE_003',
        FILE_TOO_LARGE: 'FILE_004',
        FILE_READ_ERROR: 'FILE_005',
        FILE_CANCELLED: 'FILE_006',
        
        // Data errors
        DATA_IMPORT_FAILED: 'DATA_001',
        DATA_EMPTY: 'DATA_002',
        DATA_INVALID_FORMAT: 'DATA_003',
        DATA_TOO_LARGE: 'DATA_004',
        CSV_PARSE_ERROR: 'DATA_005',
        
        // Google Sheets errors
        SHEETS_AUTH_FAILED: 'SHEETS_001',
        SHEETS_INVALID_ID: 'SHEETS_002',
        SHEETS_INVALID_NAME: 'SHEETS_003',
        SHEETS_API_ERROR: 'SHEETS_004',
        SHEETS_NOT_IMPLEMENTED: 'SHEETS_005',
        
        // Image errors
        IMAGE_NOT_FOUND: 'IMAGE_001',
        IMAGE_FOLDER_EMPTY: 'IMAGE_002',
        IMAGE_COMP_EMPTY: 'IMAGE_003',
        IMAGE_REPLACE_FAILED: 'IMAGE_004',
        
        // Render errors
        RENDER_NO_COMP: 'RENDER_001',
        RENDER_QUEUE_FULL: 'RENDER_002',
        RENDER_FAILED: 'RENDER_003',
        RENDER_PATH_INVALID: 'RENDER_004',
        
        // General errors
        UNKNOWN_ERROR: 'GEN_001',
        OPERATION_CANCELLED: 'GEN_002',
        PERMISSION_DENIED: 'GEN_003'
    },
    
    // Error messages with actionable solutions
    ERROR_MESSAGES: {
        // Setup errors
        'SETUP_001': {
            title: 'Setup Required',
            message: 'Please run "Fresh Batch Setup" first to create the required folder structure.',
            solution: 'Click the "Fresh Batch Setup" button to initialize the extension.'
        },
        'SETUP_002': {
            title: 'Folder Not Found',
            message: 'Required folder not found in project.',
            solution: 'Run "Fresh Batch Setup" to create the folder structure.'
        },
        'SETUP_003': {
            title: 'Composition Not Found',
            message: 'Required composition not found in project.',
            solution: 'Run "Fresh Batch Setup" to create the required compositions.'
        },
        
        // File errors
        'FILE_001': {
            title: 'File Not Found',
            message: 'The specified file could not be found.',
            solution: 'Please check the file path and ensure the file exists.'
        },
        'FILE_002': {
            title: 'Empty File',
            message: 'The selected file is empty.',
            solution: 'Please select a file that contains data.'
        },
        'FILE_003': {
            title: 'Invalid File Format',
            message: 'The file format is not supported.',
            solution: 'Please use CSV (.csv) or text (.txt) files.'
        },
        'FILE_004': {
            title: 'File Too Large',
            message: 'The file is too large to process efficiently.',
            solution: 'Consider splitting the file into smaller parts or use Google Sheets import.'
        },
        'FILE_005': {
            title: 'File Read Error',
            message: 'An error occurred while reading the file.',
            solution: 'Ensure the file is not open in another program and try again.'
        },
        'FILE_006': {
            title: 'Operation Cancelled',
            message: 'File selection was cancelled.',
            solution: 'No action needed.'
        },
        
        // Data errors
        'DATA_001': {
            title: 'Data Import Failed',
            message: 'Failed to import data from the file.',
            solution: 'Check the file format and ensure it contains valid CSV data.'
        },
        'DATA_002': {
            title: 'No Data Found',
            message: 'No valid data was found in the file.',
            solution: 'Ensure the file contains data rows and is properly formatted.'
        },
        'DATA_003': {
            title: 'Invalid Data Format',
            message: 'The data format is invalid or corrupted.',
            solution: 'Check that the CSV file uses proper formatting with comma separators.'
        },
        'DATA_004': {
            title: 'Dataset Too Large',
            message: 'The dataset is too large to process in one operation.',
            solution: 'The data will be processed in batches. This may take some time.'
        },
        'DATA_005': {
            title: 'CSV Parse Error',
            message: 'An error occurred while parsing the CSV file.',
            solution: 'Check for special characters or formatting issues in the CSV file.'
        },
        
        // Google Sheets errors
        'SHEETS_001': {
            title: 'Authentication Failed',
            message: 'Failed to authenticate with Google Sheets.',
            solution: 'Check your Google API credentials in client_secret.json.'
        },
        'SHEETS_002': {
            title: 'Invalid Sheet ID',
            message: 'The provided Sheet ID is invalid.',
            solution: 'Ensure the Sheet ID is correct and the sheet is accessible.'
        },
        'SHEETS_003': {
            title: 'Invalid Sheet Name',
            message: 'The provided Sheet Name is invalid.',
            solution: 'Check the sheet tab name (case-sensitive) and try again.'
        },
        'SHEETS_004': {
            title: 'Google Sheets API Error',
            message: 'An error occurred while accessing Google Sheets.',
            solution: 'Check your internet connection and API credentials.'
        },
        'SHEETS_005': {
            title: 'Feature Not Available',
            message: 'Google Sheets import is not yet fully implemented.',
            solution: 'Please use CSV file import instead.'
        },
        
        // Image errors
        'IMAGE_001': {
            title: 'Image Not Found',
            message: 'The specified image file could not be found.',
            solution: 'Check the image path in the Images comp and ensure the file exists.'
        },
        'IMAGE_002': {
            title: 'Images Folder Empty',
            message: 'The Images folder is empty.',
            solution: 'Add images to the 01_Images folder.'
        },
        'IMAGE_003': {
            title: 'Images Comp Empty',
            message: 'The Images composition has no layers.',
            solution: 'Ensure the Images comp contains at least one layer with image paths.'
        },
        'IMAGE_004': {
            title: 'Image Replace Failed',
            message: 'Failed to replace the image.',
            solution: 'Check that the image file exists and the Images folder is set up correctly.'
        },
        
        // Render errors
        'RENDER_001': {
            title: 'No Composition Selected',
            message: 'No composition is selected for rendering.',
            solution: 'Select a composition in the project panel.'
        },
        'RENDER_002': {
            title: 'Render Queue Full',
            message: 'The render queue is full.',
            solution: 'Clear some items from the render queue and try again.'
        },
        'RENDER_003': {
            title: 'Render Failed',
            message: 'The render operation failed.',
            solution: 'Check render settings and ensure output path is valid.'
        },
        'RENDER_004': {
            title: 'Invalid Render Path',
            message: 'The render output path is invalid.',
            solution: 'Ensure the project is saved and the export folder path is valid.'
        },
        
        // General errors
        'GEN_001': {
            title: 'Unknown Error',
            message: 'An unexpected error occurred.',
            solution: 'Try the operation again. If the problem persists, check the After Effects info panel for details.'
        },
        'GEN_002': {
            title: 'Operation Cancelled',
            message: 'The operation was cancelled by the user.',
            solution: 'No action needed.'
        },
        'GEN_003': {
            title: 'Permission Denied',
            message: 'Permission was denied to perform this operation.',
            solution: 'Check file permissions and ensure you have write access to the project folder.'
        }
    },
    
    /**
     * Get error message by code
     * @param {string} errorCode - Error code
     * @param {string} customMessage - Optional custom message to append
     * @returns {Object} Error object with title, message, and solution
     */
    getError: function(errorCode, customMessage) {
        const error = this.ERROR_MESSAGES[errorCode] || this.ERROR_MESSAGES['GEN_001'];
        
        return {
            code: errorCode,
            title: error.title,
            message: customMessage ? error.message + ' ' + customMessage : error.message,
            solution: error.solution,
            fullMessage: error.title + ': ' + error.message + ' ' + error.solution
        };
    },
    
    /**
     * Display error to user
     * @param {string} errorCode - Error code
     * @param {string} customMessage - Optional custom message
     * @param {boolean} showInUI - Whether to show in UI (default: true)
     */
    showError: function(errorCode, customMessage, showInUI = true) {
        const error = this.getError(errorCode, customMessage);
        
        if (showInUI) {
            const errorElement = document.getElementById('myError');
            if (errorElement) {
                errorElement.innerHTML = `<strong>${error.title}</strong><br>${error.message}<br><em>Solution: ${error.solution}</em>`;
                errorElement.style.color = '#ff6b6b';
            }
            
            // Also log to results
            const resultsElement = document.getElementById('mySheetResults');
            if (resultsElement) {
                resultsElement.innerHTML = '';
            }
        }
        
        // Log to console for debugging
        console.error('Error:', error.code, error.fullMessage);
        
        return error;
    },
    
    /**
     * Handle and format error from exception
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     * @returns {Object} Formatted error
     */
    handleException: function(error, context) {
        let errorCode = this.ERROR_CODES.UNKNOWN_ERROR;
        let customMessage = '';
        
        // Try to determine error type from message
        const errorMessage = error.toString().toLowerCase();
        
        if (errorMessage.includes('not found') || errorMessage.includes('missing')) {
            if (context.includes('folder')) {
                errorCode = this.ERROR_CODES.FOLDER_NOT_FOUND;
            } else if (context.includes('comp')) {
                errorCode = this.ERROR_CODES.COMP_NOT_FOUND;
            } else if (context.includes('file')) {
                errorCode = this.ERROR_CODES.FILE_NOT_FOUND;
            }
        } else if (errorMessage.includes('empty')) {
            errorCode = this.ERROR_CODES.DATA_EMPTY;
        } else if (errorMessage.includes('parse') || errorMessage.includes('format')) {
            errorCode = this.ERROR_CODES.CSV_PARSE_ERROR;
        } else if (errorMessage.includes('permission') || errorMessage.includes('access')) {
            errorCode = this.ERROR_CODES.PERMISSION_DENIED;
        }
        
        customMessage = `[${context}] ${error.message}`;
        
        return this.showError(errorCode, customMessage);
    },
    
    /**
     * Clear error messages
     */
    clearError: function() {
        const errorElement = document.getElementById('myError');
        if (errorElement) {
            errorElement.innerHTML = '';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
