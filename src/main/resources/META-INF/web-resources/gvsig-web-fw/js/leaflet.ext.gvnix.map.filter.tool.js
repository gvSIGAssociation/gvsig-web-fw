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

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.filter = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.filter) {
			alert("Warning: GvNIX_Map_Leaflet filter control must be initialised with the keyword 'new'");
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
					"layerIdSelected" : ""
				});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.filter.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,
		{
			"_fnConstructor" : function() {
				this.__simple_selectable_fnConstructor(false);
				this._state.dialogId = this.s.layerid + "_filter_dialog";
				this._state.layerIdSelected = this.s.layerid;
			},

			"_fnDoSelect" : function() {
				if (!this.__fnDoSelect()) {
					return false;
				}

				var layer = this.s.layer;

				var filterOn = this.s.filter_on;
				if (filterOn == "dialog") {
					// On click,open new dialog to filter on page
					this._fnOpenFilterDialog();
				} else if (filterOn == "window") {
					window.open(layer.s.path)
				} else if (filterOn == "custom"
						&& layer.s.show_filter_function != "") {
					window[layer.s.show_filter_function]();
				}

			},

			/**
			 * Function that opens filter dialog
			 */
			"_fnOpenFilterDialog" : function() {
				this.__fnOpenFilterDialog();
			},

			/**
			 * Function that opens filter dialog
			 *
			 * (Default implementation)
			 */
			"__fnOpenFilterDialog" : function() {
				var layer = this.s.layer;

				// Append new dialog to map body
				jQuery("#" + this._state.dialogId).remove();
				jQuery("body").append('<div id="' + this._state.dialogId
							+ '" style="display:none;"></div>');

				// Getting current entity
				var entity = layer.s.path.split("/")[layer.s.path
						.split("/").length - 1]
				entity = entity.replace(entity[0], entity[0]
						.toUpperCase());

				// Generating Extended Dialog with Maximize and
				// Minimize functions
				var filterDialog = jQuery("#" + this._state.dialogId).dialog({
					title : entity,
					autoOpen : false,
					modal : false,
					resizable : false,
					width : 800,
					height : 500
				}).dialogExtend({
					"closable" : true,
					"maximizable" : true,
					"minimizable" : true,
					"collapsable" : true,
					"dblclick" : "collapse",
					"minimizeLocation" : "left"
				});

				// Loading Datatable list
				filterDialog.load(
						layer.s.path + "?mapselector&path=list",
						jQuery.proxy(this.__fnOnOpenDialog, this))
						.dialog('open');

			},

			"__fnOnOpenDialog" : function() {
				var layer = this.s.layer;

				var table = jQuery("#" + this._state.dialogId
						+ " table[class=dataTable][id]")[0];
				var tableId = table.attributes.id.value;
				// Getting datatableInstance
				var datatableInstance = jQuery(
						"#" + tableId).dataTable();

				// Registering filter callback
				var fnFilterModifiedProxy = jQuery.proxy(
						layer._fnFilterDataModified,layer);
				datatableInstance.fnRegisterSaveStateCallback(fnFilterModifiedProxy);

				// Registering selection callback
				var fnSelectionModifiedProxy = jQuery.proxy(
						layer._fnSelectionDataModified,layer);
				datatableInstance.fnRegisterOnSelectCallback(fnSelectionModifiedProxy);

				// Changing create entity link
				jQuery("#" + this._state.dialogId + " a[class='icon create_entity']").attr(
						"href",
						layer.s.path + "?form");

				// Reloading data on load Data Getting localStorage keys
				var oKeys = layer._state.oMap
						._fnGetEntityLocalStorageKeys(layer);

				var filterLocalStorage = localStorage
						.getItem(oKeys.filterKey);

				if (filterLocalStorage != null) {
					layer._fnFilterDataModified(filterLocalStorage);
				}

				// Getting selection localStorage
				var selectionLocalStorage = localStorage
						.getItem(oKeys.selectionKey);

				if (selectionLocalStorage != null) {
					layer._fnSelectionDataModified(selectionLocalStorage);
				}

			},

			"_fnDoDeselect" : function() {
				if (!this.__fnDoDeselect()) {
					return false;
				}
				return true;
			}

		});

})(jQuery, window, document);
