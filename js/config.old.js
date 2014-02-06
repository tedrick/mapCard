//Application configurations only provide updated values
//You should always provide the application default values
//and update them after receiving the configuration

var config = {
	title : 'Map Card',
	themeColor : 'AliceBlue',
	description : '',
	enableZoom : true,
	showNavArrows : false,
	//Webmap comes with app, but normally not manually specified
	webmap : '660cd3f1db4349cdba107038a885b859',
	//Below are default values that aren't set by an application'
	appid : '',
	proxy : '/proxy/proxy.ashx',
	arcgisUrl : null,
	showLoadButtons: true,
}

//Application configuration specification as needed by ArcGIS Online Item
var _configSpecification = {
	"configurationSettings" : [{
		"category" : "General Settings",
		"fields" : [{
			"type" : "string",
			"fieldName" : "title",
			"label" : "Title",
			"stringFieldOption" : "textbox",
			"placeHolder" : ""
		}, {
			"type" : "options",
			"fieldName" : "themeColor",
			"tooltip" : "Color to use",
			"label" : "Theme Color",
			"options" : [{
				"label" : "Blue",
				"value" : "AliceBlue"
			}, {
				"label" : "Green",
				"value" : "LightGreen"
			}, {
				"label" : "Purple",
				"value" : "Plum",
			}, {
				"label" : "Grey",
				"value" : "LightGrey"
			}]
		}]
	}, {
		"category" : "Map Settings",
		"fields" : [{
			"type" : "boolean",
			"fieldName" : "enableZoom",
			"label" : "Enable Zooming",
			"tooltip" : ""
		}, {
			"type" : "boolean",
			"fieldName" : "showNavArrows",
			"label" : "Show Panning Arrows",
			"tooltip" : ""
		}]
	}],
	"values" : {
		title : '',
		themeColor : 'Blue',
		enableZoom : true,
		showNavArrows : false,
	}

}