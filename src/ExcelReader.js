import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { SheetJSFT } from './types';
import Fuse from 'fuse.js'
// eslint-disable-next-line
import 'react-data-grid/lib/styles.css';
import { Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { countryDialCodes } from '@aws-amplify/ui';
 
class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      columns: [],
      rows: [],
      groupBy: "customer name",

    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };
 
  handleFile() {
    this.props.loading(true);
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
 
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      let tFields = [];

      /* get header names */
      const columnsArray = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);

      //determine field types 
      columnsArray.forEach(function(col) {
        var x = data[0][col];
        var fType = "string";
        if (x.toFixed) {
          fType = "number";
          if (col.indexOf("date") > -1) {
            fType = "date";
          }
        }
        var fieldObj = {};
        fieldObj.name = col;
        fieldObj.type = fType;
        fieldObj.selected = false;
        tFields.push(fieldObj);        
      });

      var fieldInfo = {};
      fieldInfo.customerField = undefined;
      fieldInfo.quantityField = undefined;
      fieldInfo.revenueField = undefined;
      fieldInfo.strings = tFields.filter(function(f){
        return f.type === "string";
      });
      fieldInfo.numbers = tFields.filter(function(f){
        return f.type === "number";
      });
      fieldInfo.dates = tFields.filter(function(f){
        return f.type === "date";
      });
      fieldInfo.sampleStringData = [];
      for (let i = 0; i < fieldInfo.strings.length; i++) { //get sample data to show user
        fieldInfo.sampleStringData.push(data[i]);
      }
      fieldInfo.sampleNumData = [];
      for (let i = 0; i < fieldInfo.numbers.length; i++) { //get sample data to show user
        fieldInfo.sampleNumData.push(data[i]);
      }

      //fuzzy match for customer name
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        keys: ['name']
      }
      
      const fuseCustomer = new Fuse(fieldInfo.strings, options);
      const custResult = fuseCustomer.search('customer');
      if (custResult.length > 0)
        fieldInfo.customerField = custResult[0].item.name;

      const fuseQuantity = new Fuse(fieldInfo.numbers, options);
      const quantResult = fuseQuantity.search('quantity|amount');
      if (quantResult.length > 0)
        fieldInfo.quantityField = quantResult[0].item.name;

      const fuseRevenue = new Fuse(fieldInfo.numbers, options);
      const revResult = fuseRevenue.search('revenue|price|sales');
      if (revResult.length > 0)
        fieldInfo.revenueField = revResult[0].item.name;

      this.props.fieldInfo(fieldInfo);
      this.props.excelData(data);
      this.props.loading(false);
      /*const colData = [SelectColumn];
      const rowData = [];

      Object.keys(data[0]).map(function(key) {
          if (key.indexOf('EMPTY') == -1){
            colData.push({ key: key.toLowerCase(), name: key });
          }
      });

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const rowObj = {};
        Object.keys(item).map(function(key) {
          if (key.indexOf('EMPTY') == -1){
            rowObj[key.toLowerCase()] = item[key];
          }
        });
        rowData.push(rowObj);
      }

      /* Update state */
      /*this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
        console.log(JSON.stringify(this.state.data, null, 2));
      });*/
 
    };
 
    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }
 
  render() {
    return (
      <div>
         <Container>
          <Row>
            <Col>
            <InputGroup className="mb-3">
            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} title="Upload an excel file to ingest your dataset" />
            <Button variant="info" onClick={this.handleFile}>Load Data</Button>
            </InputGroup>
            </Col>
          </Row>
        </Container>        
      </div>
      
    )
  }
}
 
export default ExcelReader;