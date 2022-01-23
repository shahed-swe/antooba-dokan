import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Requests } from '../../../utils/Http/Index'
import { Container } from '../../../components/container/Index'
import { SupplierForm } from '../../../components/form/SupplierForm'
import { Toastify } from '../../../components/toastify/Toastify'
import { NetworkError } from '../../../components/501/NetworkError'
import { Loader } from '../../../components/loading/Index'
import { useHistory, useParams } from 'react-router'
import { NoContent } from '../../../components/204/NoContent'


const Index = () => {
    const history = useHistory()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [isUpdate, setUpdate] = useState(true)
    const [error, setError] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierShow(id)
            if (response && response.status === 200) {
                setData(response.data.data)
                setUpdate(false)
            }
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                setError(true)
            }
            setUpdate(false)
        }
    }, [id])


    useEffect(() => {
        fetchData()
    }, [fetchData])


    // Handle submit
    const UpdateSupplier = async data => {
        setLoading(true)
        try {
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid'),
                uid: id,
                _mehod: "PUT",
            }
            const res = await Requests.Inventory.Supplier.DokanSupplierUpdate(newdata)
            if (res.status === 200) {
                Toastify.Success('Supplier Updated Successfully')
                history.push('/dashboard/inventory/supplier/list')
            }
            setLoading(false)
        } catch (error) {
            if (error.response && error.response.status === 422) {
                Toastify.Error(error.response.data.message)
            } else {
                Toastify.Error('Network Error Occured.')
            }
            setLoading(false)
        }

    }

    if (isUpdate) return <Loader />;


    return (
        <div>
            <Layout
                page="inventory / edit supplier"
                message="Edit a supplier details of your shop."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/inventory/supplier/list">
                            <GrayButton type="button">
                                <ArrowLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {isUpdate && !error && !data ? <Loader /> : null}
                {!isUpdate && !error && !data ? <NetworkError message="Network Error." /> :
                    !isUpdate && error && !data ? <NoContent message="No Content." /> :
                        <Container.Column>
                            <SupplierForm
                                loading={loading}
                                submit={UpdateSupplier}
                                supplier={data}
                                create={false}
                            />
                        </Container.Column>
                }

            </Main>
        </div>
    );
}

export default Index;