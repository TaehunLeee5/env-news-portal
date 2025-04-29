from bs4 import BeautifulSoup
from flask import jsonify
import geolocator_service as gs
import requests

__headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}

#returns a list of community events, each containing description, date, tags, etc.
#events are scraped from eventbrite site
def getCommunityEvents(lat, lon):
    locationData = gs.reverseGeolocate(lat, lon, 1)
    eventData = []
    if locationData.ok:
        locationData = locationData.json()
        city = locationData[0]["name"]
        state = locationData[0]["state"]
        pageData = requests.get("https://www.eventbrite.com/d/{state}--{city}/environmental".format(state = stateAbbrev[state], city = city), headers=__headers)
        pageContent = BeautifulSoup(pageData.content, "html.parser")
        eventList = pageContent.find_all("section", {"class": "event-card-details"})
        eventThumbnailList = pageContent.find_all("img", {"class": "event-card-image"})
        skip = False
        
        for i in range(len(eventList)):
            skip = not skip
            if skip == True: #workaround for duplicate event cards
                continue
            
            eventDetails = eventList[i].find_all(["a", "p"])
            detailList = {}
            if len(eventDetails) > 3 and eventDetails[0].name != "a" :
                del eventDetails[0] #removes urgency labels like "Just added" or "Going fast"
            
            detailList["name"] = eventDetails[0].get_text()
            detailList["link"] = eventDetails[0]["href"]
            detailList["date"] = eventDetails[1].get_text()
            detailList["location"] = eventDetails[2].get_text()
            detailList["imgsrc"] = eventThumbnailList[i]["src"]
            eventData.append(detailList)

    return jsonify(eventData)

#TODO: check if link is not malicious, make request using newly added eventbrite API key
def getEventInfo(link):
    eventData = {}
    pageData = requests.get(link, headers=__headers)
    pageContent = BeautifulSoup(pageData.content, "html.parser")
    eventDesc = pageContent.find("div", class_="eds-text--left")
    eventAddress = pageContent.find("p", class_="location-info__address-text")
    eventData["description"] = str(eventDesc) #NOTE: pulls raw html format from external site; security risk

    eventData["address"] = eventAddress.next_sibling if eventAddress.next_sibling != None else eventAddress.get_text()
    return jsonify(eventData)

#abbreviations of us state names
stateAbbrev={"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","NewHampshire":"NH","NewJersey":"NJ","NewMexico":"NM","NewYork":"NY","NorthCarolina":"NC","NorthDakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","RhodeIsland":"RI","SouthCarolina":"SC","SouthDakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","WestVirginia":"WV","Wisconsin":"WI","Wyoming":"WY","DistrictofColumbia":"DC","AmericanSamoa":"AS","Guam":"GU","NorthernMarianaIslands":"MP","PuertoRico":"PR","UnitedStatesMinorOutlyingIslands":"UM","VirginIslands,U.S.":"VI",}