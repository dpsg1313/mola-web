import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
 
export default class QRScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
    }

    this.uuidValidator = new RegExp('^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$');
  }

  handleScan = (data) => {
    if(this.uuidValidator.test(data)){
      this.props.onScannedId(data);
    }
  }

  handleError = (err) => {
    console.error(err);
    alert('Kamera Zugriff ist nicht unterstützt. Bitte versuche es mit einem anderen Browser!');
    this.props.onScannedId(undefined);
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