export type AppComponentState = {
  hiddenToolbarItems: boolean
  overlay: boolean
}

export type HomeComponentState = {
  text: string
}

export type AuthComponentState = {
  signinForm:
    | "signin"
    | "signup"
    | "resetPassword"
    | "submitCode"
    | "authenticationCode"
  errorMessages: string[]
  userName: string
  password: string
  signupParam: SignUpParam
  resetPasswordParam: ResetPasswordParam
  authenticationCode: string
}

export type SignUpParam = {
  mailAddress: string
  userName: string
  password: string
}

export type ResetPasswordParam = {
  userName: string
  password: string
  code: string
}
