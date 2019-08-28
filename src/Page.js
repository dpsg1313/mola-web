import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import NavigationBack from '@material-ui/icons/ArrowBack';

const theme = createMuiTheme();

const styles = {
        root: {
            flexGrow: 1,
        },
        appbar: {
            position: 'fixed',
            top: 0,
            width: '100%',
        },
        flex: {
            flexGrow: 1,
        },
  };

class Page extends Component {

    render() {
        const { classes } = this.props;
        
        let backButton;
        if(this.props.location.pathname !== '/'){
            backButton = <IconButton onClick={() => this.props.history.goBack()}><NavigationBack /></IconButton>
        }else{
            backButton = <span />
        }
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <div className={classes.root}>
                    <AppBar color="primary" position='sticky'>
                        <Toolbar>
                            {backButton}
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {this.props.title}
                            </Typography>
                            {this.props.toolbar}
                        </Toolbar>
                        {this.props.loading && <LinearProgress />}
                    </AppBar>
        
                    {this.props.children}

                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(withRouter(Page));