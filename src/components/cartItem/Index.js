import _ from 'lodash'
import { X } from 'react-feather';
import { Text } from '../text/Text';
import { getDatabaseCart } from '../../utils/utilities';
import { FormGroup } from '../formGroup/FormGroup';
import { DangerButton } from '../button/Index';
import './style.scss'

export const CartProducts = (props) => {

    return (
        <div className="cart-items-container">
            {Object.keys(getDatabaseCart()).length ?
                Object.keys(getDatabaseCart()).map((key, index) => {
                    let quantity = Object.values(getDatabaseCart())[index]
                    const product = JSON.parse(key)
                    return (
                        <div className="cart-item d-flex border-bottom p-2" key={index}>
                            <div className="flex-fill pt-0">
                                <div className='d-flex justify-content-around'>
                                    <Text className="fs-14 my-auto mr-3">{index + 1}.</Text>
                                    <div className='my-auto' style={{width: "220px"}}>
                                        <Text className="fw-light text-dark mb-0 ">{product.name.length > 28 ? product.name.slice(0, 28) + " ..." : product.name}</Text>
                                    </div>
                                    <div className="d-flex align-content-around flex-wrap">
                                        <FormGroup className="col-4 col-xl-4 col-lg-6 col-md-6 ">
                                            <label>Price</label>
                                            <input type="number" defaultValue={product.price} className='form-control shadow-none' onChange={(event) => props.handleChangeInputBusket(product.uid, event, "price")}/>
                                        </FormGroup>
                                        <FormGroup className="col-3 col-xl-3 col-lg-6 col-md-6 ">
                                            <label>Quantity</label>
                                            <input type="number" defaultValue={quantity} className='form-control shadow-none' onChange={(event) => props.handleChangeInputBusket(product.uid, event, "quantity")} />
                                        </FormGroup>
                                        <FormGroup className="col-3 col-xl-3 col-lg-6 col-md-6 ">
                                            <label>Warrenty Time</label>
                                            <input type="number" className='form-control shadow-none' onChange={(event) => props.handleChangeInputBusket(product.uid, event, "warrenty")}/>
                                        </FormGroup>
                                        <div className='col-2 my-auto ml-auto'>
                                            <DangerButton className="rounded-circle mt-3 pt-2 pb-2" onClick={(event) => {props.handleQuantity(key); props.handleChangeInputBusket(product.uid, event,'remove')}}>
                                                <X size={14} />
                                            </DangerButton>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                ) : null}
        </div>
    );
};