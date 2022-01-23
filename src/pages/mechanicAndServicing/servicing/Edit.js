import React, { useState, useCallback, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { NetworkError } from '../../../components/501/NetworkError'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { ServicingOtherProduct } from '../../../components/form/ServicingOtherProduct'
import { GrayButton } from '../../../components/button/Index'
import { NoContent } from '../../../components/204/NoContent'
import { Loader } from '../../../components/loading/Index'
import { Requests } from '../../../utils/Http/Index'
import { ServicingOurProduct } from '../../../components/form/ServicingOurProduct'
import { Tab, Tabs } from 'react-bootstrap'

const Edit = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [serverError, setServerError] = useState(false)
    const partsData = [
        { label: "test1", value: 1, total_cost: 2300 },
        { label: "test2", value: 2, total_cost: 8900 }
    ]
    const productData = [
        { label: "product1", value: 1, total_cost: 2300 },
        { label: "product2", value: 2, total_cost: 8900 }
    ]

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Servicing.Show(id)
            if (response.status === 200) {
                setData(response.data.data)
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


    // Handle update
    const handleUpdate = async (data) => {
        try {
            const formData = {
                ...data,
                _method: 'PUT'
            }

            setUpdate(true)
            const response = await Requests.Servicing.Update(id, formData)
            if (response && response.status === 200) {
                Toastify.Success(response.data.message)
            }
            setUpdate(false)
        } catch (error) {
            if (error) {
                setUpdate(false)
                Toastify.Success("Network error.")
            }
        }
    }

    return (
        <div>
            <Layout
                page="mechanic & servicing / servicing edit"
                message="Edit servicing."
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

                {!isLoading && !serverError && Object.keys(data).length ?
                    <Container.Column>
                        <Tabs
                            defaultActiveKey="ourProduct"
                            id="uncontrolled-tab"
                            className="mb-3"
                        >
                            <Tab eventKey="ourProduct" title="Our's Product">
                                <ServicingOurProduct
                                    editData={data}
                                    productData={productData}
                                    partsData={partsData}
                                    isLoading={isLoading}
                                    onSubmit={data => handleUpdate(data)}
                                />
                            </Tab>
                            <Tab eventKey="otherProduct" title="Other's Product">
                                <ServicingOtherProduct
                                    editData={data}
                                    partsData={partsData}
                                    isLoading={isLoading}
                                    onSubmit={data => handleUpdate(data)}
                                />
                            </Tab>
                        </Tabs>
                    </Container.Column>
                    : null
                }
            </Main>
        </div>
    );
};

export default Edit;