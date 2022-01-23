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

export const ServicingOurProduct = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm()
  const [mechanic, setMechanic] = useState(null)
  const partsData = props.partsData ? props.partsData : []
  const productData = props.productData ? props.productData : []
  const data = props.editData ? props.editData : {}
  const [totalCost, setTotalCost] = useState(null)
  const [customerName, setCustomerName] = useState(null)
  const [warranty, setWarranty] = useState(null)
  const [productModel, setProductModel] = useState([])
  const [productName, setProductName] = useState([])
  const [deliveryDate, setDeliveryDate] = useState(data && data.deliveryDate ? data.deliveryDate : new Date())
  const [show, setShow] = useState({
    customer: false,
    mechanic: false,
    loading: false
  })

  useEffect(() => {
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
    if (!customerName) {
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
      customer_uid: customerName,
      mechanic_uid: mechanic,
      total_cost: totalCost,
      dokan_uid: localStorage.getItem("dokanuid"),
      delivery_date: deliveryDate,
      warranty: warranty
    }

    if (customerName) clearErrors("customer_uid")
    if (customerName && mechanic) {
      console.log(formData);
      // props.onSubmit(formData)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container.Row>

          {/* Product order no or invoice no */}
          <Container.Column className="col-lg-6">
            <FormGroup>
              {errors.product_no && errors.product_no.message ?
                <Text className="text-danger fs-13 mb-1">{errors.product_no && errors.product_no.message}</Text>
                : <Text className="fs-13 mb-1">{t('Product Order No. / Invoice No.')} </Text>}
              <SingleSelect
                placeholder="product order or invoice number"
                options={productData}
                deafult={data && data.productData ?
                  {
                    label: data.productData.label,
                    value: data.productData.value
                  } : null
                }

                value={event => {
                  setValue('product_no', event.value)
                  setCustomerName(event.customer_name)
                  setProductName(event.product_name)
                  setWarranty(event.warranty)
                }}
              />
            </FormGroup>
          </Container.Column>

          {/* Parts order no or invoice no */}
          <Container.Column className="col-lg-6">
            <FormGroup>
              {errors.invoice_no && errors.invoice_no.message ?
                <Text className="text-danger fs-13 mb-1">{errors.invoice_no && errors.invoice_no.message}</Text>
                : <Text className="fs-13 mb-1">{t('Parts Order No. / Invoice No.')} </Text>}
              <SingleSelect
                placeholder="parts order or invoice number"
                options={partsData}
                deafult={data && data.parts ?
                  {
                    label: data.parts.label,
                    value: data.parts.uid
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
                  {/* <span className="text-primary cursor-pointer"
                    onClick={() => setShow({ ...show, customer: true })}
                  > / ADD CUSTOMER</span> */}
                </Text> :
                <Text className="text-capitalize fs-13 mb-1">{t('Customer')}
                  {/* <span className="text-primary cursor-pointer"
                    onClick={() => setShow({ ...show, customer: true })}
                  > / ADD CUSTOMER</span> */}
                  <span className="text-danger"> *</span>
                </Text>
              }

              <input
                type="text"
                className={errors.customer_uid ? "form-control shadow-none error" : "form-control shadow-none"}
                placeholder={t("Customer")}
                value={customerName ? customerName : ""}
                {...register("customer_uid")}
                disabled
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

              <SingleSelect
                placeholder="product order or invoice number"
                options={productName}
                deafult={data && data.productData && data.productData.productName ?
                  {
                    label: data.productData.productName.label,
                    value: data.productData.productName.value
                  } : null
                }

                value={event => {
                  setValue('product_name', event.value)
                  setProductModel(event.product_model)
                }}
              />
            </FormGroup>
          </Container.Column>

          {/* Product model */}
          <Container.Column className="col-lg-6">
            <FormGroup>
              {errors.product_model && errors.product_model.message ?
                <Text className="text-danger fs-13 mb-1">{errors.product_model && errors.product_model.message}</Text> :
                <Text className="text-capitalize fs-13 mb-1">{t('Product model')}<span className="text-danger"> *</span></Text>
              }

              {/* <input
                type="text"
                className={errors.product_model ? "form-control shadow-none error" : "form-control shadow-none"}
                placeholder={t("Enter product model")}
                defaultValue={props.data ? props.data.product_model : null}
                {...register("product_model", {
                  required: t("Product model is required")
                })}
              /> */}

              <SingleSelect
                placeholder="product order or invoice number"
                options={productModel}
                deafult={data && data.productData && data.productData.productName && data.productData.productName.productModel ?
                  {
                    label: data.productData.productName.productModel.label,
                    value: data.productData.productName.productModel.value
                  } : null
                }

                value={event => {
                  setValue('product_model', event.value)
                  // setProductModel(event)
                }}
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
                defaultValue={data && data.mechanic ?
                  {
                    label: data.mechanic.label,
                    value: data.mechanic.value
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

          {/* Warranty */}
          <Container.Column className="col-lg-6">
            <FormGroup>
              {errors.warranty && errors.warranty.message ?
                <Text className="text-danger fs-13 mb-1">{errors.warranty && errors.warranty.message}</Text> :
                <Text className="text-capitalize fs-13 mb-1">{t('Warranty (days)')}</Text>
              }

              <input
                type="number"
                className={errors.warranty ? "form-control shadow-none error" : "form-control shadow-none"}
                placeholder="Warranty"
                min={0}
                value={warranty ? warranty : 0}
                {...register("warranty")}
                disabled
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
