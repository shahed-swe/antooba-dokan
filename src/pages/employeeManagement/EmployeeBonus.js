import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { Plus } from 'react-feather'
import { useTranslation } from 'react-i18next'
import InfiniteCarousel from 'react-leaf-carousel'
import { GrayButton, SuccessButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { Text } from '../../components/text/Text'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { DeleteModal } from '../../components/modal/DeleteModal'
import { Toastify } from '../../components/toastify/Toastify'
import { NetworkError } from '../../components/501/NetworkError'
import { Loader } from '../../components/loading/Index'
import { Requests } from '../../utils/Http/Index'
import { NoContent } from '../../components/204/NoContent'
import { EmployeeBonusForm } from '../../components/form/EmployeeBonusForm'
import { BonusCard } from '../../components/bonusCard'
import { BonusForm } from '../../components/form/BonusForm'

const EmployeeBonus = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [isCreateEmployeeBonus, setCreateEmployeeBonus] = useState({ show: false, loading: false })
    const [isUpdateEmployeeBonus, setUpdateEmployeePenalty] = useState({ show: false, loading: false, value: null })
    const [bonus, setBonus] = useState([])
    const [uid, setUid] = useState(null)
    const [penaltyDelete, setPenaltyDelete] = useState({ show: false, loading: false, value: null })
    // const [employeeDelete, setEmployeeDelete] = useState({ show: false, loading: false, value: null })

    const bonusList = [
        {
            uid:1,
            title:"A",
            amount:1000,
            type:"Percentage"
        },
        {
            uid:3,
            title:"B",
            amount:2000,
            type:"Percentage"
        },
        {
            uid:2,
            title:"C",
            amount:3000,
            type:"Tk"
        }
    ]

    // fetch Penalty data
    const fetchBonus = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response.status === 200) setBonus(response.data.data)
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
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page,10)
            if (response && response.status === 200) {
                setData(response.data.data)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [])


    useEffect(() => {
        fetchEmployee(1)
    }, [fetchEmployee])

    useEffect(() => {
        fetchBonus()
    }, [fetchBonus])

    //Handle Employee Bonus Create
    const handleEmployeeBonusCreate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setCreateEmployeeBonus({ ...isCreateEmployeeBonus, loading: true })

            const response = await Requests.EmployeeAll.Penalty.PenaltyCreate(newdata)
            if (response.status === 201) {
                fetchBonus()
                Toastify.Success('EmployeShift Added Successfully')
            }
            setCreateEmployeeBonus({ ...isCreateEmployeeBonus, loading: false, show: false })
        } catch (error) {
            if (error) {
                setCreateEmployeeBonus({ ...isCreateEmployeeBonus, loading: false, show: false })
                Toastify.Error('Network error.')
            }
        }
    }

    //Handle Employee Penalty Update
    const handleEmployeeBonusUpdate = async (data) => {
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }
            setUpdateEmployeePenalty({ ...isUpdateEmployeeBonus, loading: true })

            const response = await Requests.EmployeeAll.Penalty.PenaltyUpdate(newdata, uid)
            if (response.status === 200) {
                Toastify.Success('EmployeShift Updated Successfully')
                setUpdateEmployeePenalty({ ...isUpdateEmployeeBonus, loading: false, show: false })
                fetchBonus()
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
                fetchBonus()
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

    // handle employee bonus crate
    const submitEmployeeBonus = async (data) => {
        try {
            const response = await Requests.EmployeeAll.Employee.EmployeeAdd(data);
            if (response && response.status === 201) {
                Toastify.Success("Employee Created Successfully");
            }
        } catch (error) {
            if (error) {
                Toastify.Error(error.message);
            }
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / bonus")}
                message={t("Employee Bonus Information.")}
                container="container-fluid"
            />

            <Main>
                {loading && !serverError && !bonus.length ? <Loader /> : null}
                {loading && !serverError && !data.length ? <Loader /> : null}
                {!loading && !serverError && !data.length && !bonus.length ?
                    <div className="text-center w-100">
                        <NoContent message="Employee penalty and attendance list not available!!!" />
                        <SuccessButton
                            className="px-4 py-2"
                            onClick={() => setCreateEmployeeBonus({ ...isCreateEmployeeBonus, show: true })}
                        >Create Bonus</SuccessButton>
                    </div>
                    : null
                }
                {!loading && serverError && !bonus.length && !data.length ? <NetworkError message="Network Error!!!" /> : null}

                <div className='w-100'>

                    {/* Penalty create button */}
                    {!loading && (bonus.length || data.length) ?
                        <Container.Column className='mb-3'>
                            <GrayButton
                                type="button"
                                className="px-4 py-2"
                                onClick={() => setCreateEmployeeBonus({ ...isCreateEmployeeBonus, show: true })}
                            >
                                <Plus size={14} />
                                <span className="fs-13 pl-1">{t('Add New Bonus')}</span>
                            </GrayButton>
                        </Container.Column>
                        : null
                    }

                    {/* Penalty cards carousel container */}
                    {!loading && bonus.length ?
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
                                {bonus && bonus.map((item, i) =>
                                    <BonusCard
                                        key={i}
                                        data={item}
                                        updateEmployeePenalty={() => { setUid(item.uid); setUpdateEmployeePenalty({ ...isUpdateEmployeeBonus, value: item, show: true }) }}
                                        penaltyDelete={() => setPenaltyDelete({ value: item, show: true })}
                                    />
                                )}
                            </InfiniteCarousel>
                        </Container.Column>
                        : null
                    }

                    <Container.Column className="mt-5">
                        <BonusForm 
                        bonus={bonusList}
                        employee={data}
                        submit={submitEmployeeBonus}
                        />
                    </Container.Column>

                    {/* Submit button */}
                    {!loading && !serverError && data.length ?
                        <Container.Column className="text-right">

                        </Container.Column>
                        : null
                    }
                </div>
            </Main >

            {/* Create Penalty modal */}
            <PrimaryModal
                title={t('Create Employee Bonus')}
                show={isCreateEmployeeBonus.show}
                size="md"
                onHide={() => setCreateEmployeeBonus({ show: false, loading: false })}
            >
                <EmployeeBonusForm
                    isCreate={true}
                    show={isCreateEmployeeBonus.show}
                    loading={isCreateEmployeeBonus.loading}
                    submit={handleEmployeeBonusCreate}
                    handleAction={() => fetchBonus()}
                    onHide={() => setCreateEmployeeBonus({ show: false, loading: false })}
                />
            </PrimaryModal>

            {/* Update Penalty modal */}
            <PrimaryModal
                title={t('Update Employee Bonus')}
                show={isUpdateEmployeeBonus.show}
                size="md"
                onHide={() => setUpdateEmployeePenalty({ show: false, loading: false })}
            >
                <EmployeeBonusForm
                    show={isUpdateEmployeeBonus.show}
                    loading={isUpdateEmployeeBonus.loading}
                    bonus={isUpdateEmployeeBonus.value}
                    submit={handleEmployeeBonusUpdate}
                    handleAction={() => fetchBonus()}
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

export default EmployeeBonus;
