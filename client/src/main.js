import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate from 'vee-validate';
//import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import VMdDateRangePicker from "v-md-date-range-picker";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faClipboardList,
  faShoppingCart,
  faMotorcycle,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faClipboardList, faShoppingCart, faMotorcycle, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VMdDateRangePicker);
Vue.component('font-awesome-icon', FontAwesomeIcon);

//Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
