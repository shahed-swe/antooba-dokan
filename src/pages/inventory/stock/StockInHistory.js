import React, { useState, useEffect, useCallback } from 'react'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import { Edit2, Plus, Printer, Trash2 } from 'react-feather'
import {
    DangerButton,
    GrayButton, SuccessButton,

} from '../../../components/button/Index'
import { Link } from 'react-router-dom'
import { Requests } from '../../../utils/Http/Index'
import { dateFormat2 } from '../../../utils/_heplers'
import { useTranslation } from 'react-i18next'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { Toastify } from '../../../components/toastify/Toastify'
import { NetworkError } from '../../../components/501/NetworkError'
import { Container } from '../../../components/container/Index'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { Text } from '../../../components/text/Text'
import { useWindowSize } from '../../../components/window/windowSize'
import { SingleSelect } from '../../../components/select/Index'
import { DatePicker } from '../../../components/datePicker/Index'


const StockStatus = () => {
    const size = useWindowSize()
    const [data, setData] = useState([]);
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [searchLoading, setsearchLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [date, setDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [categoryData, setCategoryData] = useState([])
    const [brandData, setBrandData] = useState([])
    const [supplierData, setSupplierData] = useState([])

    const fetchStockIns = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Stock.StockInHistory(page, perPage)
            if (response && response.status && response.status === 200) {

                setData(response.data.data)
                setTotalRows(response.data.total)
                setLoading(false)
                setServerError(false)
            }

        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }

    }, [perPage])

    const handlePageChange = page => {
        fetchStockIns(page)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.Inventory.Stock.StockInHistory(page, perPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    };

    useEffect(() => {
        fetchStockIns()
    }, [fetchStockIns])



    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.Inventory.Stock.StockInSearch(data)
            if (response.data) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) {
                setsearchLoading(false)
                setServerError(true)
            }
        }
    }


    // category data
    const fetchCategories = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Category.CategoryList()
            const data = []
            for (let i = 0; i < response.data.data.length; i++) {
                data.push({
                    value: response.data.data[i].uid,
                    label: response.data.data[i].name
                })
            }
            setCategoryData(data)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])

    // brand data
    const fetchBrands = useCallback(async () => {
        const response = await Requests.Inventory.Brand.DokanBrandList()
        if (response && response.status === 200) {
            const data = []
            for (let i = 0; i < response.data.data.length; i++) {
                data.push({
                    value: response.data.data[i].uid,
                    label: response.data.data[i].name
                })
            }
            setBrandData(data)
        }

    }, [])

    // supplier data
    const fetchSuppliers = useCallback(async () => {
        
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierList()

            const suppliers = response.data.data.map(supplier => {
                return { label: supplier.name, value: supplier.uid };
            });
            setSupplierData(suppliers)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])


    // fetch all datas for filter
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    useEffect(() => {
        fetchBrands()
    }, [fetchBrands])

    useEffect(() => {
        fetchSuppliers()
    }, [fetchSuppliers])




    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Inventory.Stock.StockInSearch(value)

        if (response && response.status === 200) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.product_name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    const columns = [
        {
            name: 'Branch Id',
            selector: row => row.batch_id || "N/A",
            sortable: true,
        },
        {
            name: 'Products',
            selector: row => row.product_name || "N/A",
            sortable: true,
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name || "N/A",
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity || "N/A",
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => dateFormat2(row.stock_in_date) || "N/A",
            sortable: true,
        },
        {
            name: t('Action'),
            minWidth: '150px',
            cell: row =>
                <div>
                    <SuccessButton
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => console.log("Edited")}
                    >
                        <Edit2 size={16} />
                    </SuccessButton>
                    <DangerButton
                        style={{ borderRadius: "50%", padding: "6px 9px" }}
                        onClick={() => { setDelete({ value: row, show: true }) }}
                    ><Trash2 size={16} /></DangerButton>
                </div>
        }

    ]

    // Handle delete
    const handleDelete = async () => {
        const res = await Requests.Inventory.Stock.StockDelete(isDelete.value.uid)
        if (res.status === 200) {
            Toastify.Success(t('Product Stock Deleted Successfully.'))
            fetchStockIns()
            setDelete({ ...isDelete, show: false, loading: false })
        } else {
            Toastify.Error(t('Product Stock not deleted Successfully.'))
            setDelete({ ...isDelete, show: false, loading: false })
        }
        setDelete({ ...isDelete, loading: true })
        setTimeout(() => {
            setDelete({ ...isDelete, show: false, loading: false })
        }, 1000)
    }

    return (
        <div>
            <Layout
                page="inventory / stock / stock in history"
                message="All batch of stock by whom your shop was filled is here"
                container="container-fluid"
                printable
                printData={"No data"}
                otherPage
                pageTitle="STOCK IN"
                pageLink="/dashboard/inventory/stock/in-history"
                button={
                    <div>
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

                    <Container.Column className="pr-4 mt-2 mb-2">
                        <div className="d-sm-flex justify-content-end pr-2">

                            {/* Category options */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Select Category')}</Text>
                                    <SingleSelect
                                        borderRadius={30}
                                        placeholder="customer"
                                        options={categoryData}
                                        value={event => console.log(event.value)}
                                    />
                                </FormGroup>
                            </div>

                            {/* Brand options */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Select Brand')}</Text>
                                    <SingleSelect
                                        borderRadius={30}
                                        placeholder="status"
                                        options={brandData}
                                        value={event => console.log(event.value)}
                                    />
                                </FormGroup>
                            </div>

                            {/* Supplier options */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Select Supplier')}</Text>
                                    <SingleSelect
                                        borderRadius={30}
                                        placeholder="status"
                                        options={supplierData}
                                        value={event => console.log(event.value)}
                                    />
                                </FormGroup>
                            </div>

                            {/* From Datepicker */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 160 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('From')}</Text>
                                    <DatePicker
                                        className="rounded-pill"
                                        selected={data => setDate(data)}
                                        deafultValue={date}
                                    />
                                </FormGroup>
                            </div>

                            {/* To Datepicker */}
                            <div style={{ width: size.width <= 576 ? "100%" : 160 }}>
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('To')}</Text>
                                    <DatePicker
                                        className="rounded-pill"
                                        selected={data => setToDate(data)}
                                        deafultValue={toDate}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </Container.Column>
                    {serverError ? <NetworkError message={t("Network error!")} /> : null}
                    {!serverError ?
                        <Container.Column>
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                totalRows={totalRows}
                                handlePerRowsChange={handlePerRowsChange}
                                handlePageChange={handlePageChange}
                                searchable
                                placeholder={"Search Stock in"}
                                noDataMessage="No Stock In History Available"
                                search={handleSearch}
                                suggestion={handleSuggestion}
                                searchLoading={searchLoading}
                                clearSearch={() => fetchStockIns(1)}
                            />
                        </Container.Column> : null
                    }

                </Main>
            </Layout>



            {/* Stock Delete */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<h6>Want to delete {isDelete.value ? isDelete.value.product_name + " of " + isDelete.value.batch_id : null} ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default StockStatus;