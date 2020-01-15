import { SignUpParam, ResetPasswordParam } from "@/types"

export const defaultSignupParam: SignUpParam = {
  mailAddress: "",
  userName: "",
  password: ""
}

export const defaultResetPasswordParam: ResetPasswordParam = {
  userName: "",
  password: "",
  code: ""
}
