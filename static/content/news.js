const articlesOnScroll = 10;
const articlesPerPage = 80;

var currentArticlesLoaded = 0;
var currentPage = 0;
var loading = true;

var articleData = null;

getNewsArticles().then(function(data) {
    articleData = data;
    document.getElementById("result-count").textContent = `Result Count: ${data.totalResults}`;
    loadArticles(currentPage, 25); //initally load 25 articles on page for now, load more on scroll later
    loading = false;

    window.addEventListener("scroll", function() {
        const isEndOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        console.log(isEndOfPage)
        if (isEndOfPage && !loading && currentArticlesLoaded < articlesPerPage) {
            loading = true;
            if (currentArticlesLoaded + articlesOnScroll > articlesPerPage)
                loadArticles(currentPage, articlesPerPage - currentArticlesLoaded);
            else
                loadArticles(currentPage, articlesOnScroll)
            loading = false;
        }
    });
});

async function getNewsArticles() {
    try {
        let req = new FormData();
        req.append("placeholder", "test");
        const response = await fetch("/news", {method:"POST", body:req});
        if (!response.ok) {
          throw new Error(`Failed to get news articles: ${response.status}`);
        }
        data = await response.json()
        return data;  
      } catch (error) {
        console.error(error.message);
      }
}

//loads specified number of articles, number to load is automatically capped at number of remaining unloaded articles in results
function loadArticles(pageNumber, nArticles) {
    var listHtml = "";
    articlesToLoad = Math.min(articleData.totalResults - (pageNumber - 1) * articlesPerPage + nArticles, nArticles); 
    for (var i = 0; i < articlesToLoad; i++) {
        const article = articleData.articles[pageNumber * articlesPerPage + i];

        listHtml += `
            <section class="news-card">
                <section class="news-thumbnail">
                    <img src="${article.urlToImage}">
                </section>
                <section class="news-details">
                    <a href="${article.url}">
                        <h3>${article.title}</h3>
                    </a>
                    <p>Author: ${article.author != null ? article.author : "Unknown"}</p>
                    <p>Date: ${article.publishedAt}</p>
                    <p>${article.description}</p>
                </section>
            </section>
        `;
    }
    document.getElementById("newsList").insertAdjacentHTML("beforeend", listHtml);
    currentArticlesLoaded += articlesToLoad;
}