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
import Page from '../Page';
import AuthStore from '../stores/AuthStore';
import * as HistoryStore from '../stores/HistoryStore';
import * as ProfileStore from '../stores/ProfileStore';

const styles = {
    avatar: {
        margin: 5,
    },
};

class HistoryPage extends Component {

    render() {
        let history = HistoryStore.getSorted();
        return (
            <Page title='Zuletzt gescannt'>
                <List>
                    {history.map((entry, _) => <StyledHistoryItem profileId={entry.profileId} datetime={entry.datetime} />)}
                </List>
            </Page>
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
        ProfileStore.get(this.props.profileId)
        .then(data => {
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

    onProfileClick = () => {
        console.log('Profile Click');

        this.props.history.push('profile/' + this.props.profileId);
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
            <ListItem onClick={this.onProfileClick}>
                <ListItemAvatar>
                    <Avatar className={classes.Avatar} src={imageSrc} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={moment(this.props.datetime).format('LLLL')} />
            </ListItem>
        )
    }
}
const StyledHistoryItem = withRouter(withStyles(styles)(HistoryItem));

export default HistoryPage;