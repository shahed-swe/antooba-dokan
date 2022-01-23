import React from 'react';
import { Image } from '../../image/Index';

const SingleProduct = (props) => {
    const {item} = props;

    return (
        <div className="d-flex bd-hightlight mb-3">
            <div className="flex-fill">
                <div className="d-flex">
                    <div className="image-size">
                        <Image className="rounded" src={item.featured_image} alt="" x={80} y={80} />
                    </div>
                    <div className="flex-fill">
                        <div className="pl-2 fs-14 product-name font-weight-bold">{item.name}</div>
                        <div className="pl-2"> <span className="title-text font-weight-normal">Discount:</span> <span className="title-value font-weight-normal">{item.discount_type}</span> </div>
                        <div className="pl-2"><span className="title-text font-weight-normal">Purchase Price:</span> <span className="title-value font-weight-normal">{item.purchase_price}</span> </div>
                        <div className="pl-2"> <span className="title-text font-weight-normal">Selling Price: </span> <span className="title-value font-weight-normal">{item.selling_price}</span> </div>
                        <div className="pl-2"> <span className="title-text font-weight-normal">Quantity: </span> <span className="title-value font-weight-normal">{item.quantity}</span> </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SingleProduct;