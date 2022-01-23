import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Toastify } from '../toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

export const Notification = (props) => {
    const { t } = useTranslation()
    const options = [
        { enabled: props.notification ? props.notification.setting.system_notification : 0, value: "system_notification", label: t("System notification.") },
        { enabled: props.notification ? props.notification.setting.sms_notification : 0, value: "sms_notification", label: t("SMS notification.") },
        { enabled: props.notification ? props.notification.setting.email_notification : 0, value: "email_notification", label: t("E-mail notification.") },
        { enabled: props.notification ? props.notification.setting.unseen_message_notification : 0, value: "unseen_message_notification", label: t("Unseen message notification.") },
        { enabled: props.notification ? props.notification.setting.ecommerce_notification : 0, value: "ecommerce_notification", label: t("E-commerce notification.") },
        { enabled: props.notification ? props.notification.setting.purchase_notification_for_customer : 0, value: "purchase_notification_for_customer", label: t("Purchase notification for customer as SMS.") }
    ]

    // Handle option
    const handleOption = async item => {
        if (item.enabled === 1) {
            item.enabled = 0

            const data = { [`${item.value}`]: item.enabled }
            await Requests.Settings.DokanNotificationUpdate(data)
            Toastify.Success("Successfully updated.")
        } else {
            item.enabled = 1

            const data = { [`${item.value}`]: item.enabled }
            await Requests.Settings.DokanNotificationUpdate(data)
            Toastify.Success("Successfully updated.")
        }
    }

    return (
        <>
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
        </>
    )
}