import React, { useEffect, useState } from "react";
import { DatePicker } from '../datePicker/Index'
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../button/Index";
import { FileUploader } from "../fileUploader/Index";
import { isValidEmail, isValidPhone } from "../../utils/_heplers";
import { Container } from "../container/Index";
import { FormGroup } from "../formGroup/FormGroup";
import { Text } from "../text/Text";
import { SingleSelect } from '../select/Index'
import { postCodeList, location } from "../../utils/_locationHelper";

export const CustomerForm = (props) => {
    const { t } = useTranslation();
    const { register, handleSubmit, setValue, clearErrors, setError, reset, formState: { errors } } = useForm()
    const [postCode, setPostCode] = useState(null)
    const [postOffice, setPostOffice] = useState(null)
    const [upazila, setUpazila] = useState(null)
    const [district, setDistrict] = useState(null)
    const [division, setDivision] = useState(null)
    const [last_payback, setDate] = useState(new Date());
    const [isLoading, setLoading] = useState(true)
    const { create, loading } = props ?? {}
    // for checking customer
    const [moreInfo, setMoreInfo] = useState(false);
    const customer = props.customerdata ?? {};




    // Submit Form
    const onSubmit = async (data) => {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        formData.append("email", data.email ?? "");
        formData.append("nid", data.nid ?? "");
        if (data.nid_front != null && data.nid_front !== "undefined") {
            formData.append("nid_front", data.nid_front);
        }
        if (data.nid_back != null && data.nid_back !== "undefined") {
            formData.append("nid_back", data.nid_back);
        }

        if (data.image != null && data.image !== "undefined") {
            formData.append("image", data.image);
        }
        formData.append("total_purchase", data.total_purchase ?? "");
        formData.append("total_due", data.total_due ?? "");
        formData.append("last_payback", last_payback);
        formData.append("zip_code", postCode ?? "");
        formData.append("post_office", postOffice ?? "");
        formData.append("street_address", data.street_address ?? "");
        formData.append("upzilla", upazila ?? "");
        formData.append("district", district ?? "");
        formData.append("state", division ?? "");
        formData.append("note", data.note ?? "");
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
        <>
            {isLoading ? <span>Loading...</span> :
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
                                            {t("Name")} <span className="text-danger"> *</span>
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
                                            customer && customer.name
                                                ? customer.name
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
                                            {t("Name")} <span className="text-danger"> *</span>
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
                                            customer && customer.name
                                                ? customer.name
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
                                        customer && customer.phone ? customer.phone : ""
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

                        {moreInfo ? (
                            <>

                                {/* E-mail */}
                                <Container.Column className="col-lg-6">
                                    <FormGroup>
                                        {errors.email && errors.email.message ? (
                                            <Text className="text-danger fs-13 mb-1">
                                                {errors.email && errors.email.message}
                                            </Text>
                                        ) : (
                                            <Text className="text-capitalize fs-13 mb-1">
                                                {t("E-mail")}
                                            </Text>
                                        )}

                                        <input
                                            type="text"
                                            className={
                                                errors.email
                                                    ? "form-control shadow-none error"
                                                    : "form-control shadow-none"
                                            }
                                            placeholder="example@gmail.com"
                                            defaultValue={
                                                customer && customer.email
                                                    ? customer.email
                                                    : ""
                                            }
                                            {...register("email", {
                                                pattern: {
                                                    value: isValidEmail(),
                                                    message: t("Invalid email address"),
                                                },
                                            })}
                                        />
                                    </FormGroup>
                                </Container.Column>


                                {/* Purchase */}
                                <Container.Column className="col-lg-6">
                                    <FormGroup>
                                        <Text className="text-capitalize fs-13 mb-1">
                                            {t("Earlier Purchase")}
                                        </Text>

                                        <input
                                            type="number"
                                            step=".01"
                                            min={0}
                                            className="form-control shadow-none"
                                            placeholder={t("Enter purchase amount")}
                                            defaultValue={
                                                customer && customer.total_purchase
                                                    ? customer.total_purchase
                                                    : ""
                                            }
                                            {...register("total_purchase")}
                                        />
                                    </FormGroup>
                                </Container.Column>

                                {/* Due */}
                                <Container.Column className="col-lg-6">
                                    <FormGroup>
                                        <small>{t("Earlier Due")}</small>

                                        <input
                                            type="number"
                                            step=".01"
                                            min={0}
                                            className="form-control shadow-none"
                                            placeholder={t("Enter due amount")}
                                            defaultValue={
                                                customer && customer.total_due
                                                    ? customer.total_due
                                                    : ""
                                            }
                                            {...register("total_due")}
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
                                                customer && customer.nid
                                                    ? customer.nid
                                                    : ""
                                            }
                                            {...register("nid")}
                                        />
                                    </FormGroup>
                                </Container.Column>

                                {/* Date Time */}
                                <Container.Column className="col-lg-6">
                                    <FormGroup>
                                        {errors.date && errors.date.message ?
                                            <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
                                            <Text className="text-capitalize fs-13 mb-1">{t('Last Payment Date')}</Text>
                                        }
                                        <DatePicker
                                            selected={data => setDate(data)}
                                            deafultValue={last_payback}
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
                                                customer && customer.street_address
                                                    ? customer.street_address
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

                                {/* Note */}
                                <Container.Column className="col-lg-12">
                                    <FormGroup>
                                        <Text className="text-capitalized fs-13 mb-1">
                                            {t("Note")}
                                        </Text>

                                        <textarea
                                            rows={4}
                                            className="form-control shadow-none"
                                            placeholder={t("Write note ...")}
                                            defaultValue={
                                                customer && customer.note
                                                    ? customer.note
                                                    : ""
                                            }
                                            {...register("note")}
                                        />
                                    </FormGroup>
                                </Container.Column>

                                <Container.Column className="col-lg-6">

                                    {/* Image */}
                                    <FileUploader
                                        imageURL={
                                            customer && customer.image
                                                ? customer.image
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

                                    {/* NID Front Page file update */}
                                    <FileUploader
                                        imageURL={
                                            customer && customer.nid_front_scan_copy
                                                ? customer.nid_front_scan_copy
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

                                    {/* NID Back Page File Update */}
                                    <FileUploader
                                        imageURL={
                                            customer && customer.nid_back_scan_copy
                                                ? customer.nid_back_scan_copy
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
                                                "More info of customer for extra security"
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
                </form>}
        </>
    );
};
