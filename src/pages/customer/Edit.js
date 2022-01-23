import { useCallback, useEffect, useState } from "react"
import { ArrowLeft } from "react-feather"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import { GrayButton } from "../../components/button/Index"
import { Container } from "../../components/container/Index"
import { CustomerForm } from "../../components/form/CustomerForm"
import { Layout, Main } from "../../components/layout/Index"
import { Loader } from "../../components/loading/Index"
import { NoContent } from "../../components/204/NoContent"
import { NetworkError } from "../../components/501/NetworkError"
import { Toastify } from "../../components/toastify/Toastify"
import { Requests } from "../../utils/Http/Index"


const Create = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const history = useHistory()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState(null)
    const [serverError, setServerError] = useState(false)

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Customer.ShowCustomer(id)
            if (response.status === 200) {
                setLoading(false)
                setData(response.data.data)
            }
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [id])

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // Handle customer update
    const handleCustomerUpdate = async (data) => {
        try {
            setUpdating(true)
            const response = await Requests.Customer.UpdateCustomer(data, id)
            if (response.status === 200) {
                Toastify.Success(t("Customer updated successfully"))
                history.push('/dashboard/customer/')
            }
            setUpdating(false)
        } catch (error) {
            setUpdating(false)

            if (error && error.response && error.response.status && error.response.status === 422) {
                if (error.response && error.response.data) {
                    Toastify.Error(t("Customer can't be Updated"))
                    setError(error.response.data)
                }
            } else {
                Toastify.Error(t("Network Error"))
            }
        }
    }

    return (
        <>
            <Layout
                page={t("inventory / update customer")}
                message={t("Update Customer credentials of your shop.")}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/customer">
                            <GrayButton type="button">
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !Object.keys(data).length && !serverError ? <Loader /> : null}
                {!loading && !Object.keys(data).length && !serverError ? <NoContent message="No customer available." /> : null}
                {!loading && !Object.keys(data).length && serverError ? <NetworkError message="Network error!" /> : null}

                {!loading && Object.keys(data).length && !serverError ?
                    <Container.Column>
                        <CustomerForm
                            errors={error}
                            loading={updating}
                            submit={handleCustomerUpdate}
                            customerdata={data}
                            create={false}
                        />
                    </Container.Column>
                    : null
                }
            </Main>
        </>
    );
};

export default Create;
