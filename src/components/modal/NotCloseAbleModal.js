import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'

export const NotCloseAbleModal = (props) => {
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
                </div>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4 pt-0">
                {props.children}
            </Modal.Body>
        </Modal>
    );
};

