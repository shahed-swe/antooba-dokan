import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { Toastify } from '../toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

export const InvoicePrinting = (props) => {
    const { t } = useTranslation()
    const [activated, setActivated] = useState(null)
    const [options] = useState([
        { stateval: props.invoicedata ? props.invoicedata.invoice_size : null, value: "pos(56)", label: t("POS(56)") },
        { stateval: props.invoicedata ? props.invoicedata.invoice_size : null, value: "pos(86)", label: t("POS(86)") },
        { stateval: props.invoicedata ? props.invoicedata.invoice_size : null, value: "A1", label: t("A1") },
        { stateval: props.invoicedata ? props.invoicedata.invoice_size : null, value: "A4", label: t("A4") },
        { stateval: props.invoicedata ? props.invoicedata.invoice_size : null, value: "A5", label: t("A5") }
    ])

    useEffect(() => {
        let isActive = null
        if (options && options.length) {
            for (let i = 0; i < options.length; i++) {
                const element = options[i]
                if (element.value === element.stateval) isActive = element.value
            }
        }
        setActivated(isActive)
    }, [options])

    // Check activated
    const checkActivated = item => {
        if (item === activated) return true
        return false
    }

    // Handle option
    const handleOption = async item => {
        setActivated(item.value)
        const data = { invoice_size: item.value }

        await Requests.Settings.DokanInvoice(data)
        Toastify.Success("Successfully updated.")
    }

    return (
        <div>
            <Text className="fs-16 font-weight-bolder mb-3">Invoice size</Text>
            {options && options.map((item, i) =>
                <Form.Check
                    key={i}
                    type="checkbox"
                    name="checkboxvx"
                    label={t(item.label)}
                    style={{ fontSize: 13, marginBottom: 15, cursor: "pointer" }}
                    checked={checkActivated(item.value)}
                    onChange={() => handleOption(item)}
                />
            )}
        </div>
    );
}