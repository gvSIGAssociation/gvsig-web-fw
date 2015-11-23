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

/* Global scope for GvNIX_Map_Scale_Component */
var GvNIX_Map_History_Component;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.history =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.history) {
			alert("Warning: GvNIX_Map_Leaflet history control must be initialised with the keyword 'new'");
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
			"oHistoryComponent" : null // L.HistoryControl instance
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.history.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.Base._prototype,{
		"_fnConstructor": function () {
			this.__fnControlHistoryConstructor();
		},

		"__fnControlHistoryConstructor": function () {
			this.__fnConstructor();
			var st = this._state;
			var map = this._state.oMap;
			var s = this.s;
			// Generating new history component
			st.oHistoryComponent = new L.HistoryControl({
				"position" : s.position,
				"orientation": s.orientation,
				"backImage" : s.back_icon,
				"forwardImage" : s.forward_icon,
				"backText" : s.back_text,
				"forwardText" : s.forward_text,
				"backTooltip" : s.back_tooltip,
				"forwardTooltip" : s.forward_tooltip,
				"maxMovesToSave" : s.max_moves
			});

			st.oHistoryComponent.addTo(map.fnGetMapObject());
		},

	});

})(jQuery, window, document);
