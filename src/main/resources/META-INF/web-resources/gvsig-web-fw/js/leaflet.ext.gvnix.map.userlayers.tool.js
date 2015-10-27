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

/* Global scope for GvNIX_Map_User_Layers_Tool */
var GvNIX_Map_User_Layers_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.user_layers =  function (oMap,sId,options) {
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
			var dialogId =  st.sId.concat('_dialog');
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
						st.oMap.fnRegisterLayer(idLayerToInsert, layerOptions);
						// Move selected layer to first position of TOC
						st.oMap.fnMoveLayer(idLayerToInsert, st.oMap
								.fnGetTocLayersIds()[0], null, true);
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
