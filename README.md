# Refresh Batch Extension for After Effects

A batch processing extension for Adobe After Effects that enables automated data-driven composition creation and rendering.

## Features

- **Data Import**: Import data from CSV files or Google Sheets
- **Dynamic Image Replacement**: Automatically replace images based on data rows
- **Text Layer Automation**: Create text layers with expressions linked to data
- **Batch Rendering**: Render multiple compositions automatically
- **Folder Organization**: Automatic folder structure creation

## Requirements

- Adobe After Effects CC 2015 or later
- Windows or macOS
- Node.js (for Google Sheets integration - optional)

## Installation

1. Copy the extension folder to your CEP extensions directory:
   - **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
   - **macOS**: `/Library/Application Support/Adobe/CEP/extensions/`

2. Enable unsigned extensions (for development):
   - **Windows**: Edit the registry or use the CEP extension manager
   - **macOS**: Run: `defaults write com.adobe.CSXS.7 PlayerDebugMode 1`

3. Restart After Effects

4. Access the extension: `Window > Extensions > Refresh Batch`

## Setup

### Initial Setup

1. Open your After Effects project
2. Click **"Fresh Batch Setup"** to create the required folder structure
3. This will create:
   - `reFresh Batch Setup` folder
   - `01_Images` folder
   - `02_Data` folder
   - `04_Comps` folder
   - Template compositions

### Data Import

#### CSV Import
1. Click **"Data Setup"**
2. Click the CSV file icon
3. Select your CSV file
4. The data will be imported and parsed

#### Google Sheets Import (Requires Setup)
1. Set up Google API credentials:
   - Copy `client_secret.json.example` to `client_secret.json`
   - Add your Google API credentials
   - **IMPORTANT**: Never commit `client_secret.json` to version control

2. Click **"Data Setup"**
3. Click the Google Drive icon
4. Enter your Sheet ID and Sheet Name
5. Click **"Import gSheet Data"**

## Usage

### Basic Workflow

1. **Setup**: Run "Fresh Batch Setup" to create folders
2. **Import Data**: Import your CSV or Google Sheet
3. **Configure**: Select data fields and set up image replacements
4. **Create Text Layers**: Click "ADD Text" to create text layers linked to data
5. **Render**: Use "Render" for single or "Batch Render" for multiple compositions

### Data Row Navigation

- Use the **+** and **-** buttons to navigate between data rows
- The current row number is displayed in the data row field
- Images and text update automatically when changing rows

### Image Replacement

1. Add images to the `01_Images` folder
2. Configure image replacement options
3. Images will update automatically when changing data rows

## File Structure

```
Refresh Extension/
├── CSXS/
│   └── manifest.xml          # Extension manifest
├── css/                      # Stylesheets
├── fonts/                    # Custom fonts
├── img/                      # Images (including notFound.jpg)
├── js/
│   ├── libs/
│   │   └── CSInterface.js    # Adobe CEP interface
│   └── main.js               # Main JavaScript logic
├── jsx/
│   └── aftereffects.jsx      # After Effects scripting
├── index.html                # Main UI
└── client_secret.json        # Google API credentials (not in repo)
```

## Troubleshooting

### Extension Not Appearing
- Check that the extension is in the correct CEP extensions folder
- Ensure unsigned extensions are enabled
- Restart After Effects

### Data Not Importing
- Verify CSV file format (comma-separated)
- Check that "Fresh Batch Setup" has been run
- Ensure data comp and folder exist

### Images Not Replacing
- Verify images are in the `01_Images` folder
- Check that the Images comp has the correct layer structure
- Ensure file paths are correct

### Google Sheets Not Working
- Verify `client_secret.json` is properly configured
- Check that Sheet ID and Sheet Name are correct
- Ensure Google Sheets API is enabled in your Google Cloud project

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `client_secret.json` to version control
- Keep your Google API credentials secure
- The `.gitignore` file is configured to exclude sensitive files

## Known Limitations

- Google Sheets integration requires manual OAuth setup
- CSV parsing handles quoted fields with commas (see utils.js).
- Some features may require specific After Effects project structure

## Improvements Made

This version includes:
- ✅ Better error handling throughout
- ✅ Dynamic path resolution (works on Windows and Mac)
- ✅ Input validation for user inputs
- ✅ Missing function implementations
- ✅ Improved CSV parsing
- ✅ Security improvements (credentials protection)
- ✅ Better user feedback

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check After Effects scripting documentation

## License

Check with the original extension vendor for licensing information.

---

**Version**: 1.0.0  
**Last Updated**: 2024
