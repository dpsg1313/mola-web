import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { withRouter } from 'react-router';

import QRScanner from '../components/QRScanner';
import FakeQRScanner from '../components/FakeQRScanner';
import Page from '../Page';
import * as AuthStore from '../stores/AuthStore';

class RegistrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            userId: '',
            password: '',
            passwordConfirm: ''
        };
    }

    handleScannedId = (id) => {
        this.setState({
            isScanning: false,
            userId: id
        });
    }

    onRegisterButton = () => {
        if(!this.state.userId){
            this.setState({
                errorUserId: 'Bitte scanne deinen Aufnäher!'
            })
        }
        
        if(!this.state.password || this.state.password.length < 4){
            this.setState({
                errorPassword: 'Das Passwort muss mindestens 4 Zeichen haben!'
            })
        }else if(this.state.password === this.state.passwordConfirm){
            this.setState({
                errorPassword: 'Die beiden Passwörter stimmen nicht überein!'
            })
        }
            
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
                    <RaisedButton label='Aufnäher Scannen' onClick={() => this.setState({isScanning: true})} />
                    <div>Passwort: <TextField name='password' type='password' onChange={(ev) => this.setState({password: ev.target.value})} errorText={this.state.errorPassword} /></div>
                    <div>Passwort bestätigen: <TextField name='passwordConfirm' type='password' onChange={(ev) => this.setState({passwordConfirm: ev.target.value})} /></div>
                    <div><RaisedButton label='Account erstellen' onClick={this.onRegisterButton} /></div>
                </Page>
            )
        }
    }
}

export default withRouter(RegistrationPage);