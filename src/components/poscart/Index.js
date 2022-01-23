import React, { useState, useCallback, useEffect } from 'react'
import './style.scss'
import { X, ShoppingCart, CreditCard } from 'react-feather'
import { GrayButton } from '../../components/button/Index'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { getDatabaseCart, removeFromDatabaseCart } from '../../utils/utilities'
import { SingleSelect } from '../select/Index'
import { Container } from '../container/Index'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { payment } from '../../utils/data'
import { PrimaryModal } from '../modal/PrimaryModal'
import { CustomerForm } from '../form/CustomerForm'
import { Toastify } from '../toastify/Toastify'
import { PrimaryButton } from '../../components/button/Index'

// Float button
const PosCart = (props) => {
    const [show, setShow] = useState(false)
    const savedCart = getDatabaseCart();
    const qnt = Object.keys(savedCart).length;
    const [quantity, setQuantity] = useState(qnt ?? 0)

    const handleDeleteQuantity = (data) => {
        console.log(data)
        removeFromDatabaseCart(data)
        setQuantity(quantity - 1)
    }

    return (
        <div className="pos-float-btn-container">
            <Drawer
                show={show}
                onHide={() => setShow(false)}
                setShow={setShow}
                handleQuantity={handleDeleteQuantity}
                quantity={qnt}
            />

            <div className={show ? "float-btn open" : "float-btn"} onClick={() => setShow(true)}>

            </div>
            <span onClick={() => setShow(true)} className={show ? "fs-13 btn__content text-open" : "fs-13 btn__content"}><ShoppingCart size={18} onClick={() => setShow(true)} />({qnt})</span>
        </div>
    )
}


// Help drawer
const Drawer = (props) => {
    const { t } = useTranslation()
    const [customer, setCustomer] = useState([])
    const [singleCustomer, setSingleCustomer] = useState([])
    const [customerModal, setCustomerModal] = useState(false)
    const [error, setError] = useState(false);
    const [creating, setCreate] = useState(false);
    const [loading, setLoading] = useState(false)

    // count purchase price
    const countPrice = () => {
        let price = []
        const cart = getDatabaseCart()
        Object.keys(cart).map((key, index) => {
            const temp = parseInt(key.split("/")[3]) * Object.values(cart)[index]
            console.log(temp)
            price.push(temp)
            return price
        }) 

        let sum = 0
        for(let i = 0; i < price.length; i++){
            sum += price[i]
        }
        return sum
    }

    const formData = {
        customer: singleCustomer
    }

    console.log(formData)

    const fetchProducts = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Product.DokanProductList()
            if (response && response.status === 200) {
                // setData(response.data && response.data.data ? response.data.data : [])
            }
        } catch (error) {
            if (error) {
                if (error.response && error.response.status === 401) {
                    console.log("No Data")
                }
            }
        }
    }, [])

    const fetchCustomer = useCallback(async () => {
        try {
            const response = await Requests.Customer.AllCustomer(0, 0)
            console.log(response.data.data)
            if (response && response.status === 200) {
                const data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    data.push({
                        value: response.data.data[i].uid,
                        label: response.data.data[i].name
                    })
                }
                setCustomer(data)
            }
        } catch (error) {
            if (error) {
                if (error.response && error.response.status === 401) {
                    console.log("No Data")
                }
            }
        }
    }, [])


    useEffect(() => {
        fetchProducts()
        fetchCustomer()
    }, [fetchProducts, fetchCustomer])

    // custom style
    const styles = {
        button: {
            cursor: 'pointer',
        }
    }


    // customer create
    const handleCustomerCreate = async (data) => {
        setCreate(true);
        try {
            const response = await Requests.Customer.AddCustomer(data);
            if (response.status === 201) {
                Toastify.Success("Customer Created Successfully");
            }
            setCustomerModal(false)
            setCreate(false);
            fetchCustomer();
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 422) {

                if (error.response && error.response.data) {
                    Toastify.Error("Customer Can't be Created");
                    setError(error.response.data)
                }
            } else {
                setError(error)
                Toastify.Error("Network Error");
            }
            setCreate(false);
            setCustomerModal(false)
        }
    };

    return (
        <div className="pos-drawer-container">
            <div className={props.show ? "backdrop open-backdrop" : "backdrop"}
                onClick={props.onHide}
            />

            {/* Drawer */}
            <div className={props.show ? "drawer open-drawer" : "drawer"}>
                <div className="drawer-header p-2 text-right mt-3">

                </div>
                <div className="drawer-body drawer-wrapper-scroll-y drawer-custom-scrollbar">
                    <Container.Fluid>
                        <Container.Row>
                            <Container.Column className="col-lg-6 col-md-6 col-sm-6">
                                <div className="table-wrapper-scroll-y my-custom-scrollbar">

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"> <span className="font-weight-normal fs-12">#</span></th>
                                                <th scope="col"> <span className="font-weight-normal fs-12">Name</span> </th>
                                                <th scope="col"> <span className="font-weight-normal fs-12">Quantity</span> </th>
                                                <th scope="col"> <span className="font-weight-normal fs-12">Price</span></th>
                                                <th scope="col"> <span className="font-weight-normal fs-12"> Warrenty To</span></th>
                                                <th scope="col"> <span className="font-weight-normal fs-12">Action</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="product-list">
                                            {
                                                Object.keys(getDatabaseCart()).map((key, index) => {
                                                    const product = getDatabaseCart()[key];
                                                    const name = key.split("/")[1]
                                                    const warrenty = key.split("/")[2]
                                                    const price = key.split("/")[3]
                                                    // const { name, price, quantity, warrenty_to } = key;
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row"><span className="font-weight-normal fs-12">{index + 1}</span></th>
                                                            <td> <span className="font-weight-normal fs-12">{name}</span> </td>
                                                            <td> <span className="font-weight-normal fs-12">{product}</span> </td>
                                                            <td> <span className="font-weight-normal fs-12"> {price}</span> </td>
                                                            <td> <span className="font-weight-normal fs-12">{warrenty}</span> </td>
                                                            <td>
                                                                <GrayButton style={{
                                                                    borderRadius: "50%",
                                                                    padding: "6px 9px",
                                                                    marginRight: 5,
                                                                }} onClick={() => { props.handleQuantity(key) }}><X size={18} /></GrayButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </Container.Column>
                            <Container.Column className="col-lg-6 col-md-6 col-sm-6">
                                <Text className="fs-13 mb-1 border-top pt-2 pb-1">Select Customer / <span className="text-primary" onClick={() => { setCustomerModal(true); props.setShow(false) }} style={styles.button}>Add Customer</span></Text>
                                <SingleSelect
                                    options={customer}
                                    placeholder={t('Select Customer')}
                                    value={event => setSingleCustomer(event.value)}
                                />

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Total Quantity</th>
                                            <th className="text-right">Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{props.quantity}</td>
                                            <td className="text-right">{countPrice()} Tk</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table">
                                    <tbody>
                                        <tr className="row">
                                            <td className="col-lg-6 col-sm-12">Amount To Pay</td>
                                            <td className="col-lg-6 col-sm-12"> <div className="input-group"><input type="text" className="form-control" placeholder="Amount To Pay" /> <div className="input-group-append"><span className="input-group-text">Tk</span></div></div> </td>
                                        </tr>
                                        <tr className="row">
                                            <td className="col-lg-6 col-sm-12">Discount Amount</td>
                                            
                                            <td className="col-lg-6 col-sm-12"> <div className="input-group"><input type="text" className="form-control" placeholder="Discount Amount" /> <div className="input-group-append"><span className="input-group-text">Tk</span></div></div> </td>
                                        </tr>
                                        <tr className="row">
                                            <td className="col-lg-6 col-sm-12">Payment option</td>
                                            <td className="col-lg-6 col-sm-12"> <FormGroup className="mb-0">
                                                <select
                                                    className="form-control shadow-none"
                                                    name="shiftSelect"
                                                    onChange={(event) => { console.log(event.target.value) }}
                                                >
                                                    <option value="default">Payment Option</option>
                                                    {payment && payment.map((item, i) =>
                                                        <option
                                                            key={i}
                                                            value={item.value}
                                                        >{item.label}</option>
                                                    )}
                                                </select>
                                            </FormGroup> </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <Text className="fs-15 alert-link">Amount Due <span>0 Tk</span></Text>
                                                <Text className="fs-15 alert-link">Amount To Return <span>0 Tk</span></Text>
                                            </th>
                                        </tr>
                                    </thead>
                                </table>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th><span className="fs-15">Ignore Due?</span></th>
                                            <th><span className="fs-15 pl-3"> <input type="checkbox" style={{ boxSizing: "border-box" }} /> <span>Check this to consider due as special discount</span></span></th>

                                        </tr>
                                    </thead>
                                </table>
                            </Container.Column>

                        </Container.Row>
                        <div className="text-right">
                            <PrimaryButton
                                type="submit"
                                className="px-4"
                                disabled={loading}
                            >
                                <span> <CreditCard size={18} /> {loading ? t("Processing Order ...") : t("Process Order")}</span>
                            </PrimaryButton>
                        </div>
                    </Container.Fluid>


                </div>
            </div>
            {/* for creating customer */}
            <PrimaryModal
                show={customerModal}
                onHide={() => setCustomerModal(false)}
                title="Create Customer"
                size="xl"
            >
                <CustomerForm

                    errors={error}
                    loading={creating}
                    submit={handleCustomerCreate}
                    create={true}
                />
            </PrimaryModal>


        </div >
    )
}

export { PosCart }
