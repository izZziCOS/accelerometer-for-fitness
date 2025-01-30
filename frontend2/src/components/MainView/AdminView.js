import React, { useState } from 'react'
import { Button, Modal, Form, Divider } from 'semantic-ui-react'
import backend from '../../api/index'

export default function AdminView() {
    const [newModal, setNewModal] = useState(false)
    const [email, setEmail] = useState()
    const [role, setRole] = useState()

    const prepareNewRole = () => {
        setEmail("")
        setRole("")
        setNewModal(true)
      }

    const SubmitNew = () => {
        backend
          .post(`/userrole`, {
            email: email,
            role: role
          })
          .then((response) => {
            if (!response.data) {
              console.log('No response')
            }
            console.log(response.data)
          })
          .catch(() => {})
          setNewModal(false)
        }
    
    return(
      <React.Fragment>
          <Modal
           trigger={(
            <Button fluid size="huge" onClick={() => prepareNewRole(true)}>Priskirti pareigas</Button>
           )}
           open={newModal}
           >
      <Modal.Header>Priskirti pareigas</Modal.Header>
         <Modal.Content>
             <Form>
            <Form.Group>
             <Form.Field>
               <label>
                 El. paštas
               </label>
               <input
                placeholder="El. paštas"
                value={email}
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Field>
              <Form.Field>
                <label>
                  Pareigos
                </label>
                <input
                  placeholder="Pareigos"
                  value={role}
                  type="text"
                  onChange={(e) => setRole(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
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
      </React.Fragment>
  )
}
