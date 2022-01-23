import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { dateFormate } from '../../utils/_heplers'
import { PrimaryButton } from '../button/Index'
import { Container } from '../container/Index'
import { DatePicker } from '../datePicker/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Main } from '../layout/Index'
import { PrimaryModal } from '../modal/PrimaryModal'
import { SingleSelect } from '../select/Index'
import { Text } from '../text/Text'
import { Toastify } from '../toastify/Toastify'
import { LedgerForm } from './LedgerForm'

export const DailyExpenseForm = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, setValue, clearErrors, formState: { errors } } = useForm()
  const [date, setDate] = useState(new Date())
  const [isCreateLedger, setCreateLedger] = useState({ show: false, loading: false })

  // Handle ledger submission
  const handleLedgerSubmission = async (data) => {
    try {
      setCreateLedger({ ...isCreateLedger, loading: true })
      console.log(data)

      setTimeout(() => {
        setCreateLedger({ value: null, loading: false, show: false })
        Toastify.Success("Successfully working in dummy.")
      }, 2000)
    } catch (error) {
      if (error) {
        setCreateLedger({ ...isCreateLedger, loading: false })
        Toastify.Error("Network Error.")
      }
    }
  }

  // Submit Form
  const onSubmit = async data => {
    if (!date) {
      setError("date", {
        type: "manual",
        message: "Date is required."
      })
    }

    if (!data.ledger) {
      setError("ledger", {
        type: "manual",
        message: "Ledger is required."
      })
    }

    // clearErrors()
    const formData = {
      ...data,
      date: dateFormate(date)
    }

    if (data.ledger && date) {
      props.onSubmit(formData)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Main>

          {/* Select ledger */}
          <Container.Column className="col-md-6">
            <FormGroup>
              {errors.ledger && errors.ledger.message ?
                <Text className="text-danger fs-13 mb-1">{errors.ledger && errors.ledger.message}</Text>
                : <Text className="fs-13 mb-1">
                  {t('Ledger')}
                  <span className="text-danger"> * </span>
                  / <span
                    className='text-primary'
                    onClick={() => setCreateLedger({ ...isCreateLedger, show: true })}
                    style={{cursor:"pointer"}}
                  >
                    Add New</span>
                </Text>
              }
              <SingleSelect
                placeholder="a ledger"
                options={props.ledgerData}
                value={event => {
                  setValue('ledger', event.value)
                  clearErrors("ledger")
                }}
              />
            </FormGroup>
          </Container.Column>

          {/* Date */}
          <Container.Column className="col-md-6">
          <FormGroup>
            {errors.date && errors.date.message ?
              <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
              <Text className="text-capitalize fs-13 mb-1">{t('Date')}  <span className="text-danger"> *</span></Text>
            }

            <DatePicker
              deafultValue={date}
              selected={data => {
                setDate(data)
                clearErrors("date")
              }}
            />
          </FormGroup>
          </Container.Column>

          {/* Amount */}
          <Container.Column className="col-md-6">
          <FormGroup>
            {errors.amount && errors.amount.message ?
              <Text className="text-danger fs-13 mb-1">{errors.amount && errors.amount.message}</Text> :
              <Text className="text-capitalize fs-13 mb-1">{t('Amount')}  <span className="text-danger"> *</span></Text>
            }

            <input
              type="number"
              min={0}
              step={.01}
              className="form-control shadow-none"
              placeholder="Enter amount"
              {...register("amount", {
                required: t("Amount is required")
              })}
            />
          </FormGroup>
          </Container.Column>

          {/* Description */}
          <Container.Column className="col-md-6">
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
          </Container.Column>
          
        </Main>


        {/* Submit button */}
        <div className="text-right">
          <PrimaryButton
            type="submit"
            className="px-4"
            disabled={props.loading}
          >{props.loading ? "LOADING..." : "SUBMIT"}</PrimaryButton>
        </div>
      </form>

      {/* Create ledger modal */}
      <PrimaryModal
        title={t(`Create ledger`)}
        show={isCreateLedger.show}
        size="md"
        onHide={() => setCreateLedger({ show: false, loading: false })}
      >
        <LedgerForm
          loading={isCreateLedger.loading}
          onSubmit={handleLedgerSubmission}
        />
      </PrimaryModal>
    </div>
  );
};
