import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { DatePicker } from '../../../components/datePicker/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { DataTable } from '../../../components/table/Index'
import { dateYearFormat } from '../../../utils/_heplers'
import { Card } from '../../../components/card/Index'
import { Requests } from '../../../utils/Http/Index'
import { Text } from '../../../components/text/Text'

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [serverError, setServerError] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [date, setDate] = useState(null)
    const [toDate, setToDate] = useState(null)

    // fetch cash data
    const fetchCashData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.total)
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
        fetchCashData(1)
    }, [fetchCashData])

    // hange paginate page change
    const handlePageChange = page => fetchCashData(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.EmployeeAll.Employee.EmployeeList(page, newPerPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) {
                setsearchLoading(false)
            }
        }
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.EmployeeAll.Employee.EmployeeSearch(value)
        console.log(response)

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

    // filter by start date
    const handleStartDateFilter = async (data) => {
        if (toDate !== null) {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(data), dateYearFormat(toDate), perPage)
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchCashData(1)
        }
    }

    // filter by end date
    const handleEndDateFilter = async (data) => {
        if (date !== null) {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(date), dateYearFormat(data), perPage)
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchCashData(1)
        }
    }

    const columns = [
        {
            name: `${t('Date')}`,
            selector: row => row.date || "N/A",
            sortable: true,
        },
        {
            name: `${t('Name')}`,
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Debit (Tk)')}`,
            selector: row => row.debit || 0,
            sortable: true,
        },
        {
            name: `${t('Credit (Tk)')}`,
            selector: row => row.credit || 0,
            sortable: true,
        },
        {
            name: `${t('Comulative Amount (Tk)')}`,
            selector: row => row.comulative_amount || 0,
            sortable: true,
            minWidth: "165px"
        },
        {
            name: `${t('Description')}`,
            selector: row =>
                <div
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={row.description || "N/A"}
                    style={customStyles.cursor}
                >
                    {row.description || "N/A"}
                </div>,
            sortable: true,
        },
    ]

    const customStyles = {
        background: {
            backgroundColor: "#e9ecef"
        },
        cursor: {
            cursor: "pointer"
        },
        text_color: {
            color: "#063cdd"
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / accounting / cash")}
                message={t("Cash Information")}
                container="container-fluid"
            />
            <Main>

                {/* Available cash & starting cash portion */}
                <Container.Column>
                    <Container.Row className="px-3 mb-3">

                        {/* Available cash */}
                        <Container.Column className="col-md-6 text-center p-1">
                            <Card.Simple className="border-0" style={customStyles.background}>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 mb-0 font-weight-bold"> Date: {data && data.date ? data.date : "N/A"}</Text>
                                    <Text className="fs-16 mb-0 font-weight-bold"> Available Cash: {data && data.available_cash ? data.available_cash : 0} Tk</Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Starting cash */}
                        <Container.Column className="col-md-6 text-center p-1">
                            <Card.Simple className="border-0" style={customStyles.background}>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 mb-0"> Date: {data && data.date ? data.date : "N/A"}</Text>
                                    <Text className="fs-16 mb-0"> Starting Cash: {data && data.starting_cash ? data.starting_cash : 0} Tk </Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                    </Container.Row>
                </Container.Column>

                {/* Date picker start to end*/}
                <Container.Column className="mb-2">
                    <Container.Row className="pl-md-2">

                        {/* Start date picker */}
                        <Container.Column className="col-md-3">
                            <FormGroup className="mb-0">
                                <Text className="text-capitalize fs-13 mb-1">{t('Start date')}</Text>
                                <DatePicker
                                    className="rounded"
                                    selected={data => {
                                        setDate(data)
                                        handleStartDateFilter(data)
                                    }}
                                    deafultValue={date}
                                />
                            </FormGroup>
                        </Container.Column>

                        {/* End date picker */}
                        <Container.Column className="col-md-3">
                            <FormGroup className="mb-0">
                                <Text className="text-capitalize fs-13 mb-1">{t('End date')}</Text>
                                <DatePicker
                                    className="rounded"
                                    selected={data => {
                                        setToDate(data)
                                        handleEndDateFilter(data)
                                    }}
                                    deafultValue={toDate}
                                />
                            </FormGroup>
                        </Container.Column>

                    </Container.Row>
                </Container.Column>

                <Container.Column>
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}

                        searchable
                        noDataMessage={t('No cash list available')}
                        placeholder={"Search"}
                        search={handleSearch}
                        searchLoading={searchLoading}
                        suggestion={handleSuggestion}
                        clearSearch={() => fetchCashData(1)}
                    />
                </Container.Column>

            </Main>

        </div>
    );
}

export default Index;
