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

/* Global scope for GvNIX_Map_Thematic_Layers_Tool */
var GvNIX_Map_Thematic_Layers_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.thematic_layers = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.thematic_layers) {
			alert("Warning: GvNIX_Map_Leaflet thematic_layers control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu.default_options, {
				// No additional settings
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu._state, {
					"sId" : sId,
					"oMap" : oMap,
					"$menu" : null,
					"oUtil" : null,
					"msg_layers_incompatible_map" : null,
					"msg_children_incompatible" : null,
					"msg_loading_children" : null,
					"$layerComponents" : null,
					"blurTimer" : null,
			    	"blurTimeAbandoned" : 1000
				});

		this.thematic_layers_fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.thematic_layers.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu.prototype,	{

		"thematic_layers_fnConstructor" : function() {
			this._fnConstructor();
		},

		/**
		 * Function to register the selected theme's layers in map and
		 * make them visible
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
		 * Save layer in localStorage and check it
		 */
		"__fnModifyAndSaveLayer" : function(layerId, existsInToc, layerData, $layerComponents){
			var st = this._state;

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

	});
})(jQuery, window, document);