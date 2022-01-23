import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const EmployeeBonusForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = async data => console.log(data);
    //props.submit(data)
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>

                {/* Bonus Title */}
                <Container.Column>
                    <FormGroup>
                        {errors.title && errors.title.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.title && errors.title.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Bonus Title')} <span className="text-danger"> *</span></Text>
                        }

                        <input
                            type="text"
                            className={errors.title ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter bonus title")}
                            {...register("title", { required: "Bonus title is required." })}
                            defaultValue={props.bonus && props.bonus.title ? props.bonus.title : null}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Bonus Type */}
                <Container.Column>
                    <div className='d-flex'>
                        <FormGroup className="flex-fill">
                            {errors.amount && errors.amount.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.amount && errors.amount.message}</Text> :
                                <Text className="fs-13 mb-1">{t('Bonus Amount')} <span className="text-danger"> *</span></Text>
                            }

                            <input
                                type="number"
                                step=".01"
                                min={0}
                                className={errors.amount ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter bonus amount")}
                                defaultValue={props.bonus && props.bonus.amount ? props.bonus.amount : null}
                                {...register("amount", { required: "Bonus amount is required." })}
                            />
                        </FormGroup>
                        <FormGroup>
                            {errors.type && errors.type.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.type && errors.type.message}</Text> :
                                <Text className="fs-13 mb-4"></Text>
                            }
                            <select
                                className="form-control shadow-none border-0 bg-light fs-13"
                                {...register("type", { required: "Bonus type is required." })}
                            >
                                <option value={null}>Select type</option>
                                <option value="Percentage">%</option>
                                <option value="Tk">Tk</option>
                            </select>
                        </FormGroup>
                    </div>

                </Container.Column>

                {/* Bonus description */}
                <Container.Column>
                    <FormGroup>
                        {errors.description && errors.description.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.description && errors.description.message}</Text>
                            : <Text className="fs-13 mb-0">{t(" Description")} </Text>}

                        <textarea
                            rows="3"
                            className={errors.description ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Description")}
                            {...register("description", {
                                maxLength: {
                                    value: 255,
                                    message: t("The description must not be greater than 255 characters.")
                                }
                            })}
                            defaultValue={props.bonus && props.bonus.description ? props.bonus.description : ""}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Submit button */}
                <Container.Column className="text-right">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={props.loading}
                    >{props.loading ? props.isCreate ? t("Creating...") : t("Updating...") : props.isCreate ? t("Create") : t("Update")}</PrimaryButton>
                </Container.Column>
            </Container.Row>
        </form>
    );
}