import React from "react"
import { Header, Card } from 'semantic-ui-react'

export default function UserView() {

  const items = [
    {
      header: 'Naujas treneris Mantas',
      description:
        'Treneris savo bibliotekoje turi rankos pakėlimo ir ištiesimo pratimus',
      meta: 'Išbandykite',
    }
  ]

    return (
        <React.Fragment>
            <Header>Naujienos</Header>
            <Card.Group items={items} />
        </React.Fragment>
      )
}