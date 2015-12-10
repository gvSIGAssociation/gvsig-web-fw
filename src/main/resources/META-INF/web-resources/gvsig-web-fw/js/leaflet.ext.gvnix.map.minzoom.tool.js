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

var GvNIX_Map_Min_Zoom;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.minzoom = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.minzoom) {
			alert("Warning: GvNIX_Map_Leaflet min zoom control must be initialised with the keyword 'new'");
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
					"minZoom" : null,
					"mapCenter" : null,
					"center" : false
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.minzoom.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					var st = this._state;
					var s = this.s;
					var map = this._state.oMap;

					// Set minZoom (user selected or oMap minumum)
					if (s.min_zoom === "map_defined"){
						st.minZoom = st.oMap._fnGetMinZoom();
					}else{
						st.minZoom = s.min_zoom;
					}

					st.center = s.center;

					if(st.center){
						if (s.map_center){
							st.mapCenter = s.map_center.split(",");
						}else{
							st.mapCenter = map.fnGetMapObject().getCenter();
						}

					}


				},

				/**
				 * To do when click this tool. Set zoom to minimum supported by the map
				 *
				 * @param event click event on this tool
				 *
				 */
				"_fnClick" : function(event) {
					var st = this._state;
					if(st.mapCenter){
						st.oMap.fnGetMapObject().setView(st.mapCenter, st.minZoom);
					}else{
						st.oMap.fnGetMapObject().setZoom(st.minZoom);
					}
				}

			});

})(jQuery, window, document);