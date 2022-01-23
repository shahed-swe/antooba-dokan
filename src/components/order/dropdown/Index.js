import React from 'react'
import {
    DropdownButton,
    Dropdown
} from 'react-bootstrap'
import { MoreVertical } from 'react-feather'
import './style.scss'

export const DropdownComponent = (props) => {
    return (
        <div className="orderpage-navigator">
            <DropdownButton
                title={
                    <MoreVertical size={18} />
                }
            >
                {props.data.map((item, index) => {
                    return <Dropdown.Item key={index} onClick={() => props.handleChange(item.value)}>{item.label}</Dropdown.Item>
                })}
            </DropdownButton>
        </div>
    )
}

