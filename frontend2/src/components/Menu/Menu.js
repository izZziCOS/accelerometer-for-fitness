import React from 'react'
import Flexbox from 'flexbox-react'
import NavigationMenu from './NavigationMenu'
import UserSettingsDropdown from './UserSettingsDropdown'
import isAuthenticated from './../Auth/isAuthenticated'

export default function Menu() {
  return (
    <div style={{ marginTop: '1rem' }}>
      {isAuthenticated && (
      <Flexbox flexDirection="row">
        <Flexbox flexGrow={200}>
          <NavigationMenu />
        </Flexbox>
        <Flexbox
          flexGrow={1}
          style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
        >
          <UserSettingsDropdown />
        </Flexbox>
      </Flexbox>
      )}
    </div>
  )
}
