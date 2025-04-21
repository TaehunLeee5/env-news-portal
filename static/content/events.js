
navigator.geolocation.getCurrentPosition(
    (position) => {
        //get user's current location
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        const eventCardList = document.getElementById("eventList");
        getData(lat, lng).then(function(data) {
            var listHtml = ""
            console.log(data.length);
            for (const eventCard of data) {
                listHtml += `<li>${eventCard}</li>`;
            }
            eventCardList.innerHTML = listHtml;
        });
    }
)

async function getData(lat, lon) {
    try {
      let req = new FormData()
      req.append("lat", lat);
      req.append("lon", lon);
      const response = await fetch("/events", {method:"POST", body:req});
      if (!response.ok) {
        throw new Error(`Failed to obtain event data: ${response.status}`);
      }
      data = await response.json()
      return data;
  
    } catch (error) {
      console.error(error.message);
    }
  }