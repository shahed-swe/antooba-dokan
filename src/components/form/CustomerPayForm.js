import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { DatePicker } from '../datePicker/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const CustomerPayForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [date, setDate] = useState(new Date())
    const [isConsider, setConsider] = useState(false)

    // Submit Form
    const onSubmit = async data => {
        if (!date) {
            setError("date", {
                type: "manual",
                message: "Date is required."
            })
        }

        clearErrors()
        const formData = {
            ...data,
            date,
            isConsider
        }

        props.onSubmit(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Date */}
                <FormGroup>
                    {errors.date && errors.date.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Date')}</Text>
                    }

                    <DatePicker
                        deafultValue={date}
                        selected={data => {
                            setDate(data)
                            clearErrors("date")
                        }}
                    />
                </FormGroup>

                {/* Amount */}
                <FormGroup>
                    {errors.amount && errors.amount.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.amount && errors.amount.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Amount')}</Text>
                    }

                    <input
                        type="number"
                        min={0}
                        className="form-control shadow-none"
                        placeholder="Enter amount of due"
                        {...register("amount", {
                            required: t("Due amount is required")
                        })}
                    />
                </FormGroup>

                {/* Due consider checkbox */}
                <FormGroup>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isConsider}
                            onChange={() => setConsider(!isConsider)}
                            style={{ cursor: "pointer" }}
                            id="flexCheckDefault"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                            style={{ cursor: "pointer" }}
                        >
                            <Text className="mb-0 fs-14">{t("Check this to consider previous all Due.")}</Text>
                        </label>
                    </div>
                </FormGroup>

                {/* Note */}
                <FormGroup>
                    {errors.note && errors.note.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.note && errors.note.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('Note')}</Text>
                    }

                    <textarea
                        rows={4}
                        className={errors.note ? "form-control shadow-none error" : "form-control shadow-none"}
                        placeholder={t("Write short note")}
                        defaultValue={props.data ? props.data.note : null}
                        {...register("note", { required: t("Note is required") })}
                    />
                </FormGroup>

                {/* Submit button */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={props.loading}
                    >{props.loading ? "LOADING..." : "SUBMIT"}</PrimaryButton>
                </div>
            </form>
        </div>
    );
};
