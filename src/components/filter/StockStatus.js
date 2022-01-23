import React, { useState } from 'react'
import { PrimaryButton } from '../button/Index'
import { SingleSelect } from '../select/Index'
import { useTranslation } from 'react-i18next'
import { Container } from '../container/Index'
import { Requests } from '../../utils/Http/Index'

const StockStatus = (props) => {
    const [isLoading, setLoading] = useState(false)
    const [category, setCategory] = useState({ value: "", error: false })
    const [brand, setBrand] = useState({ value: "", error: false })
    const { t } = useTranslation()

    // Handle submit form
    const handleSubmit = async event => {
        try {
            event.preventDefault()
            setLoading(true)
            if (!category.value && !brand.value) {
                props.fetchData()
            } else {
                const response = await Requests.Inventory.Stock.StockStatusFilter(category.value, brand.value)
                if (response.status === 200) {
                    props.setData(response.data.data)
                }
            }

            setLoading(false)
        } catch (error) {
            if (error) props.setServerError(true)   
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Container.Row>

                {/* Category select */}
                <Container.Column className="col-lg-5">
                    <SingleSelect
                        options={props.categories || []}
                        placeholder="category"
                        deafult={category.value}
                        isClearable
                        value={event => setCategory({ value: event.value, error: null })}
                    />
                </Container.Column>

                {/* Brand select */}
                <Container.Column className="col-lg-5">
                    <SingleSelect
                        options={props.brands || []}
                        placeholder="brand"
                        deafult={brand.value}
                        isClearable
                        value={event => setBrand({ value: event.value, error: null })}
                    />
                </Container.Column>

                {/* Submit */}
                <Container.Column className="col-lg-2 text-right text-lg-left">
                    <PrimaryButton
                        type="submit"
                        className="px-4"
                        disabled={isLoading}
                    >{isLoading ? t("Submitting ...") : t("Submit")}</PrimaryButton>
                </Container.Column>
            </Container.Row>
        </form>
    );
}

export default StockStatus;