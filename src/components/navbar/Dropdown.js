import React, { useState } from 'react'
import {
    DropdownButton,
    Dropdown
} from 'react-bootstrap'
import {
    Settings,
    Edit3,
    LogOut
} from 'react-feather'

import { Link } from 'react-router-dom'
import { ShortName } from '../shortName/Index'
import { useTranslation } from 'react-i18next'
import { PrimaryModal } from '../modal/PrimaryModal'
import { PasswordChange } from '../form/PasswordChange'
import { Toastify } from '../toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

const DropdownComponent = () => {
    const [show, setShow] = useState(false)
    const { t } = useTranslation()
    const [isUpdating, setUpdating] = useState(false)

    const logout = () => {
        localStorage.clear()
        window.location.reload();
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
        <>
            <DropdownButton title={<ShortName name="Antooba" x={38} y={38} size={18} />}>
                <Dropdown.Header>
                    <ShortName
                        name="Antooba"
                        x={55}
                        y={55}
                        size={25}
                    />
                    <h6 className="text-capitalize mt-2 mb-0">antooba CORP.</h6>
                </Dropdown.Header>

                <div className="dropdown-body">
                    <Dropdown.Item as={Link} to="/shop">
                        <Settings size={15} className="icon" />
                        <span>{t('shop list')}</span>
                    </Dropdown.Item>

                    {/* Change password */}
                    <Dropdown.Item>
                        <Edit3 type="button" onClick={() => setShow(true)} />
                        <span onClick={() => setShow(true)}>{t('Edit Password')}</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                        <LogOut size={15} className="icon" />
                        <span>{t('Sign Out')}</span>
                    </Dropdown.Item>
                </div>
            </DropdownButton>


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
        </>
    )
}

export default DropdownComponent;
