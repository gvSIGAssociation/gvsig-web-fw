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

/* Global scope for GvNIX_Map_Leaflet */
var GvNIX_Map_Leaflet;

(function(jQuery, window, document) {

	GvNIX_Map_Leaflet = function($aDiv) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet) {
			alert("Warning: GvNIX_Map_Leaflet must be initialised with the keyword 'new'");
		}

		var divData = $aDiv.data();

		// Public class variables * * * * * * * * * * * * * * * * * * * * * *

		/**
		 * Initial configuration
		 */
		this.s = {
			/**
			 * div Id
			 */
			"id" : $aDiv.attr('id'),

			/**
			 * div Class
			 */
			"class" : "mapviewer_control",

			/**
			 * Center point location of the Map
			 */
			"center" : divData.center,

			/**
			 * Map Zoom
			 */
			"zoom" : divData.zoom,

			/**
			 * Min Zoom allowed on Map
			 */
			"minZoom" : divData.minzoom,

			/**
			 * Max Zoom allowed on Map
			 */
			"maxZoom" : divData.maxzoom,

			/**
			 * Use zoom slider
			 */
			"zoom_slider" : divData.zoom_slider ? divData.zoom_slider : false,

			/**
			 *
			 */
			"pan_control" : divData.pan_control ? divData.pan_control : false,

			/**
			 * Map instance
			 */
			"map" : null,

			/**
			 * Map Layers
			 */
			"layersById" : {},

			/**
			 * Map markers
			 */
			"markersById" : {},

			/**
			 * Toolbar object
			 */
			"toolBar" : null,

			/**
			 * Map tools
			 */
			"toolsById" : {},

			/**
			 * Current tool
			 */
			"currentTool" : null,

			/**
			 * Components object
			 */
			"components" : null,

			/**
			 * Map components
			 */
			"componentsById" : {},

			/**
			 * Leaflet control Layers object
			 */
			"controlLayers" : null,

			/**
			 * Control Toolbar object
			 */
			"controlToolbar" : null,

			/**
			 * Projection of the current map
			 */
			"projection" : divData.projection,

			/**
			 * Show attribution control
			 */
			"attribution_control" : !divData.attribution_control === false,

			/**
			 * Display TOC
			 */
			"display_TOC" : divData.displaytoc,
			/**
			 * Display Zoom
			 */
			"display_Zoom" : divData.displayzoom,
			/**
			 * Display Toolbar
			 */
			"display_Toolbar" : divData.displaytoolbar,

			/**
			 * Display Legend
			 */
			"display_Legend" : divData.displaylegend,

			/**
			 * Layer toolbar object
			 */
			"controlLayerToolbar" : null,

			/**
			 * Current layer tool selected
			 */
			"currentLayerTool" : null,

			/**
			 * Set checkboxes for TOC
			 */
			"addCheckbox" : divData.add_checkbox,

			/**
			 * Register tools layers callbacks
			 */
			"toolsLayersCallbacks" : jQuery.Callbacks()

		};

		/**
		 * Configuration to use and replace
		 */
		this._data = {
			/**
			 * Input Id
			 */
			"id" : $aDiv.attr('id'),

			"$div" : $aDiv,
			/**
			 * Input Class
			 */
			"class" : "mapviewer_control",

			/**
			 * Center point location of the Map
			 */
			"center" : divData.center,

			/**
			 * Map Zoom
			 */
			"zoom" : divData.zoom,

			/**
			 * Min Zoom allowed on Map
			 */
			"minZoom" : divData.minzoom,

			/**
			 * Max Zoom allowed on Map
			 */
			"maxZoom" : divData.maxzoom,

			/**
			 * Map instance
			 */
			"map" : null,

			/**
			 * Map Layers
			 */
			"layersById" : {},

			/**
			 * Map markers layer
			 */
			"markerLayer" : null,

			/**
			 * Map markers
			 */
			"markersById" : {},

			/**
			 * Toolbar object
			 */
			"toolBar" : null,

			/**
			 * Map tools
			 */
			"toolsById" : {},

			/**
			 * Current tool
			 */
			"currentTool" : null,

			/**
			 * Leaflet control Layers object
			 */
			"controlLayers" : null,

			/**
			 * Control Toolbar object
			 */
			"controlToolbar" : null,

			/**
			 * Layer toolbar object
			 */
			"controlLayerToolbar" : null,

			/**
			 * Current layer tool selected
			 */
			"currentLayerTool" : null,

			/**
			 * Components object
			 */
			"components" : null,

			/**
			 * Map components
			 */
			"componentsById" : {},

			/**
			 * Fancytree TOC instance
			 */
			"tree" : null,

			/**
			 * Projection of the current map
			 */
			"projection" : divData.projection,

			/**
			 * OverviewMap values
			 */
			"oOverviewMap" : null,


			// Toc Layer Control Options

			/**
			 * Set checkboxes for TOC
			 */
			"addCheckbox" : divData.add_checkbox,

			/**
			* Allow drag and drop to reorder layers on toc
			*/
			"dragAndDrop" : divData.draganddrop,

			/**
			* debug
			*/
			"debug" : "debug" in divData ? divData.debug : false,

			/**
			 * Register tools layers callbacks
			 */
			"toolsLayersCallbacks" : jQuery.Callbacks()

		};
		// Current configuration
		this.fnSettings = function() {
			return this.s;
		};

		// Component utils
		this.Util = GvNIX_Map_Leaflet.Util;

		// Constructor
		this._fnConstructor();

		GvNIX_Map_Leaflet._fnAddInstance(this);

		return this;
	};

	GvNIX_Map_Leaflet.prototype = {

		/**
		 * Method to initialize Map and create callbacks
		 */
		"_fnConstructor" : function() {

			var instance = this;

			// Initialize map
			this._fnInitializeMap();
			// Initialize toolbar
			this._fnInitializeToolBar();
			// Initialize components
			this._fnInitializeComponents();
			// Initialize miniMap (if any)
			this._fnInitializeOverviewMap();
			// Initialize layer order
			this._fnInitializeLayerOrder();
			//Initialize Storage Event
			addEvent(window, 'storage',
					 jQuery.proxy(this._fnStorageChanged, this));

			// Load map status
			 instance._fnLoadMapStatus();

		},

		/**
		 * Function to initialize Map
		 */
		"_fnInitializeMap" : function initializeMap() {
			var U = this.Util;
			var s = this.s;
			var st = this._data;
			// Saving instance
			var divId = s.id;
			if (!divId) {
				throw "Missing id";
			}

			var options = {
				zoomControl : false,
				loadingControl : true
			};

			// Getting center LatLng
			setOption(s, 'center', options, null, U.toLantLngObject);
			setOption(s, 'maxZoom', options, null, 15);
			setOption(s, 'minZoom', options, null, 0);
			setOption(s, 'attribution_control', options, 'attributionControl',
					true);
			// Create projection object
			if (s.projection) {
				var crsObject = L.CRS[s.projection];
				if (crsObject) {
					options.crs = crsObject;
				}
			}

			// Creating Map
			var map = L.map(divId, options);
			st.map = map;

			st.rootLayer = L.layerGroup();
			st.rootLayer._gvNIX_layer_id = divId + "_ROOT";

			map.addLayer(st.rootLayer);

			if (s.display_Zoom) {
				// Adding zoom control on top right position
				if (this.s.zoom_slider) {
					map.addControl(new L.Control.Zoomslider({
						"position" : "topright"
					}));
				} else {
					new L.Control.Zoom({
						position : 'topright'
					}).addTo(this._data.map);
				}
			}

			// Creating empty layer with maxZoom
			L.tileLayer("", {
				maxZoom : options.maxZoom,
				minZoom : options.minZoom
			}).addTo(map);

			// Getting savedzoom
			var viewZoom = s.zoom ? s.zoom : options.maxZoom;
			var viewPan = options['center'];

			if (viewZoom && viewPan) {
				map.setView(U.toLantLngObject(viewPan), viewZoom);
			}

			// Adding layers control
			this._fnLoadTocControl();

			// Include markers on map
			st.markerLayer = L.featureGroup();
			map.addLayer(st.markerLayer);

			// Adding events to reload data
			map.on("moveend", jQuery.proxy(this._fnSaveCurrentCenter, this),
					this);
			// Adding event to save zoom
			map.on("zoomend", jQuery.proxy(this._fnSaveZoomStatus, this), this);
		},

		/**
		 * Get Root Layer
		 */
		"_fnGetRootLayer" : function() {
			return this._data.rootLayer;
		},

		/**
		 * Register custom map tools
		 *
		 * @param sId
		 *            tool unique ID
		 *
		 * @param options
		 *            tool options. Requires a "type" option which informs the
		 *            tool type to create. Tool type must be registered in
		 *            GvNIX_Map_Leaflet.CONTROLS map.
		 */
		"fnRegisterTool" : function(sId, options) {
			var sToolType = options.type;

			if (sToolType == "Base") {
				this.debug("ERROR: 'Base' tool is not registrable");
				return;
			}
			// Get layer type
			var oToolClass = GvNIX_Map_Leaflet.CONTROLS[sToolType];
			if (!oToolClass) {
				this.debug("ERROR: '" + oToolClass + "' tool type not found");
				return;
			}
			// Create a new Instance layer of required type
			var newTool = new oToolClass(this, sId, options);
			if (!newTool) {
				this.debug("ERROR: '" + sId + "': tool not created");
				return;
			}
			// TODO load state from local storage

			// store on layer registry
			this._fnRegisterATool(sId, newTool, options.default_selected);
		},

		/**
		 * Register custom map components
		 *
		 * @param sId
		 *            layer unique ID
		 *
		 * @param options
		 *            layer options. Requires a "layer_type" option which
		 *            informs the layer type to create. Layer type must be
		 *            registered in GvNIX_Map_Leaflet.LAYERS map.
		 */
		"fnRegisterComponent" : function(sId, options) {
			var sComponentType = options.type;

			if (sComponentType == "Base") {
				this.debug("ERROR: 'Base' component is not registrable");
				return;
			}
			// Get component type
			var oComponentClass = GvNIX_Map_Leaflet.CONTROLS[sComponentType];
			if (!oComponentClass) {
				this.debug("ERROR: '" + oComponentClass
						+ "' component type not found");
				return;
			}
			// Create a new Instance layer of required type
			var newComponent = new oComponentClass(this, sId, options);
			if (!newComponent) {
				this.debug("ERROR: '" + sId + "': component not created");
				return;
			}

			// store on layer registry
			this._fnRegisterAComponent(sId, newComponent);
		},

		/**
		 * Register a new layer on map.
		 *
		 * @param sId
		 *            layer unique ID
		 * @param options
		 *            layer options. Requires a "layer_type" option which
		 *            informs the layer type to create. Layer type must be
		 *            registered in GvNIX_Map_Leaflet.LAYERS map.
		 * @param layerDiv
		 *            HTML div element that contains extra components and
		 *            information associated to current layer, like toc title,
		 *            layer tools, etc... If empty ignore it and generate TOC
		 *            element by default without extra components.
		 * @param insertAtBegin
		 *            boolean to indicate if insert the layer at begin
		 *
		 */
		"fnRegisterLayer" : function(sId, options, layerDiv, insertAtBegin) {
			var sLayerType = options.layer_type;

			if (sLayerType == "Base") {
				this.debug("ERROR: 'Base' layer is not registrable");
				return;
			}
			// Get layer type
			var oLayerClass = GvNIX_Map_Leaflet.LAYERS[sLayerType];
			if (!oLayerClass) {
				this.debug("ERROR: '" + oLayerClass + "' layer type not found");
				return;
			}
			// Create a new Instance layer of required type
			var newLayer = new oLayerClass(this, sId, options);
			if (!newLayer) {
				this.debug("ERROR: '" + sId + "': layer not created");
				return;
			}

			// If components layer div is an string, try to parse to obtain an
			// HTML item
			if (typeof layerDiv == "string") {
				layerDiv = jQuery.parseHTML(layerDiv)[0];
			}

			// Getting associated components from div
			if (layerDiv && layerDiv.className == "layer_components") {
				var $div = jQuery(layerDiv);

				// Getting toc-title if defined
				var titleSpan = $div.find("#layer-toc-title");
				if (titleSpan.length > 0) {
					newLayer.s.title = titleSpan.html();
				}

				// Getting toc-tools to be able to add it to
				// TOC element
				var toolsSpan = $div.find("#layer-toc-tools");
				if (toolsSpan.length > 0) {
					var tools = toolsSpan.find("i");
					for (i = 0; i < tools.length; i++) {
						var tool = tools[i];
						var toolData = jQuery(tool).data();
						// Check if current tool is assigned to current layer
						// or is assigned to some child layer
						if (toolData.layerid == newLayer._state.sId) {
							toolData.id = tool.id;
							toolData.htmlElement = tool;
							if (toolData.type != undefined) {
								newLayer.fnRegisterLayerTool(toolData.id,
										toolData);
							}
						}
					}
				}

				// Getting loading image if exists
				var loadingImg = $div.find("img[id='"+sId+"_loading_img']");
				if(loadingImg.length > 0){
					newLayer._state.oLoadingIcon = jQuery(loadingImg[0]);
				}

			} else if (layerDiv) {
				// Include all layerDiv HTML content as title
				newLayer.s.title = layerDiv.outerHTML;
			}

			// Register filter tool on current layer if needed
			if (newLayer.s.filter_type != undefined && newLayer.s.filter_type != "none") {
				var filterHtmlElement = jQuery.parseHTML('<i id="'
						+ newLayer._state.sId
						+ '_filter_icon" class="fa fa-filter no-filtered toc_layers_button"><![CDATA[&nbsp;]]></i>');

				// Saving filter icon
				newLayer._state.oFilterIcon = jQuery(filterHtmlElement);

				// Append filter element to newLayer div
				jQuery(filterHtmlElement).appendTo(jQuery(newLayer._state.nLayer));

				var toolData = {
						layer: newLayer,
						layerid: newLayer._state.sId,
						id : newLayer._state.sId + "_filter_icon",
						type: "filter",
						filter_on: newLayer.s.filter_on,
						htmlElement : filterHtmlElement
				}
				newLayer.fnRegisterLayerTool(toolData.id,
						toolData);
			}

			// Adding load img if not declared yet and exists on options data
			if(newLayer._state.loadingImg == null && options.loading_img_url){
				var loadingImg = jQuery.parseHTML(
						'<img width="15" style="display:none;" src="'+options.loading_img_url+'" id="'+sId+'_loading_img"/>');

				newLayer._state.oLoadingIcon = jQuery(loadingImg);

			}


			// Load status by default (not localStorage)
			newLayer.fnLoadState(false);

			// Add to TOC
			var toc = this._data.controlLayers;
			var tree = this._data.tree;
			var parentNode;

			// Get parent node if any
			var parentId = newLayer.fnGetParentNodeId();
			if (parentId != "" && !undefined && parentId != null) {
				parentNode = tree.getNodeByKey(parentId);
			} else {
				parentNode = tree.getRootNode();
			}

			// Store on layer registry
			this._fnRegisterALayer(sId, newLayer);

			// Append node to parent
			parentNode.addChildren(newLayer.fnGetNodeData());
			newLayer.fnInitializeLayerNode();

			// Get layer legend and add it to layer container
			var legendEnabled = newLayer.fnIsLegendEnabled();
			if(legendEnabled == true){
				var legend = newLayer.fnCreateLegend();
				var tocControl = this._data.controlLayers;
				var oDivContainer = tocControl.fnGetLegendContainer();
			}
			if(insertAtBegin){
				if(legendEnabled == true){
					oDivContainer.prepend(legend);
				}
				var firstNodeId = this.fnGetTocLayersIds()[0];
					if (parentId != "" && !undefined && parentId != null) {
						var firstChild = parentNode.getFirstChild();
						if(firstChild != null){
							firstNodeId = firstChild.key;
						}else{
							firstNodeId = parentId;
						}
					}
				// Move layer to first position of TOC
				this.fnMoveLayer(newLayer.fnGetId(), firstNodeId, null, true);
			}else{
				if(legendEnabled == true){
					oDivContainer.append(legend);
				}
			}
		},

		/**
		 * Register a new layer on overview
		 *
		 * @param sId
		 *            layer unique ID
		 * @param options
		 *            layer options. Requires a "layer_type" option which
		 *            informs the layer type to create. Layer type must be
		 *            registered in GvNIX_Map_Leaflet.LAYERS map.
		 */
		"fnRegisterOverviewLayer" : function(sId, options) {
			var sLayerType = options.layer_type;

			if (sLayerType == "Base") {
				this.debug("ERROR: 'Base' layer is not registrable");
				return;
			}
			// Get layer type
			var oLayerClass = GvNIX_Map_Leaflet.LAYERS[sLayerType];
			if (!oLayerClass) {
				this.debug("ERROR: '" + oLayerClass + "' layer type not found");
				return;
			}
			// Create a new Instance layer of required type
			var newLayer = new oLayerClass(this, sId, options);
			if (!newLayer) {
				this.debug("ERROR: '" + sId + "': layer not created");
				return;
			}
			// Store on layer registry
			this._fnRegisterALayer(sId, newLayer);
		},

		/**
		 * Initialize the overview-map: a mini map which helps to user to
		 * identify current view.
		 */
		"_fnInitializeOverviewMap" : function initializeOverviewMap() {
			var st = this._data;

			// locate the definition div in map container
			var $overviewDiv = jQuery(".mapviewer_layers_overview", st.$div
					.parent());

			if (!$overviewDiv || $overviewDiv.length == 0) {
				// not found: nothing to do
				return;
			}

			var sId = $overviewDiv.attr('id');

			// create a structure to store overview related information
			var oOverview = {
				"$overviewDiv" : $overviewDiv,
				"sId" : sId
			};

			// Create a layer group to add all layers to show on overview.
			// This layer will be used to create the miniMap plugin
			var oLeafletLayer = L.layerGroup();
			oLeafletLayer._gvNIX_layer_id = sId + "_group";
			var options = $overviewDiv.data();

			// Create the gvNIX layer which will be the root layer
			var oRootLayer = new GvNIX_Map_Leaflet.LAYERS.overview(this,
					oOverview.sId, oLeafletLayer, options);

			// Register the root layer id so children layer can locate the root
			// in the same way grouped layers do
			this._fnRegisterALayer(sId, oRootLayer);

			// store data on info structure
			oOverview.oLeafletLayer = oLeafletLayer;
			oOverview.oRootLayer = oRootLayer;

			// Search for overview layers
			var aLayers = jQuery(".mapviewer_layers_layer", $overviewDiv);
			var map = this;

			// Add layers
			aLayers.each(function(index) {
				var $layerDiv = jQuery(this);
				var oLayerData = $layerDiv.data();
				var sId = this.id;
				map.fnRegisterOverviewLayer(sId, oLayerData);

				// Make all layers on overview visible
				map.fnGetLayerById(sId).fnShow(true);
			});

			// Default miniMap options
			var overlayOptions = {
				"aimingRectOptions" : {
					color : "#ff7800",
					weight : 2,
					clickable : false,
					opacity : 1,
					fillOpatcity : 0.6
				},
				"shadowRectOptions" : {
					color : "#000000",
					weight : 2,
					clickable : false,
					opacity : 0,
					fillOpacity : 0
				},
				"toggleDisplay" : true,
				"autoToggleDisplay" : true,
				"position" : "bottomleft"
			}

			// load user options for miniMap
			setOption(options, "aiming_rect_options", overlayOptions,
					"aimingRectOptions", null, jQuery.parseJSON);
			setOption(options, "shadow_rect_options", overlayOptions,
					"shadowRectOptions", null, jQuery.parseJSON);
			setOption(options, "toggle_display", overlayOptions,
					"toggleDisplay", null, toBool);
			setOption(options, "auto_toggle_display", overlayOptions,
					"autoToggleDisplay", null, toBool);
			setOption(options, "auto_toggle_display", overlayOptions,
					"autoToggleDisplay", null, toBool);
			setOption(options, "width", overlayOptions, "width", null, toInt);
			setOption(options, "height", overlayOptions, "height", null, toInt);
			setOption(options, "zoom_level_offset", overlayOptions,
					"zoomLevelOffset", null, toInt);
			setOption(options, "zoom_level_fixed", overlayOptions,
					"zoomLevelFixed", null, toInt);

			// Create miniMap
			var miniMap = new L.Control.MiniMap(oLeafletLayer, overlayOptions)
					.addTo(map.fnGetMapObject());

			// store overview info structure on status object
			st.oOverviewMap = oOverview;
		},

	   /**
		* Function to initialize layer order using TOC position
		*
		*/
		"_fnInitializeLayerOrder" : function (){

			// TODO: Load order status from localStorage
			var aLayers = this.fnGetTocLayersIds();

			var index = 0;
			for(x in aLayers){
				var layerId = aLayers[x];
				var layer = this.fnGetLayerById(layerId);
				layer.fnSetZIndex(index);
				index --;

			}

		},

		/**
		 * Function to get the zIndex value of a layer using its TOC position
		 *
		 * @param sId
		 *            layer unique ID
		 */
		"fnGetLayerIndex" : function(sId) {
			var aLayers = this.fnGetTocLayersIds();
			var index = 0;
			for (x in aLayers) {
				var layerId = aLayers[x];
				if (layerId == sId) {
					return index;
				}
				index--;
			}
		},

		/**
		 * Register a new Tool on TOC toolbar
		 *
		 * @param sId
		 *            tool unique ID
		 * @param type
		 *            Tool type must be registered in GvNIX_Map_Leaflet.CONTROLS
		 * @param tool
		 *            Html element that defines tool
		 */
		"fnRegisterTocTool" : function(sId, type, htmlTool) {

			// Get tool type
			var oToolClass = GvNIX_Map_Leaflet.CONTROLS[type];
			if (!oToolClass) {
				this.debug("ERROR: '" + oToolClass + "' tool type not found");
				return;
			}

			// Generating options
			var options = {};
			options.htmlTool = htmlTool;
			options.layersToolBar = this._data.layersToolBar;

			// Create a new Instance tool of required type
			var newTool = new oToolClass(this, sId, options);
			if (!newTool) {
				this.debug("ERROR: '" + sId + "': tool not created");
				return;
			}
		},

		/**
		 * Function to get toc tree of the map
		 */
		"fnGetTocTree" : function getTocTree() {
			return this._data.controlLayers.fnGetTocTree();
		},

		/**
		 * Function to get toc layers id of the map
		 */
		"fnGetTocLayersIds" : function() {
			var aLayers = [];
			var toc = this.fnGetTocTree();

			toc.visit(function(treeNode){
				aLayers.push(treeNode.key);
			});

			return aLayers;
		},

		/**
		 * Function to get toc layers of the map
		 */
		"fnGetTocLayersNodes" : function() {
			var aLayers = [];
			var toc = this.fnGetTocTree();

			toc.visit(function(treeNode){
				aLayers.push(treeNode);
			});

			return aLayers;
		},

		/**
		 * Function to add layer control with toc layers
		 */
		"_fnLoadTocControl" : function addLayersControl() {
			var st = this._data;
			// Getting generated toc HTML
			var $tocContainer = jQuery(".mapviewer_layers", st.$div.parent());
			// Getting self container in HTML
			var html = $tocContainer.clone().wrap("<div />").parent().html();
			// Generating controlLayers item
			var options = {
				"checkbox" : this._data.addCheckbox,
				"dnd" : this._data.dragAndDrop
			};
			options.gvNIXMap = this;
			options.displayLegend = this.s.display_Legend;
			this._data.controlLayers = L.control.fancytreeLayers(options);
			// Adding controlLayers to map
			this._data.controlLayers.addTo(this._data.map);
			// Register fancytree widget on map
			this._data.tree = this._data.controlLayers.fnGetTocTree();

			var toc = jQuery(".mapviewer_layers", st.$div.parent());
			var aLayers = jQuery(".mapviewer_layers_layer", toc);
			var tocControl = this._data.controlLayers;
			var map = this;
			var $this = jQuery(this);
			var oToolData = $this.data();

			// Generating toc toolbar item
			var layersToolbar = L.control.htmlLayersToolbar();
			this._data.layersToolBar = layersToolbar;
			this._data.layersToolBar.tools = [];

			// Getting tools from TOC toolbar
			var $tocTools = jQuery(".toc_tool_bar > span", st.$div.parent());

			if ($tocTools.length > 0) {
				// Register all TOC tools
				$tocTools.each(function(index) {
					var $this = jQuery(this);
					var data = $this.data();

					var sId = data.id;
					var sType = data.type;

					map.fnRegisterTocTool(sId, sType, $this);
				});

			}

			// Registering and setting up layers on map
			aLayers.each(function(index) {

				// Getting layerDiv
				var $layerDiv = jQuery(this);

				// Getting components div associated to this layer
				var $layerComponents = $layerDiv.find("#layer-components")[0];

				var oLayerData = $layerDiv.data();
				var sId = this.id;

				// Register layer
				map.fnRegisterLayer(sId, oLayerData, $layerComponents);

			});

			// Removing hidden toc toolbar
			$tocContainer.parent().html("");

			// Hide TOC if display_TOC is false
			if (!this.s.display_TOC) {
				jQuery(".leaflet-control-layers").css("display", "none");
			}

		},

		/**
		 * Function to refresh current map tools
		 */
		"_fnUpdateCurrentTool" : function() {
			var st = this._data;

			if (!st.currentTool) {
				var oTool = null;
				for ( var i in st.toolsById) {
					oTool = st.toolsById[i];
					if (oTool.isSelectable() && oTool.isSelected()) {
						st.currentTool = oTool;
						return;
					}
				}
			}
		},

		/**
		 * Function to add toolbar control with tools
		 */
		"_fnAddToolbarControl" : function addToolbarControl() {
			var st = this._data;
			// Generating controlLayers item
			st.controlToolbar = L.control.htmlToolbar();
			// Adding controlLayers to map
			st.controlToolbar.addTo(st.map);

			// Getting generated toolbar HTML
			var toolbarHTML = st.toolBar.html();
			// Removing hidden toolbar
			st.toolBar.html("");
			// Adding HTML toolbar to toolbarControl
			st.controlToolbar._setHtmlContent(toolbarHTML);
		},

		/**
		 * Function to initialize Tool Bar
		 *
		 * @param divId
		 *            Unique layer id TODO Refactor Me
		 */
		"_fnInitializeToolBar" : function initializeToolBar() {
			if (this.s.display_Toolbar) {
				var st = this._data;
				// Saving toolbar on map instance
				st.toolBar = jQuery(".mapviewer_tools_bar", st.$div.parent());
				// Adding default hand tool
				if (this.s.pan_control) {
					this._fnAddDefaultPanTool();
				}

				// Adding toolbar control
				this._fnAddToolbarControl();
				// Load tools
				var map = this;
				var aTools = jQuery(".toolbar_button", st.controlToolbar._form);
				aTools.each(function(index) {
					var $this = jQuery(this);
					var oToolData = $this.data();
					var sId = this.id;
					map.fnRegisterTool(sId, oToolData);
				});
				this._fnUpdateCurrentTool();
			}
		},

		/**
		 * Function to initialize Components
		 *
		 * @param divId
		 *            Unique layer id TODO Refactor Me
		 */
		"_fnInitializeComponents" : function initializeToolBar() {
			if (this.s.display_Toolbar) {
				var st = this._data;
				// Saving components on map instance
				st.components = jQuery(".mapviewer_components", st.$div
						.parent());
				var map = this;
				var aComponents = jQuery(".map_component", st.components);
				aComponents.each(function(index) {
					var $this = jQuery(this);
					var oComponentData = $this.data();
					var sId = this.id;
					map.fnRegisterComponent(sId, oComponentData);
				});
			}
		},

		/**
		 * Function to add default hand tool
		 */
		"_fnAddDefaultPanTool" : function addDefaultTool() {
			var sToolId = this._data.id + "_pan_default_tool";
			// Adding button element
			this._data.toolBar
					.prepend('<i id="'
							+ sToolId
							+ '" class="toolbar_button whhg icon-handdrag mapviewer_tool_selected" data-default_selected="true" data-type="pan" > </i>');
		},

		/**
		 * Function to add an icon as map cursor
		 *
		 * @param sCursorIcon
		 *            Selected icon image.
		 */
		"_fnSetCursorIcon" : function(sCursorIcon) {
			jQuery(this._data.map._container).css(
					{
						"cursor" : sCursorIcon ? "url('" + sCursorIcon
								+ "'), default" : null
					});
		},

		// Select a tool
		"_fnSelectTool" : function(oTool) {
			var st = this._data;

			if (st.currentTool) {
				// try to deselect current tool
				if (!st.currentTool._fnDoDeselect()) {
					return false;
				}
			}
			if (!oTool._fnDoSelect()) {
				// if pan control is established set this as current tool
				if(this.s.pan_control){
					st.currentTool = st.toolsById[st.id + "_pan_default_tool"];
					st.currentTool._fnDoSelect();
				}else{
					st.currentTool = null;
				}
				return false;
			}
			st.currentTool = oTool;
			return true;
		},

		// Select a layer tool
		"_fnSelectLayerTool" : function(oTool) {
			var st = this._data;

			if (st.currentLayerTool) {
				// try to deselect current tool
				if (!st.currentLayerTool._fnDoDeselect()) {
					return false;
				}
			}
			if (!oTool._fnDoSelect()) {
				if (st.currentLayerTool) {
					st.currentLayerTool._fnDoSelect();
				}
				return false;
			}
			st.currentLayerTool = oTool;
			return true;
		},

		/**
		 * Function to get map item
		 */
		"fnGetMapObject" : function getMapObject() {
			return this._data.map;
		},

		/**
		 * Function to get map id
		 */
		"fnGetMapContainerId" : function getMapContainerId() {
			return this._data.id;
		},

		/**
		 * Function to get toolBar item
		 */
		"_fnGetToolbarObject" : function _fnGetToolbarObject() {
			return this._data.toolBar;
		},

		/**
		 * Function to get layer toolBar item
		 */
		"_fnGetLayerToolbarObject" : function _fnGetLayerToolbarObject() {
			return this._data.controlLayerToolbar;
		},

		/**
		 * Gets current map bonding box
		 */
		"fnMapBondingBox" : function() {
			// Get map projection (always in 4326)
			var oBBox = this.fnGetMapObject().getBounds();
			var map = this.fnGetMapObject();
			var mapCrs = map.options.crs;
			var mapProj = mapCrs.projection;
			var transform = null;
			if (mapProj && mapCrs.code != "EPSG:4326") {
				// no layer projection or is the same of map
				transform = function(latLng) {
					// Get coordinates in Pixel
					var point = mapCrs.latLngToPoint(latLng, map.getZoom());

					// Get real world coordinates using Register CRS
					var projectedPoint = mapCrs.project(map.unproject(point));

					// Transform the point to a LatLong instance
					return L.latLng(projectedPoint.y, projectedPoint.x);
				};
			}

			if (!transform) {
				// No transform needed: do nothing
				return oBBox;
			}

			var oNewBBox = L.latLngBounds(transform(oBBox.getSouthWest()),
					transform(oBBox.getNorthEast()));
			oNewBBox.crs = mapCrs;
			return oNewBBox;
		},
		/**
		 * Set bonding box to current map
		 */
		"fnSetMapBondingBox" : function(bbox) {
			this.fnGetMapObject().panTo(bbox);
		},

		/**
		 * Returns current map CRS object
		 */
		"fnGetMapSRIDObject" : function() {
			var mapCrs = this._data.map.options.crs;
			if (!mapCrs) {
				return null;
			}
			return mapCrs;
		},

		/**
		 * Returns current map CRS code: (ex: 'EPSG:3857')
		 */
		"fnGetMapSRIDcode" : function() {
			var mapCrs = this._data.map.options.crs;
			if (!mapCrs) {
				return null;
			}
			return mapCrs.code;
		},

		/**
		 * Function which transform leaflet vectorial layer which are not on
		 * lat/lng format or are on different projection than Map.
		 *
		 * @param oLayer
		 *            leaflet vectorial layer to transform
		 * @param oCrs
		 *            leaflet projection definition of layer
		 *
		 * @deprecated This is not needed as layers uses L.Proj.GeoJSON
		 */
		"fnAdjustLayerCoordinatesFromCRS" : function(oLayer, oCrs) {
			// Check if is a layer group
			if (oLayer.getLayers) {
				var aLayers = oLayer.getLayers();
				for ( var j in aLayers) {
					this.fnAdjustLayerCoordinatesFromCRS(aLayers[j], oCrs);
				}
			}

			// Get map projection
			var mapProj = this._data.map.options.crs.projection;
			var transform = null;
			if (mapProj) {
				if (!oCrs || mapProj == oCrs) {
					// no layer projection or is the same of map
					transform = function(latLng) {
						return mapProj.unproject(L.Projection.LonLat
								.project(latLng));
					};
				} else {
					transform = function(latLng) {
						// TODO Test it
						var org = oCrs.unproject(L.Projection.LonLat
								.project(latLng));
						return mapProj.unproject(L.Projection.LonLat
								.project(org));
					};
				}
			}

			if (!transform) {
				// No transform needed: do nothing
				return;
			}
			if (oLayer.getLatLng) {
				// Is single latLng:
				// Transform latlng a set to layer
				oLayer.setLatLng(transform(oLayer.getLatLng()));
			} else if (oLayer.getLatLngs) {
				// Is Multy latLng
				// Transform all elements
				var latLngs = oLayer.getLatLngs();
				for ( var i in latLngs) {
					latLngs[i] = transform(latLngs[i]);
				}
			}
		},

		/**
		 * Function to save current center
		 */
		"_fnSaveCurrentCenter" : function saveCurrentCenter(event) {
			// Saving current center point on localStorage
			var centerLocalStorageKey = "center_point";
			var currentCenter = this._data.map.getCenter();
			var center = currentCenter.lat + "," + currentCenter.lng;

			// Saving center of current map instance
			this._fnSaveMapStatus(centerLocalStorageKey, center);

		},

		/**
		 * Function to save checkbox status
		 *
		 * @param checkBoxId
		 * @param status
		 */
		"_fnSaveLayerStatus" : function saveCheckboxStatus(sLayerId, status) {
			// Saving status using localStorage
			var layerStatusLocalStorageKey = sLayerId + "_layer";
			// Saving layer status on map instance
			this._fnSaveMapStatus(layerStatusLocalStorageKey, status);
		},

		/**
		 * Function to load checkbox status
		 *
		 * @param layerId
		 */
		"_fnLoadLayerStatus" : function loadLayerStatus(sLayerId, defaultState) {
			var layerStatusLocalStorageKey = sLayerId + "_layer";

			// Getting status from current map instance
			var status = this._fnGetMapStatus(layerStatusLocalStorageKey);
			if (status == null) {
				return defaultState;
			}
			return status;
		},

		/**
		 * Function to save zoom status when zoom changes
		 */
		"_fnSaveZoomStatus" : function saveZoomStatus() {
			var currentZoom = this._data.map.getZoom();
			var zoomLocalStorageKey = "zoom_level";

			// Saving zoom on current map instance
			this._fnSaveMapStatus(zoomLocalStorageKey, currentZoom);
		},

		/**
		 * Function to get localStorage Zoom Value
		 *
		 * @returns
		 */
		"_fnLoadZoomStatus" : function loadZoomStatus() {
			var zoomLocalStorageKey = "zoom_level";
			// Loading status from current map instance
			var zoomStatus = this._fnGetMapStatus(zoomLocalStorageKey);

			if (zoomStatus == null) {
				return this._data.zoom;
			}

			return zoomStatus;
		},

		/**
		 * Function to load localStorage center point
		 */
		"_fnLoadCenterPoint" : function loadCenterPoint() {
			var centerLocalStorageKey = "center_point";
			// Loading status from current map instance
			return this._fnGetMapStatus(centerLocalStorageKey);
		},

		/**
		 * Function to generate localStorage keys of entity layer
		 *
		 * @param checkBoxData
		 * @param oLayer
		 */
		"_fnGetEntityLocalStorageKeys" : function registerLocalStorageEntityKey(
				oEntityLayer) {
			var s = oEntityLayer.fnSettings();

			var customDttId = s.custom_dtt_id;
			var filterStorageKey = s.filter_storage_key;
			var selectionStorageKey = s.selection_storage_key;

			// Getting hashCode
			var hashCode = "";
			if (s.filter_on == "custom" || s.filter_on == "window") {
				hashCode = this.Util.getHashCode(s.path);
			} else if (s.filter_on == "dialog") {
				hashCode = this.Util.getHashCode(window.location.pathname);
			}

			var localStorageKey = "";
			var selectLocalStorageKey = "";

			if (!customDttId && !filterStorageKey && !selectionStorageKey) {
				var id = oEntityLayer.fnGetId();
				localStorageKey = hashCode + "_SpryMedia_DataTables_"
						+ id.replace("_layer", "");
				selectLocalStorageKey = hashCode + "_gvnixRowSelected-"
						+ id.replace("_layer", "");
			} else if (filterStorageKey || selectionStorageKey) {
				localStorageKey = filterStorageKey;
				selectLocalStorageKey = selectionStorageKey;
			} else if (customDttId) {
				localStorageKey = hashCode + "_SpryMedia_DataTables_"
						+ customDttId;
				selectLocalStorageKey = hashCode + "_gvnixRowSelected-"
						+ customDttId;
			}

			return {
				"filterKey" : localStorageKey,
				"selectionKey" : selectLocalStorageKey
			};
		},

		/**
		 * Called when localStorage has changed: Notify event to all layers
		 * which declares a "_fnNotifyStorageChanged" method
		 *
		 * @param event
		 *            event received
		 */
		"_fnStorageChanged" : function(event) {
			if (event.newValue == "")
				return;

			var oLayers = this._data.layersById;
			var oLayer = null;
			for ( var i in oLayers) {
				oLayer = oLayers[i];
				if (oLayer._fnNotifyStorageChanged) {
					oLayer._fnNotifyStorageChanged(event);
				}
			}
		},

		/**
		 * Register a layer with its ID
		 *
		 * @param sId
		 *            unique ID for layer
		 * @param oLayer
		 *            instance of GvNIX_Map_Leaflet.LAYERS
		 */
		"_fnRegisterALayer" : function(sId, oLayer) {
			this._data.layersById[sId] = oLayer;
		},

		/**
		 * Register a marker on markerLayer
		 *
		 * @param sId
		 *            unique ID for marker
		 * @param oLayer
		 *            instance Marker
		 */
		"_fnRegisterAMarker" : function(sId, oMarker) {
			this._data.markersById[sId] = oMarker;
		},

		/**
		 * Return a Leaflet.FeatureGroup instance by its ID
		 *
		 * @param sId
		 * 		Marker object identifier
		 */
		"__fnGetMarkerById" : function(sId) {
			return this._data.markersById[sId];
		},

		/**
		* Updates index value of all registered layers following the order
		* provided on aLayers array.
		*
		* @param aLayers
		* 			Array of layers ids with the new order to use on layer index.
		*
		* @param bSaveOnLocalStorage
		* 			boolean that allows to save new layer
		* 			position on localStorage.
		*
		*/
		"_fnUpdateLayersIndex" : function(aLayers, bSaveOnLocalStorage){
			// Now that we have new positions, we need to update position of leaflet layers
			var index = 0;
			for(x in aLayers){
				var gvNIXLayer = this.fnGetLayerById(aLayers[x]);
				gvNIXLayer.fnSetZIndex(index);
				if(bSaveOnLocalStorage){
					this._fnSaveMapStatus(aLayers[x] + "_layer_position", index * -1);
				}

				index--;

			}

		},

		/**
		* Function to change position of a registered layer on TOC and
		* change index position of map
		*
		*  @param sLayerId
		*  				String with registered layer id to move
		*  @param sReferencedLayerId
		*  				String with referenced layer id where sLayerId will be moved
		*  @param sHitMode
		*  				String with position of movement. Values "after" and "before"
		*  				are valid. By Default "before"
		*  @param bSaveOnLocalStorage
		*  				boolean that indicates if is necessary to save
		*  				the new position on localStorage.
		*/
		"fnMoveLayer" : function(sLayerId, sReferencedLayerId, sHitMode, bSaveOnLocalStorage){
			this._fnMoveLayer(sLayerId, sReferencedLayerId, sHitMode, bSaveOnLocalStorage);
		},

		/**
		* Function to change position of a registered layer on TOC and
		* change index position of map
		*
		* (Default implementation)
		*
		*  @param sLayerId
		*  				String with registered layer id to move
		*  @param sReferencedLayerId
		*  				String with referenced layer id where sLayerId will be moved
		*  @param sHitMode
		*  				String with position of movement. Values "after" and "before"
		*  				are valid. By Default "before"
		*  @param bSaveOnLocalStorage
		*  				boolean that indicates if is necessary to save
		*  				the new position on localStorage.
		*/
		"_fnMoveLayer" : function(sLayerId, sReferencedLayerId, sHitMode, bSaveOnLocalStorage){
			// Getting current TOC
			var toc = this._data.controlLayers;
			// Move layer using control layers
			toc.fnMoveLayer(sLayerId, sReferencedLayerId, sHitMode, bSaveOnLocalStorage);
		},

		/**
		 * Register marker on markerLayer by Id and shows it in the map
		 *
		 * @param mId
		 * 		Unique identifier for new graphic
		 * @param lat
		 * 		Latittude coordinates to add graphic
		 * @param lng
		 * 		Longitude coordinates to add graphic
		 * @param textFunction
		 * 		Text content of pop-up. Can be an String or
		 * 		a function to get the content.
		 * @param color
		 * 		(String) Color to display graphic
		 * @param popupOptions
		 * 		Style to display graphic pop-up
		 * @param closeBtn
		 * 		(Boolean) True to add a button to remove graphic
		 * @param cleanMessage
		 * 		Tooltip of button to remove the graphic
		 *
		 */
		"fnAddGraphic" : function(mId, lat, lng, textFunction, color, popupOptions,
				displayOnStart, closeBtn, cleanMessage) {
			this._fnAddGraphic(mId, lat, lng, textFunction, color, popupOptions,
					displayOnStart, closeBtn, cleanMessage);
		},

		/**
		 * Register marker on markerLayer by Id and shows it in the map
		 *
		 * @param mId
		 * 		Unique identifier for new graphic
		 * @param lat
		 * 		Latittude coordinates to add graphic
		 * @param lng
		 * 		Longitude coordinates to add graphic
		 * @param textFunction
		 * 		Text content of pop-up. Can be an String or
		 * 		a function to get the content.
		 * @param color
		 * 		(String) Color to display graphic
		 * @param popupOptions
		 * 		Style to display graphic pop-up
		 * @param closeBtn
		 * 		(Boolean) True to add a button to remove graphic
		 * @param cleanMessage
		 * 		Tooltip of button to remove the graphic
		 *
		 */
		"_fnAddGraphic" : function(mId, lat, lng, textFunction, color, popupOptions,
				displayOnStart, closeBtn, cleanMessage) {
			// Set position, style and display text to marker
			var latlng = L.latLng(lat, lng);

			// TODO Add params to this function to personalize graphics
			var markerIcon = L.AwesomeMarkers.icon({
				"icon" : "map-marker",
				"markerColor" : color,
				"iconColor" : "white"
			});

			if (typeof (cleanMessage) == "undefined") {
				cleanMessage = ""
			}

			// Create popup and add delete button
			var additionalText = "";
			if (closeBtn) {
				additionalText = '<div class ="markerDelete" style="text-align:right;"><a class="icon delete_entity" target="_blank" title="'
						+ cleanMessage + '"></a></div>';
			}

			// Create new marker and register
			var marker = L.marker(latlng, {
				icon : markerIcon
			});
			this._fnRegisterAMarker(mId, marker);
			this._data.markerLayer.addLayer(marker);
			marker.on("click", jQuery.proxy(function(textFunction, additionalText,
					marker, e) {
				marker.unbindPopup();
				var content = "";
				// Check if popup content is a function or is html
				if (jQuery.isFunction(textFunction)) {
					content = textFunction();
				} else {
					content = textFunction + additionalText;
				}

				marker.bindPopup(content, popupOptions).openPopup(marker._latlng);

			}, this, textFunction, additionalText, marker));

			// popup event
			marker.on("popupopen", function(e) {
				var marker = e.popup._source;
				jQuery(".markerDelete").on('click', 'a',
						jQuery.proxy(function(mId, e) {
							console.log("Delete marker: " + mId);
							this._fnRemoveGraphics(mId);
						}, this, mId))
			}, this, mId);

			if (typeof (displayOnStart) == "undefined") {
				displayOnStart = false
			}
			if (displayOnStart) {
				this.__fnGetMarkerById(mId).fire("click");
			}
		},

		/**
		 * Transform wkt into Vector Layer and register it on markerLayer by Id
		 * and shows it in the map
 		 *
		 * @param sWkt Wkt that will be transformed into Vector Layer
		 * @param id Id of the marker
		 * @param color Color of the marker
		 * @param textFunction Function or html that is shown in pop
		 */
		"fnAddGraphicWkt" : function(sWkt, id, color, textFunction) {
			this._fnAddGraphicWkt(sWkt, id, color, textFunction);
		},

		/**
		 * Transform wkt into Vector Layer and register it on markerLayer by Id
		 * and shows it in the map
		 *
		 * @param sWkt Wkt that will be transformed into Vector Layer
		 * @param id Id of the marker
		 * @param color Color of the marker (default: blue)
		 * @param textFunction Function or html that is shown in pop
		 */
		"_fnAddGraphicWkt" : function(sWkt, id, color, textFunction) {
			if(!color){
				color = "blue";
			}
			// id is required
			if(id){
				var oGeomLayerWkt = GvNIX_Map_Leaflet.Util.parseWkt(sWkt);
				this._fnRegisterAMarker(id, oGeomLayerWkt);
				if(oGeomLayerWkt.setIcon){
					var markerIcon = L.AwesomeMarkers.icon({
						"icon" : "map-marker",
						"markerColor" : color
					});
					oGeomLayerWkt.setIcon(markerIcon);
				}else{
					var style = {"color" : color};
					oGeomLayerWkt.setStyle(style);
				}
				this._data.markerLayer.addLayer(oGeomLayerWkt);
				// add popup when click on layer
				if(textFunction){
					oGeomLayerWkt.on("click", jQuery.proxy(function(textFunction,
							marker, e) {
						marker.unbindPopup();
						var content = "";
						// Check if popup content is a function or is html
						if (jQuery.isFunction(textFunction)) {
							content = textFunction();
						} else {
							content = textFunction;
						}

						marker.bindPopup(content).openPopup(marker._latlng);

					}, this, textFunction, oGeomLayerWkt));
				}
			}
		},

		/**
		 * Register Vector Layer on markerLayer by Id and shows it in the map
		 *
		 * @param leafletVectorLayer Vector layer to register
		 * @param id Id to identify the Vector Layer
		 */
		"fnAddGraphicVectorLayer" : function(leafletVectorLayer, id) {
			this._fnAddGraphicVectorLayer(leafletVectorLayer, id);
		},

		/**
		 * Register Vector Layer on markerLayer by Id and shows it in the map
		 *
		 * @param leafletVectorLayer Vector layer to register
		 * @param id Id to identify the Vector Layer
		 */
		"_fnAddGraphicVectorLayer" : function(leafletVectorLayer, id) {
			// id is required
			if(id){
				this._fnRegisterAMarker(id, leafletVectorLayer);
				this._data.markerLayer.addLayer(leafletVectorLayer);
			}
		},

		/**
		 * Register label on markerLayer by Id and shows it in the map
		 *
		 * @param id Identifier of the label
		 * @param className Class to apply in the label
		 * @param text String to show
		 * @param lat Latitude of the marker
		 * @param lng Longitude of the marker
		 */
		"fnAddGraphicLabel" : function(id, className, text, lat, lng){
			this._fnAddGraphicLabel(id, className, text, lat, lng);
		},

		/**
		 * Register label on markerLayer by Id and shows it in the map
		 *
		 * @param id Identifier of the label
		 * @param className Class to apply in the label
		 * @param text String to show
		 * @param lat Latitude of the marker
		 * @param lng Longitude of the marker
		 */
		"_fnAddGraphicLabel" : function(id, className, text, lat, lng){
			// id is required
			if(id){
				var latlng = L.latLng(lat, lng);
				var oLeafletLabelIcon = L.divIcon(
						{
							className: className,
							html: text
						});
				var oMarker = L.marker(latlng, { "icon" : oLeafletLabelIcon});
				this._fnRegisterAMarker(id, oMarker);
				this._data.markerLayer.addLayer(oMarker);
			}
		},

		/**
		 * Removes all graphics from markerLayer
		 */
		"fnCleanGraphics" : function() {
			this._fnCleanGraphics();
		},


		/**
		 * Removes all graphics from markerLayer
		 */
		"_fnCleanGraphics" : function() {
			// Clean Layer and dictionary
			this._data.markerLayer.clearLayers();
			this._data.markersById = {};
		},

		/**
		 * Removes all graphics from markerLayer
		 */
		"fnRemoveGraphics" : function(id) {
			this._fnRemoveGraphics(id);
		},

		/**
		 * Removes all graphics from markerLayer
		 */
		"_fnRemoveGraphics" : function(id) {
			// Remove Layer and dictionary by ID
			var rLayer = this._data.markersById[id];
			this._data.markerLayer.removeLayer(rLayer);
		},

		/**
		 * Register a tool with its ID
		 *
		 * @param sId
		 *            unique ID for layer
		 * @param oTool
		 *            instance of GvNIX_Map_Leaflet.CONTROL.Base
		 * @param bDefaultSelected
		 *
		 */
		"_fnRegisterATool" : function(sId, oTool, bDefaultSelected) {
			this._data.toolsById[sId] = oTool;
			if (bDefaultSelected) {
				if (this._data.toolDefault) {
					this.debug("WARN: Overrided default tool (with '" + sId
							+ "')!!");
				}
				this._data.defaultTool = oTool;
			}
		},

		/**
		 * Register a tool with its ID
		 *
		 * @param sId
		 *            unique ID for layer
		 * @param oTool
		 *            instance of GvNIX_Map_Leaflet.CONTROL.Base
		 * @param bDefaultSelected
		 *            if to
		 */
		"_fnRegisterAComponent" : function(sId, oComponent) {
			this._data.componentsById[sId] = oComponent;
		},

		/**
		 * Check if a sId exists on register layer
		 *
		 * @param sId
		 *            to check
		 */
		"fnExistsLayer" : function(sId) {
			return this._data.layersById[sId] ? true : false;
		},

		/**
		 * Check if a sId exists on register tools
		 *
		 * @param sId
		 *            to check
		 */
		"fnExistsTool" : function(sId) {
			return this._data.toolsById[sId] ? true : false;
		},

		/**
		 * Return the GvNIX_Map_Leaflet.LAYERS of current active layer
		 * on map
		 */
		"fnGetActiveLayer" : function(){
			return this._fnGetMapStatus("current_active_layer");
		},

		/**
		 * Return a GvNIX_Map_Leaflet.LAYERS instance by its ID
		 *
		 * @param sId
		 *            of required layer
		 */
		"fnGetLayerById" : function(sId) {
			return this._data.layersById[sId];
		},

		/**
		 * Return a GvNIX_Map_Leaflet.LAYERS instance by its group
		 *
		 * @param sParentId
		 *            parent if of the required layeres
		 */
		"fnGetLayersByGroup" : function(sGroupId) {
			var childLayers = [];

			for(i in this._data.layersById){
				if(this._data.layersById[i].s.group == sGroupId){
					childLayers.push(this._data.layersById[i]);
				}
			}

			return childLayers;
		},

		/**
		 * Return a GvNIX_Map_Leaflet.CONTROLS instance by its ID
		 *
		 * @param sId
		 *            of required layer
		 */
		"fnGetToolById" : function(sId) {
			return this._data.toolsById[sId];
		},

		/**
		 * Return a GvNIX_Map_Leaflet.CONTROLS instance from
		 * the select map tool item
		 */
		"fnGetCurrentTool" : function(){
			return this._data.currentTool;
		},

		/**
		 * Return a Leaflet.FeatureGroup instance by its ID
		 *
		 * @param sId
		 *            Marker object identifier
		 */
		"fnGetMarkerById" : function(sId) {
			return this._fnGetMarkerById(sId);
		},

		/**
		 * Return a Leaflet.FeatureGroup instance by its ID
		 *
		 * @param sId
		 *            Marker object identifier
		 */
		"_fnGetMarkerById" : function(sId) {
			return this.__fnGetMarkerById(sId);
		},

		/**
		 * Show debug message on browser JS console if this._data.debug is true,
		 * otherwise doesn't show the message
		 *
		 * @param message
		 *            to show
		 */
		"debug" : function(message) {
			try {
				if (this._data.debug) {
					console.log("[leaflet.gvnix:" + this.s.id + "] " + message);
				}
			} catch (e) {
				// Can't do anything
			}
		},

		"_clearMarker" : function(map, marker) {
			map.removeLayer(marker);
		},

		/**
		 * Function that saves current map status on localStorage. Saves all
		 * registered objects and all information about map.
		 *
		 * @param sId
		 *            id of some map element that wants to update or create on
		 *            localStorage map element.
		 * @param value
		 *            value of sId element that wants to include on localStorage
		 *            map element
		 *
		 */
		"_fnSaveMapStatus" : function(sId, value) {
			var hash = this.Util.getHashCode(window.location.pathname);
			var mapLocalStorageKey = hash + "_" + this._data.id + "_status";

			// Getting current map status from localStorage
			var mapStatus = localStorage.getItem(mapLocalStorageKey);

			if (mapStatus == null) {
				// If not exists mapStatus yet, create new mapStatus object
				mapStatus = {};
			} else {
				mapStatus = JSON.parse(mapStatus);
			}

			// Saving new id on value
			mapStatus[sId] = value;

			// Saving object on localStorage
			localStorage.setItem(mapLocalStorageKey, JSON.stringify(mapStatus));
		},

		/**
		 * Function to get map status. If sId is defined, gets only satus of an
		 * specific map element saved on localStorage
		 *
		 * @param sId
		 *            id of map element that wants to get status from
		 *            localStorage
		 */
		"_fnGetMapStatus" : function(sId) {
			var hash = this.Util.getHashCode(window.location.pathname);
			var mapLocalStorageKey = hash + "_" + this._data.id + "_status";

			// Getting current map status from localStorage
			var sMapStatus = localStorage.getItem(mapLocalStorageKey);

			if (sMapStatus != null) {
				var oMapStatus = JSON.parse(sMapStatus);

				return oMapStatus[sId];
			}

			return null;
		},

		/**
		 * Function to load map status and apply loaded status to all map
		 * components
		 */
		"_fnLoadMapStatus" : function() {
			// Loading center point
			var savedCenterPoint = this._fnLoadCenterPoint();
			if(savedCenterPoint) {
				this._data.map.setView(this.Util.
						toLantLngObject(savedCenterPoint));
			}

			// Loading zoom status
			var savedZoom = this._fnLoadZoomStatus();
			if (savedZoom) {
				this._data.map.setZoom(savedZoom);
			}

			// Getting all layers to load status
			for (i in this._data.layersById) {
				var layer = this._data.layersById[i];

				// Load state using localStorage
				var status = layer.fnLoadState(true);

				if (status == "true" && layer.s.layer_type != "entity") {
					layer._fnInitializeLayerNode();
				}

				// Getting current active layer
				var currentActiveLayer = this.fnGetActiveLayer();
				if (layer._state.sId == currentActiveLayer) {
					layer._fnActivateLayer();
				}
			}
		},

		/**
		 * Function to recreate all legends into layer container
		 */
		"fnRecreateLegend" : function(){
			this._fnRecreateLegend();
		},

		/**
		 * Function to recreate all legends into layer container
		 */
		"_fnRecreateLegend" : function(){
			var tocControl = this._data.controlLayers;
			var toc = tocControl.fnGetTocTree();
			// get all the layers of the toc
			var aLayers = this.fnGetTocLayersIds();
			// get legend container and clean it
			var oDivContainer = tocControl.fnGetLegendContainer();
			oDivContainer.html("");
			for(x in aLayers){
				var layerId = aLayers[x];
				var layerNode = toc.getNodeByKey(layerId);
				// if layer has children, don't recreate it, create only children legends
				if(!layerNode.hasChildren() && layerNode.isSelected()){
					var gvNIXLayer = this.fnGetLayerById(layerId);
					if(gvNIXLayer.fnIsLegendEnabled() == true){
						var legend = gvNIXLayer.fnCreateLegend();
						oDivContainer.append(legend);
					}
				}

			}
		},

		/**
		 * Function for retrieving map's minZoom value
		 *
		 *  @return map's instance minZoom value
		 */
		"_fnGetMinZoom" : function() {
			return this.fnSettings().minZoom;
		}
	};

	// Static variables * * * * * * * * * * * * * * * * * * * * * * * * * * *

	/**
	 * Store of all instances that have been created of Leaflet_Map, so one can
	 * look up other (when there is need of a master)
	 *
	 * @property _aInstances
	 * @type Array
	 * @default []
	 * @private
	 */
	GvNIX_Map_Leaflet._aInstances = [];

	/**
	 * Function to add new instances
	 */
	GvNIX_Map_Leaflet._fnAddInstance = function(instance) {
		GvNIX_Map_Leaflet._aInstances.push(instance);
	};

	/**
	 * Function to get Map Instance using field and current instance
	 */
	GvNIX_Map_Leaflet.fnGetInstance = function(id) {
		// Getting all instances
		var instances = GvNIX_Map_Leaflet._aInstances;

		// Iterating instances and returning the correct one
		for (i in instances) {
			var instance = instances[i];
			var settings = instance.s;
			if (settings.id == id) {
				return instances[i];
			}
		}
	};

	/**
	 * Function to remove an Instance with given Id
	 */
	GvNIX_Map_Leaflet.fnRemoveInstance = function(id) {
		// Getting all instances
		var instances = GvNIX_Map_Leaflet._aInstances;

		// Iterating instances and returning the correct one
		for (i in instances) {
			var instance = instances[i];
			var settings = instance.s;
			if (settings.id == id) {
				instances.splice(i, 1);
			}
		}
	};

	// Control types register * * * * * * * * * * * * * * * * * * * * *

	GvNIX_Map_Leaflet.CONTROLS = {};

	GvNIX_Map_Leaflet.CONTROLS.Base = {

		/**
		 * Common default options
		 */
		"default_options" : {},

		/**
		 * Minimun layer state data
		 */
		"_state" : {
			"sId" : null, // Control ID
			"oMap" : null, // Instance of GvNIX_Map_Leaflet which contais the
			// control
			"othis" : null
		// jQuery object of this node
		},

		/**
		 * Common control methods
		 */
		"_prototype" : {

			"debug" : function(message) {
				this.__debug(message);
			},
			"__debug" : function(message) {
				var st = this._state;
				st.oMap.debug("[Tool:" + st.sId + "] " + message);
			},

			/**
			 * constructor To override
			 */
			"_fnConstructor" : function() {
				this.__fnConstructor();
			},

			"__fnConstructor" : function() {
				this.Util = GvNIX_Map_Leaflet.Util;

				var s = this.s;
				var st = this._state;

				var othis = jQuery("#" + st.sId);
				st.othis = othis;

				// Register click event
				othis.click(jQuery.proxy(this._fnClick, this));

			},

			/**
			 * Register event click
			 */
			"fnRegisterOnClick" : function(){
				this.__fnRegisterOnClick();
			},

			/**
			 * Register event click
			 */
			"__fnRegisterOnClick" : function(){
				var st = this._state;
				var othis = jQuery("#" + st.sId);
				st.othis = othis;

				// Register click event
				othis.click(jQuery.proxy(this._fnClick, this));
			},

			// Set map controls as enable
			"isEnabled" : function() {
				return true;
			},

			// Map controls are not selectable yet
			"isSelectable" : function() {
				return false;
			},

			// Controls has not any action asigned yet
			"fnDoAction" : function() {
				return null;
			},

			// Set click listener to controls
			"_fnClick" : function() {
				this.fnDoAction();
			}
		}
	};

	GvNIX_Map_Leaflet.CONTROLS.simple_selectable = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.simple_selectable) {
			alert("Warning: GvNIX_Map_Leaflet simple-selectable control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.Base.default_options, {
					"default_selected" : false,
					"cursor_icon" : "resources/images/cursor_hand.png", // Icon
					// to
					// use
					// as
					// cursor
					"fn_on_select" : null, // function to call on select
					// (optional)
					"fn_on_deselect" : null, // function to call on deselect
				// (optional)
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.Base._state,
				{
					"sId" : sId,
					"oMap" : oMap,
					"fnOnSelect" : null, // function to call when control has
					// been selected. If function return false the tool won't be
					// selected.
					"fnOnDeselect" : null
				// function to call when control has been selected.
				// If function return false the tool won't be deselected
				});

		this._fnConstructor();
	};

	GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype = jQuery
			.extend(
					{},
					GvNIX_Map_Leaflet.CONTROLS.Base._prototype,
					{
						"_fnConstructor" : function() {
							this.__simple_selectable_fnConstructor(true);
						},

						// Class constructor
						"__simple_selectable_fnConstructor" : function(
								bRequireOnSelect) {
							this.__fnConstructor();
							var s = this.s;
							var st = this._state;
							var map = this._state.oMap;

							if (s.fn_on_select) {
								st.fnOnSelect = this.Util.getFunctionByName(
										s.fn_on_select, jQuery.proxy(
												this.debug, this));
							} else if (bRequireOnSelect) {
								this
										.debug("ERROR: Missing function to call on select (required option 'fn_on_select'");
							}

							if (s.fn_on_deselect) {
								st.fnOnDeselect = this.Util.getFunctionByName(
										s.fn_on_deselect, jQuery.proxy(
												this.debug, this));
							}
						},

						// Controls are currently selectable
						"isSelectable" : function() {
							return true;
						},

						// return if control is currently selected
						"isSelected" : function() {
							return this.__isSelected();
						},

						"__isSelected" : function() {
							return this.isSelectable()
									&& this._state.othis
											.hasClass("mapviewer_tool_selected");
						},

						// Select clicked tool
						"_fnClick" : function() {
							this.fnSelect();
						},

						"fnDoAction" : function() {
							return this.fnSelect();
						},

						// Returns the selected tool
						"fnSelect" : function() {
							return this.__fnSelect();
						},

						"__fnSelect" : function() {
							this._state.oMap._fnSelectTool(this);
						},

						"_fnDoSelect" : function() {
							return this.__fnDoSelect();
						},

						/**
						 * Activate the selected tool
						 */
						"__fnDoSelect" : function() {
							var s = this.s;
							var st = this._state;
							var map = this._state.oMap;

							if (st.fnOnSelect) {
								var returnValue = st.fnOnSelect(map, st.sId,
										this);
								if (returnValue == false) {
									return false;
								}
							}
							if (!st.othis.hasClass("mapviewer_tool_selected")) {
								st.othis.addClass("mapviewer_tool_selected");
							}
							map._fnSetCursorIcon(s.cursor_icon);
							return true;
						},

						"_fnDoDeselect" : function() {
							return this.__fnDoDeselect();
						},

						/**
						 * When a tool is deselected on map toolbar
						 */
						"__fnDoDeselect" : function() {
							var st = this._state;
							var map = this._state.oMap;
							if (st.fnOnDeselect) {
								var returnValue = st.fnOnDeselect(map, st.sId,
										this)
								if (returnValue == false) {
									return false;
								}
							}
							st.othis.removeClass("mapviewer_tool_selected");
							return true;
						}

					});

	GvNIX_Map_Leaflet.CONTROLS.pan = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.pan) {
			alert("Warning: GvNIX_Map_Leaflet simple-selectable control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.simple_selectable.default_options, {
					"default_selected" : false,
					"cursor_icon" : "resources/images/cursor_hand.png", // Icon
				// to
				// use
				// as
				// cursor
				});

		this.s = jQuery.extend({}, this._default_options, options);

		delete this.s.fn_on_select;
		delete this.s.fn_on_deselect;

		this.fnSettings = function() {
			return this.s;
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.Base._state,
				{
					"sId" : sId,
					"oMap" : oMap,
				});

		this._fnConstructor();
	};

	GvNIX_Map_Leaflet.CONTROLS.pan.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.CONTROLS.simple_selectable.prototype, {
				"_fnConstructor" : function() {
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					var map = this._state.oMap;
				}
			});

	GvNIX_Map_Leaflet.CONTROLS.simple_action = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.simple_action) {
			alert("Warning: GvNIX_Map_Leaflet simple-action control must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.CONTROLS.Base.default_options, {
					"fn_action" : null
				// function to call on action
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.Base._state,
				{
					"sId" : sId,
					"oMap" : oMap,
					"fnAction" : null
				// Action to call
				});

		this.fnSettings = function() {
			return this.s;
		}

		this._fnConstructor();
	};

	GvNIX_Map_Leaflet.CONTROLS.simple_action.prototype = jQuery
			.extend(
					{},
					GvNIX_Map_Leaflet.CONTROLS.Base._prototype,
					{

						"debug" : function(message) {
							var st = this._state;
							st.oMap.debug("[Tool-Action:" + st.sId + "] "
									+ message);
						},

						/**
						 * Class constructor
						 */
						"_fnConstructor" : function() {
							this.__fnConstructor();
							var s = this.s;
							var st = this._state;

							if (s.fn_action) {
								st.fnAction = this.Util.getFunctionByName(
										s.fn_action, jQuery.proxy(this.debug,
												this));
							} else {
								this
										.debug("ERROR: Missing function to call (required option 'fn_action'");
							}
						},

						/**
						 * Returns the called action
						 */
						"fnDoAction" : function() {
							return this._simple_action_fnDoAction();
						},

						/**
						 * Gives the action attached to a control
						 */
						"_simple_action_fnDoAction" : function() {
							var st = this._state;
							if (!st.fnAction) {
								this.debug("ERROR: No function to call");
								return;
							}
							return st.fnAction(st.oMap, st.sId, this);
						}
					});

	GvNIX_Map_Leaflet.CONTROLS.opacity = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.CONTROLS.opacity) {
			alert("Warning: GvNIX_Map_Leaflet opacity control must be initialised with the keyword 'new'");
		}

		this.s = jQuery.extend({}, this._default_options, options);

		this.fnSettings = function() {
			return this.s;
		}

		this._data = {
			/**
			 * Current selected layer
			 */
			"currentLayer" : null
		}

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.CONTROLS.Base._state,
				{
					"type" : "opacity",
					"sId" : sId,
					"oMap" : oMap,
					"bEnabled" : false
				});

		this._fnConstructor();
	};

	GvNIX_Map_Leaflet.CONTROLS.opacity.prototype = jQuery
			.extend(
					{},
					GvNIX_Map_Leaflet.CONTROLS.Base._prototype,
					{
						"_fnConstructor" : function() {
							this.__fnConstructor();
							var s = this.s;
							var st = this._state;
							var map = this._state.oMap;

							// Getting input
							var inputRange = jQuery(s.htmlTool).find("input");
							var inputRangeToolTip = jQuery(s.htmlTool).find(
									"output");
							this.s.inputRange = inputRange;
							this.s.inputRangeToolTip = inputRangeToolTip;

							// Initializing input
							inputRange.val(0);

							// Registering tool
							map._data.layersToolBar.tools.push(this);

							// Append to the begining of the fancytreeDiv
							// container
							s.layersToolBar._setHtmlContent(s.htmlTool);
							jQuery(".fancytreeDiv").prepend(
											s.layersToolBar._container);

							// Register change layer callback
							map.s.toolsLayersCallbacks.add(jQuery.proxy(
									this._fnOnLayerChange, this));

							// Registering events
							this._fnRegisterChangeEvent(inputRange, map);
							this._fnRegisterOnLostFocusEvent(inputRange,
									inputRangeToolTip);

						},

						/**
						 * Method that will be called when layer changes
						 *
						 * @param oLayer
						 *            new active layer
						 */
						"_fnOnLayerChange" : function(oLayer) {
							if (oLayer) {
								if (oLayer.fnSetOpacity
										&& oLayer.fnGetOpacity) {
									// Enable input range
									jQuery(this.s.inputRange).prop("disabled",
											false);
									jQuery(this.s.inputRange).css("opacity",
											"1");

									// Load current opacity
									var currentOpacity = oLayer.fnGetOpacity();
									if(currentOpacity == undefined){
										currentOpacity = 1;
									}
									var opacity = 1 - currentOpacity;
									this.s.inputRange.val(opacity);
								} else {
									// Disable input range
									jQuery(this.s.inputRange).prop("disabled",
											true);
									this.s.inputRange.val(0);
									jQuery(this.s.inputRange).css("opacity",
											"0.3");
								}
							}
						},

						/**
						 * Method to register opacity input change event
						 *
						 * @param $input
						 *            input range where register change event
						 * @param map
						 *            map element
						 */
						"_fnRegisterChangeEvent" : function($input, map) {
							var instance = this;

							jQuery($input)
									.on(
											"input",
											function() {
												if (map._data.oActiveLayer) {
													var $this = jQuery(this);
													var value = 1 - $this.val();

													// showing tooltip
													instance.s.inputRangeToolTip
															.show();

													// Changing tooltip and
													// moving tooltip
													instance.s.inputRangeToolTip
															.text("Transparency "
																	+ ($this
																			.val() * 100)
																	+ "%");
													instance.s.inputRangeToolTip
															.css(
																	"margin-left",
																	$this.val()
																			* 100
																			+ "px");

													// Change opacity
													instance
															._fnChangeOpacity(
																	map._data.oActiveLayer,
																	value);
												}
											});
						},

						/**
						 * Method to register input range lost focus event
						 *
						 * @param $input
						 *            input range where register lost focus
						 *            event
						 */
						"_fnRegisterOnLostFocusEvent" : function($input) {
							var instance = this;

							jQuery($input).on('change', function() {
								// Hide tooltip
								instance.s.inputRangeToolTip.hide();
							});
						},

						/**
						 * Function to change opacity of a layer
						 *
						 * @param oLayer
						 *            layer to change the opacity
						 * @param value
						 *            opacity level
						 */
						"_fnChangeOpacity" : function(oLayer, value) {
							if (oLayer) {
								if (oLayer.fnSetOpacity
										&& oLayer.fnGetOpacity) {
									oLayer.fnSetOpacity(value);
								} else {
									console
											.log("ERROR: This layer doesn't have implemented "
													+ "fnSetOpacity and fnGetOpacity method");
								}
							}
						}

					});

	// Layer types register * * * * * * * * * * * * * * * * * * * * *

	/**
	 * Register of supported Layers types
	 */
	GvNIX_Map_Leaflet.LAYERS = {};

	/**
	 * This object contains the common data and methods for a layer.
	 */
	GvNIX_Map_Leaflet.LAYERS.Base = {

		/**
		 * Common default options
		 */
		"default_options" : {
			"checkbox" : null, // DOM id of layer check box (optional)
			"span" : null, // DOM id of layer title
			"default_state" : null, // Default visibility of layer the first time it is shown
			"allow_disable" : true, // Allow user to change layer visualization
			"min_zoom" : null, // Minimun zoom level on which layer is displayed
			"max_zoom" : null, // Maximun zoom level on which layer is displayed
			"index" : null, // Set fixed layer index inside container
			"msgLegendUndefined" : "Legend ins't defined", // message to show when legend isn't defined or has an error
			"msgMetadataUndefined" : "Layer information not available ", // message to show when metadata isn't defined or has an error
			"enable_legend" : true, // Indicate if legend is enabled
			"loading_message": null	//Message loading data
		},

		/**
		 * Minimun layer state data
		 */
		"_state" : {
			"sId" : null, // Layer ID
			"nLayer" : null,
			"oCheckbox" : null, // jQuery CheckBox object (from s.checkbox) (optional)
			"oSpan" : null, // jQuery span object (from s.span) (optional)
			"oMap" : null, // Instance of GvNIX_Map_Leaflet which contais the layer
			"oLayer" : null, // Leaflet layer instance related to this instance
			"oGroup" : null, // GvNIX_Map_Leaflet.LAYERS.group instance which contain this layer (optional)
			"oGroupIndex" : null, // Layer's group index
			"oActiveLayer" : null, // Focused layer on toc
			"aLayerToolsById" : null, // Layer tools, registered by id
			"fnPrepareFeatureInfo" : null, // Specify the name of function to get layer feature info
			"featureInfoType" : null, // Specify feature info type returned by fnPrepareFeatureInfo function
			"featureInfoErrorMsg" : null, // Error message to show when it's unable to get any feature information
			"legendType" : null, // Specify legend type returned by fnPrepareLegend function
			"metadataType" : null, // Specify metadata type returned by fnPrepareMetadata function
			"fnPrepareLegend" : null, // Specify the name of function to draw layer legend
			"fnPrepareMetadata" : null, // Specify the name of function to get layer metadata
			"oPanelLoading": null	//tool panel diplaying loading message
		},

		/**
		 * Common layer methods
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
				this.Util = GvNIX_Map_Leaflet.Util;
				var s = this.s;
				var st = this._state;
				var nLayer = jQuery("#" + st.sId);

				if (nLayer.length > 0) {
					st.nLayer = nLayer;
				}

				if (s.span) {
					st.oSpan = jQuery("#" + s.span);
					if (!st.oCheckbox) {
						this.debug("span id='" + s.span + "' not found");
					}
				}

				if (s.group) {
					st.oGroup = st.oMap.fnGetLayerById(s.group);
					if (!st.oGroup) {
						this.debug("group id='" + s.group + "' not found");
					}

					if(st.oGroup.fnRegisterChild){
						st.oGroup.fnRegisterChild(this);
					}
				}

				if (!s.default_state) {
					if(!st.oMap.s.display_TOC){
						s.default_state = "true";
					}else if (s.group) {
						s.default_state = "parent";
					} else if (!s.allow_disable) {
						s.default_state = "true";
					} else {
						s.default_state = "false";
					}
				}

				if (!s.max_zoom && s.max_zoom != 0) {
					s.max_zoom = null;
				} else {
					s.max_zoom = toInt(s.max_zoom);
				}

				if (!s.min_zoom && s.min_zoom != 0) {
					s.min_zoom = null;
				} else {
					s.min_zoom = toInt(s.min_zoom);
				}
				s.index = toInt(s.index);

				if(s.fn_prepare_feature_info){
					st.fnPrepareFeatureInfo = this.Util.getFunctionByName(s.fn_prepare_feature_info,
							jQuery.proxy(this.debug, this));
				}

				if(s.feature_info_type){
					st.featureInfoType = s.feature_info_type.toUpperCase();
				}

				if(s.feature_info_eror_msg){
					st.featureInfoErrorMsg = s.feature_info_eror_msg;
				}

				if(s.legend_type){
					st.legendType = s.legend_type.toUpperCase();
				}

				if(s.fn_prepare_legend){
					st.fnPrepareLegend =
						this.Util.getFunctionByName(s.fn_prepare_legend,
								jQuery.proxy(this.debug, this));
				}

				if(s.metadata_type){
					st.metadataType = s.metadata_type.toUpperCase();
				}

				if(s.fn_prepare_metadata){
					st.fnPrepareMetadata =
						this.Util.getFunctionByName(s.fn_prepare_metadata,
								jQuery.proxy(this.debug, this));
				}

				if(s.msg_legend_undefined){
					st.msgLegendUndefined = s.msg_legend_undefined;
				}

				if(s.msg_metadata_undefined){
					st.msgMetadataUndefined = s.msg_metadata_undefined;
				}

				if(s.enable_legend){
					st.enableLegend = s.enable_legend;
				}

				// Save opacity in localStorage if it wasn't previously saved
				if(s.opacity && this._fnLoadOpacityStatus() == undefined){
					this._fnSaveOpacityStatus(s.opacity);
				}

				// Register on move listener
				var oLeafletMap = st.oMap.fnGetMapObject();
				oLeafletMap.on("zoomend", jQuery.proxy(this._fnZoomChanged,
						this));
			},

			/**
			 * Check if legend is enabled
			 */
			"fnIsLegendEnabled" : function(){
				return this.s.enable_legend;
			},

			/**
			 * Check if have the required parameters to use the function
			 * to set layer legend defined by user
			 */
			"fnIsPrepareLegendDefined" : function(){
				var st = this._state;
				if(st.fnPrepareLegend &&
						(st.legendType == "URL" || st.legendType == "STRING"
							|| st.legendType == "IMG")
						){
					return true;
				}else{
					return false;
				}
			},

			/**
			 * Check if have the required parameters to use the function
			 * to set layer metadata defined by user
			 */
			"fnIsPrepareMetadataDefined" : function(){
				var st = this._state;
				if(st.fnPrepareMetadata &&
						(st.metadataType == "URL" || st.metadataType == "STRING"
							|| st.metadataType == "JSON")
						){
					return true;
				}else{
					return false;
				}
			},

			/**
			 * Call function defined into fnPrepareLegend parameter
			 * and return the hmtl to add into legend container
			 */
			"__fnCreateLegendUserFn" : function(){
				// parameters are map and layer
				var st = this._state;
				var value = st.fnPrepareLegend(st.oMap, this);
				var altMsg = st.msgLegendUndefined;
				var html = "<div id='"+st.sId+"_legend'>";
				html += "<p>"+this.s.title+"</p>";
				if(st.legendType == "URL"){
					html += "<iframe src='";
					html += value;
					html += "'/> </BR>";
				}else{
					if(st.legendType == "IMG"){
						html += "<img src='";
						html += value;
						html += "' alt='" +altMsg;
						html += "'/> </BR>";
					}else{ // html
						html += "<div class='leaflet-control-layers-legend-div'>";
						html += value;
						html += "</div> </BR>";
					}
				}
				html += "</div>"
				return html;
			},

			/**
			 * Create html with load message
			 */
			"fnCreateLoadingPanel" : function(){
				this._fnCreateLoadingPanel();
			},

			/**
			 * Create html with load message
			 */
			"_fnCreateLoadingPanel" : function(){
				var st = this._state;
				//create loading message
			    if( !jQuery('#loadingMessageId').length ) {
			    	var panelHtml = '<div id="loadingMessageId" style="diplay:none; padding-right: 10px;" class="leaflet-control-toolbar leaflet-control-toolbar-expanded leaflet-control leaflet-control-toolbar-list"><i title="loading data" class="fa fa-spinner fa-spin" id="loadingText"></i><span>' + this.s.loading_message + '</span></div>';
			    	st.oPanelLoading = jQuery.parseHTML(panelHtml);
			    	// get height and with from parent element
			    	var parentHeight = jQuery(".mapviewer_control").height();
			    	var parentWidth = jQuery(".mapviewer_control").width();

			    	//add panel loading
			    	jQuery('.mapviewer_control').prepend(st.oPanelLoading);

			    	//get height and with from loading message
			    	var loadingHeight = jQuery("#loadingMessageId").height();
			    	var loadingWidth = jQuery("#loadingMessageId").width();

			    	//setting margin to panel
			    	jQuery("#loadingMessageId").css("margin-top", ((parentHeight / 2 - loadingHeight/2)) + "px" );
			    	jQuery("#loadingMessageId").css("margin-left", ((parentWidth / 2 - loadingWidth/2)) + "px" );
			    }
			},

			/**
			 * Function to create layer legend
			 * Returns html to add into legend container
			 */
			"fnCreateLegend" : function(){
				var html = "";
				if(this.fnIsPrepareLegendDefined()){
					html = this.__fnCreateLegendUserFn();
				}else{
					html = this.__fnCreateLegend();
				}
				return html;
			},

			/**
			 * Function to create layer legend
			 * Returns html to add into legend container
			 */
			"__fnCreateLegend" : function(){
				var st = this._state;
				var html = "<div id='"+st.sId+"_legend'>";
				var title = "";
				if (this.s.title != undefined) {
					title = this.s.title;
				}
				html += "<p>"+title+"</p>";
				html += "<span>";
				html += st.msgLegendUndefined;
				html += "</span> </div>";
				return html;
			},

			/**
			 * Call function defined into fnPrepareMetadata parameter
			 * and return the hmtl to add into dialog to show layer metadata
			 */
			"__fnGetMetadataUserFn" : function(callbackFn){
				// parameters are map and layer
				var st = this._state;
				var value = st.fnPrepareMetadata(st.oMap, this);
				callbackFn(value, st.metadataType);
			},

			/**
			 * Function to get layer metadata
			 */
			"fnGetMetadata" : function(callbackFn){
				var html = "";
				if(this.fnIsPrepareMetadataDefined()){
					this.__fnGetMetadataUserFn(callbackFn);
				}else{
					this.__fnGetMetadata(callbackFn);
				}
			},

			/**
			 * Function to get layer metadata
			 */
			"__fnGetMetadata" : function(callbackFn){
				var st = this._state;
				var html = "<span style='font-weight: bold;font-size: 16px;'>";
				html += st.msgMetadataUndefined;
				html += "</span>";
				callbackFn(html, "STRING");
			},

			/**
			 * Get title of the layer
			 */
			"fnGetTitle" : function(){
				var title = "";
				if (this.s.title != undefined) {
					title = this.s.title;
				} else {
					title = this._state.sId;
				}
				return title;
			},

			/**
			 * Build node from layer data and return it
			 */
			"fnGetNodeData" : function() {
				return this.__fnGetNodeData();
			},

			/**
			 * Build basic node from layer data and return it
			 *
			 */
			"__fnGetNodeData" : function() {
				var node = {
					folder : false,
					title : null,
					data : {
						iconclass : null,
					},
					key : null,
					icon : null,
					styles : null
				}

				if (this.s.title != undefined) {
					node.title = this.s.title;
				} else {
					node.title = this._state.sId;
				}

				// Set node id
				node.key = this._state.sId;

				// Check if is necessary to include new tools span on node title
				if (this._state.aLayerToolsById
						&& this._state.aLayerToolsById.length > 0) {
					node.title += "<span id='" + node.key
							+ "_span-tools' class='toc_layers_span'></span>";
				}

				return node;
			},

			/**
			 * Initialize node from layer
			 */
			"fnInitializeLayerNode" : function() {
				return this._fnInitializeLayerNode();
			},

			/**
			 *
			 */
			"_fnInitializeLayerNode" : function() {
				var node = this._state.oMap._data.tree
						.getNodeByKey(this._state.sId);
				if (node != null) {
					var tocControl = this._state.oMap._data.controlLayers;

					// Set node_icon
					this._fnSetLayerIcons(node);

					// Initialize layer's checkbox status
					tocControl._fnInitializeCheckbox(node, this,
						this._state.oMap);

					// Set layer custom styles
					this._fnSetIconStyle(node);

					// Set loading img if needed
					if(this._state.oLoadingIcon){
						this._fnSetLoadingIcon(node);
					}

					// Set registered layer tools on current layer node
					if (this._state.aLayerToolsById
							&& this._state.aLayerToolsById.length > 0) {
						this.fnSetLayerTools(node);
					}
				}
			},

			/**
			 * Sets layer ZIndex if necessary
			 *
			 * @param index
			 */
			"fnSetZIndex" : function(index) {
				this._fnSetZIndex(index);
			},

			/**
			 * Sets layer ZIndex if necessary
			 *
			 * (Default implementation)
			 *
			 * @param index
			 */
			"_fnSetZIndex" : function(index) {
				this._state.oLayer.setZIndex(index);
			},

			/**
			 * Include loading Icon if is defined on current layer
			 *
			 * @param node
			 *            Fancytree node object where loading icon
			 *            will be included
			 *
			 */
			"_fnSetLoadingIcon" : function(node){
				this.__fnSetLoadingIcon(node);
			},

			/**
			 * Include loading Icon if is defined on current layer
			 *
			 * @param node
			 *            Fancytree node object where loading icon
			 *            will be included
			 * (Default implementation)
			 */
			"__fnSetLoadingIcon" : function(node){
				// Getting loading Img
				var loadingImg = this._state.oLoadingIcon;

				// Getting node span
				if(node.span != null){
					loadingImg.appendTo(node.span);
				}
			},



 			/**
			 * Function that will set registered layer tools on current layer
			 * node
			 *
			 * @param node
			 *            Fancytree node object where registered layer tools
			 *            will be included
			 */
			"fnSetLayerTools" : function(node) {
				this._fnSetLayerTools(node);
			},

			/**
			 * Function that will set registered layer tools on current layer
			 * node
			 *
			 * (Default implementation)
			 *
			 * @param node
			 *            Fancytree node object where registered layer tools
			 *            will be included
			 */
			"_fnSetLayerTools" : function(node) {

				if(node.span != undefined){
					// Getting span tools
					var spanTools = jQuery(node.span).find(
							"#" + this._state.sId + "_span-tools");

					if (spanTools.length == 0) {
						var spanTools = jQuery.parseHTML("<span class='toc_layers_span' id='" + this._state.sId
								+ "_span-tools'></span>")[0];
					}
					jQuery(spanTools).prependTo(node.span);
					for (i in this._state.aLayerToolsById) {
						var tool = this._state.aLayerToolsById[i];
						// Adding tools to span tools
						jQuery(tool.s.htmlElement).appendTo(spanTools);
						// Register click event to the tool
						tool.fnRegisterOnClick();
					}
				}
			},

			/**
			 * Function to activate current layer on Toc
			 */
			"fnActivateLayer" : function() {
				this._fnActivateLayer();
			},

			/**
			 * Function to activate current layer on Toc
			 *
			 * (Default implementation)
			 */
			"_fnActivateLayer" : function() {
				var node = this._state.oMap._data.tree
					.getNodeByKey(this._state.sId);

				if (node != null) {
					setTimeout(function() {
						// Activate layer
						node.setActive(true);
					}, 500);
				}
			},

			/**
			 * Function to check current layer on Toc
			 */
			"fnCheckLayer" : function() {
				this._fnCheckLayer();
			},

			/**
			 * Function to check current layer on Toc
			 *
			 * (Default implementation)
			 */
			"_fnCheckLayer" : function() {
				var node = this._state.oMap._data.tree
					.getNodeByKey(this._state.sId);

				if (node != null) {
					setTimeout(function() {
						// Activate layer
						node.setSelected(true);
					}, 100);
				}
			},

			/**
			 * Function to uncheck current layer on TOC if it could be disabled
			 */
			"fnUncheckLayer" : function() {
				this._fnUncheckLayer();
			},

			/**
			 * Function to uncheck current layer on TOC if it could be disabled
			 *
			 * (Default implementation)
			 */
			"_fnUncheckLayer" : function() {

				// Check allow_disable property
				if (this.s.allow_disable == true){
					var node = this._state.oMap._data.tree
					.getNodeByKey(this._state.sId);

					if (node != null) {
						setTimeout(function() {
							// Activate layer
							node.setSelected(false);
						}, 100);
					}
				}
			},

			/**
			 * Function to get layer checkbox status
			 */
			"fnIsSelected" : function() {
				return this._state.oCheckbox;
			},

			/**
			 * Check if have the required parameters to use the function
			 * to set layer featureInfo defined by user
			 */
			"fnIsPrepareFeatureInfoDefined" : function(){
				var st = this._state;
				if(st.fnPrepareFeatureInfo &&
						(st.featureInfoType == "URL" || st.featureInfoType == "STRING"
							|| st.featureInfoType == "JSON")){
					return true;
				}else{
					return false;
				}
			},

			/**
			 * Function to get layer feature info
			 *
			 * @param point
			 * 		Clicked point in pixels of cointainer layer where
			 * 		user had clicked. Used for requesting data to WMS server.
			 * @param callback
			 * 		Function to call when data request finishes successfull
			 */
			"fnGetFeatureInfo" : function(point, callback){
				if(this.fnIsPrepareFeatureInfoDefined()){
					this.__fnGetFeatureInfoUserFn(point, callback);
				}else{
					this.__fnGetFeatureInfo(point, callback);
				}
			},

			/**
			 * Function to get layer feature info
			 *
			 * @param point
			 * 		Clicked point in pixels of cointainer layer where
			 * 		user had clicked. Used for requesting data to WMS server.
			 * @param callback
			 * 		Function to call when data request finishes successfull
			 */
			"__fnGetFeatureInfo" : function(point, callback){
				callback(this._state.featureInfoErrorMsg, "STRING");
			},

			/**
			 * Call function defined into fnPrepareFeatureInfo parameter
			 * and call function to show pop-up with value received from
			 * user function
			 */
			"__fnGetFeatureInfoUserFn" : function(point, callback){
				var st = this._state;
				var value = st.fnPrepareFeatureInfo(point, callback);
				callback(value, st.featureInfoType);
			},

			/**
			 * Set layer's node icons
			 *
			 * @param $treeNode
			 *            fancytree node
			 *
			 * @return fancytree TOC node
			 */
			"_fnSetLayerIcons" : function($treeNode) {
				var icon = this.s.node_icon;
				if (icon != undefined) {
					if (icon.charAt(0) == "/") {
						// Load layer icon from resources
						$treeNode.data.icon = icon.substring(1, icon.length);
					} else if (icon.charAt(0) == ".") {
						// Load layer icon from a CSS class
						$treeNode.data.iconclass = icon.substring(1,
								icon.length)
								+ " layer_legend_icon";
					} else if (icon == "NONE" || icon == "") {
						// Default icon
						$treeNode.data.iconclass = "layer_legend";
					} else {
						// Load library icon (Glyphicon)
						$treeNode.data.iconclass = "glyphicon " + icon;
					}

					// Render CSS changes
					$treeNode.renderStatus();

					// Render element changes
					$treeNode.renderTitle();

				}
				return $treeNode;
			},

			/**
			 * Function to set a title to be displayed on a layer
			 *
			 * @param layerId
			 * @param title
			 */
			"fnSetLayerTitle" : function(layerId, title) {
				this._fnSetLayerTitle(layerId, title);
			},

			/**
			 * Function to set a title to be displayed on a layer
			 *
			 * (Default implementation)
			 *
			 * @param layerId
			 * @param title
			 */
			"_fnSetLayerTitle" : function(layerId, title) {
				var st = this._state;
				var map = st.oMap;
				var tree = map._data.tree;
				var node = tree.getNodeByKey(layerId);
				node.setTitle(title);
			},

			/**
			 * Add icon custom styles
			 *
			 * @param $treeNode
			 *            fancytree node
			 */
			"_fnSetIconStyle" : function($treeNode) {
				if (this.s.styles != undefined) {
					$treeNode.data.styles = this.s.styles;
					this._state.oMap._data.controlLayers
							._fnBuildStyle($treeNode);
				}
			},

			/**
			 * Get groupId of current layer
			 */
			"fnGetParentNodeId" : function() {
				return this.__fnGetParentNodeId();
			},

			/**
			 * Get groupId of current layer
			 */
			"__fnGetParentNodeId" : function() {
				return this.s.group;
			},

			/**
			 * Default debug message function. Should be override
			 */
			"debug" : function(message) {
				this._state.oMap.debug("[Layer:'" + this.s.sId + "'] "
						+ message);
			},

			/**
			 * Get Layer ID
			 */
			"fnGetId" : function() {
				return this._state.sId;
			},

			/**
			 * Function called when layer related checkbox changed
			 */
			"fnCheckChanged" : function() {
				// Call standar implementation
				this.__fnCheckChanged();
			},

			/**
			 * Function called when layer related checkbox changed.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnCheckChanged" : function() {
				if (this._state.oCheckbox == true) {
					this.fnShow(false);
				} else {
					this.fnHide(false);
				}
			},

			/**
			 * Function called when layer is activated or deactivated
			 */
			"fnActiveLayerChanged" : function(isActive) {
				var st = this._state;
				// Call custom implementation of current tool, if exists
				var currentTool = st.oMap.fnGetCurrentTool();
				if(currentTool && currentTool._fnActiveLayerChanged){
					currentTool._fnActiveLayerChanged();
				}else{
					// Default implementation
					this.__fnActiveLayerChanged(isActive);
				}
			},

			/**
			 * Function called when layer is selected or unselected Default
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnActiveLayerChanged" : function(isActive) {
				// Nothing to do
			},

			/**
			 * Informs if layer is visible with curren map zoom level (based on
			 * min_zoom and max_zoom layer options)
			 */
			"fnIsVisibleOnThisZoom" : function() {
				return this.__fnIsVisibleOnThisZoom();
			},

			/**
			 * Informs if layer is visible with curren map zoom level (based on
			 * min_zoom and max_zoom layer options).
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnIsVisibleOnThisZoom" : function() {
				var s = this.s;
				if (s.max_zoom == null && s.min_zoom == null) {
					// No zoom config: always true
					return true;
				}
				// Get current zoom level
				var st = this._state;
				var oLeafletMap = st.oMap.fnGetMapObject();
				var curZoom = oLeafletMap.getZoom();
				// Check min and max range (if any)
				if (s.min_zoom != null && curZoom <= s.min_zoom) {
					// not visible
					return true;
				} else if (s.max_zoom != null && curZoom > s.max_zoom) {
					// not visible
					return false;
				}
				// is visible
				return true;
			},

			/**
			 * Called when map zoom level changed
			 */
			"_fnZoomChanged" : function() {
				this.__fnZoomChanged();
			},

			/**
			 * Called when map zoom level changed.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnZoomChanged" : function() {
				var s = this.s;
				if (s.max_zoom == null && s.min_zoom == null) {
					// No zoom config: nothing to do
					return;
				}
				var st = this._state;
				if (st.oCheckbox == false) {
					// Not visible: nothing to check
					return;
				}
				if (this.fnIsVisibleOnThisZoom()) {
					// set Visible
					this._fnAddToContainer();
					this._fnUpdateVisibleOnZoomStatus(true);
				} else {
					// set not Visible
					this._fnRemoveFromContainer();
					this._fnUpdateVisibleOnZoomStatus(false);
				}
			},

			/**
			 * Update Layer UI to inform to use that layer is not currently
			 * visible.
			 *
			 * @param bStatus
			 *            visibility status
			 */
			"_fnUpdateVisibleOnZoomStatus" : function(bStatus) {
				this.__fnUpdateVisibleOnZoomStatus(bStatus);
			},

			/**
			 * Update Layer UI to inform to use that layer is not currently
			 * visible.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param bStatus
			 *            visibility status
			 */
			"__fnUpdateVisibleOnZoomStatus" : function(bStatus) {
				var oSpan = this._state.oSpan;
				if (!oSpan) {
					return;
				}
				if (bStatus) {
					oSpan.css("opacity", "1.0");
				} else {
					oSpan.css("opacity", "0.5");
				}
			},

			/**
			 * Add current leaflet layer instance to its container layer. This
			 * makes leaflet to draw it. Before add it, checks if it's already
			 * on container.
			 */
			"_fnAddToContainer" : function() {
				this.__fnAddToContainer();
			},

			/**
			 * Add current leaflet layer instance to its container layer. This
			 * makes leaflet to draw it. Before add it, checks if it's already
			 * on container.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnAddToContainer" : function() {
				var st = this._state;
				var container = this._fnGetLayerContainer();
				var index = this.s.index;
				if (container.hasLayer(st.oLayer)) {
					// Layer already in container: nothing to do
					return;
				}
				var aOriginalLayers = container.getLayers();
				if (aOriginalLayers.length == 0 || (!index && index != 0)) {
					// No layers on container:
					// just inser layer
					container.addLayer(st.oLayer);
					return;
				}
				// locate the right position
				var aToAdd = null;
				var curIndex = null;
				var ocLayer = null;
				// iterate over current layer
				for (var i = 0; i < aOriginalLayers.length; i++) {
					ocLayer = aOriginalLayers[i];
					if (!aToAdd) {
						// determine current layer index
						curIndex = ocLayer._gvNIX_layer_index ? ocLayer._gvNIX_layer_index
								: i;
						if (curIndex > index) {
							// new layer should include before current
							// add current layer as next
							aToAdd = [ st.oLayer, ocLayer ];
							// remove current layer form container
							// will be added at the end
							container.removeLayer(ocLayer);
						}
					} else {
						// layer order has been changed
						// store current layer and remove from container
						aToAdd.push(ocLayer);
						container.removeLayer(ocLayer);
					}
				}
				if (!aToAdd) {
					// No order change, add at the end of container
					container.addLayer(st.oLayer);
				} else {
					// Add new layer and removed in order
					for (var i = 0; i < aToAdd.length; i++) {
						container.addLayer(aToAdd[i]);
					}
				}
			},

			/**
			 * Remove current leaflet layer instance from its container layer.
			 * This removes layer visualization. Before remove it, checks if
			 * it's on container.
			 */
			"_fnRemoveFromContainer" : function() {
				this.__fnRemoveFromContainer();
			},

			/**
			 * Remove current leaflet layer instance from its container layer.
			 * This removes layer visualization. Before remove it, checks if
			 * it's on container.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnRemoveFromContainer" : function() {
				var st = this._state;
				var container = this._fnGetLayerContainer();
				if (container.hasLayer(st.oLayer)) {
					container.removeLayer(st.oLayer);
				}
			},

			/**
			 * Toggle layer visualization
			 *
			 * @return true if result is layer visible
			 */
			"fnToggleShow" : function() {
				return this.__fnToggleShow();
			},

			/**
			 * Toggle layer visualization
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @return true if result is layer visible
			 */
			"__fnToggleShow" : function() {
				if (this.fnIsVisible()) {
					this.fnHide();
					return false;
				} else {
					this.fnShow();
					return true;
				}
			},

			/**
			 * Gets the current leaflet layer container. Thas is the leaflet map
			 * instance or a leaflet layerGroup.
			 */
			"_fnGetLayerContainer" : function() {
				return this.__fnGetLayerContainer();
			},

			/**
			 * Gets the current leaflet layer container. Thas is the leaflet map
			 * instance or a leaflet layerGroup.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnGetLayerContainer" : function() {
				var st = this._state;
				var map = st.oMap, group = st.oGroup;
				if (group && group.fnGetLeafletGroup) {
					return group.fnGetLeafletGroup();
				}
				return map._fnGetRootLayer();
			},

			/**
			 * Informs if layer is currently visible (related leaflet layer
			 * instance is on leaflet layer container). The real visibility
			 * depends on parent layer.
			 */
			"fnIsVisible" : function() {
				return this.__fnIsVisible();
			},

			/**
			 * Informs if layer is currently visible (related leaflet layer
			 * instance is on leaflet layer container). The real visibility
			 * depends on parent layer.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnIsVisible" : function() {
				var st = this._state;
				if (!st.oLayer) {
					this.debug("ERROR: layer not inititalized!!!");
					return;
				}
				return this._fnGetLayerContainer().hasLayer(st.oLayer);
			},

			"fnFocusChanged" : function() {
				return this.__fnFocusChanged;
			},

			"__fnFocusChanged" : function() {

			},

			/**
			 * Require this layer visible. The layer visibility will depende on
			 * fnIsVisibleOnThisZoom value.
			 *
			 * @param updateCheck
			 * @param bDontSaveStatus
			 * 			if true, layer will be showed but current status
			 * 			will not be saved on localStorage
			 *
			 * @returns true if layer becomes visible
			 */
			"fnShow" : function(updateCheck, bDontSaveStatus) {
				return this.__fnShow(updateCheck, bDontSaveStatus);
			},

			/**
			 * Require this layer visible. The layer visibility will depende on
			 * fnIsVisibleOnThisZoom value.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param updateCheck
			 * @param bDontSaveStatus
			 * 				if true, layer will be showed but current status
			 * 				will not be saved on localStorage
			 *
			 * @returns true if layer becomes visible
			 */

			"__fnShow" : function(updateCheck, bDontSaveStatus) {
				var st = this._state;
				var bVisible = false;
				if (!st.oLayer) {
					this.debug("ERROR: layer not inititalized!!!");
					return;
				}
				if (this.fnIsVisibleOnThisZoom()) {
					this._fnAddToContainer();
					bVisible = true;
				}

				if (updateCheck != false) {
					st.oCheckbox = true;
				}

				if (!bDontSaveStatus) {
					this.fnSaveState();
				}

				return bVisible;
			},

			/**
			 * Hide this layer.
			 *
			 * @param updateCheck
			 * @param bDontSaveStatus
			 * 				if true, layer will be hided but current status
			 * 				will not be saved on localStorage
			 *
			 */
			"fnHide" : function(updateCheck, bDontSaveStatus) {
				this.__fnHide(updateCheck, bDontSaveStatus);
			},

			/**
			 * Hide this layer.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param updateCheck
			 * @param bDontSaveStatus
			 * 				if true, layer will be hided but current status
			 * 				will not be saved on localStorage
			 *
			 */
			"__fnHide" : function(updateCheck, bDontSaveStatus) {
				var st = this._state;
				if (!st.oLayer) {
					this.debug("ERROR: layer not inititalized!!!");
					return;
				}
				this._fnRemoveFromContainer();

				if (updateCheck != false) {
					st.oCheckbox = false;
				}

				if (!bDontSaveStatus) {
					this.fnSaveState();
				}
			},

			/**
			 * Load layer state from local storage
			 *
			 * @param bUseLocalStorage
			 *            if true, status will be loaded using localStorage and
			 *            saved localStorage status will be changed. If false,
			 *            status will be loaded by default, and changes will not
			 *            be applied on localStorage
			 */
			"fnLoadState" : function(bUseLocalStorage) {
				return this.__fnLoadState(bUseLocalStorage);
			},

			/**
			 * Load layer state from local storage
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param bUseLocalStorage
			 *            if true, status will be loaded using localStorage and
			 *            saved localStorage status will be changed. If false,
			 *            status will be loaded by default, and changes will not
			 *            be applied on localStorage
			 */
			"__fnLoadState" : function(bUseLocalStorage) {
				var st = this._state;
				var map = st.oMap;
				// get status from local storage
				var status = "";
				if (bUseLocalStorage) {
					status = map._fnLoadLayerStatus(this._state.sId,
							this.s.default_state);
				} else {
					status = this.s.default_state;
				}

				// parse value
				var bShow = false;
				if (status == "true") {
					bShow = true;
				} else if (status == "false") {
					bShow = false;
				} else if (status == "parent") {
					bShow = false;
				} else if (!status) {
					bShow = false;
				}

				// Show or hide layer
				if (bShow) {
					this.fnShow(true, !bUseLocalStorage);
				} else {
					this.fnHide(true, !bUseLocalStorage);
				}

				// Update UI visualization status (by zoom level)
				this._fnUpdateVisibleOnZoomStatus(this.fnIsVisibleOnThisZoom());

				return status;
			},

			/**
			 * Save current layer state
			 */
			"fnSaveState" : function() {
				this.__fnSaveState();
			},

			/**
			 * Save current layer state
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnSaveState" : function() {
				var st = this._state;
				var map = st.oMap;
				if (st.oCheckbox != null) {
					if (st.oCheckbox == true) {
						map._fnSaveLayerStatus(st.sId, "true");
					} else {
						map._fnSaveLayerStatus(st.sId, "false");
					}
				}
			},

			/**
			 * Function to save opacity level on localStorage
			 *
			 * @param opacityLevel
			 *            level of opacity to save on localStorage [1.0 (max) to 0.0 (none)]
			 */
			"_fnSaveOpacityStatus" : function(opacityLevel) {
				this.__fnSaveOpacityStatus(opacityLevel);
			},

			/**
			 * Function to save opacity level on localStorage
			 *
			 * Default implementation
			 *
			 * @param opacityLevel
			 *            level of opacity to save on localStorage [1.0 (max) to 0.0 (none)]
			 */
			"__fnSaveOpacityStatus" : function(opacityLevel) {
				// Generating localStorageKey for opacity level
				var localStorageKey = this._state.sId + "_opacity_level";
				// Saving opacity level of current layer on localStorage
				this._state.oMap
						._fnSaveMapStatus(localStorageKey, opacityLevel);

			},


			/**
			 * Function to load opacity level from localStorage
			 */
			"_fnLoadOpacityStatus" : function() {
				return this.__fnLoadOpacityStatus();
			},

			/**
			 * Function to load opacity level from localStorage
			 */
			"__fnLoadOpacityStatus" : function() {
				// Generating localStorageKey
				var localStorageKey = this._state.sId + "_opacity_level";
				return this._state.oMap._fnGetMapStatus(localStorageKey);
			},

			/**
			 * Register layer tools on current layer
			 *
			 * @param sId
			 *            layer tool unique ID
			 *
			 * @param options
			 *            tool options. Requires a "type" option which informs
			 *            the tool type to create.
			 *
			 * @param toolDiv
			 *            HTML div or String HTML that represents tool on TOC
			 *            component when is registered
			 *
			 * @param bRefreshTOC
			 *            boolean that defines if TOC needs to refresh to
			 *            include new registered tools. False by default
			 */
			"fnRegisterLayerTool" : function(sId, options, toolDiv, bRefreshTOC) {
				this._fnRegisterLayerTool(sId, options, toolDiv, bRefreshTOC);
			},

			/**
			 * Register layer tools on current layer
			 *
			 * (Default implementation)
			 *
			 * @param sId
			 *            layer tool unique ID
			 *
			 * @param options
			 *            tool options. Requires a "type" option which informs
			 *            the tool type to create.
			 *
			 * @param toolDiv
			 *            HTML div or String HTML that represents tool on TOC
			 *            component when is registered
			 *
			 * @param bRefreshTOC
			 *            boolean that defines if TOC needs to refresh to
			 *            include new registered tools. False by default
			 */
			"_fnRegisterLayerTool" : function(sId, options, toolDiv,
					bRefreshTOC) {
				var sToolType = options.type;

				// If exists toolDiv, use it as Html Element
				if (toolDiv != undefined) {

					if (typeof toolDiv == "string") {
						toolDiv = jQuery.parseHTML(toolDiv)[0];
					}
					options.htmlElement = toolDiv;
				}

				// Get layer type
				var oToolClass = GvNIX_Map_Leaflet.CONTROLS[sToolType];
				if (!oToolClass) {
					this.debug("ERROR: '" + oToolClass
							+ "' tool type not found");
					return;
				}
				// Create a new Instance tool of required type
				var newTool = new oToolClass(this._state.oMap, sId, options);
				if (!newTool) {
					this.debug("ERROR: '" + sId + "': tool not created");
					return;
				}

				// store on layer tool registry
				this._fnRegisterALayerTool(newTool);

				// If bRefreshTOC is true, reload TOC to show
				// new registered layer
				if (bRefreshTOC == true) {
					// Adding load img if not declared yet and exists on options data
					if(this._state.loadingImg == null && this.s.loading_img_url){
						var loadingImg = jQuery.parseHTML(
								'<img width="15" style="display:none;" src="'+this.s.loading_img_url+'" id="'+sId+'_loading_img"/>');

						this._state.oLoadingIcon = jQuery(loadingImg);

					}
					this.fnInitializeLayerNode();
				}
			},

			/**
			 * Register a layer tool with its ID
			 *
			 * @param oTool
			 *            instance of GvNIX_Map_Leaflet.CONTROL.Base
			 *
			 */
			"_fnRegisterALayerTool" : function(oTool) {
				this._state.aLayerToolsById.push(oTool);
			},

			/**
			 * Check if a sId exists on register layer tools
			 *
			 * @param sId
			 *            to check
			 */
			"fnExistsLayerTool" : function(sId) {
				for (i in this._state.aLayerToolsById) {
					var layerTool = this._state.aLayerToolsById[i];
					if (layerTool._state.sId == sId) {
						return true;
					}
				}

				return false;
			},

			/**
			 * Returns all registered tools on the current layer
			 */
			"fnGetLayerTools" : function() {
				return this._fnGetLayerTools();
			},

			/**
			 * Returns all registered tools on the current layer
			 *
			 * (Default implementation)
			 */
			"_fnGetLayerTools" : function() {
				return this._state.aLayerToolsById;
			},

			/**
			 * Return a GvNIX_Map_Leaflet.CONTROLS instance by its ID
			 *
			 * @param sId
			 *            of required layer
			 */
			"fnGetLayerToolById" : function(sId) {
				for (i in this._state.aLayerToolsById) {
					var layerTool = this._state.aLayerToolsById[i];
					if (layerTool._state.sId == sId) {
						return layerTool;
					}
				}
				return null;
			},

			/**
			 * Returns the Leaflet layer instance related with this class instance.
			 */
			"fnGetLeafletLayer" : function(){
				return this._state.oLayer;
			},

			/**
			 * Function that reload layer childs to be able to
			 * register tools
			 */
			"__fnReloadChilds" : function(){
				// Getting Map
				var oMap = this._state.oMap;

				// Find layers by group
				var childLayers = oMap.fnGetLayersByGroup(this._state.sId);

				for(i in childLayers){
					var child = childLayers[i]
					// Update child layer on current map
					child.fnInitializeLayerNode();

					// Update child tools
					var tools = child.fnGetLayerTools();
					for(x in tools){
						var tool = tools[x];
						// Get layer type
						var oToolClass = GvNIX_Map_Leaflet.CONTROLS[tool.s.type];
						if (!oToolClass) {
							this.debug("ERROR: '" + oToolClass
									+ "' tool type not found");
							return;
						}
						// Create a new Instance tool of required type
						var newTool = new oToolClass(oMap, tool.s.id, tool.s);
						if (!newTool) {
							this.debug("ERROR: '" + sId + "': tool not created");
							return;
						}
					}


					// Check if current child has childs
					var childChilds = oMap.fnGetLayersByGroup(child._state.sId);
					child.__fnReloadChilds();
				}
			},

			/**
			 * Show loading icon to let user know that a
			 * request-for-data is in progress
			 */
			"_fnShowLoadingIcon" : function() {
				this.__fnShowLoadingIcon();
			},

			/**
			 * Show loading icon to let user know that a
			 * request-for-data is in progress
			 *
			 * Default implementation
			 */
			"__fnShowLoadingIcon" : function() {
				var st = this._state;
				if (st.oLoadingIcon) {
					st.oLoadingIcon.show();
				}
			},

			/**
			 * Hide loading icon to as request-for-data is done/fail
			 */
			"_fnHideLoadingIcon" : function() {
				this.__fnHideLoadingIcon();
			},

			/**
			 * Hide loading icon to as request-for-data is done/fail
			 *
			 * Default implementation
			 */
			"__fnHideLoadingIcon" : function() {
				var st = this._state;
				if (st.oLoadingIcon) {
					setTimeout(function(){
						st.oLoadingIcon.hide();
					}, 500);
				}
			}
		}
	};

	/**
	 * Layer type to group layers. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.group = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.group) {
			alert("Warning: GvNIX_Map_Leaflet Group layer must be initialised with the keyword 'new'");
		}
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.Base.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		// Set this group _state attributes to those passed by the parameters
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId,
			"oMap" : oMap,
			"oLayers" : [],
			"aLayerToolsById" : []
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
	GvNIX_Map_Leaflet.LAYERS.group.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.Base._prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[Group:" + st.sId + "] " + message);
				},

				// overwrite constructor to create leaflet layerGroup instance
				"_fnConstructor" : function() {
					// Call to super
					this.__fnConstructor();
					var st = this._state;
					st.oLayer = L.layerGroup();
					st.oLayer._gvNIX_layer_id = st.sId;
					// save configured index of layer
					st.oLayer._gvNIX_layer_index = this.s.index;
				},

				/**
				 * Build basic node from layer data and return it
				 *
				 */
				"fnGetNodeData" : function() {
					var node = this.__fnGetNodeData();
					node.folder = true;
					return node;
				},

				/**
				 * Register an new child layer on group
				 */
				"fnRegisterChild" : function(oChildLayer) {
					this._state.oLayers.push(oChildLayer);
				},

				/**
				 * Return the leaflet layerGroup instance
				 */
				"fnGetLeafletGroup" : function() {
					return this._state.oLayer;
				},

				// overwrite to propage visibility to children layer
				"fnCheckChanged" : function() {
					var st = this._state;
					// check visibility
					var bShow = this.fnIsVisibleOnThisZoom()
							&& (!st.oCheckbox || st.oCheckbox);
					var aoLayers = st.oLayers;
					// Identify the method to call (show/hide)
					var sFnName = bShow ? "fnShow" : "fnHide";
					// do call to current layer
					this[sFnName](true);
				},

				/**
				 * Function that reload layer childs to be able to
				 * register tools
				 */
				"_fnReloadChilds" : function(){
					this.__fnReloadChilds();
				}
			});

	/**
	 * Root layer for overview. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.overview = function(oMap, sId, oLayer, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.overview) {
			alert("Warning: GvNIX_Map_Leaflet overview layer must be initialised with the keyword 'new'");
		}

		// No options
		this._default_options = {}

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = {
			"sId" : sId,
			"oMap" : oMap,
			"oLayers" : [],
			"oLayer" : oLayer,
			"aLayerToolsById" : []
		};

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Root layer for overview. Class method declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.overview.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.Base._prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[Overview:" + st.sId + "] " + message);
				},

				/**
				 * overwrite constructor to create leaflet layerGroup instance
				 */
				"_fnConstructor" : function() {
					// Nothing to do
				},

				/**
				 * Register an new child layer on group
				 */
				"fnRegisterChild" : function(oChildLayer) {
					this._state.oLayers.push(oChildLayer);
					oChildLayer.fnShow();
				},

				/**
				 * Return the leaflet layerGroup instance
				 */
				"fnGetLeafletGroup" : function() {
					return this._state.oLayer;
				},

				// overwrite as no needed
				"fnCheckChanged" : function() {
					// nothing to do
				}
			});

	/**
	 * Layer to draw a WMS server layer. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.wms = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.wms) {
			alert("Warning: GvNIX_Map_Leaflet WMS Layer must be initialised with the keyword 'new'");
		}

		// Extend Base layer options with specific value
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.Base.default_options, {
					"url" : null, // WMS server URL
					"layers" : null, // Layer to request WMS server layers (coma separated)
					"format" : "image/jpeg", // return image format
					"transparent" : false, // Layer is transparent
					"version" : "1.1.1", // WMS version of request
					"attribution" : null, // attribution text
					"styles" : "", // Styles of layer request (coma separated)
					"crs" : null, // CRS id for layer from L.CRS
					"opacity" : null // opacity level

				});

		this.s = jQuery.extend({}, this._default_options, options);

		// overwrite to add Leaflet WMS layer creation options
		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId,
			"oMap" : oMap,
			"layerOptions" : {
				continuousWorld : true
			},
			"aLayerToolsById" : [],
			"aoServerLayers" : [],
			"contextPath" : null,
			"oLoadingIcon" : null // Loading image

		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();

	};

	/**
	 * Layer to draw a WMS server layer. Class method declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.wms.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.Base._prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[WMS:" + st.sId + "] " + message);
				},

				// overwrite to create leaflet WMS layer
				"_fnConstructor" : function() {
					// call super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;

					// Prepare layer options
					var lop = st.layerOptions;

					s.opacity = toInt(s.opacity);

					// Creating crs object
					var crsObject = L.CRS[s.crs];
					if (crsObject) {
						lop.crs = crsObject;
					} else {
						lop.crs = st.oMap.fnGetMapSRIDObject();
					}
					lop.layers = s.layers;
					lop.format = s.format;
					setOption(s, 'transparent', lop);
					setOption(s, 'attribution', lop);
					setOption(s, 'styles', lop);
					setOption(s, 'version', lop);
					setOption(s, 'max_zoom', lop, 'maxZoom', null, toInt);
					setOption(s, 'min_zoom', lop, 'minZoom', null, toInt);
					this._state.layerOptions = lop;

					// Create leaflet layerGroup as container geomField
					// leaflet layer
					st.oLayer = L.featureGroup();
					st.oLayer._gvNIX_layer_id = st.sId;

					// If WMS layer has children, add it to map and set its opacity
					if (s.layers != undefined && s.layers !== "") {
						// Create leaflet WMS layer instance
						st.oWmsLayer = L.tileLayer.wms(s.url, st.layerOptions);

						//inicializate loading message
						this.fnCreateLoadingPanel();

						//show loading messages
						st.oWmsLayer.on("loading", function(){
							jQuery(st.oPanelLoading).show();
	                    });
						//hide loading messages
	                    st.oWmsLayer.on("load", function(){
	                    	jQuery(st.oPanelLoading).hide();
	                    });
						if(s.opacity){
							st.oWmsLayer.setOpacity(this._fnLoadOpacityStatus());
						}
						st.oLayer.addLayer(st.oWmsLayer);
					} else {
						st.oWmsLayer = null;
					}

					// Set context path. Is necessary to get the layer legend
					st.contextPath = s.context_path;
				},

				/**
				 * Constructor: prepare WMS child server layers
				 */
				"_fnRegisterServerLayer" : function(oLayer) {
					this.__fnRegisterServerLayer(oLayer);
				},

				/**
				 * Constructor: prepare WMS child server layers Initialize
				 * Leaflet WMS layer or feature group according to its children
				 * layers
				 *
				 * @param oServerLayer
				 *            gvNIX layer object to be registered
				 */
				"__fnRegisterServerLayer" : function(oLayer) {
					var st = this._state;
					if (!oLayer.fnIsWmsServerLayer
							&& oLayer.fnIsWmsServerLayer()) {
						this.debug("ERROR: layer '" + oLayer.fnGetId()
								+ "' is not a WMS server layer --> Ignored");
						return;
					}
					this._state.aoServerLayers.push(oLayer);
				},

				/**
				 * Function to initialize Leaflet layer instance from this
				 * object
				 */
				"_fnInitializeWmsLayer" : function() {
					this.__fnInitializeWmsLayer();
				},

				/**
				 * Initializes a WMS Leaflet layer with children layers
				 *
				 * (Default implementation)
				 */
				"__fnInitializeWmsLayer" : function() {
					var s = this.s;
					var st = this._state;
					if (st.aoServerLayers && st.aoServerLayers.length > 0) {
						// First, clean current layer
						st.oLayer.clearLayers();
						var aSelectedLayerIds = [];
						var aSelectedLayerStyles = [];
						// Iterate over children layers
						for ( var i in st.aoServerLayers) {
							var serverLayer = st.aoServerLayers[i];
							// Get the options from selected
							// items
							if (serverLayer.fnIsSelected()) {
								var serverLayerOpts = serverLayer
										.fnGetLayerOptions();
								aSelectedLayerIds
										.push(serverLayerOpts.id_on_server);
								aSelectedLayerStyles.push(serverLayerOpts.styles);
							}
						}
						// If any selected children
						if (aSelectedLayerIds.length > 0) {
							// Get String of selected layers ids
							st.layerOptions.layers = aSelectedLayerIds.join();
							st.layerOptions.styles = aSelectedLayerStyles.join();
							// Initialize Leaflet layer with given
							// children
							// options
							st.oWmsLayer = L.tileLayer.wms(s.url,
									st.layerOptions);
							st.oWmsLayer.setZIndex(st.oMap
									.fnGetLayerIndex(st.sId));
							if(s.opacity){
								st.oWmsLayer.setOpacity(this._fnLoadOpacityStatus());
							}

							// Add new Leaflet layer to this layer
							// object
							st.oLayer.addLayer(st.oWmsLayer);
						} else {
							// Can't make Leaflet layer
							st.oWmsLayer = null;
						}
					}
				},

				/**
				 * Function to update children layers according of its toc
				 * position
				 */
				"fnUpdateChildren" : function() {
					this._fnUpdateChildren();
				},

				/**
				 * Function to update children layers according of its toc
				 * position
				 *
				 * (Default implementation)
				 */
				"_fnUpdateChildren" : function() {
					var st = this._state;
					// Clean list of registered children
					st.aoServerLayers = [];
					// Get toc children nodes
					var toc = st.oMap.fnGetTocTree();
					var node = toc.getNodeByKey(st.sId);
					var aChildren = node.getChildren();
					// Fill again the list with children in new order
					for (var i = aChildren.length; i--;) {
						var child = aChildren[i];
						var sId = child.key
						st.aoServerLayers.push(st.oMap.fnGetLayerById(sId));
					}
					// Reload layer
					if (st.aoServerLayers.length > 0) {
						this._fnInitializeWmsLayer();
					}
				},

				/**
				 * Returns a Map with necessary data to be used as parameters of
				 * a controller request.
				 */
				"fnGetRequestParams" : function() {
					var s = this.s
					var opts = this._state.layerOptions;
					return {
						"url" : s.url,
						"crs" : opts.crs.code,
						"format" : s.format,
						"layers" : opts.layers,
						"styles" : opts.styles,
						"version" : opts.version,
					}
				},

				/**
				 * Function to create layer legend
				 * Returns html to add into legend container
				 */
				"fnCreateLegend" : function(){
					var html = "";
					if(this.fnIsPrepareLegendDefined()){
						html = this.__fnCreateLegendUserFn();
					}else{
						html = this._fnCreateLegend();
					}
					return html;
				},

				/**
				 * Function to create layer legend using WMS Server
				 * Returns html to add into legend container
				 */
				"_fnCreateLegend" : function(){
					var st = this._state;

					var html = "";
					var url = null;
					var altMsg = st.msgLegendUndefined;
					if(st.oWmsLayer != null){
						url = st.oWmsLayer._url;
					}
					var styles = st.layerOptions.styles;
					var layers = st.layerOptions.layers.toString().split(",");
					// if layers is empty, the children are nodes and them
					// will create their own legends
					if(st.layerOptions.layers != "" && url != null){
						html = "<div id='"+st.sId+"_legend'>";
						html += "<p>"+this.s.title+"</p>";
						//draw each child legend
						for(i = 0; i < layers.length; i++){
							html += "<img src='";
							html += st.contextPath+"/ogcinfo/getWmsLegend";
							html += "?urlServer="+ url;
							html += "&layerId="+layers[i];
							html += "&stylesName="+styles;
							html += "' alt='" + altMsg;
							html += "'/> </BR>";
						}
						html += "</div>"
					}
					return html;
				},

				/**
				 * Function to get layer metadata
				 */
				"fnGetMetadata" : function(callbackFn){
					var html = "";
					if(this.fnIsPrepareMetadataDefined()){
						this.__fnGetMetadataUserFn(callbackFn);
					}else{
						this._fnGetMetadata(callbackFn);
					}
				},


				/**
				 * Function to get layer metadata
				 */
				"_fnGetMetadata" : function(callbackFn){
					// Set loading img
					this._fnShowLoadingIcon();
					var oThis = this;
					var st = this._state;
					var callbackFunction = callbackFn;
					// Request to server
					var params = { url: this.s.url};
					jQuery.ajax({
						"url" : st.contextPath + "/ogcinfo?getWmsMetadata",
						"data" : params,
						"cache" : false,
						"success" : function(response) {
							callbackFunction(response, "STRING"); // html
							// hide loading icon
							oThis._fnHideLoadingIcon();
						},
						"error" : function(jqXHR, textStatus, errorThrown) {
							// show default message, information is not available
							oThis.__fnGetMetadata(callbackFunction);
							oThis._fnHideLoadingIcon();
						}
					});
				},

				/**
				 * Function to get layer feature info
				 *
				 * @param point
				 * 		Clicked point in pixels of cointainer layer where
				 * 		user had clicked. Used for requesting data to WMS server.
				 * @param callback
				 * 		Function to call when data request finishes successfull
				 */
				"fnGetFeatureInfo" : function(point, callbackFn){
					if(this.fnIsPrepareFeatureInfoDefined()){
						// Use custom implementation
						this.__fnGetFeatureInfoUserFn(point, callbackFn);
					}else{
						// Use default implementation
						this._fnGetFeatureInfo(point, callbackFn);
					}
				},

				/**
				 * Function to get layer feature info
				 *(Default implementation for WMS layers)
				 *
				 * @param point
				 * 		Clicked point in pixels of cointainer layer where
				 * 		user had clicked. Used for requesting data to WMS server.
				 * @param callback
				 * 		Function to call when data request finishes successfull
				 */
				"_fnGetFeatureInfo" : function(point, callbackFn){
					var st = this._state;
					var oThis = this;
					var callbackFunction = callbackFn;
					var oUtil = this.Util;
					// Start loading animation
					oUtil.startWaitMeAnimation();
					// Get common WMS service request params
					var params = this.fnGetRequestParams();
					// Get coordinates in pixels of  of query point on map
					params["pointX"] = point.x;
					params["pointY"] = point.y;
					// Get map dimensions
					var dimensions = st.oMap.fnGetMapObject().getSize();
					params["mapHeight"] = dimensions.y;
					params["mapWidth"] = dimensions.x;
					// Get map bounding box
					var oMapBbox = st.oMap.fnMapBondingBox();
					var northEast = oMapBbox._northEast;
					var southWest = oMapBbox._southWest;
					// Fit bbox data in list String sepparated by commas
					// Use the required order by WMS service (xmin,ymin,xmax,ymax)
					params["bounds"] = [southWest.lng, southWest.lat, northEast.lng, northEast.lat].join();
					// Request to controller
					jQuery.ajax({
						"url" : st.contextPath + "/ogcinfo?getWmsFeatureInfo",
						"data" : params,
						"cache" : false,
						"dataType" : 'html',
						"success" : function(response) {
							// Call callback function to show the response
							callbackFunction(response, "STRING");
						},
						"error" : function(jqXHR, textStatus, errorThrown) {
							console.log("["+ textStatus + "] " + errorThrown);
							// Show popup with error message
							oThis.__fnGetFeatureInfo(point, callbackFunction);
						},
						"complete" : function(){
							// Stop loading animation
							oUtil.stopWaitMeAnimation();
						}
					});
				},

				/**
				 * Function that returns current layer opacity
				 */
				"fnGetOpacity" : function() {
					return this.__fnLoadOpacityStatus();
				},

				/**
				 * Function that sets opacity level of WMS layer
				 *
				 * @param opacityLevel
				 *            to set on layer
				 *
				 */
				"fnSetOpacity" : function(opacityLevel) {

					// Changing layer opacity
					this._state.oWmsLayer.setOpacity(opacityLevel);

					// Saving layer opacity on localStorage
					this._fnSaveOpacityStatus(opacityLevel);
				}
			});

	/**
     * Function to register a WMS layer and its child visible layer in map
     *
     * @param oMap
     *             GvNIX_Map_Leaflet instance
     * @param oWmsLayer
     *             Wms layer object to be registered in map: Contains properties 'id'(String) and 'options'(Map)
     * @param aoChildLayers
     *             Wms-child layer object to be registered in map: Contains properties 'id'(String) and 'options'(Map)
     * @param insertAtBegin
     *            boolean to indicate if insert the layer at begin
     */
    GvNIX_Map_Leaflet.LAYERS.wms.fnRegisterWmsLayer = function(oMap, oWmsLayer,
            aoChildLayers, layerComponents, insertAtBegin) {
        var map = oMap;
        // Register "parent" Wms layer on toc
        map.fnRegisterLayer(oWmsLayer.id, oWmsLayer.options, layerComponents, insertAtBegin);
        // Register and append wms_child layers into its parent
        for(var i in aoChildLayers){
            var childLayer = aoChildLayers[i];
            map.fnRegisterLayer(childLayer.id, childLayer.options, null, insertAtBegin);
        }
        // Initialize Wms layer with the registered children in TOC's order
        map.fnGetLayerById(oWmsLayer.id).fnUpdateChildren();
    };

	/**
	 * Layer to be shown from a WMS service. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.wms_child = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.wms_child) {
			alert("Warning: GvNIX_Map_Leaflet WMS Child Layer must be initialised with the keyword 'new'");
		}

		// overwrite options to add specific values
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.Base.default_options, {
					"group" : null,
					"title" : null,
					"visible" : null,
					"styles" : null,
					"id_on_server" : null,
					"url" : null
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance
			"layerOptions" : {},
			"oParentLayer" : null,
			"contextPath" : null,
			"oLoadingIcon" : null // Loading image
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	// Layer to be shown from a WMS service. Class method declaration
	GvNIX_Map_Leaflet.LAYERS.wms_child.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.Base._prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[WMS-Child:" + st.sId + "] " + message);
				},

				"_fnConstructor" : function() {
					// call super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;
					st.oParentLayer = st.oMap.fnGetLayerById(s.group);
					var lop = st.layerOptions;
					lop.id_on_server = s.id_on_server;

					setOption(s, 'visible', lop);
					setOption(s, 'styles', lop);
					this._state.layerOptions = lop;

					if (s.title) {
						setOption(s, 'title', lop);
						st.oParentLayer._fnRegisterServerLayer(this);
					} else {
						this._fnGetTitleByRequest();
					}
					// Set context path. Is necessary to get the layer legend
					st.contextPath = s.context_path;
				},

				/**
				 * Function to get the title of a WMS server layer by a request
				 * to service.
				 */
				"_fnGetTitleByRequest" : function() {
					var ctx = this;
					var s = this.s;
					var st = this._state;
					var oThis = this;
					// Get necessary data from parent WMS layer
					var params = st.oParentLayer.fnGetRequestParams();
					// Request to server
					jQuery.ajax({
						"url" : s.url + "?findWmsCapabilities",
						"data" : {
							"url" : params.url,
							"crs" : params.crs,
							"format" : params.format
						},
						"cache" : false,
						"success" : function(response) {
							// Iterate over siblings of this
							for ( var i in response.layers) {
								var item = response.layers[i];
								// Found this server layer
								if (item.name == s.id_on_server) {
									// Set received title
									s.title = item.title;
									// Set new title on toc node
									ctx.fnSetLayerTitle(st.sId, item.title);
								}
							}
							// Register this layer in parent
							st.oParentLayer._fnRegisterServerLayer(ctx);
							// Reload children children
							st.oParentLayer._fnUpdateChildren();
							st.oMap.fnRecreateLegend();
						},
						"error" : function(jqXHR, textStatus, errorThrown) {
							console.log("REQUEST ERROR [" + action + "]: "
									+ errorThrown);
						}
					});
				},

				/**
				 * Returns a Map with the options of this layer
				 */
				"fnGetLayerOptions" : function() {
					return this._state.layerOptions;
				},

				/**
				 * Allows to identify this layer as a WMS server layer
				 */
				"fnIsWmsServerLayer" : function() {
					return true;
				},

				/**
				 * Function to call when selection of wms-child layers changed
				 * on TOC.
				 */
				"_fnOnCheckChanged" : function() {
					this.__fnOnCheckChanged();
				},

				/**
				 * Function to refresh a WMS layer according to its children
				 */
				"__fnOnCheckChanged" : function() {
					this._state.oParentLayer._fnInitializeWmsLayer();
				},

				/**
				 * Sets layer ZIndex if necessary
				 *
				 * (WMS Child implementation)
				 *
				 * @param index
				 */
				"_fnSetZIndex" : function(index) {
					// There is not Leaflet layer to set index.
					// Update parent layer
					this._state.oParentLayer.fnUpdateChildren();
				},

				/**
				 * Change the checkbox value and save selection status if
				 * necessary
				 *
				 * (Custom WMS Child implementation)
				 *
				 * @param updateCheck
				 * @param bDontSaveStatus
				 *            if true, layer will be showed but current status
				 *            will not be saved on localStorage
				 *
				 * @returns true if layer becomes visible
				 */
				"__fnShow" : function(updateCheck, bDontSaveStatus) {
					var st = this._state;

					if (updateCheck != false) {
						st.oCheckbox = true;
					}

					if (!bDontSaveStatus) {
						this.fnSaveState();
					}
				},

				/**
				 * Hide this layer.
				 *
				 * (Custom WMS Child implementation)
				 *
				 * @param updateCheck
				 * @param bDontSaveStatus
				 *            if true, layer will be hided but current status
				 *            will not be saved on localStorage
				 *
				 */
				"__fnHide" : function(updateCheck, bDontSaveStatus) {
					var st = this._state;

					if (updateCheck != false) {
						st.oCheckbox = false;
					}

					if (!bDontSaveStatus) {
						this.fnSaveState();
					}
				},

				/**
				 * Function to create layer legend
				 * Returns html to add into legend container
				 */
				"fnCreateLegend" : function(){
					var html = "";
					if(this.fnIsPrepareLegendDefined()){
						html = this.__fnCreateLegendUserFn();
					}else{
						html = this._fnCreateLegend();
					}
					return html;
				},

				/**
				 * Function to create layer legend using WMS Server
				 * Returns html to add into legend container
				 */
				"_fnCreateLegend" : function(){
					var st = this._state;
					var html = "";
					var url = null;
					var altMsg = st.msgLegendUndefined;
					if(st.oParentLayer != null){
						url = st.oParentLayer.s.url;
					}
					var styles = st.layerOptions.styles;
					if(url != null){
						html = "<div id='"+st.sId+"_legend'>";
						html += "<p>"+this.s.title+"</p>";
						html += "<img src='";
						html += st.contextPath+"/ogcinfo/getWmsLegend";
						html += "?urlServer="+ url;
						html += "&layerId="+st.layerOptions.id_on_server;
						html += "&stylesName="+styles;
						html += "' alt='" +altMsg;
						html += "'/> </BR>";
						html += "</div>"
					}
					return html;
				}
			});

	/**
	 * Layer to draw a Tile server layer. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.tile = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.tile) {
			alert("Warning: GvNIX_Map_Leaflet TILE Layer must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.Base.default_options, {
					"url" : null, // Tile server URL
					"attribution" : null,
					"opacity" : null,
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId,
			"oMap" : oMap,
			"layerOptions" : {
				continuousWorld : true
			},
			"aLayerToolsById" : []
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();

	};

	/**
	 * Layer to draw a Tile server layer. Class method declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.tile.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.Base._prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[TILE:" + st.sId + "] " + message);
				},

				"_fnConstructor" : function() {
					this._tile_fnConstructor();
				},

				"_tile_fnConstructor" : function() {
					// Call super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;

					// Build layer options
					var lop = st.layerOptions;

					// Loading currentOpacity
					var currentOpacity = this._fnLoadOpacityStatus();
					if (currentOpacity != undefined) {
						s.opacity = currentOpacity;
					} else {
						s.opacity = toInt(s.opacity);
					}

					setOption(s, 'attribution', lop);
					setOption(s, 'max_zoom', lop, 'maxZoom', null, toInt);
					setOption(s, 'min_zoom', lop, 'minZoom', null, toInt);
					st.oLayer = L.tileLayer(s.url, lop);
					if (s.opacity != null) {
						st.oLayer.setOpacity(s.opacity);
					}
					st.oLayer._gvNIX_layer_id = st.sId;
					// save configured index of layer
					st.oLayer._gvNIX_layer_index = this.s.index;

					if (this.s.index || this.s.index == 0) {
						if ("setZIndex" in st.oLayer) {
							st.oLayer.setZIndex(this.s.index);
						}
					}
					//inicializate loading message
					this.fnCreateLoadingPanel();

					//show loading messages
					st.oLayer.on("loading", function(){
						jQuery(st.oPanelLoading).show();
                    });
					//hide loading messages
                    st.oLayer.on("load", function(){
                    	jQuery(st.oPanelLoading).hide();
                    });
				},

				/**
				 * Function that sets opacity level of WMST layer
				 *
				 * @param opacityLevel
				 *            to set on layer
				 *
				 */
				"fnSetOpacity" : function(opacityLevel) {

					// Changing layer opacity
					this._state.oLayer.setOpacity(opacityLevel);

					// Saving layer opacity on localStorage
					this._fnSaveOpacityStatus(opacityLevel);
				},

				/**
				 * Function that returns current layer opacity
				 */
				"fnGetOpacity" : function() {
					return this.__fnLoadOpacityStatus();
				}
			});

	/**
	 * Layer to draw a Tile server layer. Instance declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.wmts = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.wmts) {
			alert("Warning: GvNIX_Map_Leaflet WMTS Layer must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.tile.default_options, {
					'tilematrixSet' : null,
					'service' : null
				});

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.tile._state, {
			"sId" : sId,
			"oMap" : oMap,
			"layerOptions" : {
				continuousWorld : true
			},
			"aLayerToolsById" : [],
			"contextPath" : null,
			"oLoadingIcon" : null // Loading image

		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();

	};

	/**
	 * Layer to draw a Tile server layer. Class method declaration
	 */
	GvNIX_Map_Leaflet.LAYERS.wmts.prototype = jQuery.extend({},
			GvNIX_Map_Leaflet.LAYERS.tile.prototype, {
				"debug" : function(message) {
					var st = this._state;
					st.oMap.debug("[WMTS:" + st.sId + "] " + message);
				},

				"_fnConstructor" : function() {
					// Call super
					this.__fnConstructor();
					var s = this.s;
					var st = this._state;

					// Build layer options
					var lop = st.layerOptions;

					// Getting current opacity level
					var currentOpacity = this._fnLoadOpacityStatus();
					if (currentOpacity != undefined) {
						s.opacity = currentOpacity;
					} else {
						s.opacity = toInt(s.opacity);
					}

					setOption(s, 'attribution', lop);
					setOption(s, 'max_zoom', lop, 'maxZoom', null, toInt);
					setOption(s, 'min_zoom', lop, 'minZoom', null, toInt);
					setOption(s, 'service', lop, 'service');
					setOption(s, 'layer', lop, 'layer');
					setOption(s, 'tilematrix_set', lop, 'tilematrixSet');
					st.oLayer = L.tileLayer.wmts(s.url, lop);
					if (s.opacity != null) {
						st.oLayer.setOpacity(s.opacity);
					}
					st.oLayer._gvNIX_layer_id = st.sId;
					// save configured index of layer
					st.oLayer._gvNIX_layer_index = this.s.index;
					if (this.s.index || this.s.index == 0) {
						if ("setZIndex" in st.oLayer) {
							st.oLayer.setZIndex(this.s.index);
						}
					}
					// Set context path. Is necessary to get the layer legend
					st.contextPath = s.context_path;

					//inicializate loading message
					this.fnCreateLoadingPanel();

					//show loading messages
					st.oLayer.on("loading", function(){
						jQuery(st.oPanelLoading).show();
                    });
					//hide loading messages
                    st.oLayer.on("load", function(){
                    	jQuery(st.oPanelLoading).hide();
                    });
				},

				/**
				 * Function that sets opacity level of WMST layer
				 *
				 * @param opacityLevel
				 *            to set on layer
				 *
				 */
				"fnSetOpacity" : function(opacityLevel) {
					// Changing opacity level
					this._state.oLayer.setOpacity(opacityLevel);

					// Saving opacity level on localStorage
					this._fnSaveOpacityStatus(opacityLevel);
				},

				/**
				 * Function that returns current layer opacity
				 */
				"fnGetOpacity" : function() {
					return this.__fnLoadOpacityStatus();
				},

				/**
				 * Function to create layer legend
				 * Returns html to add into legend container
				 */
				"fnCreateLegend" : function(){
					var html = "";
					if(this.fnIsPrepareLegendDefined()){
						html = this.__fnCreateLegendUserFn();
					}else{
						html = this._fnCreateLegend();
					}
					return html;
				},

				/**
				 * Function to create layer legend using WMTS Server
				 * Returns html to add into legend container
				 */
				"_fnCreateLegend" : function(){
					var st = this._state;
					var html = "";
					var url = null;
					var altMsg = st.msgLegendUndefined;
					if(st.oLayer != null){
						url = st.oLayer._url;
					}
					var styles = st.layerOptions.styles;
					if(url != null){
						html = "<div id='"+st.sId+"_legend'>";
						html += "<p>"+this.s.title+"</p>";
						html += "<img src='";
						html += st.contextPath+"/ogcinfo/getWmtsLegend";
						html += "?urlServer="+ url;
						html += "&layerId="+st.layerOptions.layer;
						html += "' alt='" +altMsg;
						html += "'/> </BR>";
						html += "</div>"
					}
					return html;
				},

				/**
				 * Function to get layer metadata
				 */
				"fnGetMetadata" : function(callbackFn){
					var html = "";
					if(this.fnIsPrepareMetadataDefined()){
						this.__fnGetMetadataUserFn(callbackFn);
					}else{
						this._fnGetMetadata(callbackFn);
					}
				},

				/**
				 * Function to get layer metadata
				 */
				"_fnGetMetadata" : function(callbackFn){
					// Set loading img
					this._fnShowLoadingIcon();
					var oThis = this;
					var st = this._state;
					var callbackFunction = callbackFn;
					// Request to server
					var params = { url: this.s.url};
					jQuery.ajax({
						"url" : st.contextPath + "/ogcinfo?getWmtsMetadata",
						"data" : params,
						"cache" : false,
						"success" : function(response) {
							callbackFunction(response, "STRING"); // html
							// hide loading icon
							oThis._fnHideLoadingIcon();
						},
						"error" : function(jqXHR, textStatus, errorThrown) {
							// show default message, information is not available
							oThis.__fnGetMetadata(callbackFunction);
							oThis._fnHideLoadingIcon();
						}
					});
				}
			});
	/**
	 * Layer to draw a Entity from gvNIX request.
	 *
	 * This is the parent layer for GvNIX_Map_Leaflet.LAYERS.entity_field layer,
	 * which shows a field of this layer.
	 *
	 * At least one of GvNIX_Map_Leaflet.LAYERS.entity_field is required.
	 *
	 * Supports filter by datatables request. The binding to the datatables is
	 * made using localStorage datatables info and "path" attribute"
	 *
	 */
	GvNIX_Map_Leaflet.LAYERS.entity = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.entity) {
			alert("Warning: GvNIX_Map_Leaflet Entity layer must be initialised with the keyword 'new'");
		}

		// overwrite options to add specific values
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.Base.default_options, {
					"filter_type" : null, // filter value [ auto | manual | none ]
					"always_use_dtt_request" : false, // Alway use datatables request to get data(Only when filter_type != 'none')
					"storage_key" : null, // Key to get form local storage the dtt configuration (if isn't the default key)
					"minimun_fields" : null, // Minimun fields to request o server (required for always_use_dtt_request)
					"path" : null, // Url path to entity controller
					"opacity" : null,
					"pk" : null, // propertity which contains kp info (from return data)
					"selection" : false, // if true layer will draw selected items (from Datatables) in special way (depending on entity_field layer definition)
					"not_volatile" : false

				});

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance
			"aFieldLayers" : [], // GvNIX_Map_Leaflet.LAYERS.entity_field instances
			"oSelection" : null, // selection data get from Dtt info
			"oFilterConfig" : null, // filter configuration object (only if filte_type == "auto")
			"oLastRequest" : null, // last data request info (for "not_volatile" layers)
			"aMimunFields" : null, // Minimun fields for dtt request
			"aLayerToolsById" : [],
			"oLoadingIcon" : null // Loading image
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();

	};
	GvNIX_Map_Leaflet.LAYERS.entity.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.Base._prototype,
		{
			"debug" : function(message) {
				var st = this._state;
				st.oMap.debug("[Layer-entity:" + st.sId + "] "
						+ message);
			},

			// Class constructor
			"_fnConstructor" : function() {
				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				this.__fnConstructor();
				var s = this.s;
				var st = this._state;

				// Check required parameters
				if (!s.pk || !s.path) {
					this
							.debug("ERROR: 'pk' and 'path' options are required");
					return;
				}

				// Create leaflet layerGroup as container geomField
				// leaflet layer
				st.oLayer = L.featureGroup();
				st.oLayer._gvNIX_layer_id = st.sId;
				// save configured index of layer
				st.oLayer._gvNIX_layer_index = this.s.index;

				if (s.opacity != null) {
					st.oLayer.setOpacity(s.opacity);
				}

				// Configure filter and selection objects
				// and minimu fields
				this._fnConstructor_initializeFilter(s,st);

				// Register on-move and on-zoom listener
				this._fnConstructor_registerMapListener(s,st);
			},

			/**
			 * Constructor: register listener (zoom, move) on map
			 * to reload data
			 *
			 * @param s options
			 * @param st state
			 */
			"_fnConstructor_registerMapListener" : function (s,st){
				this.__fnConstructor_registerMapListener(s,st);
			},

			/**
			 * Constructor: register listener (zoom, move) on map
			 * to reload data
			 *
			 * Defaul implementation
			 *
			 * @param s options
			 * @param st state
			 */
			"__fnConstructor_registerMapListener" : function (s,st){
				// Register on-move and on-zoom listener
				var oLeafletMap = st.oMap.fnGetMapObject();
				oLeafletMap.on("moveend", jQuery.proxy(
						this._fnViewPortChanged, this));
				oLeafletMap.on("zoomend", jQuery.proxy(
						this._fnZoomChanged, this));
			},


			/**
			 * Constructor: Icons Filter and loading
			 *
			 * @param s options
			 * @param st state
			 */
			"_fnConstructor_initializeLoadingAndFilterIcons" : function (s,st) {
				this.__fnConstructor_initializeLoadingAndFilterIcons(s,st);
			},

			/**
			 * Constructor: initialize filter and selection and
			 * minimun fields
			 *
			 * @param s options
			 * @param st state
			 */
			"_fnConstructor_initializeFilter" : function(s,st) {
				this.__fnConstructor_initializeFilter(s,st);
			},

			/**
			 * Constructor: initialize filter and selection and
			 * minimun fields
			 *
			 * Default implementation
			 *
			 * @param s options
			 * @param st state
			 */
			"__fnConstructor_initializeFilter" : function(s,st) {
				if (s.filter_type || s.selection) {
					var oKeys = st.oMap
							._fnGetEntityLocalStorageKeys(this);
					if (s.filter_type == 'auto'
							|| s.filter_type == 'manual'
							|| s.selection) {

						st.oFilterConfig = {
							'sKey' : oKeys.filterKey,
							'bFiltered' : false,
							'bAlways' : s.always_use_dtt_request ? true
									: false
						};

					} else if (s.filter_type == "none") {
						// No local storage config
						st.oFilterConfig = null;
					} else {
						this
								.debug("ERROR: invalid value for 'filter_type' (expected one of 'none', 'auto' or 'manual')");
						st.oFilterConfig = null;
					}

					if (s.selection) {
						st.oSelection = {
							'sKey' : oKeys.selectionKey
						};
					}
				}

				if (s.minimun_fields) {
					st.aMimunFields = s.minimun_fields.split(',');
				}
			},

			/**
			 * Called when 'moveend' is raised
			 *
			 * @param event
			 *      event info (http://leafletjs.com/reference.html#event)
			 */
			"_fnViewPortChanged" : function (event) {
				this.__fnViewPortChanged(event);
			},

			/**
			 * Called when 'moveend' is raised
			 *
			 * Default implementation
			 *
			 * @param event
			 *      event info (http://leafletjs.com/reference.html#event)
			 */
			"__fnViewPortChanged" : function (event) {
				this.debug("Viewpor changed");
				this._fnRequestData();
			},


			/**
			 * Called by entity_field instance to register itself as
			 * child of this instance
			 */
			"_fnRegisterFieldLayer" : function(oLayer) {
				this.__fnRegisterFieldLayer(oLayer);
			},

			/**
			 * Called by entity_field instance to register itself as
			 * child of this instance.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnRegisterFieldLayer" : function(oLayer) {
				// Check oLayer type
				if (!oLayer.fnIsFieldLayer
						&& oLayer.fnIsFieldLayer()) {
					this.debug("ERROR: layer '" + oLayer.fnGetId()
							+ "' is not a field layer --> Ignored");
					return;
				}
				this._state.aFieldLayers.push(oLayer);
			},

			/**
			 * Overwrite to return leaflet layerGropup layer
			 */
			"fnGetLeafletGroup" : function() {
				return this._state.oLayer;
			},

			/**
			 * Cleans all data from children layers
			 */
			"fnClear" : function() {
				this._fnClear();
			},

			/**
			 * Cleans all data from children layers
			 *
			 * Default implementation (useful for inheritance)
			 */
			"_fnClear" : function() {
				var st = this._state;
				st.oLastRequest = null;
				var aLayers = st.aFieldLayers;
				for ( var m in aLayers) {
					aLayers[m].fnClear();
				}
			},

			/**
			 * Request layer (and children) data to server
			 *
			 * @param bForce
			 *            if true force to perform request (ignore
			 *            any cache)
			 */
			"_fnRequestData" : function(bForce) {
				this.__fnRequestData();
			},

			"_loading" : false,

			/**
			 * Request layer (and children) data to server.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param bForce
			 *            if true force to perform request (ignore
			 *            any cache)
			 */
			"__fnRequestData" : function(bForce) {
				if (this._loading || !this.fnIsVisible()
						|| !this.fnGetVisibleFieldLayers()) {
					// No visible layers. Nothing to do
					return;
				}

				this._loading = true;

				var s = this.s;
				var st = this._state;
				var oLastRequest = st.oLastRequest;

				// Get current BBOX
				var oBBox = st.oMap.fnMapBondingBox();

				// Check no volatile data
				if (!bForce && s.not_volatile && oLastRequest
						&& oLastRequest.oBBox
						&& oLastRequest.aRecords) {

					// Check if current bounds is contained in
					// previos request
					if (oLastRequest.oBBox.contains(oBBox)) {
						// Check if filter has been chanted
						if (!this._fnIsFilterChanged(
								oLastRequest.oFilterConfig,
								st.oFilterConfig)) {
							// No more data needed. Reload with
							// previous values
							this._fnLoadData(oLastRequest.oBBox,
									oLastRequest.aRecords);
							return;
						}
					}
				}

				// Create request object
				var jqxhr = null;
				if (st.oFilterConfig
						&& (st.oFilterConfig.bAlways || st.oFilterConfig.bFiltered)) {
					jqxhr = this._fnCreateRequestFiltered(oBBox);
				} else {
					jqxhr = this._fnCreateRequest(oBBox);
				}

				// Change UI to notify to user that a reques is on
				// the way
				this._fnShowLoadingIcon();

				// When results are getted, display results on map
				jqxhr.done(jQuery.proxy(this._fnLoadData, this,
						oBBox));

				// Handle failed request
				jqxhr.fail(jQuery.proxy(function(jqXHR, textStatus,
						errorThrown) {
					this._loading = false;
					this._fnHideLoadingIcon();
					this.debug("ERROR on request '" + jqXHR.url
							+ "': " + textStatus + " : "
							+ errorThrown);
				}, this));
			},

			/**
			 * Checks if filter configuration has been changed
			 */
			"_fnIsFilterChanged" : function(oPrevious, oCurrent) {
				return this
						.__fnIsFilterChanged(oPrevious, oCurrent);
			},

			/**
			 * Checks if filter configuration has been changed.
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnIsFilterChanged" : function(oPrevious, oCurrent) {
				return this.UDtt.isFilterChanged(oPrevious,
						oCurrent);
			},

			/**
			 * Creates a jQuery.ajax instance to request data
			 * without any filter. Request [POST]
			 * {s.path}?entityMapList - Data: BBox
			 */
			"_fnCreateRequest" : function(oBBox) {
				return this.__fnCreateRequest(oBBox);
			},

			/**
			 * Creates a jQuery.ajax instance to request data
			 * without any filter. Request [POST]
			 * {s.path}?entityMapList - Data: BBox
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnCreateRequest" : function(oBBox) {
				var U = this.Util;
				var sBBox = U.BBoxToWKT(oBBox, this._state.oMap
						.fnGetMapSRIDcode());
				// Getting result entities
				return jqxhr = jQuery.ajax(this.s.path
						+ "?entityMapList", {
					contentType : "application/json",
					data : JSON.stringify({
						"intersects" : sBBox
					}),
					type : "POST",
				// dataType: 'json'
				});
			},

			/**
			 * Creates a jQuery.ajax instance to request data
			 * without with filter. Request [POST]
			 * {s.path}/datatables/ajax - Data: datatable request +
			 * bbox info
			 *
			 * Default implementation (useful for inheritance)
			 */
			"_fnCreateRequestFiltered" : function(oBBox) {
				return this.__fnCreateRequestFiltered(oBBox);
			},

			/**
			 * Creates a jQuery.ajax instance to request data
			 * without with filter. Request [POST]
			 * {s.path}/datatables/ajax - Data: datatable request +
			 * bbox info
			 */
			"__fnCreateRequestFiltered" : function(oBBox) {
				var U = this.Util;
				var st = this._state;
				var oFilterConfig = st.oFilterConfig;
				var aMinimunFields = st.aMimunFields;
				var Udtt = this.UDtt;
				var sBBox = U.BBoxToWKT(oBBox, this._state.oMap
						.fnGetMapSRIDcode());

				// Copy original dtt settings
				var oSettings = jQuery.extend({},
						oFilterConfig.oSettings);

				// Get geom fields used
				var aGeoColumns = this._fnGetGeomFields();

				var aExtraColumns = aGeoColumns.slice(0);

				if (aMinimunFields && aMinimunFields.length) {
					for (sField in aMinimunFields) {
						aExtraColumns.push(aMinimunFields[sField]);
					}
				}

				// Add geom columns
				Udtt.addColumnsToDataRequest(aExtraColumns,
						oSettings);
				var aoData = Udtt.getAjaxParamters(oSettings,
						sBBox, aGeoColumns);

				// Getting result entities
				return jqxhr = jQuery.ajax(this.s.path
						+ "/datatables/ajax", {
					data : aoData,
					type : "POST",
					dataType : 'json'
				});

			},

			/**
			 * Returns the visible children layers
			 */
			"fnGetVisibleFieldLayers" : function() {
				return this.__fnGetVisibleFieldLayers();
			},

			/**
			 * Returns the visible children layers
			 *
			 * Default implementation (useful for inheritance)
			 */
			"__fnGetVisibleFieldLayers" : function() {
				var st = this._state;
				var aFLayers = [];
				for ( var j in st.aFieldLayers) {
					var oFieldLayer = st.aFieldLayers[j];
					if (oFieldLayer.fnIsVisible()) {
						aFLayers.push(oFieldLayer);
					}
				}
				return aFLayers;
			},

			/**
			 * Loads data from a request or from previous request
			 *
			 * @param oBBox
			 *            L.LatLngBounds instance of request
			 * @param response
			 *            Server response or data
			 * @param textStatu
			 *            Request status as string (null if data is
			 *            from previous request)
			 * @param jqxhr
			 *            Ajax request object (null if data is from
			 *            previous request)
			 */
			"_fnLoadData" : function(oBBox, response, textStatus,
					jqxhr) {
				this.__fnLoadData(oBBox, response, textStatus,
						jqxhr);
			},

			/**
			 * Loads data from a request
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param oBBox
			 *            L.LatLngBounds instance of request
			 * @param response
			 *            Server response or data
			 * @param textStatu
			 *            Request status as string (null if data is
			 *            from previous request)
			 * @param jqxhr
			 *            Ajax request object (null if data is from
			 *            previous request)
			 */
			"__fnLoadData" : function(oBBox, response, textStatus,
					jqxhr) {
				var s = this.s;
				var st = this._state;
				var UDtt = this.UDtt;
				var aRecords = null;
				// Get visible layers
				var aFLayers = this.fnGetVisibleFieldLayers();
				var error = null;
				try {
					// Gets the array data
					if (response.aaData) {
						aRecords = response.aaData;
					} else {
						aRecords = response;
					}

					var aPks = [];
					var oSelection = st.oSelection;

					if (aRecords != null && aRecords.length > 0) {

						// For each record
						for ( var i in aRecords) {
							var oRecord = aRecords[i];
							var pk = oRecord[s.pk];

							aPks.push(pk);

							var bSelected = false;
							if (oSelection) {
								bSelected = UDtt
										.isEntityItemSelected(pk,
												oSelection.oData);
							}
							// for each visible layer
							for ( var j in aFLayers) {
								// Add feature
								aFLayers[j].fnAddFromFeature(
										oRecord, pk, bSelected);
							}
						}
					}

					// Remove not visible element
					// for each visible layer
					for ( var j in aFLayers) {
						// Add feature
						aFLayers[j].fnCleanFeaturesNotIn(aPks);
					}
					// Clean custom property
					delete this._state['__force'];

					// If not-volatile-data param set and
					// data loaded from a request and
					// has a BBox reference
					if (s.not_volatile && jqxhr && oBBox) {
						var oFilterConfig = null;
						if (st.oFilterConfig) {
							oFilterConfig = jQuery.extend({},
									st.oFilterConfig);
						}
						// Save loaded data
						st.oLastRequest = {
							'timestamp' : new Date(),
							'aRecords' : aRecords,
							'oBBox' : oBBox,
							'oFilterConfig' : oFilterConfig
						};
					}
				} catch (ex) {
					this.debug("[ERROR] loading data " + ex);
					error = ex;
					throw ex;
				} finally {
					if (!error) {
						// Notify layers all lada loaded
						for (i in aFLayers) {
							var oLayer = aFLayers[i];
							if (oLayer._fnLoadDataDone) {
								oLayer._fnLoadDataDone();
							}
						}
					} else {
						// TODO notify to user the problem?
						//      (add a red icon by example)
					}
					this._fnHideLoadingIcon();
					this.__fnUpdateFilterIconState();
					this._loading = false;
					delete this._state['__force'];
				}
			},

			/**
			 * Overwrite to get data
			 */
			"_fnZoomChanged" : function() {
				this.__fnZoomChanged();
				this.debug("Zoom Changed");
				if (this.fnIsVisibleOnThisZoom()) {
					this._fnRequestData();
				}
			},

			/**
			 * Called when localStorage has been changed.
			 *
			 * This method identify is any action is required based
			 * on event data.
			 *
			 * @param event
			 *            data
			 */
			"_fnNotifyStorageChanged" : function(event) {
				this.__fnNotifyStorageChanged(event);
			},

			/**
			 * Called when localStorage has been changed.
			 *
			 * This method identify is any action is required based
			 * on event data.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param event
			 *            data
			 */
			"__fnNotifyStorageChanged" : function(event) {
				var s = this.s;
				var st = this._state;
				var oFilterConfig = st.oFilterConfig;
				var oSelection = st.oSelection;
				if (!oFilterConfig && !oSelection) {
					// Nothing to do
					return;
				} else if (s.filter_type != "auto" && !s.selection) {
					// Nothing to do
					return;
				} else if (!this.fnIsVisible()) {
					// Nothing to do
					return;
				}

				// New listen format events
				if (event.key.indexOf("close#") !== -1
						|| event.key.indexOf("refreshLayer#") !== -1) {
					if (oFilterConfig != null) {
						if (oFilterConfig.sKey
								.indexOf(event.newValue) !== -1) {
							// Get stored filter
							this._state.__force = true;
							this._fnFilterDataModified(localStorage
									.getItem(event.newValue));
							return;
						}
					}
				}

				var key = event.key + "_layer";
				var oKeys = oFilterConfig.oKeys;
				if (oFilterConfig
						&& key.indexOf(oFilterConfig.sKey) !== -1) {
					this._fnFilterDataModified(event.newValue);
				} else if (key.indexOf("gvnixRowSelected")) {
					this._fnSelectionDataModified(event.newValue);
				}
			},

			/**
			 * Called from _fnNotifyStorageChanged when related
			 * filter data has been changed.
			 *
			 * @param sNewData
			 *            string with new data stored on
			 *            localStoreage
			 */
			"_fnFilterDataModified" : function(sNewData) {
				this.__fnFilterDataModified(sNewData);
			},

			/**
			 * Called from _fnNotifyStorageChanged when related
			 * filter data has been changed.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param sNewData
			 *            string with new data stored on
			 *            localStoreage
			 */
			"__fnFilterDataModified" : function(sNewData) {
				var st = this._state;
				var oFilterConfig = st.oFilterConfig;
				var bFilterChanged = false;
				var oNewConfig = null;

				var oNewData = null;
				if (sNewData) {
					var oNewData = jQuery.parseJSON(sNewData);
					if (oNewData) {
						oNewConfig = this._fnCreateFilterConfig(
								oFilterConfig, oNewData);
					}
				}
				if (this._fnIsFilterChanged(oFilterConfig,
						oNewConfig)) {
					st.oFilterConfig = oNewConfig;
					this._fnRequestData(true);
				}
			},

			/**
			 * Create a new Filter config based on oldConfig and
			 * load storage data
			 *
			 * @param oOldConfig
			 *            old filter config object
			 * @param oStorageData
			 *            object loaded from local storage
			 */
			"_fnCreateFilterConfig" : function(oOldConfig,
					oStorageData) {
				var oNewConfig = {}
				oNewConfig.bFiltered = oStorageData.isFiltered;
				oNewConfig.oSettings = oStorageData.oSettings;
				if (oOldConfig != null) {
					oNewConfig.sKey = oOldConfig.sKey;
					oNewConfig.bAlways = oOldConfig.bAlways;
				}
				return oNewConfig;
			},

			/**
			 * Called from _fnNotifyStorageChanged when related
			 * selection data has been changed.
			 *
			 * @param sNewData
			 *            string with new data stored on
			 *            localStoreage
			 */
			"_fnSelectionDataModified" : function(sNewData) {
				this.__fnSelectionDataModified(sNewData);
			},

			/**
			 * Called from _fnNotifyStorageChanged when related
			 * selection data has been changed.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param sNewData
			 *            string with new data stored on
			 *            localStoreage
			 */
			"__fnSelectionDataModified" : function(sNewData) {
				// Check if selection is active
				if (this.s.selection) {
					var st = this._state;
					var bChanged = false;
					var oSelection = st.oSelection;

					if (oSelection != null) {
						var oPrevData = oSelection.oData;
					} else {
						this._state.oSelection = {};
					}

					this._state.oSelection.oData = sNewData;

					var oNewData = null;

					if (sNewData) {
						oNewData = jQuery.parseJSON(sNewData);
					}

					// Check data changed
					if (this._fnIsSelectionChanged(oPrevData,
							oNewData)) {
						this._fnRequestData(true);
					}
				}
			},

			/**
			 * Checks if selection has been modify
			 *
			 * @param oPrevData
			 *            previous selection configuration
			 * @param oNewData
			 *            previous selection configuration
			 */
			"_fnIsSelectionChanged" : function(oPrevData, oNewData) {
				return this.__fnIsSelectionChanged(oPrevData,
						oNewData);
			},

			/**
			 * Checks if selection has been modify
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param oPrevData
			 *            previous selection configuration
			 * @param oNewData
			 *            previous selection configuration
			 */
			"__fnIsSelectionChanged" : function(oPrevData, oNewData) {
				return this.UDtt.isEntitySelectionChanged(
						oPrevData, oNewData);
			},

			/**
			 * Returns an array of geometry fields rendered on
			 * children layers
			 *
			 * @returns array of string of field names
			 */
			"_fnGetGeomFields" : function() {
				return this.__fnGetGeomFields();
			},

			/**
			 * Returns an array of geometry fields rendered on
			 * children layers
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @returns array of string of field names
			 */
			"__fnGetGeomFields" : function() {
				var aFieldLayers = this._state.aFieldLayers;
				var dGeoFields = {};
				for ( var i in aFieldLayers) {
					dGeoFields[aFieldLayers[i].fnSettings().field] = true;
				}
				return Object.keys(dGeoFields);
			},

			/**
			 * Return related layer fields
			 *
			 * TODO extend it. Currently just return children layer
			 * geometry fields
			 *
			 * @returns array of field names
			 */
			"_fnGetRealtedFields" : function() {
				this.__fnGetRealtedFields();
			},

			/**
			 * Return related layer fields
			 *
			 * TODO extend it. Currently just return children layer
			 * geometry fields
			 *
			 * Default implementation
			 *
			 * @returns array of field names
			 */
			"__fnGetRealtedFields" : function() {
				this._fnGetGeomFields();
			},

			/**
			 * Update filter icon with current state (if any)
			 */
			"_fnUpdateFilterIconState" : function() {
				this.__fnUpdateFilterIconState();
			},

			/**
			 * Update filter icon with current state (if any)
			 *
			 * Default implementation
			 */
			"__fnUpdateFilterIconState" : function() {
				var st = this._state;
				var oFilterIcon = st.oFilterIcon;
				if (oFilterIcon) {
					var oFilterConfig = st.oFilterConfig;
					if (oFilterConfig && oFilterConfig.bFiltered) {
						oFilterIcon.removeClass("no-filtered");
						oFilterIcon.addClass("filtered");
					} else {
						oFilterIcon.removeClass("filtered");
						oFilterIcon.addClass("no-filtered");
					}
				}
			},

			/**
			 * overwrite to update children
			 */
			"fnCheckChanged" : function() {
				this.__fnCheckChanged();
				var st = this._state;
				var bChecked = st.oCheckbox ? true : false;
				var aoLayers = st.aFieldLayers;
				var sFnName = bChecked ? "fnShow" : "fnHide";
				for ( var i in aoLayers) {
					aoLayers[i][sFnName]();
				}
				if (bChecked) {
					this._fnRequestData();
				}
			},

			/**
			 * overwrite to load filter
			 * @param bUseLocalStorage
			 *            if true, status will be loaded using
			 *            localStorage and saved localStorage status
			 *            will be changed. If false, status will be
			 *            loaded by default, and changes will not be
			 *            applied on localStorage
			 */
			"fnLoadState" : function(bUseLocalStorage) {
				return this._entity_fnLoadState(bUseLocalStorage);
			},

			"_entity_fnLoadState" : function(bUseLocalStorage) {
				var s = this.s;
				var st = this._state;

				// NOTE: Selection and Filtering should be
				// loaded on layer register from localStorage

				// Configure filter and selection objects
				if (s.filter_type || s.selection) {
					var oKeys = st.oMap
							._fnGetEntityLocalStorageKeys(this);
					if (s.filter_type == 'auto'
							|| s.filter_type == 'manual'
							|| s.selection) {

						// Loading Filter state from localStorage
						var filteredLocalStorage = localStorage
								.getItem(oKeys.filterKey);

						var isFiltered = false;

						if (filteredLocalStorage != null) {
							filteredLocalStorage = JSON
									.parse(filteredLocalStorage);
							isFiltered = filteredLocalStorage.isFiltered;
						}

						st.oFilterConfig = {
							'sKey' : oKeys.filterKey,
							'bFiltered' : isFiltered,
							'bAlways' : s.always_use_dtt_request ? true
									: false
						};

						if (filteredLocalStorage != null) {
							st.oFilterConfig = this
									._fnCreateFilterConfig(
											st.oFilterConfig,
											filteredLocalStorage);
						}

					} else if (s.filter_type == "none") {
						// No local storage config
						st.oFilterConfig = null;
					} else {
						this
								.debug("ERROR: invalid value for 'filter_type' (expected one of 'none', 'auto' or 'manual')");
						st.oFilterConfig = null;
					}

					if (s.selection) {
						// Loading selection from localStorage

						st.oSelection = {
							'sKey' : oKeys.selectionKey
						};

						st.oSelection.oData = localStorage
								.getItem(oKeys.selectionKey);

					}
				}

				return this.__fnLoadState(bUseLocalStorage);
			},

			/**
			 * Set this layer as a folder node in fancytree TOC
			 */
			"fnGetNodeData" : function() {
				var node = this.__fnGetNodeData();
				node.folder = true;
				return node;
			},

			/**
			 * Function that reload layer childs to be able to
			 * register tools
			 */
			"_fnReloadChilds" : function(){
				this.__fnReloadChilds();
			}
		});

	/**
	 * Layer to draw a Entity geometry field from gvNIX request.
	 *
	 * This is the child layer for GvNIX_Map_Leaflet.LAYERS.entity layer, which
	 * shows a field of a layer.
	 *
	 * This layer requires a entity parent.
	 *
	 * Supports filter by datatables request. The binding to the datatables is
	 * made using localStorage datatables info and "path" attribute"
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_field = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.entity_field) {
			alert("Warning: GvNIX_Map_Leaflet entity field layer must be initialised with the keyword 'new'");
		}

		this._default_options = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base.default_options, {
			"entity" : null, // Id of the parent entity layer
			"crs" : null, // Field CRS
			"opacity" : null, // layer opacity
			"field" : null, // Geometry field name of related entity
			"icon_library" : null, // icon library to use (for point layer)
			"icon" : null, // icon name from icon library (for point layer)
			"radius" : null, // radius in meters for circle (when no icon defined)
			"clusterize" : null, // (boolean) group icons/geomShapes on lowers zoom levels or not
			"color" : null, // icon/shap color
			"path_style" : null, // style to draw shapes on map (http://leafletjs.com/reference.html#path)
			"marker_color" : null, // maker color for point items
			"icon_library_selected" : null, // icon library for points items selected
			"icon_selected" : null, // icon name for point items selecteds
			"color_selected" : null, // icon color for point items selecteds
			"marker_color_selected" : null, // maker color for selected point items
			"path_style_selected" : null, // style to draw selected shapes on map (http://leafletjs.com/reference.html#path)
			"fn_ajust_render" : null, // function name to call for adjust layer draw
			"show_info" : true, // bind popup-info-dialogs for all elements
			"fn_prepare_info" : null, // function name to call for generate item info
			"fn_cluster_render" : null, // function to call for cluster render
			"fn_labeling" : null, // function name to call for prepare item labeling
			"fn_labeling_text" : null, // function name to call to get text of item labeling
			"labeling_property" : null, // item property name to use as labeling
			"labeling_text" : null, // static labeling text for all items
			"labeling_options" : null // style to use for labeling (http://leafletjs.com/reference.html#divicon-options)
		});

		this.s = jQuery.extend({}, this._default_options, options);

		// Remove group option value (if any)
		this.s.group = null;

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId,
			"oMap" : oMap,
			"oEntity" : null, // related GvNIX_Map_Leaflet.LAYERS.entity instance
			"oCrs" : null, // L.CRS instance of current field
			"fOpacity" : null, // Stores current layer opactiy (1.0 max - 0 transparent)
			"sFieldEscaped" : null, // Field name for geometry escaped (if needed)
			"fnRender" : null, // reference to function to call for render a item
			"fnClusterRender" : null, 	 // reference to function to call for render a cluster item
			"fnPrepareInfo" : null, // reference to functio to call for prepara item info
			"oPathStyle" : null, // path options to draw items (if any)
			"oPathStyleSelected" : null, // path options to draw selected
			"fnLabeling" : null, // function to function to call for custom simple labeling
			"fnLabelingText" : null, // function to get simple labeling text
			"sLabelingProperty" : null, // item property name to use as labeling text
			"sLabelingText" : null, // String to use as labelingText for all items
			"oLabelingOptions" : null, // labeling options (if any) (http://leafletjs.com/reference.html#divicon-options)
			"bHasLabeling" : false, // true if item should be render with label items (if any)
			"itemById" : {}, // Map of current item of layer by Id (pk)
			"oMarkerLayer": null, // Layer for markers
			"oPathLayer" : null, // Layer for path layers
			"oDataLayer" : null, // Layer for data layers (markers and path)
			"oLabelingLayer": null, // Layer for labeling
			"oLabelingMarkerLayer": null, // Layer for labeling of markers
			"oLabelingPathLayer": null, // Layer for labeling of Path layers
			"aLayerToolsById" : []
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();

	};
	GvNIX_Map_Leaflet.LAYERS.entity_field.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.Base._prototype,
		{
			"debug" : function(message) {
				var st = this._state;
				st.oMap.debug("[Layer-field:" + st.sId + "] "
						+ message);
			},

			// Class constructor
			"_fnConstructor" : function() {
				this.__fnConstructor();
				this.s.group = this.s.entity;
				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				var s = this.s;
				var st = this._state;

				// Check required fields
				if (!s.entity || !s.field) {
					this.debug("ERROR: 'entity' and 'field' options are required");
					return;
				}

				// Locate parent GvNIX_Map_Leaflet.LAYERS.entity
				// instance
				st.oEntity = st.oMap.fnGetLayerById(s.entity);
				if (!st.oEntity) {
					this.debug("entity id='" + s.entity
							+ "' not found");
					return;
				}

				this._fnConstructor_preareField(s,st);
				this._fnConstructor_prepareRenderAndInfo(s,st);
				this._fnConstructor_prepareStyleOps(s,st);
				this._fnConstructor_prepareCRS(s,st);

				// Create leaflet layers
				this._fnConstructor_prepareLeafletLayer(s,st);

				// Register current layer in parent entity layer
				st.oEntity._fnRegisterFieldLayer(this);
			},

			/**
			 * Constructor: prepara native (leaflet) layers
			 * used to draw items
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnConstructor_prepareLeafletLayer" : function (s,st) {
				this.__fnConstructor_prepareLeafletLayer(s,st);
			},

			/**
			 * Constructor: prepare native (leaflet) layers
			 * used to draw items
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnConstructor_prepareLeafletLayer" : function (s,st) {
				// Create base layer
				st.oLayer = L.featureGroup();

				// Create layer for data layer
				st.oDataLayer = L.featureGroup();
				st.oLayer.addLayer(st.oDataLayer);

				// Create layerGroup for markers
				if (s.clusterize && s.icon) {
					// Create a grouping marker layer
					var renderFunction;
					if (s.fn_cluster_render) {
						st.fnClusterRender = window[s.fn_cluster_render];
						if (!st.fnClusterRender) {
							this.debug("ERROR: function '" + s.fn_cluster_render + "' not found");
						} else if (typeof st.fnClusterRender != "function") {
							this.debug("ERROR: '" + s.fn_cluster_render + "' is not a function");
							st.fnClusterRender = null;
						}
					}
					else{
						st.fnClusterRender = this.Util.createClusterIconForLayer;
					}
					st.oMarkerLayer = new L.MarkerClusterGroup(
							{
								showCoverageOnHover : false,
								removeOutsideVisibleBounds : true,
								iconCreateFunction : jQuery.proxy(this._fnRenderCluster,this)
							});
					st.oMarkerLayer._isClusterLayer = true;

					// As MarkerClusterGroup changes opacity
					// user can manage it. So, remove fnSetOpacity
					// function for this instance
					this.fnSetOpacity = undefined;
					this.fnGetOpacity = undefined;

				} else {
					if (s.clusterize) {
						// clusterize = true and s.icon not defined
						this.debug("ERROR: render icon not found for clusterize point data");
					}
					st.oMarkerLayer = L.featureGroup();
					st.oMarkerLayer._isClusterLayer = false;
				}
				st.oDataLayer.addLayer(st.oMarkerLayer);

				// Create layer for path layers
				st.oPathLayer = L.featureGroup();
				st.oDataLayer.addLayer(st.oPathLayer);

			    st.oLayer._gvNIX_layer_id = st.sId;
				// save configured index of layer
				st.oLayer._gvNIX_layer_index = s.index;

				// Labeling configuration and layer for labels (if any)
				this._fnInitializeLabeling(s,st);
			},

			/**
			 * Constructor: prepara CRS
			 *
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnConstructor_prepareCRS" : function (s,st) {
				this.__fnConstructor_prepareCRS(s,st);
			},

			/**
			 * Constructor: prepara CRS
			 *
			 * Default implementation
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnConstructor_prepareCRS" : function (s,st) {
				// Creating crs object
				var crsObject = L.CRS[s.crs];
				if (crsObject) {
					st.oCrs = crsObject;
				}
			},

			/**
			 * Constructor: prepara Style opstions
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnConstructor_prepareStyleOps" : function (s,st) {
				this.__fnConstructor_prepareStyleOps(s,st);
			},

			/**
			 * Constructor: prepara Style opstions
			 *
			 * Default implementation
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnConstructor_prepareStyleOps" : function (s,st) {
				s.radius = toFloat(s.radius);

				// Initialize opacity
				var currentOpacity = this
							.__fnLoadOpacityStatus();

				if ((currentOpacity == undefined || currentOpacity == null) &&
						(s.opacity != undefined && s.opacity != null)) {
					currentOpacity = toFloat(s.opacity);
				}
				if (currentOpacity != undefined && currentOpacity != null) {
					st.fOpacity = currentOpacity;
				}

				// parse path style
				if (s.path_style) {
					st.oPathStyle = this.Util
							.parseJSONOption(s.path_style);
				}

				// parse path style for selected elements
				if (s.path_style_selected) {
					st.oPathStyleSelected = this.Util
							.parseJSONOption(s.path_style_selected);
				} else if (s.path_style) {
					st.oPathStyleSelected = st.oPathStyle;
				}
			},

			/**
			 * Constructor: prepara Render and Info options
			 *
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnConstructor_prepareRenderAndInfo" : function (s,st) {
				this.__fnConstructor_prepareRenderAndInfo(s,st);
			},

			/**
			 * Constructor: prepara Render and Info options
			 *
			 * Default implementation
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnConstructor_prepareRenderAndInfo" : function (s,st) {
				// get custom render function (if any)
				if (s.fn_ajust_render) {
					st.fnRender = window[s.fn_ajust_render];
					if (!st.fnRender) {
						this.debug("ERROR: function '"
								+ s.fn_ajust_render
								+ "' not found");
					} else if (typeof st.fnRender != "function") {
						this.debug("ERROR: '" + s.fn_ajust_render
								+ "' is not a function");
						st.fnRender = null;
					}
				}

				// Get custom genera info function (if any)
				if (s.fn_prepare_info) {
					st.fnPreparInfo = window[s.fn_prepare_info];
					if (!st.fnPreparInfo) {
						this
								.debug("ERROR: function '"
										+ s.fn_prepare_info
										+ "' not found");
					} else if (typeof st.fnPreparInfo != "function") {
						this.debug("ERROR: '" + s.fn_prepare_info
								+ "' is not a function");
						st.fnPreparInfo = null;
					}
				}

			},

			/**
			 * Constructor: prepare field
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnConstructor_preareField" : function (s,st) {
				this.__fnConstructor_preareField(s,st);
			},

			/**
			 * Constructor: prepare field
			 *
			 * Default implementation
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnConstructor_preareField" : function (s,st) {
				var escaped = this.UDtt.escapeFieldForRequest(s.field);
				if (escaped != s.field) {
					st.sFieldEscaped = escaped;
				}

			},

			/**
			 * Initializes Labeling options
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnInitializeLabeling" : function (s, st) {
				this.__fnInitializeLabeling(s,st);
			},

			/**
			 * Initializes Labeling options
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"__fnInitializeLabeling" : function (s, st) {
				var bHasLabeling = false;
				if (s.fn_labeling) {
					// Get custom labeling function
					st.fnLabeling = this.Util.getFunctionByName(s.fn_labeling);
					if (st.fnLabeling) {
						bHasLabeling= true;
					}
				} else if (s.fn_labeling_text) {
					// Get labeling text function
					st.fnLabelingText = this.Util.getFunctionByName(s.fn_labeling_text);
					if (st.fnLabelingText) {
						bHasLabeling= true;
					}

				} else if (s.labeling_property) {
					// Check for labeling by item property
					st.sLabelingProperty=s.labeling_property;
					bHasLabeling= true;
				} else if (s.labeling_text) {
					// Check for static text labeling
					st.sLabelingText=s.labeling_text;
					bHasLabeling= true;
				}

				// Store if labeling is active
				st.bHasLabeling = bHasLabeling;
				if (bHasLabeling) {
					if (s.clusterize) {
						st.oLabelingLayer = L.featureGroup();
						st.oLabelingLayer._hasClusterLayer = true;
						st.oLabelingMarkerLayer = new L.MarkerClusterGroup(
								{
									showCoverageOnHover : false,
									zoomToBoundsOnClick : false,
									removeOutsideVisibleBounds : true,
									iconCreateFunction : this.Util.createEmptyClusterIcon
								});
						st.oLabelingLayer.addLayer(st.oLabelingMarkerLayer);

						st.oLabelingPathLayer = L.featureGroup();
						st.oLabelingLayer.addLayer(st.oLabelingPathLayer);
					} else {
						st.oLabelingLayer = L.featureGroup();
						st.oLabelingMarkerLayer = st.oLabelingLayer;
						st.oLabelingPathLayer = st.oLabelingLayer;
					}
					st.oLayer.addLayer(st.oLabelingLayer);

					if (s.labeling_options) {
						// load labeling options
						// (http://leafletjs.com/reference.html#divicon-options)
						st.oLabelingOptions = this.Util.parseJSONOption(s.labeling_options);
					}
				}
			},

			/**
			 * Function to save opacity level on localStorage
			 *
			 * Overrides default
			 *
			 * @param opacityLevel
			 *            level of opacity to save on localStorage [1.0 (max) to 0.0 (none)]
			 */
			"_fnSaveOpacityStatus" : function(opacityLevel) {
				this.__fnSaveOpacityStatus(opacityLevel);
				this._state.fOpacity = opacityLevel;
			},

			/**
			 * Returns the L.FeatureGroup instance which contains
			 * all data. (L.Marker and L.Path without labeling
			 * layers)
			 */
			"fnGetLeafletDataGroup" : function () {
				return this.__fnGetLeafletDataGroup();
			},

			/**
			 * Returns the L.FeatureGroup instance which contains
			 * all data. (L.Marker and L.Path without labeling
			 * layers)
			 */
			"__fnGetLeafletDataGroup" : function () {
				return this._state.oDataLayer;
			},

			/**
			 * Method called when all data is already loaded
			 */
			"_fnLoadDataDone" : function () {
				this.__fnLoadDataDone();
			},

			/**
			 * Method called when all data is already loaded
			 */
			"__fnLoadDataDone" : function () {
				var st = this._state;
				// Nothint to do (jet)
			},

			/**
			 * Perform cluster icon render method
			 *
			 * @param cluster
			 * @return icon for cluster
			 */
			"_fnRenderCluster" : function (cluster) {
				return this.__fnRenderCluster(cluster);
			},

			/**
			 * Perform cluster icon render method
			 *
			 * @param cluster
			 * @return icon for cluster
			 */
			"__fnRenderCluster" : function (cluster) {
				var st = this._state;
				var clusterIcon = st.fnClusterRender(cluster);
				return clusterIcon;
			},

			/**
			 * Informs if current layer has labeling configuration set
			 */
			"fnHasLabeling" : function () {
				return this.__fnHasLabeling();
			},

			"__fnHasLabeling" : function () {
				return this._state.bHasLabeling;
			},

			/**
			 * Allows to identify this layer as a field layer
			 */
			"fnIsFieldLayer" : function() {
				return true;
			},

			// overwrite to use entity layer container
			"_fnGetLayerContainer" : function() {
				return this._state.oEntity.fnGetLeafletGroup();
			},

			/**
			 * Clear all items from entity
			 */
			"fnClear" : function() {
				var st = this._state;
				st.oPathLayer.clearLayers();
				st.oMarkerLayer.clearLayers();
				if (this.fnHasLabeling()) {
					if (st.oLabelingLayer._hasClusterLayer) {
						st.oLabelingMarkerLayer.clearLayers();
						st.oLabelingPathLayer.clearLayers();
					} else {
						st.oLabelingLayer.clearLayers();
					}
				}
				st.oItemsById = {};
			},

			/**
			 * Add a item (geometry) for layer feature: 1. Gets the
			 * geom (s.field) value from oFeature 2. Checks thas is
			 * already loaded (by id) or if has ben modified 3.
			 * Recreate or add item 4. Format render (depending on
			 * configuration) 5. Generate info data (if any)
			 *
			 * @param oFeature
			 *            feature to add (object with all
			 *            properties)
			 * @param id
			 *            (pk) of item
			 * @param bSelected
			 *            item is selected or not
			 */
			"fnAddFromFeature" : function(oFeature, id, bSelected) {
				this.__fnAddFromFeature(oFeature, id, bSelected);
			},

			/**
			 * Add a item (geometry) for layer feature: 1. Gets the
			 * geom (s.field) value from oFeature 2. Checks thas is
			 * already loaded (by id) or if has ben modified 3.
			 * Recreate or add item 4. Format render (depending on
			 * configuration) 5. Generate info data (if any)
			 *
			 * Default implementation
			 *
			 * @param oFeature
			 *            feature to add (object with all
			 *            properties)
			 * @param id
			 *            (pk) of item
			 * @param bSelected
			 *            item is selected or not
			 */
			"__fnAddFromFeature" : function(oFeature, id, bSelected) {
				var U = this.Util;
				var st = this._state;
				var s = this.s;
				// Get Previous item
				var curItem = st.itemById[id];
				// Get new geometry
				var sWkt = null;
				if (st.sFieldEscaped) {
					sWkt = oFeature[st.sFieldEscaped];
					oFeature[s.field] = sWkt;
				} else {
					sWkt = oFeature[s.field];
				}
				// if there is previous item
				var itemHasChanges = false;
				var itemToRemove = false;
				if (curItem) {
					// delete old item
					itemToRemove = true;
					if (sWkt && (
							sWkt != curItem.sWkt
							|| curItem.isSelected != bSelected
							|| U.equalsObjects(curItem.oFeature, oFeature) == false)) {
						// item changed
						itemHasChanges = true;
					}

				} else {
					// New item
					curItem = {
						"id" : id,
						"sWkt" : sWkt,
						"oFeature" : oFeature,
						"oPopup" : null,
						"sInfo" : null,
						"oLayer" : null,
						"sLabel" : null,
						"oLabeling" : null,
						"isSelected" : bSelected
					};
				}

				if (itemToRemove) {
					this._fnRemoveItem(curItem);
				}

				if (itemHasChanges) {
					if (curItem.oPopup) {
						curItem.oLayer.unbindPopup();
					}
					curItem.sWkt = sWkt;
					curItem.oFeature = oFeature;
					curItem.oPopup = null;
					curItem.sInfo = null;
					curItem.oLayer = null;
					curItem.oLabeling = null;
					curItem.sLabel = null;
					curItem.isSelected = bSelected;
				}

				// TODO modify it to use L.GeoJSON Options to
				// create/load layer
				/*
				 *
				 * var oGeoJSONOption {}; if (st.oPathStyle) {
				 * oGeoJSONOptions =
				 * jQuery.extend(oGeoJSONOptions,st.oPathStyle); }
				 *
				 * var oGeomLayer =
				 * this._fnGetJSONBaseLayer(oGeoJSONOptions);
				 */

				if (!sWkt) {
					// Not wkt: not visible
					return;
				}
				var oGeomLayer = U.parseWkt(sWkt);

				if (!oGeomLayer) {
					return;
				}
				var oLayerToAdd = this._fnAdjustGeomRendering(id,
						oGeomLayer, oFeature, bSelected);
				curItem.oLayer = oLayerToAdd;
				if (!oLayerToAdd) {
					return;
				}

				// Store info on layer
				oLayerToAdd._gvNIX_parentLayer = st.sId;
				oLayerToAdd._gvNIX_pk = id;

				// Store item data in By-id mapping
				st.itemById[id] = curItem;

				if (s.show_info) {
					// Raise on geom click. Dinamic popup. Added
					// click event
					curItem.oLayer.on("click",
							jQuery.proxy(this._fnItemClickEvent, this,
								curItem));
				}

				// Getting current opacity
				var currentOpacity = st.fOpacity;
				if(oLayerToAdd.setIcon){
					if (currentOpacity != undefined && currentOpacity != null) {
						oLayerToAdd.setOpacity(currentOpacity);
					}
				}else{
					if (currentOpacity != undefined && currentOpacity != null) {
						oLayerToAdd.setStyle({
							opacity : currentOpacity
						});
						oLayerToAdd.setStyle({
							fillOpacity : currentOpacity - 0.8
						});
					}
				}

				this._fnAddFeatureLayer(oLayerToAdd, curItem);

				// handle labeling
				if (this.fnHasLabeling()) {
					var oLabel = this._fnGetLabelLayer(id,
						oGeomLayer, oLayerToAdd, oFeature, bSelected);
					if (oLabel) {
						curItem.oLabeling = oLabel;
						oLabel._gvNIX_parentLayer = st.sId;
						oLabel._gvNIX_pk = id;
						oLabel._isLabelLayer = true;

						if(oLabel.setIcon){
							if (currentOpacity != undefined && currentOpacity != null) {
								oLabel.setOpacity(currentOpacity);
							}
						}else{
							if (currentOpacity != undefined && currentOpacity != null) {
								oLabel.setStyle({
									opacity : currentOpacity
								});
								oLabel.setStyle({
									fillOpacity : currentOpacity - 0.8
								});
							}
						}

						this._fnAddFeatureLabelLayer(oLabel, curItem);
					}
				}
			},

			/**
			 * Add leaflet layer to labeling group layer
			 */
			"_fnAddFeatureLabelLayer" : function (oLeafletLayer, curItem) {
				this.__fnAddFeatureLabelLayer(oLeafletLayer, curItem);
			},

			/**
			 * Add leaflet layer to labeling group layer
			 */
			"__fnAddFeatureLabelLayer" : function (oLeafletLayer, curItem) {
				var st = this._state;
				if (curItem.oLayerContainer == st.oMarkerLayer) {
					st.oLabelingMarkerLayer.addLayer(oLeafletLayer);
				} else {
					st.oLabelingPathLayer.addLayer(oLeafletLayer);
				}
			},

			/**
			 * Create the leaflet labeling layer instance which represent
			 * the labeling of a item
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oLayerToAdd
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which, finally, will be
			 *            added to map
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 *
			 * @return leaflet layer instance for label
			 *
			 */
			"_fnGetLabelLayer" : function (id, oGeomLayer, oLayerToAdd, oFeature, bSelected) {
				return this.__fnGetLabelLayer(id, oGeomLayer, oLayerToAdd, oFeature, bSelected);
			},

			/**
			 * Create the leaflet labeling layer instance which represent
			 * the labeling of a item
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oLayerToAdd
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which, finally, will be
			 *            added to map
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 * @return leaflet layer instance for label
			 */
			"__fnGetLabelLayer" : function (id, oGeomLayer, oLayerToAdd, oFeature, bSelected) {
				var st = this._state;
				var s = this.s;
				if (st.fnLabeling) {
					// Custom function to generate label layer
					return st.fnLabeling(st.oMap, st.sId, s.field,
							id, oSrcGeomLayer, oFeature, bSelected);
				} else {
					var sLabelText = null;
					if (st.fnLabelingText) {
						// Call function to generate label
						sLabelText = st.fnLabelingText(st.oMap,st.sId,
								this._fnGetPath(), s.field,
								id,oFeature,oLayerToAdd,bSelected);
					} else if (st.sLabelingProperty) {
						// get from item property
						sLabelText = oFeature[st.sLabelingProperty];
						if (sLabelText == undefined) {
							this.debug("ERROR: '" + st.sLabelingProperty
								+ "' is not a value of item");
							return;
						} else if (sLabelText == null) {
							sLabelText = "";
						}

					} else if (st.sLabelingText){
						// static label
						sLabelText = st.sLabelingText;
					} else {
						// nothing set
						this.debug("ERROR: can't identify label text");
						return;
					}
					var oLabelOptions = {className: "mapviewer_layers_labeling"};
					if (st.oLabelingOptions) {
						oLabelOptions =  jQuery.extend(oLabelOptions,st.oLabelingOptions);
					}


					oLabelOptions.html = sLabelText;
					var oLeafletLabelIcon = L.divIcon(oLabelOptions);
					var oLocation = this._fnGetLabelLocationFor(oLayerToAdd);
					var oMarker = L.marker(oLocation, { "icon" : oLeafletLabelIcon});
					return oMarker;
				}
			},

			/**
			 * Returns a L.LatLng (http://leafletjs.com/reference.html#latlng)
			 * with the positio to locate the label for a layer
			 *
			 * @param oLayerToAdd refered leaflet layer
			 * @return L.LatLng instance
			 */
			"_fnGetLabelLocationFor" : function (oLayerToAdd) {
				return this.__fnGetLabelLocationFor(oLayerToAdd);
			},

			/**
			 * Returns a L.LatLng (http://leafletjs.com/reference.html#latlng)
			 * with the positio to locate the label for a layer.
			 *
			 * Default implementation.
			 *
			 * @param oLayerToAdd refered leaflet layer
			 */
			"__fnGetLabelLocationFor" : function (oLayerToAdd) {
				// TODO improve this implementation
				if (oLayerToAdd.getLatLng) {
					// has a way to determine position (normaly a marker)
					return oLayerToAdd.getLatLng();
				}
				return oLayerToAdd.getBounds().getCenter();
			},

			/**
			 * Function to handle click event of item
			 *
			 * @param curItem item data
			 * @param e click event info object
			 */
			"_fnItemClickEvent" : function (curItem, e) {
				this.__fnItemClickEvent(curItem, e);
			},

			/**
			 * Function to handle click event of item.
			 *
			 * Default implementation.
			 *
			 * @param curItem item data
			 * @param e click event info object
			 */
			"__fnItemClickEvent" : function (curItem, e) {
				var U = this.Util;
				var st = this._state;
				var s = this.s;
				var fnPrepareInfo = st.fnPrepareInfo;
				if (!fnPrepareInfo) {
					fnPrepareInfo = U.createLayerInfoString;
				}
				if (curItem.oPopup) {
					curItem.oLayer.unbindPopup();
					curItem.oPopup = null;
				}
				var sInfo = fnPrepareInfo(
									st.oMap,
									st.sId,
									this._fnGetPath(),
									s.field,
									curItem.id,
									curItem.oFeature,
									curItem.oLayer,
									curItem.isSelected);
				if (sInfo) {
					curItem.oPopup = curItem.oLayer.bindPopup(sInfo);
					curItem.sInfo = sInfo;
				}
				curItem.oPopup.openPopup(e.latlng)
			},

			/**
			 * Adds a leaflet layer to rigth sublayer (st.oMarkerLayer, st.oPathLayer)
			 * depending on its type.
			 *
			 * @param oLayerToAdd leaflet layer to add
			 * @param curItem item data
			 */
			"_fnAddFeatureLayer" : function (oLayerToAdd, curItem) {
				this.__fnAddFeatureLayer(oLayerToAdd, curItem);
			},

			/**
			 * Adds a leaflet layer to rigth sublayer (st.oMarkerLayer, st.oPathLayer)
			 * depending on its type.
			 *
			 * Default implementation.
			 *
			 * @param oLayerToAdd leaflet layer to add
			 * @param curItem item data
			 */
			"__fnAddFeatureLayer" : function (oLayerToAdd, curItem) {
				var U = this.Util;
				var st = this._state;
				if (U.isLeafletMarker(oLayerToAdd)) {
					st.oMarkerLayer.addLayer(oLayerToAdd)
					curItem.oLayerContainer = st.oMarkerLayer;
				} else {
					st.oPathLayer.addLayer(oLayerToAdd);
					curItem.oLayerContainer = st.oPathLayer;
				}
			},



			/**
			 * Removes features not in aPks
			 *
			 * @param aPks
			 *            arrays of items ids to preserve
			 */
			"fnCleanFeaturesNotIn" : function(aPks) {
				this.__fnCleanFeaturesNotIn(aPks);
			},

			/**
			 * Removes features not in aPks
			 *
			 * @param aPks
			 *            arrays of items ids to preserve
			 */
			"__fnCleanFeaturesNotIn" : function(aPks) {
				if (!aPks || aPks.length == 0) {
					this.fnClear();
					return;
				}
				var st = this._state;
				var aCurrent = Object.keys(st.itemById).slice(0);
				for ( var i in aCurrent) {
					if (jQuery.inArray(aCurrent[i], aPks) == -1) {
						this._fnRemoveItem(st.itemById[aCurrent[i]]);
					}
				}
			},

			"_fnGetPath" : function() {
				return this._state.oEntity.fnSettings().path;
			},

			/**
			 * Remove a item from layer
			 *
			 * @param item
			 *            item object
			 */
			"_fnRemoveItem" : function(item) {
				this.__fnRemoveItem(item);
			},

			/**
			 * Remove a item from layer
			 *
			 * Default implementation
			 *
			 * @param item
			 *            item object
			 */
			"__fnRemoveItem" : function(item) {
				var st = this._state;

				// check and clear popup dialog
				if (item.oPopup) {
					item.oLayer.unbindPopup();
					item.oLayer.oPopup = null;
				}
				item.oLayerContainer.removeLayer(item.oLayer);

				// check and clear labeling
				if (item.oLabeling) {
					if (item.oLayerContainer == st.oMarkerLayer) {
						st.oLabelingMarkerLayer.removeLayer(item.oLabeling);
					} else {
						st.oLabelingPathLayer.removeLayer(item.oLabeling);
					}
					item.oLabeling = null;
				}

				// delete item from list
				delete st.itemById[item.id];
			},

			/**
			 * Remove a item from layer by ID
			 *
			 * Default implementation
			 *
			 * @param id
			 *            item object
			 */
			"__fnRemoveItemById" : function(id) {
				var st = this._state;
				var aCurrent = Object.keys(st.itemById).slice(0);
				for ( var i in aCurrent) {
					if (jQuery.inArray(aCurrent[i], id) == -1) {
						this._fnRemoveItem(st.itemById[id]);
					}
				}
			},

			/**
			 * Adjust rendering of a item
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 *
			 * @return a Leaflet layer with new format
			 */
			"_fnAdjustGeomRendering" : function(id, oSrcGeomLayer,
					oFeature, bSelected) {
				return this.__fnAdjustGeomRendering(id,
						oSrcGeomLayer, oFeature, bSelected);
			},

			/**
			 * Adjust rendering of a item
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 *
			 * Default implementation
			 *
			 * @return a Leaflet layer with new format
			 */
			"__fnAdjustGeomRendering" : function(id, oSrcGeomLayer,
					oFeature, bSelected) {
				var st = this._state;
				var s = this.s;
				if (st.fnRender) {
					return st.fnRender(st.oMap, st.sId, s.field,
							id, oSrcGeomLayer, oFeature, bSelected);
				} else {
					return this._fnAdjustGeomRenderingFromOptions(
							id, oSrcGeomLayer, oFeature, bSelected);
				}
			},

			/**
			 * Adjust rendering of a item based on type and options
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 */
			"_fnAdjustGeomRenderingFromOptions" : function(id,
					oSrcGeomLayer, oFeature, bSelected) {
				return this.__fnAdjustGeomRenderingFromOptions(id,
						oSrcGeomLayer, oFeature, bSelected);
			},

			/**
			 * Adjust rendering of a item based on type and options
			 *
			 * @param id
			 *            (pk) of item
			 * @param oSrcGeomLayer
			 *            Leaflet layer instance (Marker,
			 *            LayerGroup, Polyline...) which represent
			 *            geometry field of item
			 * @param oFeature
			 *            all feature values
			 * @param bSelected
			 *            item is selected or not
			 *
			 * Default implementation
			 */
			"__fnAdjustGeomRenderingFromOptions" : function(id,
					oSrcGeomLayer, oFeature, bSelected) {
				var st = this._state;
				var s = this.s;
				if (oSrcGeomLayer.getLayers) {
					var aLayers = oSrcGeomLayer.getLayers();
					oSrcGeomLayer.clearLayers();
					if (aLayers) {
						for ( var i in aLayers) {
							var newLayer = this
									._fnAdjustGeomRenderingFromOptions(
											id, aLayers[i],
											oFeature, bSelected);
							if (newLayer) {
								oSrcGeomLayer.addLayer(newLayer);
							}
						}
					}
					return oSrcGeomLayer;
				}
				// Is point
				if (oSrcGeomLayer.setIcon) {
					if (bSelected) {
						oSrcGeomLayer.setIcon(this
								._fnCreateIconMarker(s.icon,
										s.icon_library_selected,
										s.marker_color_selected,
										s.color_selected));
					} else {
						oSrcGeomLayer.setIcon(this
								._fnCreateIconMarker(s.icon,
										s.icon_library,
										s.marker_color, s.color));
					}

					return oSrcGeomLayer;
				}
				if (oSrcGeomLayer.setStyle) {
					// set path style
					if (bSelected && st.oPathStyleSelect) {
						oSrcGeomLayer.setStyle(st.oPathStyleSelect);
					} else if (bSelected) {
						oSrcGeomLayer
								.setStyle({
									'color' : s.marker_color_selected ? s.marker_color_selected
									: s.marker_color
								});
					} else if (!bSelected && st.oPathStyle) {
						oSrcGeomLayer.setStyle(st.oPathStyle);
					} else {
						oSrcGeomLayer.setStyle({
							'color' : s.color
						});
					}
					if (oSrcGeomLayer.setRadius && s.radius) {
						oSrcGeomLayer.setRadius(s.radius);
					}
				}
				return oSrcGeomLayer;
			},

			/**
			 * Create a icon marker for item
			 *
			 * @param icon
			 *            name
			 * @param prefix
			 * @param markerColor
			 * @param iconColor
			 *
			 * @returns marker
			 */
			"_fnCreateIconMarker" : function(icon, prefix,
					markerColor, iconColor) {
				return this.__fnCreateIconMarker(icon, prefix,
						markerColor, iconColor);
			},

			/**
			 * Create a icon marker for item
			 *
			 * @param icon
			 *            name
			 * @param prefix
			 * @param markerColor
			 * @param iconColor
			 *
			 * @returns marker
			 */
			"__fnCreateIconMarker" : function(icon, prefix,
					markerColor, iconColor) {
				var iconMarker = L.AwesomeMarkers.icon({
					"icon" : icon,
					"prefix" : prefix,
					"markerColor" : markerColor,
					"iconColor" : iconColor
				});
				return iconMarker;
			},

			/**
			 * Get entity of current layer
			 */
			"__fnGetParentNodeId" : function() {
				return this.s.entity;
			},

			/**
			 * Get entity layer whose this layer is children
			 */
			"__fnGetEntityId" : function() {
				return this.s.entity;
			},

			/**
			 * Function that sets opacity level of entity_field layer
			 *
			 * @param opacityLevel
			 *            to set on layer
			 *
			 */
			"fnSetOpacity" : function(opacityLevel) {
				// Change Opacity
				this._fnSetOpacityFinalLayer(this._state.oLayer,
						opacityLevel);

				// Save opacity on localStorage
				this._fnSaveOpacityStatus(opacityLevel);
			},

			/**
			 * Function that returns current layer opacity
			 */
			"fnGetOpacity" : function() {
				return this.__fnLoadOpacityStatus();
			},

			/**
			 * Function to set opacity of final entity_field layers
			 *
			 * @params oLayer leaflet layer instance
			 * @params opacityLevel opactity level (1.0 max, 0.0 transparent)
			 */
			"_fnSetOpacityFinalLayer" : function(oLayer, opacityLevel) {
				this.__fnSetOpacityFinalLayer(oLayer, opacityLevel);
			},

			/**
			 * Function to set opacity of final entity_field layers
			 *
			 * Default implementation
			 *
			 * @params oLayer leaflet layer instance
			 * @params opacityLevel opactity level (1.0 max, 0.0 transparent)
			 */
			"__fnSetOpacityFinalLayer" : function(oLayer, opacityLevel) {
				if (oLayer) {
					if (oLayer.setOpacity) {
						oLayer.setOpacity(opacityLevel);
					} else if (oLayer._isClusterLayer) {
						// Set opacity in clusterized is unsupported
					} else if (oLayer.setStyle) {
						if (oLayer.options && oLayer.options.opacity != undefined) {
							oLayer.setStyle({
								"opacity" : opacityLevel
							});
							oLayer.setStyle({
								"fillOpacity" : opacityLevel - 0.8
							});
						} else {
							this._fnSetOpacityLayerArray(oLayer.getLayers(), opacityLevel);
						}
					} else if (oLayer.getLayers){
						this._fnSetOpacityLayerArray(oLayer.getLayers(), opacityLevel);
					}
				}
			},

			/**
			 * Function to set opacity to an array of layers
			 *
			 * @params aoLayer leaflet layer array
			 * @params opacityLevel opactity level (1.0 max, 0.0 transparent)
			 */
			"_fnSetOpacityLayerArray" : function(aoLayer, opacityLevel) {
				this.__fnSetOpacityLayerArray(aoLayer,opacityLevel);
			},

			/**
			 * Function to set opacity to an array of layers
			 *
			 * Default implementation
			 *
			 * @params aoLayer leaflet layer array
			 * @params opacityLevel opactity level (1.0 max, 0.0 transparent)
			 */
			"__fnSetOpacityLayerArray" : function(aoLayer, opacityLevel) {
				for (i in aoLayer) {
					this._fnSetOpacityFinalLayer(aoLayer[i], opacityLevel);
				}
			}
		}); // GvNIX_Map_Leaflet.LAYERS.entity_field.prototype

	/**
	 * Layer combination of GvNIX_Map_Leaflet.LAYERS.entity and
	 * GvNIX_Map_Leaflet.LAYERS.entity_field to represent entity and just one
	 * geometry column (all on one row)
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_simple = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.entity_simple) {
			alert("Warning: GvNIX_Map_Leaflet Entity layer must be initialised with the keyword 'new'");
		}

		// extends entity and entity_field options
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.entity.default_options,
				GvNIX_Map_Leaflet.LAYERS.entity_field.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance From entity
			"oSelection" : null, // selection data get from Dtt info
			"oFilterConfig" : null, // filter configuration object (only if filte_type == "auto")
			"oLastRequest" : null, // last data request info (for "not_volatile" layers)
			"oLoadingIcon" : null, // jQuery object of loading-icon DOM element (if any)
			"oCrs" : null, // L.CRS instance of current field
			"fOpacity" : null, // Stores current layer opactiy (1.0 max - 0 transparent)
			"sFieldEscaped" : null, // Field name for geometry escaped (if needed)
			"fnRender" : null, // reference to function to call for render a item
			"fnClusterRender" : null, 	 // reference to function to call for render a cluster item
			"fnPrepareInfo" : null, // reference to functio to call for prepara item info
			"oPathStyle" : null, // path options to draw items (if any)
			"oPathStyleSelected" : null, // path options to draw selected items (if any)
			"fnLabeling" : null, // function to function to call for custom simple labeling
			"fnLabelingText" : null, // function to get simple labeling text
			"sLabelingProperty" : null, // item property name to use as labeling text
			"sLabelingText" : null, // String to use as labelingText for all items
			"oLabelingOptions" : null, // labeling options (if any) (http://leafletjs.com/reference.html#divicon-options)
			"bHasLabeling" : false, // true if item should be render with label items (if any)
			"itemById" : {}, // Map of current item of layer by Id (pk)
			"oMarkerLayer": null, // Layer for markers
			"oPathLayer" : null, // Layer for path layers
			"oDataLayer" : null, // Layer for data layers (markers and path)
			"oLabelingLayer": null, // Layer for labeling
			"oLabelingMarkerLayer": null, // Layer for labeling of markers
			"oLabelingPathLayer": null, // Layer for labeling of Path layers
			"aLayerToolsById" : []
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Inherit entity and entity_field methods
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_simple.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.entity.prototype,
		GvNIX_Map_Leaflet.LAYERS.entity_field.prototype,
		{
			"_fnConstructor" : function() {
				this.__fnConstructor();
				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				var s = this.s;
				var st = this._state;

				// [entity]
				// Check required parameters
				if (!s.pk || !s.path) {
					this
							.debug("ERROR: 'pk' and 'path' options are required");
					return;
				}

				// [field]
				// Check required fields
				if (!s.field) {
					this.debug(
						"ERROR: 'entity' and 'field' options are required");
					return;
				}

				// [entity]
				// Configure filter and selection objects
				this._fnConstructor_initializeFilter(s,st);

				// [field]
				this._fnConstructor_preareField(s,st);
				this._fnConstructor_prepareRenderAndInfo(s,st);
				this._fnConstructor_prepareStyleOps(s,st);
				this._fnConstructor_prepareCRS(s,st);

				// [field]
				// Create layerGroup layer
				this._fnConstructor_prepareLeafletLayer(s,st);

				// Register on-move and on-zoom listener
				this._fnConstructor_registerMapListener(s,st);
			},

			// overwrite to use default implementation of base layer
			"_fnGetLayerContainer" : function() {
				return this.__fnGetLayerContainer();
			},

			// overwrite to return this
			"fnGetVisibleFieldLayers" : function() {
				return [ this ];
			},

			// overwrite to get path from settings
			"_fnGetPath" : function() {
				return this.s.path;
			},

			// overwrite to request data
			"fnCheckChanged" : function() {
				this.__fnCheckChanged();
				var bChecked = this._state.oCheckbox;
				if (bChecked) {
					this._fnRequestData();
				}
			},

			// overwrite to return field
			"_fnGetGeomFields" : function() {
				return [ this.s.field ];
			},

			/**
			 * overwrite to load filter
			 *
			 * @param bUseLocalStorage
			 * 				if true, status will be loaded using
			 * 				localStorage and saved localStorage status
			 * 			 	will be changed. If false, status will be loaded
			 * 				by default, and changes will not be applied on localStorage
			 */
			"fnLoadState" : function(bUseLocalStorage) {
				return this._entity_simple_fnLoadState(bUseLocalStorage);
			},

			"_entity_simple_fnLoadState" : function(bUseLocalStorage) {
				var s = this.s;
				var st = this._state;

				// Configure filter and selection objects
				if (s.filter_type || s.selection) {
					var oKeys = st.oMap
							._fnGetEntityLocalStorageKeys(this);
					if (s.filter_type == 'auto'
							|| s.filter_type == 'manual'
							|| s.selection) {

						// Loading Filter state from localStorage
						var filteredLocalStorage = localStorage
								.getItem(oKeys.filterKey);

						var isFiltered = false;

						if (filteredLocalStorage != null) {
							isFiltered = JSON
									.parse(filteredLocalStorage).isFiltered;
							filteredLocalStorage = JSON
									.parse(filteredLocalStorage);
						}

						st.oFilterConfig = {
							'sKey' : oKeys.filterKey,
							'bFiltered' : isFiltered,
							'bAlways' : s.always_use_dtt_request ? true
									: false
						};

						if (filteredLocalStorage != null) {
							st.oFilterConfig = this
									._fnCreateFilterConfig(
											st.oFilterConfig,
											filteredLocalStorage);
						}

					} else if (s.filter_type == "none") {
						// No local storege config
						st.oFilterConfig = null;
					} else {
						this
								.debug("ERROR: invalid value for 'filter_type' (expected one of 'none', 'auto' or 'manual')");
						st.oFilterConfig = null;
					}
					if (s.selection) {
						// Loading selection from localStorage

						st.oSelection = {
							'sKey' : oKeys.selectionKey
						};

						st.oSelection.oData = localStorage
								.getItem(oKeys.selectionKey);
					}
				}

				return this.__fnLoadState(bUseLocalStorage);
			}

		});

	/**
	 * Layer combination of GvNIX_Map_Leaflet.LAYERS.entity and
	 * GvNIX_Map_Leaflet.LAYERS.entity_field to represent entity and just one
	 * geometry column (all on one row)
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_static_geom = function(oMap, sId, options) {
		// Sanity check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.entity_static_geom) {
			alert("Warning: GvNIX_Map_Leaflet Entity layer must be initialised with the keyword 'new'");
		}

		// extends entity and entity_field options
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.entity.default_options,
				GvNIX_Map_Leaflet.LAYERS.entity_field.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance From entity
			"oSelection" : null, // selection data get from Dtt info
			"oFilterConfig" : null, // filter configuration object (only if filte_type == "auto")
			"oLastRequest" : null, // last data request info (for "not_volatile" layers)
			"oLoadingIcon" : null, // jQuery object of loading-icon DOM element (if any)
			"oFilterIcon" : null,// lQuery object of filter-icon DOM element (if any) From entity_field
			"oCrs" : null, // L.CRS instance of current field
			"fOpacity" : null, // Stores current layer opactiy (1.0 max - 0 transparent)
			"fnRender" : null, // reference to function to call for render a item
			"fnClusterRender" : null, // reference to function to call for render a cluster item
			"fnPrepareInfo" : null, // reference to functio to call for prepara item info
			"oPathStyle" : null, // path options to draw items (if any)
			"oPathStyleSelected" : null, // path options to draw selected items (if any)
			"fnLabeling" : null, // function to function to call for custom simple labeling
			"fnLabelingText" : null, // function to get simple labeling text
			"sLabelingProperty" : null, // item property name to use as labeling text
			"sLabelingText" : null, // String to use as labelingText for all items
			"oLabelingOptions" : null, // labeling options (if any) (http://leafletjs.com/reference.html#divicon-options)
			"bHasLabeling" : false, // true if item should be render with label items (if any)
			"itemById" : {}, // Map of current item of layer by Id (pk)
			"oMarkerLayer": null, // Layer for markers
			"oPathLayer" : null, // Layer for path layers
			"oDataLayer" : null, // Layer for data layers (markers and path)
			"oLabelingLayer": null, // Layer for labeling
			"oLabelingMarkerLayer": null, // Layer for labeling of markers
			"oLabelingPathLayer": null, // Layer for labeling of Path layers
			"startzoom" : false,
			"geometry" : null,
			"staticRequest" : null,
			"doneRequest" : false,
			"aLayerToolsById" : []
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Inherit entity and entity_field methods
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_static_geom.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.entity.prototype,
		GvNIX_Map_Leaflet.LAYERS.entity_field.prototype,
		{

			"_fnConstructor" : function() {
				this.__fnConstructor();
				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				var s = this.s;
				var st = this._state;

				// Check required parameters
				if (!s.pk) {
					this.debug("ERROR: 'pk' options are required");
					return;
				}

				// get custom request function
				if (s.fn_staticrequest) {
					st.staticRequest = window[s.fn_staticrequest];
					if (!st.staticRequest) {
						this.debug("ERROR: function '"
								+ s.fn_staticrequest
								+ "' not found");
					} else if (typeof st.staticRequest != "function") {
						this.debug("ERROR: '" + s.fn_staticrequest
								+ "' is not a function");
						st.staticRequest = null;
					}
				}

				// [field]
				this._fnConstructor_prepareRenderAndInfo(s,st);
				this._fnConstructor_prepareCRS(s,st);
				this._fnConstructor_prepareStyleOps(s,st);

				// Create layerGroup layer
				this._fnConstructor_prepareLeafletLayer(s,st);

				// Register on-move and on-zoom listener
				var oLeafletMap = st.oMap.fnGetMapObject();

				st.startzoom = s.startzoom;

				// Register on-move and on-zoom listener
				this._fnConstructor_registerMapListener(s,st);
			},

			/**
			 * Initializes Labeling options
			 *
			 * Overrides default to ignore labeling_property
			 * option
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnInitializeLabeling" : function (s, st) {
				delete(s.labeling_property);
				this.__fnInitializeLabeling(s,st);
			},

			// overwrite to use default implementation of base layer
			"_fnGetLayerContainer" : function() {
				return this.__fnGetLayerContainer();
			},

			// overwrite to return this
			"fnGetVisibleFieldLayers" : function() {
				return [ this ];
			},

			// overwrite to get path from settings
			"_fnGetPath" : function() {
				return this.s.path;
			},

			// overwrite to request data
			"fnCheckChanged" : function() {
				this.__fnCheckChanged();
				var bChecked = this._state.oCheckbox;
				if (bChecked) {
					this._fnRequestData();
				}
			},
			/**
			 * Request layer to local
			 *
			 * Overrides entity_layer._fnRequestData
			 *
			 * @param bForce
			 *            if true force to perform request (ignore
			 *            any cache)
			 */
			"_fnRequestData" : function(bForce) {
				if (!this._state.doneRequest) {
					this.___fnRequestStaticData();
				}

			},

			/**
			 * Request layer (and children) data to server.
			 *
			 * Default implementation (useful for inheritance)
			 *
			 * @param bForce
			 *            if true force to perform request (ignore
			 *            any cache)
			 */
			"___fnRequestStaticData" : function(bForce) {
				if (!this.fnIsVisible()
						|| !this.fnGetVisibleFieldLayers()
						|| bForce) {
					// No visible layers. Nothing to do
					return;
				}
				var s = this.s;
				var st = this._state;
				var oLastRequest = st.oLastRequest;

				// Get current BBOX
				var oBBox = st.oMap.fnMapBondingBox();

				// Check no volatile data
				if (!bForce && s.not_volatile && oLastRequest
						&& oLastRequest.oBBox
						&& oLastRequest.aRecords) {
					// Check if current bounds is contained in
					// previos request
					if (oLastRequest.oBBox.contains(oBBox)) {
						// Check if filter has been chanted
						if (!this._fnIsFilterChanged(
								oLastRequest.oFilterConfig,
								st.oFilterConfig)) {
							// No more data needed. Reload with
							// previous values
							this._fnLoadData(oLastRequest.oBBox,
									oLastRequest.aRecords);
							return;
						}
					}
				}

				// Change UI to notify to user that a reques is on
				// the way
				this._fnShowLoadingIcon();

				// Set initial zoom to static geometry
				if (st.startzoom) {
					var geomValue = null;
					if (s.fn_staticrequest != null
							&& s.fn_staticrequest.length > 0) {
						var request = st.staticRequest();
						this._fnLoadData(oBBox, request, "success");
						// Set true request to not turn to make it
						this._state.doneRequest = true;
						geomValue = request[0][s.field];
					} else {
						this._fnLoadData(oBBox, this
								.fnNewRequest(s.geometry),
								"success");
						// Set true request to not turn to make it
						this._state.doneRequest = true;
						geomValue = s.geometry;
					}
					// get zoom map
					var oldZoomMap = st.oMap._data.zoom;
					// set center geom to map
					var staticLayer = this.Util.parseWkt(geomValue);
					if (staticLayer) {
						var center = null;
						if (staticLayer.getBounds) {
							st.oMap.fnSetMapBondingBox(
									staticLayer.getBounds().getCenter());
						} else {
							st.oMap.fnSetMapBondingBox(
									staticLayer.getLatLng());
						}
					}
					// restore zoom map
					st.oMap.fnGetMapObject().setZoom(oldZoomMap);
					// Change zoom status
					st.startzoom = false;
				}
			},

			// make a new request with given static geometry
			"fnNewRequest" : function(geom) {
				var request = [ {
					"id" : this.s.pk,
					"geometry" : geom
				} ];
				return request;
			}
		});

	/**
	 * Layer combination of GvNIX_Map_Leaflet.LAYERS.entity and
	 * GvNIX_Map_Leaflet.LAYERS.entity_field which uses a input value tag (in
	 * WKT format) to get data
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_from_input = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.entity_from_input) {
			alert("Warning: GvNIX_Map_Leaflet Entity layer must be initialised with the keyword 'new'");
		}

		// extends entity and entity_field options
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.entity.default_options,
				GvNIX_Map_Leaflet.LAYERS.entity_field.default_options);

		this.s = jQuery.extend({}, this._default_options, options);

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.Base._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance
			"$Input" : null, // jQuery object reference to source input tag From entity_field
			"oCrs" : null, // L.CRS instance of current field
			"fnRender" : null, // reference to function to call for render a item
			"fnClusterRender" : null, // reference to function to call for render a cluster item
			"fnPrepareInfo" : null, // reference to functio to call for prepara item info
			"oPathStyle" : null, // path options to draw items (if any)
			"oPathStyleSelected" : null, // path options to draw selected items (if any)
			"fnLabeling" : null, // function to function to call for custom simple labeling
			"fnLabelingText" : null, // function to get simple labeling text
			"sLabelingProperty" : null, // item property name to use as labeling text
			"sLabelingText" : null, // String to use as labelingText for all items
			"oLabelingOptions" : null, // labeling options (if any) (http://leafletjs.com/reference.html#divicon-options)
			"bHasLabeling" : false, // true if item should be render with label items (if any)
			"itemById" : {}, // Map of current item of layer by Id (pk)
			"oMarkerLayer": null, // Layer for markers
			"oDataLayer" : null, // Layer for data layers (markers and path)
			"oPathLayer" : null, // Layer for path layers
			"oLabelingLayer": null, // Layer for labeling
			"oLabelingMarkerLayer": null, // Layer for labeling of markers
			"oLabelingPathLayer": null, // Layer for labeling of Path layers
			"aLayerToolsById" : []
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Inherit entity and entity_field methods
	 */
	GvNIX_Map_Leaflet.LAYERS.entity_from_input.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.entity.prototype,
		GvNIX_Map_Leaflet.LAYERS.entity_field.prototype,
		{

			"_fnConstructor" : function() {
				this.__fnConstructor();
				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				var s = this.s;
				var st = this._state;

				// Check required parameters
				if (!s.input) {
					this
							.debug("ERROR: 'input' options are required");
					return;
				}

				var nInput = jQuery("#" + s.input);

				if (!nInput || nInput.length != 1) {
					this.debug("ERROR: 'input' '" + s.input
							+ "' not found");
					return;
				}
				st.$Input = jQuery(nInput);

				s.field = "geom";

				// [field]
				this._fnConstructor_prepareRenderAndInfo(s,st);
				if (!st.fnPreparInfo) {
					s.show_info = false;
				}
				this._fnConstructor_prepareStyleOps(s,st);
				this._fnConstructor_prepareCRS(s,st);

				// [field]
				// Create layerGroup layer
				this._fnConstructor_prepareLeafletLayer(s,st);

				var sVal = st.$Input.val();

				if (sVal) {
					this.fnAddFromFeature({
						geom : sVal
					}, "0", false);
				}
			},

			/**
			 * Initializes Labeling options
			 *
			 * Overrides default to ignore labeling_property
			 * option
			 *
			 * @param s optioms object
			 * @param st state object
			 */
			"_fnInitializeLabeling" : function (s, st) {
				delete(s.labeling_property);
				this.__fnInitializeLabeling(s,st);
			},

			// overwrite to use default implementation of base layer
			"_fnGetLayerContainer" : function() {
				return this.__fnGetLayerContainer();
			},

			// overwrite to return this
			"fnGetVisibleFieldLayers" : function() {
				return [ this ];
			},

			// overwrite do base implementation
			"fnCheckChanged" : function() {
				this.__fnCheckChanged();
			},

			// Clean the map layer
			"fnClean" : function() {
			    this.__fnClean();
			},

			"__fnClean" : function() {
			    var st = this._state;
			    if (st.oLayer) {
			    	st.oMarkerLayer.clearLayers();
			    	st.oPathLayer.clearLayers();
			    	if(st.oLabelingLayer){
				    	st.oLabelingMarkerLayer.clearLayers();
				    	st.oLabelingPathLayer.clearLayers();
			    	}
			    }
			    if(st.$Input){
			    	st.$Input.val("");
			    }
			},

			// Check if layer has geometry draws
			"fnIsEmpty" : function() {
				return this.__fnIsEmpty();
			},
			"__fnIsEmpty" : function() {
				var st = this._state;
				if (st.oLayer) {
					return st.oMarkerLayer.getLayers().length > 0
					|| st.oPathLayer.getLayers().length > 0;
				}
				return true;
			},

			// Add geometry to layer from WKT parsed coords
			"fnSetGeometryFromWKT" : function(sWkt) {
				this.__fnSetGeometryFromWKTk(sWkt);
			},

			"__fnSetGeometryFromWKT" : function(sWkt) {
				this.fnAddFromFeature({
					geom : sWkt
				}, "0", false);
			},

			// Set geometry value in field input
			"fnSetGeometry" : function(oLeafletLayer, type) {
				this.__fnSetGeometry(oLeafletLayer, type);
			},

			"__fnSetGeometry" : function(oLeafletLayer, type) {
				if (!this.fnIsEmpty() && type != undefined) {
					this.fnClear();
				}
				var st = this._state;
				var sWkt = GvNIX_Map_Leaflet.Util.leafletToWkt(
						oLeafletLayer, st.oMap, st.oCrs);
				if (sWkt != undefined) {
					this.fnAddFromFeature({
						geom : sWkt
					}, "0", false);
				}
				st.$Input.val(sWkt);
			},

			// Add geometry value in field input. This is
			// for multiline and multipolygon because
			// keep the older layers.
			"fnAddGeometry" : function(oLeafletLayer) {
				this.__fnAddGeometry(oLeafletLayer);
			},

			"__fnAddGeometry" : function(oLeafletLayer) {
				var st = this._state;
				var oLayerGroup = L.layerGroup();
				GvNIX_Map_Leaflet.Util.getLayersGroup(st.oDataLayer,
						oLayerGroup);
				oLayerGroup.addLayer(oLeafletLayer);
				this.fnClear();
				var sWkt = GvNIX_Map_Leaflet.Util.leafletToWkt(
						oLayerGroup, st.oMap, st.oCrs);
				this.fnAddFromFeature({
					geom : sWkt
				}, "0", false);
				st.$Input.val(sWkt);
			},

		});

	/**
	 * Layer combination of GvNIX_Map_Leaflet.LAYERS.entity and
	 * GvNIX_Map_Leaflet.LAYERS.entity_field to represent geometry data from a shapefile.
	 * Extends from GvNIX_Map_Leaflet.LAYERS.entity_simple.
	 */
	GvNIX_Map_Leaflet.LAYERS.shape = function(oMap, sId, options) {
		// Santiy check that we are a new instance
		if (!this instanceof GvNIX_Map_Leaflet.LAYERS.shape) {
			alert("Warning: GvNIX_Map_Leaflet Shape layer must be initialised with the keyword 'new'");
		}

		// extends entity and entity_field options
		this._default_options = jQuery.extend({},
				GvNIX_Map_Leaflet.LAYERS.entity_simple.default_options);

		this.s = jQuery.extend({}, this._default_options, options, {
			"pk" : options.layerId,
			"path" : options.layerId,
			"field" : "geom"
		});

		this._state = jQuery.extend({}, GvNIX_Map_Leaflet.LAYERS.entity_simple._state, {
			"sId" : sId, // layer ID
			"oMap" : oMap, // GvNIX_Map_Leaflet instance From entity
			"oCrs" : null, // L.CRS instance of current field
			"oLayer" : null,
			"oSelection" : null, // selection data get from Dtt info
			"oFilterConfig" : null, // filter configuration object (only if filte_type == "auto")
			"oLastRequest" : null, // last data request info (for "not_volatile" layers)
			"oLoadingIcon" : null, // jQuery object of loading-icon DOM element (if any)
			"fOpacity" : null, // Stores current layer opactiy (1.0 max - 0 transparent)
			"sFieldEscaped" : null, // Field name for geometry escaped (if needed)
			"fnRender" : null, // reference to function to call for render a item
			"fnClusterRender" : null, 	 // reference to function to call for render a cluster item
			"fnPrepareInfo" : null, // reference to functio to call for prepara item info
			"oPathStyle" : null, // path options to draw items (if any)
			"oPathStyleSelected" : null, // path options to draw selected items (if any)
			"fnLabeling" : null, // function to function to call for custom simple labeling
			"fnLabelingText" : null, // function to get simple labeling text
			"sLabelingProperty" : null, // item property name to use as labeling text
			"sLabelingText" : null, // String to use as labelingText for all items
			"oLabelingOptions" : null, // labeling options (if any) (http://leafletjs.com/reference.html#divicon-options)
			"bHasLabeling" : false, // true if item should be render with label items (if any)
			"itemById" : {}, // Map of current item of layer by Id (pk)
			"oMarkerLayer": null, // Layer for markers
			"oPathLayer" : null, // Layer for path layers
			"oDataLayer" : null, // Layer for data layers (markers and path)
			"oLabelingLayer": null, // Layer for labeling
			"oLabelingMarkerLayer": null, // Layer for labeling of markers
			"oLabelingPathLayer": null, // Layer for labeling of Path layers
			"aLayerToolsById" : [],
			"file" : this.s.file,// File loaded in input file
			"url" :this.s.url,
			"shapeLoaded" : false, // boolean which indicates if this layer has been loaded from arrayBuffer
			"oUtil" : null
		});

		this.fnSettings = function() {
			return this.s;
		};

		// Constructor
		this._fnConstructor();
	};

	/**
	 * Inherit entity_simple methods
	 */
	GvNIX_Map_Leaflet.LAYERS.shape.prototype = jQuery.extend({},
		GvNIX_Map_Leaflet.LAYERS.entity_simple.prototype,
		{
			/**
			 * Constructor for overriding some options of entity_simple layers
			 */
			"_fnConstructor" : function(){
				// Filling required parameters
				if(!this.s.path){
					this.s.path = this._state.sId;
				}
				if(!this.s.pk){
					this.s.pk = this._state.sId;
				}

				var s = this.s;
				var st = this._state;

				// Call LAYERS.Base constructor
				this.__fnConstructor();

				// Create layer as layer group for data layers
				st.oLayer = L.featureGroup();
				st.oLayer._gvNIX_layer_id = st.sId;
				// save configured index of layer
				st.oLayer._gvNIX_layer_index = this.s.index;

				this.UDtt = GvNIX_Map_Leaflet.Util_dtt;
				this._state.oUtil = GvNIX_Map_Leaflet.Util;

				// [entity]
				// Configure filter and selection objects
				this._fnConstructor_initializeFilter(s,st);

				// [field]
				this._fnConstructor_preareField(s,st);
				this._fnConstructor_prepareRenderAndInfo(s,st);
				this._fnConstructor_prepareStyleOps(s,st);
				this._fnConstructor_prepareCRS(s,st);

				// [field]
				// Create layerGroup layer
				this._fnConstructor_prepareLeafletLayer(s,st);

				// Register on-move and on-zoom listener
				this._fnConstructor_registerMapListener(s,st);
			},

	/**
			 * Overwrite _fnRequestData for loading of data from arrayBuffer
			 */
			"_fnRequestData" : function(){
				if (this._state.shapeLoaded == false && this._state.oCheckbox == true){
					this._fnLoadData();
				}
			},

			/**
			 * Load data for showing the shape layer
			 */
			"_fnLoadData" : function(){
				this._state.oUtil.startWaitMeAnimation();
				if (this._state.file){
					return this._fnLoadDataFromLocalFile();
				}else{
					return this._fnLoadDataFromURL();
				}
			},

			/**
			 * Read data from a local shape zip file and transform it
			 * to an arrayBuffer.
			 */
			"_fnLoadDataFromLocalFile" : function(){
				var st = this._state;
				var reader = new FileReader();
				var shpLayer = this;
	        	reader = new FileReader();
	            reader.onerror = this._fnLoadFileErrorHandler;
	            reader.onload = function(e) {
	            	shpLayer._fnLoadLayerData(reader.result);
	            }
	            reader.readAsArrayBuffer(st.file);
			},

			/**
			 * Read arrayBuffer with geoJSON, create layers and transform them to Wkt format
			 */
			"_fnLoadLayerData" : function(source){
				var st = this._state;
				var shapeLayer = this;
				var featuresCount = 0;
				var shpfile = new L.Shapefile(source, {
	                  onEachFeature: function(feature, layer) {
	                	  var sWkt = shapeLayer.Util.leafletToWkt(
	      						layer, shapeLayer._state.oMap, shapeLayer._state.oCrs);
	                	  if (sWkt != undefined) {
	      					shapeLayer.fnAddFromFeature({
	      						geom : sWkt
	      					}, shapeLayer.s.pk + "_" + featuresCount, false);
	      					featuresCount++;
	      				  }
	                  }
	            });
				shpfile.once("data:loaded", function() {
					st.oDataLayer = shpfile;
					st.oLayer.addLayer(st.oDataLayer);
				st.shapeLoaded = true;
		            st.oUtil.stopWaitMeAnimation();
				});
			},

			/**
			 * Function for loading shapelayer form external URL
			 */
			"_fnLoadDataFromURL" : function(){
				var st = this._state;
				this._fnLoadLayerData(st.url);
			},

			/**
			 * Error handler for shape layer loading
			 */
			"_fnLoadFileErrorHandler" : function(event) {
	            switch(event.target.error.code) {
	              case event.target.error.NOT_FOUND_ERR:
	                alert('File Not Found!');
	                break;
	              case event.target.error.NOT_READABLE_ERR:
	                alert('File is not readable. Zip shapefile required.');
	                break;
	              default:
	                alert('An error occurred reading this file.');
	            };
			},

		});

	/**
	 * Component utils
	 */
	GvNIX_Map_Leaflet.Util = {

		/**
		 * Disable propagation of event 'click'
		 */
		"disableClickPropagation" : function(el) {
			var stop = L.DomEvent.stopPropagation;

			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.on(el, L.Draggable.START[i], stop);
			}

			return L.DomEvent.on(el, 'click', stop).on(el,
				'dblclick', stop);
		},

		/**
		 *
		 */
		"isLeafletMarker" : function(oLeafletLayer) {
			return oLeafletLayer instanceof L.Marker;
		},

		/**
		 * Get recursively layers from layer parameter and put in layergroup
		 *
		 */
		"getLayersGroup" : function(layer, layerGroup) {
			if (layer.getLayers().length > 0) {
				var layers = layer.getLayers();
				for (var i = 0; i < layers.length; i++) {
					if (layers[i] instanceof L.LayerGroup) {
						this.getLayersGroup(layers[i], layerGroup);
					} else {
						layerGroup.addLayer(layers[i]);
					}
				}
			}
		},

		/**
		 * Tranform a L.LatLng coordinates form a crs to another. Uses proj4
		 * function
		 *
		 */
		"transformCRS" : function(sSourceCrsId, sTargetCrsId, latLng) {
			var r = proj4(sSourceCrsId, sTargetCrsId,
					[ latLng.lat, latLng.lng ]);
			return new L.LatLng(r[0], r[1]);
		},

		/**
		 * Generates the WKT string for a L.Polygon, L.Polyline or L.Marker
		 *
		 * @params oLeafletLayer input layer
		 *
		 * @params oMap current map instance
		 *
		 * @params oCrs current map coordinates reference system
		 *
		 * @returns a parseable wkt string with input coords
		 */
		"leafletToWkt" : function(oLeafletLayer, oMap, oCrs) {
			var coords = [];
			var coordsMulti = [];
			var map = oMap.fnGetMapObject();
			var srs = null;
			// Check for given CRS to get maps default if necessary
			if (!oCrs) {
				srs = map.options.crs.code.substring(5, 9);
			} else {
				srs = oCrs;
			}
			// If geometry has two or more points
			if (oLeafletLayer instanceof L.Polygon
					|| oLeafletLayer instanceof L.Polyline) {
				var latlngs = oLeafletLayer.getLatLngs();
				for (var i = 0; i < latlngs.length; i++) {
					var latlng = this.getProjectedPoint(latlngs[i], map);
					coords.push(latlng.lng + " " + latlng.lat);
				}
				// ;
				if (oLeafletLayer instanceof L.Polygon) {
					var firstPoint = this.getProjectedPoint(latlngs[0], map);
					return "SRID=" + srs + ";POLYGON((" + coords.join(",")
							+ "," + firstPoint.lng + " " + firstPoint.lat
							+ "))";
				} else if (oLeafletLayer instanceof L.Polyline) {
					return "SRID=" + srs + ";LINESTRING(" + coords.join(",")
							+ ")";
				}
				// If geometry is a single point
			} else if (oLeafletLayer instanceof L.Marker) {
				var point = oLeafletLayer.getLatLng();
				var projectedPoint = this.getProjectedPoint(point, map);
				return "SRID=" + srs + ";POINT(" + projectedPoint.lng + " "
						+ projectedPoint.lat + ")";
			} else if (oLeafletLayer instanceof L.LayerGroup
					|| oLeafletLayer instanceof L.FeatureGroup) {
				var layers = oLeafletLayer.getLayers();
				// Check if layer is Polyline or Polygon
				var type = null;
				if (oLeafletLayer.feature && oLeafletLayer.feature.geometry) {
					type = oLeafletLayer.feature.geometry.type;
				}
				if (!type){
					// Check if first and last coordinate are equal
					if(layers[0].options.fill == true){
						type = "MultiPolygon";
					}else{
						type = "MultiLineString";
					}
				}
				for (var i = 0; i < layers.length; i++) {
					coords = [];
					var latlngs = layers[i].getLatLngs();
					for (var j = 0; j < latlngs.length; j++) {
						var latlng = this.getProjectedPoint(latlngs[j], map);
						coords.push(latlng.lng + " " + latlng.lat);
					}
					if (type === "MultiPolygon") {
						var firstPoint = this
								.getProjectedPoint(latlngs[0], map);
						coordsMulti.push("(" + coords.join(",") + ","
								+ firstPoint.lng + " " + firstPoint.lat + ")");
					} else {
						coordsMulti.push("(" + coords.join(",") + ")");
					}
				}
				if (type === "MultiPolygon") {
					return "SRID=" + srs + ";POLYGON(" + coordsMulti.join(",")
							+ ")";
				} else {
					return "SRID=" + srs + ";MULTILINESTRING("
					+ coordsMulti.join(",") + ")";
				}
			}
		},

		/**
		 * Transform input coordinates to map's valid coordinate according his
		 * reference system (SRID)
		 *
		 * @param coord
		 *            Input coordinates
		 * @param map
		 *            Current map object
		 *
		 * @return coordinates with valid SRID
		 */
		"getProjectedPoint" : function(coords, oMap) {
			var map = oMap;
			var mapCrs = map.options.crs;
			var mapProj = mapCrs.projection;
			var transform = null;
			if (mapProj && mapCrs.code != "EPSG:4326") {
				transform = function(latLng) {
					// Get coordinates in Pixel
					var point = mapCrs.latLngToPoint(latLng, map.getZoom());
					// Get real world coordinates using Register CRS
					var projectedPoint = mapCrs.project(map.unproject(point));

					// Transform the point to a LatLong instance
					return L.latLng(projectedPoint.y, projectedPoint.x);
				};
			}
			if (!transform) {
				// No transform needed: do nothing
				return coords;
			}

			return transform(coords);
		},

		/**
		 * Gets a function by name
		 *
		 * @param sfnName
		 *            function name
		 * @param fnDebug
		 *            (optional) debug function to call when a problem found
		 *
		 * @returns function instance or null
		 */
		"getFunctionByName" : function(sfnName, fnDebug) {
			var fn = window[sfnName];
			if (!fn) {
				if (fnDebug) {
					fnDebug("ERROR: function '" + sfnName + "' not found");
					return null;
				}
			} else if (typeof fn != "function") {
				if (fnDebug) {
					fnDebug("ERROR: function '" + sfnName + "' not found");
					return null;
				}
			}
			return fn;
		},

		/**
		 * Parse a JSON string from option.
		 */
		"parseJSONOption" : function(sJson) {
			sJson = sJson.replace(/\'/g, '"');
			return jQuery.parseJSON(sJson);
		},

		/**
		 * Transform a L.LatLngBound to a string
		 */
		"formatBBoxToString" : function formatBBoxToString(oBBox) {
			// Getting points
			var northWest = oBBox.getNorthWest().lng + " "
					+ oBBox.getNorthWest().lat;
			var northEast = oBBox.getNorthEast().lng + " "
					+ oBBox.getNorthEast().lat;
			var southEast = oBBox.getSouthEast().lng + " "
					+ oBBox.getSouthEast().lat;
			var southWest = oBBox.getSouthWest().lng + " "
					+ oBBox.getSouthWest().lat;

			// Construct points
			var points = northWest + ", " + northEast + ", " + southEast + ", "
					+ southWest + ", " + northWest;

			return points;
		},

		/**
		 * Transfor a L.LatLngBound to a string
		 */
		"BBoxToWKT" : function BBoxToWKT(oBBox, sSrid) {
			var wkt = "";
			if (!sSrid && oBBox.crs) {
				sSrid = oBBox.crs.code;
			}
			if (sSrid) {
				if (sSrid.indexOf("EPSG:") == 0) {
					sSrid = sSrid.substring("EPSG:".length);
				}
				wkt = "SRID=" + sSrid + ";";
			}
			wkt += "POLYGON (("
					+ GvNIX_Map_Leaflet.Util.formatBBoxToString(oBBox) + "))";
			return wkt;
		},

		/**
		 * Generates a L.LatLng from a string with pattern "0.0,0.0" an Array of
		 * 2 elements or a L.LatLng instance (return itself). Return null if it
		 * can't convert oObject.
		 */
		"toLantLngObject" : function toLantLngObject(oObject) {
			if (!oObject) {
				return null;
			}
			if (oObject instanceof L.LatLng) {
				return oObject;
			}
			var splited = null;
			if (typeof oObject === "string") {
				splited = oObject.split(",");
			} else if (oObject instanceof Array) {
				splited = oObject;
			}
			if (splited.length == 2) {
				return L.latLng(parseFloat(splited[0]), parseFloat(splited[1]));
			}
			return null;
		},

		/**
		 * Create an html string with information about item to show on info
		 * popup.
		 *
		 * @param oMap
		 *            GvNIX_Map_Leaflet instance
		 * @param sLayerId
		 *            layer id string
		 * @param sEntityPath
		 *            url base for entity
		 * @param sGeoFieldName
		 *            geometry field name which requires layer info
		 * @param sFeaturePkValue
		 *            pk of current item
		 * @param oFeature
		 *            all feature values
		 * @param oFeatureLayer
		 *            L.ILayer whicht represent the feature
		 * @param bSelected
		 *            item is selected or not
		 * @param bShowButton
		 *            (optional) default true add edit button
		 * @param bEditButton
		 *            (optional) default true add edit button
		 * @param sAdditionalActions
		 *            (optional) html string to add into action div
		 */
		"createLayerInfoString" : function createLayerInfoString(oMap,
				sLayerId, sEntityPath, sGeoFieldName, sFeaturePKValue,
				oFeature, oFeatureLayer, bSelected, bShowButton, bEditButton,
				sAdditionalActions) {
			var info = "";
			for ( var sFieldName in oFeature) {
				if (isNaN(sFieldName) && sFieldName !== "DT_RowId"
						&& sFieldName != sGeoFieldName) {
					info += "<b>" + sFieldName + ":</b> "
							+ oFeature[sFieldName] + "<br/>";
				}
			}
			bShowButton = bShowButton != false && bShowButton != 'false';
			bEditButton = bEditButton != false && bEditButton != 'false';
			if (bShowButton || bEditButton || sAdditionalActions) {
				info += "<div style='text-align:right;'>"
				if (bShowButton) {
					// Adding show button
					info += "<a class='icon show_entity' target='_blank' href='"
							+ sEntityPath + "/" + sFeaturePKValue + "'></a>";
				}
				if (bShowButton) {
					// Adding Edit button
					info += "<a class='icon update_entity' target='_blank' href='"
							+ sEntityPath
							+ "/"
							+ sFeaturePKValue
							+ "?form'></a>";
				}
				if (sAdditionalActions) {
					info += sAdditionalActions;
				}
				info += "</div>";
			}
			return info;
		},

		/**
		 * Creates a cluster icon for a layer
		 */
		"createClusterIconForLayer" : function createClusterIconForLayer(
				cluster) {
			var childCount = cluster.getChildCount();
			// Modifying object of
			// child markers
			var markerChilds = cluster.getAllChildMarkers();
			if (markerChilds.length > 0) {
				var child = markerChilds[0];
				var currentIcon = child.options.icon;
				var groupIcon = L.AwesomeMarkers.icon({
					icon : currentIcon.options.icon,
					prefix : currentIcon.options.prefix,
					groupedMarkers : childCount,
					markerColor : currentIcon.options.markerColor,
					iconColor : currentIcon.options.iconColor
				});
				return groupIcon;
			}
		},

		/**
		 * Creates a DivIcon for a clustered labels with display none (as
		 * cluster will be of the markers)
		 *
		 * @return L.DivIcon instance empty an with display none
		 */
		"createEmptyClusterIcon" : function createEmptyClusterIcon() {
			return new L.DivIcon({ html: '&nbsp;', className: 'mapviewer_layers_labeling_hide'});
		},

		/**
		 * Formats wkt geometry to works correctly on omnivore plugin
		 */
		'formatWkt' : function formatWkt(sWkt) {
			if (sWkt) {
				return sWkt.replace("( ", "(").replace(" )", ")");
			}
			return null;
		},

		/**
		 * Returns a hashcode from a string.
		 *
		 * @param str
		 *            String to transform
		 * @return String
		 */
		"getHashCode" : function getHashCode(str) {
			var hash = 0;
			if (str.length == 0)
				return hash;
			for (var i = 0; i < str.length; i++) {
				char = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash.toString();
		},

		/**
		 * Parses WKT string to generate/load Leaflet layer
		 *
		 * @param sWkt
		 *            string to parse
		 * @param (optional)
		 *            L.GeoJSON layer where load the result geometries (default
		 *            a new L.Proj.GeoJSON instance)
		 */
		"parseWkt" : function(sWkt, oLayer) {
			sWkt = GvNIX_Map_Leaflet.Util.formatWkt(sWkt);
			if (sWkt) {
				var bNewLayer=false;
				if (oLayer) {
					return omnivore.wkt.parse(sWkt, {}, oLayer);
				} else {
					oLayer = L.Proj.geoJson();
					var result = omnivore.wkt.parse(sWkt, {}, oLayer);
					if (!result || !result.getLayers() ) {
						return null;
					} else {
						return result.getLayers()[0];
					}
				}
			}
			return null;
		},

		/**
		 * Check if a new object is equal than the current one
		 */
		"equalsObjects" : function(oFirst, oSecond) {
			if (oFirst == oSecond) {
				return true;
			}
			var sPrev = JSON.stringify(oFirst);
			var sNew = JSON.stringify(oSecond);
			if (sPrev.length != sNew.length) {
				return false;
			}
			return sPrev == sNew;
		},

		/**
		 * Return the Bbox of the geometry.
		 *
		 * @param wktGeom
		 *            Geometry in WKT format to extract bbox
		 *
		 */
		"getBboxFromGeometry" : function(wktGeom) {
			var oGeomLayer = this.parseWkt(wktGeom);
			if (oGeomLayer) {
				var bbox = oGeomLayer.getBounds();
				return bbox;
			}
			return;
		},

		/**
		 * Function to start a wait animation
		 * that blocks html body
		 */
		"startWaitMeAnimation" : function(waitText) {
			if(waitText == null){
				waitText = "Please wait...";
			}
			jQuery("body").waitMe({
				effect: "ios",
				text: waitText,
				bg: 'rgba(255,255,255,0.7)',
				color:'#000',
				sizeW:'',
				sizeH:''
			});
		},

		/**
		 * Function to stop a wait animation
		 * that blocks html body
		 */
		"stopWaitMeAnimation" : function() {
			jQuery("body").waitMe('hide');
		},

		/**
		 * Create html list from json object or string that represents
		 * a json object
		 */
		"JSONToHtml" : function (json){
			var html = "";
			// if is an array, iterate over it
			if((json instanceof Array) == true){
				for(i = 0; i < json.length; i++){
					html += this.JSONToHtml(json[i]);
				}
			}else{
				var oJson = json;
				// if isn't an object, transform on it
				if((json instanceof Object) == false){
					oJson = jQuery.parseJSON(json);
				}
				var htmlChildren = "";
				for (key in oJson) {
					var value = oJson[key];
					var label = key;
					var htmlValue = "";
					if(value instanceof Object || value instanceof Array){
						htmlValue += this.JSONToHtml(value);
					}else{
						htmlValue += value;
					}
					// if don't have value, don't show it
					if(htmlValue != null && htmlValue != "null" && htmlValue !== ""){
						htmlChildren += "<dt>"+label+"</dt>";
						htmlChildren += "<dd>"+htmlValue+"</dd>";
					}
				}
				// if don't have value, don't show it
				if(htmlChildren != null && htmlChildren != "null" && htmlChildren !== ""){
					html += "<dl class='dl-horizontal'>";
					html += htmlChildren;
					html +="</dl>";
				}
			}
			return html;
		},
	}; // GvNIX_Map_Leaflet.Util

	/**
	 * Utilities related to Datatables
	 */
	GvNIX_Map_Leaflet.Util_dtt = {

		"escapeFieldForRequest" : function escapeFieldForRequest(fieldName) {
			return fieldName.replace(/[.]/g, '_~~_');
		},

		"unescapeFieldForRequest" : function unescapeFieldForRequest(fieldName) {
			return fieldName.replace(/_~~_/g, '.');
		},

		/**
		 * Check if a item is selected based on gvNIX Datatables selection info
		 *
		 * @param sPk
		 *            of item to check
		 * @param oSelectionConfig
		 *            selection config from Datatables
		 *
		 * @returns true if item is selected
		 */
		"isEntityItemSelected" : function isEntityItemSelected(sPk,
				oSelectionConfig) {
			oSelectionConfig = JSON.parse(oSelectionConfig);
			if (oSelectionConfig) {
				if (oSelectionConfig.all) {
					return true;
				} else {
					if (oSelectionConfig.idList) {
						for (var i = 0; i < oSelectionConfig.idList.length; i++) {
							if (oSelectionConfig.idList[i] === sPk) {
								return oSelectionConfig.idListSelected;
							}
						}
						return !oSelectionConfig.idListSelected;
					}
					return false;
				}
			}
			return false;
		},

		/**
		 * Check if gvNIX Datatables selection has been changed
		 *
		 * @params oPrevData previous selection configuration
		 * @params oNewData new selection configuration
		 *
		 * @returns true if selection config has been changed
		 */
		"isEntitySelectionChanged" : function(oPrevData, oNewData) {
			if (!oNewData && !oPrevData) {
				// No changes: nothing to do
				return false;
			} else if (!oNewData || !oPrevData) {
				return true;
			} else {
				if (oPrevData.all != oNewData.all) {
					return true;
				} else if (oPrevData.idListSelected != oNewData.idListSelected) {
					return true;
				} else if (oPrevData.idList != null
						&& oPrevData.idList.length != oNewData.idList.length) {
					return true;
				}
				return GvNIX_Map_Leaflet.Util.equalsObjects(oPrevData.idList,
						oNewData.idList);
			}
		},

		/**
		 * Check if Datatables filter configuration has been changed
		 *
		 * @param oPrevious
		 *            previous datatables config
		 * @param oCurrent
		 *            current datatables config
		 *
		 * @returns true if config has been changed
		 */
		"isFilterChanged" : function(oPrevious, oCurrent) {
			// Checks the simplest check
			if (!oPrevious && !oCurrent) {
				return false;
			} else if (!oPrevious || !oCurrent) {
				return true;
			}

			// Check boolean checked
			if (oPrevious.bFitered != oCurrent.bFiltered) {
				return true;
			}

			// Gets array of parameters
			var aoPreviousData = oPrevious.aoData;
			var aoCurrentData = oCurrent.aoData;

			// check simplest check of arrays
			if (!aoPreviousData && !aoCurrentData) {
				return false;
			} else if (!aoPreviousData || !aoCurrentData) {
				return true;
			}
			if (aoPreviousData.length != aoCurrentData.length) {
				return true;
			}

			// Compare json string of arrays
			var sPreviousData = jQuery.toJSON(aoPreviousData);
			var sCurrentData = jQuery.toJSON(aoCurrentData);
			if (sPreviousData.length != sCurrentData.length) {
				return true;
			} else {
				return sPreviousData != sCurrentData;
			}
		},

		/**
		 * Function to add field columns on oSettings columns object
		 *
		 * @param layer
		 * @param oSettings
		 */
		"addColumnsToDataRequest" : function addAdditionalColumns(
				aExtraColumns, oSettings) {
			var extraColumnsPos = 0;
			if (oSettings.aoColumns) {
				extraColumnsPos = oSettings.aoColumns.length;
			} else {
				oSettings.aoColumns = [];
				oSettings.aoPreSearchCols = [];
			}
			for (i in aExtraColumns) {
				var exists = false;

				var fieldName = GvNIX_Map_Leaflet.Util_dtt
						.escapeFieldForRequest(aExtraColumns[i]);

				for (x in oSettings.aoColumns) {
					var column = oSettings.aoColumns[x];
					var columnName = column.mData;

					if (columnName == fieldName) {
						exists = true;
						break;
					}
				}

				// If not exists, create column element and add
				if (!exists) {
					var newColumn = {
						"sName" : fieldName,
						"_bAutoType" : true,
						"aDataSort" : [ extraColumnsPos ],
						"asSorting" : [ "asc", "desc" ],
						"bSearchable" : false,
						"bSortable" : true,
						"bUseRendered" : true,
						"bVisible" : true,
						"fnCreatedCell" : null,
						"fnRender" : null,
						"iDataSort" : -1,
						"mData" : fieldName,
						"mRender" : null,
						"nTf" : null
					};

					var newPreSearchColumn = {
						"bCaseSensitive" : true,
						"bRegex" : false,
						"bSmart" : true,
						"sSearch" : ""
					};
					oSettings.aoColumns.push(newColumn);
					oSettings.aoPreSearchCols.push(newPreSearchColumn);
					extraColumnsPos++;
				}

			}
		},

		/**
		 * Create (extends) the ajax parameters to get layer data for a
		 * Datatable request with required filter
		 *
		 * @param oSettings
		 *            current datatables settings
		 * @param sBBox
		 *            current map BBox in string format
		 * @param aGeoColumns
		 *            required geometri columns to include in requested fields
		 *
		 * @returns object array with parameters for server POST request
		 */
		"getAjaxParamters" : function(oSettings, sBBox, aGeoColumns) {
			var iColumns = oSettings.aoColumns.length;
			var aoData = [], mDataProp, aaSort, aDataSort;
			var i, j;

			if (oSettings.iDraw) {
				aoData.push({
					"name" : "sEcho",
					"value" : oSettings.iDraw
				});
			}

			aoData.push({
				"name" : "iColumns",
				"value" : iColumns
			});

			for ( var i in oSettings.aoColumns) {
				var oColumn = oSettings.aoColumns[i];
				mDataProp = oColumn.mData;
				aoData.push({
					"name" : "mDataProp_" + i,
					"value" : typeof (mDataProp) === "function" ? 'function'
							: mDataProp
				});
				aoData.push({
					"name" : "bSearchable_" + i,
					"value" : oColumn.bSearchable ? true : false
				});
				if (oColumn.sSearch) {
					aoData.push({
						"name" : "bSearchable_" + i,
						"value" : oColumn.sSearch
					});
				}

			}

			/* Filtering */
			if (oSettings.oFeatures && oSettings.oFeatures.bFilter === true) {
				aoData.push({
					"name" : "sSearch",
					"value" : oSettings.oPreviousSearch.sSearch
				});
				aoData.push({
					"name" : "bRegex",
					"value" : oSettings.oPreviousSearch.bRegex
				});
				for ( var i in iColumns) {
					aoData.push({
						"name" : "sSearch_" + i,
						"value" : oSettings.aoPreSearchCols[i].sSearch
					});
					aoData.push({
						"name" : "bRegex_" + i,
						"value" : oSettings.aoPreSearchCols[i].bRegex
					});
					aoData.push({
						"name" : "bSearchable_" + i,
						"value" : oSettings.aoColumns[i].bSearchable
					});
				}
			}

			/* Sorting */
			if (oSettings.oFeatures && oSettings.oFeatures.bSort === true) {
				var iCounter = 0;

				aaSort = (oSettings.aaSortingFixed !== null) ? oSettings.aaSortingFixed
						.concat(oSettings.aaSorting)
						: oSettings.aaSorting.slice();

				for ( var i in aaSort) {
					aDataSort = oSettings.aoColumns[aaSort[i][0]].aDataSort;

					for (j = 0; j < aDataSort.length; j++) {
						aoData.push({
							"name" : "iSortCol_" + iCounter,
							"value" : aDataSort[j]
						});
						aoData.push({
							"name" : "sSortDir_" + iCounter,
							"value" : aaSort[i][1]
						});
						iCounter++;
					}
				}
				aoData.push({
					"name" : "iSortingCols",
					"value" : iCounter
				});

				for ( var i in iColumns) {
					aoData.push({
						"name" : "bSortable_" + i,
						"value" : oSettings.aoColumns[i].bSortable
					});
				}
			}

			// Sending boundingBox
			aoData.push({
				"name" : "dtt_bbox",
				"value" : sBBox
			});
			// Sending geo fields to display
			aoData.push({
				"name" : "dtt_bbox_fields",
				"value" : aGeoColumns
			});
			return aoData;
		},

		/**
		 * Get the column ordering that DataTables expects
		 *
		 * @param {object}
		 *            oSettings dataTables settings object
		 * @returns {string} comma separated list of names
		 * @memberof DataTable#oApi
		 */
		"getColumnOrdering" : function columnOrdering(oSettings) {
			var sNames = '';
			for (var i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
				sNames += oSettings.aoColumns[i].sName + ',';
			}
			if (sNames.length == iLen) {
				return "";
			}
			return sNames.slice(0, -1);
		}
	}; // GvNIX_Map_Leaflet.Util_dtt

})(jQuery, window, document);

/*******************************************************************************
 * STATIC METHODS
 ******************************************************************************/

function toInt(value) {
	if (!value) {
		if (value === 0) {
			return 0;
		} else {
			return null;
		}
	} else if (typeof value == "string") {
		return parseInt(value);
	} else if (typeof value == "number") {
		return value;
	} else {
		return null;
	}
}

function toFloat(value) {
	if (!value) {
		if (value === 0) {
			return 0;
		} else {
			return null;
		}
	} else if (typeof value == "string") {
		return parseFloat(value);
	} else if (typeof value == "number") {
		return value;
	} else {
		return null;
	}
}

function toBool(value) {
	if (!value) {
		if (value === 0) {
			return false;
		} else {
			return null;
		}
	} else if (typeof value == "string") {
		return value === 'true';
	} else if (typeof value == "number") {
		return value !== 0;
	} else {
		return null;
	}
}

/**
 * Sets option if exist in origin
 *
 * @param oOrigin
 *            object
 * @param sOriginName
 *            object property
 * @param oTarget
 *            object
 * @param sTargetName
 *            object property to set (optional, if not set use sOriginName)
 * @param fnTransformFunction
 *            function to call to tranform value before store on
 *            oTarget.sTargetName
 *
 */
function setOption(oOrigin, sOriginName, oTarget, sTargetName, defValue,
		fnTransformFunction) {
	var value = oOrigin[sOriginName];
	if (!value && value !== false) {
		if (typeof defValue != 'undefined' && defValue != null) {
			value = defValue;
		} else {
			return;
		}
	}
	if (typeof fnTransformFunction == 'function') {
		value = fnTransformFunction(value);
	}
	if (!sTargetName) {
		sTargetName = sOriginName;
	}
	oTarget[sTargetName] = value;
}

// Generating addEvent function
var addEvent = (function() {
	if (document.addEventListener) {
		return function(el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.addEventListener(type, fn, false);
			} else if (el && el.length) {
				for (var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	} else {
		return function(el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.attachEvent('on' + type, function() {
					return fn.call(el, window.event);
				});
			} else if (el && el.length) {
				for (var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	}
})();

// Registering events
fnRegisterFunctionsToCallBack(function(context) {
	jQuery(".mapviewer_control", context).each(function(index) {
		var $mapNode = jQuery(this);
		var map = new GvNIX_Map_Leaflet($mapNode);

	});
});
