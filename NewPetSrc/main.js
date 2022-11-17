import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import App from './App.vue';
import EmptyApp from "./EmptyApp";
// import EmptyApp from "./pages/AddOnePointDetail";
// import EmptyApp from "../src/pages/PC/Records/SoilMoistureCollRecord";
import {Lang} from "./utils/Lang";
import { Message,MessageType } from "./utils/Message";

// 定义 hbuilder 为 true 时可以离线操作，为 false 时无法离线操作，如果 hbuilder 为 true 则 请求缓存
Vue.prototype.$addin = {
  $map: null,
  $leafletAPI: null,
  hbuilder: false,
  offline: false,
  module: {
    type: 1, // 土地利用1，专题2
    setType(type) {
      this.type = type;
      window.module = type;
    }
  }
};
window.hubilder = false;
window.offline = false;
window.module = 1;
Vue.use(ElementUI);

function initVue_() {
  Lang(Vue).then(() => {
    let initVue = () => {
      let $vue = new Vue({
        el: '#app',
        render: h => h(EmptyApp),
      });
      $vue.$lang.setVueInst($vue);
    };
    let id = setInterval(() => {
      if (typeof window.config === "object") {
        initVue();
        clearInterval(id);
      }
    },500);
  });
}

if (window !== window.parent) {
  Message(MessageType.xid).then(({data}) => {
    if (data === 'fawegaij;ofa;efknagoijaoeifjaoiwnfoaijgoiawe;ofnaweofiajwoiga;woeina;woifjaw;oifjawe') {
      Vue.prototype.$addin.hbuilder = true;
      window.hbuilder = true;
      Message(MessageType.dbinit).then(obj => {
        if (obj.error) {
          alert(`error code = ${obj.error.code}\nmessage = ${obj.error.message}`);
        } else {
          initVue_();
        }
      })
    } else {
      initVue_();
    }
  })
} else {
  window.hbuilder = false;
  initVue_();
}

