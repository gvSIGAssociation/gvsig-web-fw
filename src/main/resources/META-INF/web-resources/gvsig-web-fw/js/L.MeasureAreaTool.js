/*
 * Measure Area Tool.
 * Uses L.Draw plugin
 *
 */
L.Polygon.Measure = L.Draw.Polygon.extend({

	addPopupContent : function() {
		var latLng =  this._poly.getBounds().getCenter();
		this._poly.bindPopup('<p><b> ' + this.measureType + ':</b></br><i>' + this._popupPane.textContent + '</i></p>').openPopup( this._poly.getBounds().getCenter());
	},
    addHooks: function() {
        L.Draw.Polygon.prototype.addHooks.call(this);
        if (this._map) {
            this._markerGroup = new L.LayerGroup();
            this._map.addLayer(this._markerGroup);

            this._markers = [];
            this._map.on('click', this._onClick, this);
            this._startShape();
        }
    },

    removeHooks: function () {
        L.Draw.Polygon.prototype.removeHooks.call(this);

        this._clearHideErrorTimeout();

        //!\ Still useful when control is disabled before any drawing (refactor needed?)
        this._map.off('mousemove', this._onMouseMove);
        this._clearGuides();
        this._container.style.cursor = '';

        this._map.off('click', this._onClick, this);
        this._removeShape();
    },

    _startShape: function() {
        this._drawing = true;
        this._poly = new L.Polygon([], this.options.shapeOptions);

        this._container.style.cursor = 'crosshair';

        this._updateTooltip();
        this._map.on('mousemove', this._onMouseMove, this);
        this.hideTooltip(false);
    },

    _finishShape: function () {
        this._drawing = false;


        this._cleanUpShape();
        this._clearGuides();

        this._updateTooltip();

        this._map.off('mousemove', this._onMouseMove, this);
        this._container.style.cursor = '';

        //Change popup container by static marker
        //Get center geometry to display marker.
        this.addPopupContent();
        this.hideTooltip(true);
    },

    _removeShape: function() {
        if (!this._poly)
            return;
        this._map.removeLayer(this._poly);
        delete this._poly;
        this._markers.splice(0);
        this._markerGroup.clearLayers();
    },

    _onClick: function(e) {
        if (!this._drawing) {
            this._removeShape();
            this._startShape();
            return;
        }
    },

    _getTooltipText: function() {
        var labelText = L.Draw.Polygon.prototype._getTooltipText.call(this);
        if (!this._drawing) {
            labelText.text = '';
        }
        return labelText;
    },
    // Cancel drawing when the escape key is pressed
	_cancelDrawing: function (e) {
		if (e.keyCode === 27) {
			// Not diable. This tool should be deselected from toolbar icon manually
			//this.disable();
			this._removeShape();
			this._startShape();
		}
	},

    hideTooltip: function(value){
    	for(var i =0 ; i<= this._tooltip._popupPane.childNodes.length -1; i++){
    		if(this._tooltip._popupPane.childNodes[i].className.indexOf('leaflet-draw-tooltip') != -1){
				this._tooltip._popupPane.childNodes[i].hidden = value;
    		}
    	}
    },

    _onTouch: function (e) {
		if (L.Browser.touch) { // #TODO: get rid of this once leaflet fixes their click/touch.
			this._onMouseDown(e);
			this._onMouseMove(e);
			this._onMouseUp(e);
		}
	}

});

//Include here custom L.Polygon.Measure extension properties and functions
L.Polygon.Measure = L.Polygon.Measure.extend({
	measureType: 'Distance'
});


L.Control.MeasureAreaControl = L.Control.extend({
   statics: {
        TITLE: 'Measure Areas'
    },
    options: {
        position: 'topright',
        handler: {}
    },
    //Fires Draw enables event ==> after raises addHooks (overwritten)
    toggle: function() {
        if (this.handler.enabled()) {
            this.handler.disable.call(this.handler);
        } else {
            this.handler.enable.call(this.handler);
        }
    },

    //Toolbar enable/disable control
    enable: function (){
    	this.handler.enable.call(this.handler);
    },

    disable: function (){
    	this.handler.disable.call(this.handler);
    },

    onAdd: function(map, showArea, allowIntersect, shapeColor, btnElement, errorMessage, type) {

    	var className = 'leaflet-control-draw';
    	this._container = L.DomUtil.create('div', 'leaflet-bar');

    	var polMeasure = new L.Polygon.Measure(map, this.options.handler);
        polMeasure.options.showArea = showArea;
        polMeasure.options.allowIntersection = allowIntersect;
        polMeasure.options.shapeOptions.color = shapeColor;
        polMeasure.options.drawError.message = errorMessage;
        polMeasure.measureType = type;
        this.handler = polMeasure;

        this.handler.on('enabled', function () {
            //TODO: Add any class to display??
        }, this);

        this.handler.on('disabled', function () {
        	//TODO: Add any class to display??
        }, this);


        L.DomEvent
            .addListener(btnElement, 'click', L.DomEvent.stopPropagation)
            .addListener(btnElement, 'click', L.DomEvent.preventDefault)
            //Quit click event. Managed from parent class
            //.addListener(btnElement, 'click', this.toggle, this);

        return this;
    }
});


L.Map.mergeOptions({
    measureAreaControl: false
});


L.Map.addInitHook(function () {
    if (this.options.measureControl) {
        this.measureAreaControl = L.Control.measureAreaControl().addTo(this);
    }
});


L.Control.MeasureAreaTool = function (options) {
    return new L.Control.MeasureAreaControl(options);
};


