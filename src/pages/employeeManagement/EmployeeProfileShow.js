import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../components/layout/Index'
import { Tabs, Tab } from "react-bootstrap";
// import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { ShortName } from '../../components/shortName/Index'
import { Text } from '../../components/text/Text'
import { Card } from '../../components/card/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { GrayButton } from '../../components/button/Index';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { Loader } from '../../components/loading/Index';
import { ImageCircle } from '../../components/image/Index';
// import { Toastify } from '../../components/toastify/Toastify'

const EmployeeProfileShow = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [data, setData] = useState([])
    const [singleData, setSingleData] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const { id } = useParams()

    // fetch Single Employee data
    const fetchSingleEmployeeShow = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeShow(id)
            if (response && response.status === 200) setSingleData(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [id])
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
        fetchSingleEmployeeShow()
    }, [fetchSingleEmployeeShow])

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

    // Salary History columns
    const salaryColumns = [
        {
            name: `${t('Date')}`,
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Amount')}`,
            selector: row => row.monthly_salary || "N/A",
            sortable: true,
        },
        {
            name: `${t('Amount Type')}`,
            selector: row => row.shift && row.shift.title ? row.shift.title : "N/A",
            sortable: true,
        },
    ]

    // Advance and Bonus History columns
    const advanceColumns = [
        {
            name: `${t('Date')}`,
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: `${t('Amount')}`,
            selector: row => row.monthly_salary || "N/A",
            sortable: true,
        },
        {
            name: `${t('Amount Type')}`,
            selector: row => row.shift && row.shift.title ? row.shift.title : "N/A",
            sortable: true,
        },
    ]

    // Notice columns
    const noticeColumns = [
        {
            name: `${t('Date')}`,
            selector: row => row.name || "N/A",
            maxWidth: '200px',
            sortable: true
        },
        {
            name: `${t('Notice Description')}`,
            selector: row => row.monthly_salary || "N/A",
            sortable: true,
        },
    ]

    // styles
    const styles = {
        td: {
            width: 70,
        },
    };
    return (
        <div>
            <Layout
                page={t("dashboard / employee management / employee view")}
                message={t("Employee's Information In Details.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/employee-management/list">
                            <GrayButton
                                type="button"
                                style={{ padding: "6px 9px", marginRight: 5 }}
                            >
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>

                {!loading && serverError ? <NetworkError message="Network Error!!!" /> : null}
                {loading && !serverError ? <Loader /> : null}
                {!loading && !serverError ?
                    <div className='w-100'>

                        <Container.Column>
                            <div className='d-lg-flex'>

                                {/* Employee image or short name */}
                                {singleData && singleData.image ?
                                    <div>
                                        <ImageCircle
                                            src={singleData.image}
                                            alt=""
                                            x={75}
                                            y={75}
                                        />
                                    </div>
                                    :
                                    <div>
                                        <ShortName
                                            name={singleData && singleData.name ? singleData.name : "Dokan"}
                                            x={75}
                                            y={75}
                                            size={37}
                                        />
                                    </div>
                                }

                                <div className="ml-lg-4 mt-4 mt-lg-0">
                                    <Text className="fs-16 font-weight-bolder mb-0">
                                        {singleData && singleData.name ? singleData.name : "No Name"} ({singleData && singleData.shift && singleData.shift.title ? singleData.shift.title : "No Shift"})
                                    </Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Join Date
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="fs-13 mb-0">
                                                        : {singleData && singleData.join_date ? singleData.join_date : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Phone
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.phone ? singleData.phone : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="ml-lg-4 mt-lg-4">
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Email
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.email ? singleData.email : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Address
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : {singleData && singleData.street_address ? singleData.street_address : "N/A"}
                                                    </Text>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='d-flex flex-wrap text-center py-3'>
                                <Card.Simple className="px-md-4 mr-1 mr-sm-2 mb-1 flex-fill flex-sm-grow-0">
                                    <Card.Body>
                                        <Text className="fs-16 font-weight-bold mb-0"> {singleData && singleData.monthly_salary ? singleData.monthly_salary : "0"} Tk</Text>
                                        <Text className="fs-16 mb-0"> Monthly Salary</Text>
                                    </Card.Body>
                                </Card.Simple>
                                <Card.Simple className="px-md-4 mr-1 mr-sm-2 mb-1 flex-fill flex-sm-grow-0">
                                    <Card.Body>
                                        <Text className="fs-16 font-weight-bold mb-0"> {singleData && singleData.advance_taken ? singleData.advance_taken : "0"} Tk</Text>
                                        <Text className="fs-16 mb-0"> Advance Taken</Text>
                                    </Card.Body>
                                </Card.Simple>
                                <Card.Simple className="px-md-4 mr-1 mr-sm-2 mb-1 flex-fill flex-sm-grow-0">
                                    <Card.Body>
                                        <Text className="fs-16 font-weight-bold mb-0"> {singleData && singleData.overtime_rate ? singleData.overtime_rate : "0"} Tk</Text>
                                        <Text className="fs-16 mb-0"> Overtime Rate</Text>
                                    </Card.Body>
                                </Card.Simple>
                            </div>

                        </Container.Column>

                        {/* Selected Portion */}
                        <Container.Column>
                            {/* History tabs */}
                            <div>
                                <Tabs
                                    defaultActiveKey="salary"
                                    id="uncontrolled-tab"
                                    className="mb-3"
                                >
                                    <Tab eventKey="salary" title="Salary History">
                                        <DataTable
                                            columns={salaryColumns}
                                            data={data}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                    <Tab eventKey="advance" title="Advance & Bonus History">
                                        <DataTable
                                            columns={advanceColumns}
                                            data={data}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                    <Tab eventKey="notice" title="Notice">
                                        <DataTable
                                            columns={noticeColumns}
                                            data={data}
                                            loading={loading}
                                            totalRows={totalRows}
                                            handlePerRowsChange={handlePerRowsChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Tab>
                                </Tabs>
                            </div>

                        </Container.Column>
                    </div>
                    : null
                }
            </Main>
        </div>
    );
}

export default EmployeeProfileShow;


