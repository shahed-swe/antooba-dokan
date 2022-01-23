import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { DatePicker } from '../datePicker/Index'
import { dateFormate } from '../../utils/_heplers'

export const ReturnForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [date, setDate] = useState(new Date());

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
            //props.submit(data)
        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>

                {/* Return Date */}
                <Container.Column>
                    <FormGroup>
                        {errors.date && errors.date.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Return Date')}</Text>
                        }

                        <DatePicker

                            selected={data => { setDate(data); clearErrors() }}
                            deafultValue={date}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Return Amount Type */}
                <Container.Column>
                    <FormGroup>
                        {errors.amountType && errors.amountType.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.amountType && errors.amountType.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Return Amount Type')}</Text>
                        }

                        <select
                            className="form-control shadow-none"
                            name="shiftSelect"
                            // onChange={(event) => { handleShiftFilter(event.target.value) }}
                            {...register("amountType", {
                                required: "Amount Type is required."
                            })}
                        >
                            <option value="default">select amount type</option>
                            {props.amountType && props.amountType.map((item, i) =>
                                <option
                                    key={i}
                                    value={item.uid}
                                >{item.title}</option>
                            )}
                        </select>
                    </FormGroup>
                </Container.Column>

                {/* Return Amount */}
                <Container.Column>
                    <FormGroup>
                        {errors.returnAmount && errors.returnAmount.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.returnAmount && errors.returnAmount.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Return Amount')}</Text>
                        }

                        <input
                            type="number"
                            step=".01"
                            className={errors.returnAmount ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter return amount")}
                            defaultValue={null}
                            {...register("returnAmount", {
                                required: "Return amount is required."
                            })}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Note */}
                <Container.Column>
                    <FormGroup>
                        {errors.note && errors.note.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.note && errors.note.message}</Text>
                            : <Text className="fs-13 mb-0">{t("Note")} <span className='text-muted'> (optional)</span> </Text>}

                        <textarea
                            rows="3"
                            className={errors.note ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter your note here")}
                            {...register("note")}
                            defaultValue={null}
                        />
                    </FormGroup>
                </Container.Column>

                <Container.Column className="d-flex">
                    <Form.Check
                        custom
                        type="checkbox"
                        name="stockCheck"
                        id={`stockCheck`}
                        style={{ fontSize: 14 }}
                        {...register("stockCheck")}
                    />
                    <Text>Do you want to stock in this product ?</Text>
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