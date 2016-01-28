# Leaflet.CoordinatedImagePreview
Leaflet Coordinated Image Viewer

<a href="https://utahemre.github.io/coordinatedimagepreviewdemo.html" target="_blank">Demo</a>

This plug-in can show thumbnails of coordinated images in a list and show originals with user click. When plugin activated, it sends ajax requests to your service in every map moveend listener and refresh image list.

It requires Leafletjs and JQuery. It has beeen tested with JQuery 1.11.3 and both Leaflet 0.7.3 and Leaflet 1.0 beta 2.

It also requires

<a href="https://github.com/Leaflet/Leaflet.label" target="_blank">Leaflet.label</a>, 
<a href="https://github.com/maximeh/leaflet.bouncemarker" target="_blank">leaflet.bouncemarker</a> and 
<a href="https://github.com/lokesh/lightbox2/" target="_blank">lightbox2</a>

#Example Request and Response

When user activate this plugin or move map, plugin sends a ajax request with bound of map, center of map and limit parameters. 

http://yourImageSearchAddress?lng=32.8621&lat=39.9292&minx=32.3334&miny=39.7942&maxx=33.3908&maxy=40.0638&limit=10 

Your response should be valid GeoJson which contains Point geometries like the following

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    32.836954, 39.925041
                ]
            },
            "properties": {
                "imageLink": "./example.jpg",
                "thumbnailLink": "./example_thumb.jpg",
                "title": "Title seen on marker",
                "description": "Description seen in lightbox"
            }
        }
    ]
}
```

#Usage

Just add   
```html
<div id='coordinatedImagePreviewControlContainer'></div>
```
tag to your html and  
```javascript
var options = {
   imageServiceAddress: "http://yourImageSearchAddress"
  };
 $('#coordinatedImagePreviewControlContainer').CoordinatedImagePreviewControl(options);
```
to your window.onload function.

#Options

- **imageServiceAddress:** Address of your image search service. 
  - Ajax request sends 7 parameters to your service.
    - **lng, lat** Center of your map
    - **minx, miny, maxx, maxy** Bounds of your map
    - **limit** maximum image count
- **openButtonTitle:** Title of open button.  
- **closeButtonTitle:** Title of close button.  
- **limit:** Maximum image count for every search (It is used as ajax request parameter)
- **isOpen:** Start open or close.

#License

Leaflet.CoordinatedImagePreview is free software, and may be redistributed under the MIT License. 

Please let me know your comments and usage. 

Thanks to <a href="http://www.citysurf.com.tr" target="_blank">CitySurf</a> to inspire and support this plugin.






