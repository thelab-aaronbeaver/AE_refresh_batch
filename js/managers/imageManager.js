/**
 * Image Manager Module
 * Handles image replacement operations (map CSV file path columns to 01_Images folder items).
 */

const ImageManager = {
	/**
	 * Replace images from current data row using the header→image mapping in the UI.
	 */
	replaceImage: function() {
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
		var script;
		if (notFoundPath.length > 0) {
			script = mappingStr.length
				? ('replaceimageJSX("' + esc(mappingStr) + '", "' + esc(notFoundPath) + '")')
				: ('replaceimageJSX("", "' + esc(notFoundPath) + '")');
		} else {
			script = mappingStr.length ? ('replaceimageJSX("' + esc(mappingStr) + '")') : "replaceimageJSX()";
		}
		var csInterface = createCSInterface();
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
			// Fallback: no or unknown result
			if (typeof showMessage === "function") {
				showMessage("Image replace failed. Check 01_Images folder and that each slot is mapped to a 00_Template layer (Source Text = path or URL).", true);
			} else {
				alert("Image replace failed. Check 01_Images folder and 00_Template layer mapping.");
			}
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
