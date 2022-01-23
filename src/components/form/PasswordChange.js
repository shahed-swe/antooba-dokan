import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'

export const PasswordChange = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = async (data) => {

        if (data.password !== data.password_confirmation) {
            return setError("password_confirmation", {
                type: "manual",
                message: "Confirm doesn't match."
            })
        }

        clearErrors()
        props.onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Current Password */}
            <FormGroup>
                {errors.current_password && errors.current_password.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.current_password && errors.current_password.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("Current Password")}</Text>
                }

                <input
                    type="password"
                    className={errors.current_password ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder="Enter Current Password"
                    {...register("current_password", {
                        required: t("Current Password is required"),
                        minLength: {
                            value: 6,
                            message: t("Minimun length 6 character")
                        }
                    })}
                />
            </FormGroup>

            {/* New Password */}
            <FormGroup>
                {errors.password && errors.password.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.password && errors.password.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("New password")}</Text>
                }

                <input
                    type="password"
                    className={errors.password ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder="Enter new password"
                    {...register("password", {
                        required: t("New password is required"),
                        minLength: {
                            value: 8,
                            message: t("Minimun length 8 character")
                        }
                    })}
                />
            </FormGroup>

            {/* Re-Password */}
            <FormGroup>
                {errors.password_confirmation && errors.password_confirmation.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.password_confirmation && errors.password_confirmation.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("Re-type password")}</Text>
                }

                <input
                    type="password"
                    className={errors.password_confirmation ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder="Enter password"
                    {...register("password_confirmation", {
                        required: t("Re-type your password"),
                        minLength: {
                            value: 8,
                            message: t("Minimun length 8 character")
                        }
                    })}
                />
            </FormGroup>

            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >{props.loading ? t("Updating...") : t("Update")}</PrimaryButton>
            </div>
        </form>
    )
}