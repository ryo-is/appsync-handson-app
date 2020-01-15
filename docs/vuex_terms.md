# Vuex規約

Vuexのコード規約です。

## 構成

```
src/stores/
├── flags.ts
├── store.ts
└── types.d.ts
```

### store.ts

Storeの親ファイル。ここにModuleファイルをimportしていく。

modules内にModuleを入れていく。

```
import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"
import { flags } from "./flags"

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: ""
  },
  modules: {
    flags  // ←ここにModuleを突っ込む。この場合のnamespace名はflags
  }
}

export default new Vuex.Store<RootState>(store) // ←Storeを生成
```

### flags.ts

Storeの子ファイル。Moduleファイル。ここにModuleの内容を書いていく。

Moduleを変数に入れてexportする。そのときの変数名がnamespace名となる。

```
import { Module, ActionContext } from "vuex"
import { FlagsState, RootState } from "./types"

export const flags: Module<FlagsState, RootState> = {
  /* 省略 */
}
```

### types.d.ts

Store関係の型ファイル。

## 規約

- `stores/` 以下にVuex関係のソースを置く
- namespaceを切って、それぞれのnamespace(Module)ファイルを生成する
- Moduleの構成要素は、`namespaced / state / mutations / actions (/ getters)`
- 直接 `mutations` を使わない
- createNamespacedHelpersを使って、Storeとやり取りする

### `stores/` 以下にVuex関係のソースを置く

Vuexに関するソースコードは `/stores` 以下に置いてください。
Store本体とかModuleとか型ファイルとか

### namespaceを切って、それぞれのModuleファイルを生成する

すべてひとつのStoreとして扱うとStateがゴミ箱みたいになってくるので、namespaceを切りましょう。

namespaceを切ることでModuleとしてStoreを分割することができます。

Storeで扱いたいデータの種別ごとで切るといいかもです。Flag関係とか描画するデータ関係とか…

### Moduleの構成要素は、`namespaced / state / mutations / actions (/ getters)`

Moduleの構成要素は、`namespaced / state / mutations / actions (/ getters)`になります。

例: `stores/flags.ts`

```
import { Module, ActionContext } from "vuex"
import { FlagsState, RootState } from "./types"

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
```

### 直接 `mutations` を使わない

直接 `mutations` を使わない( `Store.commit("hoge")` って書かない)。あくまで感覚の話になんですが `mutations` はprivateな関数として扱った方がいいのかなって思っています。

逆に `actions` はpublicな関数として扱うという形で `mutations` と `actions` の棲み分けをします。

`actions` 経由で `mutations` を使いましょう。書き方は下記のような感じです。

```
Store.dispatch("hogehoge")
```

### createNamespacedHelpersを使って、Storeとやり取りする

というかそもそも `Store.hoge` って書くのをやめましょう。

そういうときに役立つのが `createNamespacedHelpers` です。

```
export const flagsNamespacedHelper = createNamespacedHelpers("flags")
```

こうやってnamespacedごとのModuleに対してやり取りをできるようにできます。

Stateを購読する場合は、computedでmapStateを展開します。スプレッド構文で書く必要があるので注意。展開したあとは `this` から参照できます。

例: `App.vue` （抜粋）

```
import Vue from "vue"
import { createNamespacedHelpers } from "vuex"
import { flagsNamespacedHelper } from "@/stores/flags"

export default Vue.extend({
  computed: {
    ...flagsNamespacedHelper.mapState({
      hiddenToolbarItems: (state: any) => state.hiddenToolbarItems,
      overlay: (state: any) => state.overlay
    })
  }
})
```

Actionを使う場合は、methodsにmapActionsを展開します。こちらもスプレッド構文で書く必要があります。また、一度変数に入れないと型推論をしてくれないので注意。展開したあとは `this` から参照できます。

例: `viwes/home/script.ts` （抜粋）

```
import Vue from "vue"
import { HomeComponentState } from "@/types"
import { flagsNamespacedHelper } from "@/stores/flags"

// Vuex store helpers
const flagsMapActions = flagsNamespacedHelper.mapActions([
  "setHiddenToolbarItems",
  "setOverlay"
])

export default Vue.extend({
  data(): HomeComponentState {
    return {
      text: "hoge"
    }
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
```
