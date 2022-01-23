import React, { useState, useCallback, useEffect } from 'react'
import { ShoppingCart, CreditCard, X, Plus, ChevronUp, ChevronDown } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import './style.scss'
import { Text } from '../text/Text'
import { Form } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next'
import { SingleSelect } from '../select/Index'
import { Container } from '../container/Index'
import { EmptyCart } from '../emptyCart/Index'
import { Toastify } from '../toastify/Toastify'
import { CartProducts } from '../cartItem/Index'
import { InputGroup } from '../inputGroup/Index'
import { Requests } from '../../utils/Http/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { CustomerForm } from '../form/CustomerForm'
import { PrimaryModal } from '../modal/PrimaryModal'
import { getDatabaseCart } from '../../utils/utilities'
import { payment, installmentdata, installmentPeriod } from '../../utils/data'
import { GrayButton, PrimaryButton, DangerButton } from '../../components/button/Index'

// Float button
const Busket = (props) => {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)

    return (
        <div className="busket-float-btn-container">
            <Drawer
                show={show}
                onHide={() => setShow(false)}
                setShow={setShow}
                handleQuantity={props.handleDeleteQuantity}
                quantity={props.qnt}
                product={props.product}
                handleChangeInputBusket={props.handleChangeInputBusket}
                busketproduct={props.busketproduct}
                productid={props.productid}
            />

            <div
                className="float-btn shadow bg-white rounded"
                onClick={() => setShow(true)}
            >
                <ShoppingCart className={props.busket ? "shake" : ""} size={25} onClick={() => setShow(true)} />
                <span onClick={() => setShow(true)}>{t('Busket')}({props.qnt})</span>
            </div>
        </div>
    )
}

// Help drawer
const Drawer = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm()
    const [customer, setCustomer] = useState([])
    const [customerModal, setCustomerModal] = useState(false)
    const [error, setError] = useState(false);
    const [creating, setCreate] = useState(false);
    const [loading, setLoading] = useState(false)
    const [installment, setInstallment] = useState(false)
    const [installmentshow, setInstallmentShow] = useState(true)
    const [downpayment, setDownpayment] = useState(null)
    const [quantity, setQuantity] = useState(null)
    const [product, setProduct] = useState([])
    const [totalOtherPrice, setTotalOtherPrice] = useState(0)
    const [paymentOption, setPaymentOption] = useState(null)
    const [ignoreDue, setIgnoreDue] = useState(false)
    const [customerdetails, setCustomerDetails] = useState({})
    const [previousdue, setPreviousDue] = useState(false)
    const [dues, setDues] = useState(0)
    const [payableamount, setAmount] = useState(0)
    const [recentDue, setRecentDue] = useState(0)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [manufacturing_cost, setManufacturingCost] = useState(0)
    // for installment section
    const [installmentProd, setInstallmentProd] = useState([])
    const [removeloading, setRemoveLoading] = useState(false)

    // for isntallment section adding
    const handleAddInstallment = (id) => {
        setInstallmentProd([...installmentProd, {
            id: id,
            product_uid: '',
            product_name: '',
            period: '',
            period_type: '',
            down_payment: '',
            product_price: ''
        }])
    }



    // for installment
    const handleChangeInputInstallment = (id, event, types) => {

        const newInputFields = installmentProd.map(item => {
            if (id === item.id) {
                if (types === "product_uid") {
                    item["product_uid"] = event.value
                    item['product_name'] = event.label
                }
                if (types === "period") {
                    item["period"] = event.target.value
                }
                if (types === "period_type") {
                    item["period_type"] = event.target.value
                }
                if (types === "down_payment") {
                    item["down_payment"] = event.target.value
                }
                let price = props.busketproduct.find(item2 => item2.value === item.product_uid).price
                let quantity = props.busketproduct.find(item2 => item2.value === item.product_uid).quantity
                price = price * quantity
                item['per_installment'] = item.down_payment ? Math.round((price - parseFloat(item.down_payment)) / parseInt(item.period), 2) : price
            }
            // removing element
            const values = [...product]
            const get = values.findIndex(value => value.value === item.product_uid)
            let total_other_price = 0
            if (get !== -1) {
                values.splice(get, 1)
                console.log(values)
                values.map((item) => total_other_price += parseFloat(item.price) * parseFloat(item.quantity))
                setProduct(values)
                setTotalOtherPrice(total_other_price)
            }

            // returning items
            return item;
        })
        setInstallmentProd(newInputFields);
    }


    // calculate down payment
    useEffect(() => {
        let totaldownpayment = 0
        installmentProd && installmentProd.map((item, index) =>
            totaldownpayment += parseFloat(isNaN(item.down_payment) ? 0 : item.down_payment)
        )
        setDownpayment(totaldownpayment)
    }, [installmentProd])

    // calculate quantity
    useEffect(() => {
        let totalquantity = 0
        props.busketproduct && props.busketproduct.map((item) =>
            totalquantity += parseInt(item.quantity)
        )
        setQuantity(totalquantity)
    }, [props])

    // get product on props update
    useEffect(() => {
        setProduct(props.product)
    }, [props])

    // for removing installment
    const handleRemoveInstallment = (item, id) => {
        setRemoveLoading(true)
        setTimeout(() => {
            const values = [...installmentProd]
            values.splice(values.findIndex(value => value.id === id), 1)

            // readding to product section
            if(item.product_uid !== ""){
                const get = props.busketproduct.find(prod => prod.value === item.product_uid)

                const get2 = product.findIndex(value => value.value === get.value)
                if (get2 === -1) {
                    product.push(get)
                    setProduct(product)
                }
            }
            

            setInstallmentProd(values)
            setRemoveLoading(false)
        }, 100)

    }

    // for removing installment if props change
    const removeInstallmentProd = useCallback((id) => {
        const values = [...installmentProd]
        const get = values.findIndex(value => value.product_uid === id)
        if (get !== -1) {
            values.splice(get, 1)
            setInstallmentProd(values)
        }
    }, [installmentProd])

    // removing data from installment
    useEffect(() => {
        removeInstallmentProd(props.productid)
    }, [props])

    // count purchase price
    const countPrice = () => {
        let price = 0
        props.busketproduct.map((item, index) => price += parseFloat(item.price) * parseInt(item.quantity))
        return price
    }

    // fetch customer
    const fetchCustomer = useCallback(async () => {
        try {
            const response = await Requests.Customer.AllCustomer(0, 0)
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
                }
            }
        }
    }, [])




    useEffect(() => {
        fetchCustomer()
    }, [fetchCustomer])



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

    const savedCart = getDatabaseCart();
    const qnt = Object.keys(savedCart).length;


    // fetch customer details
    const fetchCustomerDetails = async (id) => {
        try {
            const response = await Requests.Customer.ShowCustomer(id)
            if (response.status === 200) {
                setCustomerDetails(response.data.data)
            }

        } catch (error) {
            if (error) {
            }
        }
    }


    // for submitting form
    const onSubmit = async (data) => {
        props.setShow(false)
        const busket = []
        const installment = []
        props.busketproduct && props.busketproduct.map((item) =>
            busket.push({
                product_uid: item.value,
                unit_price: item.price,
                quantity: item.quantity,
                warranty_days: isNaN(item.warrenty) ? 0 : item.warrenty
            })
        )
        // for installment
        installmentProd && installmentProd.map((item) =>
            installment.push({
                product_uid: item.product_uid,
                period: item.period ?? 0,
                period_type: item.period_type ?? '',
                down_payment: item.down_payment ?? 0,
                per_installment: item.per_installment ?? 0
            })
        )
        try {
            console.log('buskettotal', totalOtherPrice)
            setLoading(true)
            const formData = {
                customer_uid: data.customer ?? null,
                total_down_payment: downpayment ?? 0,
                busket_total: totalOtherPrice !== 0 ? totalOtherPrice : downpayment ? (downpayment + totalOtherPrice + parseFloat(manufacturing_cost)) - discountAmount : (countPrice() + parseFloat(manufacturing_cost)) - discountAmount ,
                total_price: !previousdue ? downpayment ? (downpayment + totalOtherPrice + parseFloat(manufacturing_cost)) - discountAmount : (countPrice() + parseFloat(manufacturing_cost)) - discountAmount : downpayment ? (downpayment + totalOtherPrice + parseFloat(dues) +  parseFloat(manufacturing_cost)) - discountAmount : (countPrice() + parseFloat(dues) + parseFloat(manufacturing_cost)) - discountAmount,
                manufacturing_cost: manufacturing_cost ?? 0,
                amount_paid: payableamount ?? 0,
                add_prev_due: previousdue ?? null,
                discount: discountAmount ?? 0,
                special_discount: ignoreDue ?? 0,
                payment_method: paymentOption ?? null,
                order_due: previousdue ? 0 : recentDue - discountAmount ?? 0,
                busket: busket ?? null,
                installment: installment ?? null,
                note: data.note,
            }


            const response = await Requests.POS.CreatePos(formData)
            if (response.status === 201) {
                localStorage.removeItem(`dokan/${localStorage.getItem('dokanuid')}`)
                props.handleQuantity()
                Toastify.Success("Successfully Bought Product")
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    }


    return (
        <div className="busket-help-drawer-container">
            <div className={props.show ? "backdrop open-backdrop" : "backdrop"}
                onClick={props.onHide}
            />
            {/* Drawer */}
            <div className={props.show ? "drawer open-drawer pl-2 pt-2" : "drawer"}>
                <div className="drawer-header ">
                    <GrayButton
                        onClick={props.onHide}
                        style={{ borderRadius: "50%", padding: "8px 10px" }}
                    ><X size={18} /></GrayButton>
                </div>
                <div className="drawer-body drawer-wrapper-scroll-y drawer-custom-scrollbar">
                    {qnt <= 0 ? <>
                        <Container.Fluid>
                            <Container.Column>
                                <EmptyCart message="No Product In Busket" />
                            </Container.Column>
                        </Container.Fluid>
                    </> :
                        <Container.Fluid>
                            <Container.Row>
                                <Container.Column className="col-lg-12">

                                    {errors.customer && errors.customer.message ?
                                        <Text className="text-danger fs-13 mb-1">{errors.customer && errors.customer.message} <span className="text-danger ">*</span> <span className="brand-add" onClick={() => { setCustomerModal(true); props.setShow(false) }}> / {t("Add Customer")}</span></Text>
                                        : <Text className="fs-13 mb-0">{t("Customer")} <span className="text-danger ">*</span><span className="brand-add" onClick={() => { setCustomerModal(true); props.setShow(false) }}> / {t("Add Customer")}</span></Text>}
                                    <Controller
                                        name="customer"
                                        control={control}
                                        rules={{ required: t('Customer is Required') }}
                                        render={({ field }) => <SingleSelect
                                            error={errors.customer}
                                            options={customer}
                                            placeholder={t('Select Customer')}
                                            value={event => { setValue('customer', event.value); fetchCustomerDetails(event.value) }}
                                        />}
                                    />

                                    <div className='mt-2'>
                                        <Text className="fs-14 mb-0 borderless">Products</Text>
                                        <CartProducts handleQuantity={props.handleQuantity} handleChangeInputBusket={props.handleChangeInputBusket} />
                                    </div>

                                    <div className="pt-2">
                                        <Form.Check
                                            custom
                                            type="checkbox"
                                            id={`custom-2`}
                                            className='user-select-none font-weight-bold'
                                            label={t("Any product available for Installment/EMI")}
                                            value={true}
                                            style={{ fontSize: 14, paddingTop: "2px", zIndex: 0 }}
                                            onChange={() => setInstallment(!installment)}
                                        />
                                    </div>
                                    {installment ?
                                        <div className='pt-2'>
                                            <Text className="fs-15 mb-0 borderless">Products For Installment</Text>
                                            <div className='d-flex justify-content-start'>
                                                {installmentProd && installment && installmentProd.map((item, i) =>
                                                    item.product_name ?
                                                        <div className='mr-2 p-1 alert alert-success' key={i}>
                                                            {item.product_name}
                                                        </div> : null
                                                )}
                                            </div>
                                        </div> : null}
                                    {installment && !removeloading ?
                                        installmentProd.map((item, index) => installmentshow ?
                                            <div className="pt-2" key={index}>
                                                <div className="pt-2">
                                                    <div className="font-weight-normal fs-14 m-0 d-flex justify-content-between"><div style={{ position: "relative", top: "10px" }}>Select Product</div> <DangerButton className="p-1 mb-1 rounded-circle"><X size={20} onClick={() => installmentProd.length > 0 ? handleRemoveInstallment(item, item.id) : null} /></DangerButton> </div>
                                                    <SingleSelect
                                                        options={item.id && !item.product_uid ? product : []}
                                                        placeholder={t('Product')}
                                                        deafult={item ? { label: item.product_name, value: item.product_uid } : null}
                                                        value={event => handleChangeInputInstallment(item.id, event, "product_uid")}
                                                    />
                                                </div>
                                                <div className='row'>
                                                    <div className="pt-2 col-lg-6">
                                                        <Text className="font-weight-normal fs-14 m-0">Installment Period</Text>
                                                        <div className="input-group">
                                                            <select className='form-control shadow-none'
                                                                value={item.period}
                                                                onChange={(event) => handleChangeInputInstallment(item.id, event, "period")}
                                                            >
                                                                {installmentPeriod && installmentPeriod.map((item, index) =>
                                                                    <option
                                                                        key={index}
                                                                        value={item.value}
                                                                    >{item.label}</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 col-lg-6">
                                                        <Text className="font-weight-normal fs-14 m-0">Installment Period Type</Text>
                                                        <div className="input-group">
                                                            <select className="form-control shadow-none"
                                                                onChange={(event) => handleChangeInputInstallment(item.id, event, "period_type")}
                                                                value={item.period_type}
                                                            >
                                                                {installmentdata && installmentdata.map((item, i) =>
                                                                    <option
                                                                        key={i}
                                                                        value={item.value}
                                                                    >{item.label}</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Text className="font-weight-normal fs-14 m-0">Down Payment</Text>
                                                    <input type="number" step="0.1" className="form-control shadow-none" value={item.down_payment} placeholder="Down Payment" onChange={event => handleChangeInputInstallment(item.id, event, "down_payment")} />
                                                </div>
                                                <div className='pt-2 d-flex justify-content-start'>
                                                    <Text className="fs-14">Per Installment Amount: </Text>
                                                    <Text className="fs-14 pl-1">{installmentProd.find(item2 => item2.id === item.id).per_installment ?? "0"} Tk</Text>
                                                </div>
                                                <hr />
                                            </div> : null
                                        )
                                        : null}
                                    {installment ?
                                        <div className='pt-2'>
                                            <PrimaryButton onClick={() => installmentProd.length === props.product.length ? null : handleAddInstallment(uuidv4())}>
                                                <Plus size={20} /> {installmentProd.length > 0 ? "Add more for installment" : "Add New Product for installment"}
                                            </PrimaryButton>
                                            <PrimaryButton className="ml-2 rounded-circle" onClick={() => setInstallmentShow(!installmentshow)}>
                                                {installmentshow === true ?
                                                    <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </PrimaryButton>

                                        </div> : null}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <hr />
                                        <div className="pt-2">
                                            <Text className="font-weight-normal fs-14 m-0">Manufacturing Cost </Text>
                                            <InputGroup
                                                append='Tk'
                                            >
                                                <input type="number" className="form-control shadow-none" placeholder="Manufacturing cost" onChange={event => event.target.value ? setManufacturingCost(event.target.value) : 0} />
                                            </InputGroup>
                                            <div className="pt-2">
                                                <Text className="font-weight-normal fs-14 m-0">Discount Amount</Text>
                                                <InputGroup
                                                    append='Tk'
                                                >
                                                    <input type="text" className="form-control shadow-none" placeholder="Discount Amount" onChange={(event) => { setDiscountAmount(event.target.value) }} />
                                                </InputGroup>
                                            </div>
                                            <div className='d-flex justify-content-between pt-2'>
                                                <Text className="fs-14 mb-0">Previous Due: {previousdue === false && customerdetails.total_due !== undefined && customerdetails.total_due !== null ? customerdetails.total_due : "0"} Tk</Text>
                                            </div>
                                            <div className="pt-0">
                                                <div className="fs-15 font-weight-normal alert-link mb-0">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id={`custom-3`}
                                                        label={`Do you want add previous due?`}
                                                        value={!previousdue}
                                                        style={{ fontSize: 14, paddingTop: "2px" }}
                                                        onChange={() => { setPreviousDue(!previousdue); setDues(previousdue === false && customerdetails.total_due !== undefined && customerdetails.total_due !== null ? customerdetails.total_due : "0") }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <hr />
                                        <Container.Row>
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14 mb-0">Total Quantity:</Text>
                                                <Text className="fs-14 mb-0">{quantity ?? 0}</Text>
                                            </div>
                                            {downpayment > 0 ? 
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14  mb-0">Total down payment:</Text>
                                                <Text className="fs-14 mb-0">{isNaN(downpayment) ? 0 : downpayment} Tk</Text>
                                            </div>: null}
                                            {totalOtherPrice > 0 ? 
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14 mb-0">Total Busket price:</Text>
                                                <Text className="fs-14 mb-0">{installmentProd.length ? isNaN(totalOtherPrice) ? 0 : totalOtherPrice : 0} Tk</Text>
                                            </div> : null}
                                            {manufacturing_cost > 0 ? 
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14 mb-0">Total Manufacturing Cost:</Text>
                                                <Text className="fs-14 mb-0">{parseFloat(manufacturing_cost) ?? 0} Tk</Text>
                                            </div> : null}
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14 mb-0">Discount Amount:</Text>
                                                <Text className="fs-14 mb-0">(-){parseFloat(discountAmount) ?? 0} Tk</Text>
                                            </div>
                                        </Container.Row>
                                        <hr />
                                        <Container.Row>
                                            <div className='d-flex justify-content-between col-12'>
                                                <Text className="fs-14 mb-0 font-weight-bold">Total Price:</Text>
                                                <Text className="fs-14 mb-0 font-weight-bold">{downpayment ? (downpayment + totalOtherPrice + parseFloat(manufacturing_cost)) - discountAmount : (countPrice() + parseFloat(manufacturing_cost)) - discountAmount} Tk</Text>
                                            </div>
                                            <hr />
                                            {!previousdue ? null :
                                                <>
                                                    <div className='d-flex justify-content-between col-12'>
                                                        <Text className="fs-14 mb-0">Total Previous Due:</Text>
                                                        <Text className="fs-14 mb-0">{dues ?? 0} Tk</Text>
                                                    </div>
                                                    <hr />
                                                    <div className='d-flex justify-content-between col-12'>
                                                        <Text className="fs-14 mb-0 font-weight-bold">Grand Price:</Text>
                                                        <Text className="fs-14 mb-0 font-weight-bold">{downpayment ? downpayment + totalOtherPrice + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount : countPrice() + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount} Tk</Text>
                                                    </div>
                                                </>}
                                        </Container.Row>
                                        <hr />


                                        <div className="pt-2">

                                            <Text className="font-weight-normal fs-14 m-0">Amount To Pay <span className="text-danger">*</span> </Text>
                                            {previousdue ?
                                                <InputGroup
                                                    append='Tk'
                                                >
                                                    <input type="number" className="form-control shadow-none" required placeholder="Amount To Pay" min={downpayment ? (downpayment + totalOtherPrice + parseFloat(manufacturing_cost)) - discountAmount + 1 : (countPrice() + parseFloat(manufacturing_cost)) - discountAmount + 1} max={downpayment ? downpayment + totalOtherPrice + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount : countPrice() + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount} onChange={(event) => { setAmount(event.target.value); setRecentDue((downpayment ? downpayment + totalOtherPrice + parseFloat(dues) + parseFloat(manufacturing_cost) : countPrice() + parseFloat(dues) + parseFloat(manufacturing_cost)) - event.target.value) }} />
                                                </InputGroup> :
                                                <InputGroup
                                                    append='Tk'
                                                >
                                                    <input type="number" className="form-control shadow-none" required placeholder="Amount To Pay" onChange={(event) => { setAmount(event.target.value); setRecentDue((downpayment ? downpayment + totalOtherPrice + parseFloat(manufacturing_cost) : countPrice() + parseFloat(manufacturing_cost)) - event.target.value) }} />
                                                </InputGroup>}
                                            {console.log(countPrice())}
                                        </div>

                                        <div className="pt-2">
                                            <Text className="font-weight-normal fs-14 m-0">Payment Option</Text>
                                            <FormGroup className="mb-0">
                                                <select
                                                    className="form-control shadow-none"
                                                    name="paymentoption"
                                                    onChange={(event) => setPaymentOption(event.target.value)}
                                                    required
                                                >
                                                    {payment && payment.map((item, i) =>
                                                        <option
                                                            key={i}
                                                            value={item.value}
                                                        >{item.label}</option>
                                                    )}
                                                </select>
                                            </FormGroup>
                                        </div>

                                        <div className="pt-1">
                                            {!previousdue ? <Text className="fs-14 font-weight-normal "> Current Dues: {!ignoreDue ? (recentDue ? recentDue - discountAmount : (downpayment ? (downpayment + totalOtherPrice + parseFloat(manufacturing_cost) - discountAmount) - payableamount: (countPrice()  + parseFloat(manufacturing_cost)) - discountAmount) - payableamount) : 0} Tk</Text>: 
                                                <Text className="fs-14 font-weight-normal "> Current Dues: {!ignoreDue ? (recentDue ? recentDue - discountAmount : (downpayment ? (downpayment + totalOtherPrice + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount) - payableamount : (countPrice() + parseFloat(dues)  + parseFloat(manufacturing_cost)) - discountAmount) - payableamount) : 0} Tk</Text>}
                                            
                                            {console.log(!ignoreDue ? (recentDue ? recentDue - discountAmount : (downpayment ? (downpayment + totalOtherPrice + parseFloat(dues) + parseFloat(manufacturing_cost) - discountAmount) - payableamount : (countPrice() + parseFloat(dues) + parseFloat(manufacturing_cost)) - discountAmount) - payableamount) : 0)}
                                            {previousdue ? null :
                                                <>
                                                    <Text className="fs-14 font-weight-normal mb-0">Ignore Due?</Text>
                                                    <div className="">
                                                        <Form.Check
                                                            custom
                                                            type="checkbox"
                                                            id={`custom-1`}
                                                            label={t("Check this to consider due as special discount")}
                                                            value={ignoreDue}
                                                            style={{ fontSize: 14, paddingTop: "2px" }}
                                                            onChange={() => setIgnoreDue(!ignoreDue)}
                                                        />
                                                    </div>
                                                </>}
                                        </div>
                                        {/* Description */}
                                        <FormGroup>
                                            <Text className="fs-13 mb-0">{t('Note')}</Text>
                                            <textarea
                                                rows={3}
                                                className="form-control shadow-none"
                                                placeholder={t("Enter Note")}
                                                {...register("note")}
                                            />
                                        </FormGroup>
                                        <hr />


                                        <div className="text-right">
                                            <PrimaryButton
                                                type="submit"
                                                className="px-4"
                                                disabled={loading}
                                            >
                                                <span> <CreditCard size={18} /> {loading ? t("Processing Order ...") : t("Process Order")}</span>
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </Container.Column>
                            </Container.Row>
                        </Container.Fluid>
                    }
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

        </div>
    )
}

export { Busket }
