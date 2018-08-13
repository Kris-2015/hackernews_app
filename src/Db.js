import React, {Component} from 'react';
import JsStore from 'jsstore/dist/jsstore';
import 'jsstore/dist/jsstore.worker';
import config from './config/config';

/**
 * @class DB
 * @purpose Indexed db
 */
class Db extends Component {
    constructor(props) {
        super (props);

        this.initJsStore = this.initJsStore.bind(this);
        this.getDbSchema = this.getDbSchema.bind(this);
    }

    initJsStore() {
        const {DB_NAME: dbName} = config;
        let connection = new JsStore.Instance(new Worker('jsstore.worker.js'));

        connection.isDbExist(dbName)
            .then((isExist) => {
                if(isExist) {
                    connection.openDb(dbName);
                } else {
                    const database = this.getDbSchema();
                    connection.createDb(database);
                }
            }).catch((err) => {
                console.log('Error occurred while setting up db:', err);
        })
    }

    getDbSchema() {
        let dbName = 'hackernews_app';

        let searchDataTable = {
            name: 'search_data',
            columns: [
                {
                    name: 'id',
                    primaryKey: true,
                    autoIncrement: true
                },
                {
                    name: 'param',
                    dataType: JsStore.DATA_TYPE.String
                },
                {
                    name: 'data',
                    dataType: JsStore.DATA_TYPE.String
                },
                {
                    name: 'page',
                    dataType: JsStore.DATA_TYPE.Number
                }
            ]
        };

        let createTable = {
            name: dbName,
            tables: searchDataTable
        };

        return createTable;
    }
}

export default Db;