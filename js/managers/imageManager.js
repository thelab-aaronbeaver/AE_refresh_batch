/**
 * Image Manager Module
 * Handles image replacement operations (map CSV file path columns to 01_Images folder items).
 * When Source Text is an image URL, downloads it to the project folder then imports into 01_Images.
 */

const ImageManager = {
	/**
	 * Replace images from current data row. If any slot has an image URL (from JSON/data), download to project folder then replace in 01_Images.
	 */
	replaceImage: function() {
		var self = this;
		var mappingStr = (typeof UIManager !== "undefined" && UIManager.getImageReplaceMappingString) ? UIManager.getImageReplaceMappingString() : "";
		var esc = function(s) {
			s = String(s);
			return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
		};
		var notFoundPath = "";
		try {
			var cs = createCSInterface();
			if (typeof SystemPath !== "undefined" && SystemPath.EXTENSION && typeof cs.getSystemPath === "function") {
				var extRoot = cs.getSystemPath(SystemPath.EXTENSION);
				if (extRoot) {
					notFoundPath = (extRoot.replace(/\\/g, "/").replace(/\/+$/, "") + "/img/notFound.jpg");
				}
			}
		} catch (e) {}
		var csInterface = createCSInterface();

		function runReplace(overridePathsStr) {
			var script;
			if (overridePathsStr != null && overridePathsStr.length > 0) {
				script = notFoundPath.length > 0
					? ('replaceimageJSX("' + esc(mappingStr) + '", "' + esc(notFoundPath) + '", "' + esc(overridePathsStr) + '")')
					: ('replaceimageJSX("' + esc(mappingStr) + '", "", "' + esc(overridePathsStr) + '")');
			} else if (notFoundPath.length > 0) {
				script = mappingStr.length
					? ('replaceimageJSX("' + esc(mappingStr) + '", "' + esc(notFoundPath) + '")')
					: ('replaceimageJSX("", "' + esc(notFoundPath) + '")');
			} else {
				script = mappingStr.length ? ('replaceimageJSX("' + esc(mappingStr) + '")') : "replaceimageJSX()";
			}
			csInterface.evalScript(script, function(result) {
				result = (result != null) ? String(result) : "";
				if (result.indexOf("OK:") === 0) {
					if (typeof showMessage === "function") {
						var rest = result.substring(3);
						var pipe = rest.indexOf(" | ");
						var num = pipe >= 0 ? rest.substring(0, pipe) : rest;
						var detail = pipe >= 0 ? rest.substring(pipe + 3) : "";
						var msg = "Replaced " + num + " image(s).";
						if (detail) msg += " " + detail;
						showMessage(msg, false);
					}
					return;
				}
				if (result.indexOf("ERROR:") === 0) {
					if (typeof showMessage === "function") {
						showMessage(result, true);
					} else {
						alert(result);
					}
					return;
				}
				if (typeof showMessage === "function") {
					showMessage("Image replace failed. Check 01_Images folder and that each slot is mapped to a 00_Template layer (Source Text = path or URL).", true);
				} else {
					alert("Image replace failed. Check 01_Images folder and 00_Template layer mapping.");
				}
			});
		}

		// Get project path so we can save downloaded images there
		csInterface.evalScript("getfilepath()", function(projectFolder) {
			projectFolder = (projectFolder != null && typeof projectFolder === "string") ? projectFolder.replace(/\/+$/, "").replace(/\\/g, "/") : "";
			csInterface.evalScript("getImageReplacePreviewJSX(\"" + esc(mappingStr) + "\")", function(previewResult) {
				previewResult = (previewResult != null) ? String(previewResult) : "";
				if (previewResult.indexOf("OK:") !== 0) {
					runReplace(null);
					return;
				}
				var payload = previewResult.substring(3);
				var delim = "||SLOT||";
				var parts = payload.split(delim);
				var rowEl = document.getElementById(Config.ui.dataRowValue);
				var rowNum = (rowEl && rowEl.value != null) ? String(rowEl.value).trim() : "0";
				rowNum = Math.max(0, parseInt(rowNum, 10) || 0);
				var hasUrl = false;
				for (var p = 0; p < parts.length; p++) {
					var v = (parts[p] != null) ? String(parts[p]).trim() : "";
					if (v.indexOf("http://") === 0 || v.indexOf("https://") === 0) hasUrl = true;
				}
				if (!hasUrl || !projectFolder || typeof downloadImageFromUrl !== "function") {
					runReplace(null);
					return;
				}
				var pathModule;
				try { pathModule = require("path"); } catch (e) { runReplace(null); return; }
				var downloadDir = pathModule.join(projectFolder, "DownloadedImages");
				var overridePaths = [];
				var pending = 0;
				var slotDelim = "||SLOT||";
				var done = function() {
					pending--;
					if (pending === 0) {
						runReplace(overridePaths.join(slotDelim));
					}
				};
				for (var i = 0; i < parts.length; i++) {
					overridePaths[i] = "";
					var val = (parts[i] != null) ? String(parts[i]).trim() : "";
					if (val.indexOf("http://") !== 0 && val.indexOf("https://") !== 0) continue;
					var ext = ".jpg";
					var extMatch = val.match(/\.(png|jpeg|jpg|gif|webp|bmp)(\?|$)/i);
					if (extMatch) ext = extMatch[1] ? ("." + extMatch[1].toLowerCase()) : ".jpg";
					var safeName = "row" + rowNum + "_slot" + i + ext;
					var destPath = pathModule.join(downloadDir, safeName);
					pending++;
					(function(idx, url, path) {
						downloadImageFromUrl(url, path, function(err, localPath) {
							if (!err && localPath) {
								overridePaths[idx] = localPath;
							} else if (notFoundPath) {
								overridePaths[idx] = notFoundPath;
							}
							done();
						});
					})(i, val, destPath);
				}
				if (pending === 0) {
					runReplace(overridePaths.join(slotDelim));
				}
			});
		});
	},

	/**
	 * Download an image from a web URL to the project folder and import it into 01_Images.
	 * Uses the "Import from URL" input; requires project saved and Node.js in CEP.
	 */
	importImageFromUrl: function() {
		var inputEl = document.getElementById(Config.ui.imageImportUrlInput);
		var url = (inputEl && inputEl.value) ? inputEl.value.trim() : "";
		if (!url || (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0)) {
			if (typeof showMessage === "function") showMessage("Enter a valid image URL (http or https).", true);
			else alert("Enter a valid image URL.");
			return;
		}
		if (typeof showLoading === "function") showLoading(true, "Downloading image...");
		var csInterface = createCSInterface();
		csInterface.evalScript("getfilepath()", function(projectFolder) {
			projectFolder = (projectFolder != null && typeof projectFolder === "string") ? projectFolder.replace(/\/+$/, "").replace(/\\/g, "/") : "";
			if (!projectFolder) {
				if (typeof showLoading === "function") showLoading(false);
				if (typeof showMessage === "function") showMessage("Save the project first so the extension knows where to save the image.", true);
				return;
			}
			var pathModule;
			try { pathModule = require("path"); } catch (e) {
				if (typeof showLoading === "function") showLoading(false);
				if (typeof showMessage === "function") showMessage("Node.js not available. Enable it in the extension manifest for URL download.", true);
				return;
			}
			var ext = ".jpg";
			var extMatch = url.match(/\.(png|jpeg|jpg|gif|webp|bmp)(\?|$)/i);
			if (extMatch && extMatch[1]) ext = "." + extMatch[1].toLowerCase();
			var safeName = "imported_" + Date.now() + ext;
			var downloadDir = pathModule.join(projectFolder, "DownloadedImages");
			var destPath = pathModule.join(downloadDir, safeName);
			downloadImageFromUrl(url, destPath, function(err, localPath) {
				if (typeof showLoading === "function") showLoading(false);
				if (err || !localPath) {
					if (typeof showMessage === "function") showMessage("Download failed: " + (err ? err.message : "unknown"), true);
					return;
				}
				// Pass path via temp file so we never embed long/special paths in evalScript (avoids "No response" from AE).
				var esc = function(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, ""); };
				var extensionPath = "";
				try {
					if (typeof SystemPath !== "undefined" && SystemPath.EXTENSION && typeof csInterface.getSystemPath === "function") {
						extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION) || "";
					}
				} catch (e) {}
				extensionPath = (extensionPath || "").replace(/\\/g, "/");
				var tempFileName = "temp_import_path.txt";
				var fs;
				try { fs = require("fs"); } catch (e) { fs = null; }
				if (!extensionPath || !fs) {
					if (typeof showMessage === "function") showMessage("Cannot get extension path for import.", true);
					return;
				}
				var tempPath = pathModule.join(extensionPath, tempFileName);
				try {
					fs.writeFileSync(tempPath, localPath, "utf8");
				} catch (writeErr) {
					if (typeof showMessage === "function") showMessage("Could not write temp path file: " + (writeErr && writeErr.message ? writeErr.message : "unknown"), true);
					return;
				}
				csInterface.evalScript('importImageFromPathTo01Images("' + esc(extensionPath) + '")', function(result) {
					try { fs.unlinkSync(tempPath); } catch (e) {}
					result = (result != null && result !== undefined) ? String(result) : "";
					if (result.indexOf("OK:") === 0) {
						if (typeof showMessage === "function") showMessage("Imported to 01_Images: " + result.substring(3), false);
						if (typeof UIManager !== "undefined" && UIManager.populateImageReplaceMapping) UIManager.populateImageReplaceMapping();
						if (inputEl) inputEl.value = "";
					} else {
						var errMsg = (result && result.length > 0) ? result : "No response from After Effects.";
						if (result.indexOf("ERROR:") !== 0 && errMsg === result) errMsg = "Import failed: " + errMsg;
						if (typeof showMessage === "function") showMessage(errMsg, true);
					}
				});
			});
		});
	},

	/**
	 * Add image replace option (new slot in 01_Images); then refresh mapping UI.
	 */
	addReplaceImageOption: function() {
		var csInterface = createCSInterface();
		csInterface.evalScript("addReplaceImageOptionJSX()", function(result) {
			if (result && result !== "undefined") {
				if (typeof UIManager !== "undefined" && UIManager.populateImageReplaceMapping) {
					UIManager.populateImageReplaceMapping();
				}
			} else {
				alert("Error adding image replace option.");
			}
		});
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ImageManager;
}
