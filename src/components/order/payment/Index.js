import { Card } from '../../card/Index'
import './style.scss'
import { Text } from '../../text/Text';

export const Payment = (props) => {

    return (
        <Card.Simple className={props.className}>
            <Card.Header className="bg-white border-0">
                <Text className="fs-14 ml-1 mt-0 mb-0 text-capitalize"> <span className="ordertitle__extra">Payment Summary</span> </Text>
            </Card.Header>
            <Card.Body>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 fs-14 font-weight-normal">Subtotal (2 Items)</div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold">$10.00</div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 fs-14 font-weight-normal">Delivery</div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold">$20.00</div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-3 fs-14 font-weight-normal">Tax</div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-3 title-value font-weight-bold">$30.00</div>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className="background-muted border-0">
                <div className="d-flex">
                    <div className="flex-fill">
                        <div className="pl-2 mt-1 fs-14 font-weight-bold">Total</div>
                    </div>
                    <div className="flex-grow">
                        <div className="pl-2 mt-1 title-value font-weight-bold">$30.00</div>
                    </div>
                </div>
            </Card.Footer>
        </Card.Simple>
    );
};
