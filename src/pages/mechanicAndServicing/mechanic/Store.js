import React, { useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import { Toastify } from '../../../components/toastify/Toastify'
import { Layout, Main } from '../../../components/layout/Index'
import { Container } from '../../../components/container/Index'
import { GrayButton } from '../../../components/button/Index'
import { Mechanic } from '../../../components/form/Mechanic'
import { Requests } from '../../../utils/Http/Index'

const Store = () => {
    const [isLoading, setLoading] = useState(false)

    // handle submit
    const handleSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Requests.Mechanic.Store(data)
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
                page="mechanic & servicing / mechanic create"
                message="Create mechanic to your shop."
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
                <Container.Column>
                    <Mechanic
                        create={true}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                    />
                </Container.Column>
            </Main>
        </div>
    );
};

export default Store;