import requests
import os

__newsorgAPIKey = os.getenv("newsorgAPIKey")

def getNewsHeadlines():
    language = "en"
    sort = "popularity"
    testLink = "https://newsapi.org/v2/everything?q=environment&sortBy={sort}&apiKey={apiKey}&language={language}".format(language=language, sort=sort, apiKey=__newsorgAPIKey)
    newsData = requests.get(testLink)

    print(newsData.text)
    return None