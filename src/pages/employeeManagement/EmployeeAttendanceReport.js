import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { Eye } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { NoContent } from '../../components/204/NoContent'
import { Loader } from '../../components/loading/Index'
import { SuccessButton } from '../../components/button/Index'
import { FormGroup } from '../../components/formGroup/FormGroup'

const EmployeeAttendanceReport = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [searchLoading, setSearchLoading] = useState(false)
    const [shifts, setShifts] = useState([])


    // fetch shift data
    const fetchShifts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response && response.status === 200) setShifts(response.data.data)
            setLoading(false)
            setServerError(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
            setServerError(true)
        }
    }, [])

    // fetch employee data
    const fetchEmployee = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
            if (response && response.data && response.data.data) {
                setData(response.data.data)
                setTotalRows(response.data.total)
                setServerError(false)
            }
            setLoading(false)
        } catch (error) {
            if (error && error.response && error.response.status) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

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
                serverError(true)
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

    // filter by shift
    const handleShiftFilter = async (data) => {
        if (data !== "default") {
            try {
                const response = await Requests.EmployeeAll.Attendance.EmployeeFilterByShift(data)
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

    // data columns
    const columns = [
        {
            name: `${t('Name')}`,
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Phone')}`,
            selector: row => row.phone || "N/A",
            sortable: true,
        },
        {
            name: `${t('Shift')}`,
            selector: row => row.shift && row.shift.title ? row.shift.title : "N/A",
            sortable: true,
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "80px",
            cell: row =>
                <div>
                    <Link to={`/dashboard/employee-management/attendance-report-view/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        // onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / employee attendance report")}
                message={t("Employee's Attendance Report Information.")}
                container="container-fluid"
            />

            <Main>
                {loading && !data.length ? <Loader /> : null}
                {!loading && serverError && !data.length ? <NetworkError message="Network Error!!!" /> :
                    !loading && !data.length ? <NoContent message="Employee attendance report list not available!!!" /> :

                        <div className='w-100'>
                            {/* Select shift */}
                            <Container.Column className="pr-4">
                                <FormGroup className="mb-0 pr-1">
                                    <select
                                        className="form-control form-control-sm shadow-none rounded-pill ml-auto"
                                        name="shiftSelect"
                                        style={{ width: 200 }}
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
                }
            </Main>
        </div>
    );
}

export default EmployeeAttendanceReport;
