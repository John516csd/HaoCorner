function loadResults(results) {
    var PAGE_SIZE = 32;
    var currentPage = 0;
    var totalPages = Math.ceil(results.resultCount / PAGE_SIZE);
    var country = new URLSearchParams(window.location.search).get('country') || 'us';

    function renderPage(page) {
        $("div.content-wrap").empty();

        var start = page * PAGE_SIZE;
        var end = Math.min(start + PAGE_SIZE, results.resultCount);

        for (var i = start; i < end; i++) {
            (function(idx) {
                var stm = "<a class='list'>" +
                    "<img src='" + results.results[idx].artworkUrl100.replace("100x100", "200x200") + "'/>" +
                    "<h2 class='album-name'>" + results.results[idx].collectionName + "</h2>" +
                    "<p class='artist-name'>" + results.results[idx].artistName + "</p>" +
                    "</a>";
                $("div.content-wrap").append(stm);
                $("div.content-wrap a:last").click(function() {
                    window.location.href = 'result.html'
                        + '?way=smart'
                        + '&input='   + encodeURIComponent(results.results[idx].artworkUrl100)
                        + '&store='   + encodeURIComponent(results.results[idx].collectionViewUrl)
                        + '&artist='  + encodeURIComponent(results.results[idx].artistName)
                        + '&title='   + encodeURIComponent(results.results[idx].collectionName)
                        + '&country=' + encodeURIComponent(country);
                });
            })(i);
        }

        $("div.content-wrap").append("<div style='clear: both;'></div>");

        if (totalPages > 1) {
            renderPagination(page);
        }
    }

    function renderPagination(page) {
        var prevDisabled = page === 0 ? " disabled" : "";
        var nextDisabled = page === totalPages - 1 ? " disabled" : "";
        var prevLabel = (window.lang ? window.lang.convert("上一页") : null) || "上一页";
        var nextLabel = (window.lang ? window.lang.convert("下一页") : null) || "下一页";
        var pagination =
            "<div class='pagination'>" +
                "<button class='page-btn prev-btn'" + prevDisabled + ">" + prevLabel + "</button>" +
                "<span class='page-info'>" + (page + 1) + " / " + totalPages + "</span>" +
                "<button class='page-btn next-btn'" + nextDisabled + ">" + nextLabel + "</button>" +
            "</div>";
        $("div.content-wrap").append(pagination);

        $(".prev-btn").click(function() {
            if (currentPage > 0) {
                currentPage--;
                var page = currentPage;
                setTimeout(function() {
                    renderPage(page);
                    $("html, body").scrollTop(0);
                }, 0);
            }
        });

        $(".next-btn").click(function() {
            if (currentPage < totalPages - 1) {
                currentPage++;
                var page = currentPage;
                setTimeout(function() {
                    renderPage(page);
                    $("html, body").scrollTop(0);
                }, 0);
            }
        });
    }

    if (results.resultCount === 0) {
        $("div.content-wrap").append("<p lang='zh' style='color: #999; font-size: 0.875em; padding:20% 0; text-align: center;'>对不起，未能查找到结果。</p>");
    } else {
        renderPage(currentPage);
    }
}
