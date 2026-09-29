/* Must stay the first import: it fences storage, the network and Firebase
   for the test driver app before App.jsx is evaluated. See sandboxBoot.js. */
import './sandboxBoot.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
