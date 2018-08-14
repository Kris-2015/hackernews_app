import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'jquery/src/jquery';
import 'jquery/dist/jquery.slim.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel, faTrash, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import registerServiceWorker from './registerServiceWorker';
import 'jsstore/dist/jsstore';
import Db from './Db';

// Add the font icons which will accessible throughout the component
library.add(faStroopwafel, faTrash, faSearch, faSpinner);
ReactDOM.render(<App db={ new Db() } />, document.getElementById('root'));
registerServiceWorker();
