import React, { useState, useEffect, useCallback } from 'react'
import { Plus } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { DatePicker } from '../../../components/datePicker/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { GrayButton } from '../../../components/button/Index'
import { DataTable } from '../../../components/table/Index'
import { dateYearFormat } from '../../../utils/_heplers'
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


    // fetch daily payable data
    const fetchDailyPayableData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.AccountingAll.DailyPayable.DailyPayableIndex(perPage)
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
        fetchDailyPayableData()
    }, [fetchDailyPayableData])

    // hange paginate page change
    const handlePageChange = page => fetchDailyPayableData(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage) => {
        setLoading(true)
        const response = await Requests.AccountingAll.DailyPayable.DailyPayableIndex(newPerPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.AccountingAll.DailyPayable.DailyPayableSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if (error) {
                setsearchLoading(false)
            }
        }
    }

    //12/01/2022 end here

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
            fetchDailyPayableData()
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
            fetchDailyPayableData()
        }
    }

    const columns = [
        {
            name: `${t('Date')}`,
            selector: row => row.date || "N/A",
            sortable: true,
            maxWidth: "250px"
        },
        {
            name: `${t('Name')}`,
            selector: row => row.name || "N/A",
            sortable: true,
            maxWidth: "300px"
        },
        {
            name: `${t('Amount (Tk)')}`,
            selector: row => row.amount || 0,
            sortable: true,
            maxWidth: "200px"
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
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / accounting / daily payable")}
                message={t("Who are using this system.")}
                container="container-fluid"
                button={
                    <Link to={`/dashboard/accounting/daily-payable/create`} >
                        <GrayButton
                            className="ml-2 mt-2 mt-sm-0"
                        >
                            <Text className="fs-13 mb-0"> <Plus size={13} /><span className='text-secondary ml-1'>{t('ADD NEW PAYABLE')}</span></Text>
                        </GrayButton>
                    </Link>
                }
            />
            <Main>

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
                        noDataMessage={t('No daily due list available')}
                        placeholder={"Search"}
                        search={handleSearch}
                        searchLoading={searchLoading}
                        suggestion={handleSuggestion}
                        clearSearch={() => fetchDailyPayableData()}
                    />
                </Container.Column>
            </Main>

        </div>
    );
}

export default Index;
