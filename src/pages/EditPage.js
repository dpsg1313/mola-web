import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import AvatarEditor from 'react-avatar-editor'

import Config from '../Config';
import Page from '../Page';
import EditFunction from '../components/edit/EditFunction';
import EditStructure from '../components/edit/EditStructure';
import AuthStore from '../stores/AuthStore';
import * as ProfileStore from '../stores/ProfileStore';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 200,
    },
    input: {
        margin: theme.spacing.unit,
        minWidth: 200
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: '75%',
        height: '120%',
        margin: 'auto',
    },
});

const requiredFields = [
    'firstname',
    'lastname',
    'tribeId',
    'functionId',
    'woodbadgeCount',
]

class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: undefined,
            message: false,
            newImage: false,
            loading: true
        };
    }

    componentWillMount() {
        ProfileStore.get(AuthStore.getUserId())
        .then(profile => {
            this.setState(profile);
            this.setState({
                loading: false
            });
        }).catch((error) => {
            console.error(error);
        })
    }

    resizeImage = (originalCanvas) => {
        var MAX_WIDTH = 500;
        var MAX_HEIGHT = 500;
        var width = originalCanvas.width;
        var height = originalCanvas.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(originalCanvas, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 1.0);
    }

    uploadImage = () => {
        console.log('upload Image');
        if(this.state.newImage === false){
            console.log('no new image');
            return Promise.resolve(false);
        }

        if(!this.refs.editor) {
            console.log('editor not found');
            return Promise.resolve(false);
        }

        const canvas = this.refs.editor.getImage();
        var dataURL = this.resizeImage(canvas);
        var blob = this.dataURItoBlob(dataURL);

        var formData = new FormData();
        console.log(this.state.newImage);
        formData.append('image', blob);

        return fetch(Config.baseUrl + 'image', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Accept': 'application/json'
                },
                body: formData
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('API response status code was: ' + response.status);
        }).then((json) => {
            this.setState({
                imageId: json.imageId,
                newImage: false,
                imagePreviewUrl: false
            });
            console.log(this.state.imageId);
            return true;
        })
    }

    dataURItoBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    saveProfile = (imageChanged) => {
        var content = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            tribeId: this.state.tribeId,
            regionId: this.state.regionId,
            dioceseId: this.state.dioceseId,
            functionId: this.state.functionId,
            association: this.state.association,
            phone: this.state.phone,
            email: this.state.email,
            residence: this.state.residence,
            favouriteStage: this.state.favouriteStage,
            woodbadgeCount: this.state.woodbadgeCount,
            georgesPoints: this.state.georgesPoints,
            imageId: this.state.imageId,
            relationshipStatus: this.state.relationshipStatus
        }

        fetch(
            Config.baseUrl + 'profile', 
            { 
                headers: new Headers({ 
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Content-Type': 'application/json'
                }),
                method: 'PUT',
                body: JSON.stringify(content)
            }
        ).then(response => {
            if(response.ok) {
                this.setState({
                    loading: false,
                    message: 'Gespeichert'
                });
                ProfileStore.set(AuthStore.getUserId(), content);
                return true;
            }
            throw new Error('API response status code was: ' + response.status);
        })
    }

    checkRequiredFields = () => {
        return requiredFields.every((field) => {
            let value = this.state[field];
            if(!value && value !== 0){
                this.setState({
                    [field + 'Error']: 'Bitte ausfüllen!'
                });
                return false;
            }
            this.setState({
                [field + 'Error']: false
            });
            return true;
        });
    }

    handleSave = (event) => {
        console.log('SaveClicked');

        if(!this.checkRequiredFields()){
            this.setState({
                message: 'Bitte alle Pflichtfelder * ausfüllen!'
            });
            return;
        }

        this.setState({
            loading: true
        });

        this.uploadImage()
        .then(this.saveProfile)
        .catch((error) => {
            console.error(error);
            this.setState({
                loading: false,
                message: 'Speichern fehlgeschlagen'
            });
        });

        window.scrollTo(0, 0);
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };

    handleClose = (event, reason) => {
        this.setState({ message: false });
    };

    changeImage = (event) => {
        console.log("AvatarClicked");
        this.fileInput.click();
    }

    removeImage = (event) => {
        this.setState({
            imageId: '',
            imagePreviewUrl: '',
            newImage: false
        })
    }

    handleImage = (event, reason) => {
        console.log('ImageSelected');
        this.setState({
            loading: true
        });

        let reader = new FileReader();
        let file = event.target.files[0];
        if(!file){
            return;
        }

        reader.onloadend = () => {
            this.setState({
                loading: false,
                newImage: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file);
    };

    render() {
        const { classes } = this.props;

        if(this.state.firstname === undefined){
            return (
                <Page title='Mein Profil bearbeiten' loading={true} />
            )
        }else{
            const profile = this.state;
            console.log(profile);
            let imageSrc = '';
            let avatar = '';
            if(this.state.imagePreviewUrl){
                imageSrc = this.state.imagePreviewUrl;
                avatar = <AvatarEditor
                    ref='editor'
                    image={imageSrc}
                    border={10}
                    borderRadius={125}
                    color={[0, 0, 0, 0.5]} // RGBA
                    scale={1.2}
                    rotate={0}
                />
            }else{
                imageSrc = 'https://s3.eu-central-1.amazonaws.com/' + Config.s3Bucket + '/' + (profile.imageId ? profile.imageId + '.jpg' : 'noImagePlaceholder.png');
                avatar = <Avatar className={classNames(classes.avatar, classes.bigAvatar)} src={imageSrc}></Avatar>
            }
            return (
                <Page title='Mein Profil bearbeiten' loading={this.state.loading}>
                    <div align='center'>
                        <IconButton variant="contained" onClick={this.changeImage}><EditIcon color='primary' /></IconButton>
                        <IconButton variant="contained" onClick={this.removeImage}><DeleteIcon color='secondary' /></IconButton>
                    </div>
                    <div align='center'>
                        <input type='file' style={{display: 'none'}} onChange={this.handleImage} ref={(fileInput) => {this.fileInput = fileInput}}/>
                        {avatar}
                    </div>

                    <Paper className={classes.paper} elevation={1}>
                        <div><TextField className={classes.input} value={profile.firstname} label='Vorname *' onChange={this.handleChange('firstname')} error={!!this.state.firstnameError} helperText={this.state.firstnameError} /></div>
                        <div><TextField className={classes.input} value={profile.lastname} label='Nachname *' onChange={this.handleChange('lastname')}  error={!!this.state.lastnameError} helperText={this.state.lastnameError}/></div>
                    </Paper>
                    <Paper className={classes.paper} elevation={1}>
                        <EditStructure dioceseId={profile.dioceseId} regionId={profile.regionId} tribeId={profile.tribeId} onChange={(state) => this.setState(state)} error={this.state.tribeIdError} />
                        <div><TextField className={classes.input} value={profile.residence} label='Wohnort' onChange={this.handleChange('residence')} /></div>
                    </Paper>
                    <Paper className={classes.paper} elevation={1}>
                        <EditFunction functionId={profile.functionId} onChange={(state) => this.setState(state)} error={this.state.functionIdError} />
                    </Paper>
                    <Paper className={classes.paper} elevation={1}>
                        <div>
                            <FormControl className={classes.formControl} error={!!this.state.woodbadgeCountError}>
                                <InputLabel htmlFor="woodbadgeCount">Woodbadge Klötzchen *</InputLabel>
                                <Select
                                    value={profile.woodbadgeCount}
                                    onChange={this.handleChange('woodbadgeCount')}
                                    inputProps={{
                                        id: 'woodbadgeCount'
                                    }}>
                                    <MenuItem value={0}>keine</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={5}>6</MenuItem>
                                </Select>
                                {this.state.firstnameError && <FormHelperText id="name-error-text">{this.state.firstnameError}</FormHelperText>}
                            </FormControl>
                        </div>
                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="favouriteStage">Lieblingsstufe</InputLabel>
                                <Select
                                    value={profile.favouriteStage}
                                    onChange={this.handleChange('favouriteStage')}
                                    inputProps={{
                                        id: 'favouriteStage'
                                    }}>
                                    <MenuItem value={null}></MenuItem>
                                    <MenuItem value='Wölflinge'>Wölflinge</MenuItem>
                                    <MenuItem value='Jupfis'>Jupfis</MenuItem>
                                    <MenuItem value='Pfadis'>Pfadis</MenuItem>
                                    <MenuItem value='Rover'>Rover</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="relationshipStatus">Beziehungsstatus</InputLabel>
                                <Select
                                    value={profile.relationshipStatus}
                                    onChange={this.handleChange('relationshipStatus')}
                                    inputProps={{
                                        id: 'relationshipStatus'
                                    }}>
                                    <MenuItem value={null}></MenuItem>
                                    <MenuItem value='single'>single</MenuItem>
                                    <MenuItem value='in einer festen Beziehung'>in einer festen Beziehung</MenuItem>
                                    <MenuItem value='in einer offenen Beziehung'>in einer offenen Beziehung</MenuItem>
                                    <MenuItem value='verlobt'>verlobt</MenuItem>
                                    <MenuItem value='verheiratet'>verheiratet</MenuItem>
                                    <MenuItem value='kompliziert'>kompliziert</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                    <Paper className={classes.paper} elevation={1}>
                        <div><TextField className={classes.input} value={profile.email} label='E-Mail' onChange={this.handleChange('email')} /></div>
                        <div><TextField className={classes.input} value={profile.phone} label='Telefon' onChange={this.handleChange('phone')} /></div>
                    </Paper>
                    <div align='center'><Button className={classes.button} variant='contained' color='primary' onClick={this.handleSave}>Speichern</Button></div>
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
                </Page>
            );
        }
    }
}
  
export default withStyles(styles)(EditPage);