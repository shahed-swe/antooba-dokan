import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Toastify } from '../toastify/Toastify'
import { PrimaryButton } from '../button/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { isValidEmail } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'
import { Text } from '../text/Text'
import { NotCloseAbleModal } from '../modal/NotCloseAbleModal'
import {EmailVerificationForm} from '../form/EmailVerificationForm'


export const PersonalInfo = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const [updating, setUpdating] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const { user } = props
    
    const handleVerifyEmail = async () => {
        if (isValidEmail(user.email)) {
            try{
                const data = {
                    email: user.email
                }
                const response = await Requests.Auth.EmailVerification(data)
                if(response && response.status === 200){
                    setShowOtpModal(true)
                }
            }catch(error){
                if(error && error.response && error.response.status ){
                    console.log(error.response.status)
                }else{
                    Toastify.Error("Network Error.")
                    
                }
                setShowOtpModal(false)
            }
        }
    }


    // Submit Form
    const onSubmit = async (data) => {
        try {
            setUpdating(true);
            const response = await Requests.Settings.UserInformationUpdate(data)
            if (response.status === 200) Toastify.Success("Personal info updated")
            setUpdating(false)
        } catch (error) {
            if (error) {
                setUpdating(false)

                if (error && error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                } else {
                    Toastify.Error("Network error")
                }
            }
        }
    }

    const styles = {
        pointer: {
            cursor: "pointer"
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <FormGroup>
                    {errors.name && errors.name.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Name')}</Text>
                    }

                    <input
                        type="text"
                        className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder={t("Enter your name")}
                        defaultValue={user.name}
                        {...register("name", { required: t("Name is required") })}
                    />
                </FormGroup>

                {/* E-mail */}
                <FormGroup>
                    {errors.email && errors.email.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.email && errors.email.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">
                            {user.email && user.email_verified_at ? <CheckCircle size={14} color="green" /> : null}
                            {!user.email_verified_at ? <>{t(' E-mail')} <span className="text-primary user-select-none" style={styles.pointer} onClick={() => handleVerifyEmail()}>Verify Email?</span></> : t(' E-mail')}
                        </Text>
                    }

                    <input
                        type="text"
                        className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="example@gmail.com"
                        defaultValue={user.email}
                        {...register("email", {
                            required: false,
                            pattern: {
                                value: isValidEmail(),
                                message: "Invalid e-mail address"
                            }
                        })}
                    />

                </FormGroup>

                {/* Phone */}
                <FormGroup>
                    {errors.phone && errors.phone.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.phone && errors.phone.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">
                            {user.phone_verified_at ? <CheckCircle size={14} color="green" className="mr-1" /> : null}
                            {t('Phone')}
                        </Text>
                    }

                    <input
                        type="text"
                        className={errors.phone ? "form-control shadow-none error" : user.phone_verified_at ? "form-control is-verified shadow-none" : "form-control shadow-none"}
                        placeholder="01XXXXXXXXX"
                        defaultValue={user.phone_no}
                        {...register("phone")}
                        disabled
                    />
                </FormGroup>

                {/* Submit button */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={updating}
                    >{updating ? t("Updating ...") : t("Update")}</PrimaryButton>
                </div>
            </form>


            {/* Modal For E-mail verification */}
            <NotCloseAbleModal
                show={showOtpModal}
                onHide={() => setShowOtpModal(true)}
                title="Submit OTP"
                size="md"
            >
                <EmailVerificationForm
                    email={user.email}
                    show={setShowOtpModal}
                />
            </NotCloseAbleModal>
        </>
    )
}