import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'font-awesome/fonts/fontawesome-webfont.svg';
import registerServiceWorker from './registerServiceWorker';
import 'jsstore/dist/jsstore';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();