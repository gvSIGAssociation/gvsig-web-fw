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
	/**
	 * Register of supported User Layer Tabs types
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB = {};

	/**
	 * This object contains the common data and methods for a user layer tab.
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.Base = {

		/**
		 * Common default options
		 */
		"default_options" : {
		},

		/**
		 * Minimun user layer state data
		 */
		"_state" : {
			"sId" : null, // User Layer Tab ID
			"title" : "",
			"aCrs" : null,
			"typeTab" : "Base", // Type of tab
			"typeLayer" : "Base", // Type of layer
			"layerId" : null,
		    "containerId": "", // The id of the content (dialog for maps) that contains the tabs
		    "oUtil" : null,
		    "waitLabel" : "Loading..."
		},

		/**
		 * Common user layer methods
		 */
		"_prototype" : {

			/**
			 * constructor To override
			 */
			"_fnConstructor" : function() {
				this.__fnConstructor();
			},

			/**
			 * Base constructor
			 */
			"__fnConstructor" : function() {
				var s = this.s;
				var st = this._state;
				st.typeTab = s.type;
				st.typeLayer = s.layer_type;
				st.title = s.title;
				st.oUtil = GvNIX_Map_Leaflet.Util;
				st.waitLabel = s.wait_label;
			},


			/**
			 * Default debug message function.
			 */
			"debug" : function(message) {
				this._debug();
			},

			/**
			 * Default debug message function. Should be override
			 */
			"_debug" : function(message) {
				console.log("[UserLayerTab:'" + this._state.sId + "'] "
						+ message);
			},

			/**
			 * Get tab ID
			 */
			"fnGetId" : function() {
				return this._fnGetId();
			},

			/**
			 * Get tab ID
			 */
			"_fnGetId" : function() {
				return this._state.sId;
			},

			/**
			 * Get tab title
			 */
			"fnGetTitle" : function() {
				return this._fnGetTitle();
			},

			/**
			 * Get tab title
			 */
			"_fnGetTitle" : function() {
				return this._state.title;
			},

			/**
			 * Get selected layers
			 */
			"fnGetSelectedLayers" : function() {
				return this._fnGetSelectedLayers();
			},

			/**
			 * Get selected layers
			 */
			"_fnGetSelectedLayers" : function() {
				return null;
			},

			/**
			 * Register the function to call when click on button connect
			 */
			"_fnRegisterActionToButtonConnect" : function() {
				this.__fnRegisterActionToButtonConnect();
			},

			/**
			 * Register the function to call when click on button connect
			 */
			"__fnRegisterActionToButtonConnect" : function() {
				var st = this._state;
				var buttonConnect = jQuery("#".concat(st.sId).concat("_connectbutton"), "#".concat(st.containerId));
				if(buttonConnect){
					if(st.fnOnSearchLayers){
						buttonConnect.click(jQuery.proxy(st.fnOnSearchLayers, this));
					}else{
						buttonConnect.click(jQuery.proxy(this._fnGetDataFromServer, this));
					}
				}
			},

			/**
			 * Register function to change server button for reset
			 * the information gotten from the server
			 */
			"_fnRegisterActionToButtonResetServer" : function() {
				this.__fnRegisterActionToButtonResetServer();
			},

			/**
			 * Register function to change server button for reset
			 * the information gotten from the server
			 */
			"__fnRegisterActionToButtonResetServer" : function() {
				var st = this._state;
				var buttonChangeServer = jQuery("#".concat(st.sId).concat("_changeserver_button"), "#".concat(st.containerId));
				buttonChangeServer.click(jQuery.proxy(this._fnResetServer, this));
			},

			/**
			 * Register actions to the different buttons of the
			 * tab
			 */
			"fnRegisterButtonsAction" : function() {
				this._fnRegisterButtonsAction();
			},

			/**
			 * Register actions to the different buttons of the
			 * tab
			 */
			"_fnRegisterButtonsAction" : function() {
				//Do nothing
			},


			/**
			 * Generate the code necessary to add the selected layers into the map
			 */
			"fnCreateLayersOptions" : function(layersSelected) {
				return this._fnCreateLayersOptions(layersSelected);
			},

			/**
			 * Generate the code necessary to add the selected layers into the map
			 */
			"_fnCreateLayersOptions" : function(layersSelected) {
				return null;
			},

			/**
			 * Get layer id using layer options to complete the id
			 */
			"fnGetLayerId" : function(layerOptions) {
				return this._fnGetLayerId(layerOptions);
			},

			/**
			 * Get layer id
			 */
			"_fnGetLayerId" : function() {
				return null;
			},

			/**
			 * Set error message into error_message div.
			 */
			"_fnSetErrorMessage" : function(idDivError, message) {
				return this.__fnSetErrorMessage(idDivError, message);
			},

			/**
			 * Set error message into error_message div.
			 */
			"__fnSetErrorMessage" : function(idDivError, message) {
				var st = this._state;
				if(st.containerId){
					jQuery(idDivError, "#".concat(st.containerId)).html(message);
				}
			},

			/**
			 * Clear error_message div
			 */
			"_fnClearErrorMessage" : function(idDivError) {
				return this.__fnClearErrorMessage(idDivError);
			},

			/**
			 * Clear error_message div
			 */
			"__fnClearErrorMessage" : function(idDivError) {
				var st = this._state;
				if(st.containerId){
					jQuery(idDivError, "#".concat(st.containerId)).html("");
				}
			},

			/**
			 * Clean and restore the objects of the tab
			 */
			"fnCleanUserLayerTab" : function() {
				return this._fnCleanUserLayerTab();
			},

			/**
			 * Clean and restore the objects of the tab
			 */
			"_fnCleanUserLayerTab" : function() {
				return;
			},

			/**
			 * Set layers, styles, crs, etc. from object oDataToSet
			 */
			"fnSetData" : function(oDataToSet) {
				this._fnSetData(oDataToSet);
			},

			/**
			 * Set layers, styles, crs, etc. from object oDataToSet
			 */
			"_fnSetData" : function(oDataToSet) {
				null;
			},

			/**
			 * Get layer type
			 */
			"fnGetLayerType" : function() {
				return this._fnGetLayerType();
			},

			/**
			 * Get layer type
			 */
			"_fnGetLayerType" : function() {
				return this._state.typeLayer;
			},

			/**
			 * Get tab type
			 */
			"fnGetTabType" : function() {
				return this._fnGetTabType();
			},

			/**
			 * Get tab type
			 */
			"_fnGetTabType" : function() {
				return this._state.typeTab;
			}
		}
	};

	/**
	 * Register class to management tab of WMS layer
	 */

	GvNIX_Map_Leaflet.USERLAYERTAB.wms = function(sId, containerId, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.wms) {
			alert("Warning: GvNIX_Map_Leaflet  USERLAYERTAB wms must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
			"sId" : sId,
			"title" : "",
			"containerId": containerId,
			"path" : "",
			"typeLayer" : "",
			"treeDivId" : null,
			"aCrs" : aCrs,
			"oWMSInfo" : null,
			"oTree" : null,
			"fnOnSearchLayers" : null,
			"oUtil" : null,
			"msgLayersNotFound" : "Layers not found",
			"msgServerRequired" : "Server value is required",
			"msgLayersRequired" : "Select at least one layer",
			"msgIncompatibleLayers" : "The layers selected are incompatible, please select layers with common crs",
			"format" : null,

		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Tab type wms. Class method declaration
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.wms.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
				"_debug" : function(message) {
					var st = this._state;
					console.log("[UserLayerTab WMS:" + st.sId + "] " + message);
				},

				// overwrite constructor to create wms instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					// Get id of the tree when we are going to paint layers to
					// select
					st.treeDivId = s.tree_div_id;
					st.path = s.path;
					// Set error messages
					st.msgLayersNotFound = s.msg_layers_not_found;
					st.msgLayersRequired = s.msg_layers_required;
					st.msgServerRequired = s.msg_server_required;
					st.msgIncompatibleLayers = s.msg_incompatible_layers;
					//set format
					st.format = s.format;

					// set input with crs established in constructor
					if(st.aCrs){
						jQuery("#".concat(st.sId).concat("_map_crs_input")).val(st.aCrs);
						jQuery("#".concat(st.sId).concat("_map_crs")).show();
					}

					// Get if the user has his own implementation to connect to the server
					// and get the layers
					if (s.fn_search_layers) {
						st.fnOnSearchLayers = this.Util.getFunctionByName(
								s.fn_search_layers, jQuery.proxy(
										this.debug, this));
					}

				},

				/**
				 * Get selected layers of the tree
				 */
				"_fnGetSelectedLayers" : function() {
					var st = this._state;
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					if(st.oTree){
						var selectedNodes = st.oTree.getSelectedNodes();
						if(selectedNodes.length === 0){
							selectedNodes = false;
							this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgLayersRequired);
						}
					}else{
						selectedNodes = false;
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgLayersRequired);
					}
					return selectedNodes;
				},

				/**
				 * Get data from WMS server indicated into server input
				 */
				"_fnGetDataFromServer" : function() {
					this.__fnGetDataFromServer();
				},

				/**
				 * Get data from WMS server indicated into server input
				 */
				"__fnGetDataFromServer" : function() {
					var st = this._state;
					// clean div that contains error messages
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					var urlServ = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();
					if(urlServ){
						st.oUtil.startWaitMeAnimation(st.waitLabel);
						var params = { url: urlServ, crs: st.aCrs, format: st.format };
						jQuery.ajax({
							url : st.path + "?findWmsCapabilities",
							data: params,
							cache: false,
							success : function(element) {
								st.oUtil.stopWaitMeAnimation();
								st.oWMSInfo = element;
								if(st.treeDivId)
								{
									// clean tree and label
									if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
									}else{
										jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).show();
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
									}
									// Check if have any result and create the tree
									if(element.layersTree != null && element.layersTree.length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree({
											source: element.layersTree,
											checkbox: true,
											selectMode: 3
										});

										st.oTree = jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("getTree");
									}else{
										st.oTree = null;
										// set empty tree message
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).html(st.msgLayersNotFound);
									}
								}
							},
							error : function(object) {
								// clean tree and messages
								if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
									jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
								}
								jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
								jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
								// get the error message and put in after form
								jQuery("#".concat(st.sId).concat("_error_message"), "#".concat(st.containerId)).html(object.responseText);
								// stop wait animation
								st.oUtil.stopWaitMeAnimation();
								// show error console
								console.log('Se ha producido un error en la obtencion de las capas correspondientes al servidor introducido');
							}
						});
					}else{
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgServerRequired);
					}


				},

				/**
				 * Register actions to the different buttons of the
				 * tab
				 */
				"_fnRegisterButtonsAction" : function(){
					this._fnRegisterActionToButtonConnect();
				},

				/**
				 * Generate the code necessary to add the selected layers into the map
				 */
				"_fnCreateLayersOptions" : function(layersSelected) {
					var st = this._state;
					var keysLayersSel = [];
					// get the selected layers
					for(i in layersSelected){
						var layerSel = layersSelected[i];
						// check if the layer is root
						if(layerSel.key.indexOf("rootLayer_") !== 0 &&
								layerSel.unselectable !== true){
							keysLayersSel.push(layerSel.key);
						}
					}

					var crsCommonSelected = this._fnGetCommonCRS(keysLayersSel);
					if(crsCommonSelected.length == 0){
						// show message to user because he has selected
						// incompatible layers
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgIncompatibleLayers);
						return false;
					}else{
						// get the common crs between selected layers and
						// selected crs by the server
						var serverCRS = st.oWMSInfo.crsSelected;
						crsSelected = serverCRS.filter(function(el) {
						    return crsCommonSelected.indexOf(el) != -1
						});

						if(crsSelected.length == 0){
							// show message to user because he has selected
							// incompatible layers
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgIncompatibleLayers);
							return false;
						}else{
							// generate root layer options and put selected layers
							// into layers parameter
							var layerOptions = {
								"layer_type": st.typeLayer,
								"span": (st.oWMSInfo.id.toString()).concat("_span"),
								"url": st.oWMSInfo.serviceUrl,
								"layers":keysLayersSel.join(),
								"format": st.oWMSInfo.formatSelected,
								"transparent":"true",
								"version":st.oWMSInfo.version,
								"crs": crsSelected.join(),
								"opacity": "1.0",
								"allow_disable": true,
								"node_icon": ".whhg icon-layerorderdown",
								"title": st.oWMSInfo.serviceTitle
							};
							return layerOptions;
						}
					}
				},

				/**
				* Get common CRS from selected layers
				*/
				"_fnGetCommonCRS" : function (aSelectedLayers){
				// get the common crs for layers selected
				var st = this._state;
					var aCommonCRS = [];
					for(i in aSelectedLayers){
						var layer = st.oWMSInfo.layers[aSelectedLayers[i]]
						if(layer){
							if(aCommonCRS.length != 0 ){
								// add only different
								aCommonCRS = aCommonCRS.filter(function(el) {
								    return layer.crs.indexOf(el) != -1
								});
							}else{
								aCommonCRS = layer.crs;
							}
						}
					}
					return aCommonCRS;
				},

				/**
				 *  Get layer id
				 */
				"_fnGetLayerId" : function() {
					var st = this._state;
					return st.oWMSInfo.id.toString();

				},

				/**
				 * Clean and restore the objects of the tab
				 */
				"_fnCleanUserLayerTab" : function() {
					var st = this._state;
					st.oWMSInfo = null;
					st.oTree = null;
				}

	});


	/**
	 * Register class to management tab of WMTS layer
	 */

	GvNIX_Map_Leaflet.USERLAYERTAB.wmts = function(sId, containerId, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.wmts) {
			alert("Warning: GvNIX_Map_Leaflet USERLAYERTAB wmts must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
			"sId" : sId,
			"title" : "",
			"path" : "",
			"containerId": containerId,
			"aCrs" : aCrs,
			"typeLayer" : "",
			"treeDivId" : null,
			"oTree" : null,
			"oWMTSInfo" : null,
			"fnOnSearchLayers" : null,
			"oUtil" : null,
			"aCrsSupported" : null,
			"msgLayersNotFound" : "Layers not found",
			"msgServerRequired" : "Server value is required",
			"msgLayersRequired" : "Select at least one layer",
			"titleSelectCrs" : "Select CRS:"

		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Tab type wmts. Class method declaration
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.wmts.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
				"_debug" : function(message) {
					var st = this._state;
					console.log("[UserLayerTab WMTS:" + st.sId + "] " + message);
				},

				// overwrite constructor to create leaflet layerGroup instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					st.treeDivId = s.tree_div_id;
					st.path = s.path;
					st.msgLayersNotFound = s.msg_layers_not_found;
					st.msgLayersRequired = s.msg_layers_required;
					st.msgServerRequired = s.msg_server_required;
					st.titleSelectCrs = s.title_select_crs;

					// set input with crs established in constructor
					if(st.aCrs){
						jQuery("#".concat(st.sId).concat("_map_crs_input")).val(st.aCrs);
						jQuery("#".concat(st.sId).concat("_map_crs")).show();
					}

					if (s.fn_search_layers) {
						st.fnOnSearchLayers = this.Util.getFunctionByName(
								s.fn_search_layers, jQuery.proxy(
										this.debug, this));
					}
				},

				/**
				 * Get selected layers of the tree
				 */
				"_fnGetSelectedLayers" : function() {
					var st = this._state;
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					if(st.oTree){
						var selectedNodes = st.oTree.getSelectedNodes();
						if(selectedNodes.length === 0){
							selectedNodes = false;
							this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgLayersRequired);
						}
					}else{
						selectedNodes = false;
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgLayersRequired);
					}
					return selectedNodes;
				},



				/**
				 * Get data from WMTS server indicated into server input
				 */
				"_fnGetDataFromServer" : function() {
					var st = this._state;

					// if crs isn't set, get all crs supported from server
					if(st.aCrs){
						this.__fnGetDataFromServer();
					}else{
						// get crs supported crs and draw a select with the result
						// of the request
						this._fnGetCrsFromServer();
					}
				},

				/**
				 * Get data from WMTS server indicated into server input
				 */
				"_fnOnChangeCrs" : function() {
					var st = this._state;

					// get value selected from select of supported crs
					var selectSupportedCrs = jQuery("#".concat(st.sId).concat("_crs"),"#".concat(st.containerId));

					if(selectSupportedCrs && selectSupportedCrs.length > 0){
						this.__fnGetDataFromServer(selectSupportedCrs.val());
					}

				},

				/**
				 * Get data from WMTS server indicated into server input
				 */
				"__fnGetDataFromServer" : function(crs) {
					var st = this._state;
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					var urlServ = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();
					var crsSelected = st.aCrs;
					var useCrsSelect = false;
					if(crs){
						crsSelected = crs;
						useCrsSelect = true;
					}
					if(urlServ){
						var params = { url: urlServ, crs: crsSelected, useCrsSelected: useCrsSelect };
						st.oUtil.startWaitMeAnimation(st.waitLabel);
						jQuery.ajax({
							url : st.path + "?findWmtsCapabilities",
							data: params,
							cache: false,
							success : function(element) {
								st.oUtil.stopWaitMeAnimation();
								st.oWMTSInfo = element;
								if(st.treeDivId)
								{
									if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
									}else{
										jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).show();
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
									}
									// Check if have any result
									if(element.layersTree != null && element.layersTree.length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree({
											source: element.layersTree,
											checkbox: true,
											selectMode: 1
										});
										st.oTree = jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("getTree");
									}else{
										st.oTree = null;
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).html(st.msgLayersNotFound);
									}
								}
							},
							error : function(object) {
								// clean tree and messages
								if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
									jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
								}
								jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
								jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
								// get the error message and put in after form
								jQuery("#".concat(st.sId).concat("_error_message"), "#".concat(st.containerId)).html(object.responseText);
								// stop wait animation
								st.oUtil.stopWaitMeAnimation();
								// show error console
								console.log('Se ha producido un error en la obtencion de las capas correspondientes al servidor introducido');
							}
				      });
					}else{
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgServerRequired);
					}

				},

				/**
				 * Get list of crs supported by server set by user into input
				 * server and create a select
				 */
				"_fnGetCrsFromServer" : function(){
					this.__fnGetCrsFromServer();
				},

				/**
				 * Get list of crs supported by server set by user into input
				 * server and create a select
				 */
				"__fnGetCrsFromServer" : function(){
					var st = this._state;
					var oThis = this;
					//clean div that contains select and errors
					jQuery("#".concat(st.sId).concat("_supported_crs"),"#".concat(st.containerId)).html("");
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					var urlServ = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();
					if(urlServ){
						var params = { url: urlServ};
						st.oUtil.startWaitMeAnimation(st.waitLabel);
						jQuery.ajax({
							url : st.path + "?findSupportedCrsWmts",
							data: params,
							cache: false,
							success : function(element) {
								st.oUtil.stopWaitMeAnimation();
								if(st.treeDivId)
								{
									if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
									}else{
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
									}
									jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
									// Check if have any result
									if(element){
										oThis._fnDrawSelectSupportedCrs(element,oThis);
										// launch get data from server with the first value selected
										oThis._fnOnChangeCrs();
									}else{
										st.oTree = null;
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).html(st.msgLayersNotFound);
									}
								}
							},
							error : function(object) {
								// clean tree and messages
								if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
									jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
								}
								jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
								jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
								// get the error message and put in after form
								jQuery("#".concat(st.sId).concat("_error_message"), "#".concat(st.containerId)).html(object.responseText);
								// stop wait animation
								st.oUtil.stopWaitMeAnimation();
								// show error console
								console.log('Se ha producido un error en la obtencion de las capas correspondientes al servidor introducido');
							}
				      });
					}else{
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgServerRequired);
					}
				},

				/**
				 * Generate select of supported crs by the server
				 */
				"_fnDrawSelectSupportedCrs" : function(aSupportedCrs,oThis){
					this.__fnDrawSelectSupportedCrs(aSupportedCrs,oThis);
				},

				/**
				 * Generate select of supported crs by the server
				 */
				"__fnDrawSelectSupportedCrs" : function(aSupportedCrs, oThis){
					var st = oThis._state;
					// set select crs
					var htmlCrsSelect = "";
					htmlCrsSelect = htmlCrsSelect.concat("<h5>");
					// Title multilanguage for select supported crs
					htmlCrsSelect = htmlCrsSelect.concat(st.titleSelectCrs);
					htmlCrsSelect = htmlCrsSelect.concat("</h5>");

					htmlCrsSelect = htmlCrsSelect.concat("<select id='").concat(st.sId).concat("_crs'");
					htmlCrsSelect = htmlCrsSelect.concat(" class='form-control form-control '>");
					for(i = 0; i < aSupportedCrs.length; i++){
						htmlCrsSelect = htmlCrsSelect.concat("<option value='");
						htmlCrsSelect = htmlCrsSelect.concat(aSupportedCrs[i]).concat("'");
						htmlCrsSelect = htmlCrsSelect.concat(">").concat(aSupportedCrs[i]);
						htmlCrsSelect = htmlCrsSelect.concat("</option>");
					}
					htmlCrsSelect = htmlCrsSelect.concat("</select>");

					// set the html in the tab
					var divSupportedCrs = jQuery("#".concat(st.sId).concat("_supported_crs"),"#".concat(st.containerId));
					divSupportedCrs.prepend(htmlCrsSelect);
					divSupportedCrs.show();

					var selectChangeFunction = jQuery("#".concat(st.sId).concat("_supported_crs"), "#".concat(st.containerId));
					selectChangeFunction.change(jQuery.proxy(oThis._fnOnChangeCrs, oThis));
				},

				/**
				 * Register actions to the different buttons of the
				 * tab
				 */
				"_fnRegisterButtonsAction" : function(){
					this._fnRegisterActionToButtonConnect();
				},

				/**
           		 * Generate the code necessary to add the selected layers into the map
           		 * Return false if it hasn't layers selected
				 */
				"_fnCreateLayersOptions" : function(layersSelected) {
					var st = this._state;
					var layerOptions = false;
					var crsSelected = [];
					if(layersSelected !== null && layersSelected.length > 0){
						// get layer selected and calculate its crs
						var layerSel = st.oWMTSInfo.layers[layersSelected[0].key];
						for(i in layerSel.tileMatrixSelected){
							var tileMatrixId = layerSel.tileMatrixSelected[i];
							crsSelected.push(st.oWMTSInfo.tileMatrixCrsSupported[tileMatrixId]);
						}
						// create layer option for selected layer
						// if starts with rootLayer, doesn't push it.
						layerOptions = {
							"layer_type": st.typeLayer,
							"layer" : layerSel.name,
						    "span": (st.oWMTSInfo.id.toString()).concat("_span"),
					        "url": st.oWMTSInfo.serviceUrl,
					        "version":st.oWMTSInfo.version,
					        "opacity": "1",
					        "allow_disable": true,
					        "service" : st.oWMTSInfo.serviceType,
					        "tilematrix_set" : layerSel.tileMatrixSelected[0],
					        "node_icon": ".whhg icon-layerorderup",
					        "format" : layerSel.formatSelected,
					        "title": layersSelected[0].title,
					        "mapTileMatrixCrs" : st.oWMTSInfo.tileMatrixCrsSupported,
					        "all_tilematrix_selected" : layerSel.tileMatrixSelected,
					        "all_crs_selected" :  crsSelected.join()
				        };
					}

					return layerOptions;
				},

				/**
				 *  Get layer id using layer options to complete the id
				 */
				"_fnGetLayerId" : function(layerOptions) {
					var st = this._state;
					return (st.oWMTSInfo.id.toString()).concat("_").concat(layerOptions.layer);

				},

				/**
				 * Clean and restore the objects of the tab
				 */
				"_fnCleanUserLayerTab" : function() {
					var st = this._state;
					st.oWMTSInfo = null;
					st.oTree = null;
				}

			});


	/**
	 * Register class to management tab of TILE layer
	 */

	GvNIX_Map_Leaflet.USERLAYERTAB.tile = function(sId, containerId, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.tile) {
			alert("Warning: GvNIX_Map_Leaflet USERLAYERTAB tile layer must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
			"sId" : sId,
			"title" : "",
			"containerId": containerId,
			"aCrs" : aCrs,
			"typeLayer" : "",
			"idLayer" : "",
			"nameLayer": "",
			"oUtil" : null,
			"msgTitleLayerRequired" : "Title of layer is required",
			"msgServerRequired" : "Server value is required"
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Tab type tile. Class method declaration
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.tile.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
				"_debug" : function(message) {
					var st = this._state;
					console.log("[UserLayerTab TILE:" + st.sId + "] " + message);
				},

				// overwrite constructor to create leaflet layerGroup instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var st = this._state;
					var s = this.s;
					st.msgTitleLayerRequired = s.msg_title_layer_required;
					st.msgServerRequired = s.msg_server_required;
				},

				/**
				 * Get the layer introduced into server input
				 */
				"_fnGetSelectedLayers" : function() {
					var st = this._state;
					var today = new Date();
					// Clear div for error messages
					this._fnClearErrorMessage("#".concat(st.sId).concat("_error_message"));
					var urlSelected = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();
					if(urlSelected){
						st.nameLayer = jQuery("#".concat(st.sId).concat("_name"), "#".concat(st.containerId)).val();
						if(st.nameLayer){
							st.idLayer = st.oUtil.getHashCode(urlSelected.concat(today.toString()));
						}else{
							// set required title message
							this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgTitleLayerRequired);
							urlSelected = false;
						}
					}
					else{
						// set required server message
						this._fnSetErrorMessage("#".concat(st.sId).concat("_error_message"),st.msgServerRequired);
						urlSelected = false;
					}
					return urlSelected;
				},

				/**
           		 * Generate the code necessary to add the selected layer into the map
				 */
				"_fnCreateLayersOptions" : function(layersSelected) {
					var st = this._state;

					var layerOptions = {
						"layer_type": st.typeLayer,
					    "span": st.idLayer.concat("_span"),
				        "url": layersSelected,
				        "opacity": "1",
				        "allow_disable": true,
				        "node_icon": "/resources/images/tile_layer_icon.jpg",
				        "title": st.nameLayer
				    };

					return layerOptions;
				},

				/**
				 * Get layer id
				 */
				"_fnGetLayerId" : function() {
					var st = this._state;
					return (st.idLayer);
				},

			});

	/**
	 * Register class to management tab of WMS layer
	 */

	GvNIX_Map_Leaflet.USERLAYERTAB.wms_wizard = function(sId, containerId, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.wms_wizard) {
			alert("Warning: GvNIX_Map_Leaflet  USERLAYERTAB wms_wizard must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
			"sId" : sId,
			"title" : "",
			"containerId": containerId,
			"path" : "",
			"typeLayer" : "",
			"treeDivId" : null,
			"aCrs" : aCrs,
			"oWMSInfo" : null,
			"oTree" : null,
			"fnOnSearchLayers" : null,
			"oUtil" : null,
			"tableStylesTitleLayer" : "Layer",
			"tableStylesTitleStyles" : "Styles",
			"msgLayersNotFound" : "Layers not found",
			"msgServerRequired" : "Server value is required",
			"msgLayersRequired" : "Select at least one layer",
			"msgReviseStyles" : "Styles values have changed, please check the selected values",
			"msgConnectRequired" : "Establish the connexion to the server first to get the information and layers of this one",
			"msgSupportError" : "The server doesn't support CRS or formats established",
			"msgCrsSupported" : "Supported CRS: ",
			"msgFormatsSupported" : "Supported Formats: ",
			"msgIncompatibleLayers" : "The layers selected are incompatible, please select layers with common crs",
			"titleFormat" : "Select Format",
			"textDefaultStyle" : "Default Style",
			"textWithoutStyles" : "Without styles",
			"format" : null,
			"wizard" : null,
			"oldSelectedLayers" : null, // set temp layers selected to refresh styles
			"wizardNextLabel" : "Next",
			"wizardPreviousLabel" : "Previous",
			"waitLabel" : "Loading..."


		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Tab type wms-wizard. Class method declaration
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.wms_wizard.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
				"_debug" : function(message) {
					var st = this._state;
					console.log("[UserLayerTab WMS-WIZARD:" + st.sId + "] " + message);
				},

				// overwrite constructor to create wms_wizard instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					// Get id of the tree when we are going to paint layers to
					// select
					st.treeDivId = s.tree_div_id;
					st.path = s.path;
					// Set error messages and titles
					st.msgLayersNotFound = s.msg_layers_not_found;
					st.msgLayersRequired = s.msg_layers_required;
					st.msgServerRequired = s.msg_server_required;
					st.msgReviseStyles = s.msg_revise_styles;
					st.msgConnectRequired = s.msg_connect_required;
					st.msgSupportError = s.msg_support_error;
					st.msgCrsSupported = s.msg_crs_supported;
					st.msgFormatsSupported = s.msg_formats_supported;
					st.msgIncompatibleLayers = s.msg_incompatible_layers;
					st.tableStylesTitleLayer = s.table_styles_title_layer;
					st.tableStylesTitleStyles = s.table_styles_title_styles;
					st.textDefaultStyle = s.text_default_style;
					st.textWithoutStyles = s.text_without_style;
					st.titleFormat = s.title_format;
					st.wizardNextLabel = s.wizard_next_label;
					st.wizardPreviousLabel = s.wizard_previous_label;


					//set format
					st.format = s.format;

					// Get if the user has his own implementation to connect to the server
					// and get the layers
					if (s.fn_search_layers) {
						st.fnOnSearchLayers = this.Util.getFunctionByName(
								s.fn_search_layers, jQuery.proxy(
										this.debug, this));
					}

				},

				/**
				 * Register actions to the different buttons of the
				 * tab
				 */
				"_fnRegisterButtonsAction" : function(){
					this._fnRegisterActionToButtonResetServer();
				},

				/**
				 * Restore the objects of the tab and enable the input when you
				 * set the server
				 */
				"_fnResetServer" : function() {
					var st = this._state;
					jQuery("#".concat(st.sId).concat("_changeserver_button"), "#".concat(st.containerId)).hide();
					jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).prop('disabled', false);
					this._fnCleanUserLayerTab();

				},

				/**
				 * Get selected layers of the tree
				 */
				"_fnGetSelectedLayers" : function() {
					var st = this._state;
					this._fnClearErrorMessage("#".concat(st.sId).concat("_tree_error"));
					if(st.oTree){
						var selectedNodes = st.oTree.getSelectedNodes();
						if(selectedNodes.length === 0){
							selectedNodes = false;
						}
					}else{
						selectedNodes = false;
					}

					if(selectedNodes == false){
						this._fnSetErrorMessage("#".concat(st.sId).concat("_tree_error"),st.msgLayersRequired);
						//go to step where can select layers
						st.wizard.steps("goToStep",2);
					}

					return selectedNodes;
				},

				/**
				 * Get data from WMS server indicated into server input
				 */
				"_fnGetDataFromServer" : function(isLoadingData, oData) {
					return this.__fnGetDataFromServer(isLoadingData, oData);
				},

				/**
				 * Get data from WMS server indicated into server input
				 * Return false in case of error
				 */
				"__fnGetDataFromServer" : function(isLoadingData, oData) {
					var st = this._state;
					//Clean elements of styles and format
					var divStyles = jQuery("#".concat(st.sId).concat("_styles"),"#".concat(st.containerId));
					// Clear the content of the div
					divStyles.html("");
					var divFormats = jQuery("#".concat(st.sId).concat("_formats"),"#".concat(st.containerId));
					// Clear the content of the div
					divFormats.html("");

					// clean div that contains error messages
					this._fnClearErrorMessage("#".concat(st.sId).concat("_connection_error"));

					if(isLoadingData !== true){
						isLoadingData = false;
					}

					var urlServ = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();
					if(urlServ){
						st.oUtil.startWaitMeAnimation(st.waitLabel);
						var params = { url: urlServ, wizard: "true", crs: st.aCrs };
						jQuery.ajax({
							url : st.path + "?findWmsCapabilities",
							data: params,
							cache: false,
							success : function(element) {
								st.oWMSInfo = element;
								// Show server info
								jQuery("#".concat(st.sId).concat("_server_info"), "#".concat(st.containerId)).show();

								if(st.oWMSInfo.version){
									jQuery("#".concat(st.sId).concat("_version_p"), "#".concat(st.containerId)).html(st.oWMSInfo.version);
									jQuery("#".concat(st.sId).concat("_version_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_version_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMSInfo.serviceTitle){
									jQuery("#".concat(st.sId).concat("_title_p"), "#".concat(st.containerId)).html(st.oWMSInfo.serviceTitle);
									jQuery("#".concat(st.sId).concat("_title_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_title_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMSInfo.serviceAbstract){
									jQuery("#".concat(st.sId).concat("_description_p"), "#".concat(st.containerId)).html(st.oWMSInfo.serviceAbstract);
									jQuery("#".concat(st.sId).concat("_description_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_description_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMSInfo.crsSupported){
									jQuery("#".concat(st.sId).concat("_crs_supported_p"), "#".concat(st.containerId)).html(st.oWMSInfo.crsSupported.join("</BR>"));
									jQuery("#".concat(st.sId).concat("_crs_supported_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_crs_supported_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMSInfo.formatsSupported){
									jQuery("#".concat(st.sId).concat("_format_supported_p"), "#".concat(st.containerId)).html(st.oWMSInfo.formatsSupported.join("</BR>"));
									jQuery("#".concat(st.sId).concat("_format_supported_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_format_supported_div"), "#".concat(st.containerId)).hide();
								}

								//show tree
								if(st.treeDivId)
								{
									// clean tree and label
									if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
									}else{
										jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).show();
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
									}
									// Check if have any result and create the tree
									if(element.layersTree != null && element.layersTree.length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree({
											source: element.layersTree,
											checkbox: true,
											selectMode: 3
										});

										st.oTree = jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("getTree");
									}else{
										st.oTree = null;
										// set empty tree message
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).html(st.msgLayersNotFound);
									}
								}

								// disable input, show change server button and go to step 1
								jQuery("#".concat(st.sId).concat("_changeserver_button"), "#".concat(st.containerId)).show();
								jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).prop('disabled', true);
								st.wizard.steps("goToStep",1);

								// if loading data is true, continue with next steps and set
								// the elements of the forms
								if(isLoadingData){
									// get array of layers selected and set them
									var aLayersSel =  oData.layerSelected.split(",");
									for(i = 0; i < aLayersSel.length; i++){
										var node = st.oTree.getNodeByKey(aLayersSel[i]);
										if(node){
											node.setSelected();
										}
									}
									// go to step 2 for activate it
									st.wizard.steps("goToStep",2);

									// go to step 3 for draw the form and activate it
									st.wizard.steps("goToStep",3);
									// get array of styles selected and set them
									var aStylesSel =  oData.styles.split(",");
									for(j = 0; j < aLayersSel.length; j++){
										var nameLayer = aLayersSel[j];
										for(i = 0; i < aStylesSel.length; i++){
											var checkName = "^".concat(nameLayer).concat("_");
											if(aStylesSel[i].match(checkName)){
												var valueStyleSelected = aStylesSel[i].substring(nameLayer.length+1,aStylesSel[i].length);
												jQuery(("input[name='").concat(st.sId).concat("_").concat(nameLayer).concat("']").concat("[value='").concat(valueStyleSelected).concat("']"),
														"#".concat(st.containerId)).prop("checked", true);
											}
										}
									}
									// return to initial step
									st.wizard.steps("goToStep",0);
								}
								// stop message loading...
								st.oUtil.stopWaitMeAnimation();
							},
							error : function(object) {
								jQuery("#".concat(st.sId).concat("_server_info"), "#".concat(st.containerId)).hide();

								// clean tree and messages
								if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
									jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
								}
								jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
								jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
								// get the error message and put in after form
								jQuery("#".concat(st.sId).concat("_connection_error"), "#".concat(st.containerId)).html(object.responseText);
								// stop wait animation
								st.oUtil.stopWaitMeAnimation();
								// show error console
								console.log('Se ha producido un error en la obtencion de las capas correspondientes al servidor introducido');
								// with error return false
								st.wizard.steps("goToStep",0);
							}
						});
					}else{
						// with error return false
						this._fnSetErrorMessage("#".concat(st.sId).concat("_connection_error"),st.msgServerRequired);
					}
				},


				/**
				 * Register the function to call when click on button connect
				 */
				"fnCreateWizard" : function() {
					this._fnCreateWizard();
				},

				/**
				 * Register the function to call when click on button connect
				 */
				"_fnCreateWizard" : function() {
					 var st = this._state;
					 var callbackFunction = jQuery.proxy(this._fnChangeStepControl, this);
					 st.wizard = jQuery("#".concat(st.sId),"#".concat(st.containerId)).steps({
						    headerTag: "h3",
						    bodyTag: "section",
						    transitionEffect: "slide",
						    enableFinishButton : false,
						    onStepChanging: function (event, currentIndex, newIndex)
						    {
						    	return callbackFunction(event, currentIndex, newIndex);
						    },
					 		labels: {
					 			next : st.wizardNextLabel,
					 			previous: st.wizardPreviousLabel
					 		}
						});
					 // Create wizard cleans input value
					 if(st.aCrs){
						jQuery("#".concat(st.sId).concat("_map_crs_input"),"#".concat(st.containerId)).val(st.aCrs);
   					 }
				},

				/**
				 * Control the event that happens when the user changes wizard tab
				 */
				"_fnChangeStepControl" : function (event, currentIndex, newIndex)
			    {
			    	return this.__fnChangeStepControl(event, currentIndex, newIndex);
			    },

			    /**
				 * Control the event that happens when the user changes wizard tab
				 */
				"__fnChangeStepControl" : function (event, currentIndex, newIndex)
			    {
			    	var st = this._state;
			    	// check if the user has gotten an object of the server connection to continue
			    	if(currentIndex == 0 && st.oWMSInfo == null && newIndex != 0){
						if(st.fnOnSearchLayers){
							return st.fnOnSearchLayers();
						}else{
							this._fnGetDataFromServer();
							this._fnClearErrorMessage("#".concat(st.sId).concat("_info_error"));
							return false;
						}
			    	}

			    	// check if formats and crs are supported by the server
			    	if(newIndex > 1){
			    		if((st.aCrs != null &&
			    				(!st.oWMSInfo.crsSelected || (st.oWMSInfo.crsSelected && st.oWMSInfo.crsSelected.length == 0))
			    		    ) || !st.oWMSInfo.formatSelected){
			    			var errorMsg = st.msgSupportError.concat("</BR>");
			    			if(st.aCrs != null){
			    				errorMsg = errorMsg.concat(st.msgCrsSupported).concat(" ").concat(st.aCrs);
			    				errorMsg = errorMsg.concat("</BR>");
			    			}
			    			var supportedFormat = st.format;
			    			if(!supportedFormat){
			    				supportedFormat = "image/png*, image/jpeg*";
			    			}
			    			errorMsg = errorMsg.concat(st.msgFormatsSupported).concat(" ").concat(supportedFormat);
			    			this._fnSetErrorMessage("#".concat(st.sId).concat("_info_error"),errorMsg);
			    			st.wizard.steps("goToStep",1);
			    			return false;
			    		}else{
			    			this._fnClearErrorMessage("#".concat(st.sId).concat("_info_error"));
			    		}
			    	}

			    	// if we are in the step select layers push 'next'
			    	if(currentIndex == 2 && newIndex > currentIndex){
			    		this._fnClearErrorMessage("#".concat(st.sId).concat("_tree_error"));
			    		var selectedLayers = this._fnGetSelectedLayers();
			    		if(selectedLayers === false){
			    			return false;
			    		}else{
			    			if(!st.oldSelectedLayers){
			    				// set oldSelectedLayers
			    				st.oldSelectedLayers = selectedLayers;
			    				// draw the form to select styles of the layers
		    					this._fnDrawFormStylesLayer(selectedLayers);
			    			}else{
			    				// check if selected layers have changed
			    				if(!(jQuery(selectedLayers).not(st.oldSelectedLayers).length === 0 &&
			    						jQuery(st.oldSelectedLayers).not(selectedLayers).length === 0)){
			    					// set oldSelectedLayers
			    					st.oldSelectedLayers = selectedLayers;
			    					// draw the form to select styles of the layers
			    					this._fnDrawFormStylesLayer(selectedLayers);
			    				}
			    			}
			    		}
			    	}
			    	if(currentIndex == 3 || newIndex == 3){
			    		// clean error message of step 3 (styles)
			    		this._fnClearErrorMessage("#".concat(st.sId).concat("_styles_error"));
			    		var selectedLayers = this._fnGetSelectedLayers();
			    		if(selectedLayers === false){
			    			return false;
			    		}else{
			    			// check if selected layers have changed
			    			if(!(jQuery(selectedLayers).not(st.oldSelectedLayers).length === 0 &&
	    						jQuery(st.oldSelectedLayers).not(selectedLayers).length === 0)){
			    				this._fnDrawFormStylesLayer(selectedLayers);
			    				// set oldSelectedLayers
		    					st.oldSelectedLayers = selectedLayers;
			    				// show error message to user
		    					this._fnSetErrorMessage("#".concat(st.sId).concat("_styles_error"),st.msgReviseStyles);
			    			}
			    		}
			    	}

			    	return true;
			    },

			    /**
				 * Draw a form into wizard tab 'styles' that depends of
				 * selected layers in wizard tab 'select layers'
				 */
			    "_fnDrawFormStylesLayer" : function (aSelectedLayers)
			    {
			    	return this.__fnDrawFormStylesLayer(aSelectedLayers);
			    },

			    /**
				 * Draw a form into wizard tab 'styles' that depends of
				 * selected layers in wizard tab 'select layers'
				 */
				"__fnDrawFormStylesLayer" : function (aSelectedLayers)
			    {
					var st = this._state;
					var divStyles = jQuery("#".concat(st.sId).concat("_styles"),"#".concat(st.containerId));
					// Clear the content of the div
					divStyles.html("");
					var htmlForStylesTab = "<table class='table'><thead>";
					htmlForStylesTab = htmlForStylesTab.concat("<th>").concat(st.tableStylesTitleLayer).concat("</th>");
					htmlForStylesTab = htmlForStylesTab.concat("<th>").concat(st.tableStylesTitleStyles).concat("</th>");
					htmlForStylesTab = htmlForStylesTab.concat("</thead><tbody>");
					for(i in aSelectedLayers){
						var layerSel = aSelectedLayers[i];
						// Check the first style of every layer
						var checkStyle = true;
						// check if the layer is root
						if(layerSel.key.indexOf("rootLayer_") !== 0){
							var layer = st.oWMSInfo.layers[layerSel.key]
							if(layer){
								htmlForStylesTab = htmlForStylesTab.concat("<tr>");
								// Create text and radio buttons for each layer
								// Create h5 for title
								htmlForStylesTab = htmlForStylesTab.concat("<td>");
								htmlForStylesTab = htmlForStylesTab.concat("<h5>");
								htmlForStylesTab = htmlForStylesTab.concat(layer.title);
								htmlForStylesTab = htmlForStylesTab.concat("</h5>");
								htmlForStylesTab = htmlForStylesTab.concat("</td>");
								// Create raddion button for each style
								htmlForStylesTab = htmlForStylesTab.concat("<td>");
								if(layer.styles.length > 0){
									for(j in layer.styles){
										var style = layer.styles[j];
										htmlForStylesTab = htmlForStylesTab.concat("<div class='radio'>");
										htmlForStylesTab = htmlForStylesTab.concat("<label>");
										htmlForStylesTab = htmlForStylesTab.concat("<input type='radio' name='").concat(st.sId).concat("_").concat(layer.name).concat("'");
										htmlForStylesTab = htmlForStylesTab.concat(" value='").concat(style.name).concat("'");
										if(checkStyle){
											htmlForStylesTab = htmlForStylesTab.concat(" checked ");
											checkStyle = false;
										}
										var title = style.title.toLowerCase();
										if(title == "default"){
											title = st.textDefaultStyle;
										}
										htmlForStylesTab = htmlForStylesTab.concat(">").concat(title);
										htmlForStylesTab = htmlForStylesTab.concat("</label>");
										htmlForStylesTab = htmlForStylesTab.concat("</div>");

									}
								}else{
									htmlForStylesTab = htmlForStylesTab.concat("<em>");
									htmlForStylesTab = htmlForStylesTab.concat(st.textWithoutStyles);
									htmlForStylesTab = htmlForStylesTab.concat("</em>");
								}
								htmlForStylesTab = htmlForStylesTab.concat("</td>");
								htmlForStylesTab = htmlForStylesTab.concat("</tr>");
							}
						}
					}
					htmlForStylesTab = htmlForStylesTab.concat("</tbody></table>");
					divStyles.prepend(htmlForStylesTab);
			    },

			    /**
				 * Get the styles selected in wizard tab 'styles'
				 */
			    "_fnGetSelectedStylesLayer" : function (aSelectedLayers)
			    {
			    	return this.__fnGetSelectedStylesLayer(aSelectedLayers);
			    },

			    /**
				 * Get the styles selected in wizard tab 'styles'
				 */
				"__fnGetSelectedStylesLayer" : function (aSelectedLayers)
			    {
					var st = this._state;
					var styles = {};
					var valueStyle = [];
					var valueStyleWithLayerId = [];
					for(i in aSelectedLayers){
						var keyLayerSelected = aSelectedLayers[i];
						var valueSelected = jQuery(("input[name='").concat(st.sId).concat("_").concat(keyLayerSelected).concat("']:checked"),
								"#".concat(st.containerId)).val();
						valueStyle.push(valueSelected);
						valueStyleWithLayerId.push(keyLayerSelected.concat("_").concat(valueSelected));
					}
					styles = {
							   "values" : valueStyle.join(),
							   "values_with_id" : valueStyleWithLayerId.join()
							 };
					return styles;


			    },

			    /**
			     * Get common CRS from selected layers
			     */
			    "_fnGetCommonCRS" : function (aSelectedLayers){
			    	// get the common crs for layers selected
			    	var st = this._state;
					var aCommonCRS = [];
					for(i in aSelectedLayers){
						var layer = st.oWMSInfo.layers[aSelectedLayers[i]]
						if(layer){
							if(aCommonCRS.length != 0 ){
								// add only different
								aCommonCRS = aCommonCRS.filter(function(el) {
								    return layer.crs.indexOf(el) != -1
								});
							}else{
								aCommonCRS = layer.crs;
							}
						}
					}
					return aCommonCRS;
			    },


				/**
				 * Generate the code necessary to add the selected layers into the map
				 * Return false if it hasn't layers selected or generates an error
				 */
				"_fnCreateLayersOptions" : function(layersSelected) {
					var st = this._state;
					var keysLayersSel = [];
					// check if layersSeleced is false because
					// _fnGetSelectedLayers is false if it had an error
					if(layersSelected !== false){
	    				if(!(jQuery(layersSelected).not(st.oldSelectedLayers).length === 0 &&
	    						jQuery(st.oldSelectedLayers).not(layersSelected).length === 0)){
	    					// set oldSelectedLayers
	    					st.oldSelectedLayers = layersSelected;
	    					// draw the form to select styles of the layers
	    					this._fnDrawFormStylesLayer(layersSelected);
	    					// If layers have changed, the values of the step 3
	    					// will have changed also and therefore the user must inspect and
	    					// select new values in this tab.
	    					st.wizard.steps("goToStep",3);
	    					// show message to user
	    					this._fnSetErrorMessage("#".concat(st.sId).concat("_styles_error"),st.msgReviseStyles);
							return false;
		    			}

						// get the selected layers
						for(i in layersSelected){
							var layerSel = layersSelected[i];
							// check if the layer is root
							if(layerSel.key.indexOf("rootLayer_") !== 0 &&
									layerSel.unselectable !== true){
								var layer = st.oWMSInfo.layers[layerSel.key]
								if(layer){
									keysLayersSel.push(layerSel.key);
								}
							}
						}


						// get styles selected
						var stylesSelected = this._fnGetSelectedStylesLayer(keysLayersSel);

						var crsCommonSelected = this._fnGetCommonCRS(keysLayersSel);
						if(crsCommonSelected.length == 0){
							// show error and go to step 2 (select layers)
							st.wizard.steps("goToStep",2);
	    					// show message to user because he has selected
							// incompatible layers
	    					this._fnSetErrorMessage("#".concat(st.sId).concat("_tree_error"),st.msgIncompatibleLayers);
							return false;
						}else{
							// get the common crs between selected layers and
							// selected crs by the server
							var serverCRS = st.oWMSInfo.crsSelected;
							crsSelected = serverCRS.filter(function(el) {
							    return crsCommonSelected.indexOf(el) != -1
							});

							if(crsSelected.length == 0){
								// show error and go to step 2 (select layers)
								st.wizard.steps("goToStep",2);
								// show message to user because he has selected
								// incompatible layers
		    					this._fnSetErrorMessage("#".concat(st.sId).concat("_tree_error"),st.msgIncompatibleLayers);
								return false;
							}else{
								// generate root layer options and put selected layers
								// into layers parameter
								var layerOptions = {
									"layer_type": st.typeLayer,
								    "span": (st.oWMSInfo.id.toString()).concat("_span"),
							        "url": st.oWMSInfo.serviceUrl,
							        "layers":keysLayersSel.join(),
							        "format": st.oWMSInfo.formatSelected,
							        "transparent":"true",
							        "version":st.oWMSInfo.version,
							        "crs": crsSelected.join(),
								    "opacity": "1.0",
							        "styles" : stylesSelected.values,
							        "styles_with_id" : stylesSelected.values_with_id,
							        "allow_disable": true,
							        "node_icon": ".whhg icon-layerorderdown",
							        "title": st.oWMSInfo.serviceTitle
						        };
								return layerOptions;
							}
						}
					}else{
						return false;
					}
				},

				/**
				 *  Get layer id
				 */
				"_fnGetLayerId" : function() {
					var st = this._state;
					return st.oWMSInfo.id.toString();

				},

				/**
				 * Clean and restore the objects of the tab
				 */
				"_fnCleanUserLayerTab" : function() {
					var st = this._state;
					st.oWMSInfo = null;
					st.oTree = null;
				},

				/**
				 * Set layers, styles, crs, etc. from object oDataToSet
				 */
				"_fnSetData" : function(oData) {
					var st = this._state;
					jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val(oData.url);
					this._fnGetDataFromServer(true, oData);
				}

	});

	/**
	 * Register class to management tab of WMTS layer
	 */

	GvNIX_Map_Leaflet.USERLAYERTAB.wmts_wizard = function(sId, containerId, aCrs, options) {
		// Check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.wmts_wizard) {
			alert("Warning: GvNIX_Map_Leaflet  USERLAYERTAB wmts_wizard must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
			"sId" : sId,
			"title" : "",
			"containerId": containerId,
			"path" : "",
			"typeLayer" : "",
			"treeDivId" : null,
			"aCrs" : aCrs,
			"oWMTSInfo" : null,
			"oTree" : null,
			"fnOnSearchLayers" : null,
			"oUtil" : null,
			"msgLayersNotFound" : "Layers not found",
			"msgServerRequired" : "Server value is required",
			"msgLayersRequired" : "Select at least one layer",
			"msgConnectRequired" : "Establish the connexion to the server first to get the information and layers of this one",
			"msgSupportError" : "The server doesn't support CRS or formats established",
			"msgCrsSupported" : "Supported CRS: ",
			"msgFormatsSupported" : "Supported Formats: ",
			"format" : null,
			"wizard" : null

		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};


	/**
	 * Tab type wms-wizard. Class method declaration
	 */
	GvNIX_Map_Leaflet.USERLAYERTAB.wmts_wizard.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
				"_debug" : function(message) {
					var st = this._state;
					console.log("[UserLayerTab WMTS-WIZARD:" + st.sId + "] " + message);
				},

				// overwrite constructor to create wmts_wizard instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					// Get id of the tree when we are going to paint layers to
					// select
					st.treeDivId = s.tree_div_id;
					st.path = s.path;
					// Set error messages and titles
					st.msgLayersNotFound = s.msg_layers_not_found;
					st.msgLayersRequired = s.msg_layers_required;
					st.msgServerRequired = s.msg_server_required;
					st.msgConnectRequired = s.msg_connect_required;
					st.msgSupportError = s.msg_support_error;
					st.msgCrsSupported = s.msg_crs_supported;
					st.msgFormatsSupported = s.msg_formats_supported;
					st.wizardNextLabel = s.wizard_next_label;
					st.wizardPreviousLabel = s.wizard_previous_label;
					//set format
					st.format = s.format;

					// Get if the user has his own implementation to connect to the server
					// and get the layers
					if (s.fn_search_layers) {
						st.fnOnSearchLayers = this.Util.getFunctionByName(
								s.fn_search_layers, jQuery.proxy(
										this.debug, this));
					}

				},

				/**
				 * Get selected layers of the tree
				 */
				"_fnGetSelectedLayers" : function() {
					var st = this._state;
					this._fnClearErrorMessage("#".concat(st.sId).concat("_tree_error"));
					if(st.oTree){
						var selectedNodes = st.oTree.getSelectedNodes();
						if(selectedNodes.length === 0){
							selectedNodes = false;
						}
					}else{
						selectedNodes = false;
					}

					if(selectedNodes == false){
						this._fnSetErrorMessage("#".concat(st.sId).concat("_tree_error"),st.msgLayersRequired);
						//go to step where can select layers
						st.wizard.steps("goToStep",2);
					}

					return selectedNodes;
				},

				/**
				 * Get data from WMTS server indicated into server input
				 */
				"_fnGetDataFromServer" : function(isLoadingData, oData) {
					this.__fnGetDataFromServer(isLoadingData, oData);
				},

				/**
				 * Get data from WMTS server indicated into server input
				 * Return false in case of error
				 */
				"__fnGetDataFromServer" : function(isLoadingData, oData) {
					var st = this._state;

					var divCrs = jQuery("#".concat(st.sId).concat("_crs"),"#".concat(st.containerId));
					// Clear the content of the div
					divCrs.html("");
					// clean div that contains error messages
					this._fnClearErrorMessage("#".concat(st.sId).concat("_connection_error"));

					if(isLoadingData !== true){
						isLoadingData = false;
					}

					var urlServ = jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val();

					if(urlServ){
						st.oUtil.startWaitMeAnimation(st.waitLabel);
						var params = { url: urlServ, wizard: "true", crs: st.aCrs, useCrsSelected: false};
						jQuery.ajax({
							url : st.path + "?findWmtsCapabilities",
							data: params,
							cache: false,
							success : function(element) {
								st.oWMTSInfo = element;

								// Show server info
								jQuery("#".concat(st.sId).concat("_server_info"), "#".concat(st.containerId)).show();

								if(st.oWMTSInfo.version){
									jQuery("#".concat(st.sId).concat("_version_p"), "#".concat(st.containerId)).html(st.oWMTSInfo.version);
									jQuery("#".concat(st.sId).concat("_version_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_version_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMTSInfo.serviceTitle){
									jQuery("#".concat(st.sId).concat("_title_p"), "#".concat(st.containerId)).html(st.oWMTSInfo.serviceTitle);
									jQuery("#".concat(st.sId).concat("_title_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_title_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMTSInfo.serviceAbstract){
									jQuery("#".concat(st.sId).concat("_description_p"), "#".concat(st.containerId)).html(st.oWMTSInfo.serviceAbstract);
									jQuery("#".concat(st.sId).concat("_description_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_description_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMTSInfo.crsSupported){
									jQuery("#".concat(st.sId).concat("_crs_supported_p"), "#".concat(st.containerId)).html(st.oWMTSInfo.crsSupported.join("</BR>"));
									jQuery("#".concat(st.sId).concat("_crs_supported_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_crs_supported_div"), "#".concat(st.containerId)).hide();
								}

								if(st.oWMTSInfo.formatsSupported){
									jQuery("#".concat(st.sId).concat("_format_supported_p"), "#".concat(st.containerId)).html(st.oWMTSInfo.formatsSupported.join("</BR>"));
									jQuery("#".concat(st.sId).concat("_format_supported_div"), "#".concat(st.containerId)).show();
								}else{
									jQuery("#".concat(st.sId).concat("_format_supported_div"), "#".concat(st.containerId)).hide();
								}

								if(st.treeDivId)
								{
									// clean tree and label
									if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
									}else{
										jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).show();
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
									}
									// Check if have any result and create the tree
									if(element.layersTree != null && element.layersTree.length > 0){
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree({
											source: element.layersTree,
											checkbox: true,
											selectMode: 1
										});

										st.oTree = jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("getTree");
									}else{
										st.oTree = null;
										// set empty tree message
										jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).html(st.msgLayersNotFound);
									}
								}
								// disable input, show change server button and go to step 1
								jQuery("#".concat(st.sId).concat("_changeserver_button"), "#".concat(st.containerId)).show();
								jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).prop('disabled', true);
								st.wizard.steps("goToStep",1);

								// if loading data is true, continue with next steps and set
								// the elements of the forms
								if(isLoadingData){
									// get array of layers selected and set them
									var layersSel =  oData.layerSelected;
									var node = st.oTree.getNodeByKey(layersSel);
									if(node){
										node.setSelected();
									}
									// go to step 2 for activate it
									st.wizard.steps("goToStep",2);
									// return to initial step
									st.wizard.steps("goToStep",0);
								}
								// stop message loading...
								st.oUtil.stopWaitMeAnimation();
							},
							error : function(object) {
								jQuery("#".concat(st.sId).concat("_server_info"), "#".concat(st.containerId)).hide();

								// clean tree and messages
								if (jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).children().length > 0){
									jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).fancytree("destroy");
								}
								jQuery("#".concat(st.treeDivId), "#".concat(st.containerId)).empty();
								jQuery("#".concat(st.treeDivId).concat("_label"), "#".concat(st.containerId)).hide();
								// get the error message and put in after form
								jQuery("#".concat(st.sId).concat("_connection_error"), "#".concat(st.containerId)).html(object.responseText);
								// stop wait animation
								st.oUtil.stopWaitMeAnimation();
								// show error console
								console.log('Se ha producido un error en la obtencion de las capas correspondientes al servidor introducido');
							}
						});
					}else{
						// with error return false
						this._fnSetErrorMessage("#".concat(st.sId).concat("_connection_error"),st.msgServerRequired);
					}

				},

				/**
				 * Register actions to the different buttons of the
				 * tab
				 */
				"_fnRegisterButtonsAction" : function(){
					this._fnRegisterActionToButtonResetServer();
				},

				/**
				 * Restore the objects of the tab and enable the input when you
				 * set the server
				 */
				"_fnResetServer" : function() {
					var st = this._state;
					jQuery("#".concat(st.sId).concat("_changeserver_button"), "#".concat(st.containerId)).hide();
					jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).prop('disabled', false);
					this._fnCleanUserLayerTab();

				},

				/**
				 * Register the function to call when click on button connect
				 */
				"fnCreateWizard" : function() {
					this._fnCreateWizard();
				},

				/**
				 * Register the function to call when click on button connect
				 */
				"_fnCreateWizard" : function() {
					 var st = this._state;
					 var callbackFunction = jQuery.proxy(this._fnChangeStepControl, this);
					 st.wizard = jQuery("#".concat(st.sId),"#".concat(st.containerId)).steps({
						    headerTag: "h3",
						    bodyTag: "section",
						    transitionEffect: "slide",
						    enableFinishButton : false,
						    onStepChanging: function (event, currentIndex, newIndex)
						    {
						    	return callbackFunction(event, currentIndex, newIndex);
						    },
					 		labels: {
					 			next : st.wizardNextLabel,
					 			previous: st.wizardPreviousLabel
					 		}
						});
					 // Create wizard cleans input value
					 if(st.aCrs){
						jQuery("#".concat(st.sId).concat("_map_crs_input"),"#".concat(st.containerId)).val(st.aCrs);
   					 }
				},

				/**
				 * Control the event that happens when the user changes wizard tab
				 */
				"_fnChangeStepControl" : function (event, currentIndex, newIndex)
			    {
			    	return this.__fnChangeStepControl(event, currentIndex, newIndex);
			    },

			    /**
				 * Control the event that happens when the user changes wizard tab
				 */
				"__fnChangeStepControl" : function (event, currentIndex, newIndex)
			    {
			    	var st = this._state;
			    	// check if the user has gotten an object of the server connection to continue
			    	if(currentIndex == 0 && st.oWMTSInfo == null && newIndex != 0){
						if(st.fnOnSearchLayers){
							return st.fnOnSearchLayers();
						}else{
							this._fnGetDataFromServer();
							this._fnClearErrorMessage("#".concat(st.sId).concat("_info_error"));
							return false;
						}
			    	}
			    	// check if formats and crs are supported by the server
			    	if(newIndex > 1){
			    		if((st.aCrs != null &&
			    				(!st.oWMTSInfo.tileMatrixSelectedId ||
			    				(st.oWMTSInfo.tileMatrixSelectedId && st.oWMTSInfo.tileMatrixSelectedId.length == 0))
			    		    ) || !st.oWMTSInfo.isFormatsSupported){
			    			var errorMsg = st.msgSupportError.concat("</BR>");
			    			if(st.aCrs != null){
			    				errorMsg = errorMsg.concat(st.msgCrsSupported).concat(" ").concat(st.aCrs);
			    				errorMsg = errorMsg.concat("</BR>");
			    			}
			    			var supportedFormat = "image/png*, image/jpeg*";
			    			errorMsg = errorMsg.concat(st.msgFormatsSupported).concat(" ").concat(supportedFormat);
			    			this._fnSetErrorMessage("#".concat(st.sId).concat("_info_error"),errorMsg);
			    			st.wizard.steps("goToStep",1);
			    			return false;
			    		}else{
			    			this._fnClearErrorMessage("#".concat(st.sId).concat("_info_error"));
			    		}
			    	}
			    	return true;
			    },

				/**
				 * Generate the code necessary to add the selected layers into the map
				 * Return false if it hasn't layers selected or generates an error
				 */
				"_fnCreateLayersOptions" : function(layersSelected) {
					var st = this._state;
					var crsSelected = [];
					// get layer selected and calculate its crs
					var layerSel = st.oWMTSInfo.layers[layersSelected[0].key];
					for(i in layerSel.tileMatrixSelected){
						var tileMatrixId = layerSel.tileMatrixSelected[i];
						crsSelected.push(st.oWMTSInfo.tileMatrixCrsSupported[tileMatrixId]);
					}
					// generate root layer options and put selected layers
					// into layers parameter
					var layerOptions = {
							"layer_type": st.typeLayer,
							"layer": layerSel.name,
							"span": (st.oWMTSInfo.id.toString()).concat("_span"),
					        "url": st.oWMTSInfo.serviceUrl,
					        "version":st.oWMTSInfo.version,
					        "opacity": "1",
					        "allow_disable": true,
					        "service" : st.oWMTSInfo.serviceType,
					        "mapTileMatrixCrs" : st.oWMTSInfo.tileMatrixCrsSupported,
					        "all_tilematrix_selected" : layerSel.tileMatrixSelected,
					        "tilematrix_set" : layerSel.tileMatrixSelected[0],
					        "format" : layerSel.formatSelected,
					        "all_crs_selected" :  crsSelected.join(),
					        "node_icon": ".whhg icon-layerorderup",
							"title": layersSelected[0].title,
					};
					return layerOptions;
				},

				/**
				 *  Get layer id
				 */
				"_fnGetLayerId" : function(layerOptions) {
					var st = this._state;
					return (st.oWMTSInfo.id.toString()).concat("_").concat(layerOptions.layer);

				},

				/**
				 * Clean and restore the objects of the tab
				 */
				"_fnCleanUserLayerTab" : function() {
					var st = this._state;
					st.oWMTSInfo = null;
					st.oTree = null;
				},

				/**
				 * Set layers, styles, crs, etc. from object oDataToSet
				 */
				"_fnSetData" : function(oData) {
					var st = this._state;
					jQuery("#".concat(st.sId).concat("_server_id"), "#".concat(st.containerId)).val(oData.url);
					this._fnGetDataFromServer(true, oData);
				}
	});

/**
   * Register class to management tab of SHAPE layer
   */

  GvNIX_Map_Leaflet.USERLAYERTAB.shape = function(sId, dialogId, aCrs, options) {
    // Sanity check that we are a new instance
    if (!this instanceof GvNIX_Map_Leaflet.USERLAYERTAB.shape) {
      alert("Warning: GvNIX_Map_Leaflet USERLAYERTAB shape layer must be initialised with the keyword 'new'");
    }
    this._default_options = jQuery.extend({},
        GvNIX_Map_Leaflet.USERLAYERTAB.Base.default_options);

    this.s = jQuery.extend({}, this._default_options, options);

    // Set this group _state attributes to those passed by the parameters
    this._state = jQuery.extend({}, GvNIX_Map_Leaflet.USERLAYERTAB.Base._state, {
      "sId" : sId,
      "title" : "",
      "dialogId": dialogId,
      "aCrs" : aCrs,
      "typeLayer" : "",
      "idLayer" : "",
      "nameLayer": "",
      "oUtil" : null,
      "file" : null,
    });

    this.fnSettings = function() {
      return this.s;
    };

    // Constructor
    this._fnConstructor();
  };

  /**
   * Layer type to group layers. Class method declaration
   */
  GvNIX_Map_Leaflet.USERLAYERTAB.shape.prototype = jQuery.extend({},
      GvNIX_Map_Leaflet.USERLAYERTAB.Base._prototype, {
        "_debug" : function(message) {
          var st = this._state;
          console.log("[UserLayerTab SHAPE:" + st.sId + "] " + message);
        },

        // overwrite constructor to create leaflet layerGroup instance
        "_fnConstructor" : function() {
          // Call to super
          this.__fnConstructor();
        },

        /**
         * Get layers from file input
         */
        "_fnGetSelectedLayers" : function() {
        	var st = this._state;
            return st.file;
        },

        /**
         * Add change event for input file
         */
        "_fnAddChangeEventToFileInput" : function(){
        	var st = this._state;
        	var fileInput = jQuery("#"+st.sId+"_file_input", "#"+st.dialogId);
        	fileInput.change(jQuery.proxy(this._fnCheckAndLoadFile, this));
        },

        /**
         * Check loaded file in input file if any
         */
        "_fnCheckAndLoadFile" : function(){
        	// Check for the various File API support.
        	if (window.File && window.FileReader && window.FileList && window.Blob) {
        	  // Great success! All the File APIs are supported.
        	} else {
        	  alert('The File APIs are not fully supported in this browser.');
        	}

        	var st = this._state;
        	var fileInput = jQuery("#"+st.sId+"_file_input", "#"+st.dialogId);
        	var file = fileInput.prop("files")[0];
        	st.file = file;
        	st.idLayer = st.oUtil.getHashCode(file.name).concat("_").concat(new Date().getTime());
              st.nameLayer = file.name;
        },

        /**
         * Generate the code necessary to add the selected layers into the map
         */
        "_fnCreateLayersOptions" : function(file) {
          var st = this._state;
          var title = st.nameLayer;

          // Get the title form title input
          if (jQuery("#"+st.sId+"_name_id", "#"+st.dialogId).val() != ""){
        	  title = jQuery("#"+st.sId+"_name_id", "#"+st.dialogId).val();
          }
          var layerOptions = {
            "layer_type": "shape",
            "span": st.idLayer.concat("_span"),
            "opacity": "1",
            "allow_disable": true,
            "node_icon": ".glyphicon glyphicon-floppy-open",
            "title": title,
            "file" : st.file,
            "layerId" : st.idLayer
          };

          return layerOptions;
        },

        /**
         * Get layer id
         */
        "_fnGetLayerId" : function(layerOptions) {
          var st = this._state;
          return (st.idLayer);

        },

  });

})(jQuery, window, document);

