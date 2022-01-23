import React from 'react'
import './style.scss'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Text } from '../text/Text'

export const DatePicker = (props) => {
    return (
        <div>
            {props.message ? <Text className="fs-13 mb-0">{props.message ?? ""}</Text> : null}

            <ReactDatePicker
                selected={props.deafultValue ? Date.parse(props.deafultValue) : null}
                onChange={date => props.selected(date)}
                placeholderText={props.placeholder ? props.placeholder : "dd/mm/yyyy"}
                showDisabledMonthNavigation
                className={`form-control shadow-none ${props.className || ""}`}
                style={props.style}
            />
        </div>
    );
};
