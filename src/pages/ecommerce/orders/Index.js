import React, { useEffect, useState, useCallback } from 'react'
import { Eye, Trash2 } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { Card } from '../../../components/card/Index'
import { Text } from '../../../components/text/Text'
import { SingleSelect } from '../../../components/select/Index'
import { DataTable } from '../../../components/table/Index'
import { DatePicker } from '../../../components/datePicker/Index'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { useQuery } from '../../../components/query/Index'
import { Loader } from '../../../components/loading/Index'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { DangerButton, SuccessButton } from '../../../components/button/Index'
import { OrderReject } from '../../../components/form/OrderReject'
import { Toastify } from '../../../components/toastify/Toastify'
import { dateYearFormat, dateFormate } from '../../../utils/_heplers'
import { Requests } from '../../../utils/Http/Index'


const Index = () => {
    const { t } = useTranslation()
    const queryParams = useQuery()
    const history = useHistory()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isLoading, setLoading] = useState(false)
    const [searching, setSearching] = useState(false)
    const [rejectOrder, setRejectOrder] = useState({ show: false, value: null, loading: false })

    // for fetching single product
    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.IMEI.SingleProductCode(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.data.meta ? response.data.data.meta.total : 0)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    }, [perPage])

    useEffect(() => {
        if (queryParams) {
            let params = { ...queryParams }
            params.page = queryParams.page || 1
            params.limit = queryParams.limit || 10

            const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

            console.log(queryString)
            fetchData(1)
        }
    }, [
        queryParams.limit,
        queryParams.page,
        queryParams.order_status,
        queryParams.payment_status,
        queryParams.from,
        queryParams.to,
        fetchData
    ])

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
        try{
            const response = await Requests.IMEI.SearchSingleProductCode(query)
            if (response.status === 200 && response.data) setData(response.data.data)
            setSearching(false)
        }catch(error){
            if(error){
                setSearching(false)
            }
        }
        
        
    }

    // handle page change
    const handlePageChange = page => {
        let params = { ...queryParams }
        params.page = page
        setPerPage(page + 1)

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
    }

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        let params = { ...queryParams }
        params.page = page
        params.limit = newLimit

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
        setLoading(false)
    }

    // handle order status change
    const handleOrderStatusChange = data => {
        let params = { ...queryParams }

        if (data && data.value) {
            params.order_status = data.value
        } else {
            delete params.order_status
        }

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
    }

    // handle payment status change
    const handlePaymentStatusChange = data => {
        let params = { ...queryParams }

        if (data && data.value) {
            params.payment_status = data.value
        } else {
            delete params.payment_status
        }

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
    }

    // handle date from
    const handleFromChange = value => {
        let params = { ...queryParams }
        params.from = value

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
    }

    // handle date to
    const handleToChange = value => {
        let params = { ...queryParams }
        params.to = value

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/ecommerce/orders?${queryString}`)
    }

    // handle order reject
    const handleRejectOrder = async (data) => {
        try {
            setRejectOrder({ ...rejectOrder, loading: true })
            console.log(data)

            setTimeout(() => {
                setRejectOrder({ value: null, loading: false, show: false })
                Toastify.Success("Order rejected.")
                fetchData(1)
            }, 1000)
        } catch (error) {
            if (error) {
                console.log(error)
                Toastify.Error("Network error.")
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
            name: 'Date',
            grow: 0,
            width: "120px",
            cell: row => dateFormate(new Date())
        },
        {
            name: 'Invoice',
            sortable: true,
            selector: row => row.invoice || "N/A",
        },
        {
            name: 'Customer',
            sortable: true,
            cell: row =>
                <div className="py-2">
                    <Text className="fs-13 font-weight-bold mb-1">Customer name</Text>
                    <Text className="fs-13 mb-0">01XX-XXXX-XXX</Text>
                </div>
        },
        {
            name: 'Total',
            sortable: true,
            selector: row => row.total || 0 + " tk."
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => "Pending"
        },
        {
            name: 'Payment',
            sortable: true,
            selector: row => "Paid"
        },
        {
            name: 'Action',
            width: '130px',
            cell: row =>
                <div>
                    <SuccessButton
                        type="button"
                        className="circle-btn"
                        onClick={()=> history.push(`/dashboard/ecommerce/orders/${row.uid}`)}
                    >
                        <Eye size={16} />
                    </SuccessButton>
                    <DangerButton
                        type="button"
                        className="circle-btn ml-1"
                        onClick={() => setRejectOrder({ ...rejectOrder, value: row, show: true })}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div >
        }
    ]


return (
    <div>
        <Layout
            page="dashboard / E-commerce / orders"
            message="Orders form e-commerce."
            container="container-fluid"
        />

        <Main>
            {isLoading ? <Loader /> : null}

            {/* Card items */}
            <Container.Column className="col-sm-6 col-xl-3">
                <Card.Simple className="sms-item-card py-4">
                    <Text className="fs-30 font-weight-bolder mb-0">714K</Text>
                    <Text className="fs-14 mb-0">Total order</Text>
                </Card.Simple>
            </Container.Column>

            {/* Card items */}
            <Container.Column className="col-sm-6 col-xl-3">
                <Card.Simple className="sms-item-card py-4">
                    <Text className="fs-30 font-weight-bolder mb-0">714K</Text>
                    <Text className="fs-14 mb-0">Total sale</Text>
                </Card.Simple>
            </Container.Column>

            {/* Card items */}
            <Container.Column className="col-sm-6 col-xl-3">
                <Card.Simple className="sms-item-card py-4">
                    <Text className="fs-30 font-weight-bolder mb-0">714K</Text>
                    <Text className="fs-14 mb-0">Busket size</Text>
                </Card.Simple>
            </Container.Column>

            {/* Card items */}
            <Container.Column className="col-sm-6 col-xl-3">
                <Card.Simple className="sms-item-card py-4">
                    <Text className="fs-30 font-weight-bolder mb-0">714K</Text>
                    <Text className="fs-14 mb-0">Total product sale</Text>
                </Card.Simple>
            </Container.Column>

            <Container.Column className="pt-3">
                <Text className="mb-2 fs-14">Recent orders</Text>
            </Container.Column>

            {/* Filter order by status */}
            <Container.Column className="col-sm-6 col-xl-3 mb-3 mb-xl-0">
                <SingleSelect
                    placeholder="order status"
                    options={[
                        { label: "Created", value: "Created" },
                        { label: "Pending", value: "Pending" }
                    ]}
                    deafult={queryParams.order_status ?
                        {
                            label: queryParams.order_status,
                            value: queryParams.order_status
                        } : null
                    }
                    isClearable
                    value={data => handleOrderStatusChange(data)}
                />
            </Container.Column>

            {/* Filter by payment status */}
            <Container.Column className="col-sm-6 col-xl-3 mb-3 mb-xl-0">
                <SingleSelect
                    placeholder="payment status"
                    options={[
                        { label: "Paid", value: "Paid" },
                        { label: "Pending", value: "Pending" },
                        { label: "Partially Paid", value: "Partially Paid" }
                    ]}
                    deafult={queryParams.payment_status ?
                        {
                            label: queryParams.payment_status,
                            value: queryParams.payment_status
                        } : null
                    }
                    isClearable
                    value={data => handlePaymentStatusChange(data)}
                />
            </Container.Column>

            {/* Filter by date from */}
            <Container.Column className="col-sm-6 col-xl-3 mb-3 mb-xl-0">
                <FormGroup className="mb-0">
                    <DatePicker
                        deafultValue={queryParams.from ? new Date(queryParams.from) : new Date()}
                        selected={data => handleFromChange(dateYearFormat(data))}
                    />
                </FormGroup>
            </Container.Column>

            {/* Filter by date to */}
            <Container.Column className="col-sm-6 col-xl-3 mb-3 mb-xl-0">
                <FormGroup className="mb-0">
                    <DatePicker
                        deafultValue={queryParams.to ? new Date(queryParams.to) : new Date()}
                        selected={data => handleToChange(dateYearFormat(data))}
                    />
                </FormGroup>
            </Container.Column>

            {/* Recent orders */}
            <Container.Column>
                <DataTable
                    columns={columns}
                    data={data}
                    loading={isLoading}
                    totalRows={totalRows}
                    customStyles={customStyles}
                    handlePerRowsChange={handleLimitChange}
                    handlePageChange={handlePageChange}
                    searchable
                    search={handleSearch}
                    searchLoading={searching}
                    placeholder={"Search order"}
                    clearSearch={() => fetchData(1)}
                    suggestion={handleSuggestion}
                />
            </Container.Column>

            {/* Order reject modal */}
            <PrimaryModal
                show={rejectOrder.show}
                onHide={() => setRejectOrder({ value: null, loading: false, show: false })}
                title="Reject Order"
            >
                <OrderReject
                    loading={rejectOrder.loading}
                    onSubmit={data => handleRejectOrder(data)}
                />
            </PrimaryModal>
        </Main>
    </div>
)
}


export default Index;