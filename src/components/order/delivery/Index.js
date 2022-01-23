import { Card } from '../../card/Index'
import './style.scss'
import { Image } from '../../image/Index';
import Logo from '../../../assets/fedex-logo.jpg'
import { Text } from '../../text/Text';

export const Delivery = (props) => {

    return (
        <Card.Simple className={props.className}>
            <Card.Header className="bg-white border-0">
                <Text className="fs-14 ml-1 mt-0 mb-0 text-capitalize"> <span className="ordertitle__extra">Delivery</span> </Text>
            </Card.Header>
            <Card.Body>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="d-flex">
                            <div className="shadow-sm">
                                <Image src={Logo} alt="" x={70} y={70} />
                            </div>
                            <div className="flex-fill">
                                <div className="pl-2 mt-3 product-name">FedDex</div>
                                <div className="pl-2 title-value font-weight-normal">First Class Package</div>
                            </div>

                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold">$10.00</div>
                    </div>
                </div>
            </Card.Body>
        </Card.Simple>
    );
};
