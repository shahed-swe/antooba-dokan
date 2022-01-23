import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "react-feather"
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from "react-router-dom"
import { Toastify } from "../../components/toastify/Toastify"
import { Container } from "../../components/container/Index"
import { Layout } from "../../components/layout/Index"
import { Main } from "../../components/layout/Index"
import { GrayButton, SuccessButton } from "../../components/button/Index"
import { EmployeeForm } from "../../components/form/EmployeeForm"
import { Loader } from "../../components/loading/Index"
import { NetworkError } from "../../components/501/NetworkError"
import { NoContent } from "../../components/204/NoContent"
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { EmployeeShift } from '../../components/form/EmployeeShift'
import { Requests } from "../../utils/Http/Index"

const EmployeeCreate = () => {
    const history = useHistory();
    const { t } = useTranslation()
    const [creating, setCreate] = useState(false);
    const [shifts, setShifts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [shift, setShift] = useState({ show: false, loading: true })

    // fetch shift data
    const fetchShifts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response && response.status === 200) setShifts(response.data.data)
            setLoading(false)
            setError(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setError(true)
            }
        }
    }, [])

    useEffect(() => {
        fetchShifts()
    }, [fetchShifts])

    // handle employee create
    const handleEmployeeCreate = async (data) => {
        setCreate(true);
        try {
            const response = await Requests.EmployeeAll.Employee.EmployeeAdd(data);
            if (response && response.status === 201) {
                setCreate(false);
                Toastify.Success("Employee Created Successfully");
            }
            history.push("/dashboard/employee-management/list");
        } catch (error) {
            if (error) {
                setCreate(false);
                Toastify.Error(error.message);
            }
        }
    }

    // handle shift create
    const handleEmployeeShiftCreate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setShift({ ...shift, loading: true })

            const response = await Requests.EmployeeAll.Shift.EmployeeShiftCreate(newdata)
            if (response && response.status === 201) {
                fetchShifts()
                Toastify.Success('EmployeShift Added Successfully')
            }
            setShift({ ...shift, loading: false, show: false })
        } catch (error) {
            if (error) {
                setShift({ ...shift, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    return (
        <>
            <Layout
                page={t("dashboard / employee management / employee create")}
                message={t("Create  Employee in your shop.")}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/employee-management/list">
                            <GrayButton type="button">
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && shifts.length < 0 ? <Loader /> : null}
                {!loading && error ? <NetworkError message="Network Error." /> : null}
                {!loading && !error && !shifts.length ?
                    <div className="text-center w-100">
                        <NoContent message="Shifts not available." />
                        <SuccessButton
                            className="px-4 py-2"
                            onClick={() => setShift({ show: true, loading: false })}
                        >Create Shift</SuccessButton>
                    </div>
                    : null
                }

                {!loading && !error && shifts.length ?
                    <Container.Fluid>
                        <EmployeeForm
                            loading={creating}
                            submit={handleEmployeeCreate}
                            create={true}
                            shifts={shifts}
                        />
                    </Container.Fluid>
                    : null
                }

                {/* Create Shift modal */}
                <PrimaryModal
                    title={t('Create Employee Shift')}
                    show={shift.show}
                    size="md"
                    onHide={() => setShift({ show: false, loading: false })}
                >
                    <EmployeeShift
                        isCreate={true}
                        show={shift.show}
                        loading={shift.loading}
                        submit={handleEmployeeShiftCreate}
                        handleAction={() => fetchShifts()}
                        onHide={() => setShift({ show: false, loading: false })}
                    />
                </PrimaryModal>
            </Main>
        </>
    );
};

export default EmployeeCreate;
