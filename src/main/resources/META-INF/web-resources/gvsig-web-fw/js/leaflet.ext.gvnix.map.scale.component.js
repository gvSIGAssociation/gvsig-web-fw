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

/* Global scope for GvNIX_Map_Scale_Component */
var GvNIX_Map_Scale_Component;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.scale =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.scale) {
			alert("Warning: GvNIX_Map_Leaflet scale control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.Base.default_options, {
			// No additional settings
		});

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.Base._state, {
			"sId" : sId,
			"oMap" : oMap,
			"oScaleComponent" : null // L.Scale instance
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.scale.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.Base._prototype,{
		"_fnConstructor": function () {
			this.__fnControlScaleConstructor();
		},

		"__fnControlScaleConstructor": function () {
			this.__fnConstructor();
			var st = this._state;
			var map = this._state.oMap;
			var s = this.s;
			// Generating new scale component
			st.oScaleComponent = new L.control.scale().addTo(map.fnGetMapObject());
		},

	});

})(jQuery, window, document);
