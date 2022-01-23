import React, { useState, useCallback, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { NetworkError } from '../../../components/501/NetworkError'
import { Layout, Main } from '../../../components/layout/Index'
import { ShortName } from '../../../components/shortName/Index'
import { Container } from '../../../components/container/Index'
import { NoContent } from '../../../components/204/NoContent'
import { ImageCircle } from '../../../components/image/Index'
import { GrayButton } from '../../../components/button/Index'
import { Loader } from '../../../components/loading/Index'
import { Card } from '../../../components/card/Index'
import { Text } from '../../../components/text/Text'
import { Requests } from '../../../utils/Http/Index'

const Show = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)

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
                page="mechanic & servicing / servicing show"
                message="Show servicing."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/servicing">
                            <GrayButton type="button">
                                <ChevronLeft size={15} className="mr-2" />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {isLoading && !serverError && !Object.keys(data).length ? <Loader /> : null}
                {!isLoading && !Object.keys(data).length && !serverError ? <NoContent message={t("No servicing available.")} /> : null}
                {!isLoading && !Object.keys(data).length && serverError ? <NetworkError message={t("Network Error.")} /> : null}

                {/* Device details */}
                {!isLoading && !serverError && Object.keys(data).length ?
                    <Container.Column className="col-lg-7 col-xl-8 pr-lg-2 mb-3 mb-lg-0">
                        <Card.Simple>
                            <Card.Header className="bg-white border-0 pb-0">
                                <Text className="mb-0 font-weight-bolder fs-14">Device details</Text>
                            </Card.Header>
                            <Card.Body>
                                <Container.Row>

                                    <Container.Column className="col-xl-6 col-lg-12 col-md-6">
                                        <Text className="text-capitalize fs-18 mb-1">Device Name: {data.device_name || "N/A"}</Text>
                                        <table className="table table-sm table-borderless table-responsive">
                                            <tbody>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Model</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.device_model || "N/A"}</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Recived at</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.received_date || "N/A"}</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Delivered at</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.delivery_date || "N/A"}</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Status</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.status || "N/A"}</Text></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Container.Column>

                                    <Container.Column className="col-xl-6 col-lg-12 col-md-6">
                                        <Text className="text-capitalize fs-18 mb-1">Servicing Info</Text>
                                        <table className="table table-sm table-borderless table-responsive mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Total cost</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.total_cost || 0} tk.</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Total fee</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.total_fee || 0} tk.</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Advance payment</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.advance_payment || 0} tk.</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Service charge</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.service_charge || 0} tk.</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Mechanic profit</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.mechanic_profit || 0} tk.</Text></td>
                                                </tr>
                                                <tr>
                                                    <td className='pl-0' style={TdWidth}><Text className="fs-14 mb-0">Shop profit</Text></td>
                                                    <td><Text className="fs-14 mb-0">: {data.shop_profit || 0} tk.</Text></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Container.Column>

                                </Container.Row>
                                <Text className="fs-14 mb-0 mt-2"><strong>Description: </strong>{data.description || null}</Text>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                    : null
                }

                {/* Customer & Mechanic information */}
                {!isLoading && !serverError && Object.keys(data).length ?
                    <Container.Column className="col-lg-5 col-xl-4 pl-lg-2">

                        {/* Customer details */}
                        <Card.Simple className="mb-3">
                            <Card.Header className="bg-white border-0 pb-0">
                                <Text className="mb-0 font-weight-bolder fs-14">Customer</Text>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex">
                                    <div>
                                        {data.customer && data.customer.image ?
                                            <ImageCircle
                                                src={data.customer.image}
                                                alt={data.customer.name || "..."}
                                                x={60}
                                                y={60}
                                            />
                                            : data.customer && data.customer.name ?
                                                <ShortName
                                                    name={data.customer.name}
                                                    x={60}
                                                    y={60}
                                                    size={35}
                                                />
                                                : null
                                        }
                                    </div>
                                    <div className="pl-3">
                                        <Text className="text-capitalize fs-15 mb-0">{data.customer && data.customer.name ? data.customer.name : "N/A"}</Text>
                                        <Text className="text-lowercase text-muted fs-13 mb-0">{data.customer && data.customer.email ? data.customer.email : null}</Text>
                                        <Text className="text-muted fs-13 mb-0">{data.customer && data.customer.phone ? data.customer.phone : "N/A"}</Text>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card.Simple>

                        {/* Mechanic details */}
                        <Card.Simple className="mb-3">
                            <Card.Header className="bg-white border-0 pb-0">
                                <Text className="mb-0 font-weight-bolder fs-14">Mechanic</Text>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex">
                                    <div>
                                        {data.mechanic && data.mechanic.image ?
                                            <ImageCircle
                                                src={data.mechanic.image}
                                                alt={data.mechanic.name || "..."}
                                                x={60}
                                                y={60}
                                            />
                                            : data.mechanic && data.mechanic.name ?
                                                <ShortName
                                                    name="Antooba"
                                                    x={60}
                                                    y={60}
                                                    size={35}
                                                />
                                                : null
                                        }
                                    </div>
                                    <div className="pl-3">
                                        <Text className="text-capitalize fs-15 mb-0">{data.mechanic && data.mechanic.name ? data.mechanic.name : "N/A"}</Text>
                                        <Text className="text-lowercase text-muted fs-13 mb-0">{data.mechanic && data.mechanic.email ? data.mechanic.email : null}</Text>
                                        <Text className="text-muted fs-13 mb-0">{data.mechanic && data.mechanic.name ? data.mechanic.name : "N/A"}</Text>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                    : null
                }
            </Main>
        </div>
    )
}

export default Show;