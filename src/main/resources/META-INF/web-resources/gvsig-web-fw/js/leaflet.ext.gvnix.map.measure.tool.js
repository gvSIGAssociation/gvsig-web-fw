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
	GvNIX_Map_Leaflet.CONTROLS.measure =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.measure) {
			alert("Warning: GvNIX_Map_Leaflet measure control must be initialised with the keyword 'new'");
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
			"oMeasuringTool" : null, // L.MeasuringTool instance
			"preventExitMessage": ""// Message to show on confirm dialog to prevent exit from tool
		});
		
		this._fnConstructor();
	}
	
	GvNIX_Map_Leaflet.CONTROLS.measure.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var st = this._state;
			var map = this._state.oMap;
			var s = this.s;
			// Generating new measuringTool 
			st.oMeasuringTool = new L.MeasuringTool(map.fnGetMapObject());
			st.preventExitMessage = s.preventexitmessage;
		},
		
		"_fnDoSelect" : function() {
			if (!this.__fnDoSelect()) {
				return false;
			}
			this._state.oMeasuringTool.enable();
			return true;
		},
		
		"_fnDoDeselect": function() {
			var response = true;
			if(this._state.preventExitMessage !== ""){
				response = confirm(this._state.preventExitMessage);
			}

			if(response){
			if (!this.__fnDoDeselect()) {
				return false;
			}
			this._state.oMeasuringTool.disable();
			return true;
			}else{
				return false;
			}

		}
	});
	
})(jQuery, window, document);
