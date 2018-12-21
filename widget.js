// declaring a namespace for the plugin
var SUGGESTIONS = SUGGESTIONS || {};

// the URL of the suggestion management platform's API without trailing slash:
var SUGGESTION_API_URL = '';

SUGGESTIONS = {
    renderNew: function() {
        var context = {
            "url": SUGGESTION_API_URL,
            "lang": lang,
            "vocab": vocab
        };
        $("#vocab-info").append(Handlebars.compile( $("#suggestions-new").html())(context));
    },
    renderChange: function(data) {
        var context = {
            "url": SUGGESTION_API_URL,
            "lang": lang,
            "vocab": vocab,
            "label": data.prefLabels[0].label,
            "uri": this.fetchUri(data)
        };
        $(".concept-main").append(Handlebars.compile( $("#suggestions-change").html())(context));
    },
    fetchUri: function(data) {
        if (data.uri) {
            return data.uri;
        }
        return '';
    }
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