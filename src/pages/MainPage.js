import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';

import moment from 'moment';

import QRScanner from '../components/qrscanner/QRScanner';
import AuthStore from '../stores/AuthStore';
import * as HistoryStore from '../stores/HistoryStore';
import Page from '../Page';
import History from '../components/History';
import ActionMenu from '../components/ActionMenu';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            isLoggedIn: false,
            loading: true
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
            if(id !== AuthStore.getUserId()){
                HistoryStore.set(id, moment());
            }
            this.props.history.push('profile/' + id);
        }
    }

    handleScannerClosed = () => {
        this.setState({ isScanning: false });
    }

    onProfileClick = (profileId) => {
        console.log('Profile Click');

        this.props.history.push('profile/' + profileId);
    }

    onHistoryLoaded = () => {
        this.setState({
            loading: false,
        });
    }

    render() {
        const { classes } = this.props;
        if(this.state.isLoggedIn){
            return (
                <Page title='MOLA' toolbar={<ActionMenu onLogout={this.logout} />} loading={this.state.loading}>
                    <History onProfileClick={this.onProfileClick} onLoaded={this.onHistoryLoaded} />
                    <Dialog
                        fullScreen
                        open={this.state.isScanning}
                        onClose={this.handleScannerClosed}
                    >
                        <QRScanner onScannedId={this.handleScannedId}/>
                        <Button
                            onClick={() => this.setState({isScanning: false})}
                            className={classes.button}
                        >
                            Abbrechen
                        </Button>
                    </Dialog>
                    <Button color='primary' variant="extendedFab" aria-label="Scannen" className={classes.fab} onClick={() => this.setState({isScanning: true})}>
                        <AddIcon className={classes.extendedIcon} />
                        Code scannen
                    </Button>
                </Page>
            )
        }else{
            return (
                <Page title='MOLA' loading={false}>
                    <div align='center'>
                        <Typography variant="headline" align="center">Willkommen bei MOLA!</Typography>
                        <Typography variant="body2" align="center">Wenn du schon einen Account hast,<br/>dann logge dich bitte ein:</Typography>
                        <Button variant="contained" className={classes.button} onClick={() => this.props.history.push('/login')}>Einloggen</Button>
                        <Typography variant="body2" align="center">Wenn nicht,<br/>kannst du dir in nur 3 Schritten einen Account erstellen:</Typography>
                        <Button variant="contained" className={classes.button} onClick={() => this.props.history.push('/register')}>Account erstellen</Button>
                    </div>
                </Page>
            )
        }
    }
}

export default withStyles(styles)(withRouter(MainPage));