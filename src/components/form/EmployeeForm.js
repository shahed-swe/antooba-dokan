import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../button/Index";
import { FileUploader } from "../fileUploader/Index";
import { isValidEmail, isValidPhone } from "../../utils/_heplers";
import { useForm } from "react-hook-form";
import { Container } from "../container/Index";
import { FormGroup } from "../formGroup/FormGroup";
import { Text } from "../text/Text";
import { SingleSelect } from "../select/Index";
import { postCodeList, location } from "../../utils/_locationHelper";
import { DatePicker } from '../datePicker/Index'
import { dateFormate } from '../../utils/_heplers'

export const EmployeeForm = (props) => {
    const { t } = useTranslation();
    const employee = props.employeedata ?? {};
    const [date, setDate] = useState(employee && employee.join_date ? employee.join_date : new Date());
    const { register, handleSubmit, setValue, clearErrors, setError, formState: { errors } } = useForm(
        {
            defaultValues: {
                shift_uid: employee.shift_uid
            }
        }
    )

    const [isLoading, setLoading] = useState(true)
    const [postCode, setPostCode] = useState(null)
    const [postOffice, setPostOffice] = useState(null)
    const [upazila, setUpazila] = useState(null)
    const [district, setDistrict] = useState(null)
    const [division, setDivision] = useState(null)
    const { create, loading } = props;
    // for checking employee
    const [moreInfo, setMoreInfo] = useState(false);

    //Shifts Options
    const shifts = props.shifts && props.shifts.map((item) => {
        return {
            label: item.title,
            value: item.uid
        }
    })


    // Submit Form
    const onSubmit = async (data) => {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        formData.append("email", data.email ?? '');
        formData.append("nid", data.nid ?? '');
        if (moreInfo === true) {
            formData.append("join_date", dateFormate(date))

        }
        formData.append("age", data.age ?? '');
        if (data.nid_front != null && data.nid_front !== "undefined") {
            formData.append("nid_front", data.nid_front);
        }
        if (data.nid_back != null && data.nid_back !== "undefined") {
            formData.append("nid_back", data.nid_back);
        }

        if (data.image != null && data.image !== "undefined") {
            formData.append("image", data.image);
        }
        if (data.shift_uid !== "undefined" || data.shift_uid !== "null") {
            formData.append('shift', data.shift_uid)
        }
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('street_address', data.street_address ?? '')
        formData.append('zip_code', data.zip_code ?? '')
        formData.append('upzilla', data.upzilla ?? '')
        formData.append('district', data.district ?? '')
        formData.append('state', data.state ?? '')
        formData.append('monthly_salary', data.monthly_salary ?? '')
        formData.append('overtime_rate', data.overtime_rate ?? '')
        formData.append('advance_taken', data.advance_taken ?? '')
        if (create === false) {
            formData.append("_method", "PUT");
        }
        formData.append("dokan_uid", localStorage.getItem("dokanuid"));
        props.submit(formData);
    };

    useEffect(() => {
        if (props.customerdata && props.customerdata.zip_code) {
            let address = location(props.customerdata.zip_code.toString())
            setPostCode(props.customerdata.zip_code)
            setPostOffice(address.postOffice)
            setUpazila(address.upazila)
            setDistrict(address.district)
            setDivision(address.division)
        }

        if (create === false) {
            setMoreInfo(true);
        }

        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [props, create])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>
                {/* Name */}
                {moreInfo ? (
                    <Container.Column>
                        <FormGroup>
                            {errors.name && errors.name.message ? (
                                <Text className="text-danger fs-13 mb-1">
                                    {errors.name && errors.name.message}
                                </Text>
                            ) : (
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Name")}<span className="text-danger"> *</span>
                                </Text>
                            )}

                            <input
                                type="text"
                                className={
                                    errors.name
                                        ? "form-control shadow-none error"
                                        : "form-control shadow-none"
                                }
                                placeholder={t("Enter name")}
                                defaultValue={
                                    employee && employee.name
                                        ? employee.name
                                        : ""
                                }
                                {...register("name", {
                                    required: t("Name is required"),
                                })}
                            />
                        </FormGroup>
                    </Container.Column>
                ) : (
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.name && errors.name.message ? (
                                <Text className="text-danger fs-13 mb-1">
                                    {errors.name && errors.name.message}
                                </Text>
                            ) : (
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Name")}<span className="text-danger"> *</span>
                                </Text>
                            )}

                            <input
                                type="text"
                                className={
                                    errors.name
                                        ? "form-control shadow-none error"
                                        : "form-control shadow-none"
                                }
                                placeholder={t("Enter name")}
                                defaultValue={
                                    employee && employee.name
                                        ? employee.name
                                        : ""
                                }
                                {...register("name", {
                                    required: t("Name is required"),
                                })}
                            />
                        </FormGroup>
                    </Container.Column>
                )}

                {/* Phone */}
                <Container.Column className="col-lg-6">
                    <FormGroup>
                        {errors.phone && errors.phone.message ? (
                            <Text className="text-danger fs-13 mb-1">
                                {errors.phone && errors.phone.message}
                            </Text>
                        ) : (
                            <Text className="text-capitalized fs-13 mb-1">
                                {t("Phone No")} <span className="text-danger"> *</span>
                            </Text>
                        )}

                        <input
                            type="text"
                            className={
                                errors.phone
                                    ? "form-control shadow-none error"
                                    : "form-control shadow-none"
                            }
                            placeholder="01XXXXXXXXX"
                            defaultValue={
                                employee && employee.phone ? employee.phone : ""
                            }
                            {...register("phone", {
                                required: t("Phone is required"),
                                pattern: {
                                    value: isValidPhone(),
                                    message: t("Invalid phone number"),
                                },
                            })}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Employee shift */}
                <Container.Column className="col-lg-6">
                    <FormGroup>
                        {errors.shift_uid && errors.shift_uid.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.shift_uid && errors.shift_uid.message}</Text>
                            : <Text className="fs-13 mb-1">{t('Shift')} <span className="text-danger"> *</span></Text>}
                        <SingleSelect
                            placeholder="select shift"
                            options={shifts}
                            deafult={employee && employee.shift ?
                                {
                                    label: employee.shift.title,
                                    value: employee.shift.uid
                                } : null
                            }

                            value={event => setValue('shift_uid', event.value)}
                        />
                    </FormGroup>
                </Container.Column>

                {moreInfo ? (
                    <>
                        {/* Email */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>


                                {errors.email && errors.email.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.email && errors.email.message}</Text>
                                    : <Text className="fs-13 mb-1">{t("email")}</Text>}

                                <input
                                    type="text"
                                    className={errors.email ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="example@gmail.com"
                                    defaultValue={
                                        employee && employee.email
                                            ? employee.email
                                            : null
                                    }
                                    {...register("email", {
                                        pattern: {
                                            value: isValidEmail(),
                                            message: "Invalid e-mail address"
                                        }
                                    })}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Age */}
                        <Container.Column className="col-lg-3">
                            <FormGroup>
                                {errors.age && errors.age.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.age && errors.age.message}</Text>
                                    : <Text className="fs-13 mb-1">{t('Age')}</Text>}

                                <input
                                    type="number"
                                    className={errors.age ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Age")}
                                    defaultValue={
                                        employee && employee.age
                                            ? employee.age
                                            : null
                                    }
                                    {...register("age")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Join Date */}
                        <Container.Column className="col-lg-3">
                            <FormGroup>
                                {errors.date && errors.date.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                                    <Text className="text-capitalize fs-13 mb-1">{t('Join Date')}</Text>
                                }
                                <DatePicker
                                    selected={data => setDate(data)}
                                    deafultValue={date}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* NID */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {errors.nid && errors.nid.message ? (
                                    <Text className="text-danger fs-13 mb-1">
                                        {errors.nid && errors.nid.message}
                                    </Text>
                                ) : (
                                    <Text className="text-capitalize fs-13 mb-1">
                                        {t("NID")}
                                    </Text>
                                )}

                                <input
                                    type="text"
                                    className={
                                        errors.nid
                                            ? "form-control shadow-none error"
                                            : "form-control shadow-none"
                                    }
                                    placeholder={t("Enter NID")}
                                    defaultValue={
                                        employee && employee.nid
                                            ? employee.nid
                                            : null
                                    }
                                    {...register("nid")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Monthly Salary */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {errors.monthly_salary && errors.monthly_salary.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.monthly_salary && errors.monthly_salary.message}</Text>
                                    : <Text className="fs-13 mb-1">{t('Monthly Salary')}</Text>}

                                <input
                                    type="number"
                                    className={errors.monthly_salary ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Monthly Salary")}
                                    defaultValue={
                                        employee && employee.overtime_rate
                                            ? employee.overtime_rate
                                            : null
                                    }
                                    {...register("monthly_salary")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Over Time Rate */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {errors.overtime_rate && errors.overtime_rate.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.overtime_rate && errors.overtime_rate.message}</Text>
                                    : <Text className="fs-13 mb-1">{t('Over Time Rate')}</Text>}

                                <input
                                    type="number"
                                    className={errors.overtime_rate ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Over Time Rate")}
                                    defaultValue={
                                        employee && employee.monthly_salary
                                            ? employee.monthly_salary
                                            : null
                                    }
                                    {...register("overtime_rate")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Advance Taken */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {errors.advance_taken && errors.advance_taken.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.advance_taken && errors.advance_taken.message}</Text>
                                    : <Text className="fs-13 mb-1">{t('Advance Taken Money')}</Text>}

                                <input
                                    type="number"
                                    className={errors.advance_taken ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter over Time Rate")}
                                    defaultValue={
                                        employee && employee.advance_taken
                                            ? employee.advance_taken
                                            : null
                                    }
                                    {...register("advance_taken")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Street Address */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Street address")}
                                </Text>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Street address")}
                                    defaultValue={
                                        employee && employee.street_address
                                            ? employee.street_address
                                            : ""
                                    }
                                    {...register("street_address")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Zip Code/ Post Code Select  */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {errors.zipPostCode && errors.zipPostCode.message ?
                                    <Text className="text-danger fs-13 mb-1">{errors.zipPostCode && errors.zipPostCode.message}</Text> :
                                    <Text className="text-capitalize fs-13 mb-1">{t('ZIP / Post code')}</Text>
                                }

                                <SingleSelect
                                    error={errors.zipPostCode}
                                    options={postCodeList()}
                                    placeholder="ZIP/Post code"
                                    deafult={postCode && postOffice ? { label: postCode + " - " + postOffice, value: postCode + " - " + postOffice } : null}
                                    value={event => {
                                        setPostCode(event.postCode)
                                        setPostOffice(event.postOffice)
                                        setUpazila(event.upazila)
                                        setDistrict(event.district)
                                        setDivision(event.division)
                                        clearErrors("postCode")
                                    }}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Post office */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Post office")}
                                </Text>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Post office")}
                                    defaultValue={postOffice}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Upzila */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Upzila")}
                                </Text>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Upzila")}

                                    defaultValue={upazila}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* District / City */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("District / City")}
                                </Text>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("District / City")}

                                    defaultValue={district}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Division / State */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Division / State")}
                                </Text>

                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder={t("Division / State")}

                                    defaultValue={division}
                                />
                            </FormGroup>
                        </Container.Column>


                        <Container.Column className="col-lg-6">
                            {/* NID Front Page file update */}
                            <FileUploader
                                imageURL={
                                    employee && employee.nid_front_scan_copy
                                        ? employee.nid_front_scan_copy
                                        : null
                                }
                                error={errors.nid_front ? errors.nid_front.message : ""}
                                width={140}
                                height={110}
                                limit={100}
                                title={t("NID First Page")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("nid_front", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("nid_front")
                                        setValue('nid_front', data.image)
                                    }
                                }
                                }
                            />
                        </Container.Column>

                        <Container.Column className="col-lg-6">

                            {/* NID Back Page File Update */}
                            <FileUploader
                                imageURL={
                                    employee && employee.nid_back_scan_copy
                                        ? employee.nid_back_scan_copy
                                        : null
                                }
                                error={errors.nid_back ? errors.nid_back.message : ""}
                                width={140}
                                height={110}
                                limit={100}
                                title={t("NID Second Page")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("nid_back", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("nid_back")
                                        setValue('nid_back', data.image)
                                    }
                                }
                                }
                            />
                        </Container.Column>
                        <Container.Column className="col-lg-6">

                            {/* Image */}
                            <FileUploader
                                imageURL={
                                    employee && employee.image
                                        ? employee.image
                                        : null
                                }
                                error={errors.image ? errors.image.message : ""}
                                width={110}
                                height={110}
                                limit={100}
                                title={t("Employee Profile")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("image", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("image")
                                        setValue('image', data.image)
                                    }
                                }
                                }
                            />
                        </Container.Column>

                    </>
                ) : null}

                {/* for more info including */}
                {create === true ? (
                    <Container.Column className="col-lg-6 pt-3">
                        <FormGroup>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={moreInfo ? true : false}
                                    onChange={() => {
                                        setMoreInfo(!moreInfo);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    id="flexCheckDefault"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                    style={{ cursor: "pointer" }}
                                >
                                    {t(
                                        "More info of employee for extra security"
                                    )}
                                </label>
                            </div>
                        </FormGroup>
                    </Container.Column>
                ) : null}
            </Container.Row>

            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={loading}
                >
                    {loading
                        ? create
                            ? t("Creating ...")
                            : t("Updating ...")
                        : create
                            ? t("Create")
                            : t("Update")}
                </PrimaryButton>
            </div>
        </form>
    );
};
