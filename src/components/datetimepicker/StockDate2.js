import React, {useState} from 'react';
import DatePicker from 'react-date-picker';
import './style.scss';

const Index = (props) => {


    const [date, setDate] = useState(new Date());


    return (
        <div>
            <div className="stockin_datepicker2">
                <span>{props.info}</span>
                <DatePicker
                    onChange={date => setDate(date)}
                    value={date}
                    onMouseLeave={() => props.time(date)}
                    format="dd-MM-y"
                ></DatePicker>
                </div>
            </div>
    );
};

export default Index;