import os
import requests
import json

__openWeatherAPIKey = os.getenv("openWeatherAPIKey")
__aqicnAPIKey = os.getenv("aqicnAPIKey")

def getWeatherData(lat, lon):
    try:
        # Format coordinates to 4 decimal places for better accuracy
        lat = f"{float(lat):.4f}"
        lon = f"{float(lon):.4f}"
        
        data = {}
        # Get location information from Weather.gov
        locInfo = requests.get(f"https://api.weather.gov/points/{lat},{lon}")
        if not locInfo.ok:
            raise Exception(f"Weather.gov API error: {locInfo.status_code}")
            
        locInfo = locInfo.json()
        
        # Extract city and state information
        data['city'] = locInfo['properties']['relativeLocation']['properties']['city']
        data['state'] = locInfo['properties']['relativeLocation']['properties']['state']
        
        # Get weather forecast
        weatherInfo = requests.get(locInfo['properties']['forecast'])
        if not weatherInfo.ok:
            raise Exception(f"Weather forecast API error: {weatherInfo.status_code}")
            
        weatherInfo = weatherInfo.json()
        data['forecastWeekly'] = weatherInfo['properties']['periods']
        data['temperature'] = weatherInfo['properties']['periods'][0]['temperature']
        data['geometry'] = weatherInfo['geometry']
        
        # Get air quality information
        aqInfo = requests.get(f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={__aqicnAPIKey}")
        if aqInfo.ok:
            aqInfo = aqInfo.json()
            data['aqi'] = aqInfo['data']['aqi']
            data['pollutantAqi'] = aqInfo['data']['iaqi']
        
        # Get detailed pollutant information
        pollutantInfo = requests.get(f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={__openWeatherAPIKey}")
        if pollutantInfo.ok:
            pollutantInfo = pollutantInfo.json()
            data['pollutantInfo'] = pollutantInfo['list'][0]['components']
            
        return data
        
    except Exception as e:
        print(f"Error in getWeatherData: {str(e)}")
        return {
            'error': str(e),
            'city': 'Unknown',
            'state': 'Unknown',
            'temperature': 'N/A',
            'aqi': 'N/A',
            'forecastWeekly': [],
            'pollutantInfo': {},
            'pollutantAqi': {'h': {'v': 'N/A'}}
        }

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