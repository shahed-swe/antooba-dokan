import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'

export const OrderReject = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = async (data) => props.onSubmit(data)

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Reason */}
                <FormGroup>
                    {errors.reason && errors.reason.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.reason && errors.reason.message}</Text> :
                        <Text className="fs-13 mb-1">{t("Reason of reject order")}</Text>
                    }

                    <textarea
                        rows={3}
                        className={errors.reason ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="Write reason..."
                        {...register("reason", { required: t("Reason is required") })}
                    />
                </FormGroup>

                {/* Submit button */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={props.loading}
                    >{props.loading ? t("Loading...") : t("Submit")}</PrimaryButton>
                </div>
            </form>
        </div>
    );
};