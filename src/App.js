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
import kmeans from "./kmean.js";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import markerClusters from 'highcharts/modules/marker-clusters';

markerClusters(Highcharts);

const App = ({ signOut, user }) => {

  const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];

  const options = {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: 'Height Versus Weight of 507 Individuals'
    },
    subtitle: {
        text: 'Source: Heinz  2003'
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Height (cm)'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Weight (kg)'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        scatter: {
            dataLabels: {
                enabled: true,
                pointFormat: ''
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x} cm, {point.y} kg',
                clusterFormat: 'Clustered points: {point.clusterPointsAmount}'
            },
            marker: {
                radius: 5
            },
            cluster: {
                enabled: true,
                allowOverlap: false,
                layoutAlgorithm: {
                    type: 'kmeans',
                    distance: '7%'
                },
                dataLabels: {
                    style: {
                        fontSize: '9px'
                    },
                    y: -1
                },
                marker: {
                    lineColor: 'rgba(0, 0, 0, 0.1)'
                },
                zones: [{
                    from: 1,
                    to: 2,
                    marker: {
                        fillColor: '#AAE0EE',
                        radius: 12
                    }
                }, {
                    from: 3,
                    to: 5,
                    marker: {
                        fillColor: '#65CDEF',
                        radius: 13
                    }
                }, {
                    from: 6,
                    to: 9,
                    marker: {
                        fillColor: '#0DA9DD',
                        radius: 15
                    }
                }, {
                    from: 10,
                    to: 100,
                    marker: {
                        fillColor: '#2583C5',
                        radius: 18
                    }
                }]
            }
        }
    },
    series: [{
        name: 'Male',
        color: 'rgba(119, 152, 191, .5)',
        data: [
            [174.0, 65.6],
            [175.3, 71.8],
            [193.5, 80.7],
            [186.5, 72.6],
            [187.2, 78.8],
            [181.5, 74.8],
            [184.0, 86.4],
            [184.5, 78.4],
            [175.0, 62.0],
            [184.0, 81.6],
            [180.0, 76.6],
            [177.8, 83.6],
            [192.0, 90.0],
            [176.0, 74.6],
            [174.0, 71.0],
            [184.0, 79.6],
            [192.7, 93.8],
            [171.5, 70.0],
            [173.0, 72.4],
            [176.0, 85.9],
            [176.0, 78.8],
            [180.5, 77.8],
            [172.7, 66.2],
            [176.0, 86.4],
            [173.5, 81.8],
            [178.0, 89.6],
            [180.3, 82.8],
            [180.3, 76.4],
            [164.5, 63.2],
            [173.0, 60.9],
            [183.5, 74.8],
            [175.5, 70.0],
            [188.0, 72.4],
            [189.2, 84.1],
            [172.8, 69.1],
            [170.0, 59.5],
            [182.0, 67.2],
            [170.0, 61.3],
            [177.8, 68.6],
            [184.2, 80.1],
            [186.7, 87.8],
            [171.4, 84.7],
            [172.7, 73.4],
            [175.3, 72.1],
            [180.3, 82.6],
            [182.9, 88.7],
            [188.0, 84.1],
            [177.2, 94.1],
            [172.1, 74.9],
            [167.0, 59.1],
            [169.5, 75.6],
            [174.0, 86.2],
            [172.7, 75.3],
            [182.2, 87.1],
            [164.1, 55.2],
            [163.0, 57.0],
            [171.5, 61.4],
            [184.2, 76.8],
            [174.0, 86.8],
            [174.0, 72.2],
            [177.0, 71.6],
            [186.0, 84.8],
            [167.0, 68.2],
            [171.8, 66.1],
            [182.0, 72.0],
            [167.0, 64.6],
            [177.8, 74.8],
            [164.5, 70.0],
            [192.0, 101.6],
            [175.5, 63.2],
            [171.2, 79.1],
            [181.6, 78.9],
            [167.4, 67.7],
            [181.1, 66.0],
            [177.0, 68.2],
            [174.5, 63.9],
            [177.5, 72.0],
            [170.5, 56.8],
            [182.4, 74.5],
            [197.1, 90.9],
            [180.1, 93.0],
            [175.5, 80.9],
            [180.6, 72.7],
            [184.4, 68.0],
            [175.5, 70.9],
            [180.6, 72.5],
            [177.0, 72.5],
            [177.1, 83.4],
            [181.6, 75.5],
            [176.5, 73.0],
            [175.0, 70.2],
            [174.0, 73.4],
            [165.1, 70.5],
            [177.0, 68.9],
            [192.0, 102.3],
            [176.5, 68.4],
            [169.4, 65.9],
            [182.1, 75.7],
            [179.8, 84.5],
            [175.3, 87.7],
            [184.9, 86.4],
            [177.3, 73.2],
            [167.4, 53.9],
            [178.1, 72.0],
            [168.9, 55.5],
            [157.2, 58.4],
            [180.3, 83.2],
            [170.2, 72.7],
            [177.8, 64.1],
            [172.7, 72.3],
            [165.1, 65.0],
            [186.7, 86.4],
            [165.1, 65.0],
            [174.0, 88.6],
            [175.3, 84.1],
            [185.4, 66.8],
            [177.8, 75.5],
            [180.3, 93.2],
            [180.3, 82.7],
            [177.8, 58.0],
            [177.8, 79.5],
            [177.8, 78.6],
            [177.8, 71.8],
            [177.8, 116.4],
            [163.8, 72.2],
            [188.0, 83.6],
            [198.1, 85.5],
            [175.3, 90.9],
            [166.4, 85.9],
            [190.5, 89.1],
            [166.4, 75.0],
            [177.8, 77.7],
            [179.7, 86.4],
            [172.7, 90.9],
            [190.5, 73.6],
            [185.4, 76.4],
            [168.9, 69.1],
            [167.6, 84.5],
            [175.3, 64.5],
            [170.2, 69.1],
            [190.5, 108.6],
            [177.8, 86.4],
            [190.5, 80.9],
            [177.8, 87.7],
            [184.2, 94.5],
            [176.5, 80.2],
            [177.8, 72.0],
            [180.3, 71.4],
            [171.4, 72.7],
            [172.7, 84.1],
            [172.7, 76.8],
            [177.8, 63.6],
            [177.8, 80.9],
            [182.9, 80.9],
            [170.2, 85.5],
            [167.6, 68.6],
            [175.3, 67.7],
            [165.1, 66.4],
            [185.4, 102.3],
            [181.6, 70.5],
            [172.7, 95.9],
            [190.5, 84.1],
            [179.1, 87.3],
            [175.3, 71.8],
            [170.2, 65.9],
            [193.0, 95.9],
            [171.4, 91.4],
            [177.8, 81.8],
            [177.8, 96.8],
            [167.6, 69.1],
            [167.6, 82.7],
            [180.3, 75.5],
            [182.9, 79.5],
            [176.5, 73.6],
            [186.7, 91.8],
            [188.0, 84.1],
            [188.0, 85.9],
            [177.8, 81.8],
            [174.0, 82.5],
            [177.8, 80.5],
            [171.4, 70.0],
            [185.4, 81.8],
            [185.4, 84.1],
            [188.0, 90.5],
            [188.0, 91.4],
            [182.9, 89.1],
            [176.5, 85.0],
            [175.3, 69.1],
            [175.3, 73.6],
            [188.0, 80.5],
            [188.0, 82.7],
            [175.3, 86.4],
            [170.5, 67.7],
            [179.1, 92.7],
            [177.8, 93.6],
            [175.3, 70.9],
            [182.9, 75.0],
            [170.8, 93.2],
            [188.0, 93.2],
            [180.3, 77.7],
            [177.8, 61.4],
            [185.4, 94.1],
            [168.9, 75.0],
            [185.4, 83.6],
            [180.3, 85.5],
            [174.0, 73.9],
            [167.6, 66.8],
            [182.9, 87.3],
            [160.0, 72.3],
            [180.3, 88.6],
            [167.6, 75.5],
            [186.7, 101.4],
            [175.3, 91.1],
            [175.3, 67.3],
            [175.9, 77.7],
            [175.3, 81.8],
            [179.1, 75.5],
            [181.6, 84.5],
            [177.8, 76.6],
            [182.9, 85.0],
            [177.8, 102.5],
            [184.2, 77.3],
            [179.1, 71.8],
            [176.5, 87.9],
            [188.0, 94.3],
            [174.0, 70.9],
            [167.6, 64.5],
            [170.2, 77.3],
            [167.6, 72.3],
            [188.0, 87.3],
            [174.0, 80.0],
            [176.5, 82.3],
            [180.3, 73.6],
            [167.6, 74.1],
            [188.0, 85.9],
            [180.3, 73.2],
            [167.6, 76.3],
            [183.0, 65.9],
            [183.0, 90.9],
            [179.1, 89.1],
            [170.2, 62.3],
            [177.8, 82.7],
            [179.1, 79.1],
            [190.5, 98.2],
            [177.8, 84.1],
            [180.3, 83.2],
            [180.3, 83.2]
        ]
    }]
};


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
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

 
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
      newCust.overall_margin = parseFloat((((((sumCounts.unitRevenue - sumCounts.costOfGoodsSold) * sumCounts.quantity) + (sumCounts.serviceRevenue - sumCounts.costOfServices)) / ((sumCounts.costOfGoodsSold * sumCounts.quantity) + sumCounts.costOfServices)) * 100).toFixed(2));

      //todo calcs
      //Annual Revenue = (Total Revenue)/[(Today’s Date – Earliest Transaction Date)/365] per Customer Name
      //Annual Cost = (Total Cost)/[(Today’s Date – Earliest Transaction Date)/365] per Customer Name

      customerAggregations.push(newCust);

    });

    //console.log(allData);
    //console.log(customerAggregations);
    /*setRawCustomerData(allData);
    console.log(allData);
    console.log(rawCustomerData);*/

    //make clusters
    // Create the data 2D-array (vectors) describing the data
   /*let vectors = new Array();
    for (let i = 0 ; i < customerAggregations.length ; i++) {
      vectors[i] = [ customerAggregations[i]['sales_volume'] , customerAggregations[i]['overall_margin']];
    }

    nodeKmeans.clusterize(vectors, {k: 3}, (err,res) => {
      if (err) console.error(err);
      else console.log('%o',res);
    });*/

    // Data source: LinkedIn
const data = [
  {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
  {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
  {'company': 'Skype' , 'size': 700, 'revenue': 716},
  {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
  {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
  {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
];
 
// Create the data 2D-array (vectors) describing the data
let vectors = new Array();
for (let i = 0 ; i < customerAggregations.length ; i++) {
  vectors[i] = [ customerAggregations[i]['sales_volume'] , customerAggregations[i]['overall_margin']];
}

let result = kmeans(vectors, 3);
console.log(result);

handleMode("cluster");

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
      <Container className={appMode === 'cluster' ? '' : 'd-none'}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Container>
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