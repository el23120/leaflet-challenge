var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//assign colorscale for depth
function getColor(x){
    return x <10 ? 'green':
           x <30 ? 'yellow':
           x <50 ? 'gold':
           x <70 ? 'orange':
           x <90 ? 'red':
                       'maroon';

}

//assign size for magnitude
function markerSize(mag) {
    return mag * 30000;
  }

d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});


  
function createFeatures(earthquakeData) {
  
   
        // Create a GeoJSON layer that contains the features array on the earthquakeData object.
        // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
onEachFeature: function(feature,layer){
            
        // Define a function that we want to run once for each feature in the features array.
        // Give each feature a popup that describes the place and time of the earthquake.    
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);    
            },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                //set radius with magnitude
                radius: markerSize(feature.properties.mag), 
                //set color with coordinate 3 (depth)
                fillColor: getColor(feature.geometry.coordinates[2]), 
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }
);
    
    
    
       // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}


function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


  
// Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
    };
  
// Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

        // Creating our initial map object:
        // We set the longitude, latitude, and starting zoom level (chose cordinates for Denver, CO)
        // This gets inserted into the div with an id of "map".
        // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            39.73715,-104.989174
            ],
        zoom: 5,
        layers: [street, earthquakes]
    });

      // Create a layer control.
     // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    var legend = L.control({position: 'bottomright'});

    // add legend with colorscale set in getColor function
    legend.onAdd = function (myMap) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            depth = [0, 10, 30, 50, 70, 90],
            labels = [],
            from, to;
    
        // loop through depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            from = depth[i];
            to = [from + 20];

            labels.push(
                '<i style="background:' + getColor(from + 1) + ';color:' + getColor(from + 1) +';">sometexttogivespace</i> ' +
                from + (from ? '&ndash;' + to : ''));
            }
            div.innerHTML = labels.join('<br>');
            return div;
        };
    

    
    
    
    legend.addTo(myMap);
    
} 