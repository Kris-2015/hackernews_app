import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'font-awesome/fonts/fontawesome-webfont.svg';
import registerServiceWorker from './registerServiceWorker';
import 'jsstore/dist/jsstore';

// Add the font icons which will accessible throughout the component
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
