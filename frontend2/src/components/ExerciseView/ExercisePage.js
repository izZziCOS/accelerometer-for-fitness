import React, { useState, useEffect} from 'react'
import isAuthenticated from '../Auth/isAuthenticated'
import { Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu'
import { Divider, Loader, Header, Grid } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import LineChart from '../../utils/LineChart'
import ChartRow from './ChartRow'

export default function ExercisePage(props) {
    const [exerciseInformation] = useDataApi(`/exercise/${props.match.params.exercise}`,[],)
    const [executions] = useDataApi(`/executions/${props.match.params.exercise}/${localStorage.getItem('profile')}`)
    const [accelerometerDataset, setAccelerometerDataset] = useState()
    const [labels, setLabels] = useState()

    useEffect(() => {
        if (exerciseInformation.data.correctdata !== undefined){
            var accelerometerValues = JSON.parse(exerciseInformation.data.correctdata)
            setAccelerometerDataset(accelerometerValues)
            var arrayLength = Array.from({ length: Object.keys(accelerometerValues.x).length }, (_, i) => i+1)
            setLabels(arrayLength)
        }
      }, [exerciseInformation.data.correctdata])

    if (exerciseInformation.data.correctdata === undefined) {
        return (
          <Loader
            active
            inline="centered"
            size="massive"
            style={{ marginTop: 10 }}
          />
        )
    }

    if (!accelerometerDataset) {
        return (
          <Loader
            active
            inline="centered"
            size="massive"
            style={{ marginTop: 10 }}
          />
        )
    }

    const executionHeader = () => {
      if(executions.data){
        return(
        <Header as="h3">Pratimo atlikimai</Header>
        )
      }
      else{
          return(
            <Header as="h3">Atlikimų nėra</Header>
          )
      }
    }

    const userExecutions = () => {
      if(executions.data){
        var accelerometerValues
        return (
          executions.data.map((execution) => {
          accelerometerValues = JSON.parse(execution.executiondata)
          if(accelerometerValues.x)
          var userLength = Array.from({ length: Object.keys(accelerometerValues.x).length }, (_, i) => i+1)
          else userLength = []
          return (
          <ChartRow
          key = {execution.id}
          id = {execution.id}
          comment = {execution.comment}
          executionAccuracy = {execution.executionaccuracy}
          height = {350}
          width = {980}
          timestamp ={execution.date.Time.substring(0,16)}
          labels = {userLength}
          x = {accelerometerValues.x}
          y = {accelerometerValues.y}
          z = {accelerometerValues.z}
          />
          )
        }))
      }
    }

    return(
        isAuthenticated() ? (
        <React.Fragment>
            <Menu />
            <Divider />
            <Header as="h3">Pratimo informacija</Header>
            <Divider />
            <Grid divided>
                <Grid.Row>
                <Grid.Column width={5}>
                <div style={{fontSize: "2em"}}>
                <b>Pratimas</b> : {exerciseInformation.data.name} <br></br> <br></br>
                <b>Telefono vieta</b> : {exerciseInformation.data.phonelocation} <br></br> <br></br>
                <b>Atlikimo trukmė</b> : {exerciseInformation.data.time}s <br></br> <br></br>
                <b>Treneris</b> : {exerciseInformation.data.trainer}
                </div>
            </Grid.Column>
                    <Grid.Column width={11}>
                    <LineChart
            height = {350}
            width = {980}
            label = {labels}
            x = {accelerometerDataset.x}
            y = {accelerometerDataset.y}
            z = {accelerometerDataset.z}
            />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider />
            
            {executionHeader()}
            <Divider />
            {userExecutions()}
            
        </React.Fragment>
        ):
        (
            <Redirect to={{
                pathname: '/login'
              }} />
        )
    )
}