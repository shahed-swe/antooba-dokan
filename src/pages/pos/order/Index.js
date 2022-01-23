
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Edit2, Eye, Gift } from 'react-feather'
import {
    SuccessButton,
    DangerButton,
} from '../../../components/button/Index'
import { useTranslation } from 'react-i18next'
import { DataTable } from '../../../components/table/Index'
import { Loader } from '../../../components/loading/Index'
import { NoContent } from '../../../components/204/NoContent'
import { Layout, Main } from '../../../components/layout/Index'
import { NetworkError } from '../../../components/501/NetworkError'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { Container } from '../../../components/container/Index'
import { Product } from '../../../components/product/Index'
import { Requests } from '../../../utils/Http/Index'
import { Text } from '../../../components/text/Text'
import { useWindowSize } from '../../../components/window/windowSize'
import { SingleSelect } from '../../../components/select/Index'
import { dateYearFormat } from '../../../utils/_heplers'
import { DatePicker } from '../../../components/datePicker/Index'

const Index = () => {
    const [data, setData] = useState([]);
    const size = useWindowSize()
    const { t } = useTranslation()
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState(false)
    const [show_product_modal, setShowProductModal] = useState(false)
    const [date, setDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [serverError, setServerError] = useState(false)
    const [customers, setCustomers] = useState([])
    const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Delivered", value: "delivered" }
    ]

    const fetchUsers = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,)
            if (response.data.data) {
                setData(response.data.data)
                setLoading(false)
                setTotalRows(response.data.total)
            }

        } catch (error) {
            if (error.response && error.response.message) {

                setError(true)
            }
            setLoading(false)
        }



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


    const fetchData = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductList(page, 10)
            setProducts(response.data.data)
            setLoading(false)
            setError(false)
        } catch (error) {
            setLoading(false)
            setError(true)
        }

    }, [])


    useEffect(() => {
        fetchUsers()
        fetchData()
    }, [fetchUsers, fetchData])

    const columns = [
        {
            name: 'Order Code',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Amount Paid',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Amount Due',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Payment Method',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Products',
            cell: row =>
                <DangerButton
                    type="button"
                    style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                    onClick={() => setShowProductModal(true)}
                ><Gift size={16} />
                </DangerButton>
        },
        {
            name: 'Action',
            minWidth: '100px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/order/show/${row.id}`}>
                        <SuccessButton
                            type="button"
                            style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                            onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>
                    <SuccessButton
                        type="button"
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => handleAction(row)}
                    ><Edit2 size={16} />
                    </SuccessButton>

                </div>
        }
    ]

    // Handle action
    const handleAction = value => console.log(value);

    // Handle search
    const handleSearch = async query => {
        setSearching(true)
        console.log(query)

        setTimeout(() => {
            setSearching(false)
        }, 2000);
    }


    // filter by mechanic
    const handleMechanicFilter = async (mechanic, page) => {
        if (mechanic !== "default") {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(date), mechanic, page, perPage)
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchData(1)
        }
    }

    // filter by status
    const handleStatusFilter = async (status, page) => {
        if (status !== "default") {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(date), status, page, perPage)
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchData(1)
        }
    }

    // fetch mechanics data
    const fetchMechanicData = useCallback(async (page) => {
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage)
            if (response.status === 200) {
                // setMechanics(response.data.data)
                let data = []
                if (response.data.data) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        let elements = response.data.data[i]
                        data.push({
                            label: elements.name,
                            value: elements.uid
                        })
                    }
                }
                setCustomers(data)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    // Mechanic Data Call
    useEffect(() => {
        fetchMechanicData(1)
    }, [fetchMechanicData])

    return (
        <div>
            <Layout
                page="pos / order list"
                message="All orders you & your customers made is here."
                container="container-fluid"
                printable
                printData={"No data"}
                otherPage
                pageLink="/dashboard/inventory/product/new"
            >
                <Main>
                    <Container.Column className="pr-4 mt-2 mb-2">
                        <div className="d-sm-flex justify-content-end pr-2">

                            {/* Paid Amount Range */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Paid Amount Range')}</Text>
                                    <input type="text" className='form-control rounded-pill shadow-none' placeholder='max paid amount range' onBlur={(event) => console.log(event.target.value)}/>
                                </FormGroup>
                            </div>
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <input type="text" className='form-control mt-md-5 mt-lg-5 mt-xl-4 rounded-pill shadow-none' placeholder='min paid amount range' onBlur={(event) => console.log(event.target.value)}/>
                                </FormGroup>
                            </div>

                            {/* Due Amount Range */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Due Amount Range')}</Text>
                                    <input type="text" className='form-control rounded-pill shadow-none' placeholder='max due amount range' onBlur={(event) => console.log(event.target.value)}/>
                                </FormGroup>
                            </div>
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <input type="text" className='form-control mt-md-5 mt-lg-5 mt-xl-4 rounded-pill shadow-none' placeholder='min due amount range' onBlur={(event) => console.log(event.target.value)}/>
                                </FormGroup>
                            </div>

                            {/* Mechanic options */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Select Customer')}</Text>
                                    <SingleSelect
                                        borderRadius={30}
                                        placeholder="customer"
                                        options={customers}
                                        value={event => handleMechanicFilter(event.value)}
                                    />
                                </FormGroup>
                            </div>

                            {/* Status options */}
                            <div
                                className="pr-sm-2 mb-2 mb-sm-0"
                                style={{ width: size.width <= 576 ? "100%" : 200 }}
                            >
                                <FormGroup className="mb-0">
                                    <Text className="text-capitalize fs-13 mb-1">{t('Select status')}</Text>
                                    <SingleSelect
                                        borderRadius={30}
                                        placeholder="status"
                                        options={statusOptions}
                                        value={event => handleStatusFilter(event.value)}
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
                    <Container.Column>
                    {loading && !data.length ? <Loader /> : null}
                    {!loading && error && !data.length ? <NetworkError message="Network Error." /> :
                        !loading && !data.length ? <NoContent message="No Content." /> :
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                totalRows={totalRows}
                                handlePerRowsChange={handlePerRowsChange}
                                handlePageChange={handlePageChange}
                                search={handleSearch}
                                searching={searching}
                            />}
                    </Container.Column>
                </Main>
            </Layout>

            {/* Product Show Modal */}
            <PrimaryModal
                show={show_product_modal}
                onHide={() => setShowProductModal(false)}
                size="xl"
                title="Ordered Product"
            >
                {loading && !error && !products.length ? <Loader /> : null}
                {!loading && error && !products.length ? <NetworkError message="Network Error." /> :
                    !loading && !error && !products.length ? <NoContent message="No Content." /> :
                        <Container.Column className="pb-5 pt-4">
                            {products.map((item, index) => {
                                return <Product key={index} product={item} order={true} height={230} />
                            })}
                        </Container.Column>
                }
            </PrimaryModal>
        </div>
    );
}

export default Index;