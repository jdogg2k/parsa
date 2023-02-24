import React from "react";
import { Form, Modal, Button, InputGroup, Container, Row, Col } from 'react-bootstrap';

export default class LimitUpliftModal extends React.Component {

  state={ uplift: "0" }

  changeUplift = (e) => this.setState({uplift: e.target.value});

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
            Modify Limit Uplift
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col sm={12}>
                        Please enter the highest percentage uplift you want to display. All customer uplift will be capped at this percentage.  A percentage value of 0 will remove the limit.
                    </Col>
                </Row>
                <Row>
                    <Col sm={8}>
                    <InputGroup className="mb-3 mt-4">
                        <InputGroup.Text>Uplift Limit</InputGroup.Text>
                        <Form.Control type="text" value={this.state.uplift} onChange={this.changeUplift}/>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => this.props.handleSubmit(this.state)}>OK</Button>
          <Button variant="danger" onClick={() => this.props.closeModal()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}