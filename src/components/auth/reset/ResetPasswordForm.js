
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'react-feather'
import { FormGroup } from '../../formGroup/FormGroup'
import { PrimaryButton } from '../../button/Index'
import { Text } from '../../text/Text'

export const ResetPasswordForm = (props) => {
    const { handleSubmit, onSubmit, errors, resetingpassword, t, register } = props;
    const [passwordshow, setPasswordshow] = useState(false);
    const [confirmpasswordshow, setConfirmpasswordshow] = useState(false);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Password */}
            <FormGroup>
                {errors.password && errors.password.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.password && errors.password.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("Password")}</Text>
                }

                <div style={{ position: "relative" }}>
                    <input
                        type={passwordshow === true ? "text " : "password"}
                        className={errors.password ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="Password"
                        {...register("password", { required: t("Password Field is Required") })}
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

            {/* Confirm password */}
            <FormGroup>
                {errors.password_confirmation && errors.password_confirmation.message ?
                    <Text className="text-danger fs-13 mb-1">{errors.password_confirmation && errors.password_confirmation.message}</Text> :
                    <Text className="text-capitalize fs-13 mb-1">{t("Confirm Password")}</Text>
                }

                <div style={{ position: "relative" }}>
                    <input
                        type={confirmpasswordshow === true ? "text " : "password"}
                        className={errors.password_confirmation ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="Confirm Password"
                        {...register("password_confirmation", { required: t("Confirm Password Field is Required") })}
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

            {/* Submit button */}
            <PrimaryButton
                type="submit"
                className="w-100"
                disabled={resetingpassword}
            >{resetingpassword ? t("Reseting...") : t("Reset")}</PrimaryButton>

            {/* Others page links */}
            <div className="mt-2 text-right">
                <Text className="fs-15">
                    {t("Back to ")}
                    <Link to="/">{t("Sign In")}</Link>
                </Text>
            </div>
        </form>
    )
}
