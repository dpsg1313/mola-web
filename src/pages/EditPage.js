import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import Config from '../Config';
import Page from '../Page';
import * as AuthStore from '../stores/AuthStore';
import StructureStore from '../stores/StructureStore';
import FunctionStore from '../stores/FunctionStore';

class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    componentWillMount() {
        fetch(
            Config.baseUrl + 'profile/' + AuthStore.getUserId(), 
            { 
                headers: new Headers({ 
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Content-Type': 'application/json'
                }),
            }
        ).then(result => {
            return result.json()
        }).then(profile =>{
            this.setState(profile);
        }).catch((error) => {
            console.error(error);
        })
    }

    onAvatarClick = (event) => {
        console.log("AvatarClicked");
    }

    render() {
        const profile = this.state;
        if(profile.firstname === undefined){
            return (
                <Page title='Mein Profil bearbeiten'>
                Lade Profil-Daten...
                </Page>
            )
        }else{
            return (
                <Page title='Mein Profil bearbeiten'>
                    <div style={{width: '100%', textAlign: 'center'}} onClick={this.onAvatarClick}>
                        <Avatar size='50%' src={'https://s3.eu-central-1.amazonaws.com/mola-images/' + profile.imageId + '.jpg'} />
                    </div>
                    <Paper>
                        <TextField value={profile.firstname} floatingLabelText='Vorname *' floatingLabelFixed={true} onChange={(ev) => this.setState({firstname: ev.target.value})} />
                        <Divider />
                        <TextField value={profile.lastname} floatingLabelText='Nachname *' floatingLabelFixed={true} onChange={(ev) => this.setState({lastname: ev.target.value})} />
                    </Paper>
                    <Paper>
                        <SelectField floatingLabelText="Woodbadge Klötzchen *" value={profile.woodbadgeCount} onChange={(ev) => this.setState({woodbadgeCount: ev.target.value})}>
                            <MenuItem value={0} primaryText="keine" />
                            <MenuItem value={2} primaryText="2" />
                            <MenuItem value={3} primaryText="3" />
                            <MenuItem value={4} primaryText="4" />
                            <MenuItem value={5} primaryText="5" />
                            <MenuItem value={5} primaryText="6" />
                        </SelectField>
                    </Paper>
                    <Paper>
                        <StructureBlock dioceseId={profile.dioceseId} regionId={profile.regionId} tribeId={profile.tribeId} onChange={(state) => this.setState(state)}/>
                        <TextField value={profile.residence} floatingLabelText='Wohnort' floatingLabelFixed={true} onChange={(ev) => this.setState({residence: ev.target.value})} />
                    </Paper>
                    <Paper>
                        <SelectField floatingLabelText="Woodbadge Klötzchen *" value={profile.woodbadgeCount} onChange={(ev) => this.setState({woodbadgeCount: ev.target.value})}>
                            <MenuItem value={0} primaryText="keine" />
                            <MenuItem value={2} primaryText="2" />
                            <MenuItem value={3} primaryText="3" />
                            <MenuItem value={4} primaryText="4" />
                            <MenuItem value={5} primaryText="5" />
                            <MenuItem value={5} primaryText="6" />
                        </SelectField>
                        <SelectField floatingLabelText="Lieblingsstufe" value={profile.favouriteStage} onChange={(ev) => this.setState({favouriteStage: ev.target.value})}>
                            <MenuItem value={null} primaryText="" />
                            <MenuItem value='Wölflinge' primaryText="Wölflinge" />
                            <MenuItem value='Jupfis' primaryText="Jupfis" />
                            <MenuItem value='Pfadis' primaryText="Pfadis" />
                            <MenuItem value='Rover' primaryText="Rover" />
                        </SelectField>
                        <SelectField floatingLabelText="Beziehungsstatus" value={profile.relationshipStatus} onChange={(ev) => this.setState({relationshipStatus: ev.target.value})}>
                            <MenuItem value={null} primaryText="" />
                            <MenuItem value='single' primaryText="single" />
                            <MenuItem value='in einer festen Beziehung' primaryText="in einer festen Beziehung" />
                            <MenuItem value='in einer offenen Beziehung' primaryText="in einer offenen Beziehung" />
                            <MenuItem value='verlobt' primaryText="verlobt" />
                            <MenuItem value='verheiratet' primaryText="verheiratet" />
                            <MenuItem value='kompliziert' primaryText="kompliziert" />
                        </SelectField>
                    </Paper>
                    <Paper>
                        <TextField value={profile.mail} floatingLabelText='E-Mail' floatingLabelFixed={true} onChange={(ev) => this.setState({mail: ev.target.value})} />
                        <TextField value={profile.phone} floatingLabelText='Telefon' floatingLabelFixed={true} onChange={(ev) => this.setState({phone: ev.target.value})} />
                    </Paper>
                    <Snackbar
                        open={this.state.error}
                        message={this.state.error}
                        autoHideDuration={4000}
                        onRequestClose={() => this.setState({error: ''})}
                    />
                </Page>
            );
        }
    }
}

class StructureBlock extends Component {
    constructor(props) {
        super(props);

        if(this.props.dioceseId){
            var dioceses = StructureStore.getDioceses();
            var diocese = dioceses[this.props.dioceseId];
            if(diocese.hasRegions){
                var regions = diocese.regions;
                if(this.props.regionId){
                    var region = regions[this.props.regionId];
                    var tribes = region.tribes;
                    if(this.props.tribeId){
                        var tribe = tribes[this.props.tribeId];
                    }
                }
            }else{
                var tribes = diocese.tribes;
                if(this.props.tribeId){
                    var tribe = diocese.tribes[this.props.tribeId];
                }
            }
        }

        this.state = {
            diocese: diocese,
            region: region,
            tribe: tribe,
            dioceses: dioceses,
            regions: regions,
            tribes: tribes
        };
    }

    dioceseChanged = (event) => {
        var dioceseId = event.target.value;
        
        var diocese = this.state.dioceses[dioceseId];
        var region = undefined;
        var tribe = undefined;
        if(diocese.hasRegions){
            var regions = diocese.regions;
        }else{
            var tribes = diocese.tribes;
        }

        this.state = {
            diocese: diocese,
            region: region,
            tribe: tribe,
            regions: regions,
            tribes: tribes
        };

        this.props.onChange({
            dioceseId: this.state.diocese.id,
            regionId: undefined,
            tribeId: undefined
        })
    }

    regionChanged = (event) => {
        var regionId = event.target.value;
        
        var region = this.state.regions[regionId];
        var tribes = region.tribes;
        if(this.props.tribeId){
            var tribe = tribes[this.props.tribeId];
        }

        this.state = {
            region: region,
            tribe: tribe,
            tribes: tribes
        };

        this.props.onChange({
            dioceseId: this.state.diocese.id,
            regionId: this.state.region.id,
            tribeId: undefined
        })
    }

    tribeChanged = (event) => {
        var tribeId = event.target.value;

        var tribe = this.state.tribes[tribeId];

        this.state = {
            tribe: tribe
        };

        this.props.onChange({
            dioceseId: this.state.diocese.id,
            regionId: this.dioceseChanged.hasRegions ? this.state.region.id : undefined,
            tribeId: this.state.tribe.id
        })
    }

    render() {
        return (
            <div>
                <SelectField floatingLabelText="Diözese *" value={this.state.diocese && this.state.diocese.id} onChange={this.dioceseChanged}>
                    {Object.keys(this.state.dioceses).map((key, _) => {
                        var diocese = this.state.dioceses[key];
                        <MenuItem value={diocese.id} primaryText={diocese.name} />
                    })}
                </SelectField>
                <SelectField floatingLabelText="Bezirk *" value={this.state.region && this.state.region.id} onChange={this.regionChanged} disabled={!this.state.regions}>
                    {!!this.state.regions && Object.keys(this.state.regions).map((key, _) => {
                        var region = this.state.regions[key];
                        <MenuItem value={region.id} primaryText={region.name} />
                    })}
                </SelectField>
                <SelectField floatingLabelText="Stamm *" value={this.state.tribe && this.state.tribe.id} onChange={this.tribeChanged} disabled={!this.state.tribes}>
                    {!!this.state.tribes && Object.keys(this.state.tribes).map((key, _) => {
                        var tribe = this.state.tribes[key];
                        <MenuItem value={tribe.id} primaryText={tribe.name} />
                    })}
                </SelectField>
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

export default EditPage;