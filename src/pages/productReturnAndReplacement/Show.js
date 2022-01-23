import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { ShortName } from '../../components/shortName/Index'
import { Text } from '../../components/text/Text'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { GrayButton } from '../../components/button/Index';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'react-feather';
import { Loader } from '../../components/loading/Index';
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { ReturnForm } from '../../components/form/ReturnForm'
import { Toastify } from '../../components/toastify/Toastify'
import { ReplaceForm } from '../../components/form/ReplaceForm'
import { ImageCircle } from '../../components/image/Index'

const Show = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [data, setData] = useState([])
    const [singleData, setSingleData] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const { id } = useParams()
    const [isReturnProduct, setReturnProduct] = useState({ show: false, loading: false, value: null })
    const [isReplaceProduct, setReplaceProduct] = useState({ show: false, loading: false, value: null })
    const [imeiData, setImeiData] = useState([])

    // fetch Single Employee data
    const fetchSingleEmployeeShow = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeShow(id)
            if (response && response.status === 200) setSingleData(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [id])


    // fetch employee data
    const fetchEmployee = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.total)
                const data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    data.push({
                        value: response.data.data[i].uid,
                        label: response.data.data[i].uid
                    })
                }
                setImeiData(data)
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
        fetchSingleEmployeeShow()
    }, [fetchSingleEmployeeShow])

    useEffect(() => {
        fetchEmployee(1)
    }, [fetchEmployee])

    //Handle Return Product
    const handleReturnProduct = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setReturnProduct({ ...isReturnProduct, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftCreate(newdata)
            if (response && response.status === 201) {
                fetchEmployee()
                Toastify.Success('Return Product added Successfully')
            }
            setReturnProduct({ ...isReturnProduct, loading: false, show: false })
        } catch (error) {
            if (error) {
                setReturnProduct({ ...isReturnProduct, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    //Handle Replace Product
    const handleReplaceProduct = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setReplaceProduct({ ...isReplaceProduct, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftCreate(newdata)
            if (response && response.status === 201) {
                fetchEmployee()
                Toastify.Success('Return Product added Successfully')
            }
            setReplaceProduct({ ...isReplaceProduct, loading: false, show: false })
        } catch (error) {
            if (error) {
                setReplaceProduct({ ...isReplaceProduct, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    // handle paginate page change
    const handlePageChange = page => fetchEmployee(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, newPerPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
            }
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setSearchLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setSearchLoading(false)

        } catch (error) {
            if (error) setSearchLoading(false)
        }
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.EmployeeAll.Employee.EmployeeSearch(value)

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

    // Table columns
    const columns = [
        {
            name: `${t('Name')}`,
            minWidth: "200px",
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Quantity')}`,
            selector: row => row.quantity || "0",
            sortable: true,
        },
        {
            name: `${t('Unit Price')}`,
            selector: row => row.unit_price || "0",
            sortable: true,
        },
        {
            name: `${t('Unit Discount')}`,
            selector: row => row.unit_discount || "0",
            sortable: true,
        },
        {
            name: `${t('Total Price')}`,
            selector: row => row.total_price || "0",
            sortable: true,
        },
        {
            name: `${t('Total Discount')}`,
            selector: row => row.total_discount || "0",
            sortable: true,
        },
        {
            name: `${t('Return & Replace Validity')}`,
            selector: row => row.date || "N/A",
            sortable: true,
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "280px",
            cell: row =>
                <div>
                    <GrayButton
                        type="button"
                        className="mt-2 mt-sm-0"
                        onClick={() => setReturnProduct({ show: true, loading: false, value: row })}
                    >
                        <span style={{ fontSize: 13 }}>{t('Return Product')}</span>
                    </GrayButton>
                    <GrayButton
                        type="button"
                        className="ml-2 mt-2 mt-sm-0"
                        onClick={() => setReplaceProduct({ show: true, loading: false, value: row })}
                    >
                        <span style={{ fontSize: 13 }}>{t('Replace Product')}</span>
                    </GrayButton>
                </div>
        }
    ]

    // styles
    const styles = {
        td: {
            width: 70,
        },
    };

    return (
        <div>
            <Layout
                page={t("dashboard / return & replacement / view")}
                message={t("All those products which will be returned and replace")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/product-return-replacement">
                            <GrayButton
                                className="mr-0 mr-sm-2"
                            >
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                        <GrayButton
                            type="button"
                            className="mt-2 mt-sm-0"
                            onClick={() => console.log("Will print")}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>
                {!loading && serverError ? <NetworkError message="Network Error!!!" /> : null}
                {loading && !serverError ? <Loader /> : null}

                {!loading && !serverError ?
                    <div className='w-100'>
                        <Container.Column>
                            <div className='d-lg-flex'>

                                {/* Employee image or short name */}
                                {singleData && singleData.image ?
                                    <div>
                                        <ImageCircle
                                            src={singleData.image}
                                            alt=""
                                            x={75}
                                            y={75}
                                        />
                                    </div>
                                    :
                                    <div>
                                        <ShortName
                                            name={singleData && singleData.name ? singleData.name : "Dokan"}
                                            x={75}
                                            y={75}
                                            size={37}
                                        />
                                    </div>
                                }

                                <div className="ml-lg-4 mt-4 mt-lg-0">
                                    <Text className="fs-16 font-weight-bolder mb-0">
                                        {singleData && singleData.name ? singleData.name : "No Name"}
                                    </Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Invoice
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="fs-13 mb-0">
                                                        : {singleData && singleData.invoice ? singleData.invoice : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Date
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.date ? singleData.date : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="ml-lg-4 mt-lg-4">
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Paid
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.paid ? singleData.paid : 0} tk
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Due
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.due ? singleData.due : 0} tk
                                                    </Text>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Container.Column>

                        {/* Data table */}
                        <Container.Column>
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                totalRows={totalRows}
                                handlePerRowsChange={handlePerRowsChange}
                                handlePageChange={handlePageChange}
                                searchable
                                placeholder={"Search Product"}
                                search={handleSearch}
                                suggestion={handleSuggestion}
                                searchLoading={searchLoading}
                                clearSearch={() => fetchEmployee(1)}
                            />
                        </Container.Column>
                    </div>
                    : null
                }
            </Main>

            {/* Product return modal */}
            <PrimaryModal
                title={t('Return Product')}
                show={isReturnProduct.show}
                size="md"
                onHide={() => setReturnProduct({ show: false, loading: false })}
            >
                <ReturnForm
                    show={isReturnProduct.show}
                    loading={isReturnProduct.loading}
                    // amountType={isReturnProduct.value}
                    submit={handleReturnProduct}
                    handleAction={() => fetchEmployee()}
                    onHide={() => setReturnProduct({ show: false, loading: false })}
                />
            </PrimaryModal>

            {/* Product replace modal */}
            <PrimaryModal
                title={t('Replace Product')}
                show={isReplaceProduct.show}
                size="md"
                onHide={() => setReplaceProduct({ show: false, loading: false })}
            >
                <ReplaceForm
                    show={isReplaceProduct.show}
                    loading={isReplaceProduct.loading}
                    // amountType={isReturnProduct.value}
                    imeiOptions={imeiData}
                    submit={handleReplaceProduct}
                    handleAction={() => fetchEmployee()}
                    onHide={() => setReplaceProduct({ show: false, loading: false })}
                />
            </PrimaryModal>
        </div>
    );
}

export default Show;


