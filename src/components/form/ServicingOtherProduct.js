import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { Container } from '../container/Index'
import { PrimaryButton } from '../button/Index'
import { SearchableSelect, SingleSelect } from '../select/Index'
import { PrimaryModal } from '../modal/PrimaryModal'
import { CustomerForm } from './CustomerForm'
import { Mechanic } from './Mechanic'
import { DatePicker } from '../datePicker/Index'
import { Requests } from '../../utils/Http/Index'
import { Toastify } from '../toastify/Toastify'

export const ServicingOtherProduct = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm()
    const data = props.editData ? props.editData : {}
    const partsData = props.partsData ? props.partsData : []
    const [customer, setCustomer] = useState(null)
    const [mechanic, setMechanic] = useState(null)
    const [deliveryDate, setDeliveryDate] = useState(data && data.deliveryDate ? data.deliveryDate : new Date())
    const [totalCost, setTotalCost] = useState(null)
    const [show, setShow] = useState({
        customer: false,
        mechanic: false,
        loading: false
    })

    useEffect(() => {
        if (props.data && props.data.customer) setCustomer(props.data.customer.uid)
        if (props.data && props.data.mechanic) setMechanic(props.data.mechanic.uid)
    }, [props])

    // Handle customer creation
    const handleCustomerCreation = async (data) => {
        try {
            setShow({ ...show, loading: true })
            const response = await Requests.Customer.AddCustomer(data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }
            setShow({ ...show, customer: false, loading: false })
        } catch (error) {
            if (error) {
                setShow({ ...show, loading: false })
                Toastify.Success("Network Error!!!")
            }
        }
    }

    // Handle customer search
    const handleCustomerSearch = async (data) => {
        try {
            const results = []
            const response = await Requests.Customer.CustomerSearch(data)
            if (response && response.status === 200) {
                if (response.data && response.data.data && response.data.data.length) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        const element = response.data.data[i]
                        results.push({
                            label: element.name,
                            value: element.uid,
                            name: element.name,
                            image: element.image
                        })
                    }
                }
                return results
            }
        } catch (error) {
            if (error) return []
        }
    }

    // Handle mechanic creation
    const handleMechanicCreation = async (data) => {
        try {
            setShow({ ...show, loading: true })
            const response = await Requests.Mechanic.Store(data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }
            setShow({ ...show, mechanic: false, loading: false })
        } catch (error) {
            if (error) {
                setShow({ ...show, loading: false })
                Toastify.Success("Network Error!!!")
            }
        }
    }

    // Handle mechanic search
    const handleMechanicSearch = async (data) => {
        try {
            const results = []
            const response = await Requests.Mechanic.Search(data)
            if (response && response.status === 200) {
                if (response.data && response.data.data && response.data.data.length) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        const element = response.data.data[i]
                        results.push({
                            label: element.name,
                            value: element.uid,
                            name: element.name,
                            image: element.image
                        })
                    }
                }
                return results
            }
        } catch (error) {
            if (error) return []
        }
    }

    // Submit Form
    const onSubmit = async (data) => {
        if (!customer) {
            setError("customer_uid", {
                type: "manual",
                message: "Select customer"
            })
        }

        if (!mechanic) {
            setError("mechanic_uid", {
                type: "manual",
                message: "Select mechanic"
            })
        }

        if (!deliveryDate) {
            setError("delivery_date", {
                type: "manual",
                message: "Delivery date is required"
            })
        }

        const formData = {
            ...data,
            customer_uid: customer,
            mechanic_uid: mechanic,
            total_cost: totalCost,
            dokan_uid: localStorage.getItem("dokanuid"),
            delivery_date: deliveryDate
        }

        if (customer && mechanic) {
            console.log(formData);
            // props.onSubmit(formData)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Parts order no or invoice no */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.invoice_no && errors.invoice_no.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.invoice_no && errors.invoice_no.message}</Text>
                                : <Text className="fs-13 mb-1">{t('Parts Order No. / Invoice No.')} </Text>}
                            <SingleSelect
                                placeholder="parts order or invoice number"
                                options={partsData}
                                deafult={data && data.partsData ?
                                    {
                                        label: data.partsData.label,
                                        value: data.partsData.value
                                    } : null
                                }

                                value={event => {
                                    setValue('invoice_no', event.value)
                                    setTotalCost(event.total_cost)
                                }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Customer */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.customer_uid && errors.customer_uid.message ?
                                <Text className="text-danger fs-13 mb-1">
                                    {errors.customer_uid && errors.customer_uid.message}
                                    <span className="text-primary cursor-pointer"
                                        onClick={() => setShow({ ...show, customer: true })}
                                    > / ADD CUSTOMER</span>
                                </Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Customer')}
                                    <span className="text-primary cursor-pointer"
                                        onClick={() => setShow({ ...show, customer: true })}
                                    > / ADD CUSTOMER</span>
                                    <span className="text-danger"> *</span>
                                </Text>
                            }

                            <SearchableSelect
                                borderRadius={4}
                                placeholder={t("Select customer")}
                                defaultValue={data && data.customer ?
                                    {
                                        label: data.customer.label,
                                        value: data.customer.value
                                    } : null
                                }
                                search={handleCustomerSearch}
                                values={data => {
                                    setCustomer(data.value)
                                    clearErrors('customer_uid')
                                }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Product name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.product_name && errors.product_name.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.product_name && errors.product_name.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Product name')}<span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="text"
                                className={errors.product_name ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter product name")}
                                defaultValue={data ? data.product_name : null}
                                {...register("product_name", {
                                    required: t("Product name is required")
                                })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Product model */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.product_model && errors.product_model.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.product_model && errors.product_model.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Product model')}</Text>
                            }

                            <input
                                type="text"
                                className={errors.product_model ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter product model")}
                                defaultValue={data ? data.product_model : null}
                                {...register("product_model")}
                            />
                        </FormGroup>
                    </Container.Column>


                    {/* Mechanic */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.mechanic_uid && errors.mechanic_uid.message ?
                                <Text className="text-danger fs-13 mb-1">
                                    {errors.mechanic_uid && errors.mechanic_uid.message}
                                    {/* <span className="text-primary cursor-pointer"
                                        onClick={() => setShow({ ...show, mechanic: true })}
                                    > / ADD MECHANIC</span> */}
                                </Text> :
                                <Text className="text-capitalize fs-13 mb-1">
                                    {t('Mechanic')}
                                    {/* <span className="text-primary cursor-pointer"
                                        onClick={() => setShow({ ...show, mechanic: true })}
                                    > / ADD MECHANIC</span> */}
                                    <span className="text-danger"> *</span>
                                </Text>
                            }

                            <SearchableSelect
                                borderRadius={4}
                                placeholder={t("Select mechanic")}
                                defaultValue={props.data && props.data.mechanic ?
                                    {
                                        label: props.data.mechanic.name,
                                        value: props.data.mechanic.uid
                                    } : null
                                }
                                search={handleMechanicSearch}
                                values={data => {
                                    setMechanic(data.value)
                                    clearErrors('mechanic_uid')
                                }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Total cost */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.total_cost && errors.total_cost.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.total_cost && errors.total_cost.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Total cost')}</Text>
                            }

                            <input
                                type="number"
                                className={errors.total_cost ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Purchase price"
                                min={0}
                                value={totalCost ? totalCost : 0}
                                {...register("total_cost")}
                                disabled
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Service Fee */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.service_fee && errors.service_fee.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.service_fee && errors.service_fee.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Service Fee')}</Text>
                            }

                            <input
                                type="number"
                                className={errors.service_fee ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Service fee"
                                min={0}
                                defaultValue={data ? data.service_fee : null}
                                {...register("service_fee")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Total Fee */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.total_fee && errors.total_fee.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.total_fee && errors.total_fee.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Total Fee')}</Text>
                            }

                            <input
                                type="number"
                                className={errors.total_fee ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Total fee"
                                min={0}
                                defaultValue={data ? data.total_fee : null}
                                {...register("total_fee")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Advance  */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.advance && errors.advance.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.advance && errors.advance.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Advance')}</Text>
                            }

                            <input
                                type="number"
                                className={errors.advance ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Advance amount"
                                min={0}
                                defaultValue={data ? data.advance : null}
                                {...register("advance")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Delivery date */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.delivery_date && errors.delivery_date.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.delivery_date && errors.delivery_date.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Delivery date')}<span className="text-danger"> *</span></Text>
                            }

                            <DatePicker
                                selected={data => setDeliveryDate(data)}
                                deafultValue={deliveryDate}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Submit button */}
                    <Container.Column className="text-right">
                        <PrimaryButton className="px-4" disabled={props.isLoading}>
                            {props.isLoading ? t("LOADING...") : t("SUBMIT")}
                        </PrimaryButton>
                    </Container.Column>
                </Container.Row>
            </form>


            {/* Customer create modal */}
            <PrimaryModal
                title={t('Create Customer')}
                show={show.customer}
                size="lg"
                onHide={() => setShow({ ...show, customer: false, loading: false })}
            >
                <CustomerForm
                    create={true}
                    loading={show.loading}
                    submit={data => handleCustomerCreation(data)}
                />
            </PrimaryModal>

            {/* Mechanic create modal */}
            <PrimaryModal
                title={t('Create Mechanic')}
                show={show.mechanic}
                size="lg"
                onHide={() => setShow({ ...show, mechanic: false, loading: false })}
            >
                <Mechanic
                    create={true}
                    isLoading={show.loading}
                    onSubmit={data => handleMechanicCreation(data)}
                />
            </PrimaryModal>
        </div>
    );
};
