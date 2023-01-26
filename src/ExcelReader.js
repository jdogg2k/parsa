import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import { groupBy as rowGrouper } from 'lodash';
// eslint-disable-next-line
import CanvasDatagrid from 'canvas-datagrid';
import 'react-data-grid/lib/styles.css';
import DataGrid, { SelectColumn, Row } from 'react-data-grid';
 
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
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);

      this.props.excelData(data);
      
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
        <label htmlFor="file">Upload an excel file to ingest your dataset</label>
        <br />
        <a href="./Sample-Sales.xlsx">Download Sample XLSX File</a>
        <br />
        <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />&nbsp;
        <input type='submit' 
          value="Load Data"
          onClick={this.handleFile} />
      </div>
      
    )
  }
}
 
export default ExcelReader;