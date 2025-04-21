import os
import requests

__openWeatherAPIKey = os.getenv("openWeatherAPIKey")

#given latitude and longitude coordinates, returns the names of the x nearest cities, where x is specified by the limit parameter
#also returns names of the state and country each city is located within
def reverseGeolocate(lat, lon, limit):
    return requests.get("http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={apiKey}".format(lat=lat, lon=lon, limit=limit, apiKey=__openWeatherAPIKey))
