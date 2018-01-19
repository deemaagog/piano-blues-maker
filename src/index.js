import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import { createStore } from 'redux'
import 'babel-polyfill'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import configureStore from './store/configureStore'
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker()
