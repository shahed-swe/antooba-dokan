import React from 'react'
import './style.scss'
import { Images } from '../../../utils/Images'
import { Menu } from 'react-feather';

export const MessengerNavbar = (props) => {
    return (
        <div className="messenger-navbar">
            <div className="d-flex w-100">

                {/* Chat avatar */}
                <div className="avatar-container d-flex">
                    <div className="avatar-image-container">
                        <img src={Images.Mamun} alt="avatar name" />
                    </div>
                    <div className="avatar-name-container">
                        <p className="mb-0 text-capitalize font-weight-bolder">abdullah al mamun</p>
                    </div>
                </div>

                {/* Chat menu */}
                <div className="chat-list-toggle-button-container ml-auto d-lg-none">
                    <button
                        type="button"
                        className="btn shadow-none rounded-circle btn-light"
                        onClick={props.onToggle}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};