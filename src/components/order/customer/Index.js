import { Card } from '../../card/Index'
import './style.scss'
import { Text } from '../../text/Text';
import { Image } from '../../image/Index';
import Logo from '../../../assets/personlogo.png';
import { ArrowRight, FileText, List, Mail, Phone } from 'react-feather';
import {
    PrimaryOutlineButton
} from '../../button/Index'

export const CustomerDetails = (props) => {

    return (
        <Card.Simple className={props.className}>
            <Card.Header className="bg-white border-0">
                <Text className="fs-14 ml-1 mt-0 mb-0 text-capitalize"> <span className="ordertitle__extra font-weight-bold">Customer</span> </Text>
            </Card.Header>
            <Card.Body>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal d-flex"> <Image className="rounded-circle" src={Logo} x={45} y={45} /> <div className="mt-2 pl-2"> <span className="customer-name">Shahed Talukder</span> </div></div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold"><ArrowRight size="16"/></div>
                    </div>
                </div>
                <hr />
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal d-flex"> <PrimaryOutlineButton className="rounded-circle"> <List size={18} /> </PrimaryOutlineButton> <div className="mt-2 pl-2"><span className="order-value">5 </span><span className="order-text">Orders</span></div></div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold"><ArrowRight size="16" /></div>
                    </div>
                </div>
                <hr />
                <Text className="fs-15 customertitle_extra font-weight-normal">Contact Info</Text>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Mail size={18} className="order-text"/> <span className="order-text pl-1">shahedtalukder51@gmail.com</span></div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Phone size={18} className="order-text"/> <span className="order-text pl-1">+8801762178238</span></div>
                    </div>
                </div>
                <hr/>
                <Text className="fs-15 customertitle_extra font-weight-normal">Shipping Address</Text>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Mail size={18} className="order-text" /> <span className="order-text pl-1">shahedtalukder51@gmail.com</span></div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Phone size={18} className="order-text" /> <span className="order-text pl-1">+8801762178238</span></div>
                    </div>
                </div>
                <hr />
                <Text className="fs-15 customertitle_extra font-weight-normal">Billing Address</Text>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Mail size={18} className="order-text" /> <span className="order-text pl-1">shahedtalukder51@gmail.com</span></div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 product-name font-weight-normal"><Phone size={18} className="order-text" /> <span className="order-text pl-1">+8801762178238</span></div>
                    </div>
                </div>
            </Card.Body>
        </Card.Simple>
    );
};
