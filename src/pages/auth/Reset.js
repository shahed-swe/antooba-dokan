import React, { useState, useEffect } from 'react'
import './style.scss'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Images } from '../../utils/Images'
import { Image } from '../../components/image/Index'
import { Container } from '../../components/container/Index'
import { Card } from '../../components/card/Index'
import { Text } from '../../components/text/Text'
import { SendOtpForm } from '../../components/auth/reset/SendOtpForm'
import { CheckOtpForm } from '../../components/auth/reset/CheckOtpForm'
import { ResetPasswordForm } from '../../components/auth/reset/ResetPasswordForm'
import { Toastify } from '../../components/toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

const ResetRequest = () => {
    const history = useHistory()
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [sendingotp, setSendingotp] = useState(false)
    const [otpsent, setOtpsent] = useState(false)
    const [matchingotp, setMatchingOtp] = useState(false)
    const [otpmatched, setOtpmatched] = useState(false)
    const [resetingpassword, setResetingPassword] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) history.push('/shop')
    }, [history])

    // Submit Form to OTP
    const SendOTP = async (data) => {
        try {
            clearErrors();
            setSendingotp(true)

            const response = await Requests.Auth.SendEmailOrPhoneForReset(data);
            if (response.status === 200) {
                Toastify.Success("Check your phone an OTP code was send.")
                setOtpsent(true)
            }
            setSendingotp(false)
        } catch (error) {
            if (error) {
                setSendingotp(false)
                if (error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    // Check OTP code
    const CheckOTP = async (data) => {
        try {
            clearErrors()
            setMatchingOtp(true)

            const response = await Requests.Auth.CheckResetPasswordOtp(data)
            if (response.status === 200) setOtpmatched(true)
            setMatchingOtp(false)

        } catch (error) {
            if (error) {
                setMatchingOtp(false)
                if (error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    // CheckOTP
    const SubmitToResetPassword = async (data) => {
        try {
            if (data.password !== data.password_confirmation) {
                return setError("password_confirmation", {
                    type: "manual",
                    message: "Confirm doesn't match."
                })
            }

            setResetingPassword(true)
            clearErrors()

            const response = await Requests.Auth.ResetPassword(data)
            if (response.status === 200) {
                Toastify.Success(t('Password Reset Successfully'))
                history.push("/")
            }

            setResetingPassword(false)
        } catch (error) {
            if (error) {
                setResetingPassword(false)
                if (error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    return (
        <div className="auth-container">
            <Container.Basic>
                <Container.Row>
                    <Container.Column>
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
                                <Text className="fs-20 font-weight-bolder mb-1">{t("Forgot Password?")}</Text>
                                <Text className="fs-14 text-muted mb-0">Just enter your E-mail / Phone, we will sent instruction.</Text>
                            </Card.Header>
                            <Card.Body className="px-0">
                                {!otpsent ?
                                    <SendOtpForm
                                        handleSubmit={handleSubmit}
                                        onSubmit={SendOTP}
                                        errors={errors}
                                        sendingotp={sendingotp}
                                        t={t}
                                        register={register}
                                    />
                                    :
                                    !otpmatched ?
                                        <CheckOtpForm
                                            handleSubmit={handleSubmit}
                                            onSubmit={CheckOTP}
                                            errors={errors}
                                            matchingotp={matchingotp}
                                            t={t}
                                            register={register}
                                        />
                                        :
                                        <ResetPasswordForm
                                            handleSubmit={handleSubmit}
                                            onSubmit={SubmitToResetPassword}
                                            errors={errors}
                                            resetingpassword={resetingpassword}
                                            t={t}
                                            register={register}
                                        />
                                }
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Basic>
        </div>
    );
}

export default ResetRequest;