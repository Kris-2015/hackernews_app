import React, { Component } from 'react';
import Button from './Button';
import { sortBy } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import constants from './config/constants';
import Sort from './Sort';

/**
 * @class Table
 * @purpose Table component which displays data in grid
 */
class Table extends Component
{
    render() {
        // bootstrap class column; Destructing the constants with different name
        const {
            ID_COLUMN: idColumn,
            LARGE_COLUMN: largeColumn,
            MID_COLUMN: midColumn,
            SMALL_COLUMN:smallColumn,
        } = constants;

        const SORTS  = {
            NONE: list => list,
            TITLE: list => sortBy(list, 'title'),
            AUTHOR: list => sortBy(list, 'author'),
        };

        const {
            list,
            sortKey,
            isSortReverse,
            onSort,
            onDismiss,
        } = this.props;

        const sortedList = SORTS[sortKey] (list);
        const reverseSortedList = isSortReverse ?
            sortedList.reverse() : sortedList;

        return (
            <div className="table">
                <div className="table-header">
                    <span className={ idColumn }>
                        <p>ID</p>
                    </span>
                    <span className={ largeColumn }>
                        <Sort
                            sortKey={'TITLE'}
                            onSort={onSort}
                            activeSortKey = { sortKey }
                            >
                            <p>Title</p>
                        </Sort>
                    </span>
                    <span className={ midColumn }>
                        <Sort
                            sortKey={'AUTHOR'}
                            onSort={onSort}
                            activeSortKey = { sortKey }
                        ><p>Author</p>
                        </Sort>
                    </span>
                    <span className={ smallColumn }>
                        <Button className="button-inline">
                            <p>Remove</p>
                        </Button>
                    </span>
                </div>
                {reverseSortedList.map((item, index) =>
                    <div key={item.objectID} className="table-row">
                        <span className={ idColumn }>
                            <p>{index + 1}</p>
                        </span>
                        <span className={ largeColumn }>
                            <a href={item.url} target="_blank">{item.title}</a>
                        </span>
                        <span className={ midColumn }>{item.author}</span>
                        <span className={ smallColumn }>
                            <Button
                                onClick={() => onDismiss(item.objectID)}
                                className="btn btn-danger btn-size"
                            >
                            <i>
                                <FontAwesomeIcon icon="trash" />
                            </i>
                            </Button>
                        </span>
                    </div>
                )}
            </div>
        );
    };
}

export default Table;