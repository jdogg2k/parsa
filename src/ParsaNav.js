import { Container, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
import React from 'react';

export default class ParsaNav extends React.Component {

  goToGroups = () => {
    this.props.modeChange("groups");            
  }

  goToDataLoads = () => {
    this.props.modeChange("dataload");            
  }

render() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home"><Image src="/SURAVA_logo.webp" className='suravaLogo'/></Navbar.Brand>
        <Navbar.Brand href="#home">Parsa</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" defaultActiveKey="load">
            <Nav.Link eventKey="load" onClick={this.goToDataLoads}>Load Data</Nav.Link>
            <Nav.Link eventKey="segments" onClick={this.goToGroups}>My Customer Groups</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">Welcome {this.props.username}</Nav.Link>
            <Button variant="secondary" size="sm" onClick={() => this.props.handleSignOut()}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
}