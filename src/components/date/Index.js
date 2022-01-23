import React, {useState} from 'react';
import DatePicker from 'react-date-picker';
import './style.scss';

const Index = (props) => {


    const [date, setDate] = useState(new Date());


    return (
            <div className="date">
                <DatePicker
                    className="date__main"
                    onChange={date => setDate(date)}
                    value={date}
                    onMouseLeave={() => props.date(date)}
                    format="dd-MM-y"
                    
                ></DatePicker>
            </div>
    );
};

export default Index;