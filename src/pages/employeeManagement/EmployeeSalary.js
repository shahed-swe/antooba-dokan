import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { GrayButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { NoContent } from '../../components/204/NoContent'
import { DollarSign } from 'react-feather'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { SalaryPayForm } from '../../components/form/SalaryPayForm'
import { Loader } from '../../components/loading/Index'
import { Toastify } from '../../components/toastify/Toastify'
import { useWindowSize } from '../../components/window/windowSize'
import { FormGroup } from '../../components/formGroup/FormGroup'

const EmployeeSalary = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const size = useWindowSize()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [shifts, setShifts] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [isPayNow, setIsPayNow] = useState({ show: false, loading: false })
    const [payNowLoading, setPayNowLoading] = useState({ show: false, loading: false })
    const [payNow, setPayNow] = useState({ date: new Date(), payAmount: 1000 })
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)

    const yearOptions = []

    for (let i = ((new Date().getFullYear()) - 22); i < ((new Date().getFullYear()) + 5); i++) {
        yearOptions.push({
            label: i + 1, value: i + 1
        })
    }

    const monthOptions = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
    ]

    // fetch shift data
    const fetchShifts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response && response.status === 200) setShifts(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [])

    // fetch employee data
    const fetchEmployee = useCallback(async (page) => {
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

    // fetch over time data
    useEffect(() => {
        fetchShifts()
    }, [fetchShifts])

    useEffect(() => {
        fetchEmployee(1)
    }, [fetchEmployee])

    // handle paginate page change
    const handlePageChange = page => fetchEmployee(page)

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
            setSearchLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setSearchLoading(false)
        } catch (error) {
            if (error) {
                setSearchLoading(false)
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

    //Handle create salary pay
    const handleSalaryPayCreate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setPayNowLoading({ ...payNowLoading, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftCreate(newdata)
            if (response.status === 201) {
                Toastify.Success('EmployeShift Added Successfully')
            }
            setPayNowLoading({ ...payNowLoading, loading: false, show: false })
        } catch (error) {
            if (error) {
                setPayNowLoading({ ...payNowLoading, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    // filter by shift
    const handleShiftFilter = async (data) => {
        if (data !== "default") {
            try {
                const response = await Requests.EmployeeAll.Overtime.EmployeeOvertimeFilterShift(data)
                if (response && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchEmployee()
        }
    }

    // filter by month and salary
    const handleMonthYear = async (month_param, year_param) => {
        const year = year_param || (new Date().getFullYear()).toString()
        const month = month_param || (new Date().getMonth() + 1).toString()
        console.log(year, month)
    }

    // data columns
    const columns = [
        {
            name: `${t('Name')}`,
            minWidth: "180px",
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Total Amount')}`,
            minWidth: "130px",
            selector: row => row.total_amount || "0",
            sortable: true,
        },
        {
            name: `${t('Current Salary')}`,
            minWidth: "130px",
            selector: row => row.current_salary || "0",
            sortable: true,
        },
        {
            name: `${t('Penalty Amount')}`,
            minWidth: "130px",
            selector: row => row.penalty_amount || "0",
            sortable: true,
        },
        {
            name: `${t('Advance Taken')}`,
            minWidth: "130px",
            selector: row => row.advance_taken || "0",
            sortable: true,
        },
        {
            name: `${t('Overtime Amount')}`,
            minWidth: "140px",
            selector: row => row.overtime_amount || "0",
            sortable: true,
        },
        {
            name: `${t('Previous Due')}`,
            minWidth: "130px",
            selector: row => row.previous_due || "0",
            sortable: true,
        },
        {
            name: `${t('Bonus Amount')}`,
            minWidth: "130px",
            selector: row => row.bonus_amount || "0",
            sortable: true,
        },
        {
            name: `${t('Current Month Given')}`,
            minWidth: "150px",
            selector: row => row.current_month_given || "0",
            sortable: true,
        },
        {
            name: `${t('Current Month Due')}`,
            minWidth: "150px",
            selector: row => row.current_month_due || "0",
            sortable: true,
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "140px",
            cell: row =>
                <div>
                    <GrayButton
                        className="text-info"
                        onClick={() => setIsPayNow({ ...isPayNow, show: true, })}
                    ><DollarSign size={13} /> Pay Now
                    </GrayButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / employee Salary")}
                message={t("Employee's Salary Information.")}
                container="container-fluid"
            />

            <Main>
                {loading && !serverError && !data.length ? <Loader /> : null}
                {!loading && serverError && !data.length ? <NetworkError message="Network Error!!!" /> : null}
                {!loading && !serverError && !data.length ? <NoContent message="Employee salary list not available!!!" /> : null}

                {!loading && !serverError && data.length ?
                    <div className='w-100'>

                        {/* Form Items */}
                        <Container.Column>
                            <div className="d-sm-flex justify-content-end pr-2">
                                {/* Select shift */}
                                <div className='pr-sm-2 mb-2 mb-sm-0' style={{ width: size.width <= 576 ? "100%" : 200 }}>
                                    <FormGroup className="mb-0">
                                        <select
                                            className="form-control rounded-pill shadow-none"
                                            name="shiftSelect"
                                            onChange={(event) => { handleShiftFilter(event.target.value) }}
                                        >
                                            <option value="default">Select Shift</option>
                                            {shifts && shifts.map((item, i) =>
                                                <option
                                                    key={i}
                                                    value={item.uid}
                                                >{item.title}</option>
                                            )}
                                        </select>
                                    </FormGroup>
                                </div>

                                {/* Month */}
                                <div className='mr-2 mb-2 mb-sm-0' style={{ width: size.width <= 576 ? "100%" : 160 }}>
                                    <FormGroup className="mb-0">
                                        <select
                                            className="form-control rounded-pill shadow-none"
                                            name="monthSelect"
                                            onChange={(event) => {
                                                setMonth(event.target.value)
                                                handleMonthYear(event.target.value, year)
                                            }}
                                            defaultValue={new Date().getMonth() + 1}
                                        >
                                            {monthOptions && monthOptions.map((item, i) =>
                                                <option
                                                    key={i}
                                                    value={item.value}
                                                >{item.label}</option>
                                            )}
                                        </select>
                                    </FormGroup>
                                </div>

                                {/* Year */}
                                <div className='mr-2 mb-2 mb-sm-0' style={{ width: size.width <= 576 ? "100%" : 160 }}>
                                    <FormGroup className="mb-0">
                                        <select
                                            className="form-control rounded-pill shadow-none"
                                            name="yearSelect"
                                            onChange={(event) => {
                                                setYear(event.target.value)
                                                handleMonthYear(month, event.target.value)
                                            }}
                                            defaultValue={(new Date().getFullYear()).toString()}
                                        >
                                            {yearOptions && yearOptions.map((item, i) =>
                                                <option
                                                    key={i}
                                                    value={item.value}
                                                >{item.label}</option>
                                            )}
                                        </select>
                                    </FormGroup>
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
                                placeholder={"Search Employee"}
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
            <PrimaryModal
                title={t('Create Payment Salary')}
                show={isPayNow.show}
                size="md"
                onHide={() => setIsPayNow({ show: false, loading: false })}
            >
                <SalaryPayForm
                    loading={payNowLoading.loading}
                    submit={handleSalaryPayCreate}
                    payNow={payNow}
                />
            </PrimaryModal>
        </div>
    );
}

export default EmployeeSalary;
