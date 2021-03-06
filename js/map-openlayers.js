/*global OpenLayers:false map:false config:false Modernizr:false*/
/*
    This file handles map initialization and events.
    @author  Tobin Bradley, Jim White
    @license     MIT
*/


/*  Globals specifically for OpenLayers Use  */
var selectControl; // OpenLayers select control for vector marker layer
var vector_layer; //put here so can access in javascript console
var theLayer, url, message, point, zoom, popup, selectedFeature, args; //various undefined in GeoPortal
var feats, i, feature; //various undefined in GeoPortal
/*  Map Initialization  */

function initializeMap() { /*  initialze map  */

	map = new OpenLayers.Map({
		div: "map",
		projection: "EPSG:900913",
		displayProjection: "EPSG:4326",
		fallThrough: false,
		controls: [new OpenLayers.Control.Zoom({}), new OpenLayers.Control.Navigation({
			zoomWheel: true,
			mouseWheelOptions: {
				interval: 100
			},
			zoomBoxEnabled: true
		})]
	});
	var nav = map.getControlsByClass("OpenLayers.Control.Navigation")[0];
	nav.handlers.wheel.cumulative = false;

	/*  Add map layers  */

	addMapLayers(config.base_map_layers);
	addMapLayers(config.overlay_map_layers);

	/* Add facilities and switcher layer
	//////////////////////////////////////////////////// 
	JBW 11/6/2012
	//////////////////////////////////////////////////////
	*/
	var mystyle = new OpenLayers.Style({
		externalGraphic: "img/parksymbols/" + '${symbol}' + ".png",
		graphicWidth: 25,
		graphicHeight: 25
	}, {
		context: {
			symbol: function(feature) {
				if (feature.cluster.length === 1) {
					return $.trim(feature.cluster[0].attributes.symbol);
				} else {
					return 'more';
				}

			}
		}
	});
	var myselectstyle = new OpenLayers.Style({
		externalGraphic: "img/parksymbols/" + '${symbol}' + ".png",
		graphicWidth: 25,
		graphicHeight: 25,
		backgroundGraphic: "img/selected_bkgrnd.png"
	}, {
		context: {
			symbol: function(feature) {
				if (feature.cluster.length === 1) {
					return $.trim(feature.cluster[0].attributes.symbol);
				} else {
					return 'more';
				}

			}
		}
	});

	var mystyleMap = new OpenLayers.StyleMap({
		'default': mystyle,
		select: myselectstyle
	});

	vector_layer = new OpenLayers.Layer.Vector("WFS", {
		projection: "EPSG:4326",
		styleMap: mystyleMap,
		displayInLayerSwitcher: false,
		visibility: false,
		strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({
			distance: 30
		})],
		protocol: new OpenLayers.Protocol.WFS({
			url: config.vector_map_layer.wfsurl,
			featureType: config.vector_map_layer.layers,
			geometryName: "geog"
		})
	});

	map.addLayer(vector_layer);


	var html_str = "<input type='radio' checked=checked name='facilities' id='off' /><label for='off'>Off</label><br>";
	$.each(config.vector_map_layer.switchVals, function(index, value) {
		html_str += "<input type='radio' name='facilities' id='" + value.val + "' /><label for='" + value.val + "'>" + value.title + "</label><br>";
	});
	$("#parks").html(html_str);
	html_str = '';
	$.each(config.overlay_map_layers, function(index, value) {
		if (value.displayInSwitcher === false) {
			html_str += "<input type='checkbox' value='" + value.name + "' id='" + value.id + "' /><label for='" + value.id + "'>" + value.name + "</label><br>";
		}
	});
	$("#roadsntrails").html(html_str);

	$("#roadsntrails input:checkbox").change(function() {
		var chkd_layers = $("#roadsntrails input:checked");
		var trail_layers = $("#roadsntrails input");
		var vals, chkd_vals, show_layer;
		$.each(trail_layers, function(index, value) {
			vals = $(value).attr("value");
			show_layer = false;
			$.each(chkd_layers, function(index, value) {
				chkd_vals = $(value).attr("value");
				if (chkd_vals.indexOf(vals) !== -1) {
					show_layer = true;
				}
			});
			theLayer = getLayerOpenLayers(vals);
			if (show_layer) {
				theLayer.setVisibility(true);
			} else {
				theLayer.setVisibility(false);
			}
		});
	});

	$("#parks input").change(function() {
		var selected = $("#parks input:checked").attr("id");
		vector_layer.filter = null;
		if (selected.indexOf('allfac') !== -1) {
			vector_layer.filter = null;
			vector_layer.setVisibility(true);
			vector_layer.refresh({
				force: true
			});

		} else if (selected.indexOf('off') !== -1) {
			vector_layer.destroyFeatures();
		} else {
			vector_layer.filter = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: config.vector_map_layer.switchColumn,
				value: selected
			});
			vector_layer.setVisibility(true);
			vector_layer.refresh({
				force: true
			});
		}
	});

	//hack for destroy feautures and zoom bug
	vector_layer.events.on({
		'featuresadded': function(evt) {
			//console.log("features added");
			var selected = $("#parks input:checked").attr("id");
			if (selected.indexOf('off') !== -1) {
				vector_layer.destroyFeatures();
			}
		}
	});

	//for ge.js
	map.events.register("moveend", map, function(e) {
		mapactive = $("#accordion-data h3").eq($('#accordion-data').accordion('option', 'active')).attr("id");
		if (mapactive == "STREETVIEW") {
			widgetMaps("Google Street View", map.getCenter(), false);
		}
		if (mapactive == "GOOGLEEARTH") {
			widgetMaps("Google Earth", map.getCenter(), false);
		}
	});


	/*  Set map center and zoom  */
	map.setCenter(new OpenLayers.LonLat(config.default_map_center[1], config.default_map_center[0]).transform(
	new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), config.default_map_zoom);

	// Vector marker layer
	var styleMap = new OpenLayers.StyleMap({
		fillOpacity: 1,
		pointRadius: 18
	});
	var lookup = {
		0: {
			externalGraphic: "img/marker.png",
			graphicWidth: 25,
			graphicHeight: 41,
			backgroundGraphic: "img/marker-shadow.png",
			graphicYOffset: -40,
			backgroundWidth: 41,
			backgroundHeight: 41,
			backgroundXOffset: -12,
			backgroundYOffset: -40
		},
		1: {
			externalGraphic: "img/marker2.png",
			graphicWidth: 25,
			graphicHeight: 41,
			backgroundGraphic: "img/marker-shadow.png",
			graphicYOffset: -40,
			backgroundWidth: 41,
			backgroundHeight: 41,
			backgroundXOffset: -12,
			backgroundYOffset: -40
		}
	};
	styleMap.addUniqueValueRules("default", "type", lookup);
	var markerLayer = new OpenLayers.Layer.Vector('Map Markers', {
		styleMap: styleMap,
		displayInLayerSwitcher: false
	});
	map.addLayer(markerLayer);

	// Map Controls
	map.addControl(new OpenLayers.Control.MousePosition({
		'div': OpenLayers.Util.getElement('toolbar-coords')
	}));

	map.addControl(new OpenLayers.Control.LayerSwitcher({
		'div': OpenLayers.Util.getElement('layer_switch_ctl')
	}));
	selectControl = new OpenLayers.Control.SelectFeature(vector_layer, {
		onSelect: onFeatureSelect,
		onUnselect: onFeatureUnselect,
		stopSingle: true
	});
	map.addControl(selectControl);
	selectControl.activate();

	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.OverviewMap());


	/*  Locate user position via GeoLocation API  */
	$(".mylocation").hide();
	if (Modernizr.geolocation) {
		$(".mylocation").show();
		$(".mylocation").click(function() {
			navigator.geolocation.getCurrentPosition(

			function(position) {
				var radius = position.coords.accuracy / 2;
				$.publish("/layers/addmarker", [{
					"lon": position.coords.longitude,
					"lat": position.coords.latitude,
					"featuretype": 1,
					"label": "<h5>GeoLocation</h5>You are within " + radius + " meters of this point.",
					"zoom": 16
				}]);
			}, function() { /* error handler */
			}, {
				enableHighAccuracy: true,
				maximumAge: 30000,
				timeout: 27000
			});
		});
	}

	/*  Opacity Slider  */
	$.each(config.overlay_map_layers, function(key, val) {
		$('#opacitydll').append('<option>' + val.name + '</option>');
	});
	$('#opacitySlider').slider({
		range: "min",
		min: 0.1,
		max: 1,
		step: 0.05,
		value: 0.50,
		stop: function(event, ui) {
			theLayer = getLayerOpenLayers($('#opacitydll').val());
			if (theLayer) {
				theLayer.setOpacity(ui.value);
			}
		}
	});
	$('#opacitydll').change(function() {
		theLayer = getLayerOpenLayers($('#opacitydll').val());
		if (theLayer) {
			$("#opacitySlider").slider("option", "value", theLayer.opacity);
		}
	});
	(function() {
		theLayer = getLayerOpenLayers($('#opacitydll').val());
		if (theLayer) {
			$("#opacitySlider").slider("option", "value", theLayer.opacity);
		}
	})();
	$('#opacitySlider').sliderLabels('MAP', 'DATA');

	
	if((document.URL).indexOf("GOOGLEEARTH") != -1){
		widgetMaps("Google Earth", map.getCenter(), true);
	}
	


} //end initialize map
/*
    Adds layers to the map on initial map load.
    Input array comes from the config.json file.
    Returns a JSON object containing name:layer for each layer type for the layers control
 */
function addMapLayers(layersArray) {
	var layers = {};
	$.each(layersArray, function(index, value) {
		var layer;
		if (value.wmsurl.indexOf("{x}") !== -1) {
			if (value.id === "osm") {
				layer = new OpenLayers.Layer.OSM("OpenStreetMap");
			} else {
				layer = new OpenLayers.Layer.XYZ(value.name, value.wmsurl.replace(/\{/g, "${"));
			}
		} else if (value.id.indexOf("google") !== -1) {
			layer = new OpenLayers.Layer.Google(value.name, {
				type: value.type,
				sphericalMercator: true,
				wrapDateLine: false,
				numZoomLevels: value.numZoomLevels
			}, {
				isBaseLayer: value.isBaseLayer,
				opacity: value.opacity,
				visibility: value.isVisible

			});

		} else {
			layer = new OpenLayers.Layer.WMS(
			value.name, value.wmsurl, {
				layers: value.layers,
				format: value.format,
				transparent: value.transparent
			}, {
				isBaseLayer: value.isBaseLayer,
				opacity: value.opacity,
				visibility: value.isVisible,
				minZoomLevel: value.minZoom,
				maxZoomLevel: value.maxZoom,
				attribution: value.attribution,
				projection: value.projection,
				displayInLayerSwitcher: value.displayInSwitcher

			});
		}
		map.addLayer(layer);
	});
}






/*  Handle toolbar events  */

function toolbar(tool) {
	if (tool.attr("id") === "identify") {
		map.events.register("click", map, identify);
	} else {
		map.events.unregister('click', map, identify);
	}
}

/*  Get map layer from leaflet  */

function getLayerOpenLayers(layerName) {
	var theLayer = null;
	$.each(map.layers, function(index, val) {
		if (val.name === layerName) {
			theLayer = val;
		}
	});
	return theLayer;
}

/*
    Perform identify based on map click.
    Note minimum zoom level set - you might want to screw with that for your application.
*/
function identify(event) {
	if (map.getZoom() >= 16) {
		var lonlat = map.getLonLatFromViewPortPx(event.xy);
		lonlat.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
		selectByCoordinate(lonlat.lon, lonlat.lat);
	}
}

/*  Select parcel with lon,lat  */

function selectByCoordinate(lon, lat) {
	url = pointOverlay(lon, lat, 4326, 'tax_parcels', 'pid', "", 'json', '?');
	$.getJSON(url, function(data) {
		if (data.total_rows > 0) {
			url = config.web_service_base + "v1/ws_mat_pidgeocode.php?format=json&callback=?";
			args = "&pid=" + urlencode(data.rows[0].row.pid);
			url = url + args;
			$.getJSON(url, function(data) {
				if (data.total_rows > 0) {
					message = "<h5>Identfy</h5>" + data.rows[0].row.address + "<br />PID: " + data.rows[0].row.parcel_id;
					message += "<br /><br /><strong><a href='javascript:void(0)' class='identify_select' data-matid='" + data.rows[0].row.objectid + "' onclick='locationFinder(\"Address\", \"master_address_table\", \"objectid\", " + data.rows[0].row.objectid + ");'>Select this Location</a></strong>";
					$.publish("/layers/addmarker", [{
						"lon": data.rows[0].row.longitude,
						"lat": data.rows[0].row.latitude,
						"featuretype": 1,
						"label": message
					}]);
				}
			});
		}
	});
}

/*
    Zoom to a latlong at a particular zoom level.
    Note default zoom level if none is passed.
*/
function zoomToLonLat(data) {
	if (data.zoom) {
		zoom = data.zoom || 17;
		point = new OpenLayers.Geometry.Point(data.lon, data.lat);
		OpenLayers.Projection.transform(point, map.displayProjection, map.getProjectionObject());
		map.setCenter(new OpenLayers.LonLat(point.x, point.y), zoom);
	}
}


/* Marker Vector Layer Popups */

function onPopupClose(evt) {
	//add this to close after zoomchange JBW
	while (map.popups.length) {
		map.removePopup(map.popups[0]);
	}
	selectControl.unselectAll();
	OpenLayers.Event.stop(evt); // prevent an identify from firing
}

function onFeatureSelect(feature) {
	selectedFeature = feature;
	// remove any existing popups
	while (map.popups.length) {
		map.removePopup(map.popups[0]);
	}

	if (feature.cluster && feature.cluster.length === 1) {
		var html_str = "<b>Feature Name</b>: " + feature.cluster[0].data.fac_name + "<br>";
		html_str += "<b>Feature Type</b>: " + feature.cluster[0].data.fac_type;
		popup = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null, html_str, null, true, onPopupClose);
		feature.popup = popup;
		popup.minSize = new OpenLayers.Size(200, 50);
		popup.maxSize = new OpenLayers.Size(250, 200);
		map.addPopup(popup);
	} else if (feature.attributes.label) {
		popup = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null, feature.attributes.label, null, true, onPopupClose);
		feature.popup = popup;
		popup.minSize = new OpenLayers.Size(200, 50);
		popup.maxSize = new OpenLayers.Size(250, 200);
		map.addPopup(popup);
	}

}

function onFeatureUnselect(feature) {
	if (feature.popup) {
		map.removePopup(feature.popup);
		feature.popup.destroy();
		delete feature.popup;
	}
}


/*
    Add markers to the map.
    The default rule here is 1 marker of each type at a time, but you could fiddle with that.
    You can add custom markers for each type.
*/
function addMarker(data) {

	// remove old features of same type
	var markerLayer = getLayerOpenLayers("Map Markers");
	feats = markerLayer.features;
	for (i = 0; i < feats.length; i++) {
		if (feats[i].attributes.type === data.featuretype) {
			markerLayer.removeFeatures(feats[i]);
		}
	}
	// Add new feature
	point = new OpenLayers.Geometry.Point(data.lon, data.lat);
	OpenLayers.Projection.transform(point, map.displayProjection, map.getProjectionObject());
	feature = new OpenLayers.Feature.Vector(point, {
		type: data.featuretype,
		label: data.label
	});
	markerLayer.addFeatures(feature);
	selectControl.select(feature);
}