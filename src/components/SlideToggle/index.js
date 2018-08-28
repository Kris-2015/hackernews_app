import React, { Component } from 'react';
import {Online, Offline} from 'react-detect-offline';
import './index.css';

/**
  * @purpose Slide up / down the div on getting network
  */
class SlideToggle extends Component {

    /**
     * @param props
     * @purpose define state and bind class functions
     */
    constructor(props) {
        super(props);

        this.state = {
            connectivity: false,
        };
    }

    /**
     * React lifecycle component which gets called after render function
     * @purpose After component has been mounted, perform search operation
     * @return void
     */componentDidMount() {
        // Register event for displaying online/offline message
        window.addEventListener('online', this.notifyOnline);
        window.addEventListener('offline', this.notifyOffline);
    }

    /**
     * React lifecycle component which will be called after component has mounted
     * @purpose Remove the declared event listener and set isMounted flag to false
     * @return void
     */
    componentWillUnmount() {
        window.removeEventListener('online', this.notifyOnline);
        window.removeEventListener('offline', this.notifyOffline);
    }

    /**
     * Function gets called which application's connection is alive
     * @param e event
     * @return void
     */
    notifyOnline = (e) => {
        e.preventDefault();

        // Perform search operation when application comes online
        document.querySelector('.btn-search').click();
        this.setState({ connectivity: true});
    };

    /**
     * Function gets called which application's connection is dead
     * @param e event
     * @return void
     */
    notifyOffline = (e) => {
        e.preventDefault();
        this.setState({connectivity: false});
    };

    render() {
        const {connectivity} = this.state;

        return (
            /* Add the class of slider closed when application gets network */
            <div className={connectivity ? 'slider closed' : 'slider'}>
                {/* Return the div when network connectivity is present or not */}
                {connectivity ?
                    <Online>
                        <div className="alert alert-success" role="alert">
                            You're online !
                        </div>
                    </Online>
                    :
                    <Offline>
                        <div className="alert alert-danger" role="alert">
                            You're offline !
                        </div>
                    </Offline>
                }
            </div>
        );
    }
}

export default SlideToggle;