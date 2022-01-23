import React from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { DangerButton, GrayButton } from '../../button/Index'
import { useTranslation } from 'react-i18next'
import { Text } from '../../text/Text'

const Index = (props) => {
    const { t } = useTranslation()


    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><Text className="fs-18 fw-bold mb-0">{t('Are you sure?')}</Text></div>
                    <div className="ml-auto">
                        <DangerButton
                            type="button"
                            onClick={props.onHide}
                            style={{ padding: "7px 10px", borderRadius: "50%" }}
                        ><X size={16} /></DangerButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                {props.message}

                <div className="pt-4">
                    <DangerButton
                        type="button"
                        disabled={props.loading}
                        style={{ padding: "8px 20px", borderRadius: 4, marginRight: 5 }}
                        onClick={props.doDelete}
                    >{props.loading ? t("Deleting ...") : t("Yes")}</DangerButton>

                    <GrayButton
                        type="button"
                        style={{ padding: "8px 20px", borderRadius: 4 }}
                        onClick={props.onHide}
                    >{t("No")}</GrayButton>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default Index;
