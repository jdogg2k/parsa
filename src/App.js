import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import SegmentModal from './modals/SegmentModal'
import SegmentList from "./SegmentList";
import ParsaNav from './ParsaNav'
import Toaster from './Toaster'
import 'bootstrap/dist/css/bootstrap.min.css';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import "./App.css";
import ExcelReader from './ExcelReader';
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import { Container, Row, Col, Modal, Button, Alert, Form } from 'react-bootstrap';
import { createCustomer, createSegment, createCustomerData } from './graphql/mutations';
import {
  Heading,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
//import { listNotes } from "./graphql/queries";
/*import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";*/
import currency from "currency.js"

const App = ({ signOut, user }) => {
  const [segmentOpen, openSegment] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setToastViz] = useState(false);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [segmentModalShow, setSegmentModalShow] = useState(false);
  const [appMode, setAppMode] = useState("dataload");
 
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([]);
 
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo( ()=> ({
      sortable: true
    }));
 
  // Example of consuming Grid Event
  /*const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);*/

  //const [notes, setNotes] = useState([]);

  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    browserDatePicker: true
  }

  function currencyNegative(tVal) {
    return '$(' + parseFloat(tVal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,").replace("-", "") + ")";
  }

  function currencyFormatter(params) {
    if (params.value !== 0 && (params.value === null || params.value === undefined || params.value === "")) {
      return null;
    } else if (isNaN(params.value)) {
      return '$' + parseFloat(0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
  
      if (parseFloat(params.value) >= 0) {
        return '$' + parseFloat(params.value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        return currencyNegative(params.value);
      }
    }
  }

  function currencyCssFunc(params) {

    var borderSize = "1px";
    return {
      "textAlign": "right",
      "borderLeftStyle": "solid",
      "borderLeftWidth": borderSize,
      "borderLeftColor": "grey"
    };
  
  }

  function makeToast(msg) {
    setToastMessage(msg);
    setToastViz(true);
  }

  function hideToast() {
    setToastViz(false);
  }

  function closeSegment() {
    openSegment(false);
  }

  function parseAWSDate(userDate) {
      // split date string at '/' 
      var dateArr = userDate.split('/');
    
      // check for single number
      if(dateArr[0].length === 1){
        dateArr[0] = '0' + dateArr[0];
      }
      if (dateArr[1].length === 1){
        dateArr[1] = '0' + dateArr[1];
      } 
      
      // concatenate new values into one string
      userDate = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1] + "Z";
      
      // return value
      return userDate;
    }
    

  function saveSegmentData(segmentData) {
    const gridData = gridRef.current.api.getSelectedRows();
    processSave(gridData, segmentData);
  }

  async function saveCustomerDataRow(rowID, custID, cObj) {

    await API.graphql({
        query: createCustomerData,
        variables: {
            input: {
              "row_num": rowID,
              "product_name": cObj.product_name,
              "cost_of_goods_sold": cObj.cost_of_goods_sold,
              "unit_revenue": cObj.unit_revenue,
              "service_revenue": cObj.service_revenue,
              "cost_of_services": cObj.cost_of_services,
              "quantity": cObj.quantity,
              "customerID": custID,
              "services_purchased": (cObj.services_purchased === "N" ? false : true),
              "service_type": (cObj.service_type === undefined ? "" : cObj.service_type),
              "transaction_date": parseAWSDate(cObj.transaction_date)
            }
        }
      });

  }

  function saveCustomerData(custID, cData) {

    for (let i = 0; i < cData.length; i++) {
      saveCustomerDataRow(i + 1, custID, cData[i]);
    }

  }

  async function saveCustomer(cName, cData, segment) {

    const newCustomer = await API.graphql({
      query: createCustomer,
      variables: { input: {
        "name": cName,
        "segmentID": segment
      } }
    });

    const custID = newCustomer.data.createCustomer.id;

    saveCustomerData(custID, cData)


  }

  async function processSave(gData, sData) {
    const data = {
      userID: user.username,
      name: sData.name,
      description: sData.desc
    };

    const newSegment = await API.graphql({
      query: createSegment,
      variables: { input: data }
    });

    var segmentID = newSegment.data.createSegment.id;

    //group customers
    const customers = gData.reduce((group, node) => {
      const { customer_name } = node;
      group[customer_name] = group[customer_name] ?? [];
      group[customer_name].push(node);
      return group;
    }, {});

    //loop through data and save each customer then the data
    Object.keys(customers).forEach(key => {
      saveCustomer(key, customers[key], segmentID);
    })

    openSegment(false);

    makeToast("Segment Data Saved Successfully")
  }
  

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Customer Name',
      minWidth: 200,
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
    gridRef.current.api.selectAll();
  }, []);

  const handleMode = (tMode) =>{
    setAppMode(tMode);
  }

  const handleData = (xData) =>{

    setColumnDefs([
      {field: 'customer_name', headerName: 'Customer Name', filter: true, rowGroup: true, sort: 'asc', floatingFilter: true, hide: true},
      {field: 'product_name', headerName: 'Product Name', filter: true, floatingFilter: true},
      {field: 'transaction_date', headerName: 'Transaction Date', filter: 'agDateColumnFilter', filterParams: filterParams, floatingFilter: true},
      {field: 'distribution_type', headerName: 'Distribution Type', filter: true, floatingFilter: true},
      {field: 'cost_of_goods_sold', headerName: 'Cost of Goods Sold', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true},
      {field: 'unit_revenue', headerName: 'Unit Revenue', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true},
      {field: 'quantity', headerName: 'Quantity', filter: 'agNumberColumnFilter', aggFunc: 'sum', floatingFilter: true},
      {field: 'services_purchased', headerName: 'Services Purchased', filter: true, floatingFilter: true},
      {field: 'service_revenue', headerName: 'Service Revenue', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true},
      {field: 'cost_of_services', headerName: 'Cost of Services', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true},
      {field: 'service_type', headerName: 'Service Type', filter: true, floatingFilter: true}
    ]);

    const searchRegExp = /\s/g;
    const replaceWith = '_';

    for (let i = 0; i < xData.length; i++) {
      const item = xData[i];
      const rowObj = {};
      Object.keys(item).map(function(key) {
        var newKey = key.toLowerCase().replace(" ($)", "").replace(searchRegExp, replaceWith);
        var rawData = item[key];
        var newData = rawData;

        if (newKey.indexOf("cost") > -1 || newKey.indexOf("revenue") > -1) { //currency conversion
          newData = currency(rawData).value;
        }

        if (newKey.indexOf("quantity") > -1) { //numerical conversion
          newData = parseInt(rawData);
        }

        rowObj[newKey] = newData;
      });
      rowData.push(rowObj);
    }

    setRowData(rowData);

}

  useEffect(() => {
    //fetch('https://www.ag-grid.com/example-assets/row-data.json')
    //.then(result => result.json())
    //.then(rowData => setRowData(rowData))
    //fetchNotes();
  }, []);

  /*async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }*/

  return (
    <View className="App">
      <Toaster show={showToast} message={toastMessage} hideToast={hideToast}/>
      <ParsaNav username={user.username} handleSignOut={signOut} modeChange={handleMode} />
      <Container className={appMode === 'segments' ? '' : 'd-none'}>
        <Row style={{marginTop: "10px"}}>
          <Col><SegmentList /></Col>
        </Row>
      </Container>
       <Container className={appMode === 'dataload' ? '' : 'd-none'}>
        <Row style={{marginTop: "10px"}}>
          <Col><ExcelReader excelData={handleData} /></Col>
        </Row>
        <Row>
          <Col>
          { rowData.length > 0 ? <div className="ag-theme-alpine" style={{width: "100%", height: 500}}>
        <Alert key='warning' variant='warning'>
          Adjust selected rows before data is saved - de-select a row to prevent it from saving
        </Alert>
        <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API

            rowData={rowData} // Row Data for Rows
            onFirstDataRendered={onFirstDataRendered}
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            suppressAggFuncInHeader={true}
            autoGroupColumnDef={autoGroupColumnDef}
            groupDisplayType='singleColumn'
            groupSelectsChildren={true}
            showOpenedGroup={true}
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='multiple' // Options - allows click selection of rows
            groupAggFiltering={true}
            />
            <br />
            <Button onClick={() => openSegment(true)}>Save Data</Button>
      </div> : null }
          </Col>
        </Row>
      </Container>
      <SegmentModal 
            isOpen={segmentOpen} 
            handleSubmit={saveSegmentData}
            closeModal={closeSegment}
          /> 
    </View>
  );
};

export default withAuthenticator(App);