/*global define:false, require:false, window:false, console:false */

define(
    ({
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
        showLoadButtons: true
    })
);