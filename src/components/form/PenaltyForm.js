import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../button/Index'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const PenaltyForm = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Submit Form
    const onSubmit = async data => props.submit(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container.Row>

                {/* Penalty Name */}
                <Container.Column>
                    <FormGroup>
                        {errors.name && errors.name.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Penalty Name')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter penalty name")}
                            {...register("name", { required: "Penalty name is required." })}
                            defaultValue={props.penalty && props.penalty.name ? props.penalty.name : null}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Penalty Title */}
                <Container.Column>
                    <FormGroup>
                        {errors.title && errors.title.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.title && errors.title.message}</Text> :
                            <Text className="text-capitalize fs-13 mb-1">{t('Penalty Title')}</Text>
                        }

                        <input
                            type="text"
                            className={errors.title ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter penalty title")}
                            {...register("title", { required: "Penalty title is required." })}
                            defaultValue={props.penalty && props.penalty.title ? props.penalty.title : null}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Penalty Amount */}
                <Container.Column>
                    <FormGroup>
                        {errors.amount && errors.amount.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.amount && errors.amount.message}</Text> :
                            <Text className="fs-13 mb-1">{t('Penalty Amount')}</Text>
                        }

                        <input
                            type="number"
                            step=".01"
                            min={0}
                            className={errors.amount ? "form-control shadow-none error" : "form-control shadow-none"}
                            placeholder={t("Enter penalty amount")}
                            defaultValue={props.penalty && props.penalty.amount ? props.penalty.amount : null}
                            {...register("amount", { required: "Penalty amount is required." })}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Penalty description */}
                <Container.Column>
                    <FormGroup>
                        {errors.description && errors.description.message ?
                            <Text className="text-danger fs-13 mb-1">{errors.description && errors.description.message}</Text>
                            : <Text className="fs-13 mb-0">{t(" Description")} <span className='text-muted'> (optional)</span> </Text>}

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
                            defaultValue={props.penalty && props.penalty.description ? props.penalty.description : ""}
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