import React, { useState, useRef, useEffect } from 'react'
import './style.scss'
import { useWindowSize } from '../../components/window/windowSize'
import { MessengerNavbar } from '../../components/messenger/navbar'
import { ChatList } from '../../components/messenger/chatList'
import { InputBox } from '../../components/messenger/inputBox'
import { Message } from '../../components/messenger/message'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { GroupForm } from '../../components/messenger/groupForm'
import { Toastify } from '../../components/toastify/Toastify'
import { formatDateWithAMPM } from '../../utils/_heplers'
import { Images } from '../../utils/Images'


const Index = () => {
    const size = useWindowSize()
    const inputBoxRef = useRef(null)
    const messagesEndRef = useRef(null)
    const [height, setHeight] = useState()
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const [groupModal, setGroupModal] = useState({ show: false, loading: false })

    const scrollToBottom = () => messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

    useEffect(() => {
        scrollToBottom()
    }, [scrollToBottom])

    // handle group create
    const handleGroupCreate = async (data) => {
        try {
            setGroupModal({ ...groupModal, loading: true })
            setTimeout(() => {
                console.log(data)
                setGroupModal({ loading: false, show: false })
                Toastify.Success("Group created.")
            }, 1500)

        } catch (error) {
            if (error) {
                setGroupModal({ ...groupModal, loading: false })
                Toastify.Error("Group create failed.")
            }
        }
    }

    return (
        <div className="messenger-container">

            {/* Chat list container */}
            <div className={size.width < 992 && open ? "chat-list-container is-open-chat-list" : "chat-list-container"}>
                <ChatList
                    onBack={() => setOpen(false)}
                    onGroup={() => setGroupModal({ show: true, loading: false })}
                />
            </div>

            {/* Message box container */}
            <div className="message-box-container">

                {/* Navbar */}
                <MessengerNavbar onToggle={() => setOpen(!open)} />

                {/* Message list container */}
                <div className="message-list-container" style={{ height: `calc(100% - ${height}px)` }}>
                    {messages.length && messages.map((item, i) =>
                        <Message
                            position={i % 2 === 0 ? "left" : "right"}
                            avatar={Images.Mamun}
                            alt={"Mamun"}
                            time={formatDateWithAMPM(new Date())}
                            text={item.text ? item.text : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"}
                        />
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input container */}
                <div className="input-container" ref={inputBoxRef}>
                    <InputBox
                        height={data => setHeight(data + 30)}
                        onSubmit={value => {
                            setMessages([
                                ...messages, {
                                    text: value
                                }
                            ])
                        }}
                    />
                </div>
            </div>


            {/* Group create modal */}
            <PrimaryModal
                show={groupModal.show}
                onHide={() => setGroupModal({ show: false, loading: false })}
                title={"Create messenger group."}
            >
                <GroupForm
                    loading={groupModal.loading}
                    onSubmit={data => handleGroupCreate(data)}
                />
            </PrimaryModal>
        </div>
    )
}

export default Index;