import React from 'react'
import './style.scss'
import { ArrowLeft, PlusCircle } from 'react-feather'
import { SearchWithSuggestions } from '../../search/Index'
import { ChatUser } from '../chatUser'
import { users } from '../../../utils/chatUsers'
import { Images } from '../../../utils/Images'

export const ChatList = (props) => {
    return (
        <div className="chat-list">

            {/* Header */}
            <div className="header">
                <div className="d-flex mb-2">

                    {/* Back arrow button */}
                    <div className="d-lg-none">
                        <button
                            type="button"
                            className="btn shadow-none rounded-circle pt-2 pl-0"
                            onClick={props.onBack}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    {/* Chat avatar */}
                    <div className="avatar-container d-flex">
                        <div className="avatar-image-container">
                            <img src={Images.Radoan} alt="avatar name" />
                        </div>
                        <div className="avatar-name-container">
                            <p className="mb-0 text-capitalize font-weight-bolder">Chats</p>
                        </div>
                    </div>

                    {/* Plus button container */}
                    <div className="button-container ml-auto">
                        <button
                            type="button"
                            className="btn shadow-none rounded-circle pt-2 text-primary"
                            onClick={props.onGroup}
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>
                </div>

                <div className="search-container">
                    <SearchWithSuggestions
                        placeholder="Search Messenger"
                    />
                </div>
            </div>

            {/* Body */}
            <div className="body">
                {users.length && users.map((item, i) =>
                    <ChatUser
                        key={i}
                        avatar={item.image}
                        alt={item.name}
                        name={item.name}
                        subtitle={item.subtitle}
                        time={new Date()}
                        seen={item.seen}
                        selected={item.selected}
                    />
                )}
            </div>

        </div>
    );
};
