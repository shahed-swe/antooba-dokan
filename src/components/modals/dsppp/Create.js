import React, {useState} from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GrayButton, PrimaryButton } from '../../button/Index'
import DatePick from  '../../date/Index'


const Create = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit } = useForm()
    const [date, setDate] = useState(0);

    const getDate = (date) => {
        let newdate = date.getDate() + '/' +date.getMonth() + '/' + date.getFullYear()
        setDate(newdate)

    }

    // Submit Form
    const onSubmit = data => {
        const formData = {
            ...data,
            date,

        }

        props.submit(formData)
    }

    

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
                    <div><h6 className="mb-0">{t('Create Daily Sell')}</h6></div>
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

                        {/* Date */}
                        <div className="col-12 col-lg-6">
                            <small>{t('Date')}</small>
                            <DatePick
                                info={"From:"}
                                date={getDate}

                            ></DatePick>
                        </div>
                        {/* Purchase Price*/}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('Amount')}</small>

                                <input
                                    type="number"
                                    className="form-control shadow-none"
                                    placeholder={t("Enter purchase amount")}
                                    {...register("purchase")}
                                />
                            </div>
                            
                        </div>
                    </div>


                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={props.loading}
                        >{props.loading ? t("Save...") : t("Save")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;