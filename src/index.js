import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel, faTrash, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import registerServiceWorker from './registerServiceWorker';
import 'jsstore/dist/jsstore';

// Add the font icons which will accessible throughout the component
library.add(faStroopwafel, faTrash, faSearch, faSpinner);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
