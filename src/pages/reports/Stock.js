
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { NetworkError } from '../../components/501/NetworkError'
import { DatePicker } from '../../components/datePicker/Index'
import { Container } from '../../components/container/Index'
import { Layout, Main } from '../../components/layout/Index'
import { SingleSelect } from '../../components/select/Index'
import { NoContent } from '../../components/204/NoContent'
import { DataTable } from '../../components/table/Index'
import { Loader } from '../../components/loading/Index'
import { Card } from '../../components/card/Index'
import { Text } from '../../components/text/Text'
import { Requests } from '../../utils/Http/Index'

const Customer = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [fromdate, setFromdate] = useState(new Date())
    const [category, setCategory] = useState(null)
    const [brand, setBrand] = useState(null)
    const [singleCustomer, setSingleCustomer] = useState({})
    const [error, setError] = useState(false)

    const fetchUsers = useCallback(async (page) => {
        setLoading(true)
        const response = await axios.get(
            `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,
        )

        setData(response.data.data)
        setTotalRows(response.data.total)
        setLoading(false)
    }, [perPage])

    const handlePageChange = page => {
        fetchUsers(page)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)

        const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`)

        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    };

    // fetching customer data
    const fetchCateogry = useCallback(async () => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Category.CategoryList()
            if (response && response.status === 200) {
                const data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    data.push({
                        value: response.data.data[i].uid,
                        label: response.data.data[i].name
                    })
                }
                setLoading(false)
                setCategory(data)
            }
        } catch (error) {
            if (error) {
                if (error.response && error.response.status === 401) {
                    setError(true)
                }
            }
            setLoading(false)
        }
    }, [])

    // fetching customer data
    const fetchBrand = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Brand.DokanBrandList()
            if (response && response.status === 200) {
                const data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    data.push({
                        value: response.data.data[i].uid,
                        label: response.data.data[i].name
                    })
                }
                setBrand(data)
            }
        } catch (error) {
            if (error) {
                if (error.response && error.response.status === 401) {
                    console.log("No Data")
                }
            }
        }
    }, [])

    useEffect(() => {
        fetchUsers(1)
        fetchCateogry()
        fetchBrand()
    }, [fetchUsers, fetchCateogry, fetchBrand])

    // date wise filtering
    const handleDateFilter = (start = null, end = null) => {
        console.log(start, end)
    }

    const columns = [
        {
            name: 'Date',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Customer',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Invoice No.',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Paid in Invoice',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Brand',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Product Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Product Code',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Purchase Price',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Sale Price',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Discount',
            selector: row => row.first_name,
            sortable: true,
        }
    ]

    return (
        <div>
            <Layout
                page="report / customer report"
                message="Customer wise product sales."
                container="container-fluid"
                printable
                printData={"No data"}
            >
                <Main>
                    {loading && !data.length ? <Loader /> : null}
                    {!loading && error && !data.length ? <NetworkError message="Network Error." /> :
                        !loading && !data.length ? <NoContent message="No Content." /> :
                            <>
                                <Container.Column className="px-3 mb-3">
                                    <Container.Row>

                                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                            <Card.Simple className="mr-1 mr-sm-2 mb-2">
                                                <Card.Body>
                                                    <Text className="fs-16 font-weight-bold mb-0"> 25000 Tk</Text>
                                                    <Text className="fs-16 mb-0"> Total Sell</Text>
                                                </Card.Body>
                                            </Card.Simple>
                                        </Container.Column>

                                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                            <Card.Simple className="mr-1 mr-sm-2 mb-2">
                                                <Card.Body>
                                                    <Text className="fs-16 font-weight-bold mb-0"> 0 Tk</Text>
                                                    <Text className="fs-16 mb-0"> Total Discount</Text>
                                                </Card.Body>
                                            </Card.Simple>
                                        </Container.Column>

                                    </Container.Row>
                                </Container.Column>

                                <Container.Column className="pl-0">
                                    <div className="row">
                                        <div className="col-xl-2 col-lg-3 ml-auto">
                                            <FormGroup>
                                                <Text className="fs-13 mb-0">Category</Text>
                                                <SingleSelect
                                                    borderRadius={30}
                                                    options={category}
                                                    placeholder={t('Select Customer')}
                                                    value={event => setSingleCustomer(event.value)}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="col-xl-2 col-lg-3 ">
                                            <FormGroup>
                                                <Text className="fs-13 mb-0">Brand</Text>
                                                <SingleSelect
                                                    borderRadius={30}
                                                    options={brand}
                                                    placeholder={t('Select Customer')}
                                                    value={event => setSingleCustomer(event.value)}
                                                />
                                            </FormGroup>
                                        </div>
                                        {/* Datepicker */}
                                        <div className='col-xl-2 col-lg-3 '>
                                            <FormGroup>
                                                <DatePicker
                                                    className="rounded-pill"
                                                    selected={data => { setFromdate(data); handleDateFilter(data) }}
                                                    deafultValue={fromdate}
                                                    message="From"
                                                />
                                            </FormGroup>
                                        </div>
                                        {/* Datepicker */}
                                        <div className='col-xl-2 col-lg-3 '>
                                            <FormGroup>
                                                <DatePicker
                                                    className="rounded-pill"
                                                    selected={data => { setFromdate(data); handleDateFilter(data) }}
                                                    deafultValue={fromdate}
                                                    message="To"
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </Container.Column>

                                <Container.Column className="pl-0">
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        loading={loading}
                                        totalRows={totalRows}
                                        handlePerRowsChange={handlePerRowsChange}
                                        handlePageChange={handlePageChange}

                                        searchable
                                        placeholder={"Search Supplier"}
                                    // search={handleSearch}
                                    // suggestion={handleSuggestion}
                                    // searchLoading={searchLoading}
                                    // clearSearch={() => fetchData(1)}
                                    />
                                </Container.Column>
                            </>}
                </Main>
            </Layout>
        </div>
    );
}

export default Customer;