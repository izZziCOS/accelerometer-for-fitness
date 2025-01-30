import React, {useState} from "react"
import { Button, Divider } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import { Link, Redirect } from 'react-router-dom'
import isAuthenticated from '../Auth/isAuthenticated'
import Menu from '../Menu/Menu'

export default function UserOverview(props) {

  const [fullname] = useState(localStorage.getItem('fullname'))
  const [exercises] = useDataApi(`/exercises/${fullname}`,[],)

  const ExerciseC = () => {
    if(exercises.length === 0){
        return( null)
    }
      else{
        if(exercises.data)
        var exerciseCards = exercises.data.map((exercise) => (
          <Link to={`/${exercise.name}/${props.match.params.user}/`} key={exercise.name}>
                  <Button
                    fluid
                    size="huge"
                    content={exercise.name}
                  />
                  <div style={{ marginTop: 10 }} />
                  </Link>
        ))
        return( 
          <div>{exerciseCards}</div>
          )
      }
    }

  return(
    isAuthenticated() ? (
    <React.Fragment>
        <Menu />
        <Divider />
        {ExerciseC()}
    </React.Fragment>
    ):
    (
        <Redirect to={{
            pathname: '/login'
          }} />
    )
)
}