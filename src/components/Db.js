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
    };

    /**
     * Function to create tables
     * @param void
     * @returns {{name: *|string|null, tables: *[]}}
     */
    getDbSchema = () => {
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
     * @returns {Promise<{result: *, success: boolean}>}
     */
    getDataByKey = async (searchKey) => {
        let giveResult = null;
        let successTxt = false;

        // Perform select operation
        await this.connection.select({
            from: this.searchTable,
            where: {
                param: searchKey,
            }
        }).then( function(results) {
            giveResult = results;

            // Return 1 if array length is greater than 0
            successTxt = (results.length > 0) ? 1 : 0;
        }).catch(function(error) {
            successTxt = 0;
            console.log('Error while select operation:', error);
        });

        return {
            result: giveResult[0],
            success: successTxt
        };
    };

    /**
     * Function to update the search_data by search_key
     * @param searchKey
     * @param newRecords
     * @param page
     * @returns {Promise<void>}
     */
    updateSearchData = async (searchKey, newRecords, page) => {
        // Perform update operation
        await this.connection.update({
            in: this.searchTable,
            set: {
                data: newRecords,
            },
            where: {
                param: searchKey,
                page: page,
            }
        }).then((rowsUpdated) => {
            console.log(rowsUpdated + ' rows updated!');
        }).catch((err) => console.log('Error occurred while updating:', err));
    };
}

export default Db;