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
(function(jQuery, window, document) {
	GvNIX_Map_Leaflet.CONTROLS.metadata =  function (oMap,sId,options) {
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.metadata) {
			alert("Warning: GvNIX_Map_Leaflet metadata control must be initialised with the keyword 'new'");
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
			"layerIdSelected" : "", // layer selected id
			"layerTitle" : "", // layer selected title
		    "dialogWidth" : 800, // dialog width on pixels
		    "dialogHeight" : 500 // dialog height on pixels

		});

		this._fnConstructor();
	}

	GvNIX_Map_Leaflet.CONTROLS.metadata.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype,{
		"_fnConstructor": function () {
			var st = this._state;
			var s = this.s;

			this.__simple_selectable_fnConstructor(false);
			st.layerIdSelected = this.s.layerid;

			if(s.dialog_height){
				st.dialogHeight = s.dialog_height;
			}

			if(s.dialog_width){
				st.dialogWidth = s.dialog_width;
			}
		},

		/**
		 * Actions to do when select the tool
		 */
		"_fnDoSelect" : function() {
			var st = this._state;
			var metadata = "";
			// Get object layer
			var layer = st.oMap.fnGetLayerById(this._state.layerIdSelected);
			st.layerTitle = layer.fnGetTitle();
			// Set callback and get metadata
			var callbackFn = jQuery.proxy(this._fnShowMetadata, this)
			layer.fnGetMetadata(callbackFn);

		},

		/**
		 * Actions to do when deselect the tool
		 */
		"_fnDoDeselect": function() {
			return false;
		},

		/**
		 * Show layer metadata into dialog
		 */
		"_fnShowMetadata" : function (metadata, metadataType){
			var st = this._state;
			var html = this._fnTransformMetada(metadata, metadataType);
			// open dialog
			this._fnShowDialog(html, st.layerTitle);
		},

		/**
		 * Transform metadata to html
		 */
		"_fnTransformMetada" : function (metadata, metadataType){
			var st = this._state;
			var html = "<div>";
			if(metadataType == "URL"){
				html += "<iframe src='";
				html += metadata;
				html += "' width='"+st.dialogWidth+"'";
				html += " height='"+st.dialogHeight+"'";
				html += "/>";
			}else{
				if(metadataType == "STRING"){ //html
					html += "<div>";
					html += metadata;
					html += "</div>";
				}else{ // JSON
					html += "<div>";
					html += GvNIX_Map_Leaflet.Util.JSONToHtml(metadata);
					html += "</div>";
				}
			}
			html += "</div>";
			return html;
		},

		/**
		 * Create and show dialog with layer metadata information
		 */
		"_fnShowDialog" : function(textDialog, titleDialog) {
			var st = this._state;

			// Delete dialog if exists
			jQuery("#"+st.sId+"_dialog").remove();

			var divDialog = '<div id="'+st.sId+'_dialog'+'" >'+textDialog+'</div>';

			// Generating Extended Dialog with Maximize and
			// Collapsable functions
			var metadataDialog = jQuery(divDialog).dialog({
				title : titleDialog,
				autoOpen : false,
				modal : false,
				resizable : true,
				width : st.dialogWidth,
				height : st.dialogHeight
			}).dialogExtend({
				"closable" : true,
				"maximizable" : true,
				"collapsable" : true,
				"dblclick" : "collapse"
			});

			// open the dialog
			metadataDialog.dialog('open');
		},

	});

})(jQuery, window, document);


