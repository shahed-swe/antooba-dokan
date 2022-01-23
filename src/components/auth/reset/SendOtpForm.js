import React from 'react'
import { Link } from 'react-router-dom'
import { FormGroup } from '../../formGroup/FormGroup'
import { PrimaryButton } from '../../button/Index'
import { Text } from '../../text/Text'


export const SendOtpForm = (props) => {
    const { handleSubmit, onSubmit, errors, sendingotp, t, register } = props;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* E-mail or phone */}
            <FormGroup>
                {errors.email_or_phone && errors.email_or_phone.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.email_or_phone && errors.email_or_phone.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("E-mail / Phone")}</Text>
                }

                <input
                    type="text"
                    className={errors.email_or_phone ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder="example@gmail.com / 01xxxxxxxxx"
                    {...register("email_or_phone", { required: t("E-mail or Phone is required") })}
                />
            </FormGroup>

            {/* Submit button */}
            <PrimaryButton
                type="submit"
                className="w-100"
                disabled={sendingotp}
            >{sendingotp ? t("Sending ...") : t("Send OTP")}</PrimaryButton>

            <div className="mt-2 text-right">
                <Text className="fs-15">
                    {t("Back to ")}
                    <Link to="/">{t("Sign In")}</Link>
                </Text>
            </div>
        </form>
    )
}
