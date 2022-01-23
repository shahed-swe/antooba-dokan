import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'
import { SingleSelect } from '../select/Index'

export const MemberForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [role, setRole] = useState({
        options: [
            { label: "Admin", value: "Admin" },
            { label: "Stuff", value: "Stuff" },
        ],
        value: null,
        error: false
    })

    // Submit Form
    const onSubmit = async (data) => {
        if (!role.value) return setRole({ ...role, error: "Role is required." })
        props.onSubmit({ ...data, role: role.value })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* E-mail / Phone */}
                <FormGroup>
                    {errors.email_or_phone && errors.email_or_phone.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.email_or_phone && errors.email_or_phone.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('E-mail / Phone')}</Text>
                    }

                    <input
                        type="text"
                        className={errors.email_or_phone ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder="example@gmail.com / 01XXXXXXXXX"
                        {...register("email_or_phone", {
                            required: t("E-mail or Phone is required")
                        })}
                    />
                </FormGroup>

                {/* Role */}
                <FormGroup>
                    {role.error ?
                        <Text className="text-danger text-capitalize fs-13 mb-1">{role.error}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Role')}</Text>
                    }

                    <SingleSelect
                        error={role.error}
                        options={role.options}
                        placeholder={"member role"}
                        value={event => setRole({ ...role, value: event.value, error: false })}
                    />
                </FormGroup>

                {/* Submit button */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={props.loading}
                    >{props.loading ? t("Creating...") : t("Create")}</PrimaryButton>
                </div>
            </form>
        </>
    )
}