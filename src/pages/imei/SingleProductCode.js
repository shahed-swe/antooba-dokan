import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit2, Printer } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { SuccessButton, GrayButton } from '../../components/button/Index'
import { Container } from '../../components/container/Index'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { Image } from '../../components/image/Index'
import { ImeiForm } from '../../components/form/ImeiForm'
import { Loader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import { Toastify } from '../../components/toastify/Toastify'
import { Requests } from '../../utils/Http/Index'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [searching, setSearching] = useState(false)
    const [edit, setEdit] = useState({ show: false, data: null, loading: false })

    // for fetching single product
    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.IMEI.SingleProductCode(page, perPage)
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

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.SingleProductsCode(page, perPage)
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
        const response = await Requests.IMEI.SearchSingleProductCode(value)
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
        const response = await Requests.IMEI.SearchSingleProductCode(query)
        if (response.data) setData(response.data.data)
        setSearching(false)
    }

    // handle submit IMEI code formdata
    const handleSubmit = async (data) => {
        try {
            let response
            setEdit({ ...edit, loading: true })

            if (data.is_code_separate === 0) {
                response = await Requests.IMEI.UpdateToSingleProductCode(data, data.productId)
            }

            if (data.is_code_separate === 1) {
                response = await Requests.IMEI.UpdateToSeparateProductCode(data, data.productId)
            }

            if (response.status === 200) {
                fetchData(1)
                Toastify.Success("IMEI code added.")
            }
            setEdit({ ...edit, loading: false, show: false })
        } catch (error) {
            if (error) {
                setEdit({ ...edit, loading: false, show: false })
                Toastify.Error("Network error!!!")
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
            cell: row => <Image src={row.featured_image} alt={row.featured_image} x={50} y={50} />
        },
        {
            name: 'Name',
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: 'Code',
            selector: row => row.product_code ? row.product_code : row.codes.map(code => code.code).join(', '),
            sortable: true
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true
        },
        {
            name: 'Category',
            selector: row => row.category ? row.category.name : 'N/A',
            sortable: true
        },
        {
            name: 'Brand',
            selector: row => row.brand ? row.brand.name : 'N/A',
            sortable: true
        },
        {
            name: 'Purchase Price',
            selector: row => row.purchase_price + " tk.",
            sortable: true
        },
        {
            name: 'Sell Price',
            selector: row => row.selling_price + " tk.",
            sortable: true
        },
        {
            name: 'Discount',
            selector: row => row.discount_amount || "N/A",
            sortable: true
        },
        {
            name: 'Warranty Type',
            selector: row => row.warranty_type || "N/A",
            sortable: true
        },
        {
            name: 'Warranty Period',
            selector: row => row.warranty_period || "N/A",
            sortable: true
        },
        {
            name: 'Action',
            width: '60px',
            cell: row =>
                <div>
                    <SuccessButton
                        type="button"
                        className="circle-btn"
                        onClick={() => setEdit({ ...edit, show: true, data: row })}
                    ><Edit2 size={16} />
                    </SuccessButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / imei / single")}
                message={t("IMEI Single Product Code Information")}
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
                            noDataMessage="No single code based product found"
                            searchable
                            search={handleSearch}
                            searchLoading={searching}
                            placeholder={"Search Product"}
                            clearSearch={() => fetchData(1)}
                            suggestion={handleSuggestion}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Product add to IMEI modal */}
            <PrimaryModal
                show={edit.show}
                title="IMEI Single Code"
                onHide={() => setEdit({ ...edit, show: false })}
            >
                <ImeiForm
                    data={edit.data}
                    loading={edit.loading}
                    onSubmit={data => handleSubmit(data)}
                />
            </PrimaryModal>
        </div>
    );
}

export default Index;
