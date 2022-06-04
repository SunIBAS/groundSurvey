import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import App from './App.vue';
import EmptyApp from "./EmptyApp";

Vue.prototype.$addin = {
  $map: null,
  $leafletAPI: null,
};
Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(EmptyApp)
});
