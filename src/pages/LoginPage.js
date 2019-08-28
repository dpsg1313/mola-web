import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';


import Config from '../Config';
import QRScanner from '../components/qrscanner/QRScanner';
import Page from '../Page';
import AuthStore from '../stores/AuthStore';

const styles = theme => ({
    root: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
      padding: theme.spacing.unit * 3,
    },
});

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScanning: false,
            userId: '',
            password: '',
            loading: false,
        };
    }

    handleScannedId = (id) => {
        this.setState({
            isScanning: false,
            userId: id,
            activeStep: 1
        });
    }

    login = () => {
        this.setState({
            loading: true
        });
        return fetch(
            Config.baseUrl + 'login', 
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
        )
        .then(response => {
            if(response.ok) {
                return response.json();
            }else{
                if(response.status === 403){
                    this.setState({
                        message: 'Falsches Passwort oder nicht registrierter Aufnäher!'
                    });
                }else{
                    this.setState({
                        message: 'Login fehlgeschlagen!'
                    });
                }
                this.setState({
                    activeStep: 1,
                    loading: false,
                });
                throw new Error('API response status code was: ' + response.status);
            }
        })
        .then(token =>{
            console.log(token);
            AuthStore.setAuthData(this.state.userId, token);
            this.setState({
                message: 'Login erfolgreich',
                loading: false,
            });
            this.props.history.replace('/');
        })
        .catch((error) => {
            this.setState({
                loading: false,
            });
            console.error(error);
        })
    }

    handleClose = (event, reason) => {
        this.setState({ message: false });
    };

    handleScannerClosed = () => {
        this.setState({ isScanning: false });
    }

    onPasswordChanged = (ev) => {
        this.setState({
            password: ev.target.value
        })
    }

    render() {
        const { classes } = this.props;
        return(
            <Page title='MOLA' loading={this.state.loading}>
                <div className={classes.root}>
                    <Stepper activeStep={this.state.activeStep} orientation="vertical">
                        <Step key='scanCode'>
                            <StepLabel>Scanne deinen Code</StepLabel>
                            <StepContent>
                            <Typography>Bitte scanne den Code auf deinem Aufnäher</Typography>
                            
                            <Dialog
                                fullScreen
                                open={this.state.isScanning}
                                onClose={this.handleScannerClosed}
                                //TransitionComponent={(props) => <Grow {...props} />}
                            >
                                <QRScanner onScannedId={this.handleScannedId}/>
                                <Button
                                    onClick={() => this.setState({isScanning: false})}
                                    className={classes.button}
                                >
                                    Abbrechen
                                </Button>
                            </Dialog>
                            <div className={classes.actionsContainer}>
                                <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.setState({isScanning: true})}
                                    className={classes.button}
                                >
                                    Jetzt scannen
                                </Button>
                                </div>
                            </div>
                            </StepContent>
                        </Step>
                        <Step key='enterPassword'>
                            <StepLabel>Gib dein Passwort ein</StepLabel>
                            <StepContent>
                            <div>
                                <TextField
                                    label="Passwort"
                                    className={classes.textField}
                                    type="password"
                                    onChange={this.onPasswordChanged}
                                    error={!!this.state.errorPassword}
                                    helperText={this.state.errorPassword}
                                />
                            </div>
                            <div className={classes.actionsContainer}>
                                <div>
                                <Button
                                    onClick={() => this.setState({activeStep: 0})}
                                    className={classes.button}
                                >
                                    Zurück
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.login}
                                    className={classes.button}
                                >
                                    Einloggen
                                </Button>
                                </div>
                            </div>
                            </StepContent>
                        </Step>
                    </Stepper>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={!!this.state.message}
                        autoHideDuration={2000}
                        onClose={this.handleClose}
                        message={this.state.message}
                    />
                </div>
            </Page>
        )
    }
}

export default withStyles(styles)(withRouter(LoginPage));