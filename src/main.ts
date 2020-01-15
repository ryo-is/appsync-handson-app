import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./stores/store"
import vuetify from "./plugins/vuetify"
import "./registerServiceWorker"
import "./plugins/amplify"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (h: any): any => h(App)
}).$mount("#app")
