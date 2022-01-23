import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import InfiniteCarousel from 'react-leaf-carousel'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DollarSign, Edit2, Eye, Plus, Trash2, Printer, } from 'react-feather'
import { DangerButton, GrayButton, SuccessButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { Text } from '../../components/text/Text'
import { ShiftCard } from '../../components/shiftCard/ShiftCard'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { DeleteModal } from '../../components/modal/DeleteModal'
import { Loader } from '../../components/loading/Index'
import { EmployeeShift } from '../../components/form/EmployeeShift'
import { Toastify } from '../../components/toastify/Toastify'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'

const EmployeeList = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [serverError, setServerError] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [isCreateEmployeeShift, setCreateEmployeeShift] = useState({ show: false, loading: false })
    const [isUpdateEmployeeshift, setUpdateEmployeeshift] = useState({ show: false, loading: false, value: null })
    const [shifts, setShifts] = useState([])
    const [uid, setUid] = useState(null)
    const [shiftDelete, setShiftDelete] = useState({ show: false, loading: false, value: null })
    const [employeeDelete, setEmployeeDelete] = useState({ show: false, loading: false, value: null })

    // fetch shift data
    const fetchShifts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response && response.status === 200)
                setShifts(response.data.data)
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


    useEffect(() => {
        fetchShifts()
    }, [fetchShifts])

    useEffect(() => {
        fetchEmployee(1)
    }, [fetchEmployee])

    // hange paginate page change
    const handlePageChange = page => fetchEmployee(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.EmployeeAll.Employee.EmployeeList(page, newPerPage)

        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    //Handle Employee Shift Create
    const handleEmployeeShiftCreate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setCreateEmployeeShift({ ...isCreateEmployeeShift, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftCreate(newdata)
            if (response && response.status === 201) {
                fetchShifts()
                Toastify.Success('EmployeShift Added Successfully')
            }
            setCreateEmployeeShift({ ...isCreateEmployeeShift, loading: false, show: false })
        } catch (error) {
            if (error) {
                setCreateEmployeeShift({ ...isCreateEmployeeShift, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    //Handle Employee Shift Update
    const handleEmployeeShiftUpdate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setUpdateEmployeeshift({ ...isUpdateEmployeeshift, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftUpdate(newdata, uid)

            if (response && response.status === 200) {
                Toastify.Success('EmployeShift Updated Successfully')
                setUpdateEmployeeshift({ ...isUpdateEmployeeshift, loading: false, show: false })
                fetchShifts()
            }
        } catch (error) {
            if (error) {
                Toastify.Error('Network error.')
            }
        }
    }

    // Handle action
    const handleAction = (data) => { if (data) fetchShifts() }

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

    // Handle shift delete
    const handleShiftDelete = async () => {
        try {
            setShiftDelete({ ...shiftDelete, loading: true })
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftDelete(shiftDelete.value.uid)
            if (response && response.status === 200) {
                fetchShifts()
                Toastify.Success('EmployeShift Deleted Successfully')
            }
            setShiftDelete({ ...shiftDelete, loading: false, show: false })
        } catch (error) {
            if (error) {
                setShiftDelete({ ...shiftDelete, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    // handle Employee Delete
    const handleEmployeeDelete = async () => {
        setEmployeeDelete({ ...employeeDelete, loading: true })
        const response = await Requests.EmployeeAll.Employee.EmployeeDelete(employeeDelete.value.uid)
        if (response && response.status === 200) {
            fetchEmployee()
            Toastify.Success('Employee Deleted Successfully')
            setEmployeeDelete({ ...employeeDelete, show: false, loading: false })
        } else {
            Toastify.Error('Something Went Wrong')
            setEmployeeDelete({ ...employeeDelete, show: false, loading: false })
        }
    }

    // data columns
    const columns = [
        {
            name: `${t('Name')}`,
            sortable: true,
            selector: row => row.name || "N/A"
        },
        {
            name: `${t('Phone')}`,
            sortable: true,
            selector: row => row.phone || "N/A"
        },
        {
            name: `${t('Age')}`,
            sortable: true,
            selector: row => row.age || "N/A"
        },
        {
            name: `${t('Shift')}`,
            sortable: true,
            selector: row => row.shift && row.shift.title ? row.shift.title : "N/A"
        },
        {
            name: `${t('Monthly Salary')}`,
            sortable: true,
            selector: row => row.monthly_salary || "0"
        },
        {
            name: `${t('Advance Taken')}`,
            sortable: true,
            selector: row => row.advance_taken || "0"
        },
        {
            name: `${t('Overtime Rate')}`,
            sortable: true,
            selector: row => row.overtime_rate || "0"
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "220px",
            cell: row =>
                <div>
                    <GrayButton
                        type="button"
                        className="circle-btn mr-1"
                        onClick={() => handleAction(row)}
                    ><DollarSign size={16} />
                    </GrayButton>

                    <Link to={`/dashboard/employee-management/profile-show/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            className="circle-btn mr-1"
                            onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>

                    <Link to={`/dashboard/employee-management/edit/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            className="circle-btn mr-1"
                        >
                            <Edit2 size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        type="button"
                        className="circle-btn"
                        onClick={() => setEmployeeDelete({ ...employeeDelete, value: row, show: true })}
                    ><Trash2 size={16} />
                    </DangerButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / list")}
                message={t("Employee and Shift Information.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/employee-management/create" >
                            <GrayButton className="mr-0 mr-sm-2">
                                <Plus size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>
                                    {t("ADD EMPLOYEE")}
                                </span>
                            </GrayButton>
                        </Link>

                        <GrayButton
                            type="button"
                            className="mt-2 mt-sm-0"
                            onClick={() => console.log("Will print")}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />
            <Main>
                <Container.Column>
                    {loading && !shifts.length ? <Loader /> : null}
                    {!loading && serverError && !data.length && !shifts.length ? <NetworkError message="Network Error!!!" /> : null}
                    {!loading && !serverError && !shifts.length && !data.length ?
                        <div className="text-center w-100">
                            <NoContent message="Shifts and employee not available!!!" />
                            <SuccessButton
                                className="px-4 py-2"
                                onClick={() => setCreateEmployeeShift({ ...isCreateEmployeeShift, show: true })}
                            >Create Shift</SuccessButton>
                        </div>
                        : null
                    }
                </Container.Column>

                {/* Shift create button */}
                {!loading && (shifts.length || data.length) ?
                    <Container.Column className='mb-3'>
                        <Text className="fs-15 mb-1">Number of shifts : {shifts && shifts.length ? shifts.length : 0}</Text>
                        <GrayButton
                            type="button"
                            className="px-4 py-2"
                            onClick={() => setCreateEmployeeShift({ ...isCreateEmployeeShift, show: true })}
                        >
                            <Plus size={14} />
                            <span className="fs-13 pl-1">{t('ADD NEW SHIFT')}</span>
                        </GrayButton>
                    </Container.Column>
                    : null
                }


                {/* Shift cards carousel container */}
                {!loading && shifts.length ?
                    <Container.Column>
                        {shifts && shifts.length ?
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
                                {shifts && shifts.map((item, i) =>
                                    <ShiftCard
                                        key={i}
                                        data={item}
                                        updateEmployeeShift={() => { setUid(item.uid); setUpdateEmployeeshift({ ...isUpdateEmployeeshift, value: item, show: true }) }}
                                        shiftDelete={() => setShiftDelete({ value: item, show: true })}
                                    />
                                )}
                            </InfiniteCarousel>
                            : null
                        }

                    </Container.Column>
                    : null
                }

                {/* Data table */}
                {data.length && !serverError ?
                    <Container.Column className="mt-4">
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            totalRows={totalRows}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}
                            searchable

                            noDataMessage={t('No Employee Available')}
                            placeholder={"Search Employee"}
                            search={handleSearch}
                            suggestion={handleSuggestion}
                            searchLoading={searchLoading}
                            clearSearch={() => fetchEmployee(1)}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Create Shift modal */}
            <PrimaryModal
                title={t('Create Employee Shift')}
                show={isCreateEmployeeShift.show}
                size="md"
                onHide={() => setCreateEmployeeShift({ show: false, loading: false })}
            >
                <EmployeeShift
                    isCreate={true}
                    show={isCreateEmployeeShift.show}
                    loading={isCreateEmployeeShift.loading}
                    submit={handleEmployeeShiftCreate}
                    handleAction={() => fetchShifts()}
                    onHide={() => setCreateEmployeeShift({ show: false, loading: false })}
                />
            </PrimaryModal>

            {/* Update shift modal */}
            {isUpdateEmployeeshift.value && isUpdateEmployeeshift.show ?
                <PrimaryModal
                    title={t('Update Employee Shift')}
                    show={isUpdateEmployeeshift.show}
                    size="md"
                    onHide={() => setUpdateEmployeeshift({ show: false, loading: false })}
                >
                    <EmployeeShift
                        show={isUpdateEmployeeshift.show}
                        loading={isUpdateEmployeeshift.loading}
                        shift={isUpdateEmployeeshift.value}
                        submit={handleEmployeeShiftUpdate}
                        handleAction={() => fetchShifts()}
                        onHide={() => setUpdateEmployeeshift({ show: false, loading: false })}
                    />
                </PrimaryModal>
                : null
            }

            {/* Delete employee shift confirmation modal */}
            <DeleteModal
                show={shiftDelete.show}
                loading={shiftDelete.loading}
                message={<Text className="fs-15">{t("Want to delete")} {shiftDelete.value ? shiftDelete.value.email : null} ?</Text>}
                onHide={() => setShiftDelete({ value: null, show: false, loading: false })}
                doDelete={handleShiftDelete}
            />

            {/* Delete Employee confirmation modal */}
            <DeleteModal
                show={employeeDelete.show}
                loading={employeeDelete.loading}
                message={<Text className="fs-15">{t("Want to delete")} {employeeDelete.value ? employeeDelete.value.email : null} ?</Text>}
                onHide={() => setEmployeeDelete({ value: null, show: false, loading: false })}
                doDelete={handleEmployeeDelete}
            />
        </div>
    );
}

export default EmployeeList;
