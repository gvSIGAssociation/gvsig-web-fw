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

/* Global scope for GvNIX_Map_Draw_Tool */
var GvNIX_Map_Draw_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.draw =  function (oMap,sId,options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.draw) {
			alert("Warning: GvNIX_Map_Leaflet draw control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.simple_selectable.default_options, {
		// No additional settings
		});

		this.s = jQuery.extend({}, this._default_options, options);

		// Get map options from instance
		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.simple_selectable._state, {
			"sId" : sId,
			"oMap" : oMap,
			"oDrawingTool" : null, // L.Control.Draw instance
			"oNewTool" : null,
			"oEditableLayer" : null

		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.draw.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var s = this.s;
			var st = this._state;
			var map = this._state.oMap;
			if (!s.target_layer_id) {
				this.debug("ERROR: '" + s.target_layer_id + "': layer not created");
				return;
			}

			var oDrawingTool = null;

			// New drawable layer
			var oEditableLayer = map.fnGetLayerById(s.target_layer_id);

			if (!oEditableLayer) {
				this.debug("ERROR: '" + oEditableLayer + "': layer doesn't exist");
				return;
			}

			// Initialize Draw Control Instance
			if (!oDrawingTool){
				oDrawingTool = new L.Control.Draw({
	    			draw: false,
	    			edit: {
	    		        featureGroup: oEditableLayer.fnGetLeafletDataGroup
	    		    }
				});
			}
			var oNewTool = null;

		    // Initialize the suitable drawing tool
			if (!s.mode) {
				this.debug("ERROR: mode doesn't exist");
				return;
			}else{
				// Set true repeatMode to remains enabled draw tool after drawing a shape
				oDrawingTool.options.repeatMode=true;
				switch(s.mode){
				case "point":
					oNewTool = new L.Draw.Marker(map.fnGetMapObject(), oDrawingTool.options);
					break;
				case "line":
					oNewTool = new L.Draw.Polyline(map.fnGetMapObject(), oDrawingTool.options);
					break;
				case "polygon":
					oNewTool = new L.Draw.Polygon(map.fnGetMapObject(), oDrawingTool.options);
					break;
				case "multiline":
					oNewTool = new L.Draw.Polyline(map.fnGetMapObject(), oDrawingTool.options);
					// Set element type
					oNewTool.type = "multiline";
					break;
				case "clean":
					// Nothing to do
					break;
				default:
					this.debug("ERROR: '" + s.mode + "': mode doesn't exist");
					return;
				}
			}

			st.oDrawingTool = oDrawingTool;
			st.oNewTool = oNewTool;
			st.oEditableLayer = oEditableLayer;

		},

		// To do when drawing tool is selected
		"_fnDoSelect" : function() {
			if (!this.__fnDoSelect()) {
				return false;
			}
			var st = this._state;
			// Check if current tool is valid
			if(!st.oNewTool){
				this.debug("ERROR: '" + oNewTool + "': mode doesn't exist");
				return;
			}
			if (this.s.mode == "clean") {
				// Clean the layer
				this._fnOnDelete();
				return;
			} else {
				// Give this context to event functions
				st._proxy_onCreate =jQuery.proxy(this._fnOnCreate, this);
				st._proxy_onClick =jQuery.proxy(this._fnOnclick, this);
				st._proxy_onEdit =jQuery.proxy(this._fnOnEdit, this);
				st._proxy_onDelete =jQuery.proxy(this._fnOnDelete, this);
				st.oMap.fnGetMapObject().on("draw:created", st._proxy_onCreate);
				st.oMap.fnGetMapObject().on("click", st._proxy_onClick);
				st.oMap.fnGetMapObject().on("draw:edited", st._proxy_onEdit);
				st.oMap.fnGetMapObject().on("draw:deleted", st._proxy_onDelete);
				// Enable the selected tool
				st.oNewTool.enable();
			}
			return true;
		},

		"_fnDoDeselect": function() {
			if (!this.__fnDoDeselect()) {
				return false;
			}
			var st = this._state;
			if(!st.oNewTool){
				// TODO show warning (logger)
				return;
			}
			// Disable the selected tool
			st.oNewTool.disable();
			st.oMap.fnGetMapObject().off("draw:created",st._proxy_onCreate);
			st.oMap.fnGetMapObject().off("click", st._proxy_onClick);
			st.oMap.fnGetMapObject().off("draw:edited", st._proxy_onEdit);
			st.oMap.fnGetMapObject().off("draw:deleted", st._proxy_onDelete);
			return true;
		},

		// Start drawing tool
		"_fnOnCreate": function(event) {
			if(event.layerType.match(/multi.*/)) {
				this._state.oEditableLayer.fnAddGeometry(
						event.layer);
			}else{
				this._state.oEditableLayer.fnSetGeometry(
					event.layer, event.layerType);
			}
		},

		"_fnOnclick": function(event){
			this._state.oEditableLayer.fnSetGeometry(
					event.layer, event.layerType);
		},

		"_fnOnEdit": function(event){
			this._state.oEditableLayer.fnSetGeometry(
					event.layer, event.layerType);
		},

		// Clean drawn layer
		"_fnOnDelete" : function(){
			this._state.oEditableLayer.fnClean();
		}
	});

})(jQuery, window, document);
