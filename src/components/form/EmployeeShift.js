import React, { useState } from 'react'
import TimePicker from 'react-time-picker'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { MultiSelect } from '../select/Index'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const EmployeeShift = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const [starttime, setStartTime] = useState(props.shift && props.shift.start_time ? props.shift.start_time : "10:00")
    const [endtime, setEndtime] = useState(props.shift && props.shift.end_time ? props.shift.end_time : "10:00")

    const [weekend, setWeekend] = useState({
        options: [
            { label: t("Saturday"), value: "Saturday" },
            { label: t("Sunday"), value: "Sunday" },
            { label: t("Monday"), value: "Monday" },
            { label: t("Tuesday"), value: "Tuesday" },
            { label: t("Wednesday"), value: "Wednesday" },
            { label: t("Thursday"), value: "Thursday" },
            { label: t("Friday"), value: "Friday" },
        ],
        values: props.shift && props.shift.weekend ? props.shift.weekend.split(",").map(item => {
            return { label: item, value: item }
        }) : [],
        error: null
    })

    // Submit Form
    const onSubmit = async data => {
        if (!weekend.values.length) {
            return setWeekend(exWeekend => ({ ...exWeekend, error: "Weekend is required." }))
        }

        if (!starttime) {
            return setError("starttime", {
                type: "manual",
                message: "Start time is required."
            })
        }

        if (!endtime) {
            return setError("endtime", {
                type: "manual",
                message: "End time is required."
            })
        }

        const weekendItems = []
        if (weekend.values && weekend.values.length) {
            for (let i = 0; i < weekend.values.length; i++) {
                const element = weekend.values[i]
                weekendItems.push(element.value)
            }
        }

        if (starttime && endtime) {
            data.start_time = starttime
            data.end_time = endtime
            data.weekend = weekendItems.join(',')

            props.submit(data)
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>

                {/* Shift Name */}
                <Container.Column>
                    <FormGroup>
                        {errors.title && errors.title.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.title && errors.title.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Shift Title')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.title ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter name")}
                            {...register("title", { required: "Shift name is required." })}
                            defaultValue={props.shift && props.shift.title ? props.shift.title : null}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Weekend */}
                <Container.Column>
                    <FormGroup>
                        {weekend.error ?
                            <Text className="text-danger fs-13 mb-1">{weekend.error}</Text> :
                            <Text className="fs-13 mb-1">{t('Weekend')}</Text>
                        }

                        <MultiSelect
                            error={errors.weekend}
                            placeholder="weekend"
                            options={weekend.options}
                            values={event => {
                                let days = []
                                event.map(item => {
                                    days.push({ label: item.value, value: item.value })
                                    return days
                                })
                                setWeekend(exWeekend => ({ ...exWeekend, values: days, error: null }))
                            }}
                            default={weekend.values && weekend.values.length ? weekend.values : null}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Start Time */}
                <Container.Column className="col-md-6 col-sm-12">
                    <FormGroup>
                        {errors.start_time && errors.start_time.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.start_time && errors.start_time.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Start Time')}</Text>
                        }

                        <TimePicker
                            format="h:m a"
                            className="form-control"
                            value={starttime}
                            onChange={value => setStartTime(value)}
                        />
                    </FormGroup>
                </Container.Column>

                {/* End Time */}
                <Container.Column className="col-md-6 col-sm-12">
                    <FormGroup>
                        {errors.end_time && errors.end_time.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.end_time && errors.end_time.message}</Text> :
                            <Text className="fs-13 mb-1">{t('End Time')}</Text>
                        }

                        <TimePicker
                            format="h:m a"
                            className="form-control"
                            value={endtime}
                            onChange={value => setEndtime(value)}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Break duration */}
                <Container.Column>
                    <FormGroup>
                        {errors.daily_break_duration && errors.daily_break_duration.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.daily_break_duration && errors.daily_break_duration.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Daily break duration (min)')}</Text>
                        }

                        <input
                            type="number"
                            className={errors.daily_break_duration ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter Daily Break Duration")}
                            defaultValue={props.shift && props.shift.daily_break_duration ? props.shift.daily_break_duration : null}
                            {...register("daily_break_duration", {
                                required: "Daily break duration is required."
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
                >{props.loading ? props.isCreate ? t("Creating...") : t("Updating...") : props.isCreate ? t("Create") : t("Update")}</PrimaryButton>
            </div>
        </form>
    );
}