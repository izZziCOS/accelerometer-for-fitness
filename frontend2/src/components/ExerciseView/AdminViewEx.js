import React, { useState } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import backend from '../../api/index'

export default function AdminViewEx() {
    const [openModal, setOpenModal] = useState(false)
    const [name, setName] = useState()
    const [x, setX] = useState()
    const [y, setY] = useState()
    const [z, setZ] = useState()
    const [phoneLocation, setPhoneLocation] = useState()
    const [time, setTime] = useState()
    const [exercises] = useDataApi(`/exercises`,[],)
    const [selected, setSelected] = useState(null)

    const open = exercise => {
      if(exercise.correctData!=="{}")
      {
      var accelerometerValues = JSON.parse(exercise.correctdata)
      setX(accelerometerValues.x)
      setY(accelerometerValues.y)
      setZ(accelerometerValues.z)
      }
      setSelected(exercise)
      setOpenModal(true)
      setName(exercise.name)
      setPhoneLocation(exercise.phonelocation)
      setTime(exercise.time)
      
    }
  
    const close = () => {
      setSelected(null);
    }

    const Submit = () => {
    backend
      .put(`/exercise/${selected.id}`, {
        name: name,
        correctData: JSON.stringify({"x": [x], "y": [y], "z": [z]}),
        phoneLocation: phoneLocation,
        time: time
      })
      .then((response) => {
        if (!response.data) {
          console.log('No response')
        }
        console.log(response.data)
      })
      .catch(() => {})
      close()
    }

    const exerciseCards = exercises.data.map((exercise) => (
      <React.Fragment>
        <Button
          key={exercise.name}
          fluid
          size="huge"
          content={exercise.name}
          onClick={() => { open(exercise)}}
        />
        <div style={{ marginTop: 10 }} />
        </React.Fragment>
    ))
      
    return(
      <React.Fragment>
         {exerciseCards}
         {!!selected && (
           <Modal
           onClose={() => close()}
           open = {openModal}
           onOpen={()=> open(selected)}
           >
      <Modal.Header>Redaguoti pratimo informaciją</Modal.Header>
         <Modal.Content>
             <Form>
            <Form.Group>
             <Form.Field>
               <label>
                 Pratimo pavadinimas
               </label>
               <input
                placeholder="Pratimo pavadinimas"
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
              <Form.Field>
                <label>
                  Telefono vieta
                </label>
                <input
                  placeholder="Telefono vieta"
                  value={phoneLocation}
                  type="text"
                  onChange={(e) => setPhoneLocation(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>
                  Atlikimo trukmė (s)
                </label>
                <input
                  placeholder="Atlikimo trukmė"
                  value={time}
                  type="text"
                  onChange={(e) => setTime(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
              <Form.Field>
               <label>
                 Etaloniniai duomenys (X ašis)
               </label>
               <input
                placeholder="Etaloniniai duomenys (X ašis)"
                value={x}
                type="text"
                onChange={(e) => setX(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
               <label>
               Etaloniniai duomenys (Y ašis)
               </label>
               <input
                placeholder="Etaloniniai duomenys (Y ašis)"
                value={y}
                type="text"
                onChange={(e) => setY(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
               <label>
               Etaloniniai duomenys (Z ašis)
               </label>
               <input
                placeholder="Etaloniniai duomenys (Z ašis)"
                value={z}
                type="text"
                onChange={(e) => setZ(e.target.value)}
              />
            </Form.Field>
          </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => close()}>Atšaukti</Button>
            <Button onClick={() => Submit()} positive>
              Patvirtinti
            </Button>
          </Modal.Actions>
           </Modal>
         )}
      </React.Fragment>
  )
}
