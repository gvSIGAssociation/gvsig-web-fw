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

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.help = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.help) {
			alert("Warning: GvNIX_Map_Leaflet help control must be initialised with the keyword 'new'");
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
					"$divElement" : null
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.help.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,
		{
			"_fnConstructor" : function() {
				var st = this._state;
				this.__simple_selectable_fnConstructor(false);
				st.$divElement = jQuery("#" + st.sId + "_content");
			},

			"_fnDoSelect" : function() {
				if (!this.__fnDoSelect()) {
					return false;
				}
				this._fnOpenDialog();
				return true;
			},

			"_fnDoDeselect" : function() {
				var st = this._state;
				if (!this.__fnDoDeselect()) {
					return false;
				}
				st.$divElement.dialog("close");
				return true;
			},

			"_fnOpenDialog" : function() {
				var st = this._state;
				var title = st.$divElement.attr("data-title");
				st.$divElement.dialog({
					title : title,
					appendTo : jQuery("#map" + st.oMap.s.id),
					closeOnEscape : true,
					resizable : false
				});
			},
		});
})(jQuery, window, document);