import React, { useState } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { ShortName } from '../../components/shortName/Index'
import { Text } from '../../components/text/Text'
import { Card } from '../../components/card/Index'
import { Calender } from '../../components/calender/Index'
import { GrayButton } from '../../components/button/Index'
import { days } from '../../utils/data'

const EmployeeAttendanceReportView = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
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

    // filter by month and salary
    const handleMonthYear = async (month_param, year_param) => {
        const year = year_param || (new Date().getFullYear()).toString()
        const month = month_param || (new Date().getMonth() + 1).toString()
        console.log(year, month)
    }

    // styles
    const styles = {
        td: {
            width: 50,
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / employee management / employee attendance report / view")}
                message={t("Employee's Attendance Report Information In Details.")}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/employee-management/attendance-report">
                            <GrayButton type="button">
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {!loading && serverError ? <NetworkError message="Network Error!!!" /> : null}
                {!loading && !serverError ?
                    <div>

                        {/* Account information */}
                        <Container.Column className="mb-3">
                            <div className='d-lg-flex'>
                                <div>
                                    <ShortName
                                        name="Antooba"
                                        x={66}
                                        y={66}
                                        size={30}
                                    />
                                </div>

                                <div className="ml-lg-4 mt-4 mt-lg-0">
                                    <Text className="fs-16 font-weight-bold mb-0">Antooba Private Limited</Text>
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Phone
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="fs-13 mb-0">
                                                        : 01950000000
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Age
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : 25
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pl-0' style={styles.td}>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        Shift
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text className="text-capitalized fs-13 mb-0">
                                                        : Day
                                                    </Text>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Container.Column>

                        {/* Item cards */}
                        <Container.Column>
                            <Container.Row className="px-3 mb-3">

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> 16 Days</Text>
                                            <Text className="fs-16 mb-0"> Total Present</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> 16 Days</Text>
                                            <Text className="fs-16 mb-0"> Total Absent</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> 16 Days</Text>
                                            <Text className="fs-16 mb-0"> Total Holiday</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                                <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                                    <Card.Simple>
                                        <Card.Body className="px-0">
                                            <Text className="fs-16 font-weight-bold mb-0"> 16 Days</Text>
                                            <Text className="fs-16 mb-0"> Total Penalty</Text>
                                        </Card.Body>
                                    </Card.Simple>
                                </Container.Column>

                            </Container.Row>
                        </Container.Column>

                        {/* Selected Options */}
                        <Container.Column className="mb-3">
                            <div className="d-sm-flex">

                                {/* Month */}
                                <div className="mb-2 mb-sm-0 mr-sm-2">
                                <FormGroup className="mb-0">
                                        <select
                                            className="form-control shadow-none"
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
                                <div>
                                <FormGroup className="mb-0">
                                        <select
                                            className="form-control shadow-none"
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

                        {/* Option Flag */}
                        <Container.Column>
                            <div className='d-flex flex-wrap mb-3'>
                                <div className='d-flex mr-2'>
                                    <div className='mt-1 circleStyle greenCircle' />
                                    <Text className="fs-14 ml-1 mb-0"> Holiday
                                    </Text>
                                </div>
                                <div className='d-flex mr-2'>
                                    <div className='mt-1 circleStyle blueCircle' />
                                    <Text className="fs-14 ml-1 mb-0"> Present
                                    </Text>
                                </div>
                                <div className='d-flex mr-2'>
                                    <div className='mt-1 circleStyle pinkCircle' />
                                    <Text className="fs-14 ml-1 mb-0"> Present Penalty
                                    </Text>
                                </div>
                                <div className='d-flex mr-2'>
                                    <div className='mt-1 circleStyle redCircle' />
                                    <Text className="fs-14 ml-1 mb-0"> Absent Penalty
                                    </Text>
                                </div>
                            </div>
                        </Container.Column>

                        {/* Attendance badges */}
                        <Container.Column>
                            <div className="d-flex flex-wrap">
                                {days.length && days.map((item, i) =>
                                    <div key={i} className="p-1">
                                        <Calender date={item.date} choose={item.choose} />
                                    </div>
                                )}
                            </div>
                        </Container.Column>
                    </div>
                    : null
                }
            </Main>
        </div>
    );
}

export default EmployeeAttendanceReportView;