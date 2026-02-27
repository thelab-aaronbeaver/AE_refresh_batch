const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');
var osExtensionPath = "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/com.extension.testing";
let globalfilepath = null;
var globalAuth;
var projectFilePath;





//save project function //

function saveCurrentProject() {
	const csInterface = new CSInterface();

	csInterface.evalScript('saveProject()', (projectFilePathResult) => {
		projectFilePath = projectFilePathResult;
		getProjectPath();
	});
}









function replaceimageJS() {
	//app.project.item(10).replace(File(myPath));
	var interface = new CSInterface();
	interface.evalScript('replaceimageJSX()', function (result) {
		alert(result);
		const element = document.createElement(<div class="panel-row">
			<select onchange="selectChange()" name="dropdown-name" id="dropdown-name">
				<option>Select a Data Field</option>
			</select>
			<div class="icon">
				<li onclick="populateDataFieldDropdown()" class="fa fa-refresh"></li>
			</div>
		</div>);
		document.getElementById("dataFieldPanel").appendChild(element);
	});

}



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
};


// Cloase reFresh Batch

function closepanel() {
	var interface = new CSInterface();
	interface.closeExtension();
};

// reFresh Batch Folder Setup 

function createFolder() {
	var interface = new CSInterface();
	interface.evalScript('createFolder()');
	//alert('working');
};

function addEffect() {
	var interface = new CSInterface();
	interface.evalScript('addEffect()');

};

// Data Selector Section //

function incrementSelectorJS() {
	var interface = new CSInterface();
	interface.evalScript('incrementSelector()', function (result) {
		document.getElementById("data-row-value").value = result;
		alert(result)
	})
	replaceimageJS()

};

function decrementSelectorJS() {
	var interface = new CSInterface();
	interface.evalScript('decrementSelector()', function (result) {
		document.getElementById("data-row-value").value = result;
		//alert(result)
	})
	replaceimageJS()
};

// Data Selector Section //


function populateDataFieldDropdown() {
	clearDropdown();

	const selectElement = document.getElementById('dropdown-name');
	const interface = new CSInterface();
	interface.evalScript('dataFieldDropdown()', (results) => {
		const options = results.split(',');

		options.forEach((option) => {
			const element = document.createElement('option');
			element.textContent = option;
			element.value = option;
			selectElement.appendChild(element);
		});
		//alert(options)
		//const head = document.querySelector('thead');
		let tags = "<tr>";
		for (let i = 0; i < options.length; i++) {
			tags += `<th>${options[i]}</th>`;
		}
		tags += "</tr>"
		head.innerHTML = tags;

		//alert(element.value)

	});


}

function clearDropdown() {
	function removeOptions(selectElement) {
		var i, L = selectElement.options.length - 1;
		for (i = L; i >= 0; i--) {
			selectElement.remove(i);
		}
	}
	removeOptions(document.getElementById('dropdown-name'));
}


function addExpression(params) {
	var interface = new CSInterface();
	interface.evalScript('addExpression()')
	//alert('working')

}

//  Import Locale File to AE
function importDataFileJS() {
	const interface = new CSInterface();
	interface.evalScript('importDataFileJSX()', (csvString) => {
		const rows = csvString.split('\n');
		var dataArray = [];

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i].split(',');
			dataArray.push(row);
		}

		//const data = rows.slice(1).map((row) => row.split(','));
		document.getElementById('mySheetResults').innerText = dataArray;
		populateDataFieldDropdown();
		addTextJS();
	});
}

function dataSetupShowHide() {
	var x = document.getElementById("importPanel");
	if (x.style.display === "block") {
		x.style.display = "none";
	} else {
		x.style.display = "block";
	}
	saveCurrentProject()
	getprojectpath()
}

function gDriveSetupShowHide() {
	var x = document.getElementById("gDriveSetupPanel");
	if (x.style.display === "flex") {
		x.style.display = "none";
	} else {
		x.style.display = "flex";
	}
}

// Data Fields Index Function to send to JSX //

function selectChange() {
	var selection = document.getElementById("dropdown-name").value;
	var selectionIndex = selection.selectionIndex
	const selectElement = document.getElementById("dropdown-name");
	const selectedIndex = selectElement.selectedIndex;
	var selectedIndexNum = parseFloat(selectedIndex)
	selectedIndexNum += 1;
	//document.getElementById('selectChangeP').innerText = selectedIndexNum;
	return selectedIndex;
}

// Data Fields CLEAR //

function clearDropdown() {
	function removeOptions(selectElement) {
		var i, L = selectElement.options.length - 1;
		for (i = L; i >= 0; i--) {
			selectElement.remove(i);
		}
	}
	removeOptions(document.getElementById('dropdown-name'));
}


// Get Project File Path Function //

function getprojectpath() {
	var interface = new CSInterface();
	interface.evalScript('getfilepath()', function (result) {
		//alert(result)
		globalfilepath = result.replace(/\//g, "\\");
		//alert(globalfilepath);
		//document.getElementById("filepath").value = globalfilepath;
		//alert(globalfilepath)
		return globalfilepath;

	});
}



function addTextJS() {
	var interface = new CSInterface();
	interface.evalScript('addHeaderTextJSX()')
}


function dataArrayCSVJS() {
	var interface = new CSInterface();
	interface.evalScript('importCSVarray()')
}
//
// fix oldIE value attroperty



function addtoRenderQueueJS() {
	var interface = new CSInterface();
	interface.evalScript('addtoRenderQueue()')
	//interface.evalScript('createFolder()')


	//alert('working')
}

function batchRenderQueueJS() {
	var interface = new CSInterface();
	interface.evalScript('batchRender()')
}






