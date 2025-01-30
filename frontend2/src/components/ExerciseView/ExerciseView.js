import React, { useState } from 'react'
import UserViewEx from './UserViewEx'
import AdminViewEx from './AdminViewEx'
import TrainerViewEx from './TrainerViewEx'
import isAuthenticated from '../Auth/isAuthenticated'
import { Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu'
import { useDataApi } from '../../utils/data'
import { Divider, Loader } from 'semantic-ui-react'

export default function ExerciseView() {
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
            <AdminViewEx />
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
            <UserViewEx />
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
            <TrainerViewEx />
        </React.Fragment>
        ):
        (
            <Redirect to={{
                pathname: '/login'
              }} />
        )
    )
}