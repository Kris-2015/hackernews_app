import React, { Component } from 'react';
import './App.css';
// import Table from './components/Table/index';
// import Button from './components/Button';
// import Search from './components/Search/index';
// import config from './config/config';
// import SlideToggle from './components/SlideToggle/index';
// import Loading from './components/Loading';
// import api from './components/Api';

/**
 * @class App
 * @purpose Core part of the application
 */
class App extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-8">
                        <div className="card">
                            <div className="card-header">
                                <h3>Document Management</h3>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="form-group row">
                                        <label for="file-type" className="col-sm-3 col-form-label">File Type</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" id="file-type">
                                                <option>Select</option>
                                                <option value="1">Account Verification</option>
                                                <option value="2">File Verification</option>
                                                <option value="3">Address Verification</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="file-belongs-to" className="col-sm-3 col-form-label">File Belongs To</label>
                                        <div className="col-sm-8">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="file-belongs-to" id="file-belongs-to" value="1" checked/>
                                                <label className="form-check-label" for="file-belongs-to">
                                                    Adminstrator
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="file-belongs-to" id="file-belongs-to" value="1" />
                                                <label className="form-check-label" for="file-belongs-to" >
                                                    User
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="upload-file" className="col-sm-3 col-form-label">Upload File</label>
                                        <div className="col-sm-8">
                                            <input type="file" className="form-control-file" id="upload-file" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <button type="button" class="submit-btn btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;