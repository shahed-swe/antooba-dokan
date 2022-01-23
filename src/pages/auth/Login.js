import React, { useEffect, useState } from 'react'
import './style.scss'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '../../components/container/Index'
import { LoginForm } from '../../components/auth/login/LoginForm'
import { VerifyForm } from '../../components/auth/registration/VerifyForm'
import { Toastify } from '../../components/toastify/Toastify'
import { Requests } from '../../utils/Http/Index'
import { TwoFactorAuth } from '../../components/auth/TwoFactorAuth/Index'

const Login = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } = useForm()
    const [isLogging, setLogging] = useState(false);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    const [notverified, setNotVerified] = useState(false);
    const [verifying, setVerifying] = useState(false)
    const [verify_phone_no, setVerificationNumber] = useState(null);
    const [twofactor, setTwofactor] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        localStorage.setItem('language', 'en')
        if (token) history.push('/shop')
    }, [history])

    // Get user GEO location
    const geolocation = () => {
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords
                setLat(latitude);
                setLng(longitude);
            })
        }
    }

    geolocation()

    // Send OTP code
    const SendOtpCode = async (phone) => {
        try {
            const response = await Requests.Auth.ResendPhoneVerificationCode({ phone_no: phone });
            if (response.status === 200) {
                setVerificationNumber(phone);
                setLogging(false);
                setNotVerified(true);
            }
        } catch (error) {
            if (error) {
                setLogging(false);
                if (error.response && error.response.data) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0],
                        });
                    });
                }
            }
        }
    }

    // Submit Form
    const login = async (data) => {
        try {
            const formData = {
                ...data,
                latitude: lat,
                longitude: lng,
            }

            setLogging(true)
            clearErrors()

            const response = await Requests.Auth.Login(formData)
            if (response.status === 200) {
                if (response.data.two_factor_authentication === true) {
                    setTwofactor(true)
                } else {
                    localStorage.setItem('token', response.data.token);
                    const invitation = localStorage.getItem("invitation");

                    setTimeout(() => {
                        setLogging(false)
                        if (!invitation) {
                            history.push("/shop")
                        } else {
                            localStorage.removeItem("invitation");
                            history.push("/invitation/" + invitation);
                        }
                    }, 1000)
                }

            }

            setLogging(false)
        } catch (error) {
            if (error) {
                setLogging(false)

                if (error.response && error.response.status === 422) {
                    if (error.response.data.errors && error.response.data.errors.email_or_phone) {
                        Object.keys(error.response.data.errors).forEach(key => {
                            setError(key, {
                                type: "manual",
                                message: error.response.data.errors[key][0]
                            })
                        })
                    } else {
                        await SendOtpCode(error.response.data.errors.phone_no)
                    }
                }
            }else{
                Toastify.Error("Network Error.")
            }
        }
    }

    // on submit for registration
    const verifyPhone = async (data) => {
        try {
            clearErrors();
            setVerifying(true);

            const response = await Requests.Auth.VerifyPhone({ phone_no: verify_phone_no, otp: data.otp });
            if (response.status === 200) {
                Toastify.Success("Successfully account verified!")
                localStorage.setItem('token', response.data.token);

                setTimeout(() => {
                    history.push("/shop")
                }, 1000)
            }
            setVerifying(false)
        } catch (error) {
            if (error) {
                setVerifying(false)

                if (error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0],
                        });
                    });
                } else {
                    Toastify.Error("Network Error!")
                }
            }
        }
    }

    // two factor otp handling
    const handleOtp = async (data) => {
        setLogging(true)
        try{
            const newdata = {
                email_or_phone : data.email_or_phone,
                otp:  data.otp
            }
            const response = await Requests.Auth.PassTwoFactor(newdata)

            if(response.status && response.status === 200){
                localStorage.setItem('token', response.data.token);
                const invitation = localStorage.getItem("invitation");

                setTimeout(() => {
                    setLogging(false)
                    if (!invitation) {
                        history.push("/shop")
                    } else {
                        localStorage.removeItem("invitation");
                        history.push("/invitation/" + invitation);
                    }
                }, 1000)
            }
        }catch(error){
            if (error) {
                setLogging(false)
                if (error.response && error.response.status === 422) {
                    if (error.response.data.errors && error.response.data.errors.otp) {
                        Object.keys(error.response.data.errors).forEach(key => {
                            setError(key, {
                                type: "manual",
                                message: error.response.data.errors[key][0]
                            })
                        })
                    }
                }
            }else{
                Toastify.Error("Network Error.")
            }
        }
        
    }


    return (

        <div className="auth-container">
            <Container.Basic>
                <Container.Row>
                    <Container.Column>
                        {!twofactor ?
                            notverified ?
                                <VerifyForm
                                    errors={errors}
                                    t={t}
                                    setError={setError}
                                    handleSubmit={handleSubmit}
                                    onSubmit={verifyPhone}
                                    register={register}
                                    verifying={verifying}
                                    clearState={() => {
                                        reset()
                                        setNotVerified(false)
                                    }}
                                />
                                : <LoginForm
                                    handleSubmit={handleSubmit}
                                    onSubmit={login}
                                    errors={errors}
                                    isLogging={isLogging}
                                    t={t}
                                    register={register}
                                />
                            : <TwoFactorAuth
                                handleSubmit={handleSubmit}
                                onSubmit={handleOtp}
                                errors={errors}
                                isLogging={isLogging}
                                t={t}
                                register={register}
                            />}
                    </Container.Column>
                </Container.Row>
            </Container.Basic>
        </div>
    );
}

export default Login;
