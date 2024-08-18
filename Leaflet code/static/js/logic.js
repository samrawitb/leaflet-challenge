//crating the map object
let myMap = L.map("map", {
    center: [37.5407, -77.4360],
    zoom: 5,
  });
  
  // Adding the tile layer
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // use the url to get the data
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  
  // // Use function to define a color scale for earthquake depth
  function getMarkerColor(depth){
  
    if (depth >= -10 & depth < 10) return "#79e02f";
    else if (depth >= 10 & depth < 30) return "#daf250";
    else if (depth >= 30 & depth < 50) return "#fadf57";
    else if (depth >= 50 & depth < 70) return "#f7ba36";
    else if (depth >= 70 & depth < 90) return "#f79336";
    else if (depth >= 90) return "#bf0606";
  
  };  
  
  // Function to determine the size of a marker based on the magnitude of the earthquake
  function getMarkerSize(magnitude) {
    return magnitude * 3;
  }
  
  // Getting the GeoJSON data
  d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Creating circle markers
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // Adding popups
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(myMap);
  });
  
  //Create a legend to the map
  let legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend'), depthLevels = [-10, 10, 30, 50, 70, 90], labels=[];
    div.style.background = 'white';
    div.style.padding = '10px';
    div.style.border = '2px solid #ccc';
    div.style.borderRadius = '5px';
    for(let i=0; i < depthLevels.length; i++) {
      
      let nextDepth = depthLevels[i+1];
      
      div.innerHTML +=
        '<i style="background:' + getMarkerColor(depthLevels[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.8;"></i> ' +
        depthLevels[i] + (nextDepth ? '&ndash;' + nextDepth + '<br>' : '+');
    }
  
    return div;
  
  };
  
  legend.addTo(myMap);