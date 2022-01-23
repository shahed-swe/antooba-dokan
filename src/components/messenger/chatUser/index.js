import React from 'react'
import './style.scss'

export const ChatUser = (props) => {
    return (
        <div className={props.selected ? "chat-user-cotainer is-selected-user" : "chat-user-cotainer"}>
            <div className="d-flex w-100">
                <div className="avatar-container">
                    <img
                        src={props.avatar}
                        alt={props.alt}
                    />
                </div>
                <div className="content-container">
                    <p className={!props.seen ? "font-weight-bolder text-dark name" : "name"}>{props.name}</p>
                    <p className={!props.seen ? "text-dark font-weight-bold subtitle" : "subtitle"}>{props.subtitle}</p>
                </div>
            </div>
        </div>
    );
};
