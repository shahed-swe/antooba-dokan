import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import _ from "lodash"
import { Plus } from 'react-feather'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import InfiniteCarousel from 'react-leaf-carousel'
import { GrayButton, PrimaryButton, SuccessButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Container } from '../../components/container/Index'
import { Text } from '../../components/text/Text'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { DeleteModal } from '../../components/modal/DeleteModal'
import { Toastify } from '../../components/toastify/Toastify'
import { PenaltyCard } from '../../components/penaltyCard/PenaltyCard'
import { PenaltyForm } from '../../components/form/PenaltyForm'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { DatePicker } from '../../components/datePicker/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { Loader } from '../../components/loading/Index'
import { useWindowSize } from '../../components/window/windowSize'
import { dateYearFormat } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'
import { NoContent } from '../../components/204/NoContent'

const EmployeeAttendance = () => {
    const { t } = useTranslation()
    const size = useWindowSize()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [searchLoading, setsearchLoading] = useState(false)
    const [isCreateEmployeePenalty, setCreateEmployeePenalty] = useState({ show: false, loading: false })
    const [isUpdateEmployeePenalty, setUpdateEmployeePenalty] = useState({ show: false, loading: false, value: null })
    const [penalty, setPenalty] = useState([])
    const [shifts, setShifts] = useState([])
    const [uid, setUid] = useState(null)
    const [date, setDate] = useState(new Date());
    const [penaltyDelete, setPenaltyDelete] = useState({ show: false, loading: false, value: null })
    // const [employeeDelete, setEmployeeDelete] = useState({ show: false, loading: false, value: null })
    const [attendance, setAttendance] = useState([])
    const [attendanceLoading, setAttendanceLoading] = useState(false)

    // fetch Penalty data
    const fetchPenalty = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Penalty.PenaltyList()
            if (response && response.status === 200) setPenalty(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [])

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

    // fetch employee attendance data
    const fetchEmployeeAttendance = useCallback(async (page) => {
        // const date = dateYearFormat(date)
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Attendance.AttendanceList(dateYearFormat(date), page, perPage)
            setData(response.data.data)

            // Set All attendance
            if (response.data.data && response.data.data.length) {
                const items = []

                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    items.push({
                        employee: element.employee_uid,
                        attendance_status: element.attendance_status,
                        penalty: element.penalty
                    })
                }
                setAttendance(items)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [date, perPage])

    useEffect(() => {
        fetchPenalty()
    }, [fetchPenalty])

    useEffect(() => {
        fetchShifts()
    }, [fetchShifts])

    useEffect(() => {
        fetchEmployeeAttendance(1)
    }, [fetchEmployeeAttendance])

    // handle paginate page change
    const handlePageChange = page => fetchEmployeeAttendance(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.EmployeeAll.Attendance.AttendanceList(dateYearFormat(date), page, newPerPage)
        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    //Handle Employee Penalty Create
    const handleEmployeePenaltyCreate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setCreateEmployeePenalty({ ...isCreateEmployeePenalty, loading: true })

            const response = await Requests.EmployeeAll.Penalty.PenaltyCreate(newdata)
            if (response && response.status && response.status === 201) {
                fetchPenalty()
                Toastify.Success('EmployeShift Added Successfully')
            }
            setCreateEmployeePenalty({ ...isCreateEmployeePenalty, loading: false, show: false })
        } catch (error) {
            if (error) {
                setCreateEmployeePenalty({ ...isCreateEmployeePenalty, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    //Handle Employee Penalty Update
    const handleEmployeePenaltyUpdate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setUpdateEmployeePenalty({ ...isUpdateEmployeePenalty, loading: true })

            const response = await Requests.EmployeeAll.Penalty.PenaltyUpdate(newdata, uid)
            if (response.status === 200) {
                Toastify.Success('EmployeShift Updated Successfully')
                setUpdateEmployeePenalty({ ...isUpdateEmployeePenalty, loading: false, show: false })
                fetchPenalty()
            }
        } catch (error) {
            if (error) {
                Toastify.Error('Network error.')
            }
        }
    }

    // Handle Penalty delete
    const handlePenaltyDelete = async () => {
        try {
            setPenaltyDelete({ ...penaltyDelete, loading: true })
            console.log(penaltyDelete.value.uid);
            const response = await Requests.EmployeeAll.Penalty.PenaltyDelete(penaltyDelete.value.uid)
            console.log(response);

            if (response.status === 200) {
                fetchPenalty()
                Toastify.Success('Employee Penalty Deleted Successfully')
            }

            setPenaltyDelete({ ...penaltyDelete, loading: false, show: false })
        } catch (error) {
            if (error) {
                setPenaltyDelete({ ...penaltyDelete, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setsearchLoading(true)
            const response = await Requests.EmployeeAll.Attendance.AttendanceSearch(dateYearFormat(date), data)
            if (response && response.status===200) setData(response.data.data)
            setsearchLoading(false)
        } catch (error) {
            if(error){
            setsearchLoading(false)
            setServerError(true)
            }
        }
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.EmployeeAll.Attendance.AttendanceSearch(dateYearFormat(date), value)
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

    // handle attendance
    const handleAttendance = async (data, checked) => {
        const items = [...attendance]
        const foundIndex = items.findIndex(x => x.employee === data.employee_uid)

        if (checked) {
            items[foundIndex] = { ...items[foundIndex], attendance_status: "attend" }
        } else {
            items[foundIndex] = { ...items[foundIndex], attendance_status: "absent" }
        }
        setAttendance(items)
    }

    // handle penalty
    const handlePenalty = async (employee_uid, penalty) => {
        if (!attendance.length) return Toastify.Error("Select attendance first.")
        if (attendance && attendance.length) {
            const foundItem = _.find(attendance, { "employee": employee_uid })
            if (!foundItem) return Toastify.Error("Attendance not selected.")
        }
        const items = [...attendance]
        const foundIndex = items.findIndex(x => x.employee === employee_uid)
        items[foundIndex] = { ...items[foundIndex], penalty: penalty }
        setAttendance(items)
    }

    // handle submit attendance
    const onSubmitAttendance = async () => {
        setAttendanceLoading(true)
        try {
            const formData = {
                attendance_date: dateYearFormat(date),
                dokan_uid: localStorage.getItem("dokanuid"),
                attendances: attendance
            }

            const response = await Requests.EmployeeAll.Attendance.AttendanceCreate(formData)
            if (response.status === 201) {
                fetchEmployeeAttendance(1)
                Toastify.Success(response.data.message)
            }
            setAttendanceLoading(false)
        } catch (error) {
            if (error) {
                Toastify.Error('Network error.')
            }
            setAttendanceLoading(false)
        }
    }

    // filter by shift
    const handleShiftFilter = async (shift, page) => {
        if (shift !== "default") {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(date), shift, page, perPage)
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            fetchEmployeeAttendance(1)
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
            name: `${t('Attendance')}`,
            selector: row =>
                <Form.Check
                    type="checkbox"
                    name={`attendanceCheck-${row.employee_uid}`}
                    id={`attendance-${row.employee_uid}`}
                    style={{ fontSize: 14 }}
                    defaultChecked={row.attendance_status === "attend" ? true : false}
                    onClick={event => handleAttendance(row, event.target.checked)}
                />
        },
        {
            name: `${t('Penalty')}`,
            grow: 0,
            minWidth: "200px",
            cell: row =>
                <div className="col-12 p-0">
                    <select
                        className="form-control shadow-none border-0 bg-light fs-13"
                        onChange={event => handlePenalty(row.employee_uid, event.target.value)}
                        defaultValue={row.penalty && row.penalty.uid ? row.penalty.uid : null}
                    >
                        <option value="null">Select Penalty</option>
                        {penalty && penalty.map((item, i) =>
                            <option
                                key={i}
                                value={item.uid}
                            >{item.name}</option>
                        )}
                    </select>
                </div>,
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / attendance")}
                message={t("Employee Attendance and Penalty Information.")}
                container="container-fluid"
            />

            <Main>
                {loading && !serverError && !penalty.length ? <Loader /> : null}
                {loading && !serverError && !data.length ? <Loader /> : null}
                {!loading && !serverError && !data.length && !penalty.length ?
                    <div className="text-center w-100">
                        <NoContent message="Employee penalty and attendance list not available!!!" />
                        <SuccessButton
                            className="px-4 py-2"
                            onClick={() => setCreateEmployeePenalty({ ...isCreateEmployeePenalty, show: true })}
                        >Create Penalty</SuccessButton>
                    </div>
                    : null
                }
                {!loading && serverError && !penalty.length && !data.length ? <NetworkError message="Network Error!!!" /> : null}

                <div className='w-100'>

                    {/* Penalty create button */}
                    {!loading && (penalty.length || data.length) ?
                        <Container.Column className='mb-3'>
                            <GrayButton
                                type="button"
                                className="px-4 py-2"
                                onClick={() => setCreateEmployeePenalty({ ...isCreateEmployeePenalty, show: true })}
                            >
                                <Plus size={14} />
                                <span className="fs-13 pl-1">{t('ADD NEW PENALTY')}</span>
                            </GrayButton>
                        </Container.Column>
                        : null
                    }

                    {/* Penalty cards carousel container */}
                    {!loading && !serverError && penalty.length ?
                        <Container.Column className="mb-3">
                            <InfiniteCarousel
                                breakpoints={[
                                    {
                                        breakpoint: 500,
                                        settings: {
                                            slidesToShow: 1,
                                            slidesToScroll: 1,
                                        },
                                    },
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToShow: 2,
                                            slidesToScroll: 2,
                                        },
                                    },
                                ]}
                                showSides={true}
                                sidesOpacity={0.5}
                                sideSize={0.15}
                                slidesToScroll={4}
                                slidesToShow={4}
                            >
                                {penalty && penalty.map((item, i) =>
                                    <PenaltyCard
                                        key={i}
                                        data={item}
                                        updateEmployeePenalty={() => { setUid(item.uid); setUpdateEmployeePenalty({ ...isUpdateEmployeePenalty, value: item, show: true }) }}
                                        penaltyDelete={() => setPenaltyDelete({ value: item, show: true })}
                                    />
                                )}
                            </InfiniteCarousel>
                        </Container.Column>
                        : null
                    }

                    {/* Form items */}
                    {!loading && !serverError && data.length ?
                        <Container.Column className="pr-4">
                            <div className="d-sm-flex justify-content-end pr-2">

                                {/* Shift options */}
                                <div
                                    className="pr-sm-2 mb-2 mb-sm-0"
                                    style={{ width: size.width <= 576 ? "100%" : 200 }}
                                >
                                    <FormGroup className="mb-0">
                                        <select
                                            className="form-control shadow-none rounded-pill"
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
                                <div style={{ width: size.width <= 576 ? "100%" : 160 }}>
                                    <FormGroup className="mb-0">
                                        <DatePicker
                                            className="rounded-pill"
                                            selected={data => setDate(data)}
                                            deafultValue={date}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </Container.Column>
                        : null
                    }

                    {/* Data table */}
                    {!loading && !serverError && data.length ?
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
                                clearSearch={() => fetchEmployeeAttendance(1)}
                            />
                        </Container.Column>
                        : null
                    }

                    {/* Submit button */}
                    {!loading && !serverError && data.length ?
                        <Container.Column className="text-right">
                            <PrimaryButton
                                type="submit"
                                className="px-4"
                                disabled={attendanceLoading}
                                onClick={onSubmitAttendance}
                            >{attendanceLoading ? t("Submitting ...") : t("Submit")}
                            </PrimaryButton>
                        </Container.Column>
                        : null
                    }
                </div>
            </Main >

            {/* Create Penalty modal */}
            <PrimaryModal
                title={t('Create Employee Penalty')}
                show={isCreateEmployeePenalty.show}
                size="md"
                onHide={() => setCreateEmployeePenalty({ show: false, loading: false })}
            >
                <PenaltyForm
                    isCreate={true}
                    show={isCreateEmployeePenalty.show}
                    loading={isCreateEmployeePenalty.loading}
                    submit={handleEmployeePenaltyCreate}
                    handleAction={() => fetchPenalty()}
                    onHide={() => setCreateEmployeePenalty({ show: false, loading: false })}
                />
            </PrimaryModal>

            {/* Update Penalty modal */}
            <PrimaryModal
                title={t('Update Employee Penalty')}
                show={isUpdateEmployeePenalty.show}
                size="md"
                onHide={() => setUpdateEmployeePenalty({ show: false, loading: false })}
            >
                <PenaltyForm
                    show={isUpdateEmployeePenalty.show}
                    loading={isUpdateEmployeePenalty.loading}
                    penalty={isUpdateEmployeePenalty.value}
                    submit={handleEmployeePenaltyUpdate}
                    handleAction={() => fetchPenalty()}
                    onHide={() => setUpdateEmployeePenalty({ show: false, loading: false })}
                />
            </PrimaryModal>

            {/* Delete Employee Penalty confirmation modal */}
            <DeleteModal
                show={penaltyDelete.show}
                loading={penaltyDelete.loading}
                message={<Text className="fs-15">{t("Want to delete")} {penaltyDelete.value ? penaltyDelete.value.email : null} ?</Text>}
                onHide={() => setPenaltyDelete({ value: null, show: false, loading: false })}
                doDelete={handlePenaltyDelete}
            />
        </div>
    );
}

export default EmployeeAttendance;
