// declaring a namespace for the plugin
var SUGGESTIONS = SUGGESTIONS || {};

const delay = ms => new Promise(resolved => setTimeout(resolved, ms));

SUGGESTIONS = {
    renderNew: function() {
        $("#vocab-info").append(Handlebars.compile( $("#suggestions-new").html())({
            // "url": this.fetchUrl() ? this.fetchUrl() : '',
            "lang": lang ? lang : '',
            "vocab": vocab ? vocab : ''
            }));
        window.onload = async function wakeUpTheForm() {
            var boxElement = document.createElement("div");
            boxElement.style.position = "fixed";
            boxElement.style.top = 20 + "%";
            boxElement.style.left = 20 + "%";
            boxElement.style.background = "white";
            // boxElement.style.background = "#83cfc8";
            boxElement.style.borderStyle = "solid";
            boxElement.style.borderWidth = 4 + "px";
            boxElement.style.borderColor = "#83cfc8";
            boxElement.style.width = 50 + "%";
            boxElement.style.height = 70 + "%";
            boxElement.style.textAlign = "center";
            boxElement.style.verticalAlign = "middle";
            boxElement.style.lineHeight = 250 + "px";
            boxElement.innerHTML = "Opening the form";
            document.getElementById("vocab-info").appendChild(boxElement);
            await delay(10000); // Palauta takaisin jos ei toimi
            boxElement.remove();
            window.location.href.includes("#suggestion") ? window.document.getElementById("fordirectnew").click() : '';
        }
    },

    renderChange: async function(data) {
        $(".concept-main").append(Handlebars.compile( $("#suggestions-change").html())({
            // "url": this.fetchUrl() ? this.fetchUrl() : '',
            "lang": lang ? lang : '',
            "vocab": vocab ? vocab : '',
            "label": data.prefLabels[0].label ? data.prefLabels[0].label : '',
            "uri": this.fetchUri(data) ? this.fetchUri(data) : ''
            }));
        await delay(1); // Palauta takaisin jos ei toimi
        window.location.href.includes("#suggestion") ? window.document.getElementById("fordirectmodify").click() : '';
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
