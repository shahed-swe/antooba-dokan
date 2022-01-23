import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { FormGroup } from '../../../components/formGroup/FormGroup'
import { DatePicker } from '../../../components/datePicker/Index'
import { Container } from '../../../components/container/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { GrayButton } from '../../../components/button/Index'
import { Loader } from '../../../components/loading/Index'
import { dateYearFormat } from '../../../utils/_heplers'
import { Card } from '../../../components/card/Index'
import { Text } from '../../../components/text/Text'
import { Requests } from '../../../utils/Http/Index'

const Show = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState(null)
    const [data, setData] = useState([])
    const [serverError, setServerError] = useState(false)
    const [toDate, setToDate] = useState(null)
    const prdouctDummyData = [
        {
            id: 1,
            date: "12 june, 2021",
            product: [
                {
                    id: 1,
                    product_name: "Tomato",
                    debit: 5000,
                    credit: 6000
                },
                {
                    id: 2,
                    product_name: "Potato",
                    debit: 3500,
                    credit: 7000
                },
                {
                    id: 3,
                    product_name: "Rice",
                    debit: 2000,
                    credit: 4500
                }
            ],
            total_debit: 10000,
            total_credit: 20000,
            note: "this is first date's products"
        },
        {
            id: 2,
            date: "15 june, 2021",
            product: [
                {
                    id: 1,
                    product_name: "Tomato2",
                    debit: 8700,
                    credit: 9400
                },
                {
                    id: 2,
                    product_name: "Potato2",
                    debit: 9540,
                    credit: 1120
                },
                {
                    id: 3,
                    product_name: "Rice2",
                    debit: 3640,
                    credit: 2250
                }
            ],
            total_debit: 50000,
            total_credit: 600050,
            note: "this is second date's products"
        },
        {
            id: 3,
            date: "22 june, 2021",
            product: [
                {
                    id: 1,
                    product_name: "product1",
                    debit: 12500,
                    credit: 45420
                },
                {
                    id: 4,
                    product_name: "productFocus",
                    debit: 25000,
                    credit: 35000
                },
                {
                    id: 2,
                    product_name: "product2",
                    debit: 1542,
                    credit: 6855
                },
                {
                    id: 3,
                    product_name: "product3",
                    debit: 5840,
                    credit: 6580
                }
            ],
            total_debit: 100000,
            total_credit: 250000,
            note: "this is third date's products"
        },
        {
            id: 4,
            date: "07 August, 2021",
            product: [
                {
                    id: 1,
                    product_name: "test1",
                    debit: 7800,
                    credit: 12560
                },
                {
                    id: 2,
                    product_name: "test2",
                    debit: 35490,
                    credit: 5890
                },
                {
                    id: 3,
                    product_name: "test3",
                    debit: 45890,
                    credit: 36000
                }
            ],
            total_debit: 98720,
            total_credit: 78910,
            note: "this is fourth date's products"
        }
    ]

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    // filter by start date
    const handleStartDateFilter = async (data) => {
        if (toDate !== null) {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(data), dateYearFormat(toDate))
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            // fetchDailyPayableData(1)
        }
    }

    // filter by end date
    const handleEndDateFilter = async (data) => {
        if (date !== null) {
            try {
                const response = await Requests.EmployeeAll.Attendance.AttendanceListFilterByShift(dateYearFormat(date), dateYearFormat(data))
                if (response && response.status && response.status === 200) {
                    setData(response.data.data)
                }
            } catch (error) {
                if (error) {
                    setServerError(true)
                }
            }
        } else {
            // fetchDailyPayableData(1)
        }
    }

    if (loading) return <Loader />

    const customStyles = {
        background: {
            backgroundColor: "#e9ecef"
        },
        cursor: {
            cursor: "pointer"
        },
        text_color: {
            color: "#063cdd"
        }
    }

    return (
        <div>
            <Layout
                page={t("dashboard / accountng / ledger view")}
                message={t("Ledger information.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/accounting/ledger">
                            <GrayButton type="button">
                                <ChevronLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>

                {/* Item cards */}
                <Container.Column>
                    <Container.Row className="px-3 mb-3">

                         <Container.Column className="col-sm-6 col-xl-3">
                            <Card.Simple className="sms-item-card">
                                <Text className="fs-30 font-weight-bolder mb-0">{data && data.total_debit ? data.total_debit : 0} TK</Text>
                                <Text className="fs-14 mb-0"> TOTAL DEBIT </Text>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-xl-3">
                            <Card.Simple className="sms-item-card">
                                <Text className="fs-30 font-weight-bolder mb-0"> {data && data.total_credit ? data.total_credit : 0} TK</Text>
                                <Text className="fs-14 mb-0"> TOTAL CREDIT </Text>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-xl-3">
                            <Card.Simple className="sms-item-card">
                                <Text className="fs-30 font-weight-bolder mb-0"> {data && data.account_payable ? data.account_payable : 0} TK</Text>
                                <Text className="fs-14 mb-0"> ACCOUNT PAYABLE </Text>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-xl-3">
                            <Card.Simple className="sms-item-card">
                                <Text className="fs-30 font-weight-bolder mb-0"> {data && data.account_receivable ? data.account_receivable : 0} TK</Text>
                                <Text className="fs-14 mb-0"> ACCOUNT RECEIVABLE </Text>
                            </Card.Simple>
                        </Container.Column>

                        {/* <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_debit ? data.total_debit : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> TOTAL DEBIT</Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_credit ? data.total_credit : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> TOTAL CREDIT </Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.account_payable ? data.account_payable : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> ACCOUNT PAYABLE </Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.account_receivable ? data.account_receivable : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> ACCOUNT RECEIVABLE</Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column> */}

                    </Container.Row>
                </Container.Column>

                {/* Date picker start to end*/}
                <Container.Column className="mb-5">
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
                    <Container.Row>
                        <Container.Column>

                            {prdouctDummyData ? prdouctDummyData.map((data, i) =>
                                <Card.Simple className="mb-3" key={i}>

                                    {/* Date */}
                                    <Card.Header>
                                        <Text className="fs-14 mb-0">{data.date || "No date available"}</Text>
                                    </Card.Header>

                                    {/* All items */}
                                    <Card.Body className="p-0">
                                        <div className='table-responsive'>
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th className='fs-15 font-weight-normal pl-4' scope="col" width="15%">SN</th>
                                                        <th className='fs-15 font-weight-normal' scope="col" width="35%">Product Name</th>
                                                        <th className='fs-15 font-weight-normal' scope="col" width="25%">Debit</th>
                                                        <th className='fs-15 font-weight-normal' scope="col" width="25%">Credit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data && data.product ? data.product.map((item, i) =>
                                                        <tr key={i}>
                                                            <th className='fs-15 font-weight-normal pl-4' scope="row">{i + 1}</th>
                                                            <td className='fs-15 font-weight-normal'>{item.product_name || "N/A"}</td>
                                                            <td className='fs-15 font-weight-normal'>{item.debit || 0}</td>
                                                            <td className='fs-15 font-weight-normal'>{item.credit || 0}</td>
                                                        </tr>
                                                    ) : null}

                                                    <tr>
                                                        {/* <th scope="row">3</th> */}
                                                        <td className='fs-15 font-weight-bold pl-4' colSpan={2}>Total</td>
                                                        <td className='fs-15 font-weight-bold'>{data.total_debit || 0}</td>
                                                        <td className='fs-15 font-weight-bold'>{data.total_credit || 0}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card.Body>

                                    {/* Note */}
                                    <Card.Footer>
                                        <Text className="fs-14 mb-0">Note: {data.note || "N/A"}</Text>
                                    </Card.Footer>

                                </Card.Simple>
                            ) : null}

                        </Container.Column>
                    </Container.Row>
                </Container.Column>

            </Main>
        </div>
    );
}

export default Show;