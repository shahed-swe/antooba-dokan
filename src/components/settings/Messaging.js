import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Toastify } from '../toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

export const Messaging = (props) => {
    const { t } = useTranslation()
    const options = [
        { enabled: props.message ? props.message.customer_messaging : 0, value: "customer_messaging", label: t("Customer messaging.") },
        { enabled: props.message ? props.message.supplier_messaging : 0, value: "supplier_messaging", label: t("Supplier messaging.") },
        { enabled: props.message ? props.message.system_messaging : 0, value: "system_messaging", label: t("System messaging.") },
        { enabled: props.message ? props.message.adds_on_messenger : 0, value: "adds_on_messenger", label: t("Adds on messenger.") }
    ]

    // Handle option
    const handleOption = async item => {
        if (item.enabled === 1) {
            item.enabled = 0

            const data = { [`${item.value}`]: item.enabled }
            await Requests.Settings.DokanMessageNotification(data)
            Toastify.Success("Successfully updated.")
        } else {
            item.enabled = 1
            const data = { [`${item.value}`]: item.enabled }

            await Requests.Settings.DokanMessageNotification(data)
            Toastify.Success("Successfully updated.")
        }
    }

    return (
        <div>
            {options && options.map((item, i) =>
                <Form.Check
                    key={i}
                    type="switch"
                    className="mb-3"
                    style={{ fontSize: 14 }}
                    id={`${item.label}-switch`}
                    label={item.label}
                    defaultChecked={item.enabled}
                    onChange={() => handleOption(item)}
                />
            )}
        </div>
    );
}