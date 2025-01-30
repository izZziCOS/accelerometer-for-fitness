import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Auth0Lock from 'auth0-lock'
import { AUTH_CONFIG } from './auth0-variables'
import profile from './Profile'

class Lock extends Component {
  lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    auth: {
      responseType: 'token id_token',
      sso: false,
    },
    language: 'lt',
    container: AUTH_CONFIG.container,
    theme: {
      primaryColor: '#3a99d8'
    },
  })

  constructor(props) {
    super(props);
    this.state = { loggedIn : false };
    this.onAuthenticated = this.onAuthenticated.bind(this);

    this.onAuthenticated();
  }

  onAuthenticated() {
    this.lock.on('authenticated', (authResult) => {
        this.lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
            if (error) {
              // Handle error
              return;
            }

            profile.data = profileResult;
            localStorage.setItem('profile', profile.data.email);
            localStorage.setItem('fullname', profile.data.name);
            Object.freeze(profile)
        })
      let expiresAt = JSON.stringify((authResult.expiresIn * 10000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);

      this.setState({ loggedIn: true });
    });
  }

  componentDidMount() {
    // Avoid showing Lock when hash is parsed.
    if ( !(/access_token|id_token|error/.test(this.props.location.hash)) ) {
      this.lock.show();
    }
  }

  render() {
    const style = { marginTop: '32px' }

    return(
      !this.state.loggedIn ? (
        <div>
          <div id={AUTH_CONFIG.container} style={style}></div>
        </div>
      ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: this.props.location }
        }} />
      )
    );
  }
}

export default Lock;