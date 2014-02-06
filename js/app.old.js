dojo.require('esri.map');
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.utils");

var app = {
	map : {},

	init : function() {
		var url;
		//Get any query parameters using the esri helper method
		url = esri.urlToObject(window.location.toString());
		//Check for query parameter; create one if not present
		if (url.query == undefined) {url.query = {}; }
		//Update config options based on query parameters
		config = utils.applyOptions(config, url.query);
		
		//Is this being used to show the loading process?
		//If so, we show the buttons
		if (config.showLoadButtons) {
			dijit.byId("appBtn").set("style", {visibility:'visible'});
			dijit.byId("mapBtn").set("style", {visibility:'visible'});
		}

		//Set proxy
		if(config.proxy)
			esri.config.defaults.io.proxyUrl = config.proxy;

		//Set ArcGIS Online URL / ArcGIS for Portal location
		if (config.arcgisUrl) esri.arcgis.utils.arcgisUrl = config.arcgisUrl;

		//Check for appid, if not present disable app button
		if(!url.query.hasOwnProperty('appid') && config.webmap) {
			dijit.byId('appBtn').set('disabled', true);
			app.applyConfig();
		}
		
		//If the buttons are hidden & there is an appid, go ahead and load the map
		if (url.query.hasOwnProperty('appid') && !config.showLoadButtons) {app.getAppData()}
	},
	getAppData : function() {
		var appRequest;
		//Disable the load app button
		dijit.byId('appBtn').set('disabled', true);
		//Request the app
		appRequest = esri.arcgis.utils.getItem(config.appid);
		//getItem provides a deferred object; set onAppData to load when the request completes
		appRequest.then(app.onAppData);
	},
	onAppData : function(result) {
		//The configuration properties are stored in the itemData.values property of the result
		//Update the config variable
		config = utils.applyOptions(config, result.itemData.values);
		//Apply any UI changes
		//Normally, you would not have a separate function, rather doing the changes in this function
		app.applyConfig();
	},
	applyConfig : function() {
		//This is where we make the customizations to the application- Title, colors, etc.
		//Enable the load web map button
		dijit.byId('mapBtn').set('disabled', false);

		//Update the title
		dojo.byId('title').innerHTML = config.title;

		//Update the color
		dojo.style(dojo.byId('header'), 'backgroundColor', config.themeColor);
		
		if (!config.showLoadButtons) app.getWebMapInfo();

	},
	getWebMapInfo : function() {
		var mapRequest;
		//Disable the map button to prevent multiple requests;
		dijit.byId('mapBtn').set('disabled', true);
		//Make the request for the webmap info
		mapRequest = esri.arcgis.utils.createMap(config.webmap, 'map', {
			mapOptions : {
				slider : config.enableZoom,
				nav : config.showNavArrows,
				navigationMode : 'classic'
			}
		});

		//The request returns a Deferred object, so hook any after map load processing
		mapRequest.then(app.onWebMapInfo, utils.onError);
	},
	onWebMapInfo : function(result) {
		//Assign the map to a variable so we can access it programmatically later
		app.map = result.map;

		//You could then register a function to run after the mapLoad event

		//Add the Description to the app
		dojo.byId('description').innerHTML = result.itemInfo.item.description;

		//Nearly boilerplate engagement of map resizing
		utils.mapResize('map');
	}
}

var utils = {
	applyOptions : function(configVariable, newConfig) {
		var q;

		//Override any config options with query parameters
		for(q in newConfig) {
			configVariable[q] = newConfig[q];
		}
		return configVariable;
	},
	mapResize : function(mapNode) {
		//Have the map resize on a window resize
		dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
	},
	onError : function(error) {
		console.log('Error occured')
		console.log(error);
	}
}