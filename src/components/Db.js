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
        this.dbName = null;
        this.connection = null;
        this.searchTable = 'search_data';
        this.results = null;
        this.success = false;

        // Perform database initialization
        this.initJsStore();
    }

    /**
     * Function to setup database connection and create db is not created
     * @param void
     * @return void
     */
    initJsStore = () => {
        console.log('Db Component: initJsStore');
        const {DB_NAME: dbName} = config;
        this.dbName = dbName;
        let connection = this.connection = new JsStore.Instance(new Worker(workerPath));

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

    /**
     * Function to create tables
     * @param void
     * @returns {{name: *|string|null, tables: *[]}}
     */
    getDbSchema = () => {

        console.log('Db Component: getDbSchema');
        let dbName = this.dbName;
        let tableName = this.searchTable;

        let searchDataTable = {
            name: tableName,
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
            tables: [searchDataTable]
        };
    };

    /**
     * Function to perform insertion
     * @param searchParam
     * @param searchData
     * @param page
     */
    insertData = (searchParam, searchData, page) => {

        console.log('Give me table name:', this.searchTable);
        // Organise the data insertion format
        let searchTableData = {
            param: searchParam,
            data: searchData,
            page: page
        };

        // Perform insert operation
        this.connection.insert({
            into: this.searchTable,
            values: [searchTableData]
        }).then((rowInserted) => {
            if (rowInserted > 0) {
                console.log('Successfully Inserted!');
            }
        }).catch((err) => {
            console.log('Error Occurred:', err);
        });
    };

    /**
     * Function to perform select operation
     * @param searchKey
     */
    getDataByKey = (searchKey) => {

        console.log('searchKey', searchKey);
        // Perform select operation
        this.connection.select({
            from: this.searchTable,
            where: {
                param: searchKey,
            }
        }).then((results) => this.setResults(results, true))
            .catch((err) => this.setResults(err, false));

        console.log(this.results);
        return {
            results: this.results,
            success: this.success
        };
    };

    /**
     * Function to return result after select operation
     * @param results
     * @param success
     */
    setResults = (results, success=false) => {
        console.log('Setting the results:', results);
        this.results = results[0];
        console.log('checking result:', results);
        this.success = success;
    };
}

export default Db;