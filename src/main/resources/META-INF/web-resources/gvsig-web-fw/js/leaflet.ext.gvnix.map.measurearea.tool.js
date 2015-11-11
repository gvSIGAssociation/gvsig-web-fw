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