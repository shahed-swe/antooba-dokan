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
import { SingleSelect } from '../select/Index'

export const ReplaceForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [date, setDate] = useState(new Date());
    const [imeiSelect, setImeiSelect] = useState([]);

    // Submit Form
    const onSubmit = async data => {

        if (!date) {
            return setError("date", {
                type: "manual",
                message: "Date is required."
            })
        }
        if (!imeiSelect) {
            return setError("imeiSelect", {
                type: "manual",
                message: "Imei is required."
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
                {/* Select IMEI */}
                <Container.Column>
                    <FormGroup>
                        {errors.imei_select && errors.imei_select.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.imei_select && errors.imei_select.message}</Text>
                            : <Text className="fs-13 mb-0">{t("IMEI")}</Text>}
                        {/* <select
                            className="form-control shadow-none"
                            {...register("imei_select", {
                                required: t("IMEI is required"),
                            })}
                        >
                            <option
                                value="default"
                            >Select imei</option>
                            <option
                                value="IMEI 1"
                            >IMEI 1</option>
                            <option
                                value="IMEI 2"
                            >IMEI 2</option>
                        </select> */}
                        <SingleSelect
                            options={props.imeiOptions}
                            placeholder={t('Select Customer')}
                            value={event => setImeiSelect(event.value)}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Return Date */}
                <Container.Column>
                    <FormGroup>
                        {errors.date && errors.date.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Replace Date')}</Text>
                        }

                        <DatePicker

                            selected={data => { setDate(data); clearErrors() }}
                            deafultValue={date}
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
                    <Text>Do you want to restock in this product ?</Text>
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