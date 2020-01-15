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
