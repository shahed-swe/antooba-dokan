import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Accordion, Card, Button, ListGroup } from "react-bootstrap"
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { FloatButton } from '../../components/help/Index'
import { NetworkError } from '../../components/501/NetworkError'

import { General } from '../../components/settings/General'
import { PersonalInfo } from '../../components/settings/PersonalInfo'
import { Location } from '../../components/settings/Location'
import { Member } from '../../components/settings/Member'
import { Notification } from '../../components/settings/Notification'
import { Messaging } from '../../components/settings/Messaging'
import { SecurityLogin } from '../../components/settings/SecurityLogin'
import { ActivityLogs } from '../../components/settings/ActivityLogs'
import { InvoicePrinting } from '../../components/settings/InvoicePrinting'
import { MeasurementUnits } from '../../components/settings/MeasurementUnits'
import { Requests } from '../../utils/Http/Index'
import { Loader } from '../../components/loading/Index'

const Index = () => {
    let items
    const { t } = useTranslation()
    const [activeKey, setActiveKey] = useState(null)
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)

    // fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Settings.DokanSettingInformation()
            if (response.status === 200) setData(response.data)
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // policy page links
    const policies = [
        { path: "/dashboard/term-of-service", label: "Terms of Service" },
        { path: "/dashboard/data-policy", label: "Data Policy" },
        { path: "/dashboard/cookies", label: "Cookies Policy" },
        { path: "/dashboard/community-standard", label: "Community Standards" },
        { path: "/dashboard/about", label: "About" }
    ]

    // toggler
    const toggleActive = key => {
        if (activeKey === key) {
            setActiveKey(null)
        } else {
            setActiveKey(key)
        }
    }

    // components array
    if (!isLoading && Object.keys(data).length) {
        items = [
            { label: "General", component: <General generaldata={data.dokan} refetch={() => fetchData()} /> },
            { label: "Personal Info.", component: <PersonalInfo user={data.user} /> },
            { label: "Location", component: <Location location={data.dokan} /> },
            { label: "Member", component: <Member /> },
            { label: "Notification", component: <Notification notification={data.dokan} /> },
            { label: "Messaging", component: <Messaging message={data.dokan.setting} /> },
            { label: "Security & Login", component: <SecurityLogin security={data.dokan} securitylog={data.user} /> },
            { label: "Activity log", component: <ActivityLogs activity={data.dokan} /> },
            { label: "Invoice & Printing", component: <InvoicePrinting invoicedata={data.dokan.setting} /> },
            { label: "Default Measurement Unit", component: <MeasurementUnits dokanunits={data.dokan.dokanunits} /> }
        ]
    }

    return (
        <div>
            <Layout
                page={t("settings / setting")}
                message={t("Your system setting is here, You can change anytime.")}
                container="container-fluid"
            />

            <Main>
                {isLoading && !Object.keys(data).length ? <Loader /> : null}
                {!isLoading && !Object.keys(data).length ? <NetworkError message="Network Error." /> : null}

                {!isLoading && Object.keys(data).length ?
                    <Container.Column className="settings-index">
                        <Accordion>
                            {items && items.length ?
                                items.map((item, i) =>
                                    <Card className="rounded-0" key={i}>
                                        <Card.Header
                                            className="p-0 bg-white"
                                            onClick={() => toggleActive(i)}
                                        >
                                            <Accordion.Toggle
                                                as={Button}
                                                variant="link"
                                                eventKey={i + 1}
                                                className="w-100 shadow-none text-decoration-none text-dark p-3"
                                            >
                                                <div className="d-flex">
                                                    <div><h6 className="mb-0">{t(item.label)}</h6></div>
                                                    <div className="ml-auto">
                                                        {activeKey === i ?
                                                            <ChevronDown size={18} /> :
                                                            <ChevronUp size={18} />
                                                        }
                                                    </div>
                                                </div>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={i + 1}>
                                            <Card.Body>
                                                {item.component}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ) : null
                            }
                        </Accordion>

                        <br />
                        <ListGroup variant="flush">
                            {policies && policies.map((item, i) =>
                                <ListGroup.Item
                                    key={i}
                                    className="border-0"
                                >
                                    <Link to={item.path}>{t(item.label)}</Link>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Container.Column>
                    : null
                }
            </Main>
            <FloatButton />
        </div>
    );
}

export default Index;