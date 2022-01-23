import React from 'react'
import { Link } from 'react-router-dom'
import { FormGroup } from '../../formGroup/FormGroup'
import { PrimaryButton } from '../../button/Index'
import { Text } from '../../text/Text'

export const CheckOtpForm = (props) => {
    const { handleSubmit, onSubmit, errors, matchingotp, t, register } = props;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* E-mail */}
            <FormGroup>
                {errors.otp && errors.otp.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.otp && errors.otp.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("OTP Code")}</Text>
                }

                <input
                    type="text"
                    className={errors.otp ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder="Insert OTP"
                    {...register("otp", { required: t("OTP Field is Required") })}
                />
            </FormGroup>

            {/* Submit button */}
            <PrimaryButton
                type="submit"
                className="w-100"
                disabled={matchingotp}
            >{matchingotp ? t("Wait ...") : t("Proceed")}</PrimaryButton>

            {/* Other page links */}
            <div className="mt-2 text-right">
                <Text className="fs-15">
                    {t("Back to ")}
                    <Link to="/">{t("Sign In")}</Link>
                </Text>
            </div>
        </form>
    )
}