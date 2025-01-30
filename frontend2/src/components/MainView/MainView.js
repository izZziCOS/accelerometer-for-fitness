import React, { useState } from 'react'
import UserView from "./UserView"
import isAuthenticated from '../Auth/isAuthenticated'
import { Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu'
import { Divider, Loader } from 'semantic-ui-react'
import AdminView from "./AdminView"
import TrainerView from "./TrainerView"
import { useDataApi } from '../../utils/data'

export default function MainView() {
    const [profile] = useState(localStorage.getItem('profile'))
    const [userRole] = useDataApi(`/userrole/${profile}`,[],)

    if (userRole.data.role === undefined) {
        return (
          <Loader
            active
            inline="centered"
            size="massive"
            style={{ marginTop: 10 }}
          />
        )
      }

    if(userRole.data.role === "Administratorius")
    return(
        isAuthenticated() ? (
        <React.Fragment>
            <Menu />
            <Divider />
            <AdminView />
        </React.Fragment>
        ):
        (
            <Redirect to={{
                pathname: '/login'
              }} />
        )
    )
    if(userRole.data.role === "Vartotojas")
    return(
        isAuthenticated() ? (
        <React.Fragment>
            <Menu />
            <Divider />
            <UserView />
        </React.Fragment>
        ):
        (
            <Redirect to={{
                pathname: '/login'
              }} />
        )
    )
    if(userRole.data.role === "Treneris")
    return(
        isAuthenticated() ? (
        <React.Fragment>
            <Menu />
            <Divider />
            <TrainerView />
        </React.Fragment>
        ):
        (
            <Redirect to={{
                pathname: '/login'
              }} />
        )
    )
}