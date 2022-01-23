import { Card } from '../../card/Index'
import { Text } from '../../text/Text'
import './style.scss'
import SingleProduct from './SingleProduct';


export const OrderItem = (props) => {
    

    return (
        <Card.Simple className={props.className}>
            <Card.Header className="bg-white border-0">
                <div className='d-flex'>
                    <Text className="fs-14 ml-1 mt-1 mb-0 text-capitalize"> <span className="ordertitle__extra">Products</span> <span className="orderquantity">{props.total}</span> </Text>
                </div>
            </Card.Header>
            <Card.Body>
                {props.order && props.order.map((item, index) => {
                    return (
                        <div key={index}>
                            <SingleProduct item={item}/>
                        </div>
                    )
                })}
            </Card.Body>
        </Card.Simple>
    );
};
