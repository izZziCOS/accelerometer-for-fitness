import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainView from './components/MainView/MainView'
import ExerciseView from './components/ExerciseView/ExerciseView'
import { Container } from 'semantic-ui-react'
import history from "./utils/history"
import LoginButton from './components/User/Login'
import LogoutButton from './components/User/Logout'
import ExercisePage from './components/ExerciseView/ExercisePage'
import UserOverview from './components/MainView/UserOverview'
import UserExerciseView from './components/MainView/UserExerciseView'

const App = () => {

  return (
      <Router history={history}>
          <Container
            style={{
              paddingLeft: 20,
              paddingRight: 20,
            }}
            fluid
          >
            <Switch>
              <Route path="/" exact component={MainView} />
              <Route path="/exercises" exact component={ExerciseView}/>
              <Route path="/logout" exact component={LogoutButton} />
              <Route path="/login" exact component={LoginButton} />
              <Route path="/exercises/:exercise" exact component={ExercisePage} />
              <Route path="/:user" exact component={UserOverview} />
              <Route path="/:user/:exercise" exact component={UserExerciseView} />
            </Switch>
          </Container>
      </Router>
  )
}

export default App
