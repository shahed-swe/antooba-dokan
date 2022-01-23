import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { WithdrawForm } from '../../../components/form/WithdrawForm'
import { NetworkError } from '../../../components/501/NetworkError'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { NoContent } from '../../../components/204/NoContent'
import { GrayButton } from '../../../components/button/Index'
import { DataTable } from '../../../components/table/Index'
import { Loader } from '../../../components/loading/Index'
import { Image } from '../../../components/image/Index'
import { Card } from '../../../components/card/Index'
import { Requests } from '../../../utils/Http/Index'
import { Text } from '../../../components/text/Text'
import { Images } from '../../../utils/Images'
import { Tab, Tabs } from 'react-bootstrap'

const Show = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [servicingHistoryData, setServicingHistoryData] = useState([])
    const [withdrawHistoryData, setWithdrawHistoryData] = useState([])
    const [noticeData, setNoticeData] = useState([])
    const [isCreateWithdraw, setCreateWithdraw] = useState({ show: false, loading: false })


    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Mechanic.Show(id)
            if (response.status === 200) {
                setData(response.data.data)
            }

            setIsLoading(false)
        } catch (error) {
            if (error) {
                setIsLoading(false)
                setServerError(true)
            }
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

    // fetch servicing history data
    const fetchServiceHistoryData = useCallback(async (page) => {
        try {
            const response = await Requests.Mechanic.Index(page, perPage)
            if (response.status === 200) {
                setServicingHistoryData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    useEffect(() => {
        fetchServiceHistoryData(1)
    }, [fetchServiceHistoryData])

    // fetch withdraw history data
    const fetchWithdrawHistoryData = useCallback(async (page) => {
        try {
            const response = await Requests.Mechanic.Index(page, perPage)
            if (response.status === 200) {
                setWithdrawHistoryData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    useEffect(() => {
        fetchWithdrawHistoryData(1)
    }, [fetchWithdrawHistoryData])

    // fetch notice data
    const fetchNoticeData = useCallback(async (page) => {
        try {
            const response = await Requests.Mechanic.Index(page, perPage)
            if (response.status === 200) {
                setNoticeData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    useEffect(() => {
        fetchNoticeData(1)
    }, [fetchNoticeData])


    // handle page change
    const handlePageChange = (page) => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.Mechanic.Index(page, perPage)
        setServicingHistoryData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // Handle withdraw submission
    const handleWithdrawSubmission = async (data) => {
        try {
            setCreateWithdraw({ ...isCreateWithdraw, loading: true })
            console.log(data)

            setTimeout(() => {
                setCreateWithdraw({ value: null, loading: false, show: false })
                Toastify.Success("Successfully working in dummy.")
            }, 2000)
        } catch (error) {
            if (error) {
                setCreateWithdraw({ ...isCreateWithdraw, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }

    // styles
    const styles = {
        td: {
            width: 70,
        },
        pointer: {
            cursor: "pointer"
        }
    };

    // Servicing history columns
    const servicingHistoryColumns = [
        {
            name: `${t('Code')}`,
            selector: row => row.code || "N/A",
            sortable: true
        },
        {
            name: `${t('Delivery date')}`,
            selector: row => row.delivery_date || "N/A",
            sortable: true,
        },
        {
            name: `${t('Receiving date')}`,
            selector: row => row.receiving_date || "N/A",
            sortable: true,
        },
        {
            name: `${t('Device name')}`,
            selector: row => row.device_name || "N/A",
            sortable: true
        },
        {
            name: `${t('Device model')}`,
            selector: row => row.device_model || "N/A",
            sortable: true,
        },
        {
            name: `${t('Total fee')}`,
            selector: row => row.total_fee || 0,
            sortable: true,
        },
        {
            name: `${t('Total cost')}`,
            selector: row => row.total_cost || 0,
            sortable: true
        },
        {
            name: `${t('Advance payment')}`,
            selector: row => row.advance_payment || 0,
            sortable: true,
        },
        {
            name: `${t('Total profit')}`,
            selector: row => row.total_profit || 0,
            sortable: true,
        },
        {
            name: `${t('Status')}`,
            selector: row => row.status || "pending",
            sortable: true
        },
    ]

    // Withdraw History columns
    const withdrawHistoryColumns = [
        {
            name: `${t('Date')}`,
            selector: row => row.date || "N/A",
            sortable: true
        },
        {
            name: `${t('Payment')}`,
            selector: row => row.payment || 0,
            sortable: true,
        },
    ]

    // Notice columns
    const noticeColumns = [
        {
            name: `${t('Date')}`,
            selector: row => row.date || "N/A",
            maxWidth: '200px',
            sortable: true
        },
        {
            name: `${t('Notice Description')}`,
            selector: row => row.notice || "N/A",
            sortable: true,
        },
    ]



    return (
        <div>
            <Layout
                page="mechanic & servicing / mechanic show"
                message={`Show mechanic ${data.name || ""} profile.`}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/mechanic">
                            <GrayButton type="button">
                                <ChevronLeft size={15} className="mr-2" />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {isLoading && !serverError && !Object.keys(data).length ? <Loader /> : null}
                {!isLoading && !Object.keys(data).length && !serverError ? <NoContent message={t("No mechanic available.")} /> : null}
                {!isLoading && !Object.keys(data).length && serverError ? <NetworkError message={t("Network Error.")} /> : null}

                {!isLoading && !serverError && Object.keys(data).length ?
                    <>
                        <Container.Column>

                            {/* Profile Card */}
                            <Card.Simple className="border-0">
                                <Card.Body className="px-2 py-0">
                                    <div className="d-md-flex">
                                        <div className="text-center text-md-left">
                                            <Image
                                                src={data.image || null}
                                                alt="..."
                                                x={75}
                                                y={75}
                                                className="rounded-circle"
                                            />
                                        </div>

                                        <div className="ml-md-4 mt-4 mt-md-0">
                                            <Text className="fs-16 font-weight-bolder mb-0">
                                                {data && data.name ? data.name : "No Name"}
                                            </Text>
                                            <table className="table table-sm table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                Phone
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="fs-13 mb-0">
                                                                : {data && data.phone ? data.phone : "N/A"}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                Email
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                : {data && data.email ? data.email : "N/A"}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="ml-md-4 mt-md-4">
                                            <table className="table table-sm table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                NID
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                : {data && data.nid ? data.nid : "N/A"}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                Address
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                : {data && data.address ? data.address : "N/A"}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="ml-md-4 mt-md-4">
                                            <table className="table table-sm table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                Percentage
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                : {data && data.mechanic_percentage ? data.mechanic_percentage : 0} %
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={styles.td}>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                Note
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Text className="text-capitalized fs-13 mb-0">
                                                                : {data && data.note ? data.note : "N/A"}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Item cards */}
                        <Container.Column>
                            <Container.Row className="px-3 mb-3">

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_fee ? data.total_fee : 0} TK</Text>
                                            <Text className="fs-16 mb-0 text-muted"> TOTAL FEE</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_cost ? data.total_cost : 0} TK</Text>
                                            <Text className="fs-16 mb-0 text-muted"> TOTAL COST </Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_profit ? data.total_profit : 0} TK</Text>
                                            <Text className="fs-16 mb-0 text-muted"> TOTAL PROFIT</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_withdraw ? data.total_withdraw : 0} TK</Text>
                                            <Text className="fs-16 mb-0 text-muted"> TOTAL WITHDRAW</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> {data && data.available_balance ? data.available_balance : 0} TK</Text>
                                            <Text className="fs-16 mb-0 text-muted"> AVAILABLE BALANCE</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple className="background-success">
                                        <Card.Body className="px-0">
                                            <div
                                                onClick={() => setCreateWithdraw({ ...isCreateWithdraw, show: true })}
                                                style={styles.pointer}
                                            >
                                                <Image
                                                    src={Images.Money || null}
                                                    alt="..."
                                                    x={20}
                                                    y={20}
                                                />
                                                <Text className="fs-16 mb-0 text-white"> WITHDRAW </Text>
                                            </div>

                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                            </Container.Row>
                        </Container.Column>

                        {/* Selected Portion */}
                        <Container.Column>
                            {/* History tabs */}
                            <div>
                                <Tabs
                                    defaultActiveKey="servicing_history"
                                    id="uncontrolled-tab"
                                    className="mb-3"
                                >
                                    <Tab eventKey="servicing_history" title="Servicing History">
                                        <DataTable
                                            columns={servicingHistoryColumns}
                                            data={servicingHistoryData}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                    <Tab eventKey="withdraw_history" title="Withdraw History">
                                        <DataTable
                                            columns={withdrawHistoryColumns}
                                            data={withdrawHistoryData}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                    <Tab eventKey="notice" title="Notice">
                                        <DataTable
                                            columns={noticeColumns}
                                            data={noticeData}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                </Tabs>
                            </div>

                        </Container.Column>
                    </>
                    : null
                }
            </Main>

            {/* Create withraw modal */}
            <PrimaryModal
                title={t(`Withdraw amount for ${data.name}`)}
                show={isCreateWithdraw.show}
                size="md"
                onHide={() => setCreateWithdraw({ show: false, loading: false })}
            >
                <WithdrawForm
                    loading={isCreateWithdraw.loading}
                    onSubmit={handleWithdrawSubmission}
                    onHide={() => setCreateWithdraw({ show: false, loading: false })}
                />
            </PrimaryModal>

        </div>
    );
};

export default Show;