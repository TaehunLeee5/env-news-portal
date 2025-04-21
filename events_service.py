from bs4 import BeautifulSoup
from flask import jsonify
import geolocator_service as gs
import requests

#returns a list of community events, each containing description, date, tags, etc.
def getCommunityEvents(lat, lon):
    locationData = gs.reverseGeolocate(lat, lon, 1)
    eventData = []
    if locationData.ok:
        locationData = locationData.json()
        city = locationData[0]["name"]
        state = locationData[0]["state"]
        pageData = requests.get("https://www.eventbrite.com/d/{state}--{city}/environmental".format(state = stateAbbrev[state], city = city))
        pageContent = BeautifulSoup(pageData.content, "html.parser")
        eventList = pageContent.find_all("section", {"class": "event-card-details"})
        
        skip = False
        
        for event in eventList:
            skip = not skip
            if skip == True: #workaround for duplicate event cards
                continue
            
            eventDetails = event.find_all(["h3", "p"])
            if len(eventDetails) > 3:
                del eventDetails[0] #removes urgency labels like "Just added" or "Going fast"
            eventData.append("".join(map(str, eventDetails)))

    return jsonify(eventData)

#abbreviations of us state names
stateAbbrev={"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","NewHampshire":"NH","NewJersey":"NJ","NewMexico":"NM","NewYork":"NY","NorthCarolina":"NC","NorthDakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","RhodeIsland":"RI","SouthCarolina":"SC","SouthDakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","WestVirginia":"WV","Wisconsin":"WI","Wyoming":"WY","DistrictofColumbia":"DC","AmericanSamoa":"AS","Guam":"GU","NorthernMarianaIslands":"MP","PuertoRico":"PR","UnitedStatesMinorOutlyingIslands":"UM","VirginIslands,U.S.":"VI",}