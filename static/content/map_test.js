
navigator.geolocation.getCurrentPosition(
// Success callback function
(position) => {
    // Get the user's latitude and longitude coordinates
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Do something with the location data, e.g. display on a map
    console.log(`Latitude: ${lat}, longitude: ${lng}`);

    var map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker([lat,lng]).addTo(map);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
    getData(lat, lng);
    //const forecastURL = wResult[1].forecast;
    //var fResult = getData(forecastURL);

    /*
    var circle = L.circle([37.327, -121.8853], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
    var polygon = L.polygon([
        [37.3484, -121.9053],
        [37.3386, -121.8753],
        [37.3588, -121.8873]
    ]).addTo(map);
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");
    */
},
// Error callback function
(error) => {
    // Handle errors, e.g. user denied location sharing permissions
    console.error("Error getting user location:", error);
}
);

async function getData(lat, lng) {
    const weatherReqURL = "https://api.weather.gov/points/" + lat + "," + lng;

    try {
      const response = await fetch(weatherReqURL);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      const forecastReqURL = json.properties.forecast;
      const fResponse = await fetch(forecastReqURL);
      if (!fResponse.ok) {
        throw new Error(`Response status: ${fResponse.status}`);
      }
      const json2 = await fResponse.json();
      console.log("The temperature at your location is " + json2.properties.periods[0].temperature + " degrees Fahrenheit");
    } catch (error) {
      console.error(error.message);
    }
  }
    