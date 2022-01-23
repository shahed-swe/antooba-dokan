import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { Container } from '../container/Index'
import { PrimaryButton } from '../button/Index'
import { FileUploader } from '../fileUploader/Index'
import { isValidEmail, isValidPhone } from '../../utils/_heplers'

export const Mechanic = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [images, setImages] = useState({
        nid_front: null,
        nid_back: null,
        image: null
    })

    // Submit Form
    const onSubmit = async (data) => {
        const formData = new FormData()
        if (!props.create) formData.append('_method', "PUT")
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('phone', data.phone)
        formData.append('mechanic_percentage', data.mechanic_percentage)
        formData.append('address', data.address)
        formData.append('nid', data.nid)
        formData.append('note', data.note)
        formData.append('image', images.image)
        formData.append('nid_front', images.nid_front)
        formData.append('nid_back', images.nid_back)

        props.onSubmit(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.name && errors.name.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Name')}<span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="text"
                                className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Mechanic name"
                                defaultValue={props.data ? props.data.name : null}
                                {...register("name", { required: t("Name is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* E-mail */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.email && errors.email.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.email && errors.email.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('E-mail')}</Text>
                            }

                            <input
                                type="text"
                                className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="example@gmail.com"
                                defaultValue={props.data ? props.data.email : null}
                                {...register("email", {
                                    pattern: {
                                        value: isValidEmail(),
                                        message: "Invalid e-mail address"
                                    }
                                })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Phone */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.phone && errors.phone.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.phone && errors.phone.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Phone')}<span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="text"
                                className={errors.phone ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="01XXXXXXXXX"
                                defaultValue={props.data ? props.data.phone : null}
                                {...register("phone", {
                                    required: t("Phone is required"),
                                    pattern: {
                                        value: isValidPhone(),
                                        message: "Invalid phone number"
                                    }
                                })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Percentage */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.mechanic_percentage && errors.mechanic_percentage.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.mechanic_percentage && errors.mechanic_percentage.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Percentage')}<span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="number"
                                className={errors.mechanic_percentage ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Enter amount (%)"
                                defaultValue={props.data ? props.data.mechanic_percentage : null}
                                {...register("mechanic_percentage", { required: t("Percentage is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Address */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.address && errors.address.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.address && errors.address.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Address')}</Text>
                            }

                            <input
                                type="text"
                                className={errors.address ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="Your address"
                                defaultValue={props.data ? props.data.address : null}
                                {...register("address")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* NID */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.nid && errors.nid.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.nid && errors.nid.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('NID Number')}<span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="text"
                                className={errors.nid ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder="NID number"
                                defaultValue={props.data ? props.data.nid : null}
                                {...register("nid", { required: t("NID Number is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Note */}
                    <Container.Column>
                        <FormGroup>
                            {errors.note && errors.note.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.note && errors.note.message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('Note')}</Text>
                            }

                            <textarea
                                rows={4}
                                className={errors.note ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Write short note")}
                                defaultValue={props.data ? props.data.note : null}
                                {...register("note")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* NID Front image */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            <FileUploader
                                imageURL={props.data ? props.data.nid_front_scan_copy : null}
                                error={errors.nid_front ? errors.nid_front.message : null}
                                width={170}
                                height={100}
                                limit={100}
                                title={t("NID Front side.")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("nid_front", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("nid_front")
                                        setImages({ ...images, nid_front: data.image })
                                    }
                                }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* NID Back image */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            <FileUploader
                                imageURL={props.data ? props.data.nid_back_scan_copy : null}
                                error={errors.nid_back ? errors.nid_back.message : null}
                                width={170}
                                height={100}
                                limit={100}
                                title={t("NID Back side.")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("nid_back", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("nid_back")
                                        setImages({ ...images, nid_back: data.image })
                                    }
                                }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Mechanic image */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            <FileUploader
                                imageURL={props.data ? props.data.image : null}
                                error={errors.image ? errors.image.message : null}
                                width={100}
                                height={100}
                                limit={100}
                                title={t("Mechanic image.")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("image", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("image")
                                        setImages({ ...images, image: data.image })
                                    }
                                }}
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
        </div>
    );
};
