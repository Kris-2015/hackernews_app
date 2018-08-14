import JsStore from 'jsstore/dist/jsstore';
import config from './config/config';
import Worker from 'jsstore/dist/jsstore.worker';

/**
 * @class DB
 * @purpose Indexed db
 */
class Db {

    dbName = null;
    constructor() {

        console.log('Inside db component');
        this.initJsStore = this.initJsStore.bind(this);
        this.getDbSchema = this.getDbSchema.bind(this);
    }

    initJsStore() {
        console.log('Db Component: initJsStore');
        const {DB_NAME: dbName} = config;

        this.dbName = dbName;

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

        console.log('Connection:', connection);
    }

    getDbSchema() {

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

        let createTable = {
            name: dbName,
            tables: searchDataTable
        };

        return createTable;
    }
}

export default Db;