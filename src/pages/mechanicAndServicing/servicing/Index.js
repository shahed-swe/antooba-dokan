import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Edit2, Eye, Plus, Printer, Trash2 } from 'react-feather'
import { DangerButton, GrayButton, SuccessButton } from '../../../components/button/Index'
import { ServicingStatusForm } from '../../../components/form/ServicingStatusForm'
import { useWindowSize } from '../../../components/window/windowSize'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { NetworkError } from '../../../components/501/NetworkError'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { DatePicker } from '../../../components/datePicker/Index'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { SingleSelect } from '../../../components/select/Index'
import { DataTable } from '../../../components/table/Index'
import { dateYearFormat } from '../../../utils/_heplers'
import { Text } from '../../../components/text/Text'
import { Requests } from '../../../utils/Http/Index'

const Index = () => {
    const { t } = useTranslation()
    const size = useWindowSize()
    const [data, setData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isLoading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [isDestroy, setDestroy] = useState({ value: null, show: false, loading: false })
    const [mechanics, setMechanics] = useState([])
    const [date, setDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [isChangeStatus, setChangeStatus] = useState({ show: false, loading: false })
    const [status, setStatus] = useState(null)
    const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Delivered", value: "delivered" }
    ]

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            const response = await Requests.Servicing.Index(page, perPage)
            if (response.status === 200) {
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

    // fetch mechanics data
    const fetchMechanicData = useCallback(async (page) => {
        try {
            const response = await Requests.Mechanic.Index(page, perPage)
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
                setMechanics(data)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    //fetching data call
    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // Mechanic Data Call
    useEffect(() => {
        fetchMechanicData(1)
    }, [fetchMechanicData])


    // handle page change
    const handlePageChange = (page) => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.Servicing.Index(page, perPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // handle search
    const handleSearch = async (data) => {
        setSearching(true)
        const response = await Requests.Servicing.Search(data)
        setData(response.data.data)
        setSearching(false)
    }

    // handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: null,
            message: null
        }
        const response = await Requests.Servicing.Search(value)
        if (response && response.status === 200) {
            const items = []

            if (response.data.data && response.data.data.length) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    items.push(element.device_name)
                }
            }
            data.results = items
        }
        else data.message = t("No results found")
        return data
    }

    // Handle delete
    const handleDelete = async () => {
        try {
            setDestroy({ ...isDestroy, loading: true })
            const response = await Requests.Servicing.Destroy(isDestroy.value.uid)
            if (response && response.status === 200) {
                fetchData(1)
                Toastify.Success("Successfully deleted.")
            }
            setDestroy({ ...isDestroy, show: false, loading: false })
        } catch (error) {
            if (error) {
                setDestroy({ ...isDestroy, loading: false })
                Toastify.Error("Network error.")
            }
        }
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

    // Handle status submission
    const handleStatusSubmission = async (data) => {
        try {
            setChangeStatus({ ...isChangeStatus, loading: true })
            console.log(data)

            setTimeout(() => {
                setChangeStatus({ value: null, loading: false, show: false })
                Toastify.Success("Successfully working in dummy.")
            }, 2000)
        } catch (error) {
            if (error) {
                setChangeStatus({ ...isChangeStatus, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }

    // datatable custom styles
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        },
        pointer: {
            cursor: "pointer"
        }
    }

    // Data columns
    const columns = [
        {
            name: 'Device',
            sortable: true,
            selector: row => row.device_name || "N/A"
        },
        {
            name: 'Model',
            sortable: true,
            selector: row => row.device_model || "N/A"
        },
        {
            name: 'Received date',
            sortable: true,
            selector: row => row.received_date || "N/A"
        },
        {
            name: 'Delivery date',
            sortable: true,
            selector: row => row.delivery_date || "N/A"
        },
        {
            name: 'Status',
            sortable: true,
            selector: row =>
                <div className="mb-0 text-primary"
                    onClick={() => {
                        setChangeStatus({ ...isChangeStatus, show: true })
                        setStatus(row.status ? row.status : "pending")
                    }}
                    style={customStyles.pointer}
                >
                    {row.status ? row.status : "Pending"}
                </div>
        },
        {
            name: 'Action',
            minWidth: '250px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/servicing/show/${row.uid}`}>
                        <GrayButton
                            type="button"
                            className="circle-btn"
                        ><Eye size={16} />
                        </GrayButton>
                    </Link>

                    <Link to={`/dashboard/servicing/edit/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            className="circle-btn mx-1"
                        ><Edit2 size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        type="button"
                        className="circle-btn mx-1"
                        onClick={() => setDestroy({ ...isDestroy, value: row, show: true })}
                    ><Trash2 size={16} />
                    </DangerButton>

                    <Link to={`/dashboard/servicing/print/${row.uid}`}>
                        <GrayButton
                            className="circle-btn"
                        // onClick={() => window.print()}
                        >
                            <Printer size={16} />
                        </GrayButton>
                    </Link>

                </div>
        }
    ]

    return (
        <div>
            <Layout
                page="mechanic & servicing / servicing"
                message="Servicing of your shop."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/servicing/create">
                            <GrayButton type="button">
                                <Plus size={15} className="mr-2" />
                                <span style={{ fontSize: 13 }}>ADD SERVICING</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {serverError ? <NetworkError message={t("Network error!")} /> : null}
                <Container.Column className="pr-4">
                    <div className="d-sm-flex justify-content-end pr-2">

                        {/* Mechanic options */}
                        <div
                            className="pr-sm-2 mb-2 mb-sm-0"
                            style={{ width: size.width <= 576 ? "100%" : 200 }}
                        >
                            <FormGroup className="mb-0">
                                {/* <select
                                            className="form-control shadow-none rounded-pill"
                                            name="mechaniceSelect"
                                            onChange={(event) => { handleMechanicFilter(event.target.value) }}
                                        >
                                            <option value="default">Select mechanic</option>
                                            {mechanics && mechanics.map((item, i) =>
                                                <option
                                                    key={i}
                                                    value={item.uid}
                                                >{item.name}</option>
                                            )}
                                        </select> */}
                                <Text className="text-capitalize fs-13 mb-1">{t('Select mechanic')}</Text>
                                <SingleSelect
                                    borderRadius={30}
                                    placeholder="mechanic"
                                    options={mechanics}
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
                                {/* <select
                                    className="form-control shadow-none rounded-pill"
                                    name="statusSelect"
                                    onChange={(event) => { handleStatusFilter(event.target.value) }}
                                >
                                    <option value="default">Select Shift</option>
                                    {mechanics && mechanics.map((item, i) =>
                                        <option
                                            key={i}
                                            value={item.uid}
                                        >{item.name}</option>
                                    )}
                                </select> */}
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
                {!serverError ?
                    <Container.Column>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={isLoading}
                            totalRows={totalRows}
                            customStyles={customStyles}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}
                            noDataMessage="No servicing data available"
                            searchable
                            search={handleSearch}
                            searchLoading={searching}
                            placeholder={"Search service"}
                            clearSearch={() => fetchData(1)}
                            suggestion={handleSuggestion}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Status changes modal */}
            <PrimaryModal
                title={t("Change status")}
                show={isChangeStatus.show}
                size="md"
                onHide={() => setChangeStatus({ show: false, loading: false })}
            >
                <ServicingStatusForm
                    status={status}
                    options={statusOptions}
                    loading={isChangeStatus.loading}
                    onSubmit={handleStatusSubmission}
                />
            </PrimaryModal>

            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDestroy.show}
                loading={isDestroy.loading}
                message={<Text className="mt-3 fs-14">Want to delete {isDestroy.value ? isDestroy.value.device_name : null} ?</Text>}
                onHide={() => setDestroy({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    )
}

export default Index;