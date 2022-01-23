import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { Toastify } from '../toastify/Toastify'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'
import { SingleSelect } from '../select/Index'
import { postCodeList } from '../../utils/_locationHelper'
import { Requests } from '../../utils/Http/Index'

export const Location = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
    const [isLoading, setLoading] = useState(true)
    const [isUpdating, setUpdating] = useState(false)
    const [postCode, setPostCode] = useState(null)
    const [postOffice, setPostOffice] = useState(null)
    const [upazila, setUpazila] = useState(null)
    const [district, setDistrict] = useState(null)
    const [division, setDivision] = useState(null)

    useEffect(() => {
        if (props.location && props.location.setting) {
            setPostCode(props.location.setting.post_code)
            setPostOffice(props.location.setting.post_office)
            setUpazila(props.location.setting.upzilla)
            setDistrict(props.location.setting.district)
            setDivision(props.location.setting.division)
        }

        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [props])

    // handle submit
    const onSubmit = async (data) => {
        try {
            if (!postCode) {
                return setError("postCode", {
                    type: "manual",
                    message: "ZIP / Post code is required.",
                })
            }

            const formData = {
                street_address: data.streetAddress,
                post_office: postOffice,
                post_code: postCode,
                upzilla: upazila,
                district: district,
                division: division
            }

            clearErrors()
            setUpdating(true)

            const response = await Requests.Settings.DokanLocationUpdate(formData)
            if (response && response.status === 200) {
                Toastify.Success("Saved Your location settings.")
            }
            setUpdating(false)
        } catch (error) {
            if (error) {
                setUpdating(false)

                if (error && error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: "manual",
                            message: error.response.data.errors[key][0]
                        })
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    return (
        <div>
            {isLoading ? <p>Loading...</p> :
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Street Address */}
                    <FormGroup>
                        {errors.streetAddress && errors.streetAddress.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.streetAddress && errors.streetAddress.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Street address')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.streetAddress ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Street address")}
                            defaultValue={props.location.setting.street_address}
                            {...register("streetAddress", { required: t("Street address is required") })}
                        />
                    </FormGroup>

                    {/* ZIP/Post code */}
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

                    {/* Post office */}
                    <FormGroup>
                        {errors.postOffice && errors.postOffice.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.postOffice && errors.postOffice.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Post office')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.postOffice ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Post office")}
                            defaultValue={postOffice}
                            readOnly
                        />
                    </FormGroup>

                    {/* Upzila */}
                    <FormGroup>
                        {errors.upzila && errors.upzila.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.upzila && errors.upzila.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Upzila')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.upzila ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="Upzila"
                            defaultValue={upazila}
                            readOnly
                        />
                    </FormGroup>

                    {/* District / City */}
                    <FormGroup>
                        {errors.districtCity && errors.districtCity.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.districtCity && errors.districtCity.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('District / City')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.districtCity ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="District / City"
                            defaultValue={district}
                            readOnly
                        />
                    </FormGroup>

                    {/* Division / State */}
                    <FormGroup>
                        {errors.divisionState && errors.divisionState.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.divisionState && errors.divisionState.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Division / State')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.divisionState ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder="Division / State"
                            defaultValue={division}
                            readOnly
                        />
                    </FormGroup>

                    {/* Submit button */}
                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={isUpdating}
                        >{isUpdating ? t("Saving ...") : t("Save Changes")}</PrimaryButton>
                    </div>
                </form>
            }
        </div>
    )
}