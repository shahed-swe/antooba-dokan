import React, { useState } from 'react'
import './style.scss'
import { HelpCircle, X } from 'react-feather'
import { GrayButton } from '../../components/button/Index'
import { useTranslation } from 'react-i18next'

// Float button
const FloatButton = (props) => {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)

    return (
        <div className="float-btn-container">
            <Drawer
                show={show}
                onHide={() => setShow(false)}
            />

            <button
                type="button"
                className="btn float-btn shadow-none"
                onClick={() => setShow(true)}
            >
                <HelpCircle size={25} />
                <span style={{textTransform: "capitalize"}}>{t('help')}</span>
            </button>
        </div>
    )
}

// Help drawer
const Drawer = (props) => {
    return (
        <div className="help-drawer-container">
            <div className={props.show ? "backdrop open-backdrop" : "backdrop"}
                onClick={props.onHide}
            />

            {/* Drawer */}
            <div className={props.show ? "drawer open-drawer" : "drawer"}>
                <div className="drawer-header p-3">
                    <GrayButton
                        onClick={props.onHide}
                        style={{ borderRadius: "50%", padding: "8px 10px" }}
                    ><X size={18} /></GrayButton>
                </div>
                <div className="drawer-body">

                </div>
            </div>
        </div>
    )
}

export { FloatButton }
