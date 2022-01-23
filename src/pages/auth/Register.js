import React, { useState, useEffect } from 'react'
import './style.scss'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Container } from '../../components/container/Index'
import { RegisterForm } from '../../components/auth/registration/RegisterForm'
import { VerifyForm } from '../../components/auth/registration/VerifyForm'
import { Requests } from '../../utils/Http/Index'

const Register = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()

    const [registering, setRegistering] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const lang = localStorage.getItem('language')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) history.push('/shop')
    }, [history])

    // on submit for registration
    const registerAccount = async (data) => {
        try {
            if (data.password !== data.password_confirmation) {
                return setError("password_confirmation", {
                    type: "manual",
                    message: "Confirm doesn't match."
                })
            }

            clearErrors()
            setRegistering(true)

            const response = await Requests.Auth.Registration(data)
            if (response.status === 200) setRegistered(true)
            setRegistering(false)
        } catch (error) {
            if (error) {
                setRegistering(false)
                if (error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0],
                        })
                    })
                }
            }
        }
    }

    // on submit for registration
    const verifyPhone = async (data) => {
        try {
            clearErrors()
            setVerifying(true)

            const response = await Requests.Auth.VerifyPhone(data);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                const invitation = localStorage.getItem("invitation");
                setTimeout(() => {
                    if (!invitation) {
                        history.push("/shop")
                    } else {
                        localStorage.removeItem("invitation");
                        history.push("/invitation/" + invitation);
                    }
                }, 1000)
            }
            setVerifying(false)

        } catch (error) {
            if (error) {
                setVerifying(false)
                if (error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                }
            }
        }
    }

    return (
        <div className="auth-container">
            <Container.Basic>
                <Container.Row>
                    <Container.Column>
                        {!registered ?
                            <RegisterForm
                                errors={errors}
                                t={t}
                                setError={setError}
                                handleSubmit={handleSubmit}
                                onSubmit={registerAccount}
                                register={register}
                                lang={lang}
                                registering={registering}
                            />
                            :
                            <VerifyForm
                                errors={errors}
                                t={t}
                                setError={setError}
                                handleSubmit={handleSubmit}
                                onSubmit={verifyPhone}
                                register={register}
                                lang={lang}
                                verifying={verifying}
                            />
                        }
                    </Container.Column>
                </Container.Row>
            </Container.Basic>
        </div>
    );
}

export default Register;
