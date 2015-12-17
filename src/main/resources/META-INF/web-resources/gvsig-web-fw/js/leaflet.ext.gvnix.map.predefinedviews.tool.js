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
var GvNIX_Map_Predefined_Views_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.predefined_views = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.predefined_views) {
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
					"tocTree" : null
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_views.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					this._fnLoadMenu();
					this._state.tocTree = this._state.oMap.fnGetTocTree();
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
				 * Function that creates a menu with predefined views list
				 * elements
				 */
				"_fnLoadMenu" : function() {
					this.__fnLoadMenu();
				},

				/**
				 * Initialize a jQuery UI menu with predefined views lists
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
					$rootElement.appendTo(jQuery("#map" + st.oMap.fnGetMapContainerId()));

					// Save menu object
					this._state.$menu = menu;
				},

				/**
				 * Shows or hides the predefined views menu
				 */
				"_fnToggleMenu" : function() {
					this.__fnToggleMenu();
				},

				/**
				 * Shows or hides the predefined views menu on top of this tool
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
				 * Function for selecting checkbox of only selected group's layers and make them
				 * visible
				 */
				"__fnOnMenuItemSelected" : function(event, ui) {
					var st = this._state;
					var $menuItem = ui.item;
					var self = this;

					if ($menuItem.data() && $menuItem.data().layers){

						// Get all TOC layers and deselect them
						var tocLayersIds = st.oMap.fnGetTocLayersIds();
						for (id in tocLayersIds){
							self._fnDeselectLayer(tocLayersIds[id]);
						}

						// Get selected group layers and select them
						var layerIds = $menuItem.data().layers.split(",");
						for (id in layerIds) {

							// If layer is in TOC, select it
							if(tocLayersIds.indexOf(layerIds[id]) > -1){
								var layer = st.oMap.fnGetLayerById(layerIds[id]);
								self._fnSelectLayer(layer, layerIds[id]);
							}
						}
					}else{
						console.log("Predefined-view:group need a layer attribute defined!");
					}
				},

				/**
				 * Activate layer's checkbox with the provided id
				 */
				"_fnSelectLayer" : function(layer, id) {
					this.__fnSelectLayer(layer, id);
				},

				/**
				 * Activate layer's checkbox with the provided id
				 */
				"__fnSelectLayer" : function(layer, id) {
					layer.fnShow(true);
					var node = this._state.tocTree.getNodeByKey(id);
					node.setSelected(true);
				},

				/**
				 * Deselect layer's checkbox with the provided id
				 */
				"_fnDeselectLayer" : function(id) {
					this.__fnDeselectLayer(id);
				},

				/**
				 * Deselect layer's checkbox with the provided id
				 */
				"__fnDeselectLayer" : function(id) {
					this._state.oMap.fnGetLayerById(id).fnHide(true);
					var node = this._state.tocTree.getNodeByKey(id);
					node.setSelected(false);
				}

			});
})(jQuery, window, document);
