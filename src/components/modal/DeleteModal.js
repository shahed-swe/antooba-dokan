import React from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { DangerButton, GrayButton } from '../button/Index'
import { useTranslation } from 'react-i18next'
import { Text } from '../text/Text'

export const DeleteModal = (props) => {
    const { t } = useTranslation()
    const { show, onHide, loading, message, doDelete } = props

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            centered
        >
            <Modal.Header
                className="border-0 p-4"
            >
                <div className="d-flex w-100">
                    <div><Text className="fs-18 mt-2 mb-0">{t("Are you sure?")}</Text></div>
                    <div className="ml-auto">
                        <DangerButton
                            onClick={onHide}
                            className="danger-delete-circle"
                        >
                            <X size={16} />
                        </DangerButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4 pt-0">
                <div>{message}</div>
                <div className="pt-4">
                    <DangerButton
                        type="button"
                        disabled={loading}
                        className="px-4 mr-2"
                        onClick={doDelete}
                    >{loading ? t("Deleting ...") : t("Yes")}</DangerButton>

                    <GrayButton
                        type="button"
                        className="px-4"
                        onClick={onHide}
                    >{t("No")}</GrayButton>
                </div>
            </Modal.Body>
        </Modal>
    );
}
