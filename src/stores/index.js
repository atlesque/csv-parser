import appStore from './AppStore'
import routerStore from './RouterStore'

const stores = {
  appStore,
  routerStore
}

window.__STORES__ = stores // For Debug

export {
  appStore,
  routerStore
}
