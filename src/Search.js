import React from 'react';

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

export default Search;