import Amplify, { Auth } from "aws-amplify"
import { amplifyConfig } from "./amplify_config"
import router from "@/router"
import { Route } from "vue-router"
Amplify.configure(amplifyConfig)

// 認証確認
// 認証されていなかったらログイン画面にリダイレクトする
router.beforeEach((to: Route, from: Route, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiredAuth)) {
    Auth.currentAuthenticatedUser()
      .then(() => {
        console.log("authorized")
        next()
      })
      .catch(() => {
        console.log("not authorized")
        next({
          path: "auth",
          query: {
            redirect: to.fullPath
          }
        })
      })
  }
  next()
})
