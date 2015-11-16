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

var GvNIX_Map_Info_By_Point;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.info_by_point = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.info_by_point) {
			alert("Warning: GvNIX_Map_Leaflet info by point control must be initialised with the keyword 'new'");
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
					"oMarkerLayer" : null
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.info_by_point.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__simple_selectable_fnConstructor(false);
					var st = this._state;
					var map = this._state.oMap;
				},

				"_fnDoSelect" : function() {
					var st = this._state;
					if (!this.__fnDoSelect()) {
						return false;
					}
					var mapDiv = st.oMap._data.class;

					// Enable click event on map
					st.oMap.fnGetMapObject().on("click",
							jQuery.proxy(this._fnOnClick, this));
					return true;
				},

				"_fnDoDeselect" : function() {
					if (!this.__fnDoDeselect()) {
						return false;
					}
					var mapDiv = this._state.oMap._data.class;

					// Disable click event on map
					this._state.oMap.fnGetMapObject().off("click");
					return true;
				},

				/**
				 * To do when click on map with this tool active. Add a marker
				 * and show a pop-up with requested info from layer if any layer
				 * is active.
				 * 
				 * @param event
				 *            click event of Leaflet map
				 */
				"_fnOnClick" : function(event) {
					var st = this._state;
					// Click coordinates
					st.latlng = event.latlng;
					// Getting active layer
					var layer = st.oMap.fnGetLayerById(st.oMap
							.fnGetActiveLayer());
					
					if (layer) {
						layer.fnGetFeatureInfo(event.containerPoint, jQuery
								.proxy(this._fnAddMarkerOnMap, this));
					} else {
						this._fnAddMarkerOnMap("Please activate a layer", "STRING");
					}
				},

				/**
				 * Adds a marker on map on the position where user clicked. It
				 * also will show a pop-up with information received from active
				 * layer
				 * 
				 * @param info 
				 * 			(String) Information to display on pop-up	
				 * @param type
				 * 			(String) Type which information is given.
				 * 			Supported values are 'URL' and 'STRING'
				 */
				"_fnAddMarkerOnMap" : function(info, type) {
					var st = this._state;
					var lat = st.latlng.lat;
					var lng = st.latlng.lng;
					var html = this._fnConvertInfoToHtml(info, type);
					var id = (st.sId + "_marker")

					// Remove previous graphics
					if (st.oMarkerLayer) {
						st.oMap._fnRemoveGraphics(id);
					}
					// Create new graphic and register
					st.oMap._fnAddGraphic(id, lat, lng, html, "red", true,
							true, null);
					st.oMarkerLayer = st.oMap.fnGetMarkerById(id);
				},

				/**
				 * Returns a div element to display any information
				 * 
				 * @param info
				 *            (String) Information to convert. Can be HTML text
				 *            or an url.
				 * @param type
				 *            (String) Type which information is given.
				 *            Supported values are 'URL' and 'STRING'
				 */
				"_fnConvertInfoToHtml" : function(info, type) {
					var st = this._state;
					var html = "<div>";
					if (type == "URL") {
						html += "<iframe src='";
						html += info;
						html += "'/> </BR>";
					} else if (type == "STRING") { // html
						html += "<div>";
						html += info;
						html += "</div> </BR>";
					}
					html += "</div>";
					return html;
				}
			});

})(jQuery, window, document);