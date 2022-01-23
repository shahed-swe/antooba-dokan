import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Monitor, Smartphone } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'
import { Toastify } from '../toastify/Toastify'
import { SuccessButton } from '../button/Index'
import { PrimaryModal } from '../modal/PrimaryModal'
import { PasswordChange } from '../form/PasswordChange'
import { loggedInDevices } from '../../utils/data'
import { Requests } from '../../utils/Http/Index'

export const SecurityLogin = (props) => {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const options = [
        { enabled: props.security ? props.securitylog.two_factor_authentication : 0, value: "two_factor_authentication", label: t("Two-factor Authentication.") },
        { enabled: props.security ? props.securitylog.unauthorized_login_notification : 0, value: "unauthorized_login_notification", label: t("Get alerts of unauthorized login.") }
    ]

    // device lists
    const deviceList = props.securitylog ? props.securitylog.loginhistory : loggedInDevices

    // handle option
    const handleOption = async item => {
        if (item.enabled === 1) {
            item.enabled = 0

            const data = { [`${item.value}`]: item.enabled }
            await Requests.Auth.SecurityLogin(data)
            Toastify.Success("Successfully updated.")
        } else {
            item.enabled = 1
            const data = { [`${item.value}`]: item.enabled }

            await Requests.Auth.SecurityLogin(data)
            Toastify.Success("Successfully updated.")
        }
    }

    // change password
    const handlePasswordChange = async (data) => {
        try {
            setUpdating(true)
            const response = await Requests.Auth.UpdatePassword(data)
            if (response && response.status === 200) {
                setShow(false)
                Toastify.Success('Your Password Updated Successfully')
            }

            setUpdating(false)
        } catch (error) {
            if (error) {
                setUpdating(false)

                if (error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        Toastify.Error(error.response.data.errors[key][0])
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    return (
        <div>
            <Text className="mb-3 fs-16 font-weight-bold">{t("Where you were loggedin")}</Text>

            {/* Loggedin devices */}
            {deviceList && deviceList.map((item, i) =>
                <div className="device-container d-flex border-bottom py-2" key={i}>
                    <div className="pt-2">{item.type === "Mobile" ? <Smartphone size={20} /> : <Monitor size={20} />}</div>
                    <div className="pl-3">
                        <Text className="text-capitalize fs-14 mb-0">{item.device_name || "N/A"}</Text>
                        <small className="text-capitalize text-muted fs-12">{item.location || "N/A"}</small>
                    </div>
                </div>
            )}

            {/* Change password */}
            <div className="d-flex mt-3">
                <div><Text className="fs-14 mb-3 mt-2"><b>Login</b></Text></div>
                <div className="ml-auto">
                    <SuccessButton
                        className="px-3"
                        onClick={() => setShow(true)}
                    >{t("Change Password")}</SuccessButton>
                </div>
            </div>

            {/* Options */}
            <div className="mt-2">
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

            {/* Password change modal */}
            <PrimaryModal
                show={show}
                title="Change Password"
                onHide={() => setShow(false)}
            >
                <PasswordChange
                    loading={isUpdating}
                    onSubmit={data => handlePasswordChange(data)}
                />
            </PrimaryModal>
        </div>
    )
}