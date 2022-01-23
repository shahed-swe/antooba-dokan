import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { GrayButton } from '../../../components/button/Index'
import { Requests } from '../../../utils/Http/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Toastify } from '../../../components/toastify/Toastify'
import { SupplierForm } from '../../../components/form/SupplierForm'
import { Container } from '../../../components/container/Index'
import { useHistory } from "react-router";

const Index = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const [creatingsupplier, setCreatingSupplier] = useState(false)
    const [error, setError] = useState()

    // Handle submit
    const handleCreateSupplier = async data => {
        try {
            setCreatingSupplier(true)
            const newdata = {
                ...data,
                dokan_uid: localStorage.getItem('dokanuid')
            }

            const res = await Requests.Inventory.Supplier.DokanSupplierAdd(newdata)
            if (res.status === 201) {
                Toastify.Success(t('Supplier Created Successfully'))
                history.push('/dashboard/inventory/supplier/list')
            }

            setCreatingSupplier(false)
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 422) {
                setError(error.response.data.errors)
                Toastify.Error("Supplier Can't be created")
            } else {
                Toastify.Error("Network Error Occured.")
            }
            setCreatingSupplier(false)
        }
    }

    return (
        <div>
            <Layout
                page="inventory / add supplier"
                message="Add new supplier details for your shop."
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
                <Container.Column>
                    <SupplierForm
                        errors={error}
                        loading={creatingsupplier}
                        submit={handleCreateSupplier}
                        create={true}
                    />
                </Container.Column>
            </Main>
        </div>
    );
}

export default Index;