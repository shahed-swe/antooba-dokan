import { useState } from 'react'
import { Calendar } from "react-feather";
import { dateFormate } from "../../../utils/_heplers";
import './style.scss'
import { orderstatus } from "../../../utils/data";
import { DropdownComponent } from "../dropdown/Index";

export const OrderTop = (props) => {
    const [status, setStatus] = useState(orderstatus[0].label)

    const handleChange = (data)=> {
        setStatus(data)
    }


    return (
        <div className="row">
            <div className="ml-3">
                <span className="ordertitle">Order</span>
                <span className="orderid ml-2">#{props.id}</span>
                <br/>
                <span className="fs-14 rounded payment ml-0 mt-1">{props.status.payment}</span>
                <span className="horizontalline"></span>
                <span className="calender">
                    <Calendar size={16} />
                    <span className="fs-14 date">{dateFormate(new Date())}</span>
                </span>
            </div>
            <div className="ml-auto dropdown-margin">
                <span className="fs-14 rounded orderstatus">{status}</span>
                <DropdownComponent data={orderstatus} handleChange={handleChange} />
            </div>
        </div>
    );
};
