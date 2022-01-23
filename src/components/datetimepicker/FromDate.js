import React, {useState} from 'react';
import DatePicker from 'react-date-picker';
import './style.scss';

const Index = (props) => {


    const [date, setDate] = useState(new Date());


    return (
        <div className="newcol">
            <div className="row datetime fromdate">
                <span className="datetime__labelfrom">{props.info}</span>
                <DatePicker
                    className="datetime__main"
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