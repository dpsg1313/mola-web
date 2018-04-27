import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';

import Config from '../Config';
import Page from '../Page';
import * as AuthStore from '../stores/AuthStore';
import StructureStore from '../stores/StructureStore';
import FunctionStore from '../stores/FunctionStore';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined
        };
    }

    componentDidMount() {
        fetch(
            Config.baseUrl + 'profile/' + this.props.match.params.profileId, 
            { 
                headers: new Headers({ 
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Content-Type': 'application/json'
                }),
            }
        ).then(result => {
            return result.json()
        }).then(data =>{
            console.log(data);
            if(data.firstname){ // when name is set, then everything is set
                this.setState({profile: data});
            }
        }).catch((error) => {
            console.error(error);
        })
        
    }

    render() {
        const profile = this.state.profile;
        if(profile === undefined){
            return (
                <Page title={this.props.match.params.profileId}>
                Keine Daten verfügbar
                </Page>
            )
        }else{
            return (
                <Page title={profile.firstname}>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Avatar size='75%' src={'https://s3.eu-central-1.amazonaws.com/mola-images/' + profile.imageId + '.jpg'} />
                    </div>
                    <Paper>
                        <p>Name: {profile.firstname} {profile.lastname}</p>
                    </Paper>
                    <Paper>
                        <p>Woodbadge Klötzchen: {profile.woodbadgeCount}</p>
                    </Paper>
                    <Paper>
                        <StructureBlock dioceseId={profile.dioceseId} regionId={profile.regionId} tribeId={profile.tribeId} />
                        {profile.residence && <p>Wohnort: {profile.residence}</p>}
                    </Paper>
                    <Paper>
                        <FunctionBlock functionId={profile.functionId} />
                        {profile.favouriteStage && <p>Lieblingsstufe: {profile.favouriteStage}</p>}
                        {profile.relationshipStatus && <p>Beziehungsstatus: {profile.relationshipStatus}</p>}
                    </Paper>
                    <Paper>
                        {profile.mail && <p>E-Mail: {profile.mail}</p>}
                        {profile.phone && <p>Telefon: {profile.phone}</p>}
                    </Paper>
                </Page>
            );
        }
    }
}

class StructureBlock extends Component {
    constructor(props) {
        super(props);

        var diocese = StructureStore.getDioceses()[this.props.dioceseId];
        if(diocese.hasRegions){
            var region = diocese.regions[this.props.regionId];
            var tribe = region.tribes[this.props.tribeId];
        }else{
            var tribe = diocese.tribes[this.props.tribeId];
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

        var functions = FunctionStore.getFunctions();
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

export default ProfilePage;