import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import EditPage from './pages/EditPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HistoryPage from './pages/HistoryPage';

import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={MainPage}/>
          <Route path="/profile/:profileId" component={ProfilePage}/>
          <Route path="/edit" component={EditPage}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/register" component={RegistrationPage}/>
          <Route path="/history" component={HistoryPage}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
