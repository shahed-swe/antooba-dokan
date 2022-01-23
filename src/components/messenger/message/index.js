
import React from 'react'
import './style.scss'

export const Message = (props) => {
    return (
        <div className="message-container">

            {props.position === "left" ?
                <div className="d-flex">
                    <div className="avatar-container">
                        <img src={props.avatar} alt={props.alt} />
                    </div>
                    <div className="content-container content-container-left pl-2">
                        <div className="content-box content-box-left">
                            <p className="mb-0">{props.text}</p>
                        </div>
                        <div className="text-right pr-2">
                            <small className="text-muted">{props.time}</small>
                        </div>
                    </div>
                </div>
                : null
            }

            {props.position === "right" ?
                <div className="d-flex justify-content-end">
                    <div className="content-container pr-2">
                        <div className="content-box content-box-right">
                            <p className="mb-0">{props.text}</p>
                        </div>
                        <div className="pl-2">
                            <small className="text-muted">{props.time}</small>
                        </div>
                    </div>
                    <div className="avatar-container">
                        <img src={props.avatar} alt={props.alt} />
                    </div>
                </div>
                : null
            }

        </div>
    )
}