'use strict';

var Youtube = (function () {
    function Youtube() {
    }

    /**
     * Called to search YouTube videos.
     * @param search    The search text
     * @param pageToken (optional) The token for the next page in the result set
     */
    Youtube.prototype.search = function (search, pageToken) {
        var defer = $.Deferred();
        var requestObject = {
            part: "snippet",
            type: "video",
            maxResults: 20,
            publishedAfter: "2014-01-01T00:00:00Z",
            q: encodeURIComponent(search).replace(/%20/g, "+"),
            order: "viewCount",
            regionCode: 'US',
            relevanceLanguage: 'en'
        };
        if (isValidString(pageToken)) requestObject.pageToken = pageToken;
        var request = gapi.client.youtube.search.list(requestObject);

        // Execute
        dispMessage("Searching...");
        request.execute(function(response) {
            dispMessage("");
            var results = (response.hasOwnProperty("result")) ? response.result : null;
            if (results) {
                defer.resolve(results);
            } else {
                dispErrMessage("There was a problem connecting to YouTube. Please try again later.");
                defer.reject();
            }
        });

        return defer.promise();
    };

    return Youtube;
}());

