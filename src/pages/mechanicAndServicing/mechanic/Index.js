import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DollarSign, Edit2, Eye, Plus, Trash2 } from 'react-feather'
import { DangerButton, GrayButton, SuccessButton } from '../../../components/button/Index'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { WithdrawForm } from '../../../components/form/WithdrawForm'
import { NetworkError } from '../../../components/501/NetworkError'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { DataTable } from '../../../components/table/Index'
import { Image } from '../../../components/image/Index'
import { Requests } from '../../../utils/Http/Index'
import { Text } from '../../../components/text/Text'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isLoading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [isDestroy, setDestroy] = useState({ value: null, show: false, loading: false })
    const [isCreateWithdraw, setCreateWithdraw] = useState({ show: false, loading: false })
    const [name, setName] = useState(null)

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            const response = await Requests.Mechanic.Index(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
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
        fetchData(1)
    }, [fetchData])

    // handle page change
    const handlePageChange = (page) => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.Mechanic.Index(page, perPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // handle search
    const handleSearch = async (data) => {
        setSearching(true)
        const response = await Requests.Mechanic.Search(data)
        setData(response.data.data)
        setSearching(false)
    }

    // handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: null,
            message: null
        }
        const response = await Requests.Mechanic.Search(value)
        if (response && response.status === 200) {
            const items = []

            if (response.data.data && response.data.data.length) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    items.push(element.name)
                }
            }
            data.results = items
        }
        else data.message = t("No results found")
        return data
    }

    // Handle delete
    const handleDelete = async () => {
        try {
            setDestroy({ ...isDestroy, loading: true })
            const response = await Requests.Mechanic.Destroy(isDestroy.value.uid)
            if (response && response.status === 200) {
                fetchData(1)
                Toastify.Success("Successfully deleted.")
            }

            setDestroy({ ...isDestroy, show: false, loading: false })
        } catch (error) {
            if (error) {
                setDestroy({ ...isDestroy, loading: false })
                Toastify.Error("Network error.")
            }
        }
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

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // Data columns
    const columns = [
        {
            name: '',
            minHeight: '70px',
            grow: 0,
            cell: row => <img
                src={row.image}
                className="img-fluid"
                alt="..."
                style={{ height: 50 }}
            />
        },
        {
            name: 'Name',
            selector: row => row.name || "N/A",
            sortable: true,
        },
        {
            name: 'E-mail',
            selector: row => row.email || "N/A",
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone || "N/A",
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '170px',
            cell: row =>
                <div>
                    <GrayButton
                        type="button"
                        className="circle-btn mr-1"
                        onClick={() => {
                            setCreateWithdraw({ ...isCreateWithdraw, show: true })
                            setName(row.name)
                        }}
                    ><DollarSign size={16} />
                    </GrayButton>

                    <Link to={`/dashboard/mechanic/show/${row.uid}`}>
                        <GrayButton
                            type="button"
                            className="circle-btn"
                        ><Eye size={16} />
                        </GrayButton>
                    </Link>

                    <Link to={`/dashboard/mechanic/edit/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            className="circle-btn mx-1"
                        ><Edit2 size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        type="button"
                        className="circle-btn"
                        onClick={() => setDestroy({ ...isDestroy, value: row, show: true })}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page="mechanic & servicing / mechanic"
                message="Mechanics of your shop."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/mechanic/create">
                            <GrayButton type="button">
                                <Plus size={15} className="mr-2" />
                                <span style={{ fontSize: 13 }}>ADD MECHANIC</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {serverError ? <NetworkError message={t("Network error!")} /> : null}
                {!serverError ?
                    <Container.Column>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={isLoading}
                            totalRows={totalRows}
                            customStyles={customStyles}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}

                            noDataMessage="No mechanic available"
                            searchable
                            search={handleSearch}
                            searchLoading={searching}
                            placeholder={"Search mechanic"}
                            clearSearch={() => fetchData(1)}
                            suggestion={handleSuggestion}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Create withraw modal */}
            <PrimaryModal
                title={t(`Withdraw amount for ${name}`)}
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

            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDestroy.show}
                loading={isDestroy.loading}
                message={
                    <div>
                        <Image
                            src={isDestroy.value ? isDestroy.value.image : null}
                            alt="..."
                            x={200}
                        />

                        <Text className="mt-3 fs-14">Want to delete {isDestroy.value ? isDestroy.value.name : null} ?</Text>
                    </div>
                }
                onHide={() => setDestroy({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    )
}

export default Index;