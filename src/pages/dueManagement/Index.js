import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Text } from '../../components/text/Text'
import { SuccessButton, GrayButton } from '../../components/button/Index'
import { Container } from '../../components/container/Index'
import { Loader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { DueForm } from '../../components/form/DueForm'
import { Toastify } from '../../components/toastify/Toastify'
import { Requests } from '../../utils/Http/Index'
import { dateFormat2, dateYearFormat } from '../../utils/_heplers'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [searching, setSearching] = useState(false)
    const [payModal, setPayModal] = useState({ value: null, show: false, loading: false })

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Dues.Index(page, perPage)
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
            const response = await Requests.SeparateProductCode(page, perPage)
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
        const response = await Requests.Dues.Search(value)
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
        try {
            const response = await Requests.Dues.Search(query)
            if (response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.data.meta ? response.data.data.meta.total : 0)
                setSearching(false)
            }
        } catch (error) {
            if (error) {
                setData([])
                setTotalRows(0)
            }
        }
    }

    // Handle payment submission
    const handlePaymentSubmission = async (data) => {
        try {
            setPayModal({ ...payModal, loading: true })
            
            const FormData = {
                dokan_uid: localStorage.getItem('dokanuid'),
                pay_date: dateYearFormat(data.date),
                amount: data.amount,
                prev_due_consider: data.isConsider === true ? true : false,
                note: data.note
            }

            const response = await Requests.Dues.PayDue(payModal.value.uid, FormData)
            if(response.data && response.status === 201){
                Toastify.Success('Due Paid Successfully')
                setPayModal({ value: null, loading: false, show: false })
                fetchData()
            }
            
        } catch (error) {
            if (error) {
                setPayModal({ ...payModal, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // data columns
    const columns = [
        {
            name: 'Name',
            sortable: true,
            selector: row => row.name ?? 'N/A'
        },
        {
            name: 'Current Due',
            selector: row => row.current_due ?? 'N/A',
            sortable: true,
        },
        {
            name: 'Last Pay',
            selector: row => row.last_pay && row.last_pay.pay_amount ? row.last_pay.pay_amount :  'N/A',
            sortable: true,
        },
        {
            name: 'Last Pay Date',
            selector: row => row.last_pay && row.last_pay.pay_date ? dateFormat2(row.last_pay.pay_date) : 'N/A',
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '60px',
            cell: row =>
                <div>
                    <SuccessButton
                        type="button"
                        onClick={() => setPayModal({ ...payModal, show: true, value: row })}
                    ><Text className="mb-0 fs-12">{t("PAY NOW")}</Text></SuccessButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / due management")}
                message={t("Manage shop due's")}
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
                {!loading && !data.length && !serverError ? <NoContent message="No Content." /> : null}
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
                            placeholder={"Search Due"}
                            clearSearch={() => fetchData(1)}
                            suggestion={handleSuggestion}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Pay form modal */}
            <PrimaryModal
                show={payModal.show}
                onHide={() => setPayModal({ value: null, loading: false, show: false })}
                size="md"
                title="Pay Due"
            >
                <DueForm
                    value={payModal.value}
                    loading={payModal.loading}
                    onSubmit={handlePaymentSubmission}
                    onHide={() => setPayModal({ value: null, loading: false, show: false })}
                />
            </PrimaryModal>
        </div>
    );
};

export default Index;