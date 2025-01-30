import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'semantic-ui-css/semantic.min.css'
// import { Auth0Provider } from '@auth0/auth0-react'

//let location = `${window.location.origin}/` if changed

ReactDOM.render(
  // <AuthProvider
  // domain = 'dev-ygtgc0f3.eu.auth0.com'
  // clientId = '0KQ9xVWjsuc6m3e80bZT8HMirnH8ToKD'
  // // redirectUri = 'http://localhost:3000/'
  // >
    <App />,
  // </AuthProvider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
