import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "react-feather"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import { CustomerForm } from "../../components/form/CustomerForm"
import { Toastify } from "../../components/toastify/Toastify"
import { Requests } from "../../utils/Http/Index"
import { Container } from "../../components/container/Index"
import { Layout } from "../../components/layout/Index"
import { Main } from "../../components/layout/Index"
import { GrayButton } from "../../components/button/Index"

const Create = () => {
    const history = useHistory()
    const { t } = useTranslation()
    const [creating, setCreate] = useState(false)

    const handleCustomerCreate = async (data) => {
        try {
            setCreate(true)
            const response = await Requests.Customer.AddCustomer(data)
            if (response.status === 201) {
                Toastify.Success("Customer Created Successfully")
                history.push('/dashboard/customer')
            }
            setCreate(false)
        } catch (error) {
            setCreate(false)
            if (error && error.response && error.response.status && error.response.status === 422) {
                if (error.response && error.response.data) {
                    Toastify.Error("Some fields are missing.")
                }
            } else {
                Toastify.Error("Network Error")
            }
        }
    }

    return (
        <>
            <Layout
                page={t("inventory / add customer")}
                message={t("Create Customer In your shop.")}
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
                <Container.Column>
                    <CustomerForm
                        errors={null}
                        loading={creating}
                        submit={handleCustomerCreate}
                        create={true}
                    />
                </Container.Column>
            </Main>
        </>
    );
};

export default Create;
