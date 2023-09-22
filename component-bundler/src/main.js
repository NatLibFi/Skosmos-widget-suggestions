import { createApp, ref } from 'vue';
import { createI18n } from 'vue-i18n';
import translations from './i18n/i18n';
// import Vuelidate from 'vuelidate';
import { useVuelidate } from '@vuelidate/core'; // Import useVuelidate function
import SuggestNewButton from '@/components/SuggestNewButton.vue';
import SuggestChangeButton from '@/components/SuggestChangeButton.vue';

const i18n = createI18n({
    // locale: 'fi',
    locale: window.lang,
    messages: translations,
});

const app = createApp(SuggestNewButton);
const app2 = createApp(SuggestChangeButton);

// Provide i18n instance to components
// app.provide('$t', i18n.global.t);
app.provide('$t', i18n.global.t);
app.provide('pageUrl', window.location.href);
// const testVar = 'testiteksti'
app2.provide('$t', i18n.global.t);
app2.provide('pageUrlX', window.location.href);

const testi = ref('This is a ref variable');
app.provide('testi', testi);

document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('pref-label');
    if (element) {
        const labelText = element.textContent;
        app2.provide('labelX', labelText);

        app2.provide('testi', testi.value);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('uri-input-box');
    if (element) {
        const uriText = element.textContent;
        app2.provide('uriX', uriText);
    }
    // Better?
    /*const element = document.querySelector('#uri-input-box');
    if (element) {
        const uriText = element.textContent;
        app2.provide('uriX', uriText);
    }*/


})




app.use(i18n); // Register global i18n
app2.use(i18n); // Register global i18n
// app.use(useVuelidate); // Use Vuelidate plugin

// Define the custom elements
customElements.define('suggest-new-button', class extends HTMLElement {
    connectedCallback() {
        const element = app.mount(document.createElement('div'));
        // this.appendChild(element.$el);
        if (element) {
            this.appendChild(element.$el);
        } else {
            console.log("The element not found")
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('Dom muuttuu')
    const element = document.getElementById('uri-input-box');
    if (element) {
        const uriText = element.textContent;
        app2.provide('uriX', uriText);
    }
})


// !!! Tämä saattaa olla ongelman alkujuuri eli se, että esitellään elements, vaikka se pitäisi myöhemmin rakentaa app2.mountissa

let element; // Define a variable outside the connectedCallback

// Tässä luodaan suggest-change-button-html-elemntti
customElements.define('suggest-change-button', class extends HTMLElement {


    // Kustoimoiduille elementeille tarkoitettu Lifecycle-metodi, joka hyödyntää Web Components APIa. Sitä kutsutaan kun customoitu elementti
    // (suggest-change-button) liitetään DOMiin, käytännössä lisätty dokumenttiin (window.document).
    // Tässä vaiheessa olisi mahdollista toteuttaa alustavia toimenpiteitä tai vaikka asettaa
    // event listenereitä, joiden halutaan olevan aktiivisia, kun elementti on dokumentissa.
    connectedCallback() {
        console.log("E - main.js, suggest-change-button")


        //// 2023-09-22 testausta

        // fordirectmodify

        // const elementIdTest = window.document.getElementById('fordirectmodify');
        // console.log('EEEE elementIdTest', elementIdTest)



        const elementABC = document.getElementById('pref-label');
        // console.log('elementABC', elementABC[0])
        

        // elementABC.addEventListener('mouseover', function () {
        //     console.log('AAAAAAAA ihan mitä vaan :-D')
        //     console.log('AAAAA elementABC', elementABC)
        //     // alert("Päivää1")
        // })

        // const elementABC = document.getElementById('pref-label');
        // // console.log('elementABC', elementABC[0])

        // elementABC.addEventListener('click', function () {
        //     console.log('ihan mitä vaan :-D')
        //     // alert("Päivää1")
        // })




        ////


        // Aiemmin luotiin app2 eli const app2 = createApp(SuggestChangeButton);
        // Alla siihen liitetään div-elementti, johon sovellus, SuggestChangeButtoniin perustuva app2 implementoi kaikki toimintonsa
        // const element = app2.mount(document.createElement('div'));

        if (!element) {
            /// QQ
            // const uriText = "qweqweqwe";
            
            // const app3 = createApp(SuggestChangeButton);
            // const elementUri = document.getElementById('uri-input-box');
            // console.log('XXXXXX elementUri', elementUri)
            // if (elementUri) {
            //     const uriText = elementUri.textContent;
            //     app3.provide('uriX', uriText);
            // }
            // app3.provide('$t', i18n.global.t);
            // app3.provide('pageUrlX', window.location.href);
            // // app3.provide('uriX', uriText);
            // app3.use(i18n); // Register global i18n
            element = app2.mount(document.createElement('div'));
        }

        if (element) {
            this.appendChild(element.$el);
        } else {
            console.log("The element not found");
        }



        if (typeof element == 'undefined') {
            // const element = app2.mount(document.createElement('div'));
            console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUndefined")

/*            customElements.define('suggest-change-button', class extends HTMLElement {
                connectedCallback() {
                    console.log("E - main.js, suggest-change-button")
                    const element = app2.mount(document.createElement('div'));
                    console.log("element in main.js", element)
                    this.appendChild(element.$el)
                }
            });*/
        }

        console.log("element in main.js", element);
        // Tässä customElements.definessä määriteltyyn custom-elementtiin eli suggest-change-buttoniin pitää vielä liittää app2:n ja
        // sen tarvitseman divin yhdistelmä eli element.
        // Vuessa $el viittaa Vue-instanssin root-elementtiin (<div>).
        // Kun vue-sovellus (app) on mountattu DOM-elementtiin (<div>), this.$el mahdollistaa suoran pääsyn kyseiseen root-elementtiin
        // this.appendChild(element.$el);
        // this.appendChild(element.$el);

    }
});













// Säiliö melkein toimivasta
/*customElements.define('suggest-change-button', class extends HTMLElement {
    connectedCallback() {
        console.log("E - main.js, suggest-change-button")
        // console.log(prefLabels) AAA
        // const element = createApp(SuggestChangeButton).mount(document.createElement('div')); // case 1: swäpätty alla olevan kanssa


        // if (customElements.get('suggest-change-button')) {
        //     console.log("toimii");
        // } else {
        //     console.log("ei toimi");
        // }

        // document.getElementsByName('suggest-change-button') ? "suggest-change-button löytyi" : "suggest-change-button ei löytynyt"

        const element = app2.mount(document.createElement('div'));
        console.log("element in main.js", element)
                // if (element) {


        this.appendChild(element.$el);
                // } else {
                //     console.log("The element not found")
                // }

        // setTimeout(() => {
        //     // if (element) {
        //     //     this.appendChild(element.$el);
        //     // location.reload();
        //     // } else {
        //     //     console.log("The element not found")
        //     // }
        // }, 5000); // 5000 milliseconds = 5 seconds
    }
});*/

// Check if 'suggest-new-button' is registered
if (customElements.get('suggest-new-button')) {
    console.log("'suggest-new-button' is registered.");
} else {
    console.log("'suggest-new-button' is NOT registered.");
}

if (customElements.get('suggest-change-button')) {
    console.log("'suggest-change-button' is registered.");
} else {
    console.log("'suggest-change-button' is NOT registered.");
}



// Tämä on koodi, jossa uuden lähettäminen toimii kokonaan
/*
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import translations from './i18n/i18n';
// import Vuelidate from 'vuelidate';
import { useVuelidate } from '@vuelidate/core'; // Import useVuelidate function
import SuggestNewButton from '@/components/SuggestNewButton.vue';
import SuggestChangeButton from '@/components/SuggestChangeButton.vue';

const i18n = createI18n({
    // locale: 'fi',
    locale: window.lang,
    messages: translations,
});

const app = createApp(SuggestNewButton);

// Provide i18n instance to components
// app.provide('$t', i18n.global.t);
app.provide('$t', i18n.global.t);
app.provide('pageUrl', window.location.href);
// app.provide('useVuelidate', useVuelidate);

app.use(i18n); // Register global i18n
// app.use(useVuelidate); // Use Vuelidate plugin

// Define the custom elements
customElements.define('suggest-new-button', class extends HTMLElement {
    connectedCallback() {
        const element = app.mount(document.createElement('div'));
        this.appendChild(element.$el);
    }
});

customElements.define('suggest-change-button', class extends HTMLElement {
    connectedCallback() {
        const element = createApp(SuggestChangeButton).mount(document.createElement('div'));
        this.appendChild(element.$el);
    }
});

// Check if 'suggest-new-button' is registered
if (customElements.get('suggest-new-button')) {
    console.log("'suggest-new-button' is registered.");
} else {
    console.log("'suggest-new-button' is NOT registered.");
}*/































/*
// support for older browsers
import 'document-register-element/build/document-register-element';
import "core-js/stable";
import "regenerator-runtime/runtime";

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n';
import translations from './i18n/i18n';

// import your component(s)
import SuggestNewButton from '@/components/SuggestNewButton.vue';
import SuggestChangeButton from '@/components/SuggestChangeButton.vue';

const i18n = createI18n({
    locale: 'fi',
    messages: translations,
});

const app = createApp(SuggestNewButton);

// Register global i18n
app.use(i18n);

// Register components globally if needed
app.component('suggest-new-button', SuggestNewButton);
app.component('suggest-change-button', SuggestChangeButton);

console.log('Vue app:', app);

app.mount('#app'); // Replace '#app' with your root element ID
// app.mount('#suggestions-new');
*/




// The original before vue3
/*
// support for older browsers
import 'document-register-element/build/document-register-element';
import "core-js/stable";
import "regenerator-runtime/runtime";

import Vue from 'vue';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
import translations from './i18n/i18n';

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element';
Vue.use(VueCustomElement);

// import and register your component(s)
import SuggestNewButton from '@/components/SuggestNewButton.vue';
SuggestNewButton.i18n = new VueI18n({ locale: 'fi', messages: translations });
Vue.customElement('suggest-new-button', SuggestNewButton);

// import and register your component(s)
import SuggestChangeButton from '@/components/SuggestChangeButton.vue';
SuggestChangeButton.i18n = new VueI18n({ locale: 'fi', messages: translations });
Vue.customElement('suggest-change-button', SuggestChangeButton);
*/
