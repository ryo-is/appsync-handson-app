# vue-base-source

VueでWebアプリケーションを開発するときの雛形です。
clone して serve したらログイン画面(SignIn / SignUp / PasswordReset)まで出来上がっています。

## Setup

0. リポジトリを変更する

clone したらリポジトリの向き先を変えて使ってください。

```
$ git remote remove origin
$ git remote add origin <repository_url>
```

1. node_moduleをインストールする

```
$ yarn (or npm i)
```

2. VSCode上で `.ts` ファイルと `.vue` ファイルで eslint を有効になるようにして、保存したときに prettier が走るようにするために、 `.vscode/settings.json` に下記を追記する

※ `.vscode/settings.json` がない場合は作成する

```
{
  "eslint.validate": [
    "javascript", "typescript", "vue"
  ],
  "editor.codeActionsOnSaveTimeout": 2000,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

3. envファイルを作成する

Cognito や APIGateway のエンドポイント等をenvファイルに記述します。

開発時のエンドポイントを切り替えたい場合は `.env.development` を生成すると開発時はそちらを見てくれます。

```
VUE_APP_COGNITO_IDENTITY_ID=""
VUE_APP_COGNITO_USER_POOL_ID=""
VUE_APP_COGNITO_CLIENT_ID=""
VUE_APP_API_ENDPOINT=""
```

- VUE_APP_COGNITO_IDENTITY_ID: CognitoアイデンティティープールのID
- VUE_APP_COGNITO_USER_POOL_ID: CognitoユーザープールのID
- VUE_APP_COGNITO_CLIENT_ID: Cognitoユーザープールに紐付いているアプリクライアントのID
- VUE_APP_API_ENDPOINT: APIGatewayのエンドポイント

## Amplify Settings

Amplifyに関係する設定については `plugins/aws_exports.ts` に記述している

- Auth: Cognitoに関係する情報
- API: APIGatewayに関係する情報(AppSyncについてもここで設定する)
  - APIのエンドポイントについては配列で複数のエンドポイントを設定することができる

  ```
  endpoints: [
    {
      name: "rest-api",
      endpoint: process.env.VUE_APP_API_ENDPOINT
    }
  ]
  ```

  - `custom_header` を使って、ヘッダーにCognitoのTokenを埋め込むこともできます
  - `Auth.currentSession()` を呼び出したときにTokenの期限が切れていたらリフレッシュしてくれます

  ```
  endpoints: [
    {
      name: "rest-api",
      endpoint: process.env.VUE_APP_API_ENDPOINT,
      custom_header: async () => {
        return {
          Authorization: `${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`
        }
      }
    }
  ]
  ```

## apis

APIへのリクエスト処理は `apis/abstract_class.ts` に書いてあります。
GET/POST/PUTに対応しています。

```
import { API } from "aws-amplify"

export default class AbstractClass {
  private apiName: string

  constructor(apiName: string) {
    this.apiName = apiName
  }

  // Get method
  public async get<T>(path: string): Promise<T> {
    return await API.get(this.apiName, path, {})
  }

  // Put method
  public async post<T>(path: string, requestBody: T): Promise<void> {
    await API.post(this.apiName, path, { body: requestBody })
  }

  // Post method
  public async put<T>(path: string, requestBody: T): Promise<void> {
    await API.put(this.apiName, path, { body: requestBody })
  }
}
```

これをextendsして使ってください。

例は `apis/sample_api.ts` に書いてあります。

```
import AbstractClass from "./abstract_class"

type UserData = {
  id: string
  name: string
  age: number
}

export default class SampleAPI extends AbstractClass {
  constructor() {
    super("rest-api")
  }

  public async getData(): Promise<UserData> {
    return await this.get<UserData>("/get")
  }

  public postData(body: UserData) {
    this.post<UserData>("/post", body)
  }
}
```
