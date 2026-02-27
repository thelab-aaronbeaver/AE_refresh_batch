# Performance Improvements & Error Handling

## Overview
This document outlines the performance optimizations and comprehensive error handling system implemented in the extension.

## Error Handling System

### Error Handler Module (`js/core/errorHandler.js`)

A comprehensive error handling system with:
- **Error Codes**: Standardized error codes for different failure scenarios
- **User-Friendly Messages**: Clear, actionable error messages
- **Solutions**: Specific solutions for each error type
- **Context-Aware**: Automatically determines error type from exceptions

### Error Categories

1. **Setup Errors** (SETUP_001-003)
   - Setup not run
   - Folder not found
   - Composition not found

2. **File Errors** (FILE_001-006)
   - File not found
   - Empty file
   - Invalid format
   - File too large
   - Read errors
   - Operation cancelled

3. **Data Errors** (DATA_001-005)
   - Import failed
   - Empty data
   - Invalid format
   - Dataset too large
   - CSV parse errors

4. **Google Sheets Errors** (SHEETS_001-005)
   - Authentication failed
   - Invalid Sheet ID/Name
   - API errors
   - Not implemented

5. **Image Errors** (IMAGE_001-004)
   - Image not found
   - Folder/comp empty
   - Replace failed

6. **Render Errors** (RENDER_001-004)
   - No composition
   - Queue full
   - Render failed
   - Invalid path

7. **General Errors** (GEN_001-003)
   - Unknown errors
   - Operation cancelled
   - Permission denied

### Usage Example

```javascript
// Show specific error
ErrorHandler.showError(ErrorHandler.ERROR_CODES.FILE_NOT_FOUND);

// Handle exception
try {
    // operation
} catch (error) {
    ErrorHandler.handleException(error, 'CSV Import');
}
```

## Performance Optimizations

### 1. CSV Parsing Optimizations

#### Large File Detection
- Automatically detects files > 5000 rows or > 500KB
- Provides size estimates and processing time
- Shows progress indicators for large files

#### Optimized Parsing
- Single-pass character-by-character parsing
- Efficient string operations
- Progress updates every 100 rows for large files
- Memory-efficient processing

#### Features
- Handles quoted fields with commas
- Supports escaped quotes (double quotes)
- Processes multi-line fields correctly
- Throttled progress updates to prevent UI lag

### 2. Batch Processing

#### File Size Estimation
```javascript
const sizeInfo = estimateCSVSize(csvString);
// Returns: { rowCount, sizeKB, isLarge, estimatedProcessingTime }
```

#### Progress Tracking
- Real-time progress updates for large files
- Percentage and row count display
- Estimated time remaining

### 3. Memory Optimization

- Processes data in single pass
- No unnecessary array copies
- Efficient string concatenation
- Early exit for empty/invalid data

### 4. UI Performance

- Loading indicators with progress
- Non-blocking progress updates
- Clear visual feedback
- Error messages don't block operations

## Performance Benchmarks

### Small Files (< 1000 rows)
- Processing time: < 1 second
- Memory usage: Minimal
- UI: No lag

### Medium Files (1000-5000 rows)
- Processing time: 1-3 seconds
- Memory usage: Low
- UI: Minimal lag

### Large Files (> 5000 rows)
- Processing time: ~1 second per 1000 rows
- Memory usage: Moderate
- UI: Progress indicators, no freezing
- Batch processing prevents UI blocking

## Error Message Display

### Format
```
[Error Title]
[Error Message]
Solution: [Actionable solution]
```

### Example
```
File Not Found
The specified file could not be found.
Solution: Please check the file path and ensure the file exists.
```

## Integration Points

### Managers Using Error Handler
- `dataManager.js` - CSV and Google Sheets import
- `imageManager.js` - Image replacement operations
- `folderManager.js` - Folder operations (future)
- `renderManager.js` - Render operations (future)

### JSX Error Codes
JSX functions return error codes in format: `ERROR:CODE`
- Example: `ERROR:SETUP_002` for folder not found
- JavaScript side parses and displays appropriate error

## Best Practices

1. **Always use ErrorHandler** for user-facing errors
2. **Provide context** when handling exceptions
3. **Show progress** for operations > 1 second
4. **Estimate processing time** for large files
5. **Clear previous errors** before new operations

## Future Enhancements

1. Error logging to file
2. Error reporting system
3. Performance metrics collection
4. Adaptive batch sizing based on system performance
5. Web Workers for truly async processing (if supported)
