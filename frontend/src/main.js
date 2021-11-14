import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";

(async function () {
  try {
    Vue.config.productionTip = false;

    new Vue({
      router,
      vuetify,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  } catch (e) {
    console.log(e);
    alert(
      `Core javascript error occurred and webpage cannot render. Please contact support.`
    );
  }
})();
