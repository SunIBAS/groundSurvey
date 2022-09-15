import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import {Lang} from "./../src/utils/Lang";

Vue.prototype.$addin = {
    $map: null,
    $leafletAPI: null,
};
Vue.use(ElementUI);
Lang(Vue);
let initVue = () => {
    let $vue = new Vue({
        el: '#app',
        render: h => h(App)
    });
    $vue.$lang.setVueInst($vue);
};
let id = setInterval(() => {
    if (typeof window.config === "object") {
        initVue();
        clearInterval(id);
    }
},500);
