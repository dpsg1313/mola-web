import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
 
export default class QRScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
    }
  }

  handleScan = (data) => {

  }

  handleError = (err) => {
    console.error(err);
    setTimeout(() => this.props.onScannedId('00c2baef-13e4-42bd-93d9-0d4c669cfc0a'), 1000);
  }

  render(){
    return(
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          />
      </div>
    )
  }
}