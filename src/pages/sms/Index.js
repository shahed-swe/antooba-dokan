import React, { useState, useEffect, useCallback } from 'react'
import "./style.scss"
import { Link } from 'react-router-dom'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { Card } from '../../components/card/Index'
import { PrimaryOutlineButton } from '../../components/button/Index'
import { DataTable } from '../../components/table/Index'
import { Loader } from '../../components/loading/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { NoContent } from '../../components/204/NoContent'
import { Text } from '../../components/text/Text'
import { formatDateWithAMPM } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'

const Index = () => {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [packagedetail, setPackageDetail] = useState({})
    const [serverError, setServerError] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)


    // fetch data
    const fetchSmsHistory = useCallback(async (page) => {
        try {
            setTableLoading(true)
            const response = await Requests.SMS.SMSSend.SmsHistory(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setTableLoading(false)
        } catch (error) {
            if (error) {
                setTableLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    // fetch user sms package detail
    const fetchSmsPackages = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.SMS.SMSSend.SMSDetails()
            if (response && response.status === 200) {
                setPackageDetail(response.data.data)
            }
        } catch (error) {
            setServerError(true)
        } finally {
            setLoading(false)
        }
    }, [])



    // handle page change
    const handlePageChange = page => fetchSmsHistory(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.SMS.SMSSend.SmsHistory(page, perPage)
            if (response.status === 200) {
                setData(data)
                setPerPage(newPerPage)
            }
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }

    // fetch sms history data
    useEffect(() => {
        fetchSmsHistory(1)
    }, [fetchSmsHistory])

    // fetch package detail of a user
    useEffect(() => {
        fetchSmsPackages()
    }, [fetchSmsPackages])

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '50px',
            }
        }
    }

    // data columns
    const columns = [
        {
            name: 'Date',
            width: "130px",
            sortable: true,
            cell: row => formatDateWithAMPM(row.send_time)
        },
        {
            name: 'Users',
            sortable: true,
            grow: 0,
            selector: row => row.title ? row.title : row.receiver_number
        },
        {
            name: 'Message',
            selector: row => row.message
        }
    ]

    return (
        <div>
            <Layout
                page="dashboard / sms"
                message="SMS Dashboard."
                container="container-fluid"
            />

            <Main>


                {/* Card items */}
                <Container.Column className="col-sm-6 col-xl-3">
                    <Card.Simple className="sms-item-card">
                        <Text className="fs-30 font-weight-bolder mb-0">{packagedetail.total_sms}</Text>
                        <Text className="fs-14 mb-0">Avaiable messages</Text>
                    </Card.Simple>
                </Container.Column>

                {/* Card items */}
                <Container.Column className="col-sm-6 col-xl-3">
                    <Card.Simple className="sms-item-card">
                        <Text className="fs-30 font-weight-bolder mb-0">{packagedetail.total_sms_sent}</Text>
                        <Text className="fs-14 mb-0">Total sent</Text>
                    </Card.Simple>
                </Container.Column>

                {/* Card items */}
                <Container.Column className="col-sm-6 col-xl-3">
                    <Card.Simple className="sms-item-card">
                        <Text className="fs-30 font-weight-bolder mb-0">{packagedetail.customer_due}</Text>
                        <Text className="fs-14 mb-0">Customer with due</Text>
                    </Card.Simple>
                </Container.Column>

                {/* Card items */}
                <Container.Column className="col-sm-6 col-xl-3">
                    <Card.Simple className="sms-item-card">
                        <Text className="fs-30 font-weight-bolder mb-0">{packagedetail.customer_installment}</Text>
                        <Text className="fs-14 mb-0">Customer with installment</Text>
                    </Card.Simple>
                </Container.Column>

                {/* Button container */}
                <Container.Column className="mb-4">
                    <Link to="/dashboard/sms/packages">
                        <PrimaryOutlineButton className="px-3">Buy Message</PrimaryOutlineButton>
                    </Link>

                    <Link to="/dashboard/sms/send">
                        <PrimaryOutlineButton className="px-3 ml-2">Send Message</PrimaryOutlineButton>
                    </Link>
                </Container.Column>
                {isLoading && !data.length && !serverError ? <Loader /> : null}
                {!isLoading && !data.length && !serverError ? <NoContent message="No content available." /> : null}
                {!isLoading && !data.length && serverError ? <NetworkError message="Network error." /> : null}

                {!isLoading && !serverError && data.length ?

                    <Container.Column >
                        <Text className="fs-14 text-muted mb-0">Previous message history</Text>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={tableLoading}
                            customStyles={customStyles}
                            totalRows={totalRows}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}
                        />
                    </Container.Column> : null}
            </Main>
        </div >
    )
}

export default Index;