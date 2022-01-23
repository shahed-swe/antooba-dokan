import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { NetworkError } from '../../../components/501/NetworkError'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { NoContent } from '../../../components/204/NoContent'
import { GrayButton } from '../../../components/button/Index'
import { Mechanic } from '../../../components/form/Mechanic'
import { Loader } from '../../../components/loading/Index'
import { Requests } from '../../../utils/Http/Index'

const Edit = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isUpdating, setUpdating] = useState(false)
    const [serverError, setServerError] = useState(false)

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Mechanic.Show(id)
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

    // handle submit
    const handleSubmit = async (data) => {
        try {
            setUpdating(true)
            const response = await Requests.Mechanic.Update(id, data)
            if (response && response.status === 200) {
                console.log(response.data)
                Toastify.Success(response.data.message)
            }

            setUpdating(false)
        } catch (error) {
            if (error) {
                setUpdating(false)
                Toastify.Error("Network error.")
            }
        }
    }

    return (
        <div>
            <Layout
                page="mechanic & servicing / mechanic edit"
                message={`Edit mechanic ${data.name || ""} profile.`}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/mechanic">
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
                {!isLoading && !Object.keys(data).length && !serverError ? <NoContent message={t("No mechanic available.")} /> : null}
                {!isLoading && !Object.keys(data).length && serverError ? <NetworkError message={t("Network Error.")} /> : null}

                {!isLoading && !serverError && Object.keys(data).length ?
                    <Container.Column>
                        <Mechanic
                            data={data}
                            create={false}
                            isLoading={isUpdating}
                            onSubmit={handleSubmit}
                        />
                    </Container.Column>
                    : null
                }
            </Main>
        </div>
    );
};

export default Edit;