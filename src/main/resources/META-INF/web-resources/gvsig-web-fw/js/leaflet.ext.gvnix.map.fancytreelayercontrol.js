/**
 * Custom configuration for fancyTree instances
*/
// Creates or gets an existing instance of jstree and change default config only for instance created
L.Control.FancytreeLayers = L.Control.extend({

  "options" : {
    collapsed: true,
    position: 'topleft',
    autoZIndex: true
  },

  "initialize" : function (options) {
	  this._html = "";
	  this._lastZIndex = 0;
	  this._handlingClick = false;

	  this._options = jQuery.extend({}, this.options, options);
  },

  "onAdd" : function (map) {
    this._initLayout();

    map
        .on('layeradd', this._onLayerChange, this)
        .on('layerremove', this._onLayerChange, this);

    // Adding checkbox listener
	this._fnAddSelectEvent(this._options.gvNIXMap);

	// Adding selection listener
	this._fnAddFocusEvent(this._options.gvNIXMap);

	// Adding listener for changing node's CSS on expand and collapse parent
	this._fnAddExpandEvent();
	this._fnAddCollapseEvent();

    this._expand();

	this.toolsLayersCallbacks = jQuery.Callbacks();

    return this._container;
  },

  "onRemove" : function (map) {
    map
        .off('layeradd', this._onLayerChange)
        .off('layerremove', this._onLayerChange);

    // UNBIND TOC EVENTS
  },

  /**
   * Create container for TOC with collapse button and layers
   */
  "_initLayout" : function (tocDiv) {
    var className = 'leaflet-control-layers',
    container = this._container = L.DomUtil.create('div', className);
    container.id = "toc_container";
    //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    if (!L.Browser.touch) {
      GvNIX_Map_Leaflet.Util.disableClickPropagation(container);
      L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    }

    var form = this._form = L.DomUtil.create('div', className + '-list');
    form.id = "toc_container_fancytree";
    container.appendChild(form);

    // Generate div for fancytree instance, which will contain layers
    var fancytreeDiv = this._fancytreeDiv = L.DomUtil.create('div', 'fancytreeDiv', form);
    var treeUl = L.DomUtil.create('ul');
    treeUl.setAttribute('style', 'display:none;');
    fancytreeDiv.appendChild(treeUl);

    if(this._options.displayLegend){
     	// Create legend container
        var legendContainer = this._legendContainer = L.DomUtil.create('div', className + '-legend');
        legendContainer.id = "toc_container_legend";
        container.appendChild(legendContainer);

        // create the tabs
        var listTabs = "<ul class="+className+"-tabs>";

        // icons from http://www.webhostinghub.com/glyphs/
        listTabs += "<li><a href='#toc_container_fancytree' class='icon-layers'></a></li>";
        if(this._options.displayLegend){
        	listTabs += "<li><a href='#toc_container_legend' class='icon-tags'><div></div></a></li>";
        }
        listTabs += "</ul>";
        jQuery(container).prepend(listTabs);
        jQuery(container).tabs();
        jQuery(container).on( "tabsactivate", function( event, ui ){resizeMap();});
    }

    // Instantiate fancytree with created div inside form
    this._fnMakeFancytree(fancytreeDiv);



    // Generating collapse button
    this._button = L.DomUtil.create("div", className + '-collapse-button '+
    		className+ '-button icon-backward', container);
    jQuery(this._button).html(" ");
    L.DomEvent.on(this._button, 'click', this._collapse, this);
  },

  /**
   * Get object legend container
   */
  "fnGetLegendContainer" : function(){
	  return jQuery(this._legendContainer);
  },

  /**
   * Append HTML content to container form, which will contain layers
   *
   * @param html
   * 	content which append to form
   */
  "_setHtmlContent" : function (html) {
	  this._html = html;
	  jQuery(this._form).html(html);
  },

  "_onLayerChange" : function(e) {
	  // TODO: Implement onLayer change
  },

  /**
   * Expand TOC control
   */
  "_expand" : function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
  },

  /**
   * Collapse TOC control
   */
  "_collapse" : function () {
	  var button = jQuery(this._button);
	  if(button.data("function") == undefined || button.data("function") == "" || button.data("function") == "collapse"){
		  jQuery(this._container).animate({left: "-100%"}, function(){
			  button.data("function", "expand");
			  var buttonClass = button.attr("class");
			  button.attr("class", buttonClass.replace("icon-backward", "icon-forward"));
		  });
	  }else{
		  jQuery(this._container).animate({left: "0%"}, function(){
			  button.data("function", "collapse");
			  var buttonClass = button.attr("class");
			  button.attr("class", buttonClass.replace("icon-forward", "icon-backward"));
		  });
	  }
  },

  // Functions related to fancytree

/**
 * Returns the options from fancytree instance
 *
 * @returns fancyOptions
 */
"_fnGetFancytree" : function(){
	var aExtensions = [];
	var map = this._options.gvNIXMap;
	// Add Drag and Drop extension if required
	if(this._options.dnd){
		aExtensions.push("dnd");
		var dragAndDrop = this._fnInitializeDragAndDrop();
	}

	var fancyOptions = {
		"extensions" : aExtensions,
		"aria" : true, // Enable WAI-ARIA (Accessible Rich
						// Internet
						// Applications Suite) support.
		"checkbox" : this._options.checkbox, // Display node checkbox.
		"selectMode" : 3, // 1:single, 2:multi, 3:multi-hier.
		"renderNode" : jQuery.proxy(this._fnRenderNode, this),
		"dnd" : dragAndDrop
	};
		// Return fancytree options
	return fancyOptions
},


/**
 * Instanciate fancytree from toc div
 *
 * @param tocDiv
 *            div for instantiate TOC with fancytree
 *
 * @return fancytree instance
 */
"_fnMakeFancytree" : function(tocDiv) {
	this._fancytree = jQuery(tocDiv).fancytree(this._fnGetFancytree());
	return this._fancytree;
},

/**
 * Set the configuration and events for Drag And Drop extension
 */
"_fnInitializeDragAndDrop" : function(){
	// Check if option is enabled
		return {
			// Drag And Drop options:
			autoExpandMS : 0, // Expand nodes after n milliseconds
			// of hovering
			preventRecursiveMoves : true, // Prevent dropping
			// nodes on own
			// descendants
			preventVoidMoves : true, // Prevent dropping nodes
			// 'before self', etc.
			smartRevert : true, // set draggable.revert if
			// drop was rejected

			// Callbacks
			dragStart : jQuery.proxy(this._fnDragStart, this), 	// Enable
																// dragging
																// for
																// the
																// tree.
																// Return
																// false
																// to
																// cancel
																// dragging
																// of
																// node

			dragEnter : jQuery.proxy(this._fnDragEnter, this), 	// Enable
																// dropping
																// node.
																// Return
																// false
																// to
																// disallow
																// dropping
																// on
																// node.

			dragDrop : jQuery.proxy(this._fnDragDrop, this), 	// Action
																// when
																// node
																// is
																// dropped.
	}
},

/**
 * Enable dragging a toc layer element. Return false to cancel
 * dragging.
 *
 * @param node
 *            Dragged node object
 * @param data
 *            Tree status before start dragging
 * @return true if operation allowed
 */
"_fnDragStart" : function(node) {
	return true;
},


/**
 * Return available positions to drop the dragged element Return
 * false to disallow dropping a dragged element
 *
 * @param node
 *            Dragged node object
 * @param data
 *            Tree status before start dragging
 *
 * @return false if dropping is not available
 */
"_fnDragEnter" : function(node, data) {
	// Allow dragging only between siblings
	if(node.parent !== data.otherNode.parent){
		return false;
	}
     return ["before", "after"];
},

/**
 * Function that will be called when an item is dropped
 * on the tree
 *
 * @param node
 *            Previous node that exists on the new position
 *            to move.
 * @param data
 *            Tree status before start dragging. This var
 *            contains the dragged node.
 */
"_fnDragDrop" : function(node, data) {
	// Delegates on method _fnMoveLayer getting layer id, referenced layer id,
	// hit mode ("after", "before") and true to be able to save current position
	// on localStorage
	this._fnMoveLayer(data.otherNode.key, node.key, data.hitMode, true);


},

/**
 * Function that changes the position of a layer on TOC tree and
 * delegates on current map to update index positions of current
 * layers following new TOC positions.
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
 * Function that changes the position of a layer on TOC tree and
 * delegates on current map to update index positions of current
 * layers following new TOC positions.
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
	if(sHitMode == undefined || sHitMode == null || sHitMode == ""){
		sHitMode = "before";
	}else if(sHitMode != "before" && sHitMode != "after"){
		console.log("ERROR: sHit mode only support 'after' and 'before' values");
		return;
	}

	// Getting current toc
	var toc = this.fnGetTocTree();

	// Getting current layers Nodes
	var aNodes = this._options.gvNIXMap.fnGetTocLayersNodes();

	var referencedNode = toc.getNodeByKey(sReferencedLayerId);
	var oldPositionNode = toc.getNodeByKey(sLayerId);

	// Checks that nodes exists
	if(!referencedNode || !oldPositionNode){
		console.log("ERROR: You are trying to move an undefined layer");
		return;
	}


	// Checks that nodes only moves on the same parent
	if(referencedNode.getParent() != oldPositionNode.getParent()){
		console.log("ERROR: You are trying to move a layer out of its parent.");
		return;
	}

	var newPositionNode;
	if(sHitMode == "after") {
		newPositionNode = referencedNode.getNextSibling();
		if(newPositionNode == null) {
			newPositionNode = referencedNode;
		} else {
			sHitMode = "before";
		}

	}else{
		newPositionNode = referencedNode.getPrevSibling();
		if(newPositionNode == null) {
			newPositionNode = referencedNode;
		} else {
			sHitMode = "after";
		}
	}

	// Moving layer on TOC
	oldPositionNode.moveTo(newPositionNode, sHitMode);

	// Getting new ordered layers
	var aLayers = this._options.gvNIXMap.fnGetTocLayersIds();

	// Update index of current layer on map. Delegates on map component to
	// do this operation.
	this._options.gvNIXMap._fnUpdateLayersIndex(aLayers, bSaveOnLocalStorage);
	// recreate the legend
	this._options.gvNIXMap.fnRecreateLegend();

 },

/*
 * Add the span that contains the tools
 */
"_fnRenderNode" : function(event, data){
	var node = data.node;
	var $span = jQuery(node.span);
	var spanTools = jQuery("#" + node.key + "_span-tools");
	jQuery(spanTools).prependTo($span);

},

  /**
   * Return layer node by its id
   *
   * @param sId
   *      layer unique ID
   *
   * @return node which represents a layer in TOC
   */
  "fnGetLayerNodeById": function (sId) {
     return this._getTocTree().getNodeByKey(sId);
  },

  /**
   * Return the root node
   *
   * @return root node of fancytree TOC
   */
  "fnGetRootNode" : function () {
     return this._getTocTree().getRootNode();
  },

  /**
   * Get fancytree widget
   *
   * @return fancytree widget from fancytree instance, which holds fancytree API methods
   */
  "fnGetTocTree": function () {
	  return this._fancytree.fancytree("getTree");
  },

  /**
   * Adding checkbox listener
   * @param treeInstance fancytree instance created for TOC
   * @param map instance of Leaflet map
   */
  "_fnAddSelectEvent" : function(map) {
		this._fancytree.bind("fancytreeselect", function(event, data) {
			var tocLayerId = data.node.key;
			var tocLayer = map.fnGetLayerById(tocLayerId);
			if(!tocLayer){
				return;
			}

			if (tocLayer.s.allow_disable) {

				// Behavior for selected nodes
				if (data.node.isSelected()) {

					// Make layer visible
					tocLayer.fnShow(true);

					//change li background
					var $element = jQuery("#" + tocLayerId);
					var $liElement = $element.closest("li");
					if($liElement && $liElement !== undefined && $liElement.length > 0){
						var oldClasses = $liElement.attr('class');
						var newClasses = oldClasses.concat(" ").concat("layerInToc");
						$liElement.addClass(newClasses);
					}

					// Request entity_simple data to the server
					if (tocLayer.s.layer_type == "entity_simple" || tocLayer.s.layer_type == "entity" || tocLayer.s.layer_type == "shape"){
						tocLayer._fnRequestData();
					}

					// Make all parents visible
					data.node.visitParents(function(parentNode) {
						var parentLayer = map
								.fnGetLayerById(parentNode.key);
						if (parentLayer) {
							parentLayer.fnShow(false);
							if (parentLayer.s.layer_type == "entity"){
								parentLayer._fnRequestData();
							}
						}
					});

					// Make all children visible
					data.node.visit(function(childNode) {
						var childLayer = map
								.fnGetLayerById(childNode.key);
						childLayer.fnShow(true);
					})

				// Behavior for unselected nodes
				} else {

					// Make layer invisible
					tocLayer.fnHide(true);

					//change li background
					var $element = jQuery("#" + tocLayerId);
					var $liElement = $element.closest("li");
					if($liElement && $liElement !== undefined && $liElement.length > 0){
						$liElement.removeClass("layerInToc");
					}

					// Make all children invisible
					data.node.visit(function(childNode) {
						var childLayer = map
								.fnGetLayerById(childNode.key);
						childLayer.fnHide(true);
					})

					// Check if any sibling node is selected
					var siblingSelected = false;
					var siblingNode = data.node.getNextSibling();
					while (siblingNode != null) {
						if (siblingNode.isSelected()) {
							siblingSelected = true;
							break;
						}
						siblingNode = siblingNode.getNextSibling();
					}
					siblingNode = data.node.getPrevSibling();
					while (siblingNode != null) {
						if (siblingNode.isSelected()) {
							siblingSelected = true;
							break;
						}
						siblingNode = siblingNode.getPrevSibling();
					}
					// If all sibilings are unselected, make invisible
					// parent layers
					if (siblingSelected == false) {
						data.node.visitParents(function(parentNode) {
							var children = parentNode.getChildren();
							var childSelected = false;
							for(i in children){
								var child = children[i];
								if(child.isSelected()){
									childSelected = true;
									break;
								}
							}
							if(childSelected == false){
								var parentLayer = map
										.fnGetLayerById(parentNode.key);
								if (parentLayer != undefined) {
									parentLayer.fnHide(true);
								}
							}
						});
					}
				}
			}

            // Reload a WMS layer according to its children
			if (tocLayer.s.layer_type == "wms_child") {
				tocLayer._fnOnCheckChanged();
			} else if (tocLayer.s.layer_type == "wms") {
				// Initialize all layers from WMS
   			    tocLayer._fnInitializeWmsLayer();
			}

			// recreate the legend
			map.fnRecreateLegend();
		});
	},

	/**
	 * Adding single layer selection listener
	 *
	 * @param treeInstance
	 * @param map
	 *
	 * @return selected layer object
	 */
	"_fnAddFocusEvent" : function(map) {
		this._fancytree.bind("fancytreefocus", function(event, data) {
			var tree = data.tree;
			var node = data.node;
			var nodeId = node.key;
			tree.activateKey(nodeId);
			var tocLayer = map.fnGetLayerById(nodeId);

			// Fire all tools layers callbacks
			map.s.toolsLayersCallbacks.fire(tocLayer);

			// Save current active layer
			map._data.oActiveLayer = tocLayer;

			// Saving current active layer on localStorage
			var localStorageKey = "current_active_layer";

			// Saving active layer status on current map instance
			map._fnSaveMapStatus(localStorageKey, tocLayer._state.sId);

			tocLayer.fnActiveLayerChanged(node.isActive());
		});
	},

	/**
	 * Adding listener for changing node's CSS on expand parent
	 *
	 * @param treeInstance fancytree instance
	 */
	"_fnAddExpandEvent" : function (){
	  var ctx = this;
	  this._fancytree.bind("fancytreeexpand", function(event, data) {
			var node = data.node;

			// Getting map
			var oMap = ctx._options.gvNIXMap;

			// Getting layer
			var layer = oMap.fnGetLayerById(node.key);

			if(layer._fnReloadChilds){
				layer._fnReloadChilds();
			}

			// Call Resize map
			resizeMap();

		});
	},

	/**
	 * Adding listener for changing node's CSS on collapse parent
	 *
	 * @param treeInstance fancytree instance
	 */
	"_fnAddCollapseEvent" : function (){
	  var ctx = this;
	  this._fancytree.bind("fancytreecollapse", function(event, data) {
			// Call Resize map
			resizeMap();
		});
	},

  /**
   * Initialize layer's checkbox status
   *
   * @param $treeNode fancytree node
   * @param $layer Leaflet layer registered on map
   * @map Leaflet map instance
   */
  "_fnInitializeCheckbox" : function ($treeNode, $layer, map){
	  if ($layer._state.oCheckbox == true || $layer.s.visible_on_start){
		  $treeNode.setSelected(true);
	  } else {
		  $treeNode.setSelected(false);
	  }
	  if ($layer.s.allow_disable == false) {
		  // TODO
		  $treeNode.unselectable = true;
		  $treeNode.render();
	  }

	  // Set as active
	  if($layer._state.active){
		  $treeNode.setActive(true);
	  }
  },

	/**
     * Build style attribute from data-styles array
     *
     * @param node fancytree node
     */
    "_fnBuildStyle" : function (node){
            var $span = jQuery(node.span);
            var $spanCSS = $span.find("> span.fancytree-custom-icon");

            if($spanCSS.length > 0 && node.data.styles != null){
              var stylesAndValues = node.data.styles.split(";");
          	  for(i = 0; i < stylesAndValues.length; i++){
      			  var singleStyle = stylesAndValues[i].split(":");
      			  $spanCSS.css(singleStyle[0], singleStyle[1]);
      		  }
            }
            node.renderStatus();
    }

});

L.control.fancytreeLayers = function (options) {
  return new L.Control.FancytreeLayers(options);
};
