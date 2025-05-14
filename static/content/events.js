//very spaghetti

var links = []
navigator.geolocation.getCurrentPosition(
  (position) => {
    //get user's current location
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log(`Latitude: ${lat}, longitude: ${lng}`);

    const eventCardList = document.getElementById("eventList");
    getEventList(lat, lng).then(function (data) {
      var listHtml = ""
      for (const eventCard of data) {
        listHtml += `
        <div class="event-tile">
          <img class="event-img" src="${eventCard.imgsrc}" alt="Event image">
          <div class="event-content">
            <h3 class="event-title">${eventCard.name}</h3>
            <div class="event-date">${eventCard.date}</div>
            <div class="event-location">${eventCard.location}</div>
            <a class="event-link" href="${eventCard.link}" target="_blank" rel="noopener">More Info</a>
          </div>
        </div>`;
      }
      eventCardList.innerHTML = listHtml;
      if (typeof hideLoadingMessage === 'function') hideLoadingMessage();
    });
  }
)

function displayEventInfo(link, name, imgsrc) {
  document.getElementById("dialog-container").style.display = "none"
  document.getElementById("event-popup").showModal();
  getEventInfo(link).then(function (data) {
    document.getElementById("modal-title").textContent = name;
    document.getElementById("modal-img").src = imgsrc;
    document.getElementById("modal-address").textContent = data["address"];
    document.getElementById("modal-description").innerHTML = data["description"];
    document.getElementById("modal-link").href = link
    document.getElementById("dialog-container").style.display = "block"
  });
}

//combine functions into one?
async function getEventInfo(link) {
  try {
    let req = new FormData();
    req.append("link", link);
    const response = await fetch("/events", { method: "POST", body: req });
    if (!response.ok) {
      throw new Error(`Failed to obtain event info: ${response.status}`);
    }
    data = await response.json()
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getEventList(lat, lon) {
  try {
    let req = new FormData()
    req.append("lat", lat);
    req.append("lon", lon);
    const response = await fetch("/events", { method: "POST", body: req });
    if (!response.ok) {
      throw new Error(`Failed to obtain event data: ${response.status}`);
    }
    data = await response.json()
    return data;

  } catch (error) {
    console.error(error.message);
  }
}