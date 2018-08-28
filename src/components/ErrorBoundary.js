import React, {Component} from 'react';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends Component {

    constructor (props) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    componentDidCatch (error, info) {
        this.setState({ hasError: true });

        console.log('Error:', error);
        console.log('Error Info:', info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorMessage />
            );
        }
        return this.props.children;
    }
};

export default ErrorBoundary;