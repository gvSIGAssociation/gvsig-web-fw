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

/* Global scope for GvNIX_Map_Predefined_Views_Component */
var GvNIX_Map_Predefined_Views_Component;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.predefined_views_component =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.predefined_views_component) {
			alert("Warning: GvNIX_Map_Leaflet predefined views control must be initialised with the keyword 'new'");
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
			"$menu" : null,
			"oUtil" : null,
			"msg_layers_incompatible_map" : null,
			"msg_children_incompatible" : null,
			"msg_loading_children" : null,
			"blurTimer" : null,
	    	"blurTimeAbandoned" : 1000,
			"oPredefinedViewsComponent" : null // instance
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.predefined_views_component.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.Base._prototype,{
		"_fnConstructor": function () {
			this.__fnControlPredefinedViewsConstructor();
		},

		"__fnControlPredefinedViewsConstructor": function () {
			this.__fnConstructor();
			var st = this._state;
			var map = this._state.oMap;
			var s = this.s;
			this._state.oUtil = GvNIX_Map_Leaflet.Util;
			var self = this;
			var oPredefinedViewsComponent = L.Control.extend({
			    options: {
			    	"position" : s.position
			    },

			    onAdd: function (map) {
			        // create the control container with a particular class name
			        var container = L.DomUtil.create('div', 'predefined-views-control leaflet-control');
			        //recorremos capas y anyadimos a variable
			        var htmlLayout = L.DomUtil.create('div', 'predefined-views-layers-control');
			        // foreach layers
			        s.capas.each(function(index) {
			        	//get current layer
						var $layerDiv = jQuery(this);
						// get idlayer and name
						var idLayer = "#".concat($layerDiv.attr('id'));
						var layerName = $layerDiv.text().trim();
						var layer = L.DomUtil.create('div', 'predefined-views-layer-control');
						var idMap = st.oMap._data.id;
						// id menu element
						var menu = "#".concat(idMap).concat("_toolbar_predefinedViews_predefined_views_tool_root");
                        // id current link
						var idLink = "predefinedViews_".concat(layerName);
						var javascript = "javascript:predefinedViewsComponent('"+menu+"','"+idLayer+"')";
						var linkLayer = '<a id="'+idLink+'" href="#" onclick="'+javascript+'"  alt="layer" title="'+ $layerDiv.text().trim() + '" class=" predefined-views-layer-link ">' +$layerDiv.text().trim()+ '</a>';
						layer.innerHTML = linkLayer;
						htmlLayout.appendChild(layer.cloneNode(true));

					});
			        container.appendChild(htmlLayout.cloneNode(true));
			        return container;
			    }
			});
            st.oPredefinedViewsComponent = new oPredefinedViewsComponent();
			st.oPredefinedViewsComponent.addTo(map.fnGetMapObject());
		},
	});

})(jQuery, window, document);
