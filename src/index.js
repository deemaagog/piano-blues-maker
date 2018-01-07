import React from 'react';
import ReactDOM from 'react-dom';
import 'react-select/dist/react-select.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import "font-awesome/css/font-awesome.css";
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
