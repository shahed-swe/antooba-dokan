
import React, { useState, useEffect, useCallback } from 'react'
import { Edit2, Plus, Printer, Trash2, Eye } from 'react-feather'
import { Link } from 'react-router-dom'
import {
    GrayButton,
    SuccessButton,
    DangerButton
} from '../../../components/button/Index'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import { Container } from '../../../components/container/Index'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { Toastify } from '../../../components/toastify/Toastify'
import { NetworkError } from '../../../components/501/NetworkError'
import { Images } from '../../../utils/Images'
import { Requests } from '../../../utils/Http/Index'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchLoading, setsearchLoading] = useState(false)
    const [isDelete, setDelete] = useState({ show: false, loading: false })
    const [supplier, setSupplier] = useState(null)
    const [serverError, setServerError] = useState(false)

    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.meta.total)
                setServerError(false)
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
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, newPerPage)
            setData(response.data.data)
            setPerPage(newPerPage)
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }

    }

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    const columns = [
        {
            name: 'Name',
            selector: row => row.name || "N/A",
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone || "N/A",
            sortable: true,
        },
        {
            name: 'E-mail',
            selector: row => row.email || "N/A",
            sortable: true,
        },
        {
            name: 'Note',
            selector: row => row.note || "N/A",
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.address || "N/A",
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '220px',
            cell: row =>
                <div>
                    <GrayButton
                        className="circle-btn mr-1"
                        onClick={() => handleAction(row)}
                    ><img src={Images.BarCode} alt="..." /></GrayButton>

                    <Link to={`/dashboard/inventory/supplier/show/${row.uid}`}>
                        <SuccessButton
                            className="circle-btn mr-1"
                            onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>

                    <Link to={`/dashboard/inventory/supplier/edit/${row.uid}`}>
                        <SuccessButton
                            className="circle-btn mr-1"
                            onClick={() => handleAction(row)}
                        ><Edit2 size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        className="circle-btn"
                        onClick={() => {
                            setDelete({ value: row, show: true });
                            setSupplier(row);
                        }}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div>
        },
    ]

    // Handle action
    const handleAction = value => setSupplier(value);

    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierSearch(data)
            if (response.data) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) setsearchLoading(false)
        }

    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }

        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierSearch(value)
            if (response && response.data.data && response.data.data.length) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    data.results.push(element.name)
                }
            } else {
                data.message = "No results found"
            }
        } catch (error) {
            if (error) data.message = "No results found"
        }

        return data
    }

    const handleDelete = async () => {
        try {
            setDelete({ ...isDelete, loading: true })
            const res = await Requests.Inventory.Supplier.DokanSupplierDelete(parseInt(supplier.uid))
            if (res.status === 200) fetchData()
            setDelete({ ...isDelete, show: false, loading: false })
            Toastify.Success("Successfully deleted.")
        } catch (error) {
            if (error) {
                setDelete({ ...isDelete, show: false, loading: false })
                Toastify.Error("Network error.")
            }
        }
    }

    return (
        <div>
            <Layout
                page="inventory / supplier list"
                message="Person / Company who supply product for you."
                container="container-fluid"
                printable
                printData={"No data"}
                otherPage
                pageLink="/dashboard/inventory/product/new"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/inventory/supplier/add">
                            <GrayButton type="button">
                                <Plus size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>ADD SUPPLIERS</span>
                            </GrayButton>
                        </Link>
                        <GrayButton
                            className="ml-2 mt-2 mt-sm-0"
                            onClick={() => window.print()}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>PRINT</span>
                        </GrayButton>
                    </div>
                }
            />
            <Main>
                {serverError ? <NetworkError message={t("Network error!")} /> : null}
                {!serverError ?
                    <Container.Fluid>
                        <Container.Row>
                            <Container.Column>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    totalRows={totalRows}
                                    handlePerRowsChange={handlePerRowsChange}
                                    handlePageChange={handlePageChange}

                                    noDataMessage="No supplier available"
                                    searchable
                                    placeholder={"Search Supplier"}
                                    search={handleSearch}
                                    suggestion={handleSuggestion}
                                    searchLoading={searchLoading}
                                    clearSearch={() => fetchData(1)}
                                />
                            </Container.Column>
                        </Container.Row>
                    </Container.Fluid>
                    : null
                }
            </Main>


            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<h6>Want to delete {isDelete.value ? isDelete.value.name : null} ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;