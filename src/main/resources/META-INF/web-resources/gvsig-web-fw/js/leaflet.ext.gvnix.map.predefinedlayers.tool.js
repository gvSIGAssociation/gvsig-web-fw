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
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_layers.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					this._fnLoadMenu();
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
						my : "left bottom",
						at : "left top-5px",
						of : jQuery("#" + st.sId),
						collision : "flip fit"
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

						// Register layer in map
						st.oMap.fnRegisterLayer(layerId, layerData,
								$layerComponents);

						// Move selected layer to first position of TOC
						st.oMap.fnMoveLayer(layerId, st.oMap
								.fnGetTocLayersIds()[0], null, true);

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

			});
})(jQuery, window, document);
