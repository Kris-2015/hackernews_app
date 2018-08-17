import React from 'react';
import classNames from "classnames";
import Button from './Button';

/**
 * @purpose Stateless component which perform sorting
 * of results.
 * @param sortKey
 * @param activeSortKey
 * @param onSort
 * @param children
 * @return Button Component
 */
const Sort = ({
                  sortKey,
                  activeSortKey,
                  onSort,
                  children
              }) => {

    const sortClass = classNames(
        'button-inline',
        { 'button-active' : sortKey === activeSortKey }
    );

    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={ sortClass }
        >
            {children}
        </Button>
    );
};

export default Sort;