import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { Toastify } from '../../components/toastify/Toastify'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { DatePicker } from '../../components/datePicker/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { NoContent } from '../../components/204/NoContent'
import { useWindowSize } from '../../components/window/windowSize'
import { dateYearFormat } from '../../utils/_heplers'
import { Loader } from '../../components/loading/Index'

const EmployeeOvertime = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const size = useWindowSize()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [searchLoading, setSearchLoading] = useState(false)
    const [shifts, setShifts] = useState([])
    const [date, setDate] = useState(new Date());
    const [overTimeArray, setOverTimeArray] = useState([])
    const [overTimeLoading, setOverTimeLoading] = useState(false)


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
            const response = await Requests.EmployeeAll.Overtime.OvertimeIndex(dateYearFormat(date), page, perPage)
            if (response && response.data && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.total)

                // Set All Over Time
                if (response.data.data && response.data.data.length) {
                    const items = []

                    for (let i = 0; i < response.data.data.length; i++) {
                        const element = response.data.data[i]
                        items.push({
                            employee: element.employee_uid,
                            overtime_hours: element.overtime,
                        })
                    }
                    setOverTimeArray(items)
                }
                setLoading(false)
            }

        } catch (error) {
            if (error && error.response && error.response.status === 500) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [date, perPage])


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
            const response = await Requests.EmployeeAll.Overtime.OvertimeSearch(dateYearFormat(date), data)
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
        const response = await Requests.EmployeeAll.Overtime.OvertimeSearch(dateYearFormat(date), value)

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

    // handle Over Time Hours
    const handleOvertime = async (uid, data) => {
        const items = [...overTimeArray]
        const foundIndex = items.findIndex(x => x.employee === uid)

        if (data !== 0) {
            items[foundIndex] = { ...items[foundIndex], overtime_hours: data }
        }
        setOverTimeArray(items)
    }


    // handle submit Overtime
    const onSubmitOvertime = async () => {
        setOverTimeLoading(true)
        if (!overTimeArray.length) {
            Toastify.Error("Give Overtime data first!!!")
            return
        }

        const overTimeData = [];
        for (let i = 0; i < overTimeArray.length; i++) {
            const element = overTimeArray[i]
            if (element && element.overtime_hours && element.overtime_hours !== "0") {
                if (element.overtime_hours > 24 || element.overtime_hours < 0) {
                    Toastify.Error("Overtime hours should be more then 0 and less then 24")
                    setOverTimeLoading(false)
                    return
                } else {

                    overTimeData.push({
                        employee: element.employee,
                        overtime_hours: parseInt(element.overtime_hours)
                    })
                }
            }
        }

        try {
            const formData = {
                overtime_date: dateYearFormat(date),
                dokan_uid: localStorage.getItem("dokanuid"),
                overtimes: overTimeData
            }

            const response = await Requests.EmployeeAll.Overtime.OvertimeCreate(formData)
            if (response && response.status === 201) {
                fetchEmployee(1)
                Toastify.Success(response.data.message)
            }
            setOverTimeLoading(false)
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 500) {
                Toastify.Error('Network error.')
            } else {
                Toastify.Error('No Employee Overtime added')
            }
            setOverTimeLoading(false)
        }
    }

    // filter by shift
    const handleShiftFilter = async (data) => {
        if (data !== "default") {
            try {
                const response = await Requests.EmployeeAll.Overtime.EmployeeOvertimeFilterShift(dateYearFormat(date), data)
                if (response && response.status && response.status === 200) {
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
            name: `${t('Shift')}`,
            selector: row => row.shift_name || "N/A",
            sortable: true
        },
        {
            name: `${t('Overtime (hours)')}`,
            grow: 0,
            minWidth: "200px",
            cell: row =>
                <div className="col-12 p-0">
                    <input
                        type="number"
                        min="0"
                        max="24"
                        className="form-control shadow-none"
                        placeholder={t("Over Time Rate")}
                        defaultValue={row.overtime ?? 0}
                        onChange={(event) => { handleOvertime(row.employee_uid, event.target.value) }}
                    />
                </div>,
        },
    ]


    return (
        <div>
            <Layout
                page={t("dashboard / employee management / employee over time")}
                message={t("Employee's Over Time Information.")}
                container="container-fluid"
            />

            <Main>
                {loading && !serverError && !data.length ? <Loader /> : null}
                {!loading && !serverError && !data.length ? <NoContent message="Employee overtime list not available!!!" /> : null}
                {!loading && serverError && !data.length ? <NetworkError message="Network Error!!!" /> : null}

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
                                {/* Datepicker */}
                                <div className='mr-3' style={{ width: size.width <= 576 ? "100%" : 160 }}>
                                    <FormGroup className="mb-0">
                                        <DatePicker
                                            className="rounded-pill"
                                            selected={data => { setDate(data) }}
                                            deafultValue={date}
                                        />
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

                        {/* Submit button */}
                        <Container.Column>
                            {data && data.length ?
                                <div className="text-right">
                                    <PrimaryButton
                                        type="submit"
                                        className="px-4"
                                        disabled={overTimeLoading}
                                        onClick={onSubmitOvertime}
                                    >{overTimeLoading ? t("Submitting ...") : t("Submit")}
                                    </PrimaryButton>
                                </div>
                                : null
                            }
                        </Container.Column>
                    </div>
                    : null
                }
            </Main>
        </div>
    );
}

export default EmployeeOvertime;
