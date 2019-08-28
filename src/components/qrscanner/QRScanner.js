import React, { Component } from 'react';

import RealQRScanner from './RealQRScanner';
import FakeQRScanner from './FakeQRScanner';
import Config from '../../Config';
 
export default class QRScanner extends Component {


    render(){
        if(Config.fakeQRScanner){
            return(
                <FakeQRScanner onScannedId={this.props.onScannedId} />
            )
        }else{
            return(
                <RealQRScanner onScannedId={this.props.onScannedId} />
            )
        }
    }
}