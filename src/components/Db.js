/* eslint import/no-webpack-loader-syntax: off */
import * as JsStore from 'jsstore';
import config from '../config/config';
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';

/**
 * @class DB
 * @purpose Indexed db
 */
class Db {

    constructor() {
        console.log('Inside db component');
        this.dbName = null;

        this.initJsStore();
    }

    initJsStore = () => {
        console.log('Db Component: initJsStore');
        const {DB_NAME: dbName} = config;
        this.dbName = dbName;
        let connection = new JsStore.Instance(new Worker(workerPath));

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
        });

        console.log('Connection:', connection);
    };

    getDbSchema = () => {

        console.log('Db Component: getDbSchema');
        let dbName = this.dbName;

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

        return {
            name: dbName,
            tables: searchDataTable
        };
    };
}

export default Db;