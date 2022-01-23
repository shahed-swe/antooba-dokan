import { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { Layout, Main } from '../../../components/layout/Index'
import { useTranslation } from 'react-i18next'
import { Container } from '../../../components/container/Index'
import { Requests } from '../../../utils/Http/Index'
import { useParams } from 'react-router'
import { OrderTop } from '../../../components/order/OrderTop/Index'
import { OrderItem } from '../../../components/order/OrderItem/Index'
import { Loader } from '../../../components/loading/Index'
import { NoContent } from '../../../components/204/NoContent'
import { NetworkError } from '../../../components/501/NetworkError'
import { Delivery } from '../../../components/order/delivery/Index'
import { Payment } from '../../../components/order/payment/Index'
import { CustomerDetails } from '../../../components/order/customer/Index'
import { GrayButton } from '../../../components/button/Index'

const Pos = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)


    // fetching product data
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductList()

            if (response && response.status && response.status === 200) {
                setData(response.data.data.slice(0, 3))
                setLoading(false)
            }
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 404) {
                setError(true)
            }
            setLoading(false)
        }

    }, [])

    console.log(data)

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])


    const status = {
        payment: "paid",
        order: "fulfield"
    }

    return (
        <div>
            <Layout
                page="pos / order / show"
                message={t("Order From your store.")}
                shorttext="All orders from your store is here"
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/pos/orders">
                            <GrayButton type="button">
                                <ArrowLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>{t("BACK")}</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !error && !data.length ? <Loader /> : null}
                {!loading && error && !data.length ? <NetworkError message="Network Error." /> :
                    !loading && !error && !data.length ? <NoContent message="No Content." /> :
                        <Container.Fluid>
                            <OrderTop id={id} status={status} />
                            <Container.Row className="mt-4">
                                <Container.Column className="col-xl-8">
                                    <OrderItem order={data} total={data.length} ordertitle={status.order} className="rounded" />
                                    <Delivery className="mt-3 rounded" />
                                    <Payment className="mt-3 rounded" />
                                </Container.Column>
                                <Container.Column className="col-xl-4 mt-3 mt-xl-0">
                                    <CustomerDetails className="rounded" />
                                </Container.Column>
                            </Container.Row>
                        </Container.Fluid>}
            </Main>
        </div>
    );
}

export default Pos;