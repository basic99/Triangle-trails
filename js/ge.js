//http://fuzzytolerance.info/link-google-earth-plugin-to-openlayers/
/**
 * Handle widget map creation and panning
 * @param {string} maptype
 * @param {Object} longlat
 * @param {boolean} reset
 */

var ge, streetview;
google.load("earth", "1");
/*
  function initCB(instance) {
      ge = instance;
      ge.getWindow().setVisibility(true);
    }
function failureCB(errorCode) {
    }
*/
function widgetMaps(maptype, longlat, reset) {
	var lonlatGCS = OpenLayers.Layer.SphericalMercator.inverseMercator(longlat.lon, longlat.lat);
	if (maptype == "Google Street View") {
		if (streetview == null || reset) {
			streetview = new google.maps.StreetViewPanorama(document.getElementById("widget-streetview"));
		}

		var theloc = new google.maps.LatLng(lonlatGCS.lat, lonlatGCS.lon);
		streetview.setPosition(theloc);

		google.maps.event.addListener(streetview, 'position_changed', function() {
			var angle = computeAngle(theloc, streetview.getPosition());
			streetview.setPov({
				heading: angle,
				pitch: 0,
				zoom: 1
			});
		});
	} else if (maptype == "Google Earth") {
		if (ge == null || reset) {
			$("#map3d").empty();
			google.earth.createInstance('map3d', function(instance) {
				ge = instance;
				instance.getWindow().setVisibility(true);
				ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
				ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
				geZoom(longlat);

			});
		} else {
			geZoom(longlat);
		}
	} else {
		return false;
	}
}

/**
 * Function to zoom for Google Earth. External because GE loads asynchronously.
 * Note map.getScale()/40 for range and the tilt angle. Tweak those to taste.
 */

function geZoom(longlat) {
	// Update the view in Google Earth
	var lonlatGCS = OpenLayers.Layer.SphericalMercator.inverseMercator(longlat.lon, longlat.lat);
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	lookAt.setLatitude(lonlatGCS.lat);
	lookAt.setLongitude(lonlatGCS.lon);
	lookAt.setRange(map.getScale() / 40);
	lookAt.setTilt(45);
	ge.getView().setAbstractView(lookAt);
}

// Hook streetview to map move event
/* move to script
map.events.register("moveend", map, function(e) {
	mapactive = $("#accordion-map h3").eq($('#accordion-map').accordion('option', 'active')).attr("id");
	if (mapactive == "STREETVIEW") {
		widgetMaps("Google Street View", map.getCenter(), false);
	}
	if (mapactive == "EARTH") {
		widgetMaps("Google Earth", map.getCenter(), false);
	}
});

*/

/*  Run Code When Active Map Accordion Changes  */

function processAccordionMapChange(accordionValue) {

	switch (accordionValue) {
	case "STREETVIEW":
		widgetMaps("Google Street View", map.getCenter(), true);
		break;
	case "GOOGLEEARTH":
		widgetMaps("Google Earth", map.getCenter(), true);
		break;
	}
}