function mybook2litres(tabId) {
    chrome.tabs.executeScript(
        tabId,
        {code: "document.querySelector('.book-image').alt.trim()"},
        function(response) {
            chrome.tabs.create({
                'url': 'http://www.litres.ru/pages/biblio_search/?q='+response[0]
            }, function(tab) {
                chrome.tabs.executeScript(
                    tab.id,
                    {code: "document.querySelector('#searchresults .bookpage-cover').href"},
                    function(response) {
                        chrome.tabs.update(tab.id, {url: response[0]})
                    });
            });
        });
}


function litres2mybook(tabId) {
    chrome.tabs.executeScript(
        tabId,
        {code: "document.querySelector('meta[property=\"og:title\"]').content.trim()"},
        function(response) {
            chrome.tabs.create({
                'url': 'http://mybook.ru/search/books/?q='+response[0]
            }, function(tab) {
                chrome.tabs.executeScript(
                    tab.id,
                    {code: "document.querySelector('.search-result__item-info_author').href"},
                    function(response) {
                        chrome.tabs.update(tab.id, {url: response[0]})
                    });
            });
        });
}


chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.match(/https?:\/\/(?:\w+\.)?mybook/)) {
            mybook2litres(tabs[0].id);
        }
        if (tabs[0].url.match(/https?:\/\/(?:\w+\.)?litres.ru/)) {
            litres2mybook(tabs[0].id);
        }
    });
});
