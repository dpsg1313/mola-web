import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { withRouter } from 'react-router';

import QRScanner from '../components/QRScanner';
import FakeQRScanner from '../components/FakeQRScanner';
import Page from '../Page';
import * as AuthStore from '../stores/AuthStore'

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            userId: '',
            password: ''
        };
    }

    handleScannedId = (id) => {
        this.setState({
            isScanning: false,
            userId: id
        });
    }

    onLoginButton = () => {
        fetch(
            //'https://mola-api.dpsg1313.de/v1/profile/' + this.props.match.params.profileId, 
            'http://localhost:8888/v1/login', 
            { 
                method: 'POST',
                headers: new Headers({ 
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    id: this.state.userId,
                    password: this.state.password,
                    email: ''
                })
            }
        ).then(result => {
            return result.json()
        }).then(token =>{
            console.log(token);
            AuthStore.setAuthData(this.state.userId, token);
            this.props.history.replace('/');
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        if(this.state.isScanning){
            return (
                <Page title='MOLA'>
                    <FakeQRScanner onScannedId={this.handleScannedId}/> : }
                </Page>
            )
        }else{
            return (
                <Page title='MOLA'>
                    {this.state.userId}
                    <div><RaisedButton label='Aufnäher Scannen' onClick={() => this.setState({isScanning: true})} /></div>
                    <div>Passwort: <TextField name='password' type='password' onChange={(ev) => this.setState({password: ev.target.value})} /></div>
                    <div><RaisedButton label='Login' onClick={this.onLoginButton} /></div>
                    <div><RaisedButton label='Account erstellen' onClick={() => this.props.history.push('/register')} /></div>
                </Page>
            )
        }
    }
}

export default withRouter(LoginPage);