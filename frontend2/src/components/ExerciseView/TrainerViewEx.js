import React, { useState } from 'react'
import { Button, Modal, Form, Divider } from 'semantic-ui-react'
import { useDataApi } from '../../utils/data'
import backend from '../../api/index'

export default function TrainerViewEx() {
  const [newModal, setNewModal] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [fullname] = useState(localStorage.getItem('fullname'))
  const [name, setName] = useState()
  const [x, setX] = useState()
  const [y, setY] = useState()
  const [z, setZ] = useState()
  const [phoneLocation, setPhoneLocation] = useState()
  const [time, setTime] = useState()
  const [exercises] = useDataApi(`/exercises/${fullname}`,[],)
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

  const prepareNewProject = () => {
    setName("")
    setPhoneLocation("")
    setTime("")
    setX("")
    setY("")
    setZ("")
    setNewModal(true)
  }

  const Submit = () => {
    var xN = x.split(',').map(Number)
    var yN = y.split(',').map(Number)
    var zN = z.split(',').map(Number)
  backend
    .put(`/exercise/${selected.id}`, {
      name: name,
      correctData: JSON.stringify({"x": xN, "y": yN, "z": zN}),
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

  const SubmitNew = () => {
    var xN = x.split(',').map(Number)
    var yN = y.split(',').map(Number)
    var zN = z.split(',').map(Number)
      backend
        .post(`/exercise`, {
          name: name,
          correctData: JSON.stringify({"x": xN, "y": yN, "z": zN}),
          trainer: fullname,
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
        setNewModal(false)
        window.location.reload()
      }
  
    const ExerciseC = () => {
      if(exercises.length === 0){
          return( null)
      }
        else{
          if(exercises.data)
          var exerciseCards = exercises.data.map((exercise) => (
          <React.Fragment 
          key={exercise.name}>
                    <Button
                      fluid
                      size="huge"
                      content={exercise.name}
                      onClick={() => { open(exercise)}}
                    />
                    <div style={{ marginTop: 10 }} />
                    </React.Fragment>
          ))
          return( 
            
            <div>{exerciseCards}</div>
            )
        }
      }    

    return(
      <React.Fragment>
         
          <Modal
           trigger={(
            <Button fluid size="huge" onClick={() => prepareNewProject()}>Sukurti naują pratimą</Button>
           )}
           open={newModal}
           >
      <Modal.Header>Sukurti naują pratimą</Modal.Header>
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
            <Button onClick={() => setNewModal(false)}>Atšaukti</Button>
            <Button onClick={() => SubmitNew()} positive>
              Patvirtinti
            </Button>
          </Modal.Actions>
           </Modal>

          <Divider/>
          {ExerciseC()}
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
