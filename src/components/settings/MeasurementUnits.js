import React, { useState, useEffect, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Toastify } from '../toastify/Toastify'
import { Container } from '../container/Index'
import { Text } from '../text/Text'
import { Requests } from '../../utils/Http/Index'

export const MeasurementUnits = (props) => {
    const { t } = useTranslation()
    const { dokanunits } = props
    const [units, setUnits] = useState([])

    // fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Settings.AllUnits()

            if (response.data && response.data.length) {
                const values = response.data.map((unit, i) => {
                    let match = false;
                    for (let i = 0; i < dokanunits.length; i++) {
                        if (parseInt(unit.uid) === parseInt(dokanunits[i].unit_uid)) {
                            match = true;
                            break;
                        }
                    }

                    unit.enabled = match;
                    return unit;
                })

                setUnits(values)
            }
        } catch (error) {
            if (error) Toastify.Error("Network error.")
        }
    }, [dokanunits])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // handle options
    const handleOption = async (item, i) => {
        try {
            if (item.enabled) {
                const response = await Requests.Settings.DokanMeasurementsDelete(item.uid)
                if (response && response.status === 200) {
                    const values = [...units]
                    values[i].enabled = false
                    setUnits(values)
                    Toastify.Success("Successfully unit changes")
                }
            } else {
                const data = {
                    dokan_uid: localStorage.getItem('dokanuid'),
                    unit_uid: item.uid
                }
                const response = await Requests.Settings.DokanMeasurementsAdd(data)
                if (response.status === 201) {
                    const values = [...units]
                    values[i].enabled = true
                    setUnits(values)
                    Toastify.Success("Successfully unit changes")
                }
            }
        } catch (error) {
            if (error) Toastify.Error("Network error.")
        }
    }

    return (
        <Container.Row>
            <Container.Column>
                <Text className="fs-16 font-weight-bolder mb-3">Measurement Units</Text>
            </Container.Column>

            {units && units.map((item, i) =>
                <Container.Column className="col-6 col-lg-4 mb-2" key={i}>
                    <Form.Check
                        custom
                        type="checkbox"
                        id={`custom-${item.uid}`}
                        label={t(item.title)}
                        value={item.uid}
                        style={{ fontSize: 14 }}
                        checked={item.enabled}
                        onChange={() => handleOption(item, i)}
                    />
                </Container.Column>
            )}
        </Container.Row>
    );
}