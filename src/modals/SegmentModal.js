import React from "react";
import { Form, Modal, Button } from 'react-bootstrap';

export default class SegmentModal extends React.Component {

  state={ name: '', desc: '' }

  changeName = (e) => this.setState({name: e.target.value});
  changeDesc = (e) => this.setState({desc: e.target.value});

  render(){
    return(
      <Modal 
        show={this.props.isOpen} 
        onHide={this.props.closeModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Save Data Segment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Segment Name</Form.Label>
              <Form.Control type="text" value={this.state.name} onChange={this.changeName}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={this.state.desc} onChange={this.changeDesc}/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => this.props.handleSubmit(this.state)}>Save</Button>
          <Button variant="danger" onClick={() => this.props.closeModal()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}