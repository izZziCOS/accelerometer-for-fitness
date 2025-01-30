import React, { useState, useEffect } from "react"
import {View, Text, Button, StyleSheet } from 'react-native'
import {accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes} from 'react-native-sensors'
import backend from '../api/index'
import { useDataApi } from '../utils/data'
import { LineChart, Path, Grid, XAxis, YAxis} from 'react-native-svg-charts'
import { Spinner } from 'native-base'

let subscription

const axesSvg = { fontSize: 10, fill: 'grey' };
const verticalContentInset = { top: 10, bottom: 10 }
const xAxisHeight = 30
let average = (array) => array.reduce((a, b) => a + b) / array.length;

export default function App({ route, navigation }) {

  const { exercise, username } = route.params;

  const [exerciseInformation] = useDataApi(`/exercise/${exercise}`,[],)
  const [accelerometerDataset, setAccelerometerDataset] = useState()
  const [x, setX] = useState()
  const [y, setY] = useState()
  const [z, setZ] = useState()
  const [timestamp, setTimestamp] = useState()

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 10); // 1000 yra sekunde, nustatyt kas kiek laiko matuot
    if (exerciseInformation.data.correctdata !== undefined){
    var accValues = JSON.parse(exerciseInformation.data.correctdata)
    setAccelerometerDataset(accValues)
    }
  }, [exerciseInformation.data.correctdata])

  useEffect(() => {
    if(x)
    {
    var executionAccuracy = calculateAccuracy()
    console.log("final", executionAccuracy)
      backend
      .post('/execution', {
        username: username,
        name: exercise,
        executionData: JSON.stringify({"x": x, "y": y, "z": z, "timestamp": timestamp}),
        executionAccuracy: executionAccuracy.toString(),
        date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      })
      .then((response) => {
        if (!response.data) {
          console.log('No response')
        }
        console.log(response.data)
      })
      .catch(() => {})
    }
  }, [timestamp])

  if (exerciseInformation.data.id === 0) {
    return (
      <Spinner
        style={{ marginTop: 10 }}
      />
    )
  }

  if (!accelerometerDataset) {
    return (
      <Spinner
        style={{ marginTop: 10 }}
      />
    )
  }

  const calculateAccuracy = () => {
    var c=[]
    for (var i = 0; i < x.length; i++) {
    c.push(Math.abs((y[i]-accelerometerDataset.y[i])/((y[i] + accelerometerDataset.y[i])/2)*100))
    }
    var currentAverage = average(c)
    if(currentAverage<1000.00)
    {
      var accuraccy = (1000.00-currentAverage)/10
      var value = parseInt(accuraccy)
      return value;
    }
    else return 0
  }

  const startExercise = () => {
    var startTime = Date.now()
    var xN = []
    var yN = []
    var zN = []
    var cTimestamp = []
      subscription = (accelerometer.subscribe(({timestamp, x, y, z}) => {
        if( Date.now() - startTime > exerciseInformation.data.time*1000){
          startTime = null
          subscription.unsubscribe()
          console.log(xN)
          setX(xN)
          setY(yN)
          setZ(zN)
          setTimestamp(cTimestamp)
          return
        }
        var xformated= Math.round((x + Number.EPSILON) * 100) / 100
        var yformated= Math.round((y + Number.EPSILON) * 100) / 100
        var zformated= Math.round((z + Number.EPSILON) * 100) / 100

        xN.push(xformated)
        yN.push(yformated)
        zN.push(zformated)
        cTimestamp.push(timestamp)
        }
      )
    )
  }

  const data = [
    {
        data: accelerometerDataset.x,
        svg: { stroke: 'purple' },
    },
    {
        data: accelerometerDataset.y,
        svg: { stroke: 'green' },
    },
    {
        data: accelerometerDataset.z,
        svg: { stroke: 'red' },
    }
  ]

  return (
    <View style={{ flex: 1 }}>
      <Text> Pratimas- {exercise}</Text>
      <Text> Telefono vieta - {exerciseInformation.data.phonelocation}</Text>
      <Text> Atlikimo trukmė - {exerciseInformation.data.time}s</Text>
      <Text> Treneris - {exerciseInformation.data.trainer}</Text>
      <View style={styles.center}>
      <Text style={styles.title}> Etaloninės trajektorijos</Text>
      </View>
      <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={data}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        data={data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
        <View style={{ flex: 1}}>
          <Button
          style = {{alignSelf: 'stretch'}}
          title="Pradėti atlikimą"
          onPress={ () => startExercise()}
          />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    color: "#000",
    
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
})