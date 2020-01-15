import Vue from "vue"
import dayjs from "dayjs"
import { API, graphqlOperation } from "aws-amplify"
import { HomeComponentState } from "@/types"

// Component data
const data: HomeComponentState = {
  userID: "hogeUser",
  postTitle: ""
}

export default Vue.extend({
  data(): HomeComponentState {
    return data
  },
  methods: {
    async submit() {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
      const gqlBody = `
        mutation {
          save (input: {
            id: "${this.userID}",
            title: "${this.postTitle}",
            create_time: "${now}"
          }) {
            id
          }
        }
      `
      await API.graphql(graphqlOperation(gqlBody))
    }
  }
})
