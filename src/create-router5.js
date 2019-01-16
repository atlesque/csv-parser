import createRouter from 'router5'
import loggerPlugin from 'router5/plugins/logger'
import browserPlugin from 'router5/plugins/browser'
import { mobxPlugin } from 'mobx-router5'
// Local imports
import routes from './routes'
import routerStore from './stores/RouterStore'

const routerOptions = {
  defaultRoute: 'home',
  strictQueryParams: true
}

export default function configureRouter() {
  const router = createRouter(routes, routerOptions)
    // Plugins
    .usePlugin(browserPlugin({ useHash: true }))
    .usePlugin(mobxPlugin(routerStore))
    .usePlugin(loggerPlugin)

  return router
}
