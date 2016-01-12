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

/*
 * This is a base class for options menu tools which add layers or layer groups to the map
 */

/* Global scope for GvNIX_Map_Selectable_Options_Menu */
var GvNIX_Map_Selectable_Options_Menu;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu) {
			alert("Warning: GvNIX_Map_Leaflet selectable_options_menu control must be initialised with the keyword 'new'");
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
					"msg_children_incompatible" : null,
					"msg_loading_children" : null,
					"$layerComponents" : null,
					"blurTimer" : null,
			    	"blurTimeAbandoned" : 1000,
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,	{

				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					this._fnLoadMenu();
					this._state.oUtil = GvNIX_Map_Leaflet.Util;

					// Load alert messages
					this._state.msg_layers_incompatible_map = this.s.msg_layers_incompatible_map;
					this._state.msg_children_incompatible = this.s.msg_children_incompatible;
					this._state.msg_loading_children = this.s.msg_loading_children;
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
				 * Function that creates a menu with list elements
				 */
				"_fnLoadMenu" : function() {
					this.__fnLoadMenu();
				},

				/**
				 * Initialize a jQuery UI menu with list elements
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
						},
						"focus" : function(event, ui) {
							clearTimeout(st.blurTimer);
						},
						"blur" : function(event, ui) {
							st.blurTimer = setTimeout(function() {
					            st.$menu.toggle();
					        }, st.blurTimeAbandoned);
						}
					};

					// Load menu with options
					var menu = $rootElement.menu(menuOptions);

					// Append root element to map div
					$rootElement
							.appendTo(jQuery("#map" + st.oMap.s.id));

					// Save menu object
					this._state.$menu = menu;
				},

				/**
				 * Shows or hides the menu
				 */
				"_fnToggleMenu" : function() {
					this.__fnToggleMenu();
				},

				/**
				 * Shows or hides the menu on top of this tool icon
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
				 * Function that will be called when a menu item is selected
				 */
				"__fnOnMenuItemSelected" : function(event, ui) {
					var st = this._state;
					var $menuItem = ui.item;
					var self = this;

					// Get all layers inside this theme
					aLayers = jQuery(".mapviewer_layers_layer", $menuItem);

					// Get last WMS layer
					var lastWmsLayer = this._fnGetLastWmsLayer(aLayers);

					aLayers.each(function(index) {
						var layerId = jQuery(this).attr("id");
						st.$layerComponents = jQuery(this).find("#layer-components")[0];

						// Add layers to TOC if don't exist
						var tocLayersIds = st.oMap.fnGetTocLayersIds();
						if (tocLayersIds.indexOf(layerId) == -1){

							// Get the necessary info from layer
							var layerData = jQuery(this).data();

							if (layerData.layer_type === "wms"){

								// Check if this is the last WMS layer
								var stopWaitAnimation = false;
								if (this === lastWmsLayer){
									stopWaitAnimation = true;
								}

								// Connect to service, get more layer options and add WMS layer with its children
								self._fnAddWmsLayer(layerId, layerData, st.$layerComponents, stopWaitAnimation);

							}else{

								// Register layer in map and
								// move selected layer to first position of TOC
								st.oMap.fnRegisterLayer(layerId, layerData,
										st.$layerComponents, true);

								// Save layer in localStorage and uncheck it
								self._fnModifyAndSaveLayer(layerId, false, layerData, st.$layerComponents);
							}
						}else{

							// If already in TOC activate layer checkbox
							self._fnModifyAndSaveLayer(layerId, true);
						}
					});
				},

				/**
				 * Add a WMS layer with its children layers to map and TOC
				 */
				"_fnAddWmsLayer" : function(layerId, layerData, layerComponents, stopWaitAnimation){
					return this.__fnAddWmsLayer(layerId, layerData, layerComponents, stopWaitAnimation);
				},

				/**
				 * Add a WMS layer with its children layers to map and TOC
				 */
				"__fnAddWmsLayer" : function(layerId, layerData, layerComponents, stopWaitAnimation){

					// Get data from WMS server indicated in URL from layer div
					var st = this._state;
					var urlServ = layerData.url;
					var instance = this;
					if(urlServ){
						st.oUtil.startWaitMeAnimation(st.msg_loading_children);

						// Set crs for layer
						if(st.oMap){
							var mapCrs = st.oMap.fnGetMapSRIDcode();
						}

						var params = { url: urlServ, crs: mapCrs, format: layerData.format };
						jQuery.ajax({
							url : layerData.controller_url + "?findWmsCapabilities",
							data : params,
							cache : false,
							success : function(element) {
								layerData.oWMSInfo = element;

								// Create layer options
								var layerOptions = instance._fnCreateWmsLayerOptions(layerData);
								if (!layerOptions){
									instance._state.oUtil.stopWaitMeAnimation();
									return;
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
												"enable_legend" : layerOptions.enable_legend,
												"msg_legend_undefined" : layerOptions.msg_legend_undefined,
												"msg_metadata_undefined" : layerOptions.msg_metadata_undefined
									}
									oLayerChild = {"id" : idChildLayer,
											 	   "options" : oChildLayerOptions
												  };
									aoChildLayers.push(oLayerChild);
								}
								GvNIX_Map_Leaflet.LAYERS.wms.fnRegisterWmsLayer(st.oMap, oWmsLayer,
										aoChildLayers, layerComponents, true);

								// Save layer in localStorage and uncheck it
								instance._fnModifyAndSaveLayer(layerId, false, layerData, st.$layerComponents);

								// Stop animation if it is last layer
								if (stopWaitAnimation){
									st.oUtil.stopWaitMeAnimation();
								}
							},
							error : function(object) {
								console.log('Error obtaining layers from provided server');
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

					// Get title
					var title = undefined;
					if(!layerData.title){
						title = layerData.title;
					}else{
						title = layerData.oWMSInfo.serviceTitle;
					}

					// Check if layers are compatible with map
					if (layersSize == 0){
						this._state.oUtil.stopWaitMeAnimation();
						this._fnSetErrorMessage(this._state.msg_layers_incompatible_map, title);
						return false;
					}else{

						if (layerData.oWMSInfo.childrenCount > layersSize){

							// Some children layers are incompatible
							this._fnSetErrorMessage(this._state.msg_children_incompatible, title);
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
							"context_path": layerData.context_path,
							"enable_legend" : layerData.enable_legend,
							"msg_legend_undefined" : layerData.msg_legend_undefined,
							"msg_metadata_undefined" : layerData.msg_metadata_undefined
						};
						return layerOptions;
					}
				},

				/**
				 * Save layer in localStorage and check it
				 */
				"_fnModifyAndSaveLayer" : function(layerId, existsInToc, layerData, $layerComponents){
					this.__fnModifyAndSaveLayer(layerId, existsInToc, layerData, $layerComponents);
				},

				/**
				 * Save layer in localStorage and check it
				 */
				"__fnModifyAndSaveLayer" : function(layerId, existsInToc, layerData, $layerComponents){
					var st = this._state;

					if (existsInToc){

						// Modify check of new layer on TOC
						st.oMap.fnGetLayerById(layerId).fnCheckLayer();
					}else{

						// Save new layer in localStorage
						var layerInfo = {
							"id" : layerId,
							"data" : layerData,
							"components" : $layerComponents
						};
						st.oMap._fnSaveMapStatus("predefined_" + layerId,
								layerInfo);

						// If layer can be disabled, uncheck it
						st.oMap.fnGetLayerById(layerId).fnUncheckLayer();
					}
				},

				/**
				 * Get last WMS layer from an array of layers
				 * Useful for stopping wait me animation
				 */
				"_fnGetLastWmsLayer" : function(layers){
					return this.__fnGetLastWmsLayer(layers);
				},

				/**
				 * Get last WMS layer from an array of layers
				 * Useful for stopping wait me animation
				 */
				"__fnGetLastWmsLayer" : function(layers){
					var wmsLayers = [];
					layers.each(function(index) {
						var layerData = jQuery(this).data();
						if(layerData && layerData.layer_type === "wms"){
							wmsLayers.push(this);
						}
					});
					return wmsLayers[wmsLayers.length-1];
				},

				/**
				 * Set error message and show it in a dialog window.
				 */
				"_fnSetErrorMessage" : function(message, serviceTitle) {
					this.__fnSetErrorMessage(message, serviceTitle);
				},

				/**
				 * Set error message and show it in a dialog window.
				 */
				"__fnSetErrorMessage" : function(message, serviceTitle) {
					window.alert(serviceTitle + " " + message);
				}
			});
})(jQuery, window, document);