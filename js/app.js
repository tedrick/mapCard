/*global define:false, require:false, window:false, console:false, appBtn: false, mapBtn: false */

define(["dojo/_base/declare", "dojo/_base/lang", "dojo/on", "dojo/dom", "./config", "esri/map", "esri/config", "esri/urlUtils", "esri/arcgis/utils", "esri/IdentityManager"],
       function (declare, lang, on, dom, config, Map, esriConfig, urlUtils, arcgisUtils, IdentityManager) {
        "use strict";
        return declare(null, {
            config: config,
            map: null,
            constructor : function (configOptions) {
                declare.safeMixin(this.config, configOptions);
                var url, query;

                //Get any query parameters using the esri helper method
                url = urlUtils.urlToObject(window.location.toString());
                
                //Check for query parameter; create one if not present
                query = (url.query === undefined || url.query === null) ? {real: false} : url.query;

                //Update config options based on query parameters
                this.updateConfig(url.query);
                
                //Is this being used to show the loading process?
                //If so, we show the buttons and attach event handlers
                //console.log(appBtn);
                if (this.config.showLoadButtons) {
                    appBtn.set('style', {'visibility': 'visible'});
                    on(appBtn, "click", lang.hitch(this, this.getAppData));
                    mapBtn.set('style', {'visibility': 'visible'});
                    on(mapBtn, "click", lang.hitch(this, this.getWebMapInfo));
                }
                
                //Set proxy
                if (this.config.proxy) {esriConfig.defaults.io.proxyUrl = this.config.proxy; }
                
                //Set ArcGIS Online URL / ArcGIS for Portal location
                if (this.config.arcgisUrl) {arcgisUtils.arcgisUrl = this.config.arcgisUrl; }
                
                //Check for appid, if not present disable app button
                if (!query.hasOwnProperty('appid') && this.config.webmap) {
                    appBtn.set('disabled', true);
                    this.applyConfig();
                }
                
                //If the buttons are hidden & there is an appid, go ahead and load the map
                if (query.hasOwnProperty('appid') && !this.config.showLoadButtons) {this.getAppData(); }
            },
            
            getAppData : function () {
                console.log('getAppData');
                //Disable the load app button
                appBtn.set('disabled', true);
                //Request the app's item information
                var appRequest = arcgisUtils.getItem(this.config.appid);
                //getItem provides a deferred object; set onAppData to load when the request completes
                appRequest.then(lang.hitch(this, this.onAppData));
            },
            onAppData : function (result) {
                console.log('onAppData');
                //The configuration properties are stored in the itemData.values property of the result
                //Update the config variable
                this.updateConfig(result.itemData.values);
                
                //Apply any UI changes
                //Normally, you would not have a separate function to actually load the changes into the application, 
                //rather doing the changes in this function
                this.applyConfig();
            },
            applyConfig : function () {
                console.log('applyConfig');
                //This is where we make the customizations to the application- Title, colors, etc.
                //Enable the load web map button
                mapBtn.set('disabled', false);
                
                //Update the title
                dom.byId('title').innerHTML = this.config.title;
                
                //Update the color
                dom.byId('header').style.backgroundColor = this.config.themeColor;
                
                if (!this.config.showLoadButtons) {this.getWebMapInfo(); }
            },
            getWebMapInfo: function () {
                console.log('getWebMapInfo');
                var mapRequest;
                //Disable the map button to prevent multiple requests;
                mapBtn.set('disabled', true);
                //Make the request for the webmap info
                mapRequest = arcgisUtils.createMap(this.config.webmap, 'map', {
                    mapOptions : {
                        slider : this.config.enableZoom,
                        nav : this.config.showNavArrows
                    }
                });
                
                //The request returns a Deferred object, so hook any after map load processing
                mapRequest.then(lang.hitch(this, this.onWebMapInfo), this.onError);
            },
            onWebMapInfo: function (result) {
                console.log('onWebMapInfo');
                //Assign the map to a variable so we can access it programmatically later
                this.map = result.map;
                
                //You could then register a function to run after the mapLoad event
                
                //Add the Description to the app
                dom.byId('description').innerHTML = result.itemInfo.item.description;
		
            },
            
            updateConfig: function (newProperties) {
                var q;
                if (newProperties !== null) {
                    for (q in newProperties) {
                        if (newProperties.hasOwnProperty(q)) {
                            //check to see if it's 0 or 1 and change to integer
                            if (newProperties[q] === "0" || newProperties[q] === "1") {newProperties[q] = parseInt(newProperties[q], 10); }
                            //update the config variable
                            this.config[q] = newProperties[q];
                        }
                    }
                }
            },
            
            onError: function (error) {
                console.log('Error occured');
                console.log(error);
            }
        
        });
    
    });