import React, { Component } from 'react';

/**
 * @class Button
 * @purpose Component which accepts some properties
 */
class Button extends Component
{
    render () {
        const {
            onClick,
            className,
            type,
            children,
        } = this.props;

        return (
            <button
                onClick={onClick}
                className={className}
                type={type}
            >
                {children}
            </button>
        );
    }
}

export default Button;