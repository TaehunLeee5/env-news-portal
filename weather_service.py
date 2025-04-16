import os
import requests

aqicnAPIKey = os.getenv("aqicnAPIKey")

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
            data['temperature'] = weatherInfo['properties']['periods'][0]['temperature']
            data['geometry'] = weatherInfo['geometry']
    #will be replaced with AirNow API
    print("https://api.waqi.info/feed/geo:" + lat + ";" + lon + "/?token=" + aqicnAPIKey)
    aqInfo = requests.get("https://api.waqi.info/feed/geo:" + lat + ";" + lon + "/?token=" + aqicnAPIKey)
    
    if aqInfo.ok:
        aqInfo = aqInfo.json()
        data['aqi'] = aqInfo['data']['aqi']
    
    print(data, flush=True)
    return data