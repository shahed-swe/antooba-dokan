import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, Printer } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Text } from '../../components/text/Text'
import { SuccessButton, GrayButton } from '../../components/button/Index'
import { Container } from '../../components/container/Index'
import { Card } from '../../components/card/Index'
import { Loader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { Requests } from '../../utils/Http/Index'
import { Toastify } from '../../components/toastify/Toastify'
import { WithdrawForm } from '../../components/form/WithdrawForm'
import { dateFormat2 } from '../../utils/_heplers'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [searching, setSearching] = useState(false)
    const [installmentModal, setInstallmentModal] = useState({ value: null, show: false, loading: false })
    const [isPayNow, setPayNow] = useState({ show: false, loading: false, value: null })

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Installment.Index(page, perPage)
            console.log(response.data.data)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.data.meta ? response.data.data.meta.total : 0)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.Installment.Index(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
            }
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: null,
            message: null
        }
        const response = await Requests.Installment.Index(value)
        if (response.status === 200) {
            const resultItems = []
            if (response.data.data && response.data.data.length) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    resultItems.push(element.name)
                }
                data.results = resultItems
            } else {
                data.message = t("No results found")
            }
        } else {
            data.message = t("No results found")
        }

        return data
    }

    // Handle search
    const handleSearch = async query => {
        setSearching(true)
        const response = await Requests.Installment.Index(query)
        if (response.data) setData(response.data.data)
        setSearching(false)
    }

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // Handle withdraw submission
    const handleWithdrawSubmission = async (data) => {
        console.log(data)
        try {
            setPayNow({ ...isPayNow, loading: true, })
            const formData = {
                dokan_uid: localStorage.getItem('dokanuid'),
                pay_date: data.date,
                amount: data.amount
            }
            const response = await Requests.Installment.Pay(isPayNow.value.uid, formData)
            if (response.data && response.status === 201) {
                setPayNow({ value: null, loading: false, show: false })
                Toastify.Success("Installment Paid.")

            }
        } catch (error) {
            if (error) {
                setPayNow({ ...isPayNow, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }


    // const show installment details
    const fetchInstallmentDetails = async (uid) => {
        try {
            setInstallmentModal({loading: true})
            const response = await Requests.Installment.View(uid)
            console.log(response.data.data)
            if (response.status === 200) {
                setInstallmentModal({ value: response.data.data, show: true, loading: false })
            }
        } catch (error) {
            setInstallmentModal({loading: false})
        }
    }

    // data columns
    const columns = [
        {
            name: 'Name',
            sortable: true,
            selector: row => row.product_name
        },
        {
            name: 'Total Amount',
            selector: row => row.total_amount,
            sortable: true,
        },
        {
            name: 'Last Pay Amount',
            selector: row => row.prev_pay ? row.prev_pay.pay_amount : "N/A",
            sortable: true,
        },
        {
            name: 'Last Pay Date',
            selector: row => row.prev_pay ? dateFormat2(row.prev_pay.pay_date) : "N/A",
            sortable: true,
        },
        {
            name: 'Next Pay Amount',
            selector: row => row.next_schedule ? row.next_schedule.amount : "N/A",
            sortable: true,
        },
        {
            name: 'Next Pay Date',
            selector: row => row.next_schedule ? dateFormat2(row.next_schedule.schedule_date) : "N/A",
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '60px',
            cell: row =>
                <div>
                    <GrayButton
                        type="button"
                        className=" mr-1"
                        onClick={() => setPayNow({ ...isPayNow, show: true, value: row })}
                    ><Text className="mb-0 fs-12"><DollarSign size={12} /> PAY NOW</Text>
                    </GrayButton>

                    <SuccessButton
                        type="button"
                        onClick={() => { setInstallmentModal({ ...installmentModal, show: true, data: row }); fetchInstallmentDetails(row.uid) }}
                    ><Text className="mb-0 fs-12">{t("HISTORY")}</Text></SuccessButton>
                </div>
        }
    ]

    const tdWidth = { width: 140 }
    const tdWidthSm = { width: 70 }

    return (
        <div>
            <Layout
                page={t("dashboard / installment management")}
                message={t("Manage shop installments")}
                container="container-fluid"
                button={
                    <div>
                        <GrayButton
                            type="button"
                            className="ml-2 mt-2 mt-sm-0"
                            onClick={() => console.log("Will print")}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>
                {loading && !serverError && !data.length ? <Loader /> : null}
                {!loading && !data.length && !serverError ? <NoContent message="No installments available." /> : null}
                {!loading && !data.length && serverError ? <NetworkError message="Network Error." /> : null}

                {!loading && !serverError && data.length ?
                    <Container.Column>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            totalRows={totalRows}
                            customStyles={customStyles}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}
                            searchable
                            search={handleSearch}
                            searchLoading={searching}
                            placeholder={"Search installment"}
                            clearSearch={() => fetchData(1)}
                            suggestion={handleSuggestion}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Installment history modal */}
            <PrimaryModal
                show={installmentModal.show}
                size="lg"
                title="Installment History"
                onHide={() => setInstallmentModal({ value: null, loading: false, show: false })}
            >
                {installmentModal.value && !installmentModal.loading ?
                    <Container.Row>
                        {/* Details */}
                        <Container.Column className="col-lg-7 mb-3 pr-lg-2">
                            <Card.Simple className="bg-light border-0">
                                <Card.Body className="p-3">
                                    <Text className="mb-2 fs-15 font-weight-bold">Device name</Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Total amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.total_amount}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Down payment</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.down_payment}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Given amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.given_amount}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Due amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.due_amount}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Installment amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.installment_amount}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Total installment</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.total_installment}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Given installment</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.given_installment}tk.</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidth}><Text className="mb-0 fs-14">Due installment</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.due_installment}tk.</Text></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Prev & Next payment */}
                        <Container.Column className="col-lg-5 pl-lg-2">

                            {/* Prev */}
                            <Card.Simple className="bg-light border-0 mb-3">
                                <Card.Body className="p-3">
                                    <Text className="mb-0 fs-15 font-weight-bold">Previous payment</Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td style={tdWidthSm}><Text className="mb-0 fs-14">Date</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.prev_pay ? dateFormat2(installmentModal.value.prev_pay.pay_date) : "N/A"}</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidthSm}><Text className="mb-0 fs-14">Amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal.value.prev_pay.pay_amount ?? 0} tk.</Text></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card.Simple>

                            {/* Next */}
                            <Card.Simple className="bg-light border-0 mb-3">
                                <Card.Body className="p-3">
                                    <Text className="mb-0 fs-15 font-weight-bold">Next payment</Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td style={tdWidthSm}><Text className="mb-0 fs-14">Date</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.next_schedule ? dateFormat2(installmentModal.value.next_schedule.schedule_date) : "N/A"}</Text></td>
                                            </tr>
                                            <tr>
                                                <td style={tdWidthSm}><Text className="mb-0 fs-14">Amount</Text></td>
                                                <td><Text className="mb-0 fs-14">: {installmentModal && installmentModal.value.next_schedule.amount} tk.</Text></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Badge items */}
                        <Container.Column>
                            {installmentModal && installmentModal.value.schedules.map((item, index) => {
                                return (
                                    <span key={index} className={item.pay_status === "paid" ? `badge rounded-pill bg-primary-light text-light p-2 m-1` : item.pay_status === "unpaid" ? `badge rounded-pill badge-light border p-2 m-1` : `badge rounded-pill bg-dark-orange text-light p-2 m-1` }>{item.schedule_date}</span>
                                )
                            })} 
                        </Container.Column>
                    </Container.Row> : !installmentModal.value && installmentModal.loading ? <NetworkError message="no data found"/> : null}
            </PrimaryModal>

            {/* Pay now modal */}
            <PrimaryModal
                title={t(`Pay your installment`)}
                show={isPayNow.show}
                size="md"
                onHide={() => setPayNow({ show: false, loading: false })}
            >
                <WithdrawForm
                    loading={isPayNow.loading}
                    onSubmit={handleWithdrawSubmission}
                    value={isPayNow.value}
                    onHide={() => setPayNow({ show: false, loading: false })}
                />
            </PrimaryModal>
        </div>
    );
};

export default Index;