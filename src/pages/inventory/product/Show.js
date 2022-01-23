import React, { useEffect, useState, useCallback } from 'react'
import HtmlParser from 'react-html-parser'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Gallery } from '../../../components/galary/Index'
import { Loader } from '../../../components/loading/Index'
import { Requests } from '../../../utils/Http/Index'
import { NetworkError } from '../../../components/501/NetworkError'
import { NoContent } from '../../../components/204/NoContent'
import { Container } from '../../../components/container/Index'
import { Text } from '../../../components/text/Text'

const Index = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Product.DokanSingleProductShow(id)
            if (response && response.status === 200) {
                setData(response.data.data)
                console.log(response.data.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error) setServerError(true)
        }
    }, [id])


    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div>
            <Layout
                page={t("dashboard / product show")}
                message={data && data.name ? data.name : "Product information."}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/inventory/product/list">
                            <GrayButton type="button">
                                <ChevronLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !Object.keys(data).length && !serverError ? <Loader /> : null}
                {!loading && !Object.keys(data).length && !serverError ? <NoContent message={t("No product available.")} /> : null}
                {!loading && !Object.keys(data).length && serverError ? <NetworkError message={t("Network error!")} /> : null}

                {!loading && Object.keys(data).length && !serverError ?
                    <>
                        {/* Image gallery */}
                        {data.images && data.images.length ?
                            <Container.Column className="mb-5">
                                <Gallery image={data.images} />
                            </Container.Column>
                            : null
                        }

                        {/* Product information */}
                        <Container.Column className="col-lg-4 mb-lg-4 mb-lg-0">
                            <Text className="fs-16 font-weight-bolder">Product information</Text>
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Name</Text>
                                        </td>
                                        <td>
                                            <Text className="fs-14 mb-0">: <span className="text-dark">{data && data.name ? data.name : "N/A"}</span></Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}><Text className="fs-14 mb-0">Stock Status</Text></td>
                                        <td>
                                            {console.log(data)}
                                            <Text className="fs-14 mb-0">: <span className="text-success">{data && data.quantity > 0 ? "Stock in" : "Stock Out"}</span></Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Brand</Text>
                                        </td>
                                        <td>
                                            <Text className="text-capitalize fs-14 mb-0">: {data && data.brand ? data.brand.name : "N/A"}</Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Category</Text>
                                        </td>
                                        <td>
                                            {data && data.category ?
                                                <Text className="text-capitalize fs-14 mb-0">: <Link to={`/dashboard/category/show/${data && data.category.uid ? data.category.uid : "N/A"}`} className="text-decoration-none">{data.category.name}</Link></Text>
                                                : "N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Purchase Price</Text>
                                        </td>
                                        <td>
                                            {data && data.purchase_price ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.purchase_price}</Text>
                                                : "N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Selling Price</Text>
                                        </td>
                                        <td>
                                            {data && data.selling_price ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.selling_price}</Text>
                                                : ": N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Discount</Text>
                                        </td>
                                        <td>
                                            {data && data.discount_amount ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.discount_amount} {data.discount_type}</Text>
                                                : ": N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Product Code</Text>
                                        </td>
                                        <td>
                                            {data && (data.product_code || data.codes.length > 0) ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.product_code || data.codes.length > 0 ? data.product_code ? data.product_code : data.codes.map(code => code.code).join(', ') : ": N/A"}</Text>
                                                : ": N/A"
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Container.Column>
                        <Container.Column className="col-lg-4 mt-lg-4 pt-lg-3 mb-lg-0">
                            {/* <Text className="fs-16 font-weight-bolder">Product information</Text> */}
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Warrenty Type</Text>
                                        </td>
                                        <td>
                                            {data && data.warranty_type ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.warranty_type}</Text>
                                                : "N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Warrenty Time</Text>
                                        </td>
                                        <td>
                                            {data && data.warranty_period ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.warranty_period !== "undefined" ? data.warranty_period : "N/A"} </Text>
                                                : "N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Return Applicable</Text>
                                        </td>
                                        <td>
                                            {data && data.return_applicable ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.return_applicable === 1 ? "Yes" : "No"} </Text>
                                                : ": N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}>
                                            <Text className="fs-14 mb-0">Replace Applicable</Text>
                                        </td>
                                        <td>
                                            {data && data.replacement_applicable ?
                                                <Text className="text-capitalize fs-14 mb-0">: {data.replacement_applicable === 1 ? "Yes" : "No"}</Text>
                                                : ": N/A"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}><Text className="fs-14 mb-0">Supplier</Text></td>
                                        <td>
                                            <Text className="fs-14 mb-0">: {data && data.supplier && data.supplier.name ? data.supplier.name : "N/A"}</Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: 100 }}><Text className="fs-14 mb-0">Supplier Phone</Text></td>
                                        <td>
                                            <Text className="fs-14 mb-0">: {data && data.supplier && data.supplier.phone ? data.supplier.phone : "N/A"}</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Container.Column>

                        {/* Additional information */}
                        {data.stockin && data.stockin.length ?
                            <Container.Column className="col-lg-4 mb-4 mb-lg-0">
                                {/* <Text className="fs-16 font-weight-bolder">Additional information</Text> */}
                                <table className="table table-sm table-borderless mb-0">
                                    <thead>
                                        <tr>
                                            <th> <Text className="fs-16 mb-0 font-weight-bold">Batch Id</Text> </th>
                                            <th> <Text className="fs-16 mb-0 font-weight-bold">Quantity</Text> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.stockin.map((item, i) =>
                                            <tr key={i}>
                                                <td style={{ minWidth: 100 }}>
                                                    <Text className="text-dark fs-14 mb-0">{item.batch_id}</Text>
                                                </td>
                                                <td><Text className="text-capitalize fs-14 mb-0">{item.quantity}</Text></td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </Container.Column>
                            : null
                        }

                        {/* Description */}
                        <Container.Column>
                            <Text className="fs-16 font-weight-bolder">Description</Text>
                            <Text className="fs-14 font-weight-bold">{data && data.short_description ? data.short_description : "N/A"}</Text>
                            <Text className="fs-14 font-weight-normal">{data && data.long_description ? data.long_description : "N/A"}</Text>
                        </Container.Column>
                    </> : null
                }
            </Main>
        </div>
    );
};
export default Index;