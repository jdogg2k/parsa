import React from 'react';
import { ToastContainer, Toast, Row, Col } from 'react-bootstrap';

function Toaster(props) {

  return (
    <Row>
      <Col xs={6}>
        <ToastContainer className="p-3" position='top-start'>
          <Toast onClose={() => props.hideToast()} show={props.show} delay={3000} autohide bg={props.variant}>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Parsa</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body className='toastSuccess'>{props.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Col>
    </Row>
  );
}

export default Toaster;