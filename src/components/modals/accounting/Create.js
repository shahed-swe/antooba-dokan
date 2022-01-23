import React from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GrayButton, PrimaryButton } from '../../button/Index'

const Create = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = data => {
        const formData = {
            ...data,
        }

        props.submit(formData)
    }

    return (
        <Modal
            show={props.show}
            size="lg"
            centered
            className="custom-modal"
            onHide={props.onHide}
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">{t('Create Ledger')}</h6></div>
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
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.name && errors.name.message ?
                                    <small className="text-danger">{errors.name && errors.name.message}</small>
                                    : <small>{t('Name')}</small>}

                                <input
                                    type="text"
                                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter name")}
                                    {...register("name", { required: t("Name is required") })}
                                />
                            </div>
                        </div>

                            {/* Purchase */}
                                <div className="col-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <small>{t('Opening Balance')}</small>

                                        <input
                                            type="number"
                                            className="form-control shadow-none"
                                            placeholder={t("Enter purchase amount")}
                                            {...register("purchase")}
                                        />
                                    </div>
                                </div>
                        </div>


                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={props.loading}
                        >{props.loading ? t("Submitting ...") : t("Submit")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;
