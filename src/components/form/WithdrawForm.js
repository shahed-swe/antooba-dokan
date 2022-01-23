import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { dateYearFormat } from '../../utils/_heplers'
import { PrimaryButton } from '../button/Index'
import { DatePicker } from '../datePicker/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const WithdrawForm = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
  const [date, setDate] = useState(new Date())



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
      date: dateYearFormat(date)
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
            step={.01}
            className="form-control shadow-none"
            placeholder="Enter withdraw amount"
            defaultValue={props.value && props.value.installment_amount}
            {...register("amount", {
              required: t("Withdraw amount is required")
            })}
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
