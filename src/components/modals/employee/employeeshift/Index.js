import React, { useState } from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GrayButton, PrimaryButton } from '../../../button/Index'
import SingleSelect from '../../../select/Single'
import TimePicker from 'react-time-picker'
import './style.scss'
import { Requests } from '../../../../utils/Http/Index'
import Toast from '../../../Toaster/Index'


const Create = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit,setError, setValue, formState: { errors } } = useForm()
    const [starttime, setStartTime] = useState("10:00")
    const [endtime, setEndtime] = useState("10:00")

    

    // Submit Form
    const onSubmit = async data => {
        if(starttime && endtime){
            data.start_time = starttime
            data.end_time = endtime


            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }

            const res = await Requests.Employee.EmployeeShiftCreate(newdata)
            if(res.status === 201){
                Toast.fire({
                    icon: 'success',
                    title: 'EmployeShift Added Successfully'
                })
                props.handleAction(true)
                props.onHide(true)
                setValue('title', '')
                setValue('daily_break_duration','')
            }else{
                Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
                });
            }
        }
        

        
    }


    const weekends = [
        { label: t("Saturday"), value: "Saturday" },
        { label: t("Sunday"), value: "Sunday" },
        { label: t("Monday"), value: "Monday" },
        { label: t("Tuesday"), value: "Tuesday" },
        { label: t("Wednesday"), value: "Wednesday" },
        { label: t("Thursday"), value: "Thursday" },
        { label: t("Friday"), value: "Friday" },
    ]

    return (
        <Modal
            show={props.show}
            size="lg"
            centered
            className="custom-modal"
            onHide={props.onHide}
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">{t('Create Employee Shift')}</h6></div>
                    <div className="ml-auto">
                        <GrayButton
                            type="button"
                            onClick={props.onHide}
                            style={{ padding: "7px 10px", borderRadius: "50%" }}
                        ><X size={16} /></GrayButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">

                        {/* Shift Name */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.title && errors.title.message ?
                                    <small className="text-danger">{errors.title && errors.title.message}</small>
                                    : <small>{t('Shift Title')}</small>}

                                <input
                                    type="text"
                                    className={errors.title ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter name")}
                                    {...register("title")}
                                />
                            </div>
                        </div>

                        {/* Weekend */}
                        <div className="col-12 col-lg-6">
                            {errors.weekend && errors.weekend.message ?
                                    <small className="text-danger">{errors.weekend && errors.weekend.message}</small>
                                    : <small>{t('Weekend')}</small>}
                            <SingleSelect
                                placeholder={t("select weekend")}
                                options={weekends}
                                value={event => setValue('weekend',event.value)}
                            />
                        </div>

                        
                        {/* Start Time */}
                        <div className="col-12 col-lg-4">
                            {errors.start_time && errors.start_time.message ?
                                    <small className="text-danger">{errors.start_time && errors.start_time.message}</small>
                                    : <small>{t('Start Time')}</small>}

                            <TimePicker
                                format="h:m a"
                                className="form-control"
                                onChange={setStartTime}
                                value={starttime}
                            />
                        </div>

                        {/* End Time */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.end_time && errors.end_time.message ?
                                    <small className="text-danger">{errors.end_time && errors.end_time.message}</small>
                                    : <small>{t('End Time')}</small>}


                                <TimePicker
                                    format="h:m a"
                                    className="form-control"
                                    onChange={setEndtime}
                                    value={endtime}
                                />
                            </div>
                            
                        </div>

                        {/* Shift Name */}
                        <div className="col-12 col-lg-4">
                            <div className="form-group mb-4">
                                {errors.daily_break_duration && errors.daily_break_duration.message ?
                                    <small className="text-danger">{errors.daily_break_duration && errors.daily_break_duration.message}</small>
                                    : <small>{t('Daily Break Duration')}</small>}

                                <input
                                    type="text"
                                    className={errors.daily_break_duration ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Daily Break Duration")}
                                    {...register("daily_break_duration")}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={props.loading}
                        >{props.loading ? t("Creating ...") : t("Create")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;
