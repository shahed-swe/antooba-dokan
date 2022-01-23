import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { useForm } from 'react-hook-form'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { isValidPhone, isValidEmail } from "../../utils/_heplers";
import './style.scss'

export const SupplierForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const supplier = props.supplier ?? {};
    const { submit, loading, create } = props
    const [moreInfo, setMoreInfo] = useState(false);


    useEffect(() => {
        if (create === false) {
            setMoreInfo(true);
        }
    }, [create]);



    return (
        <form onSubmit={handleSubmit(submit)}>
            <Container.Row>
                {moreInfo ? (
                    <Container.Column>
                        <FormGroup>
                            {errors.name && errors.name.message ? (
                                <Text className="text-danger fs-13 mb-1">
                                    {errors.name && errors.name.message}
                                </Text>
                            ) : (
                                <Text className="text-capitalized fs-13 mb-1">
                                    {t("Name")} <span className="text-danger">*</span>
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
                                    supplier && supplier.name
                                        ? supplier.name
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
                                    {t("Name")} <span className="text-danger">*</span>
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
                                    supplier && supplier.name
                                        ? supplier.name
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
                                {t("Phone No")} <span className="text-danger">*</span>
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
                                supplier && supplier.phone ? supplier.phone : ""
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

                {moreInfo ?
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
                                        supplier && supplier.email
                                            ? supplier.email
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

                        {/* Note */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0"> {t('Note')} </Text>

                                <textarea
                                    rows={3}
                                    className={errors.note ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter Short Note"
                                    defaultValue={supplier.note}
                                    {...register("note")}
                                />
                            </FormGroup>
                        </Container.Column>


                        {/* Address */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0"> {t('Address')} </Text>

                                <textarea
                                    rows={3}
                                    className={errors.address ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Supplier Address"
                                    defaultValue={supplier.address}
                                    {...register("address")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Street Line 1 */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Street Line First</Text>

                                <input
                                    type="text"
                                    className={errors.street_line1 ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Street Address 1"
                                    defaultValue={supplier.street_line1}
                                    {...register("street_line1")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Street Line 2 */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Street Line Second</Text>

                                <input
                                    type="text"
                                    className={errors.street_line2 ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Street Address 2"
                                    defaultValue={supplier.street_line2}
                                    {...register("street_line2")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* ZIP/Post code */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t('ZIP / Post code')}</Text>

                                <input
                                    type="text"
                                    className={errors.zip ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="ZIP / Post code"
                                    defaultValue={supplier.zip}
                                    {...register("zip")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* District / City */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t('District / City')}</Text>

                                <input
                                    type="text"
                                    className={errors.city ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="District / City"
                                    defaultValue={supplier.city}
                                    {...register("city")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Division / State */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t('Division / State')}</Text>

                                <input
                                    type="text"
                                    className={errors.state ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Division / State"
                                    defaultValue={supplier.state}
                                    {...register("state")}
                                />
                            </FormGroup>
                        </Container.Column>


                        {/* Country */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t('Country')}</Text>

                                <input
                                    type="text"
                                    className={errors.country ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Country"
                                    defaultValue={supplier.country}
                                    {...register("country")}
                                />
                            </FormGroup>
                        </Container.Column>


                        {/* Total Purchase */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Total Purchased </Text>
                                <input
                                    type="number"
                                    step=".01"
                                    min="0"
                                    className={errors.total_purchase ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total purchase price"
                                    defaultValue={supplier.total_purchase}
                                    {...register("total_purchase")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Total Due */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Total Due</Text>
                                <input
                                    type="number"
                                    step=".01"
                                    className={errors.total_due ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total due money"
                                    defaultValue={supplier.total_due}
                                    {...register("total_due")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Total Paid */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Total Paid</Text>
                                <input
                                    type="number"
                                    step=".01"
                                    min="0"
                                    className={errors.total_paid ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total paid money"
                                    defaultValue={supplier.total_paid}
                                    {...register("total_paid")}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* Total Advance */}
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">Total Advance Taken</Text>
                                <input
                                    type="number"
                                    min="0"
                                    step=".01"
                                    className={errors.total_advance_taken ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder="Enter total advance taken money"
                                    defaultValue={supplier.total_advance_taken}
                                    {...register("total_advance_taken")}
                                />
                            </FormGroup>
                        </Container.Column>
                    </> : null}


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
                                        "More info of supplier for extra security"
                                    )}
                                </label>
                            </div>
                        </FormGroup>
                    </Container.Column>
                ) : null}



                <Container.Column className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={loading}
                    >
                        {
                            props.supplier ?
                                <span>{loading ? "Updating ..." : "Update"}</span>
                                :
                                <span>{loading ? "Creating ..." : "Create"}</span>
                        }
                    </PrimaryButton>
                </Container.Column>
            </Container.Row>
        </form>
    );

}
