import React, { Component } from 'react';
import Button from './Button';
import { sortBy } from 'lodash'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const idColumn = "col-sm-1";
const largeColumn = "col-sm-6";
const midColumn = "col-sm-2";
const smallColumn = "col-sm-3";

const SORTS  = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
};

class Table extends Component
{
    render() {
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
                            <a href={item.url}>{item.title}</a>
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
}

export default Table;