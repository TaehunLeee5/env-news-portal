import requests
import os
from flask import jsonify

__newsorgAPIKey = os.getenv("newsorgAPIKey")

def getNewsHeadlines():
    language = "en"
    sort = "relevancy"
    testLink = "https://newsapi.org/v2/everything?q=climate&sortBy={sort}&apiKey={apiKey}&language={language}".format(language=language, sort=sort, apiKey=__newsorgAPIKey)
    print(testLink)
    newsData = requests.get(testLink)

    if newsData.ok:
        return newsData.content

    return None