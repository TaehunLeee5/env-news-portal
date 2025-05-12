
getNewsArticles().then(function(data) {
    document.getElementById("result-count").textContent = `Result Count: ${data.totalResults}`;
    var listHtml = "";
    var i = 0;
    for (const article of data.articles) {
        if (i == 25) //max 25 articles on page for now.
            break;
        i++;
        listHtml += `
            <section class="news-card">
                <section class="news-thumbnail">
                    <img src="${article.urlToImage}">
                </section>
                <section class="news-details">
                    <a href="${article.url}">
                        <h3>${article.title}</h3>
                    </a>
                    <p>Author: ${article.author}</p>
                    <p>Date: ${article.publishedAt}</p>
                    <p>${article.description}</p>
                </section>
            </section>
        `;
    }
    document.getElementById("newsList").innerHTML = listHtml;
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