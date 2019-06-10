// Store the USGS JSON url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


// // Create a map object
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 5
// });

// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets-basic",
//   accessToken: API_KEY
// }).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {  
  // Once we get a response, send the data.features object to the createFeatures function
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

  //Creating circles
  createFeatures(data.features, myMap)
});

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    return magnitude / 40;
}

function createFeatures(earthquakeData, myMap) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    L.circle(feature.geometry.coordinates, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "purple",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(feature.properties.mag)
    }).bindPopup("<h1>" + feature.properties.place).addTo(myMap);   
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  }).addTo(myMap);
}





