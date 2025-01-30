import React, { useEffect, useState} from 'react'
import { Grid, Input, Button, Icon, Loader } from 'semantic-ui-react'
import backend from '../../api/index'
import LineChart from '../../utils/LineChart'
import { useDataApi } from '../../utils/data'

export default function ChartRow(props) {
    const[trainerComment, setTrainerComment] = useState()
    const [profile] = useState(localStorage.getItem('profile'))
    const [userRole] = useDataApi(`/userrole/${profile}`,[],)

    useEffect(() => {
        setTrainerComment(props.comment)
      }, [])

    if (userRole.data.role === undefined) {
        return (
            <Loader
            active
            inline="centered"
            size="massive"
            style={{ marginTop: 10 }}
            />
        )
    }

    const remove = () => {
        backend
        .delete(`/execution/${props.id}`)
        .then((response) => {
            if (!response.data) {
            console.log('No response')
            }
            console.log(response.data)
        })
        .catch(() => {})
        window.location.reload()
    }

    const comment = () => {
        backend
        .put(`/comment/${props.id}`, {
            comment: trainerComment
          })
          .then((response) => {
            if (!response.data) {
              console.log('No response')
            }
            console.log(response.data)
          })
          .catch(() => {})
        window.location.reload()
    }

    const userView = () =>{
        return(
            <Grid.Column width={5}>
                        <b>Atlikimo data:</b> {props.timestamp} <br></br>
                        <b>Atlikimo tikslumas:</b> {props.executionAccuracy}%<br></br>
                        <b>Trenerio komentaras:</b> {props.comment} <br></br>
                    <Button 
                    color = 'red'
                    onClick={() => remove(props.id)}> 
                        <Icon name = 'delete'></Icon>
                        Pasalinti
                    </Button>
                    </Grid.Column>
        )
    }

    const trainerView = () =>{
        return(
            <Grid.Column width={5}>
                <b>Atlikimo data:</b> {props.timestamp} <br></br>
                <b>Atlikimo tikslumas:</b> {props.executionAccuracy} <br></br>
                <Input
                placeholder="Trenerio komentaras"
                value={trainerComment}
                type="text"
                fluid
                onChange={(e) => setTrainerComment(e.target.value)}
                />
                <br></br>
                <Button 
                size = 'small'
                color = 'green'
                onClick={() => comment(props.id)}> 
                    <Icon name = 'check'></Icon>
                    Patvirtinti
                </Button>
            </Grid.Column>
        )
    }

    const view = () =>{
        if(userRole.data.role === "Vartotojas")
        return(
            <React.Fragment>{userView()}</React.Fragment>
        )
        if(userRole.data.role === "Treneris")
        return(
            <React.Fragment>{trainerView()}</React.Fragment>
        )
    }

    return(
            <Grid divided>
                <Grid.Row>
                    {view()}
                    <Grid.Column width={11}>
                        <LineChart
                        height = {props.height}
                        width = {props.width}
                        label = {props.labels}
                        x = {props.x}
                        y = {props.y}
                        z = {props.z}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    )
}