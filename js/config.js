var config = {
	"web_service_base": "http://maps.co.mecklenburg.nc.us/rest/",
	"geoserver_base": "http://jimserver.net/geoserver",
	//TD
	"default_map_center": [35.853, -78.746],
	"default_map_zoom": 12,
	"default_map_min_zoom": 10,
	"default_map_max_zoom": 18,
	"base_map_layers": [{
		"id": "osm",
		"name": "Open Street Map",
		"attribution": "Provided by Tiles@Home",
		"wmsurl": "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
		"maxZoom": 20,
		"minZoom": 9,
		"isVisible": false,
		"isBaseLayer": true
	}, {
		"id": "google_sat",
		"name": "Google Satellite",
		"type": google.maps.MapTypeId.SATELLITE,
		"wmsurl": "",
		"isVisible": false,
		"isBaseLayer": true,
		"numZoomLevels": 20
	}, {
		"id": "google_ter",
		"name": "Google Terrain",
		"type": google.maps.MapTypeId.TERRAIN,
		"wmsurl": "",
		"isVisible": false,
		"isBaseLayer": true,
		"numZoomLevels": 16
	},{
		"id": "nconemap",
		"name": "NC OneMap",
		"wmsurl": "http://imagery.nconemap.com/arcgis/services/2010_Orthoimagery/ImageServer/WMSServer",
		"layers": "",
		"format": "image/png",
		"transparent": false,
		"maxZoom": 20,
		"minZoom": 9,
		"isVisible": false,
		"isBaseLayer": true,
                "projection": "EPSG:3857"
	}],
	"overlay_map_layers": [{
		"id": "trails",
		"name": "Named Trails",
		"wmsurl": "http://jimserver.net/geoserver/wms",
		"layers": "umstead_named_trails",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.8,
		"maxZoom": 20,
		"minZoom": 10,
		"isVisible": false,
		"isBaseLayer": false
	}, {
		"id": "footpaths",
		"name": "Footpaths",
		"wmsurl": "http://jimserver.net/geoserver/wms",
		"layers": "footpaths",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.8,
		"maxZoom": 20,
		"minZoom": 10,
		"isVisible": false,
		"isBaseLayer": false
	}, {
		"id": "unpaved_roads",
		"name": "Unpaved Roads",
		"wmsurl": "http://jimserver.net/geoserver/wms",
		"layers": "unpaved_roads",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.8,
		"maxZoom": 20,
		"minZoom": 10,
		"isVisible": false,
		"isBaseLayer": false
	},{
		"id": "paved_roads",
		"name": "Paved Roads, Powerlines",
		"wmsurl": "http://jimserver.net/geoserver/wms",
		"layers": "paved_roads,powerline",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.8,
		"maxZoom": 20,
		"minZoom": 10,
		"isVisible": false,
		"isBaseLayer": false
	},{
		"id": "parks",
		"name": "Parks and Managed Areas",
		"wmsurl": "http://jimserver.net/geoserver/wms",
		"layers": "umstead_line",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.8,
		"maxZoom": 20,
		"minZoom": 10,
		"isVisible": true,
		"isBaseLayer": false
	}, {
		"id": "nexrad",
		"name": "Nexrad Weather Radar",
		"attribution": "Provided by Iowa State University",
		"wmsurl": "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
		"layers": "nexrad-n0r-900913",
		"format": "image/png",
		"transparent": true,
		"opacity": 0.5,
		"maxZoom": 20,
		"minZoom": 9,
		"isVisible": false,
		"isBaseLayer": false
	}],
        //currently only supports one vector layer
	"vector_map_layer": {
		"id": "facilities",
		"name": "Facilities",
		"wfsurl": "http://localhost/geoserver/wfs",
		"layers": "facilities",
		"switchColumn": "switch_val",
		"switchVals": [{
			"title": "All Facilities",
			"val": "allfac"
		}, {
			"title": "Toilets",
			"val": "toilets"
		}, {
			"title": "Cabins",
			"val": "cabins"
		}, {
			"title": "Campsites",
			"val": "campsites"
		}, {
			"title": "Parking Lots",
			"val": "prklots"
		},  {
			"title": "Park Administration and Maintenance",
			"val": "admin"
		}, {
			"title": "Visitor Facilities",
			"val": "visitor"
		}]
	}
};







