import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {  PrimaryButton } from '../button/Index'
import { PrimaryModal } from '../modal/PrimaryModal'

export const AccoutingCreate = (props) => {
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
        <PrimaryModal
            title="Create Account"
            show={props.show}
            onHide={props.onHide}
            size="xl"
        >
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
        </PrimaryModal>
    );
}

