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

/* Global scope for GvNIX_Map_Measure_Tool */
var GvNIX_Map_Measure_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.measureArea =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.measureArea) {
			alert("Warning: GvNIX_Map_Leaflet measure area control must be initialised with the keyword 'new'");
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
			"oMeasureAreaTool" : null // L.MeasureAreaTool instance
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.measureArea.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var st = this._state;
			var map = this._state.oMap;
			// Generating new measureAreaTool
			st.oMeasureAreaTool = new L.Control.MeasureAreaTool(null);
			st.oMeasureAreaTool.onAdd(map.fnGetMapObject(), true, false, 'black', st.othis[0], '<strong>Error:</strong> ' + this.s.tooltiperror, this.s.tooltipunits);

			//Add locale for L.drawLocal
			L.drawLocal.draw.handlers.polygon.tooltip.start = this.s.tooltipstart;
			L.drawLocal.draw.handlers.polygon.tooltip.cont = this.s.tooltipcont;
			L.drawLocal.draw.handlers.polygon.tooltip.end = this.s.tooltipend;
		},

		"_fnDoSelect" : function() {
			if (!this.__fnDoSelect()) {
				return false;
			}
			this._state.oMeasureAreaTool.enable();

			return true;
		},

		"_fnDoDeselect": function() {
			if (!this.__fnDoDeselect()) {
				return false;
			}
			this._state.oMeasureAreaTool.disable();

			return true;
		}
	});

})(jQuery, window, document);
