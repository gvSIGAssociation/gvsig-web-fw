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
var GvNIX_Map_Clean_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.clean =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.clean) {
			alert("Warning: GvNIX_Map_Leaflet clean control must be initialised with the keyword 'new'");
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
			"oMap" : oMap,
			"layerId": null, // The identifier of the layer that is affected by clean tool
			"msgDelete": null, // Message to confirm if you want delete all the geometries
			"layerClean": null // Layer that is affected by clean tool
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.clean.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var s = this.s;
			var st = this._state;
			st.msgDelete = s.messagedelete;
			st.layerId = s.layerid;
			st.layerClean = st.oMap.fnGetLayerById(st.layerId);
		},

		"_fnDoSelect" : function() {
			var st = this._state;
			if (!this.__fnDoSelect()) {
				return false;
			}
			if (!confirm(st.msgDelete)) {
				this._fnDoDeselect();
        		return false;
        	}
			st.layerClean.fnClean();
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
