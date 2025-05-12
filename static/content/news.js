const LocalStorage = window.localStorage;

const articlesOnScroll = 10;
const articlesPerPage = 100;

var currentArticlesLoaded = 0;
var currentPage = 0;
var loading = true;
var articleRetrievalSuccess = false;
var articleData = null;

if ((articleData = LocalStorage.getItem("articleData")) == null) {
    getNewsArticles(pageNumber).then(function(data) {
        articleData = data;
        document.getElementById("result-count").textContent = `Result Count: ${articleData.totalResults}`;
        loadArticles(currentPage, 25); //initally load 25 articles on page for now, load more on scroll later

        articleRetrievalSuccess = true;
        loading = false;
        LocalStorage.setItem("articleData", JSON.stringify(articleData));
        initPage();
    });
} else {
    console.log("retrieved article data from cache");
    articleData = JSON.parse(articleData);
    loadArticles(currentPage, 25);
    articleRetrievalSuccess = true;
    loading = false;
    initPage();
}

console.log("length:" + articleData.articles.length);
async function getNewsArticles(pageNumber) {
    try {
        let req = new FormData();
        req.append("pageNumber", pageNumber + 1);
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
async function loadArticles(pageNumber, nArticles) {
    if (currentPage != pageNumber) {
        window.scrollTo(0, 0);
        await getNewsArticles(pageNumber).then(function(data) {
            articleData = data;
        });
        document.getElementById("newsList").innerHTML = "";
        currentPage = pageNumber;
        currentArticlesLoaded = 0;
    }
    var listHtml = "";
    articlesToLoad = Math.min(articleData.articles.length, nArticles); 
            console.log(articlesToLoad);

    for (var i = 0; i < articlesToLoad; i++) {
        console.log(currentArticlesLoaded + i);
        console.log("len:" + articleData.articles.length);
        const article = articleData.articles[currentArticlesLoaded + i];

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

function initPage() {
    window.addEventListener("scroll", function() {
        const isEndOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        if (isEndOfPage && !loading && currentArticlesLoaded < articlesPerPage) {
            loading = true;
            if (currentArticlesLoaded + articlesOnScroll > articlesPerPage)
                loadArticles(currentPage, articlesPerPage - currentArticlesLoaded);
            else
                loadArticles(currentPage, articlesOnScroll)
            loading = false;
        }
    });

    for (var i = 0; i < 3; i++) {
        document.getElementById("page-nav").insertAdjacentHTML("beforeend", `<a href="javascript:loadArticles(${i + 1}, 25)"> ${i+1} </a>`);
        if (articleData.totalResults < (i + 1) * articlesPerPage)
            break;
    }
    document.getElementById("page-nav").insertAdjacentHTML("beforeend", "<p> ... </p>");

    let nPages = Math.ceil(articleData.totalResults / articlesPerPage);
    for (var i = nPages - 3; i < nPages; i++) {
        document.getElementById("page-nav").insertAdjacentHTML("beforeend", `<a href="javascript:loadArticles(${i + 1}, 25)"> ${i+1} </a>`);
    }
}