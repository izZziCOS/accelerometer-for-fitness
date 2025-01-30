import React from 'react'
import { Redirect } from 'react-router-dom'
import Lock from './../Auth/Lock'
import isAuthenticated from './../Auth/isAuthenticated'

const Login = (props) => (
  isAuthenticated() ? (
    <Redirect to={{
      pathname: '/',
      state: { from: props.location }
    }} />
  ) : (
    <Lock location={props.location} />
  )
)

export default Login;