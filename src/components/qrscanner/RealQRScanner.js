import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import QrReader from 'react-qr-reader';

const styles = theme => ({
    root: {
        marginTop: '20'
    },
    button: {
      margin: theme.spacing.unit *2
    }
});

class RealQRScanner extends Component {
    constructor(props){
        super(props)
        this.state = {
            result: 'No result',
            legacy: false
        }

        //const old = window.navigator.mediaDevices.getUserMedia;
        //window.navigator.mediaDevices.getUserMedia = (constraints) => old({video: {aspectRatio: 1, facingMode: {ideal: 'environment'}}});

        this.uuidValidator = new RegExp('^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$');
    }

    handleScan = (data) => {
        if(this.uuidValidator.test(data)){
            this.props.onScannedId(data);
        }
    }

    handleError = (err) => {
        console.error(err);
        if(this.state.legacy){
            this.props.onScannedId(undefined);
        }else{
            this.setState({
                legacy: true
            });
        }
    }

    handleFotoClick = () => {
        this.refs.qrReader.openImageDialog();
    }

    render(){
        const { classes } = this.props;

        let legacyNotice = '';
        let legacyButton = '';
        if(this.state.legacy){
            legacyNotice = <Typography variant='body2' align='center'>Direkter Zugriff auf die Kamera deines Geräts ist nicht möglich. Du kannst jedoch ein Foto aus einer anderen Quelle (Galerie, Kamera-App) laden und analysieren lassen.</Typography>
            legacyButton = <Button variant='contained' color='primary' className={classes.button} onClick={this.handleFotoClick}>Foto auswählen</Button>
        }
        return(
            <div className={classes.root} align='center'>
                {legacyNotice}
                {legacyButton}
                <QrReader
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                    legacyMode={this.state.legacy}
                    showViewFinder={false}
                    ref='qrReader'
                />
            </div>
        )
    }
}

export default withStyles(styles)(RealQRScanner);