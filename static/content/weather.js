var forecastZoneLayer = null;
var alertRegionMapLayer = null;

var alertData = null;
var map = null;
navigator.geolocation.getCurrentPosition(
    (position) => {
        //get user's current location
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        //draw map centered at location at zoom level
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //create a marker and label at location
        var marker = L.marker([lat,lng]).addTo(map);
        marker.bindPopup(`<b>You are here!</b><br> Latitude ${lat}, Longitude: ${lng}`).openPopup();

        /*
        var popup = L.popup();
        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
            document.getElementById('weatherInfo').textContent = "Retrieving weather info...";
            document.getElementById('activeAlertInfo').textContent = "Retrieving alert info...";
            updateWeatherInfo(e.latlng.lat, e.latlng.lng);
        }

        map.on('click', onMapClick);
        */

        updateWeatherInfo(lat, lng);
    },
    (error) => {
        console.error("Error getting user location:", error);
    }
);

async function updateWeatherInfo(lat, lon) {
  var state = null;
  var city = null;

  if (forecastZoneLayer != null)
    map.removeLayer(forecastZoneLayer);

  //get weather data from weather.gov
  await getData("weather", lat, lon).then(function(data) {
    var weatherText = "The temperature in " + data.city + ", " + data.state + ", is currently " + data.temperature + "\u00B0F<br />"
      + data.city + "'s Air Quality Index is currently " + data.aqi + "<br /><br />Weekly weather forecast for " + data.city + ":<br />";

    for (const period of data.forecastWeekly) {
        weatherText += period.name + ": " + period.shortForecast + ", " + period.temperature + "\u00B0F. Wind: " 
          + period.windSpeed + " " + period.windDirection + "<br />";
    }

    document.getElementById('weatherInfo').innerHTML = weatherText;

    //swap lon and lat index positions
    var polyCoords = []
    for (const pos of data.geometry.coordinates[0])
      polyCoords.push([pos[1], pos[0]])

    forecastZoneLayer = L.polygon(polyCoords).addTo(map);
    forecastZoneLayer.bindPopup(data.city); //polygon region label

    state = data.state;
    city = data.city;
  }).catch(function(reason) {
    console.log(reason);
    document.getElementById("weatherInfo").textContent= "Failed to get weather data";
  });

  await getData("alerts", lat, lon).then(function(data) {
    alertData = data;
    if (state != null && city != null)
      document.getElementById("activeAlertHeader").textContent = `Active Alerts for ${city}, ${state}:`;
    if (data.features.length === 0)
      document.getElementById("activeAlertInfo").textContent = "There are no currently active alerts";

    var activeAlertHTML = ""
    for (var i = 0; i < data.features.length; i++) {
      var alertInfo = data.features[i].properties;
      activeAlertHTML += `
        <a id="activeAlertLink${i}" href="javascript:displayAlertInfo(${i})">${alertInfo.headline}</a>
        <br>
      `
    }
    document.getElementById("activeAlertInfo").insertAdjacentHTML("beforeend", activeAlertHTML);

  }).catch(function(reason) {
    console.log(reason);
    document.getElementById("activeAlertInfo").textContent = "Failed to get alert info";
  });
}

async function getData(reqType, lat, lon, zones = "") {
  let req = new FormData()
  req.append("reqType", reqType);
  req.append("lat", lat);
  req.append("lon", lon);
  req.append("zones", zones);
  const response = await fetch("/weather", {method:"POST", body:req});
  if (!response.ok) {
    throw new Error(`Failed to obtain ${reqType} data: ${response.status}`);
  }
  data = await response.json()
  return data;
}

async function displayAlertInfo(idx) {
  var alertInfo = alertData.features[idx];
  var descElem = document.getElementById("activeAlertContainer");

  if (descElem != null)
    descElem.remove();
  if (alertRegionMapLayer != null)
    map.removeLayer(alertRegionMapLayer);

  var polygons = []
  if (alertInfo.geometry != null) {
    for (const pos of alertInfo.geometry.coordinates[0]) {
      var polyCoords = []
      polyCoords.push([pos[1], pos[0]])
      polygons.push(L.polygon(polyCoords, {color: 'red'}));
    }
  } else {
    await getData("zoneInfo", "", "", alertInfo.properties.affectedZones).then(function(data) {
      for (const zone of data) {
        var polyCoords = []
        for (const pos of zone)
          polyCoords.push([pos[1], pos[0]])
        polygons.push(L.polygon(polyCoords, {color: 'red'}));
      }
    }).catch(function(reason) {
      console.log(reason);
    })
  }

  alertRegionMapLayer = L.featureGroup(polygons).addTo(map);
  alertRegionMapLayer.bindPopup(`${alertInfo.properties.event}: ${alertInfo.properties.areaDesc}`); //polygon region label
  map.fitBounds(alertRegionMapLayer.getBounds());

  document.getElementById(`activeAlertLink${idx}`).insertAdjacentHTML("afterend", `
    <div id="activeAlertContainer">
      <h4> ${alertInfo.properties.event}:</h4>
      <p id="alertType"> Alert Type: ${alertInfo.properties.messageType}</p>
      <p id="alertSeverity"> Alert Severity: ${alertInfo.properties.severity}
      <p id="alertDescription">Description: ${alertInfo.properties.description}</p>
      <p id="alertAdvisory">Advisory: ${alertInfo.properties.instruction}</p>
    </div>
  `);
}
    