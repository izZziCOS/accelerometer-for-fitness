import React from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { useHistory } from "react-router-dom"

export default function UserSettingsDropdown() {
  const history = useHistory()
  return (
    <Dropdown trigger={trigger} direction="left">
      <Dropdown.Menu>
        <Dropdown.Header>
          Vartotojas {localStorage.getItem('profile')}
        </Dropdown.Header>
        <Dropdown.Item onClick={() => history.push("/logout")}>Atsijungti</Dropdown.Item> 
      </Dropdown.Menu>
    </Dropdown>
  )
}

const trigger = (
  <span>
    <Icon circular inverted color="blue" name="user" />
  </span>
)
