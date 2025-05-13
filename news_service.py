import requests
import os

__newsorgAPIKey = os.getenv("newsorgAPIKey")

def getNewsHeadlines(pageNumber):
    language = "en"
    sort = "relevancy"
    testLink = "https://newsapi.org/v2/everything?q=climate&sortBy={sort}&apiKey={apiKey}&language={language}&page={pageNumber}".format(language=language, sort=sort, apiKey=__newsorgAPIKey, pageNumber=pageNumber)
    print(testLink)
    newsData = requests.get(testLink)

    if newsData.ok:
        return newsData.content

    return None