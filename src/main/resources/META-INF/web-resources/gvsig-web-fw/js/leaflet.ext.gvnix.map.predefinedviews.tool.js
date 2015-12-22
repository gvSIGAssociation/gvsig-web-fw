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

/* Global scope for GvNIX_Map_Predefined_Views_Tool */
var GvNIX_Map_Predefined_Views_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.predefined_views = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.predefined_views) {
			alert("Warning: GvNIX_Map_Leaflet predefined_views control must be initialised with the keyword 'new'");
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
					"blurTimer" : null,
			    	"blurTimeAbandoned" : 1000
				});

		this.predefined_views_fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_views.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu.prototype, {
				"predefined_views_fnConstructor" : function() {
					this._fnConstructor();
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
						var layerIds = $menuItem.data().layers.replace(" ", "").split(",");
						for (id in layerIds) {

							// If layer is in TOC, select it
							if(tocLayersIds.indexOf(layerIds[id]) > -1){
								var layer = st.oMap.fnGetLayerById(layerIds[id]);
								self._fnSelectLayer(layer, layerIds[id]);
							}
						}

						// Check if there are declared layers inside the component and add them
						aLayers = jQuery(".mapviewer_layers_layer", $menuItem);
						aLayers.each(function(index) {
							var layerId = jQuery(this).attr("id");
							st.$layerComponents = jQuery(this).find("#layer-components")[0];

							// If layer isn't in TOC, add it
							if (tocLayersIds.indexOf(layerId) == -1){

								// Get the necessary info from layer
								var layerData = jQuery(this).data();

								if (layerData.layer_type === "wms"){

									// Connect to service, get more layer options and add WMS layer with its children
									self._fnAddWmsLayer(layerId, layerData);

								}else{

									// Register layer in map and
									// move selected layer to first position of TOC
									st.oMap.fnRegisterLayer(layerId, layerData,
											st.$layerComponents, true);

									// Save layer in localStorage and check it
									self._fnModifyAndSaveLayer(layerId, true, layerData, st.$layerComponents);
								}
							}else{

								// If layer is in TOC, select it
								self._fnSelectLayer(st.oMap.fnGetLayerById(layerId));
							}
						});

					}else{
						console.log("Predefined-view:group need a layer attribute defined!");
					}
				},

				/**
				 * Activate layer's checkbox with the provided id
				 */
				"_fnSelectLayer" : function(layer) {
					this.__fnSelectLayer(layer);
				},

				/**
				 * Activate layer's checkbox with the provided id
				 */
				"__fnSelectLayer" : function(layer) {
					layer.fnCheckLayer();
				},

				/**
				 * Deselect layer's checkbox with the provided id
				 */
				"_fnDeselectLayer" : function(layerId) {
					this.__fnDeselectLayer(layerId);
				},

				/**
				 * Deselect layer's checkbox with the provided id
				 */
				"__fnDeselectLayer" : function(layerId) {
					this._state.oMap.fnGetLayerById(layerId).fnUncheckLayer();
				},

				/**
				 * Save layer in localStorage and check it
				 */
				"__fnModifyAndSaveLayer" : function(layerId, existInToc, layerData, $layerComponents){
					var st = this._state;

					if (existInToc){

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
						st.oMap.fnGetLayerById(layerId).fnCheckLayer();
					}
				}

			});
})(jQuery, window, document);
