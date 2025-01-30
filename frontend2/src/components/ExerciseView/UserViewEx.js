import React, { useState, useEffect } from 'react'
import { Button, Dropdown, Modal, Divider } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import { Link } from 'react-router-dom'
import backend from '../../api/index'

export default function UserViewEx() {
    const [open, setOpen] = useState(false)
    const [profile] = useState(localStorage.getItem('profile'))
    // const [userChoise, setUserChoise] = useState([])
    const [trainerChoise, setTrainerChoise] = useState([])
    const [exercisesChoise, setExercisesChoise] = useState([])
    const [exercises] = useDataApi(`/exercises`,[],)
    const [trainers] = useDataApi(`/alltrainers`,[],)
    const [userExercises] = useDataApi(`/userexercises/${profile}`,[],)
    const [uExercises, setUExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [uTrainers, setUTrainers] = useState()

    useEffect(() => {
      if(userExercises.data.exercises===undefined){
        setLoading(true)
      }
      if(userExercises.data.exercises!==undefined && userExercises.data.id!==0){
        var usExercises = JSON.parse(userExercises.data.exercises)
        setUExercises(usExercises)
        setLoading(false)
      }
    }, [userExercises.data.exercises])

    var allExercises = exercises.data.map(function(el) {
      var o = Object.assign({}, el);
      o.key = el.id
      if(el.trainer !== 'No'){
        o.text = `${el.name} -  Treneris ${el.trainer}`
        }
        else{
          o.text = el.name
        }
      o.value = el.name
      return o
    })

    var allTrainers = trainers.data.map(function(el) {
      var o = Object.assign({}, el);
      o.key = el.trainer
      o.text = el.trainer
      o.value = el.trainer
      return o
    })

    const prepareValues = () =>{
      if(userExercises.data.id===0){
        setUTrainers("")
      }
      else{
        var userTr = JSON.parse(userExercises.data.trainers)
        setUTrainers(userTr.trainers)
      }
    }

    const Submit = () => {
    var exJSON = { "exercises": exercisesChoise }
    var exercisesJSON = JSON.stringify(exJSON)
    var trJSON = { "trainers": trainerChoise}
    var trainersJSON = JSON.stringify(trJSON)
    backend
      .post('/userexercises', {
        username: localStorage.getItem('profile'),
        exercises: exercisesJSON,
        trainers: trainersJSON,
      })
      .then((response) => {
        if (!response.data) {
          console.log('No response')
        }
        console.log(response.data)
      })
      .catch(() => {})
    setOpen(false)
    window.location.reload()
    }

    const ExerciseC = () => {
     if(userExercises.data.id===0){
        return( null)
     }
      else{
        if(uExercises.exercises)
        var exerciseCards = uExercises.exercises.map((exercise) => (
          <Link to={`/exercises/${exercise}/`} key={exercise}>
            <Button
              fluid
              size="huge"
              content={exercise}
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
        <React.Fragment>
            <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button fluid onClick={() => prepareValues()}>Pasirinkti pratimus arba/ir trenerį</Button>}
        >
          <Modal.Header>Pasirinkti pratimus arba/ir trenerį</Modal.Header>
          <Modal.Content>
            Treneriai
            <Dropdown
            placeholder='Pasirinkti trenerius'
            fluid
            multiple
            options={allTrainers}
            defaultValue={uTrainers}
            onChange={(e, { value }) => setTrainerChoise(value)}
            search
            selection
            />
            <Divider />
            Pratimai
            <Dropdown
            placeholder='Pasirinkti pratimus'
            fluid
            multiple
            search
            defaultValue={uExercises.exercises}
            options={allExercises}
            onChange={(e, { value }) => setExercisesChoise(value)}
            selection
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)}>Atšaukti</Button>
            <Button onClick={() => Submit()} positive>
              Patvirtinti
            </Button>
          </Modal.Actions>
        </Modal>
        <Divider />
        {ExerciseC()}
        </React.Fragment>
    )
}