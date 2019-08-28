import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import StructureStore from '../../stores/StructureStore';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 200,
    }
});

class StructureBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dioceseId: this.props.dioceseId,
            regionId: this.props.regionId,
            tribeId: this.props.tribeId
        }
    }

    dioceses = StructureStore.getDioceses();

    dioceseChanged = (event) => {
        console.log(this.state);
        this.props.onChange({
            dioceseId: event.target.value,
            regionId: '',
            tribeId: ''
        })
    }

    regionChanged = (event) => {
        this.props.onChange({
            regionId: event.target.value,
            tribeId: ''
        })
    }

    tribeChanged = (event) => {
        this.props.onChange({
            tribeId: event.target.value
        })
    }

    render() {
        const { classes } = this.props;

        let dioceseId = this.props.dioceseId;
        let regionId = this.props.regionId;
        let tribeId = this.props.tribeId;
        let diocese, region;
        let regions, tribes;

        if(dioceseId){
            diocese = this.dioceses[dioceseId];
            if(diocese.hasRegions){
                regions = diocese.regions;
                if(regionId){
                    region = regions[regionId];
                    tribes = region.tribes;
                }
            }else{
                tribes = diocese.tribes;
            }
        }

        return (
            <div>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="diocese">Diözese *</InputLabel>
                        <Select
                            value={dioceseId}
                            onChange={this.dioceseChanged}
                            inputProps={{
                                id: 'diocese'
                            }}>
                            {Object.keys(this.dioceses).map((key, _) => {
                                var diocese = this.dioceses[key];
                                return <MenuItem key={diocese.id} value={diocese.id}>{diocese.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="region">Bezirk *</InputLabel>
                        <Select
                            value={regionId}
                            onChange={this.regionChanged}
                            disabled={!regions}
                            inputProps={{
                                id: 'region'
                            }}>
                            {!!regions && Object.keys(regions).map((key, _) => {
                                var region = regions[key];
                                return <MenuItem key={region.id} value={region.id}>{region.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl className={classes.formControl} error={!!this.props.error}>
                        <InputLabel htmlFor="tribe">Stamm *</InputLabel>
                        <Select
                            value={tribeId}
                            onChange={this.tribeChanged}
                            disabled={!tribes}
                            inputProps={{
                                id: 'tribe'
                            }}>
                            {!!tribes && Object.keys(tribes).map((key, _) => {
                                var tribe = tribes[key];
                                return <MenuItem key={tribe.id} value={tribe.id}>{tribe.name}</MenuItem>
                            })}
                        </Select>
                        {this.props.error && <FormHelperText id="name-error-text">{this.props.error}</FormHelperText>}
                    </FormControl>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StructureBlock);