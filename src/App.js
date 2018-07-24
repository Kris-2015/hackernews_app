import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Table from './Table';
import Button from "./Button";
import Search from './Search';
import globalVariable from './constants/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Loading = () =>
    <div><i><FontAwesomeIcon icon="spinner" /></i></div>;

class App extends Component {

    _isMounted = false;

    constructor (props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: globalVariable.DEFAULT_QUERY,
            error: null,
            isLoading: false,
            sortKey: 'NONE',
            isSortReverse: false,
        };

        this.needToSearchTopStories = this.needToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    needToSearchTopStories(searchTerm) {
        // Get the result from cache
        let cacheHits = localStorage.getItem(searchTerm);
        let cachePage = localStorage.getItem('page');

        // Return result from cache if cache data is present
        if (cacheHits) {
            this.setState({
                results: {
                    [searchTerm] : { hits : JSON.parse(cacheHits),
                        page: JSON.parse(cachePage)
                    },
                },
                isLoading: false
            });

            console.log('My cache results:', this.state);
            console.log('returning data from cache');
            return false;
        }

        console.log('Make an api call to get data!');
        return true;
        // Commenting the line for future reference
        //return !this.state.results[searchTerm];
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updateHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            results: {
                ...results,
                [searchKey] : { hits : updateHits, page },
            },
            isLoading: false
        });

        console.log('After setting the state, Results:', this.state.results);
        // Store the result and page limit in local storage by search key
        localStorage.setItem(searchKey, JSON.stringify(updateHits));
        localStorage.setItem('page', JSON.stringify(page));
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    fetchSearchTopStories (searchTerm, page=0) {
        this.setState({ isLoading: true });

        axios(`${globalVariable.PATH_BASE}${globalVariable.PATH_SEARCH}?${globalVariable.PARAM_SEARCH}${searchTerm}&${globalVariable.PARAM_PAGE}\
${page}&${globalVariable.PARAM_HPP}${globalVariable.DEFAULT_HPP}`)
            .then(result => this._isMounted && this.setSearchTopStories(result.data))
            .catch(error => this._isMounted && this.setState({ error }));
    }

    componentDidMount() {
        this._isMounted = true;

        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        //this.fetchSearchTopStories(searchTerm);

        // Check whether to make api call or not
        if (this.needToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSearchSubmit (event) {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        if (this.needToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }

        event.preventDefault();
    }

    onDismiss(id) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        });
    }

    onSort(sortKey) {
        const isSortReverse = this.state.sortKey === sortKey &&
            !this.state.isSortReverse;

        this.setState({ sortKey, isSortReverse });
    }

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
                <div className="interactions">
                    <Search
                        value={ searchTerm }
                        onChange={ this.onSearchChange }
                        onSubmit={ this.onSearchSubmit }
                    >
                        <i><FontAwesomeIcon icon="search" /></i>
                    </Search>
                </div>
                {/*Applying Conditional Rendering in ternary operation for result*/}
                { error
                    ?<div className="interactions">
                        <p>Oops, Something went wrong!</p>
                    </div>
                    :
                    <Table
                        list={ list }
                        sortKey = { sortKey }
                        isSortReverse = { isSortReverse }
                        onSort = { this.onSort }
                        onDismiss = { this.onDismiss }
                    />
                }

                <div className="interactions">
                    {isLoading
                        ? <Loading/>
                        :
                        <Button
                            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
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