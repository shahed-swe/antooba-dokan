import React, { useState, useCallback, useEffect } from 'react'
import { Gift } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { PrimaryModal } from '../modal/PrimaryModal'
import { dateFormate } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'
import { DangerButton, SuccessButton } from '../button/Index'
import { DataTable } from '../table/Index'
import { Main } from '../layout/Index'
import { Container } from '../container/Index'

export const PurchaseHistory = () => {
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [show_product_modal, setShowProductModal] = useState(false)
    const [productData, setProductData] = useState([])

    // Fetch purchase history data
    const fetchPurchaseHistory = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage);
            setData(response.data.data);
            setProductData(response.data.data)
            setTotalRows(response.data.meta.total);
            setLoading(false);
            setServerError(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    const handlePageChange = (page) => fetchPurchaseHistory(page)

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
                setLoading(false)
            }

        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    };

    useEffect(() => {
        fetchPurchaseHistory(1)
    }, [fetchPurchaseHistory])

    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null,
        };
        const response = await Requests.Customer.CustomerSearch(value)
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

    // Handle search
    const handleSearch = async (data) => {
        setsearchLoading(true);
        const response = await Requests.Customer.CustomerSearch(data);
        if (response.data) setData(response.data.data);
        setsearchLoading(false);
    }

    // Purchase History columns
    const columns = [
        {
            name: `${t('Invoice')}`,
            selector: row => row.invoice || "N/A",
            sortable: true
        },
        {
            name: `${t('Date')}`,
            selector: row => dateFormate(row.date) || "N/A",
            sortable: true
        },
        {
            name: `${t('Paid')}`,
            selector: row => row.paid || 0,
            sortable: true,
        },
        {
            name: `${t('Due')}`,
            selector: row => row.due || 0,
            sortable: true,
        },
        {
            name: `${t('Method')}`,
            selector: row => row.method || "N/A",
        },
        {
            name: 'Products',
            cell: row =>
                <SuccessButton
                    type="button"
                    style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                    onClick={() => setShowProductModal(true)}
                ><Gift size={16} />
                </SuccessButton>
        },
    ]

    // Products data columns
    const productColumns = [
        {
            name: `${t('Name')}`,
            selector: row => row.name || "N/A",
        },
        {
            name: `${t('Quantity')}`,
            selector: row => row.quantity || 0,
            sortable: true,
        },
        {
            name: `${t('Unit Price')}`,
            selector: row => row.unit_price || 0,
            sortable: true,
        },
        {
            name: `${t('Unit Discount')}`,
            selector: row => row.unit_discount || 0,
            sortable: true,
        },
        {
            name: `${t('Total Price')}`,
            selector: row => row.total_price || 0,
            sortable: true,
        },
        {
            name: `${t('Total Discount')}`,
            selector: row => row.total_discount || 0,
            sortable: true,
        },
        {
            name: `${t('Warrenty Type')}`,
            selector: row => row.warrenty_type || "N/A",
        },
        {
            name: `${t('Warrenty Validity End At')}`,
            selector: row => dateFormate(row.date) || "N/A",
            minWidth: "200px"
        },
    ]

    return (
        <div>
            <Main>
                {/* Purchase history table */}

                <Container.Column>
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}

                        noDataMessage="No purchase history available"
                        searchable
                        placeholder={"Search"}
                        search={handleSearch}
                        searchLoading={searchLoading}
                        suggestion={handleSuggestion}
                        clearSearch={() => fetchPurchaseHistory(1)}
                    />
                </Container.Column>

            </Main>

            {/* Product Show Modal */}
            <PrimaryModal
                show={show_product_modal}
                onHide={() => setShowProductModal(false)}
                size="xl"
                title="Product details list"
            >
                {/* Products data */}
                <DataTable
                    columns={productColumns}
                    data={productData}
                    loading={loading}
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                />
            </PrimaryModal>
        </div>
    );
}
