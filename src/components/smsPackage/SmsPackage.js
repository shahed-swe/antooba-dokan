import React, { useEffect, useCallback, useState } from 'react'
import './style.scss'
import { Card } from '../card/Index'
import { Text } from '../text/Text'
import { Check, X } from 'react-feather'
import { PrimaryOutlineButton } from '../button/Index'
import { Requests } from '../../utils/Http/Index'

export const SmsPackage = (props) => {

    const { title, number_of_sms, description, features } = props.data
    const [data, setData] = useState([])

    const fetchSmsFeatures = useCallback(async () => {
        try {
            const response = await Requests.SMS.SMSPackage.SmsFeatures()
            if (response.data && response.data.data.length) {
                const values = features && response.data.data.map((item, i) => {
                    let match = false;
                    for (let i = 0; i < features.length; i++) {
                        if (parseInt(item.uid) === parseInt(features[i].uid)) {
                            match = true;
                            break;
                        }
                    }

                    item.enabled = match;
                    return item;
                })
                setData(values)
            }
        } catch (error) {
            if (error) {
                props.setServerError(true)
            }
        }
    }, [features,props])


    useEffect(() => {
        fetchSmsFeatures()
    }, [fetchSmsFeatures])

    return (
        <Card.Simple className="sms-package-card">
            <Card.Body className="p-4">
                <div className="text-center mb-4">
                    <Text className="fs-20 text-uppercase font-weight-bolder mb-0">{title}</Text>
                    <Text className="fs-12 text-uppercase font-weight-bolder text-muted mb-0">{number_of_sms}</Text>
                    <Text className="fs-13 text-muted mb-0">{description}</Text>
                </div>


                <div className="mb-4">
                    <Text className="fs-14 font-weight-bold text-dark mb-1">Features</Text>
                    {data.map((item, index) => {

                        return (
                            <div key={index}>
                                <Text className="fs-14 mb-0 text-muted">{item.enabled ? <Check size={14} className="text-success" /> : <X size={14} className="text-danger" />} {item.title}</Text>
                            </div>
                        )

                    })}
                </div>

                <div className="text-right">
                    <PrimaryOutlineButton
                        type="button"
                        className="px-3"
                        onClick={() => props.handleSelect(props.data.uid)}
                    >
                        Buy Now
                    </PrimaryOutlineButton>
                </div>
            </Card.Body>
        </Card.Simple>
    )
}