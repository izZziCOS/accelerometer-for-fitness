import React, { useState, useEffect} from 'react'
import isAuthenticated from '../Auth/isAuthenticated'
import { Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu'
import { Divider, Message, Loader, Header } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import LineChart from '../../utils/LineChart'
import ChartRow from '../ExerciseView/ChartRow'

export default function ExercisePage(props) {
    const [exerciseInformation] = useDataApi(`/exercise/${props.match.params.user}`,[],)
    const [executions] = useDataApi(`/executions/${props.match.params.user}/${props.match.params.exercise}`)
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
        console.log(executions.data)
      if(executions.data){
        var accelerometerValues
        return (
          executions.data.map((execution) => {
          accelerometerValues = JSON.parse(execution.executiondata)
          return (
          <ChartRow
          key = {execution.id}
          id = {execution.id}
          comment = {execution.comment}
          executionAccuracy = {execution.executionaccuracy}
          height = {350}
          width = {980}
          timestamp ={execution.date.Time}
          labels = {accelerometerValues.timestamp}
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
            <Message>
                <div style={{fontSize: "2em"}}>
                <b>Pratimas</b> : {exerciseInformation.data.name} <br></br> <br></br>
                <b>Telefono vieta</b> : {exerciseInformation.data.phonelocation} <br></br> <br></br>
                <b>Atlikimo trukmė</b> : {exerciseInformation.data.time}s <br></br> <br></br>
                <b>Treneris</b> : {exerciseInformation.data.trainer}
                </div>
            </Message>
            <Divider />
            <LineChart
            height = {200}
            width = {980}
            label = {labels}
            x = {accelerometerDataset.x}
            y = {accelerometerDataset.y}
            z = {accelerometerDataset.z}
            />
            <Divider />
            {executionHeader()}
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