import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Config from '../Config';
import Page from '../Page';
import AuthStore from '../stores/AuthStore';
import StructureStore from '../stores/StructureStore';
import FunctionStore from '../stores/FunctionStore';
import * as ProfileStore from '../stores/ProfileStore';
import * as AdventureStore from '../stores/AdventureStore';
import * as Points from '../utils/Points';

const styles = theme => ({
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: '75%',
        height: '120%',
        marginTop: '10',
        marginBottom: '10',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
});

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined
        };
    }

    componentDidMount() {
        ProfileStore.get(this.props.match.params.profileId)
        .then(data =>{
            console.log(data);
            if(data.firstname){ // when name is set, then everything is set
                this.setState({
                    profile: data
                });
            }
        })
        .catch((error) => {
            console.error(error);
        })
        
    }

    render() {
        const { classes } = this.props;
        const profile = this.state.profile;
        if(profile === undefined){
            return (
                <Page title={this.props.match.params.profileId} loading={true} />
            )
        }else{
            let imageSrc = '';
            if(this.state.imagePreviewUrl){
                imageSrc = this.state.imagePreviewUrl;
            }else{
                imageSrc = 'https://s3.eu-central-1.amazonaws.com/' + Config.s3Bucket + '/' + (profile.imageId ? profile.imageId + '.jpg' : 'noImagePlaceholder.png');
            }
            return (
                <Page title={profile.firstname} loading={false}>
                    <div><Avatar className={classNames(classes.avatar, classes.bigAvatar)} src={imageSrc} /></div>
                    <Paper className={classes.paper}>
                        <Typography variant='body1'>Name:</Typography>
                        <Typography variant='title'>{profile.firstname} {profile.lastname}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <p>Woodbadge Klötzchen: {profile.woodbadgeCount}</p>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="headline">Da komm ich her</Typography>
                        <StructureBlock dioceseId={profile.dioceseId} regionId={profile.regionId} tribeId={profile.tribeId} />
                        {profile.residence && <p>Wohnort: {profile.residence}</p>}
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="headline">Das bin ich</Typography>
                        <FunctionBlock functionId={profile.functionId} />
                        {profile.favouriteStage && <p>Lieblingsstufe: {profile.favouriteStage}</p>}
                        {profile.relationshipStatus && <p>Beziehungsstatus: {profile.relationshipStatus}</p>}
                    </Paper>
                    {(profile.email || profile.phone) && <Paper className={classes.paper}>
                        <Typography variant="headline">So erreichst du mich</Typography>
                        {profile.email && <p>E-Mail: {profile.email}</p>}
                        {profile.phone && <p>Telefon: {profile.phone}</p>}
                    </Paper>}
                    <Paper className={classes.paper}>
                        <Typography variant="headline">Abenteuer</Typography>
                        <StyledAdventuresBlock profile={profile} profileId={this.props.match.params.profileId} />
                    </Paper>
                </Page>
            );
        }
    }
}

class StructureBlock extends Component {
    constructor(props) {
        super(props);

        let diocese = StructureStore.getDioceses()[this.props.dioceseId];
        let region, tribe;
        if(diocese.hasRegions){
            region = diocese.regions[this.props.regionId];
            tribe = region.tribes[this.props.tribeId];
        }else{
            tribe = diocese.tribes[this.props.tribeId];
        }

        this.state = {
            diocese: diocese,
            region: region,
            tribe: tribe
        };
    }

    render() {
        return (
            <div>
                <p>Diözese: {this.state.diocese.name}</p>
                {this.state.region && <p>Bezirk: {this.state.region.name}</p>}
                <p>Stamm: {this.state.tribe.name}</p>
            </div>
        );
    }
}

class FunctionBlock extends Component {
    constructor(props) {
        super(props);

        let functions = FunctionStore.getFunctions();
        this.state = {
            function: functions[props.functionId]
        };
    }
    render() {
        if(this.state.function){
            return (
                <p>Amt/Funktion: {this.state.function.name}</p>
            );
        }else{
            return null
        }
        
    }
}

class AdventuresBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adventures: false,
            totalPoints: 0,
            adventureCount: 0,
            commonAdventure: false
        };
    }

    componentDidMount() {
        this.loadAdventures();
    }

    loadAdventures = () => {
        AdventureStore.get(this.props.profileId)
        .then(data =>{
            console.log(data);
            if(data){
                this.setState({
                    adventures: data
                });
                let count = 0;
                let points = 0;
                Object.keys(this.state.adventures).forEach((key, _) => {
                    var adventure = this.state.adventures[key];
                    if(adventure.confirmed && adventure.withConfirmed){
                        count++;
                        points += adventure.points;
                    }
                    if(adventure.withUserId === AuthStore.getUserId()){
                        this.setState({
                            commonAdventure: adventure
                        });
                    }
                })
                this.setState({
                    totalPoints: points,
                    adventureCount: count
                })
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Typography variant='body2'>
                    {this.props.profile.firstname} hat schon {this.state.totalPoints} Punkt{this.state.totalPoints > 1 && 'e'} bei {this.state.adventureCount} Abenteuer{this.state.adventureCount > 1 && 'n'} gesammelt
                </Typography>
                <Divider />
                <AdventuresList adventures={this.state.adventures} />
                <Divider />
                {this.props.profileId !== AuthStore.getUserId() && <AdventureInput onChange={this.loadAdventures} commonAdventure={this.state.commonAdventure} profileId={this.props.profileId} profile={this.props.profile} />}
            </React.Fragment>
        );
    }
}
const StyledAdventuresBlock = withStyles(styles)(AdventuresBlock);

class AdventureInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: false,
            myProfile: false
        };
    }

    componentDidMount() {
        ProfileStore.get(AuthStore.getUserId())
        .then(data => {
            console.log(data);
            if(data.firstname){ // when name is set, then everything is set
                this.setState({
                    myProfile: data
                });
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    handleNewAdventure = (event) => {
        let possiblePoints = 2;
        let withPoints = 3;

        let content = {
            myPoints: possiblePoints,
            otherPoints: withPoints
        }

        fetch(
            Config.baseUrl + 'adventure/' + this.props.profileId, 
            { 
                method: 'POST',
                headers: new Headers({ 
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(content)
            }
        ).then(response => {
            if(response.ok) {
                this.setState({
                    message: 'Abenteuer wurde eingetragen'
                });
                this.props.onChange();
                return true;
            }
            throw new Error('API response status code was: ' + response.status);
        }).catch((error) => {
            console.error(error);
            this.setState({
                message: 'Abenteuer konnte nicht eingetragen werden!'
            })
        })
    }

    render() {
        let adventure = this.props.commonAdventure;
        let profile = this.props.profile;

        let text = '';
        let button = '';

        let possiblePoints = Points.calculate(this.state.myProfile, this.props.profile);

        if(adventure){
            if(!adventure.withConfirmed){
                text = <Typography variant="Display 2">{profile.firstname} behauptet, ein Abenteuer mit dir erlebt zu haben. Du bekommst dafür {adventure.withPoints} Punkt{adventure.withPoints > 1 ? 'e' : ''}</Typography>
                button = <Button variant="contained" onClick={this.handleNewAdventure}>Abenteuer bestätigen</Button>
            }else if(!adventure.confirmed){
                text = <Typography variant="Display 2">{profile.firstname} muss euer Abenteuer noch bestätigen, damit es im Profil angezeigt wird.</Typography>
            }
        }else{
            text = <Typography variant="Display 2">Du bekommst {possiblePoints} Punkt{possiblePoints > 1 ? 'e' : ''} für ein Abenteuer mit {profile.firstname}.</Typography>
            button = <Button variant="contained" onClick={this.handleNewAdventure}>Abenteuer eintragen</Button>
        }
        return(
            <div>
                {text}
                {button}
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
        )
    }
}

class AdventuresList extends Component {

    render() {
        if(!this.props.adventures){
            return null
        }else{
            return(
                <List>
                    {Object.keys(this.props.adventures).map((key, _) => {
                        var adventure = this.props.adventures[key];
                        if(adventure.confirmed && adventure.withConfirmed){
                            return <StyledAdventureItem adventure={adventure} />
                        }
                        return null
                    })}
                </List>
            )
        }
    }
}

class AdventureItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            withProfile: false
        };
    }

    componentDidMount() {
        ProfileStore.get(this.props.adventure.withUserId)
        .then(data =>{
            console.log(data);
            if(data.firstname){ // when name is set, then everything is set
                this.setState({
                    withProfile: data
                });
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        const { classes } = this.props;

        let name = this.props.adventure.withUserId;
        let imageName = 'noImagePlaceholder.png';

        if(this.state.withProfile !== false){
            let withProfile = this.state.withProfile;
            name = withProfile.firstname + ' ' + withProfile.lastname;
            if(withProfile.imageId){
                imageName = withProfile.imageId + '.jpg';
            }
        }

        let imageSrc = 'https://s3.eu-central-1.amazonaws.com/' + Config.s3Bucket + '/' + imageName;

        return (
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={classes.Avatar} src={imageSrc} />
                </ListItemAvatar>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                    <Typography variant="Display 2">{this.props.adventure.points}</Typography>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}
const StyledAdventureItem = withStyles(styles)(AdventureItem);

export default withStyles(styles)(ProfilePage);