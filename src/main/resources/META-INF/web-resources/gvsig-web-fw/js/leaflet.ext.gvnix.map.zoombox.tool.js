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

var GvNIX_Map_Zoom_Box;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.zoombox = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.zoombox) {
			alert("Warning: GvNIX_Map_Leaflet zoom box control must be initialised with the keyword 'new'");
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
					"oZoomBoxTool" : null // L.ZoomBoxTool instance
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.zoombox.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					var st = this._state;
					var map = this._state.oMap;
					// Generating new zoomboxTool
					st.oZoomBoxTool = new L.control.zoomBox(map
							.fnGetMapObject());
					st.oZoomBoxTool.onAdd(map._data.map, st.othis);
				},

				"_fnDoSelect" : function() {
					if (!this.__fnDoSelect()) {
						return false;
					}
					var mapDiv = this._state.oMap._data.class;
					this._state.oZoomBoxTool.activate();
					return true;
				},

				"_fnDoDeselect" : function() {
					if (!this.__fnDoDeselect()) {
						return false;
					}
					var mapDiv = this._state.oMap._data.class;
					this._state.oZoomBoxTool.deactivate();
					return true;
				}
			});

})(jQuery, window, document);