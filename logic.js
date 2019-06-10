// Store the USGS JSON url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {  
  //Creating circles
  createFeatures(data.features)
});

// Define a markerSize function that will give each city a different radius based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude / 40;
}

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h1>" + feature.properties.place).addTo(myMap);  
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
    // pointToLayer: function(feature, latlng) {
    //   return L.circle(feature.geometry.coordinates, {
    //     fillOpacity: 0.75,
    //     color: "white",
    //     fillColor: "purple",
    //     // Setting our circle's radius equal to the output of our markerSize function
    //     // This will make our marker's size proportionate to its population
    //     radius: markerSize(feature.properties.mag)
    //     });
    // },
    onEachFeature: onEachFeature
  }).addTo(myMap);
}

// Create Legend display on the bottom right.
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magnitude_ranks = [0,1,2,3,4,5];
    var colors = ["#E61900",'#E85E00','#EBA400','#EDEC00','#1BF500','#00FA77','#00FCC3','#00ECFF']
    var labels = [];

    // Add min & max
    var legendInfo = "<h2><center>Earthquake Magnitude</center></h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + magnitude_ranks[0] + "</div>" +
        "<div class=\"max\">" + magnitude_ranks[magnitude_ranks.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    magnitude_ranks.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);



