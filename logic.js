// Store the USGS JSON url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Create a basic tile layer
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

// Define a markerSize function that will scale each radius evenly so that the earthquake
// markers are visible
function markerSize(magnitude) {
    return magnitude * 10000;
}

// assigns the color based on the value of the magnitude
function markerColor(magnitude){
  if (magnitude > 0 && magnitude < 1){
    circle_hex = "#7CFC00"; // Lawngreen 
  }
  else if (magnitude >= 1 && magnitude < 2){
    circle_hex = "#FFFF00"; // Yellow
  }
  else if (magnitude >= 2 && magnitude < 3){
    circle_hex = "#FFA500"; // Orange
  }
  else if (magnitude >= 3 && magnitude < 4){
    circle_hex = "#FF8C00"; // Darkorange
  }
  else if (magnitude >= 4 && magnitude < 5){
    circle_hex = "#FF0000"; // Red
  }
  else {
    circle_hex = "#8B0000"; // Darkred
  }
  return circle_hex;
}

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h1>" + feature.properties.place).addTo(myMap);  
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circle(latlng, {
        fillOpacity: 1,
        color: markerColor(feature.properties.mag),
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(feature.properties.mag)
        });
    },
    onEachFeature: onEachFeature
  }).addTo(myMap);
}

// Create Legend display on the bottom right.
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magnitude_ranks = [0,1,2,3,4,5];
    var colors = ["#7CFC00","#FFFF00","#FFA500","#FF8C00","#FF0000","#8B0000"];
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



