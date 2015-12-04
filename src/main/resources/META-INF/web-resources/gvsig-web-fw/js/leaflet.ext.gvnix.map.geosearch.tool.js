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

/* Global scope for GvNIX_Map_GeoSearch_Tool */
var GvNIX_Map_GeoSearch_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.geosearch =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.geosearch) {
			alert("Warning: GvNIX_Map_Leaflet geosearch control must be initialised with the keyword 'new'");
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
			"providerSelected" : "google",
			"showMarker": true,
			"retainZoomLevel" : true,
			"searchLabel": "search for address ...",
			"notFoundMessage": "Sorry, that address could not be found.",
			"oGeoSearchComponent" : null, // L.GeoSearch instance
			"oProvider" : null // L.GeoSearchProvider instance
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.geosearch.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var s = this.s;
			var st = this._state;
			st.providerSelected = s.provider_selected;
			st.retainZoomLevel = s.retain_zoom_level;
			st.showMarker = s.show_marker;
			st.searchLabel = s.search_label;
			st.notFoundMessage = s.not_found_message;
		},

		"_fnDoSelect" : function() {
			var st = this._state;
			if (!this.__fnDoSelect()) {
				return false;
			}

			if(st.oGeoSearchComponent){
				jQuery(".leaflet-control-geosearch").show();
			}else{
				switch (st.providerSelected)
				{
					case "esri":
						st.oProvider = new L.GeoSearch.Provider.Esri();
					    break;
					case "google":
						st.oProvider = new L.GeoSearch.Provider.Google();
					    break;
					case "bing":
						st.oProvider = new L.GeoSearch.Provider.Bing();
					    break;
					case "nokia":
						st.oProvider = new L.GeoSearch.Provider.Nokia();
					    break;
					case "openstreetmap":
						st.oProvider = new L.GeoSearch.Provider.OpenStreetMap();
					    break;
					default:
						st.oProvider = new L.GeoSearch.Provider.Google();
				}
				// Generating new GeoSearch component
				st.oGeoSearchComponent = new L.Control.GeoSearch({
				    provider: st.oProvider,
				    showMarker: st.showMarker,
				    retainZoomLevel: st.retainZoomLevel,
				    searchLabel: st.searchLabel,
			        notFoundMessage: st.notFoundMessage,
				}).addTo(st.oMap.fnGetMapObject());
			}

			return true;
		},

		"_fnDoDeselect": function() {
			if (!this.__fnDoDeselect()) {
				return false;
			}
			jQuery(".leaflet-control-geosearch").hide();
			return true;
		}
	});

})(jQuery, window, document);
