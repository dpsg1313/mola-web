import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import QRScanner from '../components/QRScanner';
import FakeQRScanner from '../components/FakeQRScanner';
import * as AuthStore from '../stores/AuthStore';
import Page from '../Page';

const margin = {
    margin: 12
};

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            isLoggedIn: false
        };
    }

    componentWillMount() {
        console.log('willmount');
        this.setState({
            isLoggedIn: !!AuthStore.getAuthToken()
        });
    }

    logout = () => {
        AuthStore.resetAuthData();
        this.setState({
            isLoggedIn: false
        })
    }

    handleScannedId = (id) => {
        this.setState({isScanning: false});
        if(id){
            this.props.history.push('profile/' + id);
        }
    }

    render() {
        if(this.state.isScanning){
            return (
                <Page title='MOLA'>
                    <FakeQRScanner onScannedId={this.handleScannedId}/> : }
                </Page>
            )
        }else if(this.state.isLoggedIn){
            return (
                <Page title='MOLA'>
                    <div><RaisedButton style={margin} label='Mein Profil bearbeiten' onClick={() => this.props.history.push('/edit')} /></div>
                    <div><RaisedButton style={margin} label='Code scannen' onClick={() => this.setState({isScanning: true})} /></div>
                    <RaisedButton style={margin} label='Logout' onClick={this.logout} />
                </Page>
            )
        }else{
            return (
                <Page title='MOLA'>
                    <RaisedButton style={margin} label='Login' onClick={() => this.props.history.replace('/login')} />
                </Page>
            )
        }
    }
}

export default withRouter(MainPage);