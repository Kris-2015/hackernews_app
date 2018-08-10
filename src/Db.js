import React, {Component} from 'react';
import 'jsstore/dist/';
import config from './config/config';

/**
 * @class DB
 * @purpose Indexed db
 */
class Db extends Component {
    constructor(props) {
        super (props);

        this.initJsStore = this.initJsStore.bind(this);
    }

    initJsStore() {
        const {DB_NAME: dbName} = config;
        let connection = new JsStore.Instance(new Worker('jsstore.worker.js'));

        connection.isDbExist(dbName)
            .then((isExist) => {
                if(isExist) {
                    connection.openDb(dbName);
                } else {
                    const database = getDbSchema();
                    connection.createDb(database);
                }
            }).catch((err) => {
                console.log('Error occurred while setting up db:', err);
        })
    }

    getDbSchema() {

    }
}

export default Db;