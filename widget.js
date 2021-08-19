// declaring a namespace for the plugin
var SUGGESTIONS = SUGGESTIONS || {};

// the URL of the suggestion management platform's API with trailing slash:
// var API_RAW = 'https://api.github.com/repos/miguelahonen/c/issues'
// new_str = str.slice(0, -11);
// var SUGGESTION_API_BASE_URL = API_RAW.slice(0, -11);
// var SUGGESTION_API_BASE_URL = 'https://api.github.com/repos/miguelahonen/c/issues'
var SUGGESTION_API_BASE_URL = 

SUGGESTIONS = {
    renderNew: function() {
        var context = {
            "url": this.fetchUrl() ? this.fetchUrl() : '',
            "lang": lang ? lang : '',
            "vocab": vocab ? vocab : ''
        };
        // var context = {
        //     "url": SUGGESTION_API_BASE_URL,
        //     "lang": lang,
        //     "vocab": vocab
        // };
        console.log("Tulosta tähän vakiotavaraa..");
        console.log(context);
        // $("#vocab-info").append(Handlebars.compile( $("#suggestions-new").html())(context));
        // $( "body" ).append( "<div id='object1'></div>", document.createElement( "div" ));
        $("#vocab-info").append(Handlebars.compile( $("#suggestions-new").html())(context));
    },
    renderChange: function(data) {

        var context = {
            "url": this.fetchUrl() ? this.fetchUrl() : '',
            "lang": lang ? lang : '',
            "vocab": vocab ? vocab : '',
            "label": data.prefLabels[0].label ? data.prefLabels[0].label : '',
            "uri": this.fetchUri(data) ? this.fetchUri(data) : ''
            // (syntax) ? document.write("My evil twin emerges"): "";
        };
        // var context = {
        //     "url": SUGGESTION_API_BASE_URL,
        //     "lang": lang,
        //     "vocab": vocab,
        //     "label": data.prefLabels[0].label,
        //     "uri": this.fetchUri(data)
        // };
        console.log("Tulosta tähän muutostavaraa..");
        console.log(context);
        $(".concept-main").append(Handlebars.compile( $("#suggestions-change").html())(context));
    },

    fetchUri: data => data.uri ? data.uri : '',
    // fetchUri: function(data) {
    //     if (data.uri) {
    //         return data.uri;
    //     }
    //     return '';
    // },
    fetchUrl: () => window.location.href 
    
};

$(function() {
    window.suggestionsWidget = function(data) {
        if ($('#vocab-info').length > 0) {
            SUGGESTIONS.renderNew();
        }
        if ($('.concept-main').length > 0) {
            SUGGESTIONS.renderChange(data);
        }
    };
});
