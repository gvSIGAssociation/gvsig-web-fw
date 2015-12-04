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

/* Global scope for GvNIX_Map_Zoom_Select_All_Tool */
var GvNIX_Map_Zoom_Select_All_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.zoom_select_all =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.zoom_select_all) {
			alert("Warning: GvNIX_Map_Leaflet zoom select all control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.simple_selectable.default_options, {
			// No additional settings
		});

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.simple_selectable._state, {
			"sId" : sId,
			"oMap" : oMap
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.zoom_select_all.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
		},

		"_fnDoSelect" : function() {
			if (!this.__fnDoSelect()) {
				return false;
			}
			// get toc tree for know the selected layers
			var $tree = this._state.oMap.fnGetTocTree();
			var nodesSelected = $tree.getSelectedNodes();
			var bounds = null;
			for (i = 0; i < nodesSelected.length; i++){
				var layer = this._state.oMap.fnGetLayerById(nodesSelected[i].key);
				//if node is a layer with geometries and its parent is selected
				if(isDefined(layer.fnIsFieldLayer) && layer.fnIsFieldLayer()){
					//get all geometry layers
					leafletLayers = layer._state.oLayer.getLayers();
					for (j = 0; j < leafletLayers.length; j++){
						var layerGeometry = leafletLayers[j];
						//get and set/join bounds
						if(bounds == null){
							bounds = layerGeometry.getBounds();
						}else{
							bounds.extend(layerGeometry.getBounds());
						}
					}
				}
			}
			if(bounds != null && bounds.isValid()){
				var mapToFit = this._state.oMap.fnGetMapObject()
				mapToFit.fitBounds(bounds);
			}
			this._fnDoDeselect();
			return false;
		},

		"_fnDoDeselect": function() {
			if (!this.__fnDoDeselect()) {
				return false;
			}
			return true;
		}

	});

})(jQuery, window, document);
