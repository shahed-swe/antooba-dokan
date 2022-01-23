import React from 'react'
import { Link } from 'react-router-dom'
import { FormGroup } from '../../formGroup/FormGroup'
import { Card } from '../../card/Index'
import { Text } from '../../text/Text'
import { Image } from '../../image/Index'
import { PrimaryButton } from '../../button/Index'
import { Images } from '../../../utils/Images'

export const VerifyForm = (props) => {
    const { t, errors, handleSubmit, onSubmit, register, verifying, clearState } = props;

    return (
        <Card.Simple className="shadow-none border-0">
            <Card.Header className="bg-white px-0">
                <div className="text-center mb-4">
                    <Image
                        x={90}
                        y={90}
                        src={Images.Logo}
                        alt="Company Logo"
                    />
                </div>
                <Text className="fs-20 font-weight-bolder mb-1">{t('Verify Account')}</Text>
                <Text className="fs-14 text-muted mb-0">{t("An Verification code has been sent to your mobile.")}</Text>
            </Card.Header>
            <Card.Body className="px-0">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* OTP Code */}
                    <FormGroup>
                        {errors.otp && errors.otp.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.otp && errors.otp.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('OTP')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.otp ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter OTP")}
                            {...register("otp", { required: t("OTP is required") })}
                        />
                    </FormGroup>

                    {/* Submit button */}
                    <PrimaryButton
                        type="submit"
                        className="w-100"
                        disabled={verifying}
                    >{verifying ? t("Loading") + ' ...' : t("Verify")}</PrimaryButton>

                    {/* Another pagee links */}
                    <div className="divider-text">{t('or')}</div>
                    <div className="text-center">
                        <Text className="fs-14">
                            {t("Already have an account? ")}
                            <Link to="/" onClick={clearState}>{t("Sign In")}</Link>
                        </Text>
                    </div>
                </form>
            </Card.Body>
        </Card.Simple>
    )
}
