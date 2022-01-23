import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { GrayButton, PrimaryButton } from '../../components/button/Index'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { SearchableSelect } from '../../components/select/Index'
import { Text } from '../../components/text/Text'
import { Requests } from '../../utils/Http/Index'
import { Toastify } from '../../components/toastify/Toastify'
import { DatePicker } from '../../components/datePicker/Index'
import { useTranslation } from 'react-i18next'


const NoticeSend = () => {
    const { t } = useTranslation()
    const [selected, setSelected] = useState([])
    const [bulk, setBulk] = useState({ status: false, value: null })
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [date, setDate] = useState(null)
    const [activatedFabric, setActivatedFabric] = useState({ label: null, value: null })
    const [fabricOptions] = useState([
        { label: "All", value: 1 },
        { label: "Customers only", value: 2 },
        { label: "Employees only", value: 3 },
        { label: "Suppliers only", value: 4 },
        { label: "Mechanics only", value: 5 }
    ])

    // Check fabric activation 
    const checkActivatedFabric = item => {
        if (item === activatedFabric.value) return true
        return false
    }

    // Handle fabric Option
    const handleFabricOption = async item => {
        setActivatedFabric({ label: item.label, value: item.value })
    }


    // Handle search
    const handleSearch = async (query) => {
        try {
            const results = []
            const response = await Requests.SMS.SMSSend.AllSmsUser(query)
            if (response && response.data.data.length) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    results.push({
                        label: element.phone,
                        value: element.phone,
                        name: element.name + " - " + element.phone
                    })
                }
                return results
            }
        } catch (error) {
            if (error) return []
        }
    }

    // Handle select
    const handleSelect = data => {
        const items = []

        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                items.push(element.value)
            }
        }

        setSelected(items)
    }

    // Handle bulk checkbox
    const handleBulkCheckbox = () => {
        if (bulk.status) {
            setBulk({ status: false, value: null })
            setMessage(message ? message : null)
        } else {
            setBulk({ status: true, value: null })
            setMessage(message ? message : null)
            setSelected([])
        }
    }

    // Handle submit
    const handleSubmit = async () => {
        try {
            setLoading(true)
            let formData = []
            if (bulk.status) {
                formData = {
                    message: message.value,
                }
                const response = await Requests.SMS.SMSSend.SendBulkSms(formData, bulk.value)
                if (response && response.status === 200) {
                    Toastify.Success(response.data.message)
                    setLoading(false)
                }
            } else {
                formData = {
                    phone: !bulk.status ? selected.join(",") : null,
                    message: message.value,
                    dokan_uid: localStorage.getItem('dokanuid')
                }
                console.log(formData)
                const response = await Requests.SMS.SMSSend.SendSms(formData)
                if (response && response.status === 200) {
                    Toastify.Success("Message Sent Successfully")
                }
            }


            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                console.log(error)
            }
        }
    }

    return (
        <div>
            <Layout
                page="dashboard / notice"
                message="All Notice are given from here."
                container="container-fluid"
                button={
                    <Link to="/dashboard/sms">
                        <GrayButton type="button">
                            <ChevronLeft size={15} className="mr-2" />
                            <span style={{ fontSize: 13 }}>BACK</span>
                        </GrayButton>
                    </Link>
                }
            />
            <Main>

                {/* To */}
                {!bulk.status ?
                    <Container.Column>
                        <FormGroup className="mb-0">
                            <div className="d-flex">
                                <div className="pt-2 mt-1 pr-2">
                                    <Text className="mb-0 fs-14 font-weight-bolder">To</Text>
                                </div>
                                <div className="flex-fill">
                                    <SearchableSelect
                                        isMulti
                                        placeholder="Enter Phone or Name"
                                        search={handleSearch}
                                        
                                        values={data => handleSelect(data)}
                                    />
                                </div>
                            </div>
                        </FormGroup>
                    </Container.Column>
                    : null
                }

                {/* notice check box */}
                <Container.Column>
                    <FormGroup>
                        <Form.Check
                            custom
                            type="checkbox"
                            id="custom-bulk-checkbox"
                            label="Send Group Notice"
                            style={{ fontSize: 14, zIndex: 0 }}
                            defaultChecked={bulk.status}
                            onChange={handleBulkCheckbox}
                        />
                    </FormGroup>
                </Container.Column>

                {/* Bulk value */}
                {bulk.status ?

                    <Container.Column>
                        <FormGroup>
                            {fabricOptions && fabricOptions.map((item, i) =>
                                <Container.Column className="col-lg-2">
                                    <Form.Check
                                        custom
                                        key={i}
                                        type="checkbox"
                                        id={`fabric${item.value}`}
                                        className="mb-0"
                                        label={<Text className="fs-14 mb-1">{item.label}</Text>}
                                        style={{ fontSize: 13, cursor: "pointer" }}
                                        checked={checkActivatedFabric(item.value)}
                                        onChange={() => handleFabricOption(item)}

                                    />
                                </Container.Column>
                            )}
                        </FormGroup>
                    </Container.Column>
                    : null
                }

                {/* Message input */}
                {activatedFabric.value !== null || selected.length ?

                    <Container.Column>
                        <FormGroup className="mb-0">
                            <Text className="text-capitalize fs-13 mb-1">{t('Start date')}</Text>
                            <DatePicker
                                className="rounded"
                                selected={data => {
                                    setDate(data)
                                }}
                                deafultValue={date}
                            />
                        </FormGroup>
                        <FormGroup className="pt-2">
                            {console.log(message)}
                            <textarea
                                rows={4}
                                placeholder="Write notice..."
                                defaultValue={message !== null ? message : null}
                                className={error ? "form-control shadow-none error" : "form-control shadow-none"}
                                onChange={event => {setMessage(event.target.value); setError(false)}}
                            />
                        </FormGroup>
                    </Container.Column>

                    : null
                }

                {/* Submit button */}
                {message?
                    <Container.Column className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ? "Sending..." : "Send Message"}
                        </PrimaryButton>
                    </Container.Column>
                    : null
                }
            </Main>
        </div>
    )
}

export default NoticeSend;