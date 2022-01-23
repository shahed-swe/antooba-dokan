import React, { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { Tabs, Tab } from "react-bootstrap"
import { ChevronLeft } from "react-feather"
import { useTranslation } from "react-i18next"
import { GrayButton, PrimaryButton } from "../../components/button/Index"
import { Layout, Main } from "../../components/layout/Index"
import { ShortName } from "../../components/shortName/Index"
import { PurchaseHistory } from "../../components/customer/PurchaseHistory"
import { DueHistory } from "../../components/customer/DueHistory"
import { NoticeHistory } from "../../components/customer/DuePaymentHistory"
import { Text } from "../../components/text/Text"
import { Requests } from "../../utils/Http/Index"
import { Container } from "../../components/container/Index"
import { Loader } from "../../components/loading/Index"
import { NoContent } from "../../components/204/NoContent"
import { NetworkError } from "../../components/501/NetworkError"
import { dateFormate } from "../../utils/_heplers"
import { Image, ImageCircle } from "../../components/image/Index"
import { Card } from "../../components/card/Index"
import { useHistory } from "react-router-dom"

const Show = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const history = useHistory()

    const fetchCustomers = useCallback(async () => {
        try {
            const response = await Requests.Customer.ShowCustomer(id)
            setLoading(false)
            setData(response.data.data)
        } catch (error) {
            setLoading(false)
            setServerError(true)
        }
    }, [id])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    // styles
    const styles = {
        name: {
            width: 80,
        },
        td: {
            width: 100,
        },
    }

    const handleSend = (value) => {
        console.log(value)
        if(value === 'sms'){
            localStorage.setItem('phonenumber', data && data.phone)
            history.push('/dashboard/sms/send/')
        }
        else{
            history.push('/messenger/')
        }
    }


    return (
        <div>
            <Layout
                page={t("dashboard / customer")}
                message={t("Customer's information in details.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/customer">
                            <GrayButton type="button">
                                <ChevronLeft size={15} className="mr-1" />
                                <span>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !Object.keys(data).length && !serverError ? <Loader /> : null}
                {!loading && !Object.keys(data).length && serverError ? <NetworkError message="Network Error!" /> : null}
                {!loading && !Object.keys(data).length && !serverError ? <NoContent message="No customer available." /> : null}

                {!loading && Object.keys(data).length && !serverError ?
                    <Container.Column>

                        {/* Customer image and short name */}
                        <div className="d-lg-flex">
                            {data && data.image ?
                                <div>
                                    <ImageCircle
                                        src={data.image}
                                        alt=""
                                        x={70}
                                        y={70}
                                    />
                                </div>
                                :
                                <div style={styles.name}>
                                    <ShortName
                                        x={70}
                                        y={70}
                                        size={35}
                                        name={data.name}
                                    />
                                </div>
                            }

                            {/* Personal info */}
                            <div className="ml-lg-4 mt-4 mt-lg-0">
                                <Text className="text-capitalize fs-17 font-weight-bold mb-0">
                                    {data.name}.
                                </Text>
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="pl-0" style={styles.td} >
                                                <Text className="text-capitalized fs-13 mb-0">E-mail</Text>
                                            </td>
                                            <td>
                                                <Text className="text-lowercase fs-13 mb-0">
                                                    : {data.email ?? <span className="text-uppercase">N/A</span>}
                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pl-0" style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Phone
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.phone ?? "N/A"}
                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pl-0" style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Street Address
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    :{" "}
                                                    {data.street_address ??
                                                        "N/A"}
                                                </Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Sales info */}
                            <div className="ml-lg-4 mt-lg-4 ">
                                <table className="table table-sm table-borderless">
                                    <tbody>
                                        <tr>
                                            <td className="pl-0" style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">Total Purchase</Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">: {data.total_purchase || 0} tk</Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pl-0" style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">Total due</Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">: {data.total_due || 0} tk</Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pl-0" style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">Last payback</Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">:{" "}
                                                    {data.last_payback ? dateFormate(data.last_payback) : "N/A"}
                                                </Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Container.Column>
                    : null
                }

                {/* Nid front and back pictures */}
                {(data && data.nid_back_scan_copy) || (data && data.nid_front_scan_copy) ?
                    <Container.Column>
                        <Container.Row>
                            {data && data.nid_front_scan_copy ?
                                <div className="m-3">
                                    <Image
                                        src={data.nid_front_scan_copy}
                                        alt=""
                                        x={200}
                                        y={120}
                                    />
                                </div>
                                : null}
                            {data && data.nid_back_scan_copy ?
                                <div className="m-3 ml-md-0">
                                    <Image
                                        src={data.nid_back_scan_copy}
                                        alt=""
                                        x={200}
                                        y={120}
                                    />
                                </div>
                                : null}
                        </Container.Row>
                    </Container.Column>
                    : null}

                {/* Send sms & chat button */}
                <Container.Column>
                    <Container.Row className="ml-0">
                        <PrimaryButton
                            onClick={() => handleSend("sms")}
                            className="px-5 mr-3 mt-2 mt-md-0"
                        >
                            <Text className="fs-15 mb-0">Send SMS</Text>
                        </PrimaryButton>

                        <PrimaryButton
                            onClick={() => handleSend("chat")}
                            className="px-5 mt-md-0 mt-2"
                        >
                            <Text className="fs-15 mb-0">Start Chat</Text>
                        </PrimaryButton>
                    </Container.Row>
                </Container.Column>

                {/* Total purchase & due */}
                <Container.Column>
                    <Container.Row className="m-0 mt-3">

                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_purchase ? data.total_purchase : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> TOTAL PURCHASE </Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
                            <Card.Simple>
                                <Card.Body className="px-0">
                                    <Text className="fs-16 font-weight-bold mb-0"> {data && data.total_due ? data.total_due : 0} TK</Text>
                                    <Text className="fs-16 mb-0 text-muted"> TOTAL DUE </Text>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                    </Container.Row>
                </Container.Column>

                {/* History tabs */}
                {!loading && Object.keys(data).length && !serverError ?
                    <Container.Column className="mt-2 mt-lg-4">
                        <Tabs
                            defaultActiveKey="purchase"
                            id="uncontrolled-tab"
                            className="mb-3"
                        >
                            <Tab eventKey="purchase" title="Purchase History">
                                <PurchaseHistory />
                            </Tab>
                            <Tab eventKey="due" title="Due History">
                                <DueHistory />
                            </Tab>
                            <Tab eventKey="payment" title="Due Payment History">
                                <NoticeHistory />
                            </Tab>
                        </Tabs>
                    </Container.Column>
                    : null
                }
            </Main>
        </div>
    );
};

export default Show;
