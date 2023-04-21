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
import { Container, Row, Col, Modal, Button, Alert, Image, ListGroup } from 'react-bootstrap';
import { createCustomer, createCustomerGroup, createCustomerData, deleteCustomer, deleteCustomerGroup, deleteCustomerData } from './graphql/mutations';
import { listCustomerGroups, customersByCustomerGroupID, customerDataByCustomerID, listCustomers, getCustomer, listCustomerData, getCustomerData } from "./graphql/queries";
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
import * as jstat from "jstat";
import LimitUpliftModal from "./modals/LimitUpliftModal";
import IngestProcess from "./IngestProcess";

markerClusters(Highcharts);

const App = ({ signOut, user }) => {

  Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });

  function percentFormatter(params) {
    return params.value + '%';
  }

  const chartComponentRef = useRef(null);
  const [plotData, setPlotData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const options = {
    /*chart: {
        type: 'scatter',
        zoomType: 'xy'
    },*/
    title: {
        text: 'Customer Metrics'
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Sales Volume'
        },
        labels: {
          format: '${value:,.0f}'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Overall Margin %'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
      formatter: function () {
            var retStr = "Regression Line";

            if (this.series.type === 'scatter') {
              console.log(upliftLimit);
              var sName = this.series.name;
              var sData = seriesData.filter((sObj) => sObj.name === sName)[0].clusterData;
              var retStr = '<b>' + sName + '</b><br/>Expected Margin: <b>' + Highcharts.numberFormat(sData.expectedMargin,2) + '%</b><br/>Uplift Potential <b>$' + Highcharts.numberFormat(sData.upliftPotential,2) + '</b><br/><br/>Customer: ' + this.point.rawdata.name + '<br/>Actual Margin: <b>' + Highcharts.numberFormat(this.point.y,2) + '%</b><br/>' + 'Sales Volume: <b>$'+Highcharts.numberFormat(this.point.x,0)+'</b><br/>';
              retStr += 'Uplift Potential: <b>';
              if (this.point.rawdata.upliftPotential === "N/A") {
                retStr += 'N/A</b>';
              } else {
                var uP = Highcharts.numberFormat(this.point.rawdata.upliftPotential,2);
                //check for limit change
                if (upliftLimit > 0) {
                  uP = Highcharts.numberFormat(parseFloat((upliftLimit / 100).toFixed(2)) * this.point.x,2);
                }
                retStr += '$' + uP +'</b>';
              }
            }
            
            return retStr;
          }
  },
    plotOptions: {
        scatter: {
          marker: {
            radius: 4,
            symbol: "circle",
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)"
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          }
        },
        line: {
          lineWidth: 2.5
        }
      },
    series: seriesData
};

  const [upliftLimit, setUpliftLimit] = useState(0);
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [groupModalOpen, openGroupModal] = useState(false);
  const [upliftModalOpen, openUpliftModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [fieldInformation, setFieldInformation] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [showToast, setToastViz] = useState(false);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const custGridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]);
  const [isolatedData, setIsolatedData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [rawCustomerData, setRawCustomerData] = useState([]);
  const [groupModalShow, setGroupModalShow] = useState(false);
  const [appMode, setAppMode] = useState("dataload");
  const [marginChangeHeader, setMarginChangeHeader] = useState('Margin Change');
  const [upliftPotentialHeader, setUpliftPotentialHeader] = useState('Uplift Potential');
  const custColDefs = [
    {field: 'customer_name', headerName: 'Customer Name', filter: true, sort: 'asc', floatingFilter: true},
    {field: 'expected_margin', headerName: 'Expected Margin', filter: 'agNumberColumnFilter', floatingFilter: true, valueFormatter: percentFormatter},
    {field: 'actual_margin', headerName: 'Actual Margin', filter: 'agNumberColumnFilter', floatingFilter: true, valueFormatter: percentFormatter},
    {field: 'margin_change', headerName: marginChangeHeader, filter: 'agNumberColumnFilter', floatingFilter: true, valueFormatter: percentFormatter},
    {field: 'uplift_potential', headerName: upliftPotentialHeader, filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, cellStyle: currencyCssFunc, floatingFilter: true}
  ];

  const cPallete = ['#ff676c', '#7e82ed', '#ffae1d', '#42b79b', '#d688d1', '#000000'];
  const lineColor = '#000000';
 
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

    //var borderSize = "1px";
    return {
      "textAlign": "right",
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

  function closeUpliftModal() {
    openUpliftModal(false);
  }

  function saveUpliftData(upliftData) {
    let newUplift = parseFloat(upliftData.uplift);
    setUpliftLimit(newUplift);

    let headerSuffix = "";
    if (newUplift > 0)
      headerSuffix = " (Limited)";
      
    setMarginChangeHeader("Margin Change" + headerSuffix);
    setUpliftPotentialHeader("Uplift Potential" + headerSuffix);

    closeUpliftModal();

    if (selectedCluster !== 0)
      isolateSeries(selectedCluster, newUplift);

  }

  function parseAWSDate(userDate) {
      
      var day = userDate.getUTCDate().toString();
      var month = (userDate.getUTCMonth() + 1).toString();
    
      // check for single number
      if(day.length === 1){
        day = '0' + day;
      }
      if (month.length === 1){
        month = '0' + month;
      } 
      
      // concatenate new values into one string
      var retDate = userDate.getUTCFullYear() + "-" + month + "-" + day + "Z";
      
      // return value
      return retDate;
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
      variables: {
        filter: {
          userID: {
            eq: user.username
          }
        }
      }
    });
    setGroupData(allCustomerGroups.data.listCustomerGroups.items);
  }

  function saveGroupData(groupData) {
    const gridData = gridRef.current.api.getSelectedRows();
    processSave(gridData, groupData);
  }

  async function deleteThisGroup(gID) {
    const deletedCustomerGroup = await API.graphql({
        query: deleteCustomerGroup,
        variables: {
            input: {
                id: gID
            }
        }
    });
  }

  async function deleteThisCustomer(cID) {
    const deletedCustomer = await API.graphql({
        query: deleteCustomer,
        variables: {
            input: {
                id: cID
            }
        }
    });
  }

  async function deleteThisCustomerData(dID) {
    const deletedCustomerData = await API.graphql({
        query: deleteCustomerData,
        variables: {
            input: {
                id: dID
            }
        }
    });
  }

  async function doGroupDelete(groupID) {

    if (window.confirm("Are you sure want to permanently delete all customer data for this group?") == true) {
      //first get customers per group
      const myCustomers = await API.graphql({
        query: customersByCustomerGroupID,
        variables: { customerGroupID: groupID, limit: 500 }
      });

      let tCustomers = myCustomers.data.customersByCustomerGroupID.items;



      await Promise.all(tCustomers.map(async (cObj) => {  //delete customer data first
        var custData = await getDataForCustomer(cObj.id); //get raw row info
        custData.forEach(async function(cObj) {
            await deleteThisCustomerData(cObj.id); //delete each data row
        });
      }));

      await Promise.all(tCustomers.map(async (cObj) => {  //delete customers next
        await deleteThisCustomer(cObj.id); 
      }));

      await deleteThisGroup(groupID); //finally delete group

      makeToast("Group Deleted Successfully!", "success");

      getCustomerGroups(); //reset group data
    }

  }

  async function getDataForCustomer(cID) {
    // List all items
    const cData = await API.graphql({
      query: customerDataByCustomerID,
      variables: { customerID: cID}
    });
    return cData.data.customerDataByCustomerID.items;
  }

  function regression(arrWeight, arrHeight) {
    let r, sy, sx, b, a, meanX, meanY;
    r = jstat.corrcoeff(arrHeight, arrWeight);
    sy = jstat.stdev(arrWeight);
    sx = jstat.stdev(arrHeight);
    meanY = jstat(arrWeight).mean();
    meanX = jstat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;
    //Set up a line
    let y1, y2, x1, x2;
    x1 = jstat.min(arrHeight);
    x2 = jstat.max(arrHeight);
    y1 = a + b * x1;
    y2 = a + b * x2;
    return {
      line: [
        [x1, y1],
        [x2, y2]
      ],
      r
    };
  }

  async function doCluster(groupID) {

    //first get customers per group
    const myCustomers = await API.graphql({
      query: customersByCustomerGroupID,
      variables: { customerGroupID: groupID, limit: 500 }
    });

    let custData = myCustomers.data.customersByCustomerGroupID.items;

    await Promise.all(custData.map(async (cObj) => {
      cObj.rawData = await getDataForCustomer(cObj.id); //add in raw data
    }));

    //add aggregations
    var customerAggregations = [];
    var sumCounts = {};

    custData.forEach(function(cObj) {

      sumCounts.serviceRevenue = 0;
      sumCounts.unitRevenue = 0;
      sumCounts.quantity = 0;
      sumCounts.costOfGoodsSold = 0;
      sumCounts.costOfServices = 0;
      sumCounts.salesVolume = 0;

      var newCust = {};
      newCust.id = cObj.id;
      newCust.name = cObj.name;

      //sum values
      cObj.rawData.forEach(function(tData) {
        sumCounts.serviceRevenue += tData.service_revenue;
        sumCounts.unitRevenue += tData.unit_revenue;
        sumCounts.quantity += tData.quantity;
        sumCounts.costOfGoodsSold += tData.cost_of_goods_sold;
        sumCounts.costOfServices += tData.cost_of_services;
        sumCounts.salesVolume += (tData.unit_revenue * tData.quantity) + tData.service_revenue;
      });

      //set calculations
      newCust.sales_volume = sumCounts.salesVolume;
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

    //console.log(custData);
    //console.log(customerAggregations);

    //const samerows = customerAggregations.filter((agg) => agg.sales_volume === 16590);
    //console.log(samerows);

    var pData = [];

    customerAggregations.map((aggObj) => {
      pData.push({"name" : aggObj.name, "x" : aggObj.sales_volume, "y" : aggObj.overall_margin});
    })

    //setPlotData(pData);
    
    /*
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
  /*const data = [
    {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
    {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
    {'company': 'Skype' , 'size': 700, 'revenue': 716},
    {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
    {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
    {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
  ];*/
  
  // Create the data 2D-array (vectors) describing the data
  let vectors = new Array();
  for (let i = 0 ; i < customerAggregations.length ; i++) {
    vectors[i] = [ customerAggregations[i]['sales_volume'] , customerAggregations[i]['overall_margin'], customerAggregations[i]];
  }

  let clusterResult = kmeans(vectors, 4);
  let clusterSeries = [];
  let cNum = 1;

  clusterResult.clusters.map((cluster) => {
    //build points data
    let pointsData = [];

    var clusterTotals = {};
    clusterTotals.totalMargin = 0;
    clusterTotals.salesVolume = 0;
    clusterTotals.upliftPotential = 0;

    cluster.points.map((pointObj) => {
      clusterTotals.totalMargin += pointObj[1]; 
      clusterTotals.salesVolume += pointObj[0]; 
    })

    clusterTotals.expectedMargin = parseFloat((clusterTotals.totalMargin / cluster.points.length).toFixed(2));
    clusterTotals.actualMargin = parseFloat((clusterTotals.totalMargin - clusterTotals.expectedMargin).toFixed(2));
    //clusterTotals.upliftPotential = parseFloat(((clusterTotals.expectedMargin - clusterTotals.actualMargin) * clusterTotals.salesVolume).toFixed(2));

    cluster.points.map((pointObj) => {
      var rData = pointObj[2];
      rData.upliftPotential = parseFloat((((clusterTotals.expectedMargin - pointObj[1]) / 100) * pointObj[0]).toFixed(2));
      if (rData.upliftPotential <= 0) {
        rData.upliftPotential = "N/A";
      } else {
        clusterTotals.upliftPotential +=  rData.upliftPotential;
      }
        
      pointsData.push({"x" : pointObj[0], "y" : pointObj[1], "rawdata" : rData});
    })


    //set cluster
    clusterSeries.push({
      type: 'scatter',
      name: 'Customer Cluster ' + cNum,
      color: cPallete[cNum - 1],
      data: pointsData,
      clusterData: clusterTotals
    });

    //add regression
    let tempX = [],
    tempY = [];

    pointsData.forEach((elm) => {

      tempX.push(elm.x);
      tempY.push(elm.y);

    });

    let { line, r } = regression(tempY, tempX);

    clusterSeries.push({
      type: 'line',
      name: 'Linear regression ' + cNum,
      color: lineColor,
      r: r,
      data: line,
      visible: false
    });

    cNum++;
  })


  setSeriesData(clusterSeries);

  handleMode("cluster");

  chartComponentRef.current.chart.series.forEach(function(tSeries) {
    if (tSeries.type === 'line') {
      tSeries.hide();
    }
  });

}

  function isolateSeries(sNum, uLimit) {

    var isoData = [];

    if (sNum !== null) {

      setSelectedCluster(sNum);

      var sCluster = seriesData.filter(function(v){
        return v.name.endsWith(sNum) && v.type === 'scatter';
      })[0];

      sCluster.color = cPallete[sNum - 1];

      seriesData.forEach(function(v){
        if (v.type === 'scatter'){
          if (!v.name.endsWith(sNum))
            v.color = "#bbbbbb";
        }
      });
  
      sCluster.data.forEach(function(dObj) {
        var cData = {};
        cData.customer_name = dObj.rawdata.name;
        cData.expected_margin = sCluster.clusterData.expectedMargin;
        cData.actual_margin = dObj.rawdata.overall_margin;

        //calculate Margin Change
        var mChange = parseFloat((cData.expected_margin - cData.actual_margin).toFixed(2));
        if (mChange < 0)
          mChange = 0;

        var uPotent = dObj.rawdata.upliftPotential;

        if (uLimit > 0) { //recalculate uplift potential based on limit
          if (mChange > uLimit) {
            mChange = uLimit;
            uPotent = parseFloat((mChange / 100).toFixed(2)) * dObj.rawdata.sales_volume;
          }
        }  

        cData.margin_change = mChange;
        cData.uplift_potential = uPotent;
        isoData.push(cData);
      });

    } else { //clear all highcharts point selections

      setSelectedCluster(0);

      var points = chartComponentRef.current.chart.getSelectedPoints();
      points.forEach(function (p){
        p.select(false);
      });

      seriesData.forEach(function(v){
        if (v.type === 'scatter'){
          v.color = cPallete[parseInt((v.name.slice(-1))) - 1];
        }
      });
    }

    setIsolatedData(isoData);

    var newSeries = [];

    seriesData.forEach(function(sData) {

      if (sNum == null && sData.type === 'scatter') {
        sData.visible = true;
      } else {
        
        if (sData.name.endsWith(sNum)) {
          sData.visible = true;
        } else {
          sData.visible = false;
        }

      }

      newSeries.push(sData);

    });

    setSeriesData(newSeries);


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

  const onCustomerSelectionChanged = useCallback((params) => {
    const selectedRows = custGridRef.current.api.getSelectedRows();
    var tName = selectedRows[0].customer_name;

    var sIndex = 0;
    var dIndex = 0;

    chartComponentRef.current.chart.series.forEach(function(tSeries) {

      if (tSeries.visible && tSeries.name.indexOf("Cluster") > -1) {

        sIndex = tSeries.index;
        tSeries.data.forEach(function(dObj) {
          if (dObj.rawdata.name === tName)
            dIndex = dObj.index;
        });

        chartComponentRef.current.chart.series[sIndex].data[dIndex].select(true, false);
        chartComponentRef.current.chart.tooltip.refresh(chartComponentRef.current.chart.series[sIndex].data[dIndex]);

      }

    });

  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  const onFirstCustDataRendered = useCallback((params) => {
    custGridRef.current.api.sizeColumnsToFit();
  }, []);

  const handleMode = (tMode) =>{
    if (tMode === "groups") {
      //get customer groups
      getCustomerGroups();
    }
    setAppMode(tMode);
  }

  function dateFormatter(params) {
    var dVal = "";
    if (params.data) {

      var dDate = params.data.transaction_date.getUTCDate();
      var dMonth = params.data.transaction_date.getMonth() + 1;
      // concatenate new values into one string
      dVal = dMonth + "/" + dDate + "/" + params.data.transaction_date.getFullYear();

    }
    return dVal;
  }

  const setLoading = (loadVal) => {
    setDataLoading(loadVal);
  };

  const setFieldInfo = (fieldInput) => {
    setFieldInformation(fieldInput);
  };

  const handleData = (xData) =>{

    setColumnDefs([
      {field: 'customer_name', headerName: 'Customer Name', filter: true, rowGroup: true, sort: 'asc', floatingFilter: true, hide: true, resizable: true},
      {field: 'product_name', headerName: 'Product Name', filter: true, floatingFilter: true, resizable: true},
      {field: 'transaction_date', headerName: 'Transaction Date', filter: 'agDateColumnFilter', filterParams: filterParams, floatingFilter: true, resizable: true, valueFormatter: dateFormatter},
      {field: 'distribution_type', headerName: 'Distribution Type', filter: true, floatingFilter: true, resizable: true},
      {field: 'cost_of_goods_sold', headerName: 'Cost of Goods Sold', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true, resizable: true},
      {field: 'unit_revenue', headerName: 'Unit Revenue', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true, resizable: true},
      {field: 'quantity', headerName: 'Quantity', filter: 'agNumberColumnFilter', aggFunc: 'sum', floatingFilter: true, resizable: true},
      {field: 'services_purchased', headerName: 'Services Purchased', filter: true, floatingFilter: true, resizable: true},
      {field: 'service_revenue', headerName: 'Service Revenue', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true, resizable: true},
      {field: 'cost_of_services', headerName: 'Cost of Services', filter: 'agNumberColumnFilter', valueFormatter: currencyFormatter, aggFunc: 'sum', cellStyle: currencyCssFunc, floatingFilter: true, resizable: true},
      {field: 'service_type', headerName: 'Service Type', filter: true, floatingFilter: true, resizable: true}
    ]);

    const searchRegExp = /\s/g;
    const replaceWith = '_';

    for (let i = 0; i < xData.length; i++) {
      const item = xData[i];
      const rowObj = {};
      Object.keys(item).map(function(key) {
        
        var newKey = key.toLowerCase().trim().replace(" ($)", "").replace(searchRegExp, replaceWith);
        var rawData = item[key];
        var newData = rawData;

        if (newKey.indexOf("cost") > -1 || newKey.indexOf("revenue") > -1) { //currency conversion
          newData = currency(rawData).value;
        }

        if (newKey.indexOf("quantity") > -1) { //numerical conversion
          newData = parseInt(rawData);
        }

        if (newKey == 'transaction_date'){ //trans date conversion
          if (rawData.toString().indexOf("/") == -1) {
            var modDate = new Date(Date.UTC(0, 0, rawData - 1));
            newData = modDate;
          } else {
            newData = new Date(rawData);
          }
        }

        rowObj[newKey] = newData;
      });
      rowData.push(rowObj);
    }

    setRowData(rowData);

}

  useEffect(() => {
    const chart = chartComponentRef.current.chart;
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
  }
  
  <Button onClick={() => isolateSeries(series.name)} className="btn-danger deleteBtn" size="sm">Isolate</Button>
  
  */

  return (
    <View className="App">
      <Toaster show={showToast} message={toastMessage} variant={toastVariant} hideToast={hideToast}/>
      <ParsaNav username={user.username} handleSignOut={signOut} modeChange={handleMode} />
      <Container className={appMode === 'cluster' ? '' : 'd-none'}>
        <Row>
          <Col sm={9}><HighchartsReact ref={chartComponentRef} highcharts={Highcharts} options={options} oneToOne={true}/></Col>
          <Col sm={3}>
            <ListGroup>
            <ListGroup.Item className="justify-content-between align-items-center" >

            <Button onClick={() => isolateSeries(null, upliftLimit)} className="btn-info deleteBtn" size="sm">Show All Clusters</Button>
            <Button onClick={() => openUpliftModal(true)} className="btn-default deleteBtn" size="sm">Limit Uplift</Button>
            </ListGroup.Item>
              {seriesData.map(series => {

                if (series.type === "scatter") {
                  const listColor = {
                    backgroundColor: series.color
                  }
                  const expectedMargin = currency(series.clusterData.expectedMargin, { separator: ',', symbol: '' }).format();
                  const upliftPotential = currency(series.clusterData.upliftPotential, { separator: ',', symbol: '' }).format();
                  return(
                    <ListGroup.Item key={series.name} className="d-flex justify-content-between align-items-center" style={listColor}>

                    <div className="ms-2 me-auto chartControls">
                      <div className="fw-bold">{series.name}</div>
                      <div>Expected Margin: {expectedMargin}%</div>
                      <div>Uplift Potential: ${upliftPotential}</div>
                    </div>
                    <Button onClick={() => isolateSeries(series.name.charAt(series.name.length-1), upliftLimit)} className="btn-danger deleteBtn" size="sm">Isolate</Button>
                    </ListGroup.Item>
                  )
                }
              })}
              
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>{ isolatedData.length > 0 ? <div className="ag-theme-alpine" style={{width: "100%", height: 300}}>
        <AgGridReact
            ref={custGridRef} // Ref for accessing Grid's API
            rowData={isolatedData} // Row Data for Rows
            onFirstDataRendered={onFirstCustDataRendered}
            columnDefs={custColDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='single'
            onSelectionChanged={onCustomerSelectionChanged}
            />
      </div> : null }</Col>
        </Row>
      </Container>
      <Container className={appMode === 'groups' ? '' : 'd-none'}>
        <Row style={{marginTop: "10px"}}>
          <Col><CustomerGroupList data={groupData} handleCluster={doCluster} handleDelete={doGroupDelete}/></Col>
        </Row>
      </Container>
       <Container className={appMode === 'dataload' ? '' : 'd-none'}>
       <div>
          <h1 className="signikaText topIntro">Welcome to Parsa</h1>
          <h6 className="signikaText text-muted pb-3">Import customer data and visualize meaningful patterns.</h6>

          <div className={rowData.length == 0 ? 'signikaText' : 'd-none'}>Please begin by loading your spreadsheet data file below... (csv, xls, xlsx)
            <Alert variant='warning' style={{marginTop: "10px"}}>
              *Your data file MUST contain column headers to parse properly*
            </Alert>
            <Row style={{marginTop: "10px"}}>
              <Col><ExcelReader excelData={handleData} loading={setLoading} fieldInfo={setFieldInfo} /></Col>
            </Row>
          </div>
          
          <div className={dataLoading ? 'img-fluid' : 'd-none'}>
            <Row style={{textAlign: "center"}}>
              <Col>Loading and Analyzing Data</Col>
            </Row>
            <Row>
              <Col><Image src="/132349-business-woman.gif" alt="" /></Col>
            </Row>
          </div>
          
          <Image src="/Group171.svg" alt="" className={rowData.length == 0 && !dataLoading ? 'img-fluid parseIntro' : 'd-none'} />
      </div>

      <div className={rowData.length > 0 ? '' : 'd-none'}>
        <Row style={{marginTop: "10px"}}>
          <Col><IngestProcess fieldInfo={fieldInformation} /></Col>
        </Row>
      </div>
        
        <Row>
          <Col>
          { rowData.length === 255 ? <div className="ag-theme-alpine" style={{width: "100%", height: 500}}>
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
      <LimitUpliftModal
            isOpen={upliftModalOpen} 
            handleSubmit={saveUpliftData}
            closeModal={closeUpliftModal}
          /> 
    </View>
  );
};

export default withAuthenticator(App);