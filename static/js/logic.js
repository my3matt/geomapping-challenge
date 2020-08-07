

// Map object with center focus on USA 
var myMap = L.map("map", {
    center: [37.7749, -98.4194],
    zoom: 5
  });

  
  //Add object tile layer 
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  // all week earthquake data 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  make styling function for color radius 
d3.json(queryUrl, function(data) {
  function styleFx(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: MagColor(feature.properties.mag),
      color: "#000000",
      radius: MagRad(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // color code based on magnitude values 1-5
    function MagColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ccff33";
    case magnitude > 4:
      return "#ffff33";
    case magnitude > 3:
      return "#ffcc33";
    case magnitude > 2:
      return "#ff9933";
    case magnitude > 1:
      return "#ff6633";
    default:
      return "#ff3333";
    }
  }
  // if fx for get radius 
    function MagRad(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
    // GeoJSON layer
    L.geoJson(data, {
      // Maken cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // cirecle style
      style: styleFx,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  
    // an object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#ccff33",
        "#ffff33",
        "#ffcc33",
        "#ff9933",
        "#ff6633",
        "#ff3333"
      ];
  
      // Looping through
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(myMap);
  });