import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import FunctionStore from '../../stores/FunctionStore';

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

class FunctionBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            functionId: props.functionId
        };
    }

    functions = FunctionStore.getFunctions();

    functionChanged = (event) => {
        this.setState({
            functionId: event.target.value
        });

        this.props.onChange({
            functionId: event.target.value
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <FormControl className={classes.formControl} error={!!this.props.error}>
                    <InputLabel htmlFor="functionId">Amt/Funktion *</InputLabel>
                    <Select
                        value={this.state.functionId}
                        onChange={this.functionChanged}
                        inputProps={{
                            id: 'functionId'
                        }}>
                        {Object.keys(this.functions).map((key, _) => {
                            var func = this.functions[key];
                            return <MenuItem key={func.id} value={func.id}>{func.name}</MenuItem>
                        })}
                    </Select>
                    {this.props.error && <FormHelperText id="name-error-text">{this.props.error}</FormHelperText>}
                </FormControl>
            </div>
        )
    }
}

export default withStyles(styles)(FunctionBlock);