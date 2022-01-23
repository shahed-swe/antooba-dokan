import React, { useState, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { FormGroup } from '../../formGroup/FormGroup'
import { GrayButton } from '../../button/Index'
import { Send } from 'react-feather'

export const InputBox = (props) => {
    const inputRef = useRef()
    const [data, setData] = useState({ value: null, error: false })

    // Submit data
    const onSubmit = async (event) => {
        event.preventDefault()

        if (!data.value) return setData({ ...data, error: true })

        props.onSubmit(data.value)
        setData({ value: null, error: false })
        inputRef.current.value = ""
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="d-flex">
                <FormGroup className="flex-fill mb-0 pr-2">
                    <TextareaAutosize
                        ref={inputRef}
                        minRows={1}
                        maxRows={4}
                        className={data.error ? "form-control shadow-none px-2 error" : "form-control shadow-none px-2"}
                        style={{ resize: "none", borderRadius: 16 }}
                        placeholder='Type message...'
                        onHeightChange={(height) => props.height(height)}
                        onChange={event => setData({ value: event.target.value, error: false })}
                    />
                </FormGroup>

                <div>
                    <GrayButton
                        type="submit"
                        className="bg-white circle-btn text-primary"
                    >
                        <Send size={17} />
                    </GrayButton>
                </div>
            </div>
        </form>
    )
}