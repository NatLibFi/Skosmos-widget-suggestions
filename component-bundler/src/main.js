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
const app2 = createApp(SuggestChangeButton);

// Provide i18n instance to components
// app.provide('$t', i18n.global.t);
app.provide('$t', i18n.global.t);
app.provide('pageUrl', window.location.href);
app2.provide('$t', i18n.global.t);
app2.provide('pageUrlX', window.location.href);
document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('pref-label');
    if (element) {
        const labelText = element.textContent;
        app2.provide('labelX', labelText);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('uri-input-box');
    if (element) {
        const uriText = element.textContent;
        app2.provide('uriX', uriText);
    }
})




app.use(i18n); // Register global i18n
app2.use(i18n); // Register global i18n
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
        // const element = createApp(SuggestChangeButton).mount(document.createElement('div'));
        const element = app2.mount(document.createElement('div'));
        this.appendChild(element.$el);
    }
});

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
