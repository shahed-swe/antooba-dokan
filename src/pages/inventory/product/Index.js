
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Edit2, Plus, Printer, Trash2, Eye } from 'react-feather'
import { GrayButton, SuccessButton, DangerButton } from '../../../components/button/Index'
import { Images } from '../../../utils/Images'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { Container } from '../../../components/container/Index'
import { Text } from '../../../components/text/Text'

import { NetworkError } from '../../../components/501/NetworkError'

import { Toastify } from '../../../components/toastify/Toastify'
import { Requests } from '../../../utils/Http/Index'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import Barcode from 'react-barcode'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [searchLoading, setsearchLoading] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [serverError, setServerError] = useState(false)
    const [seperatecodemodal , setSeperateCodeModal] = useState({value: null, show: false, loading: false})


    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Product.DokanProductList(page, perPage)
            if (response && response.status === 200) {
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

    const handlePageChange = page => fetchData(page)

    const handlePerRowsChange = async (newPerPage, page) => {
        try{
            setLoading(true)
            const response = await Requests.Inventory.Product.DokanProductList(page, newPerPage)
            setData(response.data.data)
            setPerPage(newPerPage)
            setLoading(false)
        }catch(error){
            if(error){
                setLoading(false)
                setServerError(true)
            }
        }
        
    }

    useEffect(() => {
        fetchData(1)
    }, [fetchData])


    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductSearch(data)
            if (response.data && response.status === 200) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) {
                setsearchLoading(false)
                setServerError(true)
            }
        }

    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Inventory.Product.DokanProductSearch(value)
        if (response && response.status === 200) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // Handle delete
    const handleDelete = async () => {
        try {
            const response = await Requests.Inventory.Product.DokanProductDelete(isDelete.value.uid)
            if (response && response.status === 200) {
                Toastify.Success(t('Product deleted successfully.'))
                fetchData()
            }

            setDelete({ loading: false, value: null, show: false })
        } catch (error) {
            if (error) {
                setDelete({ loading: false, value: null, show: false })
                Toastify.Error(t("Failed to delete."))
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
            name: 'Image',
            grow: 0,
            cell: row => <img height={50} width={50} alt={row.featured_image} src={row.featured_image} />
        },
        {
            name: 'Name',
            selector: row => row.name || "N/A",
            sortable: true,
        },
        {
            name: 'Code',
            selector: row => row.product_code ? row.product_code : row.codes.map(code => code.code).join(', ') || "N/A",
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity || "N/A",
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category ? row.category.name : 'N/A',
            sortable: true,
        },
        {
            name: 'Brand',
            selector: row => row.brand ? row.brand.name : 'N/A',
            sortable: true,
        },
        {
            name: 'Purchase Price',
            selector: row => row.purchase_price || "N/A",
            sortable: true,
        },
        {
            name: 'Sell Price',
            selector: row => row.selling_price || "N/A",
            sortable: true,
        },
        {
            name: 'Discount',
            selector: row => row.discount_amount || "N/A",
            sortable: true,
        },
        {
            name: 'Warranty Type',
            selector: row => row.warranty_type !== "null" ? row.warranty_type : 'N/A',
            sortable: true,
        },
        {
            name: 'Warranty Period',
            selector: row => row.warranty_period !== "undefined" ? row.warranty_period : 'N/A',
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '220px',
            cell: row =>
                <div>
                    <GrayButton className="circle-btn mr-1" onClick={() => handleBarCodeGeneration(row.product_code ? row.product_code : row.codes)}>
                        <img src={Images.BarCode} alt="..." />
                    </GrayButton>

                    <Link to={`/dashboard/inventory/product/show/${row.uid}`}>
                        <SuccessButton className="circle-btn mr-1"><Eye size={16} /></SuccessButton>
                    </Link>

                    <Link to={`/dashboard/inventory/product/edit/${row.uid}`}>
                        <SuccessButton className="circle-btn mr-1"><Edit2 size={16} /></SuccessButton>
                    </Link>

                    <DangerButton
                        className="circle-btn"
                        onClick={() => setDelete({ value: row, show: true, loading: false })}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div>
        }
    ]


    // handle bar code generation
    const handleBarCodeGeneration = (data) => {
        setSeperateCodeModal({ value: data, show: true, loading: false })
        console.log(data)
    }

    return (
        <div>
            <Layout
                page={t("inventory / product list")}
                message={t("Products that you usually sell & buy.")}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/inventory/product/new">
                            <GrayButton type="button">
                                <Plus size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>{t("ADD PRODUCT")}</span>
                            </GrayButton>
                        </Link>
                        <GrayButton
                            className="ml-2 mt-2 mt-sm-0"
                            onClick={() => window.print()}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t("PRINT")}</span>
                        </GrayButton>
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
                            loading={loading}
                            totalRows={totalRows}
                            customStyles={customStyles}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}

                            noDataMessage="No product available"
                            searchable
                            placeholder={"Search product"}
                            search={handleSearch}
                            suggestion={handleSuggestion}
                            searchLoading={searchLoading}
                            clearSearch={() => fetchData(1)}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={
                    <div>
                        <Text className="mb-0 fs-15">Want to delete?</Text>
                        {isDelete.value && isDelete.value.featured_image ? <img src={isDelete.value.featured_image} className="img-fluid" alt="..." /> : null}
                    </div>
                }
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />

            {/* bar code modal */}
            <PrimaryModal
                show={seperatecodemodal.show}
                loading={seperatecodemodal.loading}
                onHide={() => setSeperateCodeModal({value: null, show: false, loading: false})}
            >
                <div className='text-center'>
                    <Text>Product Codes</Text>
                    {seperatecodemodal && seperatecodemodal.value && typeof seperatecodemodal.value === "object" ? seperatecodemodal.value.map((item, index) => {
                        return (
                            <div key={index}>
                                <Barcode value={item.code}/>
                            </div>
                        )
                    }) : <Barcode value={seperatecodemodal.value} />}
                </div>
            </PrimaryModal>
        </div>
    );
}

export default Index;