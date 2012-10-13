var config = {
    "web_service_base": "http://maps.co.mecklenburg.nc.us/rest/",
    "geoserver_base": "http://jimserver.net/geoserver",//TD
    "default_map_center": [35.853, -78.746],
    "default_map_zoom": 12,
    "default_map_min_zoom": 10,
    "default_map_max_zoom": 18,
    "base_map_layers": [ {
        "id": "osm",
        "name": "Open Street Map",
        "attribution": "Provided by Tiles@Home",
        "wmsurl": "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "maxZoom": 18,
        "minZoom": 9,
        "isVisible": false,
        "isBaseLayer": true
    },
    {
        "id": "google_sat",
        "name": "Google Satellite",
        "type": google.maps.MapTypeId.SATELLITE,
        "wmsurl": "",
        "maxZoom": 18,
        "minZoom": 9,
        "isVisible": false,
        "isBaseLayer": true
    },
    {
        "id": "google_ter",
        "name": "Google Terrain",
        "type": google.maps.MapTypeId.TERRAIN,
        "wmsurl": "",
        "maxZoom": 18,
        "minZoom": 9,
        "isVisible": false,
        "isBaseLayer": true
    }],
    "overlay_map_layers": [{
        "id": "nexrad",
        "name": "Nexrad Weather Radar",
        "attribution": "Provided by Iowa State University",
        "wmsurl": "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
        "layers": "nexrad-n0r-900913",
        "format": "image/png",
        "transparent": true,
        "opacity": 0.5,
        "maxZoom": 18,
        "minZoom": 9,
        "isVisible": false,
        "isBaseLayer": false
    }, {
        "id": "umstead_trails",
        "name": "Umstead Park Trails",
        //"attribution": "Provided by Mecklenburg County GIS",
        "wmsurl": "http://jimserver.net/geoserver/opengeo/wms",
        "layers": "umstead_named_trails,umstead_line",
        "format": "image/png",
        "transparent": true,
        "opacity": 0.5,
        "maxZoom": 18,
        "minZoom": 15,
        "isVisible": false,
        "isBaseLayer": false
    }]
};
