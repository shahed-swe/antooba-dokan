import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { SingleSelect } from '../select/Index'
import { Text } from '../text/Text'

export const ServicingStatusForm = (props) => {
  const { t } = useTranslation()
  const { handleSubmit, setValue, formState: { errors } } = useForm()

  // Submit Form
  const onSubmit = async data => {
      props.onSubmit(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Status change */}
        <FormGroup>
          {errors.status && errors.status.message ?
            <Text className="text-danger fs-13 mb-1">{errors.status && errors.status.message}</Text>
            : <Text className="fs-13 mb-1">{t('Select Status')} </Text>}

          <SingleSelect
            placeholder="status"
            options={props.options}
            deafult={props.status ?
              {
                label: props.status,
                value: props.status
              } : null
            }
            value={event => setValue('status', event.value)}
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
