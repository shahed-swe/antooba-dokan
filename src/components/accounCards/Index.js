import React from 'react';
import './style.scss'

const Index = (props) => {

    const first_title = props.first_title;
    const second_title = props.second_title;
    const date = props.date;
    const amount = props.amount;
    return (
        <div className="col-6">
            <div className="accountcard text-center">
                <div className="accountcard-header">
                    <div className="accountcard-footer__date">{second_title}
                        <span className="accountcard-footer__date">: {date}</span>
                    </div>
                </div>
                <div className="accountcard-footer">
                    <div className="accountcard-header__title">{first_title}
                        <span className="accountcard_header__price">: {amount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;