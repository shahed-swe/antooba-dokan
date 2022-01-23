import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { ServicingOtherProduct } from '../../../components/form/ServicingOtherProduct'
import { GrayButton } from '../../../components/button/Index'
import { Requests } from '../../../utils/Http/Index'
import { Tab, Tabs } from 'react-bootstrap'
import { ServicingOurProduct } from '../../../components/form/ServicingOurProduct'

const Store = () => {
    const [isLoading, setLoading] = useState(false)

    const partsData = [
        { label: "test1", value: 1, total_cost: 2300 },
        { label: "test2", value: 2, total_cost: 8900 }
    ]
    const productData = [
        {
            label: "product1",
            value: 1,
            customer_name: "test customer 1",
            warranty:10,
            product_name: [
                {
                    label: "product name 1",
                    value: 1,
                    product_model: [
                        { label: "product model 1", value: 1 },
                        { label: "product model 2", value: 2 },
                        { label: "product model 3", value: 3 },
                        { label: "product model 4", value: 4 },
                    ]
                },
                {
                    label: "product name 2",
                    value: 2,
                    product_model: [
                        { label: "product model 21", value: 1 },
                        { label: "product model 22", value: 2 },
                        { label: "product model 23", value: 3 },
                        { label: "product model 24", value: 4 },
                    ]
                }
            ]
        },
        {
            label: "product2",
            value: 2,
            customer_name: "test customer 2",
            warranty:15,
            product_name: [
                {
                    label: "product name 21",
                    value: 21,
                    product_model: [
                        { label: "product model 31", value: 1 },
                        { label: "product model 32", value: 2 },
                        { label: "product model 33", value: 3 },
                        { label: "product model 34", value: 4 },
                    ]
                },
                {
                    label: "product name 22",
                    value: 22,
                    product_model: [
                        { label: "product model 41", value: 1 },
                        { label: "product model 42", value: 2 },
                        { label: "product model 43", value: 3 },
                        { label: "product model 44", value: 4 },
                    ]
                }
            ]
        },
        {
            label: "product3",
            value: 3,
            customer_name: "test customer",
            warranty:20,
            product_name: [
                {
                    label: "product name 31",
                    value: 31,
                    product_model: [
                        { label: "product model 51", value: 1 },
                        { label: "product model 52", value: 2 },
                        { label: "product model 53", value: 3 },
                        { label: "product model 54", value: 4 },
                    ]
                },
                {
                    label: "product name 32",
                    value: 32,
                    product_model: [
                        { label: "product model 61", value: 1 },
                        { label: "product model 62", value: 2 },
                        { label: "product model 63", value: 3 },
                        { label: "product model 64", value: 4 },
                    ]
                }
            ]
        },
    ]

    // handle submit
    const handleSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Requests.Servicing.Store(data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }

            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                Toastify.Error("Network error.")
            }
        }
    }

    return (
        <div>
            <Layout
                page="mechanic & servicing / servicing create"
                message="Create servicing to your shop."
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
                <Container.Column>
                    <Tabs
                        defaultActiveKey="ourProduct"
                        id="uncontrolled-tab"
                        className="mb-3"
                    >
                        <Tab eventKey="ourProduct" title="Our's Product">
                            <ServicingOurProduct
                                productData={productData}
                                partsData={partsData}
                                isLoading={isLoading}
                                onSubmit={data => handleSubmit(data)}
                            />
                        </Tab>
                        <Tab eventKey="otherProduct" title="Other's Product">
                            <ServicingOtherProduct
                                partsData={partsData}
                                isLoading={isLoading}
                                onSubmit={data => handleSubmit(data)}
                            />
                        </Tab>
                    </Tabs>
                </Container.Column>
            </Main>
        </div>
    );
};

export default Store;