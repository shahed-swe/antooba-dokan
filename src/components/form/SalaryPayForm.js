import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { DatePicker } from '../datePicker/Index'
import { dateFormate } from '../../utils/_heplers'
export const SalaryPayForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [date, setDate] = useState(props.payNow && props.payNow.date ? props.payNow.date : new Date());

    // Submit Form
    const onSubmit = async data => {

        if (!date) {
            return setError("date", {
                type: "manual",
                message: "Date is required."
            })
        }

        if (date) {
            data.date = dateFormate(date)
            console.log(data);
            props.submit(data)
        }

    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>

                {/* Pay Date */}
                <Container.Column>
                    <FormGroup>
                        {errors.date && errors.date.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Pay Date')}</Text>
                        }
                        <DatePicker

                            selected={data => { setDate(data); clearErrors() }}
                            deafultValue={date}
                        />
                    </FormGroup>
                </Container.Column>


                {/* Break duration */}
                <Container.Column>
                    <FormGroup>
                        {errors.payAmount && errors.payAmount.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.payAmount && errors.payAmount.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Pay Amount')}</Text>
                        }

                        <input
                            type="number"
                            step=".01"
                            className={errors.payAmount ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter pay amount")}
                            defaultValue={props.payNow && props.payNow.payAmount ? props.payNow.payAmount : null}
                            {...register("payAmount", {
                                required: "Pay amount is required."
                            })}
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
                // >{props.loading ? props.isCreate ? t("Submitting...") : t("Updating...") : props.isCreate ? t("Submit") : t("Update")}</PrimaryButton>
                >{props.loading ? ("Submitting...") : t("Submit")}</PrimaryButton>
            </div>
        </form>
    );
}