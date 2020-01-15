import Vue from "vue"
import router from "@/router"
import { AuthComponentState } from "@/types"
import { defaultSignupParam, defaultResetPasswordParam } from "./default_values"
import { Auth } from "aws-amplify"
import { SignUpParams } from "@aws-amplify/auth/lib/types/Auth"
import { flagsNamespacedHelper } from "@/stores/flags"

// Vuex store helpers
const flagsMapActions = flagsNamespacedHelper.mapActions([
  "setHiddenToolbarItems",
  "setOverlay"
])

// Component data
const data: AuthComponentState = {
  signinForm: "signin",
  errorMessages: [],
  userName: "",
  password: "",
  signupParam: defaultSignupParam,
  resetPasswordParam: defaultResetPasswordParam,
  authenticationCode: ""
}

export default Vue.extend({
  data() {
    return data
  },
  created() {
    this.setHiddenToolbarItems(false)
  },
  methods: {
    ...flagsMapActions,
    // サインイン処理
    async signIn(): Promise<void> {
      try {
        this.setOverlay(true)
        await Auth.signIn(this.userName, this.password)
        router.push("/")
      } catch (err) {
        this.setOverlay(false)
        console.error(err)
        this.checkErrorCode(err.code)
      }
    },
    // サインアップ処理(ユーザー作成)
    async signUp(): Promise<void> {
      console.log(this.signupParam)
      try {
        const params: SignUpParams = {
          username: this.signupParam.userName,
          password: this.signupParam.password,
          attributes: {
            email: this.signupParam.mailAddress
          }
        }
        await Auth.signUp(params)
        this.signinForm = "signin"
        this.signupParam = defaultSignupParam
      } catch (err) {
        console.error(err)
        this.checkErrorCode(err.code)
      }
    },
    // パスワードリセット用のコード送信
    async forgotPassword(): Promise<void> {
      try {
        await Auth.forgotPassword(this.resetPasswordParam.userName)
        this.signinForm = "submitCode"
      } catch (err) {
        console.error(err)
        this.checkErrorCode(err.code)
      }
    },
    // パスワードリセット
    async resetPassword(): Promise<void> {
      try {
        await Auth.forgotPasswordSubmit(
          this.resetPasswordParam.userName,
          this.resetPasswordParam.code,
          this.resetPasswordParam.password
        )
        this.signinForm = "signin"
        this.resetPasswordParam = defaultResetPasswordParam
      } catch (err) {
        console.error(err)
        this.checkErrorCode(err.code)
      }
    },
    // cognitoから返ってきたエラーコードでメッセージを切り替える
    checkErrorCode(code: string): void {
      const self: AuthComponentState = this
      self.errorMessages = []
      switch (code) {
        case "UsernameExistsException":
          self.errorMessages.push("すでに登録済みのユーザー名です")
          break
        case "InvalidPasswordException":
          self.errorMessages.push(
            "パスワードポリシー(大文字/小文字/数字を含む8文字以上)を満たしていません"
          )
          break
        case "UserNotFoundException":
          this.errorMessages.push("存在しないユーザーです")
          break
        case "NotAuthorizedException":
          this.errorMessages.push("パスワードが間違っています")
          break
        case "UserNotConfirmedException":
          this.errorMessages.push("ユーザーの有効化をしてください")
          break
        case "ValidationFailure":
          this.errorMessages.push("認証コードが違います")
          break
        case "InvalidParameterException":
          this.errorMessages.push("ログイン名にメールアドレスは使えません")
          break
        case "DomainNotAllowed":
          this.errorMessages.push("許可されていないドメインです")
          break
        default:
          self.errorMessages.push("失敗しました")
          break
      }
      setTimeout(() => {
        self.errorMessages = []
      }, 5000)
    }
  }
})
