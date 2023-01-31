import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import CustomerGroupModel from './modals/CustomerGroupModal'
import CustomerGroupList from "./CustomerGroupList";
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
import { createCustomer, createCustomerGroup, createCustomerData } from './graphql/mutations';
import { listCustomerGroups, getCustomerGroup, listCustomers, getCustomer, listCustomerData, getCustomerData } from "./graphql/queries";
import {
  Heading,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import currency from "currency.js";

const App = ({ signOut, user }) => {
  const [groupModalOpen, openGroupModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [showToast, setToastViz] = useState(false);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [groupData, setGroupData] = useState([]);
  const [rawCustomerData, setRawCustomerData] = useState([]);
  const [groupModalShow, setGroupModalShow] = useState(false);
  const [appMode, setAppMode] = useState("dataload");
 
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([]);
 
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo( ()=> ({
      sortable: true
    }));

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

  function makeToast(msg, variant) {
    setToastMessage(msg);
    setToastVariant(variant);
    setToastViz(true);
  }

  function hideToast() {
    setToastViz(false);
  }

  function closeGroupModal() {
    openGroupModal(false);
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
    
  function createNewGroup() {
    const gridData = gridRef.current.api.getSelectedRows();
    if (gridData.length > 0){
      openGroupModal(true);
    } else {
      makeToast('No Customers Selected, cannot create group!', 'danger');
    }
    
  }

  async function getCustomerGroups() {
    // List all items
    const allCustomerGroups = await API.graphql({
      query: listCustomerGroups,
      variables: { userID: user.username}
    });
    setGroupData(allCustomerGroups.data.listCustomerGroups.items);
  }

  function saveGroupData(groupData) {
    const gridData = gridRef.current.api.getSelectedRows();
    processSave(gridData, groupData);
  }

  async function doCluster(groupID) {
    //first get customers per group
    // Query with filters, limits, and pagination
    let custFilter = {
      customerGroupID: {
          eq: groupID
      }
    };
    const myCustomers = await API.graphql({
      query: listCustomers,
      variables: { filter: custFilter }
    });
    let custData = myCustomers.data.listCustomers.items;

    var custIDs = [];
    custData.forEach(function(cObj) {
      custIDs.push({ customerID: { eq: cObj.id } });
    });

    let dataFilter = {
      or: custIDs
    }

    const fullData = await API.graphql({ query: listCustomerData, variables: { filter: dataFilter } });

    var allData = fullData.data.listCustomerData.items;

    //sort
    allData.sort((a, b) => (a.customerID > b.customerID) ? 1 : -1);

    console.log(allData);

    //add customer names + aggregations
    var customerAggregations = [];
    var sumCounts = {};

    custData.forEach(function(cObj) {

      sumCounts.serviceRevenue = 0;
      sumCounts.unitRevenue = 0;
      sumCounts.quantity = 0;
      sumCounts.costOfGoodsSold = 0;
      sumCounts.costOfServices = 0;

      var newCust = {};
      newCust.id = cObj.id;
      newCust.name = cObj.name;

      //filter raw data
      newCust.rawData = allData.filter(function(data) {
        return data.customerID === cObj.id;
      });

      //sum values
      newCust.rawData.forEach(function(tData) {
        sumCounts.serviceRevenue += tData.service_revenue;
        sumCounts.unitRevenue += tData.unit_revenue;
        sumCounts.quantity += tData.quantity;
        sumCounts.costOfGoodsSold += tData.cost_of_goods_sold;
        sumCounts.costOfServices += tData.cost_of_services;
      });

      //set calculations
      newCust.sales_volume = (sumCounts.unitRevenue * sumCounts.quantity) + sumCounts.serviceRevenue;
      newCust.total_cost = (sumCounts.costOfGoodsSold * sumCounts.quantity) + sumCounts.costOfServices;
      newCust.product_margin = ((((sumCounts.unitRevenue - sumCounts.costOfGoodsSold) * sumCounts.quantity) / (sumCounts.costOfGoodsSold * sumCounts.quantity)) * 100).toFixed(2);
      if (sumCounts.serviceRevenue === 0 && sumCounts.costOfServices === 0) {
        newCust.service_margin = 0;
      } else {
        newCust.service_margin = (((sumCounts.serviceRevenue - sumCounts.costOfServices) / sumCounts.costOfServices) * 100).toFixed(2);
      }
      newCust.overall_margin = (((((sumCounts.unitRevenue - sumCounts.costOfGoodsSold) * sumCounts.quantity) + (sumCounts.serviceRevenue - sumCounts.costOfServices)) / ((sumCounts.costOfGoodsSold * sumCounts.quantity) + sumCounts.costOfServices)) * 100).toFixed(2);

      //todo calcs
      //Annual Revenue = (Total Revenue)/[(Today’s Date – Earliest Transaction Date)/365] per Customer Name
      //Annual Cost = (Total Cost)/[(Today’s Date – Earliest Transaction Date)/365] per Customer Name

      customerAggregations.push(newCust);

    });

    //console.log(allData);
    console.log(customerAggregations);
    /*setRawCustomerData(allData);
    console.log(allData);
    console.log(rawCustomerData);*/

    //make clusters

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

  async function saveCustomer(cName, cData, group) {

    const newCustomer = await API.graphql({
      query: createCustomer,
      variables: { input: {
        "name": cName,
        "customerGroupID": group
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

    const newCustomerGroup = await API.graphql({
      query: createCustomerGroup,
      variables: { input: data }
    });

    var groupID = newCustomerGroup.data.createCustomerGroup.id;

    //group customers
    const customers = gData.reduce((group, node) => {
      const { customer_name } = node;
      group[customer_name] = group[customer_name] ?? [];
      group[customer_name].push(node);
      return group;
    }, {});

    //loop through data and save each customer then the data
    Object.keys(customers).forEach(key => {
      saveCustomer(key, customers[key], groupID);
    })

    openGroupModal(false);

    makeToast("Customer Group Data Saved Successfully", "success");

    handleMode("groups");
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
  }, []);

  const handleMode = (tMode) =>{
    if (tMode === "groups") {
      //get groups
      getCustomerGroups();
    }
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
      <Toaster show={showToast} message={toastMessage} variant={toastVariant} hideToast={hideToast}/>
      <ParsaNav username={user.username} handleSignOut={signOut} modeChange={handleMode} />
      <Container className={appMode === 'groups' ? '' : 'd-none'}>
        <Row style={{marginTop: "10px"}}>
          <Col><CustomerGroupList data={groupData} handleCluster={doCluster}/></Col>
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
          Select grouped customer rows of customers you want to add to a Customer Group
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
            <Button onClick={() => createNewGroup()}>Create Customer Group</Button>
      </div> : null }
          </Col>
        </Row>
      </Container>
      <CustomerGroupModel
            isOpen={groupModalOpen} 
            handleSubmit={saveGroupData}
            closeModal={closeGroupModal}
          /> 
    </View>
  );
};

export default withAuthenticator(App);