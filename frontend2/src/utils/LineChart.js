import React from 'react'
import { Line } from 'react-chartjs-2'

export default ({...props }) => (
    <Line
    data={{
        labels: props.label,
        datasets: [
            {
              label: 'x reikšmės',
              data: props.x,
              fill: false,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-axis-1',
              pointRadius: 0,
            },
            {
              label: 'y reikšmės',
              data: props.y,
              fill: false,
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgba(54, 162, 235, 0.2)',
              pointRadius: 0,
            },
            {
              label: 'z reikšmės',
              data: props.z,
              fill: false,
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgba(54, 162, 16, 0.2)',
              pointRadius: 0,
            },
          ],
      }}
      width = {props.width}
      height= {props.height}
      options={{
        scales: {
          xAxes: [
            {
              
              gridLines: {
                display: false,               
              },
              ticks: {
                display:false
              },
            },
          ],
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-axis-1',
            },
          ],
        },
      }}
      {...props}
    />
  )
  