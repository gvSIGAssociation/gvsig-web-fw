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
						console.log("Please activate a layer");
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
				 * 			Supported values are 'URL', JSON or'STRING'
				 */
				"_fnAddMarkerOnMap" : function(info, type) {
					var s = this.s
					var st = this._state;
					var lat = st.latlng.lat;
					var lng = st.latlng.lng;
					var html = this._fnConvertInfoToHtml(info, type);

					if(info == "" || info == null){
						html = this._fnConvertInfoToHtml(s.empty_message, "STRING");
					}
					var markerId = (st.sId + "_marker")

					// Remove previous graphics
					if (st.oMarkerLayer) {
						st.oMap._fnRemoveGraphics(markerId);
					}

					// parse pop-up options
					if (s.popup_options) {
						var opts = GvNIX_Map_Leaflet.Util.parseJSONOption(s.popup_options);
					}

					// Create new graphic and register
					st.oMap._fnAddGraphic(markerId, lat, lng, html, s.marker_color, opts, true,
							true, "Remove");
					st.oMarkerLayer = st.oMap.fnGetMarkerById(markerId);
					var popup = st.oMarkerLayer.getPopup();

					st.oMarkerLayer.id = markerId;
				},

				/**
				 * Function called when layer is activated or deactivated
				 * (Custom implementation for this tool)
				 *
				 * Removes current Info-By-Point markers from map
				 */
				"_fnActiveLayerChanged" : function(){
 					var st = this._state;
					if(st.oMarkerLayer){
						st.oMap._fnRemoveGraphics(st.oMarkerLayer.id);
					}
				},

				/**
				 * Returns a div element to display any information
				 *
				 * @param info
				 *            (String) Information to convert. Can be HTML text
				 *            or an url.
				 * @param type
				 *            (String) Type which information is given.
				 *            Supported values are 'URL', 'JSON' or 'STRING'
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
					}else{ // JSON
						html += "<div>";
						html += GvNIX_Map_Leaflet.Util.JSONToHtml(info);
						html += "</div>";
					}
					html += "</div>";
					return html;
				}
			});

})(jQuery, window, document);