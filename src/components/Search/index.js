import React from 'react';
import Button from '../Button';
import './index.css';

/**
 * @purpose Stateless component which return search bar and button
 * @param value
 * @param onChange
 * @param onSubmit
 * @param children
 * @return return search bar and button
 */
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
            <Button
                className="btn btn-primary btn-size btn-search"
                type="submit"
            >
                {children}
            </Button>
        </form>
    );
};

export default Search;