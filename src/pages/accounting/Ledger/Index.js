import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, Plus, Printer, Trash2 } from 'react-feather'
import { DangerButton, GrayButton, SuccessButton } from '../../../components/button/Index'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { LedgerForm } from '../../../components/form/LedgerForm'
import { Toastify } from '../../../components/toastify/Toastify'
import { Container } from '../../../components/container/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import { Requests } from '../../../utils/Http/Index'
import { Text } from '../../../components/text/Text'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [serverError, setServerError] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [ledgerDelete, setLedgerDelete] = useState({ show: false, loading: false, value: null })
    const [isCreateLedger, setCreateLedger] = useState({ show: false, loading: false })

    // fetch ledger data
    const fetchLedgerData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.total)
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
        fetchLedgerData(1)
    }, [fetchLedgerData])

    // hange paginate page change
    const handlePageChange = page => fetchLedgerData(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.EmployeeAll.Employee.EmployeeList(page, newPerPage)

        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) {
                setsearchLoading(false)
            }
        }
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.EmployeeAll.Employee.EmployeeSearch(value)
        console.log(response)

        if (response && response.data.data && response.data.data.length) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    const columns = [
        {
            name: `${t('Name')}`,
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Total Debit (Tk)')}`,
            selector: row => row.total_debit || 0,
            sortable: true,
        },
        {
            name: `${t('Total Credit (Tk)')}`,
            selector: row => row.total_credit || 0,
            sortable: true,
        },
        {
            name: `${t('Account Payable (Tk)')}`,
            selector: row => row.account_payable || 0,
            sortable: true,
        },
        {
            name: `${t('Account Receivable (Tk)')}`,
            selector: row => row.account_receivable || 0,
            sortable: true,
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "200px",
            cell: row =>
                <div>

                    <Link to={`/dashboard/accounting/ledger/${row.id}`}>
                        <SuccessButton
                            type="button"
                            style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        type="button"
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => setLedgerDelete({ value: row, show: true })}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div>
        }
    ]

    // Handle ledger submission
    const handleLedgerSubmission = async (data) => {
        try {
            setCreateLedger({ ...isCreateLedger, loading: true })
            console.log(data)

            setTimeout(() => {
                setCreateLedger({ value: null, loading: false, show: false })
                Toastify.Success("Successfully working in dummy.")
            }, 2000)
        } catch (error) {
            if (error) {
                setCreateLedger({ ...isCreateLedger, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }

    // handle Ledger Delete
    const handleLedgerDelete = async () => {
        setLedgerDelete({ ...ledgerDelete, loading: true })
        const response = await Requests.EmployeeAll.Employee.ledgerDelete(ledgerDelete.value.uid)
        if (response && response.status === 200) {
            fetchLedgerData()
            Toastify.Success('Ledger Deleted Successfully')
            setLedgerDelete({ ...ledgerDelete, show: false, loading: false })
        } else {
            Toastify.Error('Something Went Wrong')
            setLedgerDelete({ ...ledgerDelete, show: false, loading: false })
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / accounting / ledger")}
                message={t("Who are using this system.")}
                container="container-fluid"
                button={
                    <div>
                        <GrayButton
                            className="mr-0 mr-sm-2"
                            onClick={() => setCreateLedger({ ...isCreateLedger, show: true })}
                        >
                            <Text className="fs-13 mb-0"> <Plus size={13} /><span className='text-secondary ml-1'>{t('ADD NEW LEDGER')}</span></Text>
                        </GrayButton>
                        <GrayButton
                            type="button"
                            className="ml-2 mt-2 mt-sm-0"
                            onClick={() => window.print()}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>
                <Container.Column>
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}

                        searchable
                        noDataMessage={t('No ledger list available')}
                        placeholder={"Search"}
                        search={handleSearch}
                        searchLoading={searchLoading}
                        suggestion={handleSuggestion}
                        clearSearch={() => fetchLedgerData(1)}
                    />
                </Container.Column>
            </Main>

            {/* Create ledger modal */}
            <PrimaryModal
                title={t(`Create ledger`)}
                show={isCreateLedger.show}
                size="md"
                onHide={() => setCreateLedger({ show: false, loading: false })}
            >
                <LedgerForm
                    loading={isCreateLedger.loading}
                    onSubmit={handleLedgerSubmission}
                />
            </PrimaryModal>

            {/* Delete Employee confirmation modal */}
            <DeleteModal
                show={ledgerDelete.show}
                loading={ledgerDelete.loading}
                message={<Text className="fs-15">{t("Want to delete")} {ledgerDelete.value ? ledgerDelete.value.email : null} ?</Text>}
                onHide={() => setLedgerDelete({ value: null, show: false, loading: false })}
                doDelete={handleLedgerDelete}
            />
        </div>
    );
}

export default Index;
