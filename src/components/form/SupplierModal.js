import React, { useState } from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { GrayButton } from '../button/Index'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import './style.scss'
import { Requests } from '../../utils/Http/Index'
import Toast from '../Toaster/Index'


const Create = (props) => {

    const {t} = useTranslation()
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const [creating, setCreating] = useState(false);
    const {fetchSuppliers} = props;

    const onSubmit = async data => {

        data.dokan_uid = localStorage.getItem('dokanuid');
        setCreating(true);
        const res = await Requests.Inventory.Supplier.DokanSupplierAdd(data)
        if (res.status === 201) {
            setCreating(false);
            Toast.fire({
                icon: 'success',
                title: 'Supplier Added Successfully'
            })

            fetchSuppliers();
        } else {
            setCreating(false);
            if (res.status === 422) {
                Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
                });
            }
        }
    }


    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="xl"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">Create new supplier</h6></div>
                    <div className="ml-auto">
                        <GrayButton
                            type="button"
                            onClick={props.onHide}
                            style={{ padding: "7px 10px", borderRadius: "50%" }}
                        ><X size={16} /></GrayButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">

                        {/* Name */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.name && errors.name.message ?
                                    <small className="text-danger">{errors.name && errors.name.message}</small>
                                    : <small>Name <span className="text-danger">*</span></small>}

                                <input
                                    type="text"
                                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Name"
                                    {...register("name")}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.phone && errors.phone.message ?
                                    <small className="text-danger">{errors.phone && errors.phone.message}</small>
                                    : <small>Phone <span className="text-danger">*</span></small>}

                                <input
                                    type="text"
                                    className={errors.phone ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Phone"
                                    {...register("phone")}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.email && errors.email.message ?
                                    <small className="text-danger">{errors.email && errors.email.message}</small>
                                    : <small>Email <span className="text-danger">*</span></small>}

                                <input
                                    type="text"
                                    className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Email"
                                    {...register("email")}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div className="col-6">
                            <div className="form-group mb-4">
                                {errors.note && errors.note.message ?
                                    <small className="text-danger">{errors.note && errors.note.message}</small>
                                    : <small> {t('Note')} <span className="text-danger">*</span></small>}

                                <textarea
                                    rows={3}
                                    className={errors.note ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter Short Note"
                                    {...register("note")}
                                />
                            </div>
                        </div>


                        {/* Address */}
                        <div className="col-6">
                            <div className="form-group mb-4">
                                {errors.address && errors.address.message ?
                                    <small className="text-danger">{errors.address && errors.address.message}</small>
                                    : <small> {t('Address')} <span className="text-danger">*</span></small>}

                                <textarea
                                    rows={3}
                                    className={errors.address ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Supplier Address"
                                    {...register("address")}
                                />
                            </div>
                        </div>

                        {/* Street Line 1 */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.street_line1 && errors.street_line1.message ?
                                    <small className="text-danger">{errors.street_line1 && errors.street_line1.message}</small>
                                    : <small>Street Line First <span className="text-danger">*</span></small>}

                                <input
                                    type="text"
                                    className={errors.street_line1 ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Street Address 1"
                                    {...register("street_line1")}
                                />
                            </div>
                        </div>

                        {/* Street Line 2 */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.street_line2 && errors.street_line2.message ?
                                    <small className="text-danger">{errors.street_line2 && errors.street_line2.message}</small>
                                    : <small>Street Line Second</small>}

                                <input
                                    type="text"
                                    className={errors.street_line2 ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Street Address 2"
                                    {...register("street_line2")}
                                />
                            </div>
                        </div>

                        {/* ZIP/Post code */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.zip && errors.zip.message ?
                                    <small className="text-danger">{errors.zip && errors.zip.message}</small>
                                    : <small>{t('ZIP / Post code')}</small>}

                                <input
                                    type="text"
                                    className={errors.zip ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="ZIP / Post code"
                                    {...register("zip")}
                                />
                            </div>
                        </div>

                        {/* District / City */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.city && errors.city.message ?
                                    <small className="text-danger">{errors.city && errors.city.message}</small>
                                    : <small>{t('District / City')}</small>}

                                <input
                                    type="text"
                                    className={errors.city ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="District / City"
                                    {...register("city")}
                                />
                            </div>
                        </div>

                        {/* Division / State */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.state && errors.state.message ?
                                    <small className="text-danger">{errors.state && errors.state.message}</small>
                                    : <small>{t('Division / State')}</small>}

                                <input
                                    type="text"
                                    className={errors.state ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Division / State"
                                    {...register("state")}
                                />
                            </div>
                        </div>


                        {/* Country */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.country && errors.country.message ?
                                    <small className="text-danger">{errors.country && errors.country.message}</small>
                                    : <small>{t('Country')}</small>}

                                <input
                                    type="text"
                                    className={errors.country ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Country"
                                    {...register("country")}
                                />
                            </div>
                        </div>


                        {/* Total Purchase */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.total_purchase && errors.total_purchase.message ?
                                    <small className="text-danger">{errors.total_purchase && errors.total_purchase.message}</small>
                                    : <small>Total Purchased <span className="text-danger">*</span></small>}
                                <input
                                    type="text"
                                    className={errors.total_purchase ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total purchase price"
                                    {...register("total_purchase")}
                                />
                            </div>
                        </div>

                        {/* Total Due */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.total_due && errors.total_due.message ?
                                    <small className="text-danger">{errors.total_due && errors.total_due.message}</small>
                                    : <small>Total Due <span className="text-danger">*</span></small>}
                                <input
                                    type="text"
                                    className={errors.total_due ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total due money"
                                    {...register("total_due")}
                                />
                            </div>
                        </div>

                        {/* Total Paid */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.total_paid && errors.total_paid.message ?
                                    <small className="text-danger">{errors.total_paid && errors.total_paid.message}</small>
                                    : <small>Total Paid <span className="text-danger">*</span></small>}
                                <input
                                    type="text"
                                    className={errors.total_paid ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total paid money"
                                    {...register("total_paid")}
                                />
                            </div>
                        </div>

                        {/* Total Advance */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.total_advance_taken && errors.total_advance_taken.message ?
                                    <small className="text-danger">{errors.total_advance_taken && errors.total_advance_taken.message}</small>
                                    : <small>Total Advance Taken <span className="text-danger">*</span></small>}
                                <input
                                    type="text"
                                    className={errors.total_advance_taken ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total advance taken money"
                                    {...register("total_advance_taken")}
                                />
                            </div>
                        </div>



                        <div className="col-12 text-right">
                            <PrimaryButton
                                type="submit"
                                className="px-4"
                                disabled={creating}
                            >
                                {
                                    props.supplier ? 
                                        <span>{creating ? "Updating ..." : "Update"}</span>
                                    :
                                        <span>{creating ? "Creating ..." : "Create"}</span>
                                }
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;