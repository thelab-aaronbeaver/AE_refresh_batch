/**
 * Core Utilities Module
 * Provides common utility functions used throughout the extension
 */

/**
 * Get the operating system type
 * @returns {string} "MAC" or "WIN"
 */
function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        os = null;

    if (macosPlatforms.indexOf(platform) != -1) {
        os = "MAC";
    } else if (windowsPlatforms.indexOf(platform) != -1) {
        os = "WIN";
    }
    return os;
}

/**
 * Create a CSInterface instance
 * @returns {CSInterface} New CSInterface instance
 */
function createCSInterface() {
    return new CSInterface();
}

/**
 * Show message in the results element
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showMessage(message, isError = false) {
	const resultsElement = document.getElementById('mySheetResults');
	const errorElement = document.getElementById('myError');
	
	if (isError) {
		if (errorElement) errorElement.innerText = message;
		if (resultsElement) {
			resultsElement.innerText = "";
			resultsElement.classList.remove("is-status");
		}
	} else {
		if (resultsElement) {
			resultsElement.innerText = message;
			resultsElement.classList.add("is-status");
		}
		if (errorElement) errorElement.innerText = "";
	}
}

/** Timeout id for auto-hiding loading indicator so it never sticks forever. */
var _loadingSafetyTimeoutId = null;
var LOADING_SAFETY_MS = 25000;

/**
 * Show loading indicator
 * @param {boolean} show - Whether to show or hide the indicator
 * @param {string} message - Optional message to display
 */
function showLoading(show = true, message = "Processing...") {
	if (_loadingSafetyTimeoutId) {
		clearTimeout(_loadingSafetyTimeoutId);
		_loadingSafetyTimeoutId = null;
	}
	const loadingIndicator = document.getElementById('loadingIndicator');
	if (loadingIndicator) {
		if (show) {
			loadingIndicator.hidden = false;
			const span = loadingIndicator.querySelector('span');
			if (span) span.textContent = message || "Processing...";
			_loadingSafetyTimeoutId = setTimeout(function () {
				_loadingSafetyTimeoutId = null;
				loadingIndicator.hidden = true;
			}, LOADING_SAFETY_MS);
		} else {
			loadingIndicator.hidden = true;
		}
	}
}

/**
 * Escape quotes in a string to prevent script injection
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeQuotes(str) {
    if (!str) return "";
    return str.replace(/"/g, '\\"');
}

/**
 * Parse CSV string into array of rows (optimized for large datasets)
 * Handles quoted fields, escaped quotes, and commas within quoted fields
 * Optimized for performance with large files
 * @param {string} csvString - CSV content as string
 * @param {Function} progressCallback - Optional callback for progress updates (current, total)
 * @returns {Array<Array<string>>} Array of rows, each row is an array of cells
 */
function parseCSV(csvString, progressCallback) {
	if (!csvString || csvString.length === 0) {
		return [];
	}
	
	const rows = [];
	const lines = csvString.split(/\r?\n/);
	const totalLines = lines.length;
	let processedLines = 0;
	
	// Check if file is large (more than 5000 rows)
	const isLargeFile = totalLines > 5000;
	const progressInterval = isLargeFile ? 100 : Infinity; // Update progress every 100 rows for large files
	
	// Optimized single-pass parsing
	for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
		const line = lines[lineIndex].trim();
		if (line.length === 0) continue;
		
		const row = [];
		let currentField = '';
		let inQuotes = false;
		let i = 0;
		const lineLength = line.length;
		
		// Optimized character-by-character parsing
		while (i < lineLength) {
			const char = line[i];
			const nextChar = i + 1 < lineLength ? line[i + 1] : '';
			
			if (char === '"') {
				if (inQuotes && nextChar === '"') {
					// Escaped quote (double quote)
					currentField += '"';
					i += 2;
				} else if (inQuotes && (nextChar === ',' || nextChar === '' || nextChar === '\r' || nextChar === '\n')) {
					// End of quoted field
					inQuotes = false;
					i++;
				} else if (!inQuotes) {
					// Start of quoted field
					inQuotes = true;
					i++;
				} else {
					// Regular quote within quoted field
					currentField += char;
					i++;
				}
			} else if (char === ',' && !inQuotes) {
				// Field separator
				row.push(currentField.trim());
				currentField = '';
				i++;
			} else {
				// Regular character
				currentField += char;
				i++;
			}
		}
		
		// Add the last field
		if (currentField.length > 0 || row.length > 0) {
			row.push(currentField.trim());
			rows.push(row);
		}
		
		processedLines++;
		
		// Progress callback for large files (throttled)
		if (isLargeFile && progressCallback && processedLines % progressInterval === 0) {
			progressCallback(processedLines, totalLines);
		}
	}
	
	// Final progress update
	if (isLargeFile && progressCallback) {
		progressCallback(totalLines, totalLines);
	}
	
	return rows;
}

/**
 * Estimate CSV file size and row count (for performance planning)
 * @param {string} csvString - CSV content as string
 * @returns {Object} Object with estimated row count and size info
 */
function estimateCSVSize(csvString) {
	if (!csvString) {
		return { rowCount: 0, sizeKB: 0, isLarge: false };
	}
	
	const lines = csvString.split(/\r?\n/);
	const rowCount = lines.filter(line => line.trim().length > 0).length;
	const sizeKB = (csvString.length / 1024).toFixed(2);
	const isLarge = rowCount > 5000 || csvString.length > 500000; // > 500KB or > 5000 rows
	
	return {
		rowCount: rowCount,
		sizeKB: parseFloat(sizeKB),
		isLarge: isLarge,
		estimatedProcessingTime: isLarge ? Math.ceil(rowCount / 1000) + ' seconds' : '< 1 second'
	};
}

/**
 * Validate Sheet ID format
 * @param {string} sheetId - Google Sheet ID to validate
 * @returns {boolean} True if valid
 */
function validateSheetId(sheetId) {
    if (!sheetId || typeof sheetId !== "string") return false;
    var s = sheetId.trim();
    return s.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(s);
}

/**
 * Validate Sheet Name
 * @param {string} sheetName - Sheet name to validate
 * @returns {boolean} True if valid
 */
function validateSheetName(sheetName) {
    return sheetName && sheetName.trim().length > 0;
}

/**
 * Toggle element visibility
 * @param {string} elementId - ID of element to toggle
 * @param {string} displayType - Display type when showing (default: "block")
 */
function toggleElementVisibility(elementId, displayType = "block") {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (element.style.display === displayType ||
        (element.style.display === "flex" && displayType === "flex")) {
        element.style.display = "none";
    } else {
        element.style.display = displayType;
    }
}

// Export functions for use in other modules
/**
 * Map HTTP Content-Type to file extension so we preserve the actual image format.
 * @param {string} contentType - e.g. "image/png" or "image/jpeg; charset=utf-8"
 * @returns {string} Extension including dot, e.g. ".png", or "" if unknown
 */
function extensionFromContentType(contentType) {
	if (!contentType || typeof contentType !== "string") return "";
	var type = contentType.split(";")[0].trim().toLowerCase();
	var map = {
		"image/jpeg": ".jpg",
		"image/jpg": ".jpg",
		"image/png": ".png",
		"image/gif": ".gif",
		"image/webp": ".webp",
		"image/bmp": ".bmp",
		"image/tiff": ".tif",
		"image/x-tiff": ".tif"
	};
	return map[type] || "";
}

/**
 * Download an image from a URL to a local file (Node.js). Uses http(s).get + createWriteStream + pipe.
 * Preserves original format: if the response Content-Type is an image type, the file is saved/renamed with that extension.
 * @param {string} url - Full image URL (http or https)
 * @param {string} destFilePath - Full path for the saved file (extension may be updated from Content-Type)
 * @param {function(Error|null, string)} callback - Called with (err, localPath). localPath is the final path (may differ if renamed to match format).
 */
function downloadImageFromUrl(url, destFilePath, callback) {
	if (!url || typeof url !== "string" || url.trim().length === 0) {
		if (typeof callback === "function") callback(new Error("No URL"), "");
		return;
	}
	url = url.trim();
	if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
		if (typeof callback === "function") callback(new Error("Not an HTTP(S) URL"), "");
		return;
	}
	var fs, pathModule, http, https;
	try {
		fs = require("fs");
		pathModule = require("path");
		http = require("http");
		https = require("https");
	} catch (e) {
		if (typeof callback === "function") callback(new Error("Node.js not available"), "");
		return;
	}
	var dir = pathModule.dirname(destFilePath);
	try {
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	} catch (e) {
		if (typeof callback === "function") callback(e, "");
		return;
	}
	var file = fs.createWriteStream(destFilePath);
	function done(err) {
		file.close();
		try { fs.unlinkSync(destFilePath); } catch (e2) {}
		if (typeof callback === "function") callback(err, "");
	}
	var lib = url.indexOf("https://") === 0 ? https : http;
	var req = lib.get(url, { timeout: 15000 }, function (res) {
		if (res.statusCode === 301 || res.statusCode === 302 && res.headers.location) {
			file.close();
			downloadImageFromUrl(res.headers.location, destFilePath, callback);
			return;
		}
		if (res.statusCode !== 200) {
			done(new Error("HTTP " + res.statusCode));
			return;
		}
		var contentTypeExt = extensionFromContentType(res.headers["content-type"]);
		res.pipe(file);
		file.on("finish", function () {
			file.close();
			var finalPath = destFilePath;
			if (contentTypeExt) {
				var baseNoExt = destFilePath.replace(/\.[^.\\/]*$/, "");
				var wantedPath = baseNoExt + contentTypeExt;
				if (wantedPath !== destFilePath) {
					try {
						if (fs.existsSync(wantedPath)) fs.unlinkSync(wantedPath);
						fs.renameSync(destFilePath, wantedPath);
						finalPath = wantedPath;
					} catch (e) {
						// leave file at destFilePath if rename fails
					}
				}
			}
			if (typeof callback === "function") callback(null, finalPath);
		});
	});
	file.on("error", function (err) { done(err); });
	req.on("error", function (err) { done(err); });
	req.on("timeout", function () { req.destroy(); done(new Error("Timeout")); });
	if (req.setTimeout) req.setTimeout(15000);
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		getOS,
		createCSInterface,
		showMessage,
		showLoading,
		escapeQuotes,
		parseCSV,
		estimateCSVSize,
		validateSheetId,
		validateSheetName,
		toggleElementVisibility,
		downloadImageFromUrl
	};
}
