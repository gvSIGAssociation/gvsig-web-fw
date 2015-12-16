/*
 * gvSIG Web Framework is sponsored by the General Directorate for Information
 * Technologies (DGTI) of the Regional Ministry of Finance and Public
 * Administration of the Generalitat Valenciana (Valencian Community,
 * Spain), managed by gvSIG Association and led by DISID.
 *
 * Copyright (C) 2015 DGTI - Generalitat Valenciana
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see &lt;http://www.gnu.org/licenses /&gt;.
 *
 */

/* Global scope for GvNIX_Map_Clean_Tool */
var GvNIX_Map_Predefined_Layers_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.predefined_layers = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.predefined_layers) {
			alert("Warning: GvNIX_Map_Leaflet predefined_layers control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.simple_selectable.default_options, {
				// No additional settings
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.simple_selectable._state, {
					"sId" : sId,
					"oMap" : oMap,
					"$menu" : null,
					"oUtil" : null,
					"msg_layers_incompatible_map" : null,
					"msg_children_incompatible" : null
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_layers.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					this._fnLoadMenu();
					this._state.oUtil = GvNIX_Map_Leaflet.Util;

					// Load alert messages
					this._state.msg_layers_incompatible_map = this.s.msg_layers_incompatible_map;
					this._state.msg_children_incompatible = this.s.msg_children_incompatible;
				},

				"_fnDoSelect" : function() {
					if (!this.__fnDoSelect()) {
						return false;
					}
					this._fnToggleMenu();
					this._fnDoDeselect();

					return false;
				},

				"_fnDoDeselect" : function() {
					if (!this.__fnDoDeselect()) {
						return false;
					}
					return true;
				},

				/**
				 * Function that creates a menu with predefined layers list
				 * elements
				 */
				"_fnLoadMenu" : function() {
					this.__fnLoadMenu();
				},

				/**
				 * Initialize a jQuery UI menu with predefined layers lists
				 * elements
				 */
				"__fnLoadMenu" : function() {
					var st = this._state;
					var self = this;
					// Save root menu list element
					var $rootElement = jQuery("#" + st.sId + "_root");
					// Set initial menu options
					var menuOptions = {
						"select" : function(event, ui) {
							self._fnOnMenuItemSelected(event, ui);
						}
					};
					// Load menu with predefined options
					var menu = $rootElement.menu(menuOptions);

					// Append root element to map div
					$rootElement.appendTo(jQuery("#map" + st.oMap.s.id));

					// Save menu object
					this._state.$menu = menu;
				},

				/**
				 * Shows or hides the predefined layers menu
				 */
				"_fnToggleMenu" : function() {
					this.__fnToggleMenu();
				},

				/**
				 * Shows or hides the predefined layers menu on top of this tool
				 * icon
				 */
				"__fnToggleMenu" : function() {
					var st = this._state;
					st.$menu.toggle().position({
						my : "right bottom",
						at : "left+25px top-5px",
						of : jQuery("#" + st.sId),
						collision : "fit"
					});
				},

				/**
				 * Function that will be called when a menu item is selected
				 */
				"_fnOnMenuItemSelected" : function(event, ui) {
					this.__fnOnMenuItemSelected(event, ui);
				},

				/**
				 * Function to register the selected layer in map and make it
				 * visible
				 */
				"__fnOnMenuItemSelected" : function(event, ui) {
					var st = this._state;
					var $menuItem = ui.item;

					// Selected item is not a predefined-layers-group
					if ("group" != $menuItem.attr('type')) {

						// Get layer unique identifier
						var $layerDiv = $menuItem
								.find(".mapviewer_layers_layer");
						var layerId = $layerDiv.attr('id');

						// Check if current layer id exists on TOC
						var currentLayers = st.oMap.fnGetTocLayersIds();
						if (currentLayers.indexOf(layerId) != -1) {
							return;
						}

						// Get the necessary info from layer
						var layerData = $layerDiv.data();
						var $layerComponents = $layerDiv
								.find("#layer-components")[0];

						if (layerData.layer_type === "wms"){

							// Connect to service, get more layer options and add WMS layer with its children
							if(!this._fnAddWmsLayer(layerId, layerData)){
								return;
							}

						}else{

							// Register layer in map and
							// move selected layer to first position of TOC
							st.oMap.fnRegisterLayer(layerId, layerData,
									$layerComponents, true);
						}

						// Save new layer in localStorage
						var layerInfo = {
							"id" : layerId,
							"data" : layerData,
							"components" : $layerComponents
						};
						st.oMap._fnSaveMapStatus("predefined_" + layerId,
								layerInfo);

						// Check on new layer on TOC
						st.oMap.fnGetLayerById(layerId).fnCheckLayer();
					}
				},

				/**
				 * Add a WMS layer with its children layers to map and TOC
				 */
				"_fnAddWmsLayer" : function(layerId, layerData){
					return this.__fnAddWmsLayer(layerId, layerData);
				},

				/**
				 * Add a WMS layer with its children layers to map and TOC
				 */
				"__fnAddWmsLayer" : function(layerId, layerData){

					this._fnGetDataFromServer(layerData);
					var layerOptions = this._fnCreateWmsLayerOptions(layerData);
					if (!layerOptions){
						return false;
					}

					var idLayerToInsert = layerId;
					layerOptions.layers = "";

					// Create pattern layer
					var oWmsLayer = {"id" : idLayerToInsert,
									 "options" : layerOptions
									};
					var aoChildLayers = [];
					var childrenStyles = [];

					// Create children layers
					for(i in layerOptions.aLayers){
						var oLayer = layerOptions.aLayers[i];
						var nameLayerAux = oLayer.name.concat("_");
						var style = "";
						var idChildLayer = GvNIX_Map_Leaflet.Util.getHashCode((oLayer.name).concat("_").concat(new Date().toString()));;
						var oChildLayerOptions = { "layer_type" : "wms_child",
									"title" : oLayer.title,
									"visible" : "true",
									"styles" : style,
									"id_on_server" : oLayer.name,
									"group" : idLayerToInsert,
									"context_path" : layerOptions.context_path,
									"enable_legend" : layerOptions.enable_legend
						}
						oLayerChild = {"id" : idChildLayer,
								 	   "options" : oChildLayerOptions
									  };
						aoChildLayers.push(oLayerChild);
					}
					GvNIX_Map_Leaflet.LAYERS.wms.fnRegisterWmsLayer(this._state.oMap, oWmsLayer,
							aoChildLayers, true);

					return true;
				},

				/**
				 * Get data from WMS server indicated in URL from layer div
				 */
				"_fnGetDataFromServer" : function(layerData) {
					return this.__fnGetDataFromServer(layerData);
				},

				/**
				 * Get data from WMS server indicated in URL from layer div
				 */
				"__fnGetDataFromServer" : function(layerData) {
					var st = this._state;
					var urlServ = layerData.url;
					var instance = this;
					if(urlServ){
						st.oUtil.startWaitMeAnimation("Loading children layers from server...");

						// Set crs for layer
						if(st.oMap){
							var mapCrs = st.oMap.fnGetMapSRIDcode();
						}

						var params = { url: urlServ, crs: mapCrs, format: layerData.format };
						jQuery.ajax({
							url : layerData.controller_url + "?findWmsCapabilities",
							async: false,
							data : params,
							cache : false,
							success : function(element) {
								st.oUtil.stopWaitMeAnimation();
								layerData.oWMSInfo = element;
								return layerData;
							},
							error : function(object) {
								console.log('Error obtaining layers from provided server');
								st.oUtil.stopWaitMeAnimation();
							}
						});

					}else{
						console.log('No URL provided!');
					}
				},

				/**
				 * Create WMS layer options and check CRS compatibility
				 * between sub-layers, service and server
				 */
				"_fnCreateWmsLayerOptions" : function(layerData){
					return this.__fnCreateWmsLayerOptions(layerData);
				},

				/**
				 * Create WMS layer options and check CRS compatibility
				 * between sub-layers, service and server
				 */
				"__fnCreateWmsLayerOptions" : function(layerData){

					// Check layers size (must do it this way because it is an associative array
					var layersSize = 0;
					for (index in layerData.oWMSInfo.layers){
						layersSize++;
					}

					// Check if layers are compatible with map
					if (layersSize == 0){
						this._fnSetErrorMessage(this._state.msg_layers_incompatible_map);
						return false;
					}else{

						if (layerData.oWMSInfo.childrenCount > layerData.oWMSInfo.layers.length){
							// Some children layers are incompatible
							this._fnSetErrorMessage(this._state.msg_children_incompatible);
						}

						// Set supported CRS
						var crsSelected = layerData.oWMSInfo.crsSelected;

						// Generate root layer options and put selected layers
						// into layers parameter
						var layerOptions = {
							"layer_type": layerData.layer_type,
							"span": (layerData.oWMSInfo.id.toString()).concat("_span"),
							"url": layerData.oWMSInfo.serviceUrl,
							"format": layerData.oWMSInfo.formatSelected,
							"transparent":"true",
							"version":layerData.oWMSInfo.version,
							"crs": crsSelected.join(),
							"opacity": "1.0",
							"allow_disable": true,
							"node_icon": ".whhg icon-layerorderdown",
							"title": layerData.oWMSInfo.serviceTitle,
							"aLayers": layerData.oWMSInfo.layers,
							"context_path": layerData.context_path
						};
						return layerOptions;
					}
				},

			    /**
				 * Set error message and show it in a dialog window.
				 */
				"_fnSetErrorMessage" : function(message) {
					this.__fnSetErrorMessage(message);
				},

				/**
				 * Set error message and show it in a dialog window.
				 */
				"__fnSetErrorMessage" : function(message) {
					window.alert(message);
				}

			});
})(jQuery, window, document);
