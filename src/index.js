import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';
import 'moment/locale/de'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// set locale to german for date and time formatting
moment.locale('de');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
