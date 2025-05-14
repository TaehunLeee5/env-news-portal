import os
import requests

__openWeatherAPIKey = os.getenv("openWeatherAPIKey")
__aqicnAPIKey = os.getenv("aqicnAPIKey")

def getWeatherData(lat, lon):
    data = {}
    locInfo = requests.get("https://api.weather.gov/points/" + lat + "," + lon)
    if locInfo.ok:
        locInfo = locInfo.json()

        data['city'] = locInfo['properties']['relativeLocation']['properties']['city']
        data['state'] = locInfo['properties']['relativeLocation']['properties']['state']
        weatherInfo = requests.get(locInfo['properties']['forecast'])
        if weatherInfo.ok:
            weatherInfo = weatherInfo.json()
            data['forecastWeekly'] = weatherInfo['properties']['periods']
            data['temperature'] = weatherInfo['properties']['periods'][0]['temperature']
            data['geometry'] = weatherInfo['geometry']
    #will be replaced with AirNow API
    print("https://api.waqi.info/feed/geo:" + lat + ";" + lon + "/?token=" + __aqicnAPIKey, flush=True)
    aqInfo = requests.get("https://api.waqi.info/feed/geo:" + lat + ";" + lon + "/?token=" + __aqicnAPIKey)
    
    if aqInfo.ok:
        aqInfo = aqInfo.json()
        data['aqi'] = aqInfo['data']['aqi']
        data['pollutantAqi'] = aqInfo['data']['iaqi']

    pollutantInfo = requests.get("http://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + __openWeatherAPIKey)
    if pollutantInfo.ok:
        pollutantInfo = pollutantInfo.json()
        data['pollutantInfo'] = pollutantInfo['list'][0]['components']
    return data

def getAlertData(lat, lon):
    data = {}
    #alertInfo = requests.get("https://api.weather.gov/alerts/active?area=CA") #for testing purposes
    alertInfo = requests.get("https://api.weather.gov/alerts/active?point=" + lat + "," + lon)
    if alertInfo.ok:
        data = alertInfo.content
    
    return data

# possible future implementations: 
# check if link is an actual zone link from weather.gov (link validation)
# proper error message handling for when a req for a zone fails
def getWeatherZoneGeometry(zones):
    data = []

    for zoneLink in zones.split(","):
        zoneGeomData = requests.get(zoneLink)
        if zoneGeomData.ok:
            zoneGeomData = zoneGeomData.json()
            zoneCoords = []
            for coords in zoneGeomData['geometry']['coordinates'][0]:
                zoneCoords.append(coords)
            data.append(zoneCoords)

    return data