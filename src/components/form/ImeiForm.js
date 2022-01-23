import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { FormGroup } from '../formGroup/FormGroup'
import { PrimaryButton } from '../button/Index'

export const ImeiForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, clearErrors, formState: { errors } } = useForm()
    const [separateCode, setSeparateCode] = useState({ is_code_separate: props.data.is_code_separate || 0 })
    const [codeItems, setCodeItems] = useState([])

    useEffect(() => {
        if (props.data && props.data.quantity && !props.data.codes.length) {
            setCodeItems([...Array(props.data.quantity).keys()])
        }

        if (props.data && props.data.quantity && props.data.codes.length) {
            setCodeItems(props.data.codes)
        }
    }, [props])

    // Submit Form
    const onSubmit = async (data) => {
        clearErrors()
        const formData = {
            productId: props.data.uid,
            dokan_uid: localStorage.getItem("dokanuid"),
            is_code_separate: separateCode.is_code_separate,
            product_code: separateCode.is_code_separate === 0 ? data.product_code : null,
            codes: separateCode.is_code_separate ? data.codes : [],
            _method: "PUT"
        }
        props.onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Product */}
            <FormGroup>
                <Text className="text-capitalize fs-13 mb-1">{t('Product')}</Text>

                <input
                    type="text"
                    placeholder="Product"
                    className="form-control shadow-none"
                    defaultValue={props.data && props.data.name ? props.data.name : null}
                    readOnly
                />
            </FormGroup>

            {/* Single IMEI Code */}
            {!separateCode.is_code_separate ?
                <FormGroup>
                    {errors.product_code && errors.product_code.message ?
                        <Text className="text-danger fs-13 mb-1">{errors.product_code && errors.product_code.message}</Text> :
                        <Text className="text-capitalize fs-13 mb-1">{t('IMEI Code')}</Text>
                    }

                    <input
                        type="text"
                        placeholder="Enter code"
                        className="form-control shadow-none"
                        defaultValue={props.data && props.data.product_code ? props.data.product_code : null}
                        {...register("product_code", {
                            required: t("IMEI code is required")
                        })}
                    />
                </FormGroup>
                : null
            }

            {/* IMEI code checkbox */}
            <FormGroup>
                <Form.Check
                    custom
                    type="checkbox"
                    id="custom-checkbox-IMEI"
                    label="Separate Code / IMEI"
                    style={{ fontSize: 13 }}
                    defaultChecked={separateCode.is_code_separate === 1 ? true : false}
                    onChange={() => setSeparateCode({
                        ...separateCode,
                        is_code_separate: separateCode.is_code_separate === 0 ? 1 : 0
                    })}
                />
            </FormGroup>

            {/* IMEI code inputs */}
            {separateCode.is_code_separate ?
                <div>
                    {codeItems.map((item, key) =>
                        <FormGroup key={key}>
                            {errors.codes?.[key]?.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.codes[key].message}</Text> :
                                <Text className="text-capitalize fs-13 mb-1">{t('IMEI Code')}</Text>
                            }

                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Enter IMEI code"
                                defaultValue={item.code ? item.code : null}
                                {...register(`codes.${key}`, { required: "IMEI Code is required." })}
                            />
                        </FormGroup>
                    )}
                </div>
                : null
            }

            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >
                    {props.loading ? "SAVING..." : "SAVE CHANGES"}
                </PrimaryButton>
            </div>
        </form>
    )
}