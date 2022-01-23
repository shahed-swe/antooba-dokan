import React, { useState,useEffect } from 'react'
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


const Send = () => {
    const [selected, setSelected] = useState([])
    const [bulk, setBulk] = useState({ status: false, value: null })
    const [message, setMessage] = useState({ value: null, error: false })
    const [isLoading, setLoading] = useState(false)
    const phonenumber = useState(localStorage.getItem('phonenumber'))
    // fetch


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
            setMessage({ value: null, error: false })
        } else {
            setBulk({ status: true, value: null })
            setMessage({ value: null, error: false })
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
                    localStorage.removeItem('phonenumber')
                    // setSelected(null)
                    Toastify.Success("Message Sent Successfully")
                    window.location.reload()
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

    useEffect(() => {
        const data = [...selected]
        const new_data = phonenumber[0]
        if(new_data !== null){

            data.push(new_data)
        }
        if(data.length > 0){
            setSelected(data)
        }else{
            // setSelected([])
        }
    },[])


    return (
        <div>
            <Layout
                page="dashboard / sms / send"
                message="Send message to Customers, Suppliers or Vendors."
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
                                        defaultValue={phonenumber[0] === null ? null : {label: phonenumber[0], value:phonenumber[0]}}
                                        placeholder="select phone number"
                                        search={handleSearch}
                                        values={data => handleSelect(data)}
                                    />
                                </div>
                            </div>
                        </FormGroup>
                    </Container.Column>
                    : null
                }

                {/* Bulk Checkbox */}
                <Container.Column>
                    <FormGroup>
                        <Form.Check
                            custom
                            type="checkbox"
                            id="custom-bulk-checkbox"
                            label="Bulk Message"
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
                            <select
                                style={{ maxWidth: 300 }}
                                className="form-control shadow-none"
                                onChange={event => setBulk({ ...bulk, value: event.target.value === "" ? null : event.target.value })}
                            >
                                <option value="">--- Select item ---</option>
                                <option value="everyone">To every one</option>
                                <option value="dues-only">To customers who have dues only</option>
                                {/* <option value="customers-installment-only">To customers who have installments only</option> */}
                                {/* <option value="supplier-installment-only">To suppliers who have installments only</option> */}
                            </select>
                        </FormGroup>
                    </Container.Column>
                    : null
                }

                {/* Message input */}
                {bulk.value || selected.length ?
                    <Container.Column>
                        <FormGroup>
                            <textarea
                                rows={4}
                                placeholder="Write message..."
                                className={message.error ? "form-control shadow-none error" : "form-control shadow-none"}
                                onChange={event => setMessage({ value: event.target.value, error: false })}
                            />
                        </FormGroup>
                    </Container.Column>
                    : null
                }

                {/* Submit button */}
                {message.value ?
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

export default Send;