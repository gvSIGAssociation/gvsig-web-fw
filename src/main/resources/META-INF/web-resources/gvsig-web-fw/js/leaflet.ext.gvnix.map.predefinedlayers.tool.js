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

/* Global scope for GvNIX_Map_Predefined_Layers_Tool */
var GvNIX_Map_Predefined_Layers_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.predefined_layers = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.predefined_layers) {
			alert("Warning: GvNIX_Map_Leaflet predefined_layers control must be initialised with the keyword 'new'");
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

		this.predefined_layers_fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_layers.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.selectable_options_menu.prototype, {
				"predefined_layers_fnConstructor" : function() {
					this._fnConstructor();
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
						st.$layerComponents = $layerDiv
								.find("#layer-components")[0];

						if (layerData.layer_type === "wms"){

							// Connect to service, get more layer options and add WMS layer with its children
							this._fnAddWmsLayer(layerId, layerData, st.$layerComponents, true);

						}else{

							// Register layer in map and
							// move selected layer to first position of TOC
							st.oMap.fnRegisterLayer(layerId, layerData,
									st.$layerComponents, true);

							// Save layer in localStorage and check it
							this._fnModifyAndSaveLayer(layerId, false, layerData, st.$layerComponents);
						}

						//adding class layerInToc in li element
						var oldClasses = $menuItem.attr('class');
						var newClasses = oldClasses.concat(" ").concat("layerInToc");
						var $liElement = jQuery("#" + $menuItem.attr('id'));
						$liElement.addClass(newClasses);
					}
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
				},

				/**
				 * Set error message and show it in a dialog window.
				 */
				"__fnSetErrorMessage" : function(message, serviceTitle) {
					window.alert(message);
				}

			});
})(jQuery, window, document);
