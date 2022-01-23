import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { useHistory } from 'react-router'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { SingleSelect } from '../select/Index'
import { Text } from '../text/Text'
import { DatePicker } from '../datePicker/Index'
import { PrimaryModal } from '../modal/PrimaryModal'
import { SupplierForm } from './SupplierForm'
import { Toastify } from '../toastify/Toastify'
import { dateFormat2, BatchIdGenerator } from '../../utils/_heplers'

const StockOutForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const history = useHistory()

    const [show_supplier_modal, setShowSupplierModal] = useState(false);
    const quantity = register('quantity', { required: t("Quantity Field is Required") })

    const [date, setDate] = useState(new Date());

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)



    // Submit Form
    const onSubmit = data => {
        const formData = new FormData()
        formData.append('batch_id', data.batch_id)
        formData.append('product', data.product)
        formData.append('quantity', data.quantity)
        formData.append('stock_out_date', dateFormat2(date))
        formData.append('dokan_uid', localStorage.getItem("dokanuid"))
        props.submit(formData)
        console.log(...formData)

    }

    // handle quantity
    const handleQuantiyChange = (e) => {
        setValue('quantity', e.target.value, { shouldValidate: true })
        const codes = [];
        for (let i = 0; i < parseInt(e.target.value); i++) {
            codes.push('');
        }
    }


    // handle supplier create
    const handleSupplierCreate = async data => {
        setLoading(true)
        const newdata = {
            ...data,
            dokan_uid: localStorage.getItem('dokanuid')
        }
        try {
            const res = await Requests.Inventory.Supplier.DokanSupplierAdd(newdata)
            if (res.status === 201) {

                Toastify.Success(t('Supplier Created Successfully'))
            } else {

                Toastify.Error(t('Something went wrong'))
            }
            props.fetchSuppliers()
            setLoading(false)
            setShowSupplierModal(false)
        } catch (error) {
            if (error.response.status === 422) {
                Toastify.Error("Supplier Can't be created")
            } else {
                Toastify.Error("Network Error Occured.")
            }
            setLoading(false)
            setShowSupplierModal(false)

        }
    }


    // handle product change
    const handleProductChange = async (data) => {
        try {
            const response = await Requests.Inventory.Product.DokanSingleProductShow(data)
            if (response.status === 200 && response.data) {
                setData(response.data)
                setValue('product', response.data.data.uid)
                setValue('supplier', response.data.data.supplier_uid)
            }
        } catch (error) {
            setValue(null)
        }
    }



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Batch Id */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.batch_id && errors.batch_id.message ?
                                <Text className="text-danger fs-13 mb-0">{errors.batch_id && errors.batch_id.message}</Text>
                                : <Text className="fs-13 mb-0">Batch ID ? <span className="text-danger">*</span></Text>}

                            <input
                                type="text"
                                className={errors.batch_id ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Enter Batch Id"
                                defaultValue={BatchIdGenerator()}
                                {...register("batch_id", { required: "Batch Id is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.product && errors.product.message ?
                                <Text className="text-danger fs-13 mb-0">{errors.product && errors.product.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Product")} <span className="brand-add" onClick={() => history.push('/dashboard/inventory/product/new')}> / {t("Add Product")}</span></Text>}


                            <SingleSelect
                                error={errors.product}
                                placeholder="a product"
                                options={props.products}
                                value={event => handleProductChange(event.value)}
                            />

                        </FormGroup>
                    </Container.Column>




                    {data && data.data ?
                        <>
                            {/* Quantity */}
                            <Container.Column className="col-lg-6">
                                <FormGroup>
                                    {errors.quantity && errors.quantity.message ?
                                        <Text className="text-danger fs-13 mb-0">{errors.quantity && errors.quantity.message}</Text>
                                        : <Text className="fs-13 mb-0">{t(`Quantity(${data.data.quantity ? data.data.quantity.toString() : '0'})`)} <span className="text-danger">*</span></Text>}

                                    <input
                                        type="number"
                                        className={errors.quantity ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Enter number of product")}
                                        onChange={handleQuantiyChange}
                                        ref={quantity.ref}
                                    />
                                </FormGroup>
                            </Container.Column>

                            {/* Date Time */}
                            <Container.Column className="col-lg-6">
                                <FormGroup>
                                    <Text className="fs-13 mb-0">Date</Text>
                                    <DatePicker
                                        selected={data => setDate(data)}
                                        deafultValue={date}
                                    />
                                </FormGroup>
                            </Container.Column>

                            <Container.Column className="text-right">
                                <PrimaryButton
                                    type="submit"
                                    className="px-4"
                                    disabled={props.loading}
                                >
                                    <span>{props.loading ? "Stock Out ..." : "Stock Out"}</span>
                                </PrimaryButton>
                            </Container.Column>
                        </> : null}
                </Container.Row>
            </form>


            {/* Create Supplier modal */}
            <PrimaryModal
                show={show_supplier_modal}
                onHide={() => setShowSupplierModal(false)}
                title="Create Supplier"
                size="xl"
            >
                <SupplierForm
                    submit={handleSupplierCreate}
                    loading={loading}
                    create={true}
                />
            </PrimaryModal>

        </>
    );

}

export default StockOutForm;