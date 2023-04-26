import React, { Component } from 'react';
import { Container, Accordion, Alert, ListGroup, Row, Col, Tab, Form, Button } from 'react-bootstrap';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class IngestProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCustTab: "",
            currentQuantTab: "",
            currentRevTab: "",
            selectedNums: new Map(),
            numberCalcs: [],
            numberFormula: ""
        }

        this.setActiveCustomer = function(custVal) {
            this.setState({ currentCustTab: custVal});
        }

        this.setActiveQuantity = function(quantVal) {
            this.setState({ currentQuantTab: quantVal});
        }

        this.setActiveRevenue = function(revVal) {
            this.setState({ currentRevTab: revVal });
        }

        this.handleChange = this.handleChange.bind(this);
        this.confirmStructure = this.confirmStructure.bind(this);
    }

    handleCalc = (e) => () => {
        var numCalcs = [];
        var numFormula = "";
        var rowCount = 1;

        const checkedMap = new Map([...this.state.selectedNums].filter(([k, v])=>v===true));
        const selectedArray = Array.from(checkedMap.keys());

        this.props.fieldInfo.sampleNumData.forEach(function(numRow){
            var calcObj = {};
            calcObj.id = rowCount;
            calcObj.value = null;

            selectedArray.forEach(function(item){
                if (calcObj.value === null) {
                    calcObj.value = numRow[item];
                    numFormula = item;
                } else {
                    calcObj.value = calcObj.value * numRow[item];
                    numFormula = numFormula + " X " + item;
                }
            })
            numCalcs.push(calcObj);
            rowCount++;
        });

        if (numFormula != "")
            numFormula = "{" + numFormula + "}";
        
        this.setState({numberCalcs: numCalcs, numberFormula: numFormula});
    }

    handleChange(e) {
        const item = e.target.value;
        const isChecked = e.target.checked;

        this.setState(prevState => ({ selectedNums: prevState.selectedNums.set(item, isChecked) }), this.handleCalc(e));  

    }

    confirmStructure(e) {
        this.props.postIngest(this.state);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fieldInfo !== this.props.fieldInfo) {
            if (this.props.fieldInfo.customerField !== undefined)
                this.setActiveCustomer(this.props.fieldInfo.customerField);

            if (this.props.fieldInfo.quantityField !== undefined)
                this.setActiveQuantity(this.props.fieldInfo.quantityField);

            if (this.props.fieldInfo.revenueField !== undefined)
                this.setActiveRevenue(this.props.fieldInfo.revenueField);

        }
    }

render() {
    return (
        <Container>
            <Alert variant="success" style={{textAlign: 'left'}}>
            <Alert.Heading>We have Data!</Alert.Heading>
            <p>
                The base ingestion is complete. Now we need to determine key fields to continue the analysis.  Please walk through the steps below.
            </p>
            </Alert>
            <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Customer Definition</Accordion.Header>
                <Accordion.Body>

                    <span className={this.state.currentCustTab !== '' ? '' : 'd-none'}>From looking at your data we have identified the selected field to define your Customer data element<br/>
                    If you would like to override this suggestion, please select a different text field below</span>

                    <Alert variant="danger" className={this.state.currentCustTab !== '' ? 'd-none' : ''}>
                        We were unable to automatically detect the Customer field in your dataset.  Please select a text field from the options below.
                    </Alert>

                    <Tab.Container id="customerTabs" activeKey={this.state.currentCustTab}>
                    <Row style={{marginTop: '15px'}}>
                        <Col sm={4}>
                        <ListGroup style={{textAlign: 'left'}}>
                            {this.props.fieldInfo.strings != undefined ?

                                this.props.fieldInfo.strings.map(str => {

                                    return(
                                        <ListGroup.Item key={str.name} action className={str.name === this.state.currentCustTab ? 'active' : ''}  onClick={() => this.setActiveCustomer(str.name)}>
                                            {str.name}
                                        </ListGroup.Item>
                                    )
                                }) : ""
                            }
                        </ListGroup>
                        </Col>
                        <Col sm={8}>
                        <Tab.Content>
                            {this.props.fieldInfo.strings != undefined ?
                                this.props.fieldInfo.strings.map(str => {
                                    return(
                                        <Tab.Pane key={'pane' + str.name} eventKey={str.name}>
                                            <ListGroup>
                                                {this.props.fieldInfo.sampleStringData != undefined ?
                                                    this.props.fieldInfo.sampleStringData.map(data => {
                                                        return(
                                                            <ListGroup.Item key={data.__rowNum__} variant="info">{data[str.name]}</ListGroup.Item>
                                                        )
                                                    }) : ""
                                                }
                                            </ListGroup>
                                        </Tab.Pane>
                                    )
                                }) : ""
                            }
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>

                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Quanitity Definition</Accordion.Header>
                <Accordion.Body>

                    <span className={this.state.currentQuantTab !== '' ? '' : 'd-none'}>From looking at your data we have identified the selected field to define your Quantity data element<br/>
                    If you would like to override this suggestion, please select a different numerical field below</span>

                    <Alert variant="danger" className={this.state.currentQuantTab !== '' ? 'd-none' : ''}>
                        We were unable to automatically detect the Quantity field in your dataset.  Please select a text field from the options below.
                    </Alert>

                    <Tab.Container id="customerTabs" activeKey={this.state.currentQuantTab}>
                    <Row style={{marginTop: '15px'}}>
                        <Col sm={4}>
                        <ListGroup style={{textAlign: 'left'}}>
                            {this.props.fieldInfo.numbers != undefined ?

                                this.props.fieldInfo.numbers.map(str => {

                                    return(
                                        <ListGroup.Item key={str.name} action className={str.name === this.state.currentQuantTab ? 'active' : ''}  onClick={() => this.setActiveQuantity(str.name)}>
                                            {str.name}
                                        </ListGroup.Item>
                                    )
                                }) : ""
                            }
                        </ListGroup>
                        </Col>
                        <Col sm={8}>
                        <Tab.Content>
                            {this.props.fieldInfo.numbers != undefined ?
                                this.props.fieldInfo.numbers.map(str => {
                                    return(
                                        <Tab.Pane key={'pane' + str.name} eventKey={str.name}>
                                            <ListGroup>
                                                {this.props.fieldInfo.sampleNumData != undefined ?
                                                    this.props.fieldInfo.sampleNumData.map(data => {
                                                        return(
                                                            <ListGroup.Item key={data.__rowNum__} variant="info">{data[str.name]}</ListGroup.Item>
                                                        )
                                                    }) : ""
                                                }
                                            </ListGroup>
                                        </Tab.Pane>
                                    )
                                }) : ""
                            }
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>

                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Revenue Definition (Single Field)</Accordion.Header>
                <Accordion.Body>

                <span className={this.state.currentRevTab !== '' ? '' : 'd-none'}>From looking at your data we have identified the selected field to define your Revenue data element<br/>
                    If you would like to override this suggestion, please select a different numerical field below</span>

                    <Alert variant="danger" className={this.state.currentRevTab !== '' ? 'd-none' : ''}>
                        We were unable to automatically detect the Revenue field in your dataset.  Please select a text field from the options below.
                    </Alert>

                    <Tab.Container id="revenueTabs" activeKey={this.state.currentRevTab}>
                    <Row style={{marginTop: '15px'}}>
                        <Col sm={4}>
                        <ListGroup style={{textAlign: 'left'}}>
                            {this.props.fieldInfo.numbers != undefined ?

                                this.props.fieldInfo.numbers.map(num => {

                                    return(
                                        <ListGroup.Item key={num.name} action className={num.name === this.state.currentRevTab ? 'active' : ''}  onClick={() => this.setActiveRevenue(num.name)}>
                                            {num.name}
                                        </ListGroup.Item>
                                    )
                                }) : ""
                            }
                        </ListGroup>
                        </Col>
                        <Col sm={8}>
                        <Tab.Content>
                            {this.props.fieldInfo.numbers != undefined ?
                                this.props.fieldInfo.numbers.map(num => {
                                    return(
                                        <Tab.Pane key={'pane' + num.name} eventKey={num.name}>
                                            <ListGroup>
                                                {this.props.fieldInfo.sampleNumData != undefined ?
                                                    this.props.fieldInfo.sampleNumData.map(data => {
                                                        return(
                                                            <ListGroup.Item key={data.__rowNum__} variant="info">{data[num.name]}</ListGroup.Item>
                                                        )
                                                    }) : ""
                                                }
                                            </ListGroup>
                                        </Tab.Pane>
                                    )
                                }) : ""
                            }
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Revenue Definition (Calculation)</Accordion.Header>
                <Accordion.Body>
                    You can optionally override the single-field suggestion and instead select two-or-more fields below to calculate revenue.<br />
                    As you select the fields the sample calculation results will display.

                    <Alert variant="info" className={this.state.numberFormula !== "" ? '' : 'd-none'}>
                    <p>
                        {this.state.numberFormula}
                    </p>
                    </Alert>

                    <Form>
                    <Row style={{marginTop: '15px'}}>
                        <Col sm={2}>
                        <ListGroup>
                        {this.props.fieldInfo.numbers != undefined ?

                        this.props.fieldInfo.numbers.map(item => {

                            return(
                                    <label key={item.name} className="multiCheckLabel">
                                        <input type="checkbox" value={item.name} onChange={this.handleChange} className="multiCheck"/>{item.name}
                                    </label>
                            )
                        }) : ""
                        }
                        </ListGroup>
                        </Col>
                        <Col sm={10}>
                            <ListGroup>
                                                {this.state.numberFormula !== "" ?
                                                    this.state.numberCalcs.map(num => {
                                                        return(
                                                            <ListGroup.Item key={num.id} variant="default">{num.value}</ListGroup.Item>
                                                        )
                                                    }) : ""
                                                }
                                            </ListGroup>
                        </Col>
                    </Row>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
                <Accordion.Header>Confirm Data Configuration</Accordion.Header>
                <Accordion.Body>
                    <Alert variant="info">
                        <p>
                        The following data fields from your imported data have been configured based on your selections.<br /> Please review and confirm to begin the visualization process or make changes in the previous steps.
                        </p>
                    </Alert>
                    <Form style={{textAlign: 'left'}}>
                        <Form.Group className="mb-3" controlId="customerLabel">
                            <Form.Label>Customer Field</Form.Label>
                            <Form.Control type="text" placeholder={this.state.currentCustTab} readOnly/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="quantityLabel">
                            <Form.Label>Quantity Field</Form.Label>
                            <Form.Control type="text" placeholder={this.state.currentQuantTab} readOnly/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="revenueLabel">
                            <Form.Label>Revenue {this.state.numberFormula !== "" ? 'Calculation' : 'Field'}</Form.Label>
                            <Form.Control type="text" placeholder={this.state.numberFormula !== "" ? this.state.numberFormula : this.state.currentRevTab} readOnly/>
                        </Form.Group>
                    </Form>
                    <Button variant="success" onClick={this.confirmStructure}>Confirm Data Structure</Button>
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
        </Container>
    );
    }
}

export default IngestProcess;