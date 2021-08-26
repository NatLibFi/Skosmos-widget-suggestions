// declaring a namespace for the plugin
var SUGGESTIONS = SUGGESTIONS || {};

const delay = ms => new Promise(resolved => setTimeout(resolved, ms));

SUGGESTIONS = {
    renderNew: async function() {
        $("#vocab-info").append(Handlebars.compile( $("#suggestions-new").html())(
            {
                "url": this.fetchUrl() ? this.fetchUrl() : '',
                "lang": lang ? lang : '',
                "vocab": vocab ? vocab : ''
            }
            ));
            await delay(2000);
            window.location.href.includes("#directnew") ? window.document.getElementById("fordirect").click() : '';
        },
        renderChange: function(data) {
            $(".concept-main").append(Handlebars.compile( $("#suggestions-change").html())(
                {
                    "url": this.fetchUrl() ? this.fetchUrl() : '',
                    "lang": lang ? lang : '',
                    "vocab": vocab ? vocab : '',
                    "label": data.prefLabels[0].label ? data.prefLabels[0].label : '',
                    "uri": this.fetchUri(data) ? this.fetchUri(data) : ''
                }
                ));
            },
            
            fetchUri: data => data.uri ? data.uri : '',
            fetchUrl: () => window.location.href
            
        };
        
        $(function() {
            window.suggestionsWidget = function(data) {
                $('#vocab-info').length > 0 ? SUGGESTIONS.renderNew() : '';
                $('.concept-main').length > 0 ? SUGGESTIONS.renderChange(data) : '';
            };
        });
        