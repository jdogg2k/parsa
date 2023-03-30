import React, { Component } from 'react';
import { Container, Accordion, Alert, ListGroup, Row, Col, Tab, Form } from 'react-bootstrap';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class IngestProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCustTab: "",
            currentRevTab: "",
            selectedNums: new Map(),
            numberCalcs: []
        }

        this.setActiveCustomer = function(custVal) {
            this.setState({ currentCustTab: custVal});
        }

        this.setActiveRevenue = function(revVal) {
            this.setState({ currentRevTab: revVal });
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleCalc = (e) => () => {
        var numCalcs = [];
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
                } else {
                    calcObj.value = calcObj.value * numRow[item];
                }
            })
            numCalcs.push(calcObj);
            rowCount++;
        });
        
        this.setState({numberCalcs: numCalcs});
    }

    handleChange(e) {
        const item = e.target.value;
        const isChecked = e.target.checked;

        this.setState(prevState => ({ selectedNums: prevState.selectedNums.set(item, isChecked) }), this.handleCalc(e));  

    }

    /**/

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fieldInfo !== this.props.fieldInfo) {
            if (this.props.fieldInfo.customerField !== undefined)
                this.setActiveCustomer(this.props.fieldInfo.customerField);

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

                    From looking at your data we have identified the selected field to define your Customer data element<br/>
                    If you would like to override this suggestion, please select a different text field below

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
                <Accordion.Header>Revenue Definition (Single Field)</Accordion.Header>
                <Accordion.Body>
                From looking at your data we have identified the selected field to define your Revenue data element<br/>
                    If you would like to override this suggestion, please select a different numerical field below

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
            <Accordion.Item eventKey="2">
                <Accordion.Header>Revenue Definition (Calculation)</Accordion.Header>
                <Accordion.Body>
                    You can optionally override the single-field suggestion and instead select two-or-more fields below to calculate revenue.<br />
                    As you select the fields the sample calculation results will display.

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
                                                {this.state.numberCalcs.length > 0 ?
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
            </Accordion>
        </Container>
    );
    }
}

export default IngestProcess;