import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'


export const CategoryUpdateForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [subcateoption, setSubCatOption] = useState(props.subcat ?? false)

    const onSubmit = async data => {
        let newData = {}

        if (props.update) {
            newData = {
                ...data,
                uid: props.categorydata.uid,
                category_uid: props.categorydata.category_uid,
                _method: 'PUT'
            }
        }

        props.submit(newData)
    }

    const styles = {
        pointer: {
            cursor: "pointer"
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Name */}
            <FormGroup>
                {errors.name && errors.name.message ?
                    <Text className="text-danger fs-13 mb-0">{errors.name && errors.name.message}</Text>
                    : <Text className="fs-13 mb-0">{t('Category Name')}</Text>}

                <input
                    type="text"
                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder={t("Enter Category name")}
                    defaultValue={props.categorydata ? props.categorydata.name : ""}
                    {...register("name")}
                />
            </FormGroup>


            {/* Description */}
            <FormGroup>
                {errors.description && errors.description.message ?
                    <Text className="text-danger fs-13 mb-0">{errors.description && errors.description.message}</Text>
                    : <Text className="fs-13 mb-0">{t('Description')}</Text>}
                <textarea
                    rows={5}
                    className={errors.description ? "form-control shadow-none error" : "form-control shadow-none"}
                    placeholder={t("Enter Category description")}
                    defaultValue={props.categorydata ? props.categorydata.description : ""}
                    {...register("description")}
                />
            </FormGroup>

            {props.update === true || props.onlyCategory === true ? null :
                <>
                    {/* sub category option */}
                    <FormGroup>
                        {props.onlyCategory === false ? <Text className="form-check-label fs-13 mb-0" htmlFor="flexCheckDefault21" style={styles.pointer}>
                            {t("Select Parent Category")}
                        </Text> :
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={subcateoption || props.onlyCategory === false ? true : false}
                                    onChange={() => { setSubCatOption(!subcateoption) }}
                                    style={styles.pointer} id="flexCheckDefault21"
                                />
                                <Text className="form-check-label fs-13 mb-0" htmlFor="flexCheckDefault21" style={styles.pointer}>
                                    {t("Select Parent Category")}
                                </Text>
                            </div>}
                    </FormGroup>


                </>}

            {/* Submit button */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="px-4"
                    disabled={props.loading}
                >{props.loading ? t("Submitting ...") : t("Submit")}</PrimaryButton>
            </div>


        </form>
    );
}
