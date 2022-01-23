import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'react-feather'
import { Text } from '../../text/Text'
import { FormGroup } from '../../formGroup/FormGroup'
import { Card } from '../../card/Index'
import { PrimaryButton } from '../../button/Index'
import { Image } from '../../image/Index'
import { Images } from '../../../utils/Images'

export const LoginForm = (props) => {
    const { handleSubmit, onSubmit, errors, isLogging, t, register } = props;
    const [show, setShow] = useState(false);

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
                <Text className="fs-20 font-weight-bolder mb-1">{t('Sign In')}</Text>
                <Text className="fs-14 text-muted mb-0">{t("Welcome back!")} {t("Please sign in to continue")}</Text>
            </Card.Header>
            <Card.Body className="px-0">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* E-mail */}
                    <FormGroup>
                        {errors.email_or_phone && errors.email_or_phone.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.email_or_phone && errors.email_or_phone.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('E-mail / Phone')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.email_or_phone ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="example@gmail.com / 01xxxxxxxxx"
                            {...register("email_or_phone", { required: t("E-mail or Phone is required") })}
                        />
                    </FormGroup>

                    {/* Password */}
                    <FormGroup>
                        {errors.password && errors.password.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.password && errors.password.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t("Password")}</Text>
                        }

                        <div style={{ position: "relative" }}>
                            <input
                                type={show ? "text " : "password"}
                                placeholder="*****"
                                className={errors.password ? "form-control shadow-none error" : "form-control shadow-none"}
                                {...register("password", { required: t("Password is required") })}
                            />

                            {show ?
                                <Eye
                                    size={16}
                                    style={{
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: 13,
                                        right: 13
                                    }}
                                    onClick={() => setShow(!show)}
                                />
                                :
                                <EyeOff
                                    size={16}
                                    style={{
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: 13,
                                        right: 13
                                    }}
                                    onClick={() => setShow(!show)}
                                />
                            }
                        </div>
                    </FormGroup>

                    {/* Submit button */}
                    <PrimaryButton
                        type="submit"
                        className="w-100"
                        disabled={isLogging}
                    >
                        {isLogging ? t("Signing In ...") : t("Sign In")}
                    </PrimaryButton>

                    {/* Another page links */}
                    <div className="mt-2">
                        <div className="d-flex">
                            <div>
                                <Link to="/register">
                                    <Text className="fs-14">{t("Need an account?")}</Text>
                                </Link>
                            </div>
                            <div className="ml-auto">
                                <Link to="/reset">
                                    <Text className="fs-14">{t("Forgot password?")}</Text>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </Card.Body>
        </Card.Simple>
    )
}
