import React from 'react';
import './style.scss';

export const InputGroup = (props) => {
    return (
        <div className="input-group">
            {props.children}
            <div className="input-group-append">
                <span className="input-group-text">
                    {props.append}
                </span>
            </div>
        </div>
    );
};