import React, { Component } from 'react';
import {Online, Offline} from 'react-detect-offline';

/**
  * @purpose Slide up the div on getting network
  */
class SlideToggle extends Component {
    render() {
        const {connectivity} = this.props;

        return (
            /* Add the class of slider closed when application gets network */
            <div className={connectivity ? 'slider closed' : 'slider'}>
                {/* Return the div when network connectivity is present or not */}
                {connectivity ?
                    <Online>
                        <div className="panel panel-success">
                            <div className="panel-heading">
                                You're online !
                            </div>
                        </div>
                    </Online>
                    :
                    <Offline>
                        <div className="panel panel-danger">
                            <div className="panel-heading">
                                You're offline !
                            </div>
                        </div>
                    </Offline>
                }
            </div>
        );
    }
}

export default SlideToggle;