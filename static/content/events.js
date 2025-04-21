
navigator.geolocation.getCurrentPosition(
    (position) => {
        //get user's current location
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        const eventCardList = document.getElementById("eventList");
        getData(lat, lng).then(function(data) {
            var listHtml = ""
            for (const eventCard of data) {
                listHtml += `<li>
                  <section class="event-card">
                    <section class="event-thumbnail">
                      <img src="${eventCard.imgsrc}">
                    </section>
                    <section class="event-details">
                      <a href="${eventCard.link}">
                      <h3>${eventCard.name}</h3>
                      </a>
                      <p>${eventCard.date}</p>
                      <p>${eventCard.location}</p>
                    </section>
                  </section>
                </li>`;
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