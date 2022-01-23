import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../../text/Text'
import { SearchableSelect } from '../../select/Index'
import { FormGroup } from '../../formGroup/FormGroup'
import { PrimaryButton } from '../../button/Index'


export const GroupForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [users, setUsers] = useState([])


    // handle submit
    const onSubmit = async data => {
        // if (!users.length) {
        //     return setError("users", {
        //         type: "manual",
        //         message: "Users is required."
        //     })
        // }

        const formData = {
            ...data,
            users
        }

        props.onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Group Name */}
            <FormGroup>
                {errors.name && errors.name.message ?
                    <Text className="fs-13 text-danger mb-0">{errors.name && errors.name.message}</Text> :
                    <Text className="fs-13 mb-0">{t('Group name')}</Text>
                }

                <input
                    type="text"
                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder={t("Enter name")}
                    {...register("name", { required: t("Name is required") })}
                />
            </FormGroup>

            {/* Group users */}
            <FormGroup>
                {errors.users && errors.users.message ?
                    <Text className="fs-13 text-danger mb-0">{errors.users && errors.users.message}</Text> :
                    <Text className="fs-13 mb-0">{t('Group users')}</Text>
                }

                <SearchableSelect
                    placeholder="Select users"
                    isMulti
                    borderRadius={4}
                    value={data => setUsers(data)}
                />
            </FormGroup>

            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >{props.loading ? "Creating..." : "Create"}</PrimaryButton>
            </div>
        </form>
    )
}