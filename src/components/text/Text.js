import React from 'react';
import './style.scss';

export const Text = (props) => {
    return <p className={props.className} style={props.style ? props.style : null}>{props.children}</p>
};
