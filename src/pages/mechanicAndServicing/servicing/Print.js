import React, { useState, useCallback, useEffect } from 'react'
import Barcode from 'react-barcode'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Printer } from 'react-feather'
import { NetworkError } from '../../../components/501/NetworkError'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { GrayButton } from '../../../components/button/Index'
import { NoContent } from '../../../components/204/NoContent'
import { Loader } from '../../../components/loading/Index'
import { Image } from '../../../components/image/Index'
import { Card } from '../../../components/card/Index'
import { Text } from '../../../components/text/Text'
import { Requests } from '../../../utils/Http/Index'
import { Images } from '../../../utils/Images'

const Print = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const dokanName = localStorage.getItem("dokanname")

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Servicing.Show(id)
            if (response.status === 200) {
                setData(response.data.data)
                console.log(response.data.data);
            }

            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

    const TdWidth = {
        width: 150
    }

    return (
        <div>
            <Layout
                page="mechanic & servicing / servicing print"
                message="Servicing record of your shop for printing invoice."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/servicing">
                            <GrayButton className="mr-0 mr-sm-2" type="button">
                                <ChevronLeft size={15} className="mr-2" />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>

                        <GrayButton
                            type="button"
                            className="mt-2 mt-sm-0"
                            onClick={() => window.print()}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>
                {isLoading && !serverError && !Object.keys(data).length ? <Loader /> : null}
                {!isLoading && !Object.keys(data).length && !serverError ? <NoContent message={t("No servicing available.")} /> : null}
                {!isLoading && !Object.keys(data).length && serverError ? <NetworkError message={t("Network Error.")} /> : null}

                {/* Device details */}
                {!isLoading && !serverError && Object.keys(data).length ?
                    <>
                        <Container.Column>
                            <Card.Simple>
                                <Card.Header className="bg-white border-0 pb-0">
                                    <div className='d-flex'>
                                        <Image
                                            src={Images.Logo || null}
                                            alt="..."
                                            x={50}
                                            y={50}
                                            className="rounded-circle"
                                        />
                                        <Text className="mb-0 font-weight-bolder fs-22 ml-2 mt-2">{dokanName}</Text>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Container.Row>
                                        <Container.Column className="col-md-8">
                                            <Text className="fs-16 mb-1">Address: {data.address || "N/A"}</Text>
                                            <Text className="fs-16 mb-3">{data.phone || "N/A"}</Text>
                                            <table className="table table-sm table-borderless table-responsive">
                                                <tbody>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Code</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.uid || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Customer name</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.name || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Customer phone</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.phone || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Delivery date</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.delivery_date || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Receive date</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.received_date || "N/A"} </Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Device name</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.device_name || "N/A"} </Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Total fee</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.total_fee || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Advance payment</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.advance_payment || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Due</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.due || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Status</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.status || "N/A"} </Text></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Container.Column>

                                        {/* Barcode generator */}
                                        <Container.Column className="col-md-4">
                                            <Barcode value={id} />
                                        </Container.Column>

                                    </Container.Row>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="mt-3">
                            <Card.Simple>
                                <Card.Header className="bg-white border-0 pb-0">
                                    <div className='d-flex'>
                                        <Image
                                            src={Images.Logo || null}
                                            alt="..."
                                            x={50}
                                            y={50}
                                            className="rounded-circle"
                                        />
                                        <Text className="mb-0 font-weight-bolder fs-22 ml-2 mt-2">{dokanName}</Text>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Container.Row>
                                        <Container.Column className="col-md-8">
                                            <Text className="fs-16 mb-1">Address: {data.address || "N/A"}</Text>
                                            <Text className="fs-16 mb-3">{data.phone || "N/A"}</Text>
                                            <table className="table table-sm table-borderless table-responsive">
                                                <tbody>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Code</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.uid || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Customer name</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.name || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Customer phone</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.customer.phone || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Delivery date</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.delivery_date || "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Receive date</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.received_date || "N/A"} </Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Device name</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.device_name || "N/A"} </Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Total fee</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.total_fee || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Advance payment</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.advance_payment || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Due</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.due || 0} tk.</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pl-0' style={TdWidth}><Text className="fs-16 mb-0">Status</Text></td>
                                                        <td><Text className="fs-16 mb-0">: {data.status || "N/A"} </Text></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Container.Column>

                                        {/* Barcode generator */}
                                        <Container.Column className="col-md-4">
                                            <Barcode value={id} />
                                        </Container.Column>

                                    </Container.Row>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </>
                    : null
                }
                <Container.Column className="mt-4">
                    <Container.Row>
                        <Container.Column className="col-md-6">
                            <Text className="fs-16 mb-1">-------------------------------</Text>
                            <Text className="fs-16 mb-1">Customer Signature</Text>

                        </Container.Column>
                        <Container.Column className="col-md-6 text-md-right mt-3 mt-md-0">
                            <Text className="fs-16 mb-1">--------------------------------</Text>
                            <Text className="fs-16 mb-1">Authorized Signature</Text>

                        </Container.Column>
                    </Container.Row>

                </Container.Column>

            </Main>
        </div>
    )
}

export default Print;