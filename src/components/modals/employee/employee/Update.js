import React,{useState, useEffect, useCallback} from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GrayButton, PrimaryButton } from '../../../button/Index'
import { Requests } from '../../../../utils/Http/Index'
import SingleSelect from '../../../select/Single'
import Toast from '../../../Toaster/Index'
import { FileUploader } from '../../../fileUploader/Index'
import { isValidEmail, isValidPhone } from '../../../../utils/_heplers'
import { location } from "../../../../utils/_locationHelper";

const Create = (props) => {
    
    const { t } = useTranslation()
    const {uid,name,phone, email,image, nid_front_scan_copy, nid_back_scan_copy, shift,street_address,zip_code, nid,age, advance_taken, monthly_salary, overtime_rate } = props.employee


    const { register, handleSubmit,setValue,setError, clearErrors, formState: { errors } } = useForm({
        defaultValues:{
            shift_uid: shift ? shift.uid : null
        }
    })

    const shifts = props.shifts && props.shifts.map((item) => {
        return {
            label: item.title,
            value: item.uid,
        }
    })
    const [postOffice, setPostOffice] = useState('')
    const [upazila, setUpazila] = useState('')
    const [district, setDistrict] = useState('')
    const [division, setDivision] = useState('')
    const [employeeupdating, setEmployeeupdating] = useState(false)


    const changeLocation = useCallback( (data) => {
        if(data > 3){
            let address = location(data)
            setDistrict(address.district)
            setDivision(address.division)
            setUpazila(address.upazila)
            setPostOffice(address.postOffice)
            setValue('post_office', address.postOffice)
            setValue('upzilla', address.upazila)
            setValue('district', address.district)
            setValue('division', address.division)
        }
    }, [setValue])

    useEffect(() => {

        changeLocation(zip_code ? zip_code.toString() : null)
        
    } , [changeLocation, zip_code])

    // Submit Form
    const onSubmit = async data => {

        setEmployeeupdating(true)
        clearErrors();
        let formData = new FormData();
        formData.append('name', data.name)
        formData.append('phone', data.phone)
        formData.append('email', data.email)
        formData.append('age', data.age)
        if(data.image !== "undefined" || data.image !== "null"){
            formData.append('image', data.image)
        }
        if(data.nid_front !== "undefined" || data.nid_front !== "null"){
            formData.append('nid_front', data.nid_front)
        }
        if(data.nid_back !== "undefined" || data.nid_back !== "null"){
            formData.append('nid_back',data.nid_back)
        }
        if(data.shift_uid !== "undefined" || data.shift_uid !== "null"){
            formData.append('shift_uid', data.shift_uid)
        }
        
        formData.append('nid', data.nid)
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('street_address',data.street_address)
        formData.append('zip_code', data.zip_code)
        formData.append('upzilla', data.upzilla)
        formData.append('district', data.district)
        formData.append('state', data.state)
        formData.append('monthly_salary', data.monthly_salary)
        formData.append('overtime_rate', data.overtime_rate)
        formData.append('advance_taken', data.advance_taken)
        formData.append('_method',"PUT")

        const res = await Requests.EmployeeUpdate(formData, uid)
        if(res.status === 200){
            Toast.fire({
                icon: 'success',
                title: 'Employee Updated Successfully'
            })
            props.handleUpdate(true)
            setEmployeeupdating(true)
        }else{
            Toast.fire({
                icon: 'error',
                title: 'Employee Updating Unsuccessfully'
            })
            setEmployeeupdating(true)
            Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
            });
        }
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
                    <div><h6 className="mb-0">{t('Create Employee')}</h6></div>
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
                                                {/* Name */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.name && errors.name.message ?
                                    <small className="text-danger">{errors.name && errors.name.message}</small>
                                    : <small>{t('Employee name')}</small>}

                                <input
                                    type="text"
                                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Name")}
                                    defaultValue={name}
                                    {...register("name")}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.phone && errors.phone.message ?
                                    <small className="text-danger">{errors.phone && errors.phone.message}</small>
                                    : <small style={{ textTransform: "capitalize" }}>{t("phone")}</small>}
                                <input
                                    type="text"
                                    className={errors.phone ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="01xxxxxxxxx"
                                    defaultValue={phone}
                                    {...register("phone", {
                                        pattern: {
                                            value: isValidPhone(),
                                            message: "Invalid phone number"
                                        }
                                    })}
                                />
                            </div>
                        </div>


                        {/* E-mail */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.email && errors.email.message ?
                                    <small className="text-danger">{errors.email && errors.email.message}</small>
                                    : <small style={{ textTransform: "capitalize" }}>{t("email")}</small>}

                                <input
                                    type="text"
                                    className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="example@gmail.com"
                                    defaultValue={email}
                                    {...register("email", {
                                        pattern: {
                                            value: isValidEmail(),
                                            message: "Invalid e-mail address"
                                        }
                                    })}
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="col-12 col-lg-4">
                            <FileUploader
                                imageURL={image}
                                error={errors.image ? errors.image.message : ""}
                                width={80}
                                height={80}
                                limit={100}
                                title={t("Employee Profile")}
                                dataHandeller={(data) => setValue('image',data.image)}
                            />
                        </div>

                        {/* Age */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.age && errors.age.message ?
                                    <small className="text-danger">{errors.age && errors.age.message}</small>
                                    : <small>{t('Age')}</small>}

                                <input
                                    type="text"
                                    className={errors.age ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Age")}
                                    {...register("age")}
                                    defaultValue={age}
                                />
                            </div>
                        </div>

                        {/* NID */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.nid && errors.nid.message ?
                                    <small className="text-danger">{errors.nid && errors.nid.message}</small>
                                    : <small>{t('NID')}</small>}

                                <input
                                    type="text"
                                    className={errors.nid ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter NID")}
                                    {...register("nid")}
                                    defaultValue={nid}
                                />
                            </div>
                        </div>

                        {/* NID Front Page file update */}
                        <div className="col-12 col-lg-6">
                            <FileUploader
                                imageURL={nid_front_scan_copy}
                                error={errors.image ? errors.image.message : ""}
                                width={80}
                                height={80}
                                limit={100}
                                title={t("NID First Page")}
                                dataHandeller={(data) => setValue('nid_front',data.image)}
                            />
                        </div>


                        {/* NID Back Page File Update */}
                        <div className="col-12 col-lg-6">
                            <FileUploader
                                imageURL={nid_back_scan_copy}
                                error={errors.image ? errors.image.message : ""}
                                width={80}
                                height={80}
                                limit={100}
                                title={t("NID Second Page")}
                                dataHandeller={(data) => setValue('nid_back',data.image)}
                            />
                        </div>

                        {/* Shift Select */}
                        <div className="col-12 col-lg-6">
                            {errors.shift_uid && errors.shift_uid.message ?
                                    <small className="text-danger">{errors.shift_uid && errors.shift_uid.message}</small>
                                    : <small>{t('Shift')}</small>}
                            <SingleSelect
                                placeholder="select shift"
                                options={shifts}
                                default={shift ? {value: shift.uid, label: shift.title} : {value: null, label:null}}
                                value={event => setValue('shift_uid',event.value)}
                            />
                        </div>


                        {/* Monthly Salary */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.monthly_salary && errors.monthly_salary.message ?
                                    <small className="text-danger">{errors.monthly_salary && errors.monthly_salary.message}</small>
                                    : <small>{t('Monthly Salary')}</small>}

                                <input
                                    type="text"
                                    className={errors.monthly_salary ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Monthly Salary")}
                                    {...register("monthly_salary")}
                                    defaultValue={monthly_salary}
                                />
                            </div>
                        </div>

                        {/* Over Time Rate */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.overtime_rate && errors.overtime_rate.message ?
                                    <small className="text-danger">{errors.overtime_rate && errors.overtime_rate.message}</small>
                                    : <small>{t('Over Time Rate')}</small>}

                                <input
                                    type="text"
                                    className={errors.overtime_rate ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Over Time Rate")}
                                    {...register("overtime_rate")}
                                    defaultValue={overtime_rate}
                                />
                            </div>
                        </div>

                        {/* Advance Taken */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.advance_taken && errors.advance_taken.message ?
                                    <small className="text-danger">{errors.advance_taken && errors.advance_taken.message}</small>
                                    : <small>{t('Advance Taken Money')}</small>}

                                <input
                                    type="text"
                                    className={errors.advance_taken ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter over Time Rate")}
                                    {...register("advance_taken")}
                                    defaultValue={advance_taken}
                                />
                            </div>
                        </div>


                        {/* Street Address */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('Street address')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Street address")}
                                    {...register("street_address")}
                                    defaultValue={street_address}
                                />
                            </div>
                        </div>

                        {/* ZIP/Post code */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('ZIP / Post code')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("ZIP / Post code")}
                                    onKeyUp={event => changeLocation(event.target.value)}
                                    defaultValue={zip_code}
                                    {...register("zip_code")}
                                />
                            </div>
                        </div>

                        {/* Post office */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('Post office')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Post office")}
                                    {...register("post_office")}
                                    value={postOffice}
                                />
                            </div>
                        </div>

                        {/* Upzila */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('Upzila')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Upzila")}
                                    {...register("upzilla")}
                                    value={upazila}
                                />
                            </div>
                        </div>

                        {/* District / City */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('District / City')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder="District / City"
                                    {...register("district")}
                                    value={district}
                                />
                            </div>
                        </div>

                        {/* Division / State */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                <small>{t('Division / State')}</small>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Division / State")}
                                    {...register("division")}
                                    value={division}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={employeeupdating}
                        >{employeeupdating ? t("Updating ...") : t("Update")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;
