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
