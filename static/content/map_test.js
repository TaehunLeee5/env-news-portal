
navigator.geolocation.getCurrentPosition(
    (position) => {
        //get user's current location
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        //draw map centered at location at zoom level
        var map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //create a marker and label at location
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

        getData(lat, lng); //get weather data from weather.gov

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
        polygon.bindPopup("I am a polygon."); //polygon region label
        */
    },
    (error) => {
        console.error("Error getting user location:", error);
    }
);

async function getData(lat, lon) {
    try {
      let req = new FormData()
      req.append("lat", lat);
      req.append("lon", lon);
      const response = await fetch("/map_test", {method:"POST", body:req});
      if (!response.ok) {
        document.getElementById("weatherInfo").innerHTML = "Failed to get weather data"
        throw new Error(`Failed to obtain weather data: ${response.status}`);
      }
      const data = await response.json()
      document.getElementById('weatherInfo').innerHTML = "The temperature in " + data.city + ", " + data.state + ", is " + data.temp + "\u00B0F<br />"
        + data.city + "'s Air Quality Index is " + data.aqi; 
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  }
    