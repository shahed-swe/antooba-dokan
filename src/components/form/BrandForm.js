import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { FileUploader } from '../fileUploader/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const BrandForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue,setError,clearErrors, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = async data => {
        const formData = new FormData()
        if (!props.create) formData.append('_method', "PUT")
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('name', data ? data.name : '')  //   Name
        formData.append('description', data ? data.description : '')
        formData.append('image', data.image ?? null)

        // for sending submitted data
        props.submit(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Brand Name */}
            <FormGroup>
                {errors.name && errors.name.message ?
                    <Text className="fs-13 text-danger mb-0">{errors.name && errors.name.message}</Text> :
                    <Text className="fs-13 mb-0">{t('Brand Name')}</Text>
                }

                <input
                    type="text"
                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder={t("Enter Brand name")}
                    defaultValue={props.data && props.data.name ? props.data.name : null}
                    {...register("name", { required: t("Name is required") })}
                />
            </FormGroup>

            {/* Description */}
            <FormGroup>
                <Text className="fs-13 mb-0">{t('Description')}</Text>
                <textarea
                    rows={3}
                    className="form-control shadow-none"
                    placeholder={t("Enter brand description")}
                    defaultValue={props.data && props.data.description ? props.data.description : null}
                    {...register("description")}
                />
            </FormGroup>

            {/* Image */}
            <FileUploader
                imageURL={props.data && props.data.image ? props.data.image : null}
                error={errors.image ? errors.image.message : ""}
                width={110}
                height={110}
                limit={100}
                title={t("Brand image")}
                dataHandeller={(data) => {
                    if (data.error) {
                        setError("image", {
                            type: "manual",
                            message: data.error
                        })
                    }

                    if (data.image) {
                        clearErrors("image")
                        setValue('image', data.image)
                    }
                }
                }
            />

            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >{props.loading ? t("Submitting...") : t("Submit")}</PrimaryButton>
            </div>
        </form>
    );
}
