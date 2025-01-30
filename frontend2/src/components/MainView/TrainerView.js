import React, {useState} from "react"
import { Button } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import { Link } from 'react-router-dom'

export default function TrainerView() {
  
  const [profile] = useState(localStorage.getItem('profile'))
  const [users] = useDataApi(`/trainerusers/${profile}`,[],)

const userButtons = () => {
  if(users.length === 0){
      return( null)
  }
    else{
      if(users.data)
      var userCards = users.data.map((user) => (
      <React.Fragment  key={user.name}>
        <Link to={`/${user.name}/`}>
          <Button
            key={user.name}
            fluid
            size="huge"
            content={user.name}
          />
        </Link>
          <div style={{ marginTop: 10 }} />
          </React.Fragment>
      ))
      return(
        <div>{userCards}</div>
        )
    }
  }    

    return (
        <React.Fragment>
            {userButtons()}
        </React.Fragment>
      )
}