// support for older browsers
import 'document-register-element/build/document-register-element';
import './polyfills/polyfills';

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
import SuggestNewButton from './components/SuggestNewButton';
SuggestNewButton.i18n = new VueI18n({ locale: 'fi', messages: translations });
Vue.customElement('suggest-new-button', SuggestNewButton);

// import and register your component(s)
import SuggestChangeButton from './components/SuggestChangeButton';
SuggestChangeButton.i18n = new VueI18n({ locale: 'fi', messages: translations });
Vue.customElement('suggest-change-button', SuggestChangeButton);