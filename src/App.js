import React, { Component } from 'react';
import './App.css';
import Table from './components/Table/index';
import Button from './components/Button';
import Search from './components/Search/index';
import config from './config/config';
import SlideToggle from './components/SlideToggle/index';
import Loading from './components/Loading';
import api from './components/Api';
import Db from './components/Db';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorMessage from './components/ErrorMessage';

/**
 * @class App
 * @purpose Core part of the application
 */
class App extends Component {

    /**
     * @param props
     * @purpose define state
     */
    constructor (props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: config.DEFAULT_QUERY,
            error: null,
            isLoading: false,
            sortKey: 'NONE',
            isSortReverse: false,
        };

        // It indicates whether the component has been mounted or not
        this._isMounted = false;
        this.db = null;
    }


    /**
     * Function to check whether api call is required
     * @param searchTerm
     * @return boolean
     */
    needToSearchTopStories = async (searchTerm) => {
        // Get the result from cache
        let cacheHits = await this.db.getDataByKey(searchTerm);

        // Return result from cache if cache data is present
        if (cacheHits.success) {
            // Update the state of the result with cache data
            this.setState({
                results: {
                    [searchTerm] : { hits : JSON.parse(cacheHits.result.data),
                        page: cacheHits.result.page
                    },
                },
                isLoading: false
            });

            console.log('returning data from indexeddb');
            return false;
        }

        console.log('Make an api call to get data!');
        return true;
    };

    /**
     * Function to set search result in result state
     * @param result
     * @return void
     */
    setSearchTopStories = (result) => {
        // Destructing the state: reference ES6 Destructure
        const { hits, page } = result;
        const { searchKey, results, error } = this.state;

        // Return old when search key is present
        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        // Update the hits data, if new data is present
        const updateHits = [
            ...oldHits,
            ...hits
        ];

        // Set the state of the error if it is set to true
        if (error) {
            this.setState({error: false});
        }

        // Append the current result with old result
        this.setState({
            results: {
                ...results,
                [searchKey] : { hits : updateHits, page },
            },
            isLoading: false
        }, async () => {
            if (page > 0) {
                // Update records with new hits
                this.db.updateSearchData(searchKey, JSON.stringify(updateHits), page)
            } else {
                // Store the result and page limit in indexeddb by search key
                let searchData = JSON.stringify(updateHits);
                this.db.insertData(searchKey, searchData, page);
            }
        });
    };

    /**
     * Function to get the search term when search event is triggered
     * @param event
     * @return void
     */
    onSearchChange = (event) => this.setState({ searchTerm: event.target.value });

    /**
     * Function to fetch stories from hacker-news api
     * @param searchTerm
     * @param page
     * @return void
     */
    fetchSearchTopStories = (searchTerm, page=0) => {
        // Set the state of the isLoading to true, when new search request is made
        this.setState({ isLoading: true });

        // Make api calls when network is present
        if (navigator.onLine) {
                api(searchTerm, page)
                .then(result => this._isMounted && this.setSearchTopStories(result.data))
                .catch(error => this._isMounted && this.setState({ error }));
        } else {
            // Set the error state to true if application is offline
            this.setState({ error: true });
        }
    };

    /**
     * React lifecycle component which gets called after render function
     * @purpose After component has been mounted, perform search operation
     * @return void
     */
    componentDidMount () {
        this._isMounted = true;
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        // If db doesn't have Db object, then create a new object
        if (!this.db) {
            this.db = new Db();
        }

        // Check whether to make api call or not
        this.needToSearchTopStories(searchTerm)
            .then((result) => {
                if (result) {
                    // If result is false,then make api call
                    this.fetchSearchTopStories(searchTerm);
                }
            });
    }

    /**
     * React lifecycle component which will be called after component has mounted
     * @purpose Remove the declared event listener and set isMounted flag to false
     * @return void
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Function to perform search operation when search request has been triggered
     * @purpose Get the requested search term and perform search operation
     * @return void
     */
    onSearchSubmit = (event) => {
        event.preventDefault();
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        // Check whether to make api call or not
        this.needToSearchTopStories(searchTerm)
            .then((result) => {
                if (result) {
                    // If result is false,then make api call
                    this.fetchSearchTopStories(searchTerm);
                }
            });
    };

    /**
     * Function to remove the row when clicks trash button
     * @purpose Update the result of current search key
     * @return void
     */
    onDismiss = (id) => {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== id;

        // Remove the particular row from the hit list i.e, search results
        const updatedHits = hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        }, () => {
            // Store the updated result
            let searchData = JSON.stringify(updatedHits);
            let resultLength = results[searchKey]['hits'].length;

            // Update the indexeddb with latest changes
            this.db.updateSearchData(searchKey, searchData, page);

            // Make api call when dataset is empty
            if (resultLength <= 1) {
                this.fetchSearchTopStories(searchKey, (page+1));
            }
        });
    };

    /**
     * Function to sort the search results
     * @purose Perform the sorting based on search key
     * @return void
     */
    onSort = (sortKey) => {
        const isSortReverse = this.state.sortKey === sortKey &&
            !this.state.isSortReverse;

        this.setState({ sortKey, isSortReverse });
    };

    render() {
        const {
            searchTerm,
            searchKey,
            results,
            error,
            isLoading,
            sortKey,
            isSortReverse
        } = this.state;

        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];

        return (
            <div className="page">

                {/* Append the component of react-detect-offline*/}
                <SlideToggle />

                <div className="interactions">
                    {/* Search Component */}
                    <Search
                        value={ searchTerm }
                        onChange={ this.onSearchChange }
                        onSubmit={ this.onSearchSubmit }
                    >
                        <i className="fa fa-search"></i>
                    </Search>
                </div>
                {/*Applying Conditional Rendering in ternary operation for result*/}
                {error ?
                        <ErrorMessage />
                    :
                        <ErrorBoundary>
                            <Table
                                list={ list }
                                sortKey = { sortKey }
                                isSortReverse = { isSortReverse }
                                onSort = { this.onSort }
                                onDismiss = { this.onDismiss }
                            />
                        </ErrorBoundary>
                }

                {/* More button to generate more result as a paginated data */}
                <div className="interactions">
                    {isLoading
                        ? <Loading />
                        :
                        <Button
                            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
                            className="btn btn-primary"
                            type="button"
                        >
                            More
                        </Button>
                    }
                </div>
            </div>
        );
    }
}

export default App;