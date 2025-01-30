import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class LogoutButton extends Component {

  constructor(props) {
    super(props)
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('profile')
  }

  render() {
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }} />
    );
  }
}

export default LogoutButton;