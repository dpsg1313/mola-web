import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AuthStore from '../stores/AuthStore';


class ActionMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
        };
    }

    handleMenu = (event) => {
        this.setState({ anchor: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchor: null });
    };

    render() {
        const { classes } = this.props;

        const anchor = this.state.anchor;

        return(
            <div>
                <IconButton
                    aria-owns={!!anchor ? 'action-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="action-menu"
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={!!anchor}
                    onClose={this.handleClose}
                >
                    
                    <MenuItem onClick={() => this.props.history.push('/edit')}>Profil bearbeiten</MenuItem>
                    <MenuItem onClick={() => this.props.history.push('/profile/' + AuthStore.getUserId())}>Mein Profil</MenuItem>
                    <MenuItem onClick={this.props.onLogout}>Logout</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withRouter(ActionMenu);