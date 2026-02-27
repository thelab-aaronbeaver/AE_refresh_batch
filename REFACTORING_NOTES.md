# Code Refactoring - Modular Architecture

## Overview
The codebase has been refactored from a monolithic structure into a modular architecture for better organization, maintainability, and scalability.

## New Structure

```
js/
├── core/
│   └── utils.js              # Core utility functions
├── config/
│   └── config.js             # Centralized configuration
├── managers/
│   ├── dataManager.js        # Data import/export operations
│   ├── folderManager.js      # Folder and project operations
│   ├── renderManager.js      # Render queue operations
│   ├── uiManager.js          # UI interactions and DOM manipulation
│   ├── textManager.js        # Text layer operations
│   └── imageManager.js       # Image replacement operations
└── main.js                   # Main entry point (UI event handlers)
```

## Module Responsibilities

### Core Utilities (`core/utils.js`)
- Operating system detection
- CSInterface creation
- Message display functions
- CSV parsing utilities
- Input validation
- String escaping
- Element visibility toggling

### Configuration (`config/config.js`)
- Folder names
- Composition names
- Layer names
- Default values
- UI element IDs
- Validation rules

### Data Manager (`managers/dataManager.js`)
- CSV file import
- Google Sheets import
- Data array retrieval
- Data validation

### Folder Manager (`managers/folderManager.js`)
- Folder structure creation
- Project saving
- Project path retrieval

### Render Manager (`managers/renderManager.js`)
- Adding items to render queue
- Batch rendering operations

### UI Manager (`managers/uiManager.js`)
- Panel visibility toggling
- Data selector increment/decrement
- Dropdown population
- Image replace list management

### Text Manager (`managers/textManager.js`)
- Text layer creation
- Expression addition

### Image Manager (`managers/imageManager.js`)
- Image replacement
- Image option management

## Benefits of Refactoring

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Maintainability**: Easier to find and fix bugs in specific areas
3. **Testability**: Modules can be tested independently
4. **Reusability**: Utility functions can be reused across modules
5. **Scalability**: Easy to add new features without affecting existing code
6. **Readability**: Code is better organized and easier to understand

## Migration Notes

### Backward Compatibility
- All HTML `onclick` handlers remain unchanged
- Function names in `main.js` are preserved for compatibility
- Global variables are maintained for legacy code

### Module Loading
Modules are loaded via script tags in `index.html` in the following order:
1. CSInterface.js (Adobe library)
2. config/config.js
3. core/utils.js
4. managers/*.js (in dependency order)
5. main.js

### Cross-Module Dependencies
- Modules check for existence of other modules before calling them
- Uses `typeof` checks to prevent errors if modules aren't loaded
- Dependencies are minimal and well-defined

## JSX File Organization

The `aftereffects.jsx` file has been organized with clear sections:
- Configuration
- Utility Functions
- Project Management
- Folder & Composition Setup
- Data Import & Management
- Image Management
- Text Layer Management
- Data Selector Management
- Render Queue Management
- Google Sheets Integration

Each section is clearly marked with comment headers and functions have JSDoc-style comments.

## Future Improvements

1. **Module Bundling**: Consider using a module bundler for production
2. **TypeScript**: Could add type safety with TypeScript
3. **Unit Tests**: Add unit tests for each module
4. **Error Handling**: Centralize error handling in a dedicated module
5. **Event System**: Implement a pub/sub event system for module communication

## Testing the Refactoring

To verify the refactoring works:
1. Load the extension in After Effects
2. Test each major function:
   - Create folder structure
   - Import CSV data
   - Navigate data rows
   - Replace images
   - Add text layers
   - Render compositions

All functionality should work exactly as before, but with better code organization.
