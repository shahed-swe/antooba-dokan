
import React, { useState, useEffect, useCallback } from 'react'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import FilterForm from '../../../components/filter/StockStatus'
import { Minus, Plus, Printer } from 'react-feather'
import {
    GrayButton,
} from '../../../components/button/Index'
import { Link } from 'react-router-dom'
import { Requests } from '../../../utils/Http/Index'
import { Container } from '../../../components/container/Index'
import { NetworkError } from '../../../components/501/NetworkError'
import { useTranslation } from 'react-i18next'
import { Text } from '../../../components/text/Text'


const StockStatus = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [serverError, setServerError] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [searchLoading, setsearchLoading] = useState(false)
    const [currentStock, setCurrentStock] = useState(0)

    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Stock.StockStatus(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.meta.total)

                console.log(response.data.data)

                let stock = 0
                response && response.data && response.data.data.map((item) =>
                    stock += item.purchase_price
                )
                setCurrentStock(stock)
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
        setLoading(true)
        const response = await Requests.Inventory.Stock.StockStatus(page, newPerPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }


    // fetching product categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Category.CategoryList()
            const data = []
            for (let i = 0; i < response.data.data.length; i++) {
                data.push({
                    value: response.data.data[i].uid,
                    label: response.data.data[i].name
                })
            }
            setCategories(data)
            setServerError(false)
            setLoading(false)
        } catch (error) {
            if (error) setServerError(true); setLoading(false)
        }
    }, [])



    // fetching brand of product
    const fetchBrands = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Brand.DokanBrandList()
            const data = []
            for (let i = 0; i < response.data.data.length; i++) {
                data.push({
                    value: response.data.data[i].uid,
                    label: response.data.data[i].name
                })
            }
            setBrands(data)
            setServerError(false)
            setLoading(false)
        } catch (error) {
            if (error) setServerError(true); setLoading(false)
        }

    }, [])



    // fetch stock status
    useEffect(() => {
        fetchData()
    }, [fetchData])


    // fetching product categories
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])


    // fetching brand of product
    useEffect(() => {
        fetchBrands()
    }, [fetchBrands])




    const columns = [
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
            name: 'Warranty Type',
            selector: row => row.warranty_type ? row.warranty_type : 'N/A',
            sortable: true,
        },

    ]


    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        try {
            const response = await Requests.Inventory.Stock.StockStatusSearch(data)
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
        const response = await Requests.Inventory.Stock.StockStatusSearch(value)
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

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    return (

        <Layout
            page="inventory / stock status"
            message="Products and stock situation of your shop is bellow. It's time to take action !!!"
            container="container-fluid"
            printable
            printData={"No data"}
            otherPage
            pageTitle="STOCK IN"
            pageLink="/dashboard/inventory/stock/status"
            button={
                <div>
                    <Link to="/dashboard/inventory/stock/out">
                        <GrayButton type="button">
                            <Minus size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>DEDUCT STOCK</span>
                        </GrayButton>
                    </Link>
                    <Link to="/dashboard/inventory/stock/in">
                        <GrayButton type="button">
                            <Plus size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>ADD STOCK</span>
                        </GrayButton>
                    </Link>


                    <GrayButton className="ml-2 mt-2 mt-sm-0">
                        <Printer size={15} style={{ marginRight: 5 }} />
                        <span style={{ fontSize: 13 }}>PRINT</span>
                    </GrayButton>
                </div>
            }
        >
            <Main>
                <Container.Basic className="pl-0 ml-0 pb-0">
                    <Text className="mb-0">Current Stock Amount : {currentStock}</Text>
                    
                </Container.Basic>
                <Container.Basic className="pl-0 ml-0 mb-3">
                    <div className='d-flex justify-content-start'>
                        <div className='my-auto'>
                            <Text className="pb-0 mb-0 mr-2">Current Stock Quantity: </Text>
                        </div>
                        <div>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                            <span className="badge rounded bg-primary-light text-light p-2 m-1">50tk Kg</span>
                        </div>
                    </div>
                </Container.Basic>

                <Container.Basic className="pl-0 ml-0 mb-4">
                    <FilterForm categories={categories} brands={brands} setData={setData} fetchData={fetchData} setServerError={setServerError} />
                </Container.Basic>
                {serverError ? <NetworkError message={t("Network error!")} /> : null}

                {/* Filter Category or Brand */}
                {!serverError ?
                    <>
                        <Container.Column className="pl-0">
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                totalRows={totalRows}
                                customStyles={customStyles}
                                handlePerRowsChange={handlePerRowsChange}
                                handlePageChange={handlePageChange}
                                searchable
                                placeholder={"Search Stocks"}
                                search={handleSearch}
                                suggestion={handleSuggestion}
                                searchLoading={searchLoading}
                                clearSearch={() => fetchData(1)}
                            />
                        </Container.Column>
                    </>
                    : null}
            </Main>
        </Layout>

    );
}

export default StockStatus;