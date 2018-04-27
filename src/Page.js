import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import { withRouter } from 'react-router';


class Page extends Component {
    render() {
      return (
        <MuiThemeProvider>
            <div>
            <AppBar
                title={<span >{this.props.title}</span>}
  
                iconElementLeft={<IconButton onClick={() => this.props.history.goBack()}><NavigationBack /></IconButton>}
                
            />
  
            {this.props.children}
  
            </div>
        </MuiThemeProvider>
      );
    }
}

export default withRouter(Page);