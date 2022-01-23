import React from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { DangerButton } from '../button/Index'
import { Text } from '../text/Text'

export const PrimaryModal = (props) => {
    const { t } = useTranslation()
    const { title, show, size, onHide } = props

    return (
        <Modal
            show={show}
            size={size}
            centered
            onHide={onHide}
        >
            <Modal.Header className="border-0 p-4">
                <div className="d-flex w-100">
                    <div><Text className="fs-18 mt-2 mb-0">{t(title)}</Text></div>
                    <div className="ml-auto">
                        <DangerButton
                            type="button"
                            onClick={onHide}
                            className="danger-delete-circle"
                        >
                            <X size={16} />
                        </DangerButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4 pt-0">
                {props.children}
            </Modal.Body>
        </Modal>
    );
};

