// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {

    Parse.Cloud.httpRequest({
        url: 'http://www.google.com/search',
        params: {
            q: 'Sean Plott'
        },
        success: function (httpResponse) {
            console.log(httpResponse.text);
            response.success(httpResponse.text);
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
            response.success('Request failed with response code ' + httpResponse.status);
        }
    });
});
