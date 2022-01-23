import React, { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { FileUploader } from '../fileUploader/Index'
import { discount } from '../../utils/data'
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



const StockAddForm = (props) => {
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm()
    const history = useHistory()

    const [show_supplier_modal, setShowSupplierModal] = useState(false);
    const quantity = register('quantity', { required: t("Quantity Field is Required") })

    const [date, setDate] = useState(new Date());

    const [lastpurchaseImage, setLastPurchaseImage] = useState({})
    const [warranty_type, setWarrantyType] = useState(null)
    const [loading, setLoading] = useState(false)
    const [units, setUnits] = useState([])



    const warranties = [
        { label: t("No warranty"), value: "No warranty" },
        { label: t("Days"), value: "Days" },
        { label: t("Monthly"), value: "Monthly" },
        { label: t("Lifetime"), value: "Lifetime" },
    ]



    // Submit Form
    const onSubmit = data => {
        console.log(data.supplier)


        const formData = new FormData()
        formData.append('batch_id', data.batch_id)
        formData.append('supplier', data.supplier)
        formData.append('product', data.product)
        formData.append('purchase_price', data.purchase_price)
        formData.append('selling_price', data.selling_price ?? "")
        formData.append('quantity', data.quantity)
        formData.append('stock_in_date', dateFormat2(date))
        if (warranty_type === "No warranty" || warranty_type === "Lifetime") {
            formData.append('warranty_period', 0)
            formData.append('warranty_type', warranty_type)

        } else {
            formData.append('warranty_type', warranty_type)
            formData.append('warranty_period', data.warranty_period)
        }
        formData.append('purchase_voucher_code_image', lastpurchaseImage.value ?? "")
        formData.append('dokan_uid', localStorage.getItem("dokanuid"))
        formData.append('purchase_voucher_code', data.purchase_voucher_code ?? "")
        // formData.append('unit', data.unit)
        props.submit(formData)

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



    const handleProductChange = async (data) => {
        try {
            
            const response = await Requests.Inventory.Product.DokanSingleProductShow(data)
            if (response.status === 200 && response.data) {
                setData(response.data)
                setValue('product', response.data.data.uid)
                setValue('supplier', response.data.data.supplier_uid)
                setValue('purchase_price', response.data.data.purchase_price)
                setValue('selling_price', response.data.data.selling_price)
                setValue('discount_amount', response.data.data.discount_amount)
                setValue('discount_type', { label: response.data.data.discount_type, value: response.data.data.discount_type })
                setValue('warranty_period', response.data.data.warranty_period)
                setWarrantyType(response.data.data.warranty_type)
            }
        } catch (error) {
            if(error){

            }
        }
    }



    const fetchUnits = useCallback(async () => {
        try {
            const response = await Requests.Settings.AllUnits();
            const response2 = await Requests.Settings.DokanMeasurementsUnits();
            console.log('response', response, response2)

            const units = [];

            response.data.forEach(unit => {
                response2.data.data && response2.data.data.length > 0 ? response2.data.data.forEach(dokanunit => {
                    if (unit.uid === dokanunit.unit_uid) {
                        units.push({ label: unit.title, value: unit.uid });
                    }
                }) : units.push({ label: unit.title, value: unit.uid });
            });
            setUnits(units)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])

    // fetch units
    useEffect(() => {
        fetchUnits()
    }, [fetchUnits])


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



                    {/* Products */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.product && errors.product.message ?
                                <Text className="text-danger fs-13 mb-0">{errors.product && errors.product.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Product")} <span className="brand-add" onClick={() => history.push('/dashboard/inventory/product/new')}> / {t("Add Product")}</span></Text>}


                            <SingleSelect
                                error={errors.product}
                                placeholder="a product"
                                options={props.products}
                                value={event => {
                                    handleProductChange(event.value)
                                }}
                            />

                        </FormGroup>
                    </Container.Column>

                    {data && data.data ?
                        <>
                            {/* Supplier */}
                            <Container.Column className="col-lg-6">
                                <FormGroup>
                                    {errors.supplier && errors.supplier.message ?
                                        <Text className="text-danger fs-13 mb-0">{errors.supplier && errors.supplier.message}</Text>
                                        : <Text className="fs-13 mb-0">{t("Supplier")} <span className="brand-add" onClick={() => setShowSupplierModal(true)}> / {t("Add Supplier")}</span></Text>}
                                    <Controller
                                        name="supplier"
                                        control={control}
                                        rules={{ required: t("Supplier is Required") }}
                                        render={({ field }) => <SingleSelect
                                            error={errors.supplier}
                                            placeholder="a supplier"
                                            options={props.suppliers}
                                            deafult={data.data.supplier ? { label: data.data.supplier.name, value: data.data.supplier.uid } : null}
                                            value={event => setValue('supplier', event.value, { shouldValidate: true })}
                                        />}
                                    />
                                </FormGroup>
                            </Container.Column>



                            {/* Purchase Price */}
                            <Container.Column className="col-lg-6">
                                <FormGroup>
                                    {errors.purchase_price && errors.purchase_price.message ?
                                        <Text className="text-danger fs-13 mb-0">{errors.purchase_price && errors.purchase_price.message}</Text>
                                        : <Text className="fs-13 mb-0">Purchase price <span className="text-danger">*</span></Text>}

                                    <input
                                        type="number"
                                        className={errors.purchase_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder="Purchase price"
                                        {...register("purchase_price", { required: "Purchase price is required" })}
                                    />
                                </FormGroup>
                            </Container.Column>



                            {/* Selling Price */}
                            <Container.Column className="col-lg-6">
                                <FormGroup>
                                    {errors.selling_price && errors.selling_price.message ?
                                        <Text className="text-danger fs-13 mb-0">{errors.selling_price && errors.selling_price.message}</Text>
                                        : <Text className="fs-13 mb-0">Selling price <span className="text-danger">*</span></Text>}

                                    <input
                                        type="number"
                                        className={errors.selling_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder="Selling price"
                                        {...register("selling_price", { required: "Selling price is required" })}
                                    />
                                </FormGroup>
                            </Container.Column>

                            {/* Quantity */}
                            <Container.Column className="col-lg-3">
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

                            {/* Unit */}
                            <Container.Column className="col-lg-3">
                                <FormGroup>
                                    {errors.unit && errors.unit.message ?
                                        <Text className="text-danger fs-13 mb-1">{errors.unit && errors.unit.message}</Text>
                                        : <Text className="fs-13 mb-0">{t('Unit')} <span className="text-danger">*</span></Text>}

                                    <Controller
                                        name="unit"
                                        control={control}
                                        rules={{ required: "Unit is Required" }}
                                        render={({ field }) => <SingleSelect
                                            error={errors.unit}
                                            placeholder="a unit"
                                            options={units}
                                            value={event => setValue('unit', event.value, { shouldValidate: true })}
                                        />}
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

                            {/* Discount */}
                            <Container.Column className="col-lg-3">
                                <FormGroup>
                                    {errors.discount_amount && errors.discount_amount.message ?
                                        <Text className="text-danger fs-13 mb-0">{errors.discount_amount && errors.discount_amount.message}</Text>
                                        : <Text className="fs-13 mb-0">{t("Discount")}</Text>}
                                    <input
                                        type="text"
                                        className={errors.discount_amount ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Discount")}
                                        {...register("discount_amount")}
                                    />

                                </FormGroup>
                            </Container.Column>

                            {/* Discount Type */}

                            <Container.Column className="col-lg-3">
                                <FormGroup>
                                    <Text className="fs-13 mb-0">{t("Discount Type")}</Text>
                                    <SingleSelect
                                        placeholder="discount type"
                                        options={discount}
                                        clear
                                        value={event => {
                                            setValue('discount_type', event.value)
                                        }}
                                        deafult={{ label: data.data.discount_type, value: data.data.discount_type }}
                                    />
                                </FormGroup>
                            </Container.Column>

                            {/* Warrenty Type and Warrenty Time*/}
                            <Container.Column className="col-lg-6">
                                {/* Warrenty Typed */}
                                <FormGroup>
                                    <Text className="fs-13 mb-0">{t("Warranty Type")}</Text>
                                    <SingleSelect
                                        placeholder="warranty type"
                                        options={warranties ? warranties : null}
                                        value={event => 
                                                setWarrantyType(event.value)
                                        }
                                        deafult={{ label: data.data.warranty_type, value: data.data.warranty_type }}
                                    />
                                </FormGroup>
                            </Container.Column>

                            {
                                ((warranty_type === "Days" || warranty_type === "Monthly")) &&
                                <Container.Column className="col-lg-6">
                                    <div className="form-group mb-8">

                                        <Text className="fs-13 mb-0">{t("Warranty Period")}</Text>

                                        <input
                                            type="text"
                                            className={errors.warranty_period ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Warranty Period")}
                                            {...register("warranty_period")}
                                        />
                                    </div>
                                </Container.Column>
                            }

                            {/* Last purchase boucher code */}
                            {warranty_type === "Days" || warranty_type === "Monthly" ?
                                <Container.Column>
                                    <FormGroup>
                                        <Text className="fs-13 mb-0">{t("Purchase Voucher code")}</Text>
                                        <input
                                            type="text"
                                            className={errors.last_purchase_voucher_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Enter voucher code")}
                                            {...register("purchase_voucher_code")}
                                        />
                                    </FormGroup>
                                </Container.Column> : <Container.Column className="col-lg-6">
                                    <FormGroup>
                                        <Text className="fs-13 mb-0">{t("Purchase Voucher code")}</Text>
                                        <input
                                            type="text"
                                            className={errors.last_purchase_voucher_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Enter voucher code")}
                                            {...register("purchase_voucher_code")}
                                        />
                                    </FormGroup>
                                </Container.Column>}

                            {/* Last Purchase Image */}
                            <Container.Column>
                                <FileUploader
                                    imageURL={data.stockin ? data.stockin[0].purchase_voucher_code_image : null}
                                    width={150}
                                    height={150}
                                    limit={100}
                                    title={t("Purchase Voucher Image")}
                                    dataHandeller={(data) => setLastPurchaseImage({ ...lastpurchaseImage, value: data.image || null, error: data.error || null })}
                                />
                            </Container.Column>

                            <Container.Column className="text-right">
                                <PrimaryButton
                                    type="submit"
                                    className="px-4"
                                    disabled={props.loading}
                                >
                                    <span>{props.loading ? "Adding Stock ..." : "Add Stock"}</span>
                                </PrimaryButton>
                            </Container.Column>
                        </>:null}
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

export default StockAddForm;