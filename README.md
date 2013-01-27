
# Triangle-trails

Web mapping application based on GeoPortal and OpenLayers

# Notes

### Import of shapefiles into database examples.

I used PostGIS geography coordinates. There are other ways to do this, but this is how I did it.

shp2pgsql -G  Points_Edited__for_Symbols.shp > facilities.sql, 
psql -d greenways -f /tmp/facilities.sql

If date field may need to do this: 
ogr2ogr Umstead_Points  Umstead_Points_10_02.shp -nlt MultiLineString -fieldTypeToString date -nln Umstead_Points


### Server configuration

ProxyPass /geoserver http://foo.example.com:8080/geoserver
ProxyPassReverse /geoserver http://foo.example.com:8080/geoserver

You will need to add something like this to your httpd.conf file so that geoserver is running on the same url and port as the web site. If you try to run off of port 8080 the OpenLayers.Protocol.WFS calls will fail due to JavaScript restrictions.

### Editing config.js

As much as possible after setting up GeoServer the site configuration is done by editing the js/config.js file. 

Configuration of the base_map_layers and overlay_map_layers sections are fairly straightforward with the exception that overlay_map_layers set to "displayInSwitcher": false will be able to be selected in the Roads and Trails section instead of the Base Map Layers section. The name attribute for these layers will be the name displayed in the switchers. The wmsurl parameter should be edited to point to your data.

#### Configuring the vector_map_layer

The points layer that displays facilities is the most complicated since it requires certain columns set up in certain ways.

The configurable column "switchColumn": "switch_val" is the name of a column in the points layer. The Facilities section of the program will display the switchVals title values as selections in that section. The corresponding val, eg. "val": "toilets" will select points to display for that selection based on the value in the switch_val column for those points. In this selection all points with toilets in the switch_val column will be displayed.

In order to display the appropriate park symbol with the points we use the symbol column of the points layer.  Values such as Airport,  Campsite,  First_Aid,  Food,  or Ranger_Facility in this column must correpond to park icons in the img/parksymbols directory named Airport.png,  Campsite.png,  First_Aid.png,  Food.png,  Ranger_Facility.png, etc.

For the info popups to work the Feature Name and Feature Type should be in columns fac_name, and fac_type.




