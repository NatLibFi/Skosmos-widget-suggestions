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
        openTheBox("vocab-info");
        window.location.href.includes("#suggestion") ? window.document.getElementById("fordirectnew").click() : '';
    },

    renderChange: async function(data) {
        $(".concept-main").append(Handlebars.compile( $("#suggestions-change").html())({
            // "url": this.fetchUrl() ? this.fetchUrl() : '',
            "lang": lang ? lang : '',
            "vocab": vocab ? vocab : '',
            "label": data.prefLabels[0].label ? data.prefLabels[0].label : '',
            "uri": this.fetchUri(data) ? this.fetchUri(data) : ''
            }));

        if (window.location.href.includes("#suggestion") && window.location.href.includes("page/p")) {
            async function display_image(src, width, height, alt) {
                var a = document.createElement("img");
                a.src = src;
                a.width = width;
                a.height = height;
                a.alt = alt;
                a.style.position = "absolute";
                a.style.top = 30 + "%";
                a.style.left = 1 + "%";
                document.body.appendChild(a);
                await delay(10000);
                document.body.removeChild(a);
            }

            display_image(window.location.toString().split("yso")[0] + "plugins/suggestions/component-bundler/src/components/resources/wait-big.gif",
                385,
                169,
                "ladataan ehdotuslomaketta");
        }
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

function openTheBox(rootElement) {
    if (window.location.href.includes("#suggestion")) {
        window.onload = async function wakeUpTheForm() {
            var boxElement = document.createElement("div");
            boxElement.setAttribute("id", "message");
            var image = new Image();
            image.src = window.location.toString().split("yso")[0] + "plugins/suggestions/component-bundler/src/components/resources/wait.gif";
            image.width = 300;
            image.height = 15;
            boxElement.style.position = "fixed";
            boxElement.style.top = 50 + "%";
            boxElement.style.left = 1 + "%";
            boxElement.style.background = "white";
            boxElement.style.opacity = 1;
            // boxElement.style.background = "#83cfc8";
            boxElement.style.borderStyle = "solid";
            boxElement.style.borderWidth = 4 + "px";
            boxElement.style.borderColor = "#83cfc8";
            boxElement.style.textAlign = "center";
            boxElement.style.verticalAlign = "middle";
            boxElement.style.padding = 20 +"px";
            boxElement.style.lineHeight = 30 + "px";
            boxElement.innerHTML += "<p id='fiMsg'>Kerätään tietoja ehdotuslomaketta varten</p>";
            boxElement.innerHTML += "<p id='svMsg'>Samlar information för förslagsblanketten</p>";
            boxElement.innerHTML += "<p id='enMsg'>Collecting information for the suggestion form</p>";
            if (rootElement !== "noElement") {
                document.getElementById(rootElement).appendChild(boxElement);
            }
            document.getElementById("message").append(image);
            await delay(10000);
            boxElement.remove();
            // window.location.href.includes("#suggestion") ? window.document.getElementById("fordirectnew").click() : '';
        }
    }
}
