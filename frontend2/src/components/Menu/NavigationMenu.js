import React from 'react'
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

export default function Navigation() {
    return(
        <Menu attached="top" id="menu" widths={2}>
        <Menu.Item as={NavLink} exact to="/" name=" Pagrindinis" />
        <Menu.Item as={NavLink} exact to="/exercises" name="Pratimai" />
      </Menu>
    )
}
