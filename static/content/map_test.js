navigator.geolocation.getCurrentPosition(
    (position) => {
        //get user's current location
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        //draw map centered at location at zoom level
        const map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //create a marker and label at location
        const marker = L.marker([lat,lng]).addTo(map);
        marker.bindPopup(`<b>You are here!</b><br> Latitude ${lat}, Longitude: ${lng}`).openPopup();

        const popup = L.popup();
        const onMapClick = (e) => {
            popup
                .setLatLng(e.latlng)
                .setContent(`You clicked the map at ${e.latlng.toString()}`)
                .openOn(map);
            document.getElementById('weatherInfo').innerHTML = "Retrieving weather info...";
            updateWeatherInfo(map, e.latlng.lat, e.latlng.lng);
        };

        map.on('click', onMapClick);

        // Hide loading message after map is initialized
        document.getElementById('loadingMessage').style.display = 'none';

        updateWeatherInfo(map, lat, lng);
        /*
        //draw a circular region
        var circle = L.circle([37.327, -121.8853], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);

        /draw a polygonal region
        var polygon = L.polygon([
            [37.3484, -121.9053],
            [37.3386, -121.8753],
            [37.3588, -121.8873]
        ]).addTo(map);
        circle.bindPopup("I am a circle."); //circle region label
        */
    },
    (error) => {
        console.error("Error getting user location:", error);
        // Hide loading message even if there's an error
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('weatherInfo').innerHTML = "Error getting your location. Please enable location services and refresh the page.";
    }
);

function updateWeatherInfo(map, lat, lon) {
  //get weather data from weather.gov
  getData(lat, lon).then((data) => {
    let weatherText = `The temperature in ${data.city}, ${data.state}, is currently ${data.temperature}\u00B0F<br />
      ${data.city}'s Air Quality Index is currently ${data.aqi}<br /><br />Weekly weather forecast for ${data.city}:<br />`;

    for (const period of data.forecastWeekly) {
        weatherText += `${period.name}: ${period.shortForecast}, ${period.temperature}\u00B0F. Wind: 
          ${period.windSpeed} ${period.windDirection}<br />`;
    }

    weatherText += `<br /> Detailed air quality info for ${data.city}: <br />
      Carbon monoxide (CO): ${data.pollutantInfo.co} \u03BCg/m<sup>3</sup> <br />
      Nitrogen dioxide (NO<sub>2</sub>) ${data.pollutantInfo.no2}\u03BCg/m<sup>3</sup> <br />
      Fine Particulate Matter (PM<sub>2.5</sub>)${data.pollutantInfo.pm2_5}\u03BCg/m<sup>3</sup> <br />
      Large Particulate Matter (PM<sub>10</sub>)${data.pollutantInfo.pm10}\u03BCg/m<sup>3</sup> <br />
      Ozone (O<sub>3</sub>)${data.pollutantInfo.o3}\u03BCg/m<sup>3</sup><br />
      Sulphur dioxide (SO<sub>2</sub>)${data.pollutantInfo.so2}\u03BCg/m<sup>3</sup><br />
      Humidity: ${data.pollutantAqi.h.v}%`;
    document.getElementById('weatherInfo').innerHTML = weatherText;

    //swap lon and lat index positions
    const polyCoords = [];
    for (const pos of data.geometry.coordinates[0]) {
      polyCoords.push([pos[1], pos[0]]);
    }

    const polygon = L.polygon(polyCoords).addTo(map);
    polygon.bindPopup(data.city); //polygon region label
  });
}

async function getData(lat, lon) {
  try {
    const req = new FormData();
    req.append("lat", lat);
    req.append("lon", lon);
    const response = await fetch("/map_test", {method:"POST", body:req});
    if (!response.ok) {
      document.getElementById("weatherInfo").innerHTML = "Failed to get weather data";
      throw new Error(`Failed to obtain weather data: ${response.status}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error.message);
  }
}
    