import Vue from "vue"
import { HomeComponentState } from "@/types"
import { flagsNamespacedHelper } from "@/stores/flags"

// Vuex store helpers
const flagsMapActions = flagsNamespacedHelper.mapActions([
  "setHiddenToolbarItems",
  "setOverlay"
])

// Component data
const data: HomeComponentState = {
  text: "hoge"
}

export default Vue.extend({
  data(): HomeComponentState {
    return data
  },
  created() {
    this.setHiddenToolbarItems(true)
    this.setOverlay(false)
  },
  methods: {
    ...flagsMapActions,
    getText(): string {
      return this.text
    }
  }
})
