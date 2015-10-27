/*
 * gvNIX. Spring Roo based RAD tool for Generalitat Valenciana
 * Copyright (C) 2013 Generalitat Valenciana
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(jQuery, window, document) {

	GvNIX_Map_Leaflet.userlayers_tabscontainer = function(sId, containerId, oMap, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.userlayers_tabscontainer ) {
			alert("Warning: GvNIX_Map_Leaflet userlayers tabscontainer  must be initialised with the keyword 'new'");
		}

		this.s = options;//jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = {
			"sId" : sId,
			"containerId": containerId, // id of the container where tabs container will be drawn. Can be null
			"oMap" : oMap, // map object. Can be null
			"aCrs" : aCrs,
			"aUserLayerTabs" : {} // Array of user layer tabs registered

		};

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Tab type wms. Class method declaration
	 */
	GvNIX_Map_Leaflet.userlayers_tabscontainer.prototype =
		{
				"_debug" : function(message) {
					var st = this._state;
					console.log("[tabs container:" + st.sId + "] " + message);
				},

				"_fnConstructor" : function() {
					var s = this.s;
					var st = this._state;

					// Set crs value
   				    if(st.oMap){
					  st.aCrs = st.oMap._data.map.options.crs.code;
					}

					// Search and register each tab defined into tab container
					var aUserLayersTabs = jQuery("div").find("[data-user_layer_tab='true']");
					var userLayerTabContainer = this;
					var aCrs = st.aCrs;
					var container = st.containerId;
					if(!st.containerId){
						container = st.sId;
					}
					aUserLayersTabs.each(function(index) {
						var $this = jQuery(this);
						var oUserLayerTabData = $this.data();
						var sIdUserLayerTab = this.id;
						userLayerTabContainer._fnRegisterUserLayerTab(sIdUserLayerTab, container, aCrs, oUserLayerTabData);
					});

					// Generate ul/li for create the tabs
					var headTabs = '<ul>';
					// Get all the tabs and create the link
					for(userTabs in st.aUserLayerTabs){
						var tab = st.aUserLayerTabs[userTabs];
						headTabs = headTabs.concat('<li><a href="#').concat(tab.fnGetId());
						headTabs = headTabs.concat('">').concat(tab.fnGetTitle()).concat('</a></li>');
					}
					headTabs = headTabs.concat('</ul>');
					// Add ul/li to beginning
					var divTabs = jQuery("#".concat(st.sId));
					divTabs.prepend(headTabs);


				},

				/**
				 * Create and register the tab into the tool
				 */
				"_fnRegisterUserLayerTab" : function(sId, container, aCrs, options) {
					this.__fnRegisterUserLayerTab(sId, container, aCrs, options);
				},

				/**
				 * Create and register the tab into the too
				 */
				"__fnRegisterUserLayerTab" : function(sId, container, aCrs, options) {
					var sUserLayerTabType = options.type;

					if (sUserLayerTabType == "Base") {
						this.debug("ERROR: 'Base' tool is not registrable");
						return;
					}
					// Get class that represents the user layer tab
					var oUserLayerTabClass = GvNIX_Map_Leaflet.USERLAYERTAB[sUserLayerTabType];
					if (!oUserLayerTabClass) {
						this.debug("ERROR: '" + oUserLayerTabClass + "' user layer tab type not found");
						return;
					}
					var newUserLayerTab = new oUserLayerTabClass(sId, container, aCrs, options);
					if (!newUserLayerTab) {
						this.debug("ERROR: '" + sId + "': user layer tab not created");
						return;
					}
					// store into the tool
					this._state.aUserLayerTabs[sId] = newUserLayerTab;
				},

				/**
				 * Call function clean of each tab
				 */
				"fnRestoreTabsElements" : function(){
					this._fnRestoreTabsElements();
				},

				/**
				 * La función de extinción de cada ficha
				 */
				"_fnRestoreTabsElements" : function(){
					var st = this._state;
					for(userTabs in st.aUserLayerTabs){
						var tab = st.aUserLayerTabs[userTabs];
						tab.fnCleanUserLayerTab();
					}
				},

				/**
				 * TODO
				 */
				"fnSetDataToTab" : function(layerType, oDataToSet){
					this._fnSetDataToTab(layerType, oDataToSet);
				},

				/**
				 * TODO
				 */
				"_fnSetDataToTab" : function(layerType, oDataToSet){
					var st = this._state;
					// search and set the data to the tab indicated by layerType
					for(userTabs in st.aUserLayerTabs){
						var tab = st.aUserLayerTabs[userTabs];
						if(tab.fnGetLayerType() === layerType){
							tab.fnSetData(oDataToSet);
						}
					}
				},

				/**
				 * Get tab id
				 */
				"fnGetId" : function(){
					return this._fnGetId();
				},

				/**
				 * Get tab id
				 */
				"_fnGetId" : function(){
					var st = this._state;
					return st.sId;
				},

				/**
				 * Create tab panel. Register the button connect of each tab
				 * and create the wizard of tab wms if is necessary
				 */
				"fnCreateTabs" : function(){
					this._fnCreateTabs();
				},

				/**
				 * Create tab panel. Register the button connect of each tab
				 * and create the wizard of tab wms if is necessary
				 */
				"_fnCreateTabs" : function(){
					var st = this._state;
					// Generate jQuery tabs
					var jQueryContainerId = null;
					if(st.containerId){
						jQueryContainerId = "#".concat(st.containerId);
					}
					jQuery("#".concat(st.sId), jQueryContainerId).tabs();

					// Register events to buttons connect and create and
					// register wizard for each tab if is necessary
					for(userTabs in st.aUserLayerTabs){
						var tab = st.aUserLayerTabs[userTabs];
						if(tab.fnCreateWizard){
							tab.fnCreateWizard();
						}
						// register events to buttons must register after create
						// the wizard or will be deleted
						tab.fnRegisterButtonsAction();
						if(tab._fnAddChangeEventToFileInput){
							//TODO eliminar parámetro después de testear
							tab._fnAddChangeEventToFileInput(st.oMap);
						}

					}
				},

				/**
				 * Get the tab that has the focus
				 */
				"fnGetFocusedTab" : function(){
					return this._fnGetFocusedTab();
				},

				/**
				 * Get the tab that has the focus
				 */
				"_fnGetFocusedTab" : function(){
					var st = this._state;
					// Get id of the div which tab is selected
					var jQueryContainerId = "#".concat(st.sId);
					if(st.containerId){
						jQueryContainerId = "#".concat(st.containerId);
					}
					var tabId = jQuery(".ui-tabs-active", jQueryContainerId).attr("aria-controls");
					return st.aUserLayerTabs[tabId];
				},

				/**
				 * Get selected layers of the tab specified by parameter
				 * Return false if an error has occurred
				 */
				"fnGetSelectedLayers" : function(oUserLayerTabSel){
					return this._fnGetSelectedLayers(oUserLayerTabSel);
				},

				/**
				 * Get selected layers of the tab specified by parameter
				 * Return false if an error has occurred
				 */
				"_fnGetSelectedLayers" : function(oUserLayerTabSel){
					//Get selected layers
					return oUserLayerTabSel.fnGetSelectedLayers();
				},

				/**
				 * Create an array with the information of selected layers
				 * necessary to add them to a map
				 */
				"fnCreateLayersOptions" : function(oUserLayerTabSel, layersSelected){
					return this._fnCreateLayersOptions(oUserLayerTabSel, layersSelected);
				},

				/**
				 * Create an array with the information of selected layers
				 * necessary to add them to a map
				 */
				"_fnCreateLayersOptions" : function(oUserLayerTabSel, layersSelected){
					return oUserLayerTabSel.fnCreateLayersOptions(layersSelected)

				},

				/**
				 * Create or get layer id for each layer defined in layerOptions
				 */
				"fnGetLayerId" : function(oUserLayerTabSel, layerOptions){
					return this._fnGetLayerId(oUserLayerTabSel, layerOptions);
				},

				/**
				 * Create or get layer id for each layer defined in layerOptions
				 */
				"_fnGetLayerId" : function(oUserLayerTabSel, layerOptions){
					return oUserLayerTabSel.fnGetLayerId(layerOptions)

				}
	};


})(jQuery, window, document);