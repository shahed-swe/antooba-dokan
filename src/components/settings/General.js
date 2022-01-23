import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'
import { FileUploader } from '../fileUploader/Index'
import { Toastify } from '../toastify/Toastify'
import { isValidEmail, isValidPhone } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'

export const General = (props) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const { generaldata } = props
    const { t } = useTranslation()
    const [logo, setLogo] = useState('')
    const [updating, setUpdating] = useState(false)

    // Submit data
    const onSubmit = async (data) => {
        try {
            let formData = new FormData()
            formData.append('title', data.title)
            formData.append('email', data.email)
            formData.append('_method', 'PUT')
            formData.append('phone', data.phone)
            formData.append('logo', logo.value)

            setUpdating(true)
            const response = await Requests.Settings.DokanGeneral(formData)
            if (response.status === 200) {
                Toastify.Success('Saved Your general settings')
            }
            setUpdating(false)
        } catch (error) {
            if (error) {
                setUpdating(false)
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: error.response.data.errors[key][0]
                    })
                })
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Dokan Name */}
                <FormGroup>
                    {errors.title && errors.title.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.title && errors.title.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Dokan name')}</Text>
                    }

                    <input
                        type="text"
                        className={errors.title ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder={t("Dokan name")}
                        defaultValue={generaldata ? generaldata.title : null}
                        {...register("title", { required: "Dokan name is required" })}
                    />
                </FormGroup>

                {/* E-mail */}
                <FormGroup>
                    {errors.email && errors.email.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.email && errors.email.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('E-mail')}</Text>
                    }

                    <input
                        type="text"
                        className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="example@gmail.com"
                        defaultValue={generaldata ? generaldata.setting.email : null}
                        {...register("email", {
                            required: t("E-mail is required"),
                            pattern: {
                                value: isValidEmail(),
                                message: "Invalid e-mail address"
                            }
                        })}
                    />
                </FormGroup>

                {/* Phone */}
                <FormGroup>
                    {errors.phone && errors.phone.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.phone && errors.phone.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Phone')}</Text>
                    }

                    <input
                        type="text"
                        className={errors.phone ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="01XXXXXXXXX"
                        defaultValue={generaldata ? generaldata.setting.phone : null}
                        {...register("phone", {
                            required: t("Phone number is required"),
                            pattern: {
                                value: isValidPhone(),
                                message: "Invalid phone number"
                            }
                        })}
                    />
                </FormGroup>

                {/* File uploader */}
                <FileUploader
                    imageURL={generaldata.logo}
                    width={80}
                    height={80}
                    limit={100}
                    title={t("Logo")}
                    error={logo.error}
                    dataHandeller={(data) => setLogo({ ...logo, value: data.image || null, error: data.error || null })}
                />

                {/* Submit button */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={updating}
                    >{updating ? t("Saving ...") : t("Save Changes")}</PrimaryButton>
                </div>
            </form>
        </div>
    );
};