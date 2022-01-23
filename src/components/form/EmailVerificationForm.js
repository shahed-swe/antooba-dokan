import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { PrimaryButton } from '../button/Index'

import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { Toastify } from '../toastify/Toastify'

export const EmailVerificationForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit,setError,clearErrors, formState: { errors } } = useForm()
    const {email, show} = props

    const onSubmit = async(data) => {
        clearErrors()
        try{
            const newdata = {
                email:email ? email: null,
                otp: data.otp
            }
            const response = await Requests.Auth.VerifyEmail(newdata)
            if(response.status === 200){
                Toastify.Success("Email Verification Successfull")
                show(false)
            }
        }catch(error){
            console.log(error.response.data)
            if(error && error.response && error.response.status && error.response.status === 422){
                show(true)
                setError("otp", {
                    type: "manual",
                    message: "Invalid Otp"
                })
            }else{
                Toastify.Error("Network Error Occured")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>
                {/* Penalty Amount */}
                <Container.Column>
                    <FormGroup>
                        {errors.otp && errors.otp.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.otp && errors.otp.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('OTP')}</Text>
                        }

                        <input
                            type="number"
                            step=".01"
                            className={errors.otp ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter name")}
                            {...register("otp", { required: "OTP required" })}
                        />
                    </FormGroup>
                </Container.Column>


            </Container.Row>
            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >{props.loading ?  t("Submit...") :  t("Submit")}</PrimaryButton>
            </div>
        </form>
    );
}