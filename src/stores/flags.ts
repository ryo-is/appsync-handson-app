import { Module, ActionContext, createNamespacedHelpers } from "vuex"
import { FlagsState, RootState } from "./types"

export const flagsNamespacedHelper = createNamespacedHelpers("flags")

export const flags: Module<FlagsState, RootState> = {
  namespaced: true,
  state: {
    hiddenToolbarItems: false,
    overlay: false
  },
  mutations: {
    setHiddenToolbarItems(state: FlagsState, value: boolean): void {
      state.hiddenToolbarItems = value
    },
    setOverlay(state: FlagsState, value: boolean): void {
      state.overlay = value
    }
  },
  getters: {
    hiddenToolbarItems(state: FlagsState): boolean {
      return state.hiddenToolbarItems
    },
    overlay(state: FlagsState): boolean {
      return state.overlay
    }
  },
  actions: {
    setHiddenToolbarItems(
      { commit }: ActionContext<FlagsState, RootState>,
      value: boolean
    ) {
      commit("setHiddenToolbarItems", value)
    },
    setOverlay(
      { commit }: ActionContext<FlagsState, RootState>,
      value: boolean
    ) {
      commit("setOverlay", value)
    }
  }
}
