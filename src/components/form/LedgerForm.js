import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const LedgerForm = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Submit Form
  const onSubmit = async data => {

      props.onSubmit(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <FormGroup>
          {errors.name && errors.name.message ?
            <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text> :
            <Text className="text-capitalize fs-13 mb-1">{t('Name')}  <span className="text-danger"> *</span></Text>
          }

          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Enter name"
            {...register("name", {
              required: t("Name is required")
            })}
          />
        </FormGroup>

        {/* Description */}
        <FormGroup>
          <Text className="fs-13 mb-0">{t('Description')}</Text>
          <textarea
            rows={3}
            className="form-control shadow-none"
            placeholder={t("Enter text here")}
            // defaultValue={props.data && props.data.description ? props.data.description : null}
            {...register("description")}
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
