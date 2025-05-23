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
    var marker = L.marker([lat, lng]).addTo(map);
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

    // Hide loading message after map is initialized
    document.getElementById('loadingMessage').style.display = 'none';

    updateWeatherInfo(lat, lng);
  },
  (error) => {
    console.error("Error getting user location:", error);
    // Hide loading message even if there's an error
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('weatherInfo').innerHTML = "Error getting your location. Please enable location services and refresh the page.";
  }
);

async function updateWeatherInfo(lat, lon) {
  var state = null;
  var city = null;

  // Show loading message and clear previous data
  document.getElementById('weatherLoadingMessage').style.display = 'block';
  document.getElementById('weatherTiles').innerHTML = '';
  document.getElementById('weatherTemp').textContent = '';

  if (forecastZoneLayer != null)
    map.removeLayer(forecastZoneLayer);

  //get weather data from weather.gov
  await getData("weather", lat, lon).then(function (data) {
    // Hide loading message
    document.getElementById('weatherLoadingMessage').style.display = 'none';
    // Set temperature
    document.getElementById('weatherTemp').textContent = `${data.temperature}\u00B0F in ${data.city}, ${data.state}`;
    // Set AQI
    document.getElementById('weatherAQI').textContent = `AQI: ${data.aqi}`;
    // Build weekly forecast tiles
    let tilesHtml = '';
    for (const period of data.forecastWeekly) {
      // Pick weather icon class based on shortForecast
      let iconClass = getWeatherIconClass(period.shortForecast);
      // Wind direction arrow (Font Awesome)
      let windDir = period.windDirection || '';
      let windArrow = getWindArrowIcon(windDir);
      tilesHtml += `
        <div class="weather-tile">
          <div class="tile-day">${period.name}</div>
          <i class="wi ${iconClass}"></i>
          <div class="tile-temp">${period.temperature}&deg;F</div>
          <div class="tile-wind"><i class="fa-solid fa-wind"></i> ${period.windSpeed} <span title="${windDir}">${windArrow}</span></div>
        </div>
      `;
    }
    document.getElementById('weatherTiles').innerHTML = tilesHtml;
    document.getElementById('weatherInfo').style.display = 'none';

    //swap lon and lat index positions
    var polyCoords = []
    for (const pos of data.geometry.coordinates[0])
      polyCoords.push([pos[1], pos[0]])

    forecastZoneLayer = L.polygon(polyCoords).addTo(map);
    forecastZoneLayer.bindPopup(data.city); //polygon region label

    state = data.state;
    city = data.city;
  }).catch(function (reason) {
    document.getElementById('weatherLoadingMessage').style.display = 'none';
    console.log(reason);
    document.getElementById("weatherInfo").textContent = "Failed to get weather data";
  });

  //getting alert data from weather.gov
  await getData("alerts", lat, lon).then(function (data) {
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
        <br/><br/>
      `
    }
    document.getElementById("activeAlertInfo").insertAdjacentHTML("beforeend", activeAlertHTML);

  }).catch(function (reason) {
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
  const response = await fetch("/weather", { method: "POST", body: req });
  if (!response.ok) {
    throw new Error(`Failed to obtain ${reqType} data: ${response.status}`);
  }
  data = await response.json()
  return data;
}

async function displayAlertInfo(idx) {
  var alertInfo = alertData.features[idx];
  var descElem = document.getElementById("activeAlertContainer");

  //clear existing alerts being displayed
  if (descElem != null)
    descElem.remove();
  if (alertRegionMapLayer != null)
    map.removeLayer(alertRegionMapLayer);

  //read region coordinates
  var polygons = []
  if (alertInfo.geometry != null) {
    for (const pos of alertInfo.geometry.coordinates[0]) {
      var polyCoords = []
      polyCoords.push([pos[1], pos[0]])
      polygons.push(L.polygon(polyCoords, { color: 'red' }));
    }
  } else {
    await getData("zoneInfo", "", "", alertInfo.properties.affectedZones).then(function (data) {
      for (const zone of data) {
        var polyCoords = []
        for (const pos of zone)
          polyCoords.push([pos[1], pos[0]])
        polygons.push(L.polygon(polyCoords, { color: 'red' }));
      }
    }).catch(function (reason) {
      console.log(reason);
    })
  }

  //draw alert regions
  alertRegionMapLayer = L.featureGroup(polygons).addTo(map);
  alertRegionMapLayer.bindPopup(`${alertInfo.properties.event}: ${alertInfo.properties.areaDesc}`); //polygon region label
  map.fitBounds(alertRegionMapLayer.getBounds());

  //display alert description
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

function getWeatherIconClass(shortForecast) {
  // Simple mapping for demo; expand as needed
  shortForecast = shortForecast.toLowerCase();
  if (shortForecast.includes('sunny') || shortForecast.includes('clear')) return 'wi-day-sunny';
  if (shortForecast.includes('cloudy')) return 'wi-cloudy';
  if (shortForecast.includes('rain')) return 'wi-rain';
  if (shortForecast.includes('snow')) return 'wi-snow';
  if (shortForecast.includes('fog')) return 'wi-fog';
  if (shortForecast.includes('thunder')) return 'wi-thunderstorm';
  return 'wi-na';
}

function getWindArrowIcon(direction) {
  // Map wind direction to Font Awesome arrow rotation
  const dirMap = {
    'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
    'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
    'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
    'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
  };
  let deg = dirMap[direction] || 0;
  return `<i class='fa-solid fa-arrow-up' style='transform:rotate(${deg}deg)'></i>`;
}
