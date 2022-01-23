import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'react-feather'
import { Image } from '../../image/Index'
import { FormGroup } from '../../formGroup/FormGroup'
import { Card } from '../../card/Index'
import { Text } from '../../text/Text'
import { PrimaryButton } from '../../button/Index'
import { isValidEmail, isValidPhone } from '../../../utils/_heplers'
import { Images } from '../../../utils/Images'

export const RegisterForm = (props) => {
    const { t, errors, handleSubmit, onSubmit, register, lang, registering } = props;
    const [passwordshow, setPasswordshow] = useState(false);
    const [confirmpasswordshow, setConfirmpasswordshow] = useState(false);

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
                <Text className="fs-20 font-weight-bolder mb-1">{t('Create New Account')}</Text>
                <Text className="fs-14 text-muted mb-0">{t("It's free to signup and only takes a minute.")}</Text>
            </Card.Header>
            <Card.Body className="px-0">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Name */}
                    <FormGroup>
                        {errors.name && errors.name.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('name')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Your name")}
                            {...register("name", { required: t("Name is required") })}
                        />
                    </FormGroup>

                    {/* Phone */}
                    <FormGroup>
                        {errors.phone_no && errors.phone_no.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.phone_no && errors.phone_no.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('phone')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.phone_no ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="01xxxxxxxxx"
                            {...register("phone_no", {
                                required: t("Phone number is required"),
                                pattern: {
                                    value: isValidPhone(),
                                    message: "Invalid phone number"
                                }
                            })}
                        />
                    </FormGroup>

                    {/* E-mail */}
                    <FormGroup>
                        {errors.email && errors.email.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.email && errors.email.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('email')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="example@gmail.com"
                            {...register("email", {
                                pattern: {
                                    value: isValidEmail(),
                                    message: "Invalid e-mail address"
                                }
                            })}
                        />
                    </FormGroup>

                    {/* Password */}
                    <FormGroup>
                        {errors.password && errors.password.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.password && errors.password.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('password')}</Text>
                        }

                        <div style={{ position: "relative" }}>
                            <input
                                type={passwordshow ? "text " : "password"}
                                placeholder={t("Enter your password")}
                                className={errors.password ? "form-control shadow-none error" : "form-control shadow-none"}
                                {...register("password", { required: "Password is required" })}
                            />

                            {passwordshow ?
                                <Eye
                                    size={16}
                                    style={{
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: 13,
                                        right: 13
                                    }}
                                    onClick={() => setPasswordshow(!passwordshow)}
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
                                    onClick={() => setPasswordshow(!passwordshow)}
                                />
                            }
                        </div>
                    </FormGroup>

                    {/* Confirm Password */}
                    <FormGroup className="mb-1">
                        {errors.password_confirmation && errors.password_confirmation.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.password_confirmation && errors.password_confirmation.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Confirm Password')}</Text>
                        }

                        <div style={{ position: "relative" }}>
                            <input
                                type={confirmpasswordshow ? "text " : "password"}
                                placeholder={t("Enter your password confirmation")}
                                className={errors.password_confirmation ? "form-control shadow-none error" : "form-control shadow-none"}
                                {...register("password_confirmation", { required: t("Confirm password is required") })}
                            />

                            {confirmpasswordshow ?
                                <Eye
                                    size={16}
                                    style={{
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: 13,
                                        right: 13
                                    }}
                                    onClick={() => setConfirmpasswordshow(!confirmpasswordshow)}
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
                                    onClick={() => setConfirmpasswordshow(!confirmpasswordshow)}
                                />
                            }
                        </div>
                    </FormGroup>

                    {/* Message */}
                    <div className="mb-4">
                        {lang === 'en' ?
                            <Text className="fs-13 mb-0">By clicking <strong>Create an account</strong> below, you agree to our <Link to="/terms">terms of service</Link> and <Link to="/privacy">privacy statement</Link>.</Text> :
                            <Text className="fs-13 mb-0">নিচের <strong>{t("Create Account")}</strong> ক্লিক করায়, আপনি আমাদের <Link to="/terms">সেবা পাবার শর্ত</Link> এবং <Link to="/privacy">গোপনীয়তা বিবৃতি</Link> এর সাথে একমত হচ্ছেন।</Text>
                        }
                    </div>

                    {/* Submit button */}
                    <div>
                        <PrimaryButton
                            type="submit"
                            className="w-100"
                            disabled={registering}
                        >{registering ? t("Loading") + ' ...' : t("Create Account")}</PrimaryButton>
                    </div>

                    {/* Divider */}
                    <div className="divider-text">{t('or')}</div>
                    <div className="text-center">
                        <Text className="fs-14">
                            {t("Already have an account? ")}
                            <Link to="/">{t("Sign In")}</Link>
                        </Text>
                    </div>
                </form>
            </Card.Body>
        </Card.Simple>
    )
}
