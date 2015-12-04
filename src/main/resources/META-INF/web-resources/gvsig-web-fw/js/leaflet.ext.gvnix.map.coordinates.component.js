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

/* Global scope for GvNIX_Map_Coordinates_Component */
var GvNIX_Map_Coordinates_Component;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.coordinates =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.coordinates) {
			alert("Warning: GvNIX_Map_Leaflet coordinates control must be initialised with the keyword 'new'");
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
			"oCoordinatesComponent" : null, // L.Coordinates instance
			"position" : "bottomleft",
			"decimals" : 4,
			"labelTemplateLat" : "lat: {y}",
			"labelTemplateLng" : "lng: {x}",
			"useLatLngOrder" : true, // Necessary for leaflet API
			"removeMarkerText" : "Delete Point",
			"centerUserCoordinates" : false,
		    "enableUserInput" : true,
		    "showProjection" : false,
		    "destSRID" : "EPSG:25830", // Current projection choosed in selector
		    "zoom" : null, // User selected zoom for coordinates marker. Default is 10.
		    "sridSet" : null, // Set of SRID's provided by user
		    "latlng" : true // Indicates if current projection uses latlng notation or UTM
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.coordinates.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.Base._prototype,{
		"_fnConstructor": function () {
			this.__fnControlCoordinatesConstructor();
		},

		"__fnControlCoordinatesConstructor": function () {
			this.__fnConstructor();
			var st = this._state;
			var map = this._state.oMap;
			var s = this.s;
			st.removeMarkerText = s.coordinates_marker_remove_text;
			st.enableUserInput = s.enable_input;
			st.centerUserCoordinates = s.center_input_coordinates;
			st.showProjection = s.show_projection;
			st.zoom = s.zoom;

			// Get list of projections as options
			if (s.dest_srid !== false){
				st.sridSet = s.dest_srid.split(",");
				st.destSRID = st.sridSet[0];
			}else{
				st.destSRID = s.dest_srid;
			}

			// Generating new coordinates component
			st.oCoordinatesComponent = new L.control.coordinates({
				position : st.position,
				decimals : st.decimals,
				labelTemplateLat : st.labelTemplateLat,
				labelTemplateLng : st.labelTemplateLng,
				enableUserInput: st.enableUserInput,
				centerUserCoordinates: st.centerUserCoordinates,
				useLatLngOrder : st.useLatLngOrder,
				markerProps : {
					removeMarkerText : st.removeMarkerText
				},
				displayUTM: {
					display: st.showProjection,
					sourceSRID : 'EPSG:4326',
					destSRID : st.destSRID,
					labelTemplateXUTM: "X: {x}",
					labelTemplateYUTM: "Y: {y}"
				}
			}).addTo(map.fnGetMapObject());

			this._fnOverrideSubmit();
			this._fnCreateSRSSelector();
			this._fnOverrideExpand();
		},

		/**
		 * Override L.control.coordinates._handleSubmit for zooming-in selection and SRID's selected
		 */
		"_fnOverrideSubmit" : function() {
			var st = this._state;
			var component = this;
			this._state.oCoordinatesComponent._handleSubmit = function() {
				if (st.latlng === true){

					// Geo is selected
					var x = L.NumberFormatter.createValidNumber(this._inputX.value, this.options.decimalSeperator);
					var y = L.NumberFormatter.createValidNumber(this._inputY.value, this.options.decimalSeperator);
					if (x !== undefined && y !== undefined) {
						var marker = this._marker;
						if (!marker) {
							marker = this._marker = this._createNewMarker();
							marker.on("click", this._clearMarker, this);
						}
						var ll=new L.LatLng(y, x);
						marker.setLatLng(ll);
						marker.addTo(this._map);
						if (this.options.centerUserCoordinates){
							this._map.setView(ll, st.zoom);
						}
					}
				}else{

					// UTM is selected
					var ll = proj4(st.destSRID, 'EPSG:4326', [component._fnGetXInputValue(), component._fnGetYInputValue()]);
					ll = L.latLng(ll[1], ll[0]);
					var marker = this._marker;
					if (!marker) {
						marker = this._marker = this._createNewMarker();
						marker.on("click", this._clearMarker, this);
					}
					marker.setLatLng(ll);
					marker.addTo(this._map);
					if (this.options.centerUserCoordinates){
						this._map.setView(ll, st.zoom);
					}
				}
			}
		},

		/**
		 * Create SRS selector for changing input between UTM (x, y) and geological (lng, lat)
		 */
		"_fnCreateSRSSelector" : function() {
			var component = this;
			var st = this._state;
			this._selector = L.DomUtil.create("select", "coordinates-input", st.oCoordinatesComponent._inputcontainer);
			this._selector.id = "coordinates-selector";

			// Create select options
			if (st.sridSet){

				// Create default Leaflet SRID option
				var option = L.DomUtil.create("option", "", this._selector);
				option.value = 'EPSG:4326';
				option.innerHTML = 'EPSG:4326';

				// Create user options
				for (i = 0; i < st.sridSet.length; i++){
					if (st.sridSet[i] !== 'EPSG:4326'){
						var option = L.DomUtil.create("option", "", this._selector);
						option.value = st.sridSet[i];
						option.innerHTML = st.sridSet[i];
					}
				}
			}

			// Adding listener for changing label template
			jQuery("#coordinates-selector").on("change", jQuery.proxy(component._fnTransformCoordinates, this));
		},

		/**
		 * Transforms coordinates input labels and values depending of SRS type
		 */
		"_fnTransformCoordinates" : function() {

			// _Get spans containing labels
			var inputContainer = this._fnGetInputContainer();
			var aSpans = jQuery("span", inputContainer);
			var st = this._state;
			var actualValue = this._selector.options[this._selector.selectedIndex].value;

			// Change value of labels
			if (actualValue === 'EPSG:4326' || actualValue === 'EPSG:4269'){

				// Geo is selected
				this.fnSetLabelTemplateLat("lat: {y}");
				this.fnSetLabelTemplateLng("lng: {x}");

				if (this._state.useLatLngOrder){
					var lat = aSpans.get(0);
					var lng = aSpans.get(1);
				}else{
					var lat = aSpans.get(1);
					var lng = aSpans.get(0);
				}

				// Change input labels
				lat.innerHTML = "lat: ";
				lng.innerHTML = "lng: ";

				st.latlng = true;

			}else {

				// UTM is selected
				this.fnSetLabelTemplateLat("Y: {y}");
				this.fnSetLabelTemplateLng("X: {x}");

				if (this._state.useLatLngOrder){
					var y = aSpans.get(0);
					var x = aSpans.get(1);
				}else{
					var x = aSpans.get(0);
					var y = aSpans.get(1);
				}

				// Change input labels
				x.innerHTML = "X: ";
				y.innerHTML = "Y: ";

				// Change coordinates mode to UTM
				st.latlng = false;
			}

			// Transform coordinates and change value of inputs
			var ll = proj4(st.destSRID, actualValue, [this._fnGetXInputValue(), this._fnGetYInputValue()]);
			this._fnSetXInputValue(ll[0]);
			this._fnSetYInputValue(ll[1]);

			// Replace the last selected value for the current selected
			st.destSRID = actualValue;
			this._fnSetDestSRID(st.destSRID);
			this._fnSetUTMTo(st.destSRID);
		},

		/**
		 * Override L.control.coordinates.expand for showing right SRS coordinates
		 */
		"_fnOverrideExpand" : function() {
			var st = this._state;
			var component = this;
			this._state.oCoordinatesComponent.expand = function() {
				this._showsCoordinates = false;

				this._map.off("mousemove", this._update, this);

				L.DomEvent.addListener(this._container, "mousemove", L.DomEvent.stop);
				L.DomEvent.removeListener(this._container, "click", this._switchUI, this);

				L.DomUtil.addClass(this._labelcontainer, "uiHidden");
				L.DomUtil.removeClass(this._inputcontainer, "uiHidden");

				// Update coordinates to UTM if selected
				if (st.latlng === false){
					var ll = proj4('EPSG:4326', st.destSRID, [component._fnGetXInputValue(), component._fnGetYInputValue()]);
					component._fnSetXInputValue(ll[0]);
					component._fnSetYInputValue(ll[1]);
				}
			}
		},

		/**
		 * Set L.control.coordinates labelTemplateLat
		 */
		"fnSetLabelTemplateLat" : function(latLabel) {
			this._state.oCoordinatesComponent.labelTemplateLat = latLabel;
		},

		/**
		 * Set L.control.coordinates labelTemplateLng
		 */
		"fnSetLabelTemplateLng" : function(lngLabel) {
			this._state.oCoordinatesComponent.labelTemplateLng = lngLabel;
		},

		/**
		 * Update L.control.coordinateproj4.Proj(this.options.displayUTM.destSRID);s component
		 */
		"_fnUpdateComponent" : function() {
			this._state.oCoordinatesComponent._update();
		},

		/**
		 * Get L.control.coordinates input container
		 */
		"_fnGetInputContainer" : function() {
			return this._state.oCoordinatesComponent._inputcontainer;
		},

		/**
		 * Get L.control.coordinates source SRID
		 */
		"_fnGetSourceSRID" : function() {
			return this._state.oCoordinatesComponent.options.displayUTM.sourceSRID;
		},

		/**
		 * Get L.control.coordinates X input value
		 */
		"_fnGetXInputValue" : function() {
			return this._state.oCoordinatesComponent._inputX.value;
		},

		/**
		 * Get L.control.coordinates Y input value
		 */
		"_fnGetYInputValue" : function() {
			return this._state.oCoordinatesComponent._inputY.value;
		},

		/**
		 * Set L.control.coordinates X input value
		 */
		"_fnSetXInputValue" : function(value) {
			this._state.oCoordinatesComponent._inputX.value = value;
		},

		/**
		 * Set L.control.coordinates Y input value
		 */
		"_fnSetYInputValue" : function(value) {
			this._state.oCoordinatesComponent._inputY.value = value;
		},

		/**
		 * Set L.control.coordinates destSRID
		 */
		"_fnSetDestSRID" : function(destSRID) {
			this._state.oCoordinatesComponent.options.displayUTM.destSRID = destSRID;
		},

		/**
		 * Set L.control.coordinates _utmTo
		 */
		"_fnSetUTMTo" : function() {
			this._state.oCoordinatesComponent._utmTo = proj4.Proj(this._state.oCoordinatesComponent.options.displayUTM.destSRID);
		}

	});

})(jQuery, window, document);
