import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import moment from 'moment';

import Config from '../Config';
import AuthStore from '../stores/AuthStore';
import * as HistoryStore from '../stores/HistoryStore';

const styles = {
    avatar: {
        margin: 5,
    },
};

class History extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readyCount: 0,
            history: []
        };
    }

    componentDidMount() {
        let data = HistoryStore.getSorted();
        this.setState({
            history: data
        });

        if(!data || data.length == 0){
            this.props.onLoaded();
        }
    }

    onItemLoaded = () => {
        this.setState({
            readyCount: this.state.readyCount + 1,
        });
        if(this.state.readyCount == this.state.history.length){
            this.props.onLoaded();
        }
    }

    render() {
        
        return (
            <List>
                {this.state.history && this.state.history.map((entry, _) => <StyledHistoryItem profileId={entry.profileId} datetime={entry.datetime} onProfileClick={this.props.onProfileClick} onLoaded={this.onItemLoaded} />)}
            </List>
        )
    }
}

class HistoryItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: false
        };
    }

    componentDidMount() {
        fetch(
            Config.baseUrl + 'profile/' + this.props.profileId, 
            { 
                headers: new Headers({ 
                    'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                    'Content-Type': 'application/json'
                }),
            }
        ).then(response => {
            this.props.onLoaded();
            if(response.ok) {
                return response.json();
            }
            throw new Error('API response status code was: ' + response.status);
        }).then(data => {
            console.log(data);
            if(data.firstname){ // when name is set, then everything is set
                this.setState({
                    profile: data
                });
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        const { classes } = this.props;

        let name = this.props.profileId;
        let imageName = 'noImagePlaceholder.png';

        if(this.state.profile !== false){
            let profile = this.state.profile;
            name = profile.firstname + ' ' + profile.lastname;
            if(profile.imageId){
                imageName = profile.imageId + '.jpg';
            }
        }

        let imageSrc = 'https://s3.eu-central-1.amazonaws.com/' + Config.s3Bucket + '/' + imageName;

        return (
            <ListItem onClick={() => this.props.onProfileClick(this.props.profileId)}>
                <ListItemAvatar>
                    <Avatar className={classes.Avatar} src={imageSrc} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={moment(this.props.datetime).format('LLLL')} />
            </ListItem>
        )
    }
}
const StyledHistoryItem = withRouter(withStyles(styles)(HistoryItem));

export default History;