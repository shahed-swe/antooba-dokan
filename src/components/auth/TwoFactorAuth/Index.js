import React from 'react'
import { Text } from '../../text/Text'
import { FormGroup } from '../../formGroup/FormGroup'
import { Card } from '../../card/Index'
import { PrimaryButton } from '../../button/Index'
import { Image } from '../../image/Index'
import { Images } from '../../../utils/Images'

export const TwoFactorAuth = (props) => {
    const { handleSubmit, onSubmit, errors, isLogging, t, register } = props;

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
                <Text className="fs-20 font-weight-bolder mb-1">{t('Two Factor Authentication')}</Text>
                <Text className="fs-14 text-muted mb-0">{t("Welcome back!")} {t("Please Authenticate to login into account")}</Text>
            </Card.Header>
            <Card.Body className="px-0">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* OTP */}
                    <FormGroup>
                        {errors.otp && errors.otp.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.otp && errors.otp.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('OTP')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.otp ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="OTP"
                            {...register("otp", { required: t("OTP required") })}
                        />
                    </FormGroup>

                    {/* Submit button */}
                    <PrimaryButton
                        type="submit"
                        className="w-100"
                        disabled={isLogging}
                    >
                        {isLogging ? t("Verifying ...") : t("Verify")}
                    </PrimaryButton>
                </form>
            </Card.Body>
        </Card.Simple>
    )
}
