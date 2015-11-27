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

/* Global scope for GvNIX_Map_User_Layers_Tool */
var GvNIX_Map_User_Layers_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.user_layers = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.user_layers) {
			alert("Warning: GvNIX_Map_Leaflet user_layers control must be initialised with the keyword 'new'");
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
			"dialogTitle" : "",
			"fnOnAccept" : null, // function to call on accept
			"oTabContainer" : null
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.user_layers.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var s = this.s;
			var st = this._state;

			st.dialogTitle = s.dialog_title;

			// Register accept function
			if (s.fn_on_accept) {
				st.fnOnAccept = this.Util.getFunctionByName(
						s.fn_on_accept, jQuery.proxy(
								this.debug, this));
			}

			// Register user layer tab container
			var dialogId = st.sId.concat('_dialog');
			// get tab container, first result of tool container
			var tabContainer = jQuery("div","#".concat(st.sId).concat("_container")).get(0);
			var oTabContainer = jQuery(tabContainer);
			var oTabContainerData = oTabContainer.data();
			st.oTabContainer = new GvNIX_Map_Leaflet.userlayers_tabscontainer(tabContainer.id, dialogId, st.oMap, oTabContainerData);

		},

		"_fnDoSelect" : function() {
			if (!this.__fnDoSelect()) {
				return false;
			}
			this._fnOpenDialog();

			this._fnDoDeselect();
			return false;
		},

		"_fnDoDeselect": function() {
			if (!this.__fnDoDeselect()) {
				return false;
			}
			return true;
		},

		/**
		 * Function called when click into accept button
		 */
		"_fnOnClickAccept":function(){
			this.__fnOnClickAccept();
		},

		/**
		 * Function called when click into accept button
		 * Get selected layers of the tab with the focus and register these into
		 * the map
		 */
		"__fnOnClickAccept":function(){
			var st = this._state;
			// Get focused tab
			var $focusedTab = st.oTabContainer.fnGetFocusedTab();

			//Get selected layers of the focused tab
			var layersSelected = st.oTabContainer.fnGetSelectedLayers($focusedTab);
			if(layersSelected !== false){
				// Check if exists a function accept defined by the user
				if (st.fnOnAccept) {
					//Call to function defined by user
					st.fnOnAccept(layersSelected);
				}else{
					//Put layers in the map
					var layerOptions = st.oTabContainer.fnCreateLayersOptions($focusedTab, layersSelected);
					// check if return an error
					if(layerOptions === false){
						return;
					}else{
						var idLayerToInsert = st.oTabContainer.fnGetLayerId($focusedTab,layerOptions);
						// if layer type is wms register each layer children of manner independent
						if($focusedTab.fnGetLayerType() == "wms"){
							aLayerIdSelected = layerOptions.layers.split(",");
							layerOptions.layers = "";
							// create pattern layer
							var oWmsLayer = {"id" : idLayerToInsert,
											 "options" : layerOptions
											};
							var aoChildLayers = [];
							var childrenStyles = [];
							// tab wms without wizard doesn't select styles
							if(layerOptions.styles_with_id != undefined){
								childrenStyles = layerOptions.styles_with_id.split(",");
							}
							// create children layers
							for(i = 0; i < aLayerIdSelected.length; i++){
								var oLayer = layerOptions.aLayers[aLayerIdSelected[i]];
								var nameLayerAux = oLayer.name.concat("_");
								var style = "";
								// get the style for the layer that starts with oLayer.name
								for(j = 0; j < childrenStyles.length; j++){
									if(childrenStyles[j].startsWith(nameLayerAux)){
										style = childrenStyles[j].substring(nameLayerAux.length,childrenStyles[j].length);
										break;
									}
								}
								var idChildLayer = GvNIX_Map_Leaflet.Util.getHashCode((oLayer.name).concat("_").concat(new Date().toString()));;
								var oChildLayerOptions = { "layer_type" : "wms_child",
											"title" : oLayer.title,
											"visible" : "true",
											"styles" : style,
											"id_on_server" : oLayer.name,
											"group" : idLayerToInsert,
											"context_path" : layerOptions.context_path
								}
								oLayerChild = {"id" : idChildLayer,
										 	   "options" : oChildLayerOptions
											  };
								aoChildLayers.push(oLayerChild);
							}
							GvNIX_Map_Leaflet.LAYERS.wms.fnRegisterWmsLayer(st.oMap, oWmsLayer,
									aoChildLayers, true);
						}else{
							st.oMap.fnRegisterLayer(idLayerToInsert, layerOptions, null, true);
						}
						// Check this layer
						if(!($focusedTab instanceof GvNIX_Map_Leaflet.USERLAYERTAB.shape)){
							st.oMap.fnGetLayerById(idLayerToInsert).fnCheckLayer();
						}
					}
				}
				resizeMap();
				// close the dialog
				jQuery("#".concat(st.sId).concat("_dialog")).dialog("close");
			}
		},

		/**
		 * Function that create and opens dialog
		 */
		"_fnOpenDialog" : function() {
			this.__fnOpenDialog();
		},

		/**
		 * Create and open the dialog that lets the
		 * user to add layers
		 *
		 * (Default implementation)
		 */
		"__fnOpenDialog" : function() {
			var st = this._state;

			// restore the elements of the tabs
			st.oTabContainer.fnRestoreTabsElements();

			// Delete dialog if exists and append new dialog to map body
			jQuery("#".concat(st.sId).concat("_dialog")).remove();
			jQuery("body").append('<div id="'.concat(st.sId).concat('_dialog')
					.concat('" style="display:none;"></div>'));

			// Copy div tabs
			var tabContainerId = st.oTabContainer.fnGetId();
			var divTabs = jQuery("#".concat(tabContainerId)).clone();
			// Change visibility of tabs
			divTabs.show();

			// Add tabs to dialog
			jQuery("#".concat(st.sId).concat("_dialog")).prepend(divTabs);

			// Create the tabs and register their events
			st.oTabContainer.fnCreateTabs();

			// Clone button accept and add to dialog with its id changed
			var buttonAccept = jQuery("#".concat(st.sId).concat("_button_accept")).clone();
			buttonAccept.show();
			buttonAccept.click(jQuery.proxy(this._fnOnClickAccept, this));
			jQuery("#".concat(st.sId).concat("_dialog")).append(buttonAccept);

			// Generating Extended Dialog with Maximize and
			// Collapsable functions
			var userLayersDialog = jQuery("#".concat(st.sId).concat("_dialog")).dialog({
				title : st.dialogTitle,
				autoOpen : false,
				modal : false,
				resizable : false,
				width : 800,
				height : 500
			}).dialogExtend({
				"closable" : true,
				"maximizable" : true,
				"collapsable" : true,
				"dblclick" : "collapse"
			});

			// open the dialog
			userLayersDialog.dialog('open');

		},

	});

})(jQuery, window, document);
