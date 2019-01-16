import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
// Local imports
import * as stores from './stores'
import createRouter from './create-router5'
import Layout from './components/Layout'

const router = createRouter(true)

const App = () => {
  return (
    <Provider {...stores}>
      <Layout />
    </Provider>
  )
}

export default App

router.start(() => {
  ReactDOM.render(<App />, document.getElementById('app'))
})
