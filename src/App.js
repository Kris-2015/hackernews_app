import React, { Component } from 'react';
/*import logo from './logo.svg';*/
import axios from 'axios';
import './App.css';
import Table from './Table';
import Button from "./Button";

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const Loading = () =>
    <div><i className="fas fa-spinner"></i></div>;

class App extends Component {

    _isMounted = false;

    constructor (props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
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
        return !this.state.results[searchTerm];
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
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    fetchSearchTopStories (searchTerm, page=0) {
        this.setState({ isLoading: true });

        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}\
${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this._isMounted && this.setSearchTopStories(result.data))
            .catch(error => this._isMounted && this.setState({ error }));
    }

    componentDidMount() {
        this._isMounted = true;

        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm);
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
                        <i className="fas fa-search"></i>
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

// Stateless Component
const Search = ({
                    value,
                    onChange,
                    onSubmit,
                    children
                }) => {
    let input;
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                ref={ (node) => input => node }
            />
            <button className="btn btn-primary btn-size" type="submit">
                {children}
            </button>
        </form>
    );
};

export default App;

export {
    Search,
};