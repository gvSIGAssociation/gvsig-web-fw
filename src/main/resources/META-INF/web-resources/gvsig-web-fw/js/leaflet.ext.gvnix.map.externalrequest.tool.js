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

/* Global scope for GvNIX_Map_External_Request_Tool */
var GvNIX_Map_External_Request_Tool;

(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.external_request = function(oMap, sId, options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.external_request) {
			alert("Warning: GvNIX_Map_Leaflet external_request control must be initialised with the keyword 'new'");
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
			"getPointOverMap" : true,
			"setDataByForm" : false,
			"idContainerForm" : null,
			"fnDoRequest" : null,
			"formDialogWidth" : 800, // dialog width on pixels
			"formDialogHeight" : 500, // dialog height on pixels
			"formDialogTitle" : "", // dialog title
			"showResultDialogWidth" : 800, // dialog width on pixels
			"showResultDialogHeight" : 500, // dialog height on pixels
			"showResultDialogTitle" : "", // dialog title
			"data" : {},
			"labelButtonSubmit" : "Submit",
			"labelButtonSubmit" : "Cancel",
			"msgSelectPoint" : "Select point on the map",
			"titleSelectPoint" : "Information"
		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.external_request.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			this.__simple_selectable_fnConstructor(false);
			var s = this.s;
			var st = this._state;

			st.data = null;

			st.getPointOverMap = s.get_point_over_map;
			st.setDataByForm = s.set_data_by_form;
			st.idContainerForm = s.id_container_form;
			st.showResultInDialog = s.show_result_in_dialog;

			st.formDialogTitle = s.form_dialog_title;

			st.labelButtonSubmit = s.label_button_submit;
			st.labelButtonCancel = s.label_button_cancel;
			st.msgSelectPoint = s.msg_select_point;
			st.titleSelectPoint = s.title_select_point;

			if(s.form_dialog_width){
				st.formDialogWidth = s.form_dialog_width;
			}

			if(s.form_dialog_height){
				st.formDialogHeight = s.form_dialog_height;
			}

			st.showResultDialogTitle = s.show_result_dialog_title;

			if(s.show_result_dialog_width){
				st.showResultDialogWidth = s.show_result_dialog_width;
			}

			if(s.show_result_dialog_height){
				st.showResultDialogHeight = s.show_result_dialog_height;
			}

			// Register accept function
			if (s.fn_do_request) {
				st.fnDoRequest = this.Util.getFunctionByName(
						s.fn_do_request, jQuery.proxy(
								this.debug, this));
			}

		},

		/**
		 * Action to do when tool is selected
		 */
		"_fnDoSelect" : function() {
			var st = this._state;
			if (!this.__fnDoSelect()) {
				return false;
			}
			if(st.getPointOverMap){
				// If it's true, activate function onclick over the map
				// to get the point selected
				st._proxy_onClick =jQuery.proxy(this._fnClickOnMap, this);

				st.oMap.fnGetMapObject().on("click",st._proxy_onClick);

				var divDialog = '<div id="'+st.sId+'_select_point_dialog" >';
				divDialog += st.msgSelectPoint + '</div>';
				var dialogMsg = jQuery(divDialog).dialog({
					title: st.titleSelectPoint,
					autoOpen : true,
					modal : true,
					position: { at: "center top", of: window}
				}).dialogExtend({
					"closable" : false,
					"maximizable" : false,
					"collapsable" : false
				});

				setTimeout(function(){
				    jQuery(dialogMsg).dialog("close");
				}, 1000);

			}else{
				if(st.setDataByForm){
					// create form dialog with form
					this._fnCreateFormDialog(st.idContainerForm);
				}
			}
			/*st.oMap.fnGetMapObject().dragging.disable();
			st.oMap.fnGetMapObject().doubleClickZoom.disable();
			st.oMap.fnGetMapObject().getContainer().focus();*/
			return true;
		},

		/**
		 * Get the point selected and transform their coordinates
		 * to CRS of the map.
		 * Show form or call to callback defined by user.
		 */
		"_fnClickOnMap" : function (event){
			var st = this._state;
			// Click coordinates
			var latLng = event.latlng;
			st.data = {};
			st.data["lat"] = latLng.lat;
			st.data["lng"] = latLng.lng;

			var map = st.oMap.fnGetMapObject()
			var mapCrs = map.options.crs;
			var mapProj = mapCrs.projection;

			// Get coordinates in Pixel
			var point = mapCrs.latLngToPoint(latLng, map.getZoom());

			// Get real world coordinates using Register CRS
			var projectedPoint = mapCrs.project(map.unproject(point));

			st.data["xProjected"] = projectedPoint.x;
			st.data["yProjected"] = projectedPoint.y;

			st.data["crs"] = mapCrs.code;

			// if st.setDataByForm call to _fnCreateFormDialog
			if(st.setDataByForm){
				// create form dialog with form
				this._fnCreateFormDialog(st.idContainerForm);
			}else{
				// call callback to do something with the data obtained,
				// the function is defined by user
				st.fnDoRequest(st.data, st.oMap, this);
			}
		},

		/**
		 * Create form dialog with the html included in the object with id
		 * defined by divFormId parameter
		 */
		"_fnCreateFormDialog" : function(divFormId){
			var st = this._state;

			// remove dialog if exists
			jQuery("#"+st.sId+"_form_dialog").remove();

			var divForm = jQuery("#"+divFormId).clone();
			var form = divForm.find('form');
			var fnAction = jQuery.proxy(this._fnGetDataFromForm, this);
			form.attr('action', '#');
			divForm.show();

			var actionButtons = '<button id="'+st.sId+'_form_dialog_submit_button'+'" type="button" class="btn btn-default"';
			actionButtons += '>'+st.labelButtonSubmit+'</button>';

			actionButtons += '<button id="'+st.sId+'_form_dialog_cancel_button'+'" type="button" class="btn btn-default"';
			actionButtons += '>'+st.labelButtonCancel+'</button>';

			form.append(actionButtons);

			var divDialog = '<div id="'+st.sId+'_form_dialog" >'+ divForm.html();
			divDialog += '</div>';
			// Generating Extended Dialog with Maximize and
			// Collapsable functions
			var formDialog = jQuery(divDialog).dialog({
				title : st.formDialogTitle,
				autoOpen : false,
				modal : false,
				resizable : true,
				width : st.formDialogWidth,
				height : st.formDialogHeight
			}).dialogExtend({
				"closable" : true,
				"maximizable" : true,
				"collapsable" : true,
				"dblclick" : "collapse"
			});

			// open the dialog
			formDialog.dialog('open');

			var oButtonSubmit = jQuery("#"+st.sId+"_form_dialog_submit_button");
			oButtonSubmit.click(jQuery.proxy(this._fnGetDataFromForm, this));

			var oButtonCancel = jQuery("#"+st.sId+"_form_dialog_cancel_button");
			oButtonCancel.click(function(){jQuery("#"+st.sId+"_form_dialog").dialog('close')});

		},

		/**
		 * Open a dialog with the html passed in resultHtml parameter
		 */
		"fnShowResultsOnDialog" : function(resultHtml){
			var st = this._state;
			var divDialog = '<div id="'+st.sId+'_show_result_dialog" >';
			divDialog += resultHtml + '</div>';

			var showResultDialog = jQuery(divDialog).dialog({
				//TODO title multiidioma
				title : st.showResultDialogTitle,
				autoOpen : false,
				modal : false,
				resizable : true,
				width : st.showResultDialogWidth,
				height : st.showResultDialogHeight
			}).dialogExtend({
				"closable" : true,
				"maximizable" : true,
				"collapsable" : true,
				"dblclick" : "collapse"
			});

			// open the dialog
			showResultDialog.dialog('open');
		},

		/**
		 * Get the values of the form defined by the user and returns an object
		 * with the id of the inputs and their corresponding values.
		 * If the input is a checkbox or radio and it isn't selected, its value
		 * will be 'undefined'.
		 */
		"_fnGetDataFromForm": function (){
			var st = this._state;
			var elements = {};
			if(st.data != null){
				elements = st.data;
			}

			var formElements = jQuery("#"+st.sId+"_form_dialog").find(':input');
			for (i = 0; i < formElements.length; i++){
				// omit buttons
				if(formElements[i].type != "button"){
					// if type is checkbox or radio check if is selected to return the value
					if(formElements[i].type == "checkbox" || formElements[i].type == "radio" ){
						if(formElements[i].checked){
							elements[formElements[i].id] = formElements[i].value;
						}else{
							elements[formElements[i].id] = undefined;
						}
					}else{
						elements[formElements[i].id] = formElements[i].value;
					}
				}
			}

			// close the dialog
			jQuery("#"+st.sId+"_form_dialog").dialog("close");

			// call callback to do something with the data obtained,
			// the function is defined by user
			st.fnDoRequest(elements, st.oMap, this);
		},

		"_fnDoDeselect": function() {
			var st = this._state;
			if (!this.__fnDoDeselect()) {
				return false;
			}

			//quit event click over map
			st.oMap.fnGetMapObject().off("click");

			return true;
		}

	});

})(jQuery, window, document);
