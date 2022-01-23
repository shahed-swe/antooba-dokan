import React, { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Edit2, Eye, Plus, Printer, Trash2 } from "react-feather"
import { DangerButton, GrayButton, SuccessButton } from "../../components/button/Index"
import { Text } from '../../components/text/Text'
import { DeleteModal } from "../../components/modal/DeleteModal"
import { Layout, Main } from "../../components/layout/Index"
import { DataTable } from "../../components/table/Index"
import { Requests } from "../../utils/Http/Index"
import { Container } from "../../components/container/Index"
import { NetworkError } from "../../components/501/NetworkError"
import { Toastify } from "../../components/toastify/Toastify"
import { formatDateWithAMPM } from "../../utils/_heplers"
import { PrimaryModal } from "../../components/modal/PrimaryModal"
import { CustomerPayForm } from "../../components/form/CustomerPayForm"

const Index = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isDelete, setDelete] = useState({
        value: null,
        show: false,
        loading: false,
    })
    const [uid, setUid] = useState(null)
    const [searchLoading, setsearchLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [payModal, setPayModal] = useState({ value: null, show: false, loading: false })

    const fetchCustomers = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage);
            setData(response.data.data);
            setTotalRows(response.data.meta.total);
            setLoading(false);
            setServerError(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    const handlePageChange = (page) => fetchCustomers(page)

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
                setLoading(false)
            }

        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    };

    useEffect(() => {
        fetchCustomers(1)
    }, [fetchCustomers])

    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null,
        };
        const response = await Requests.Customer.CustomerSearch(value)
        if (response && response.data.data && response.data.data.length) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // Handle search
    const handleSearch = async (data) => {
        setsearchLoading(true);
        const response = await Requests.Customer.CustomerSearch(data);
        if (response.data) setData(response.data.data);
        setsearchLoading(false);
    }

    // Handle payment submission
    const handlePaymentSubmission = async (data) => {
        try {
            setPayModal({ ...payModal, loading: true })
            console.log(data)

            setTimeout(() => {
                setPayModal({ value: null, loading: false, show: false })
                Toastify.Success("Successfully working in dummy.")
            }, 2000)
        } catch (error) {
            if (error) {
                setPayModal({ ...payModal, loading: false })
                Toastify.Error("Network Error.")
            }
        }
    }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true });
        const res = await Requests.Customer.DeleteCustomer(uid);
        if (res.status === 200) {
            setDelete({ ...isDelete, loading: false, show: false });
            Toastify.Success(t("Customer deleted."));
            fetchCustomers();
        } else {
            setDelete({ ...isDelete, loading: false, show: false });
            Toastify.Error(t("Customer can't deleted."));
        }
    }

    // Data columns
    const columns = [
        {
            name: `${t("Name")}`,
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: `${t("Email")}`,
            selector: (row) => row.email ?? "N/A",
            sortable: true,
        },
        {
            name: `${t("Phone")}`,
            selector: (row) => row.phone ?? "N/A",
            sortable: true,
        },
        {
            name: `${t("Total Purchase (Tk)")}`,
            selector: (row) => row.total_purchase ?? 0,
            sortable: true,
        },
        {
            name: `${t("Total Due (Tk)")}`,
            selector: (row) => row.total_due ?? 0,
            sortable: true,
        },
        {
            name: `${t("Last Payback")}`,
            selector: (row) => row.last_payback ? formatDateWithAMPM(row.last_payback) : "N/A",
            sortable: true,
        },
        {
            name: `${t("Action")}`,
            grow: 0,
            minWidth: "250px",
            cell: (row) => (
                <div>
                    <SuccessButton
                        className="mr-1"
                        type="button"
                        onClick={() => setPayModal({ ...payModal, show: true, data: row })}
                    ><Text className="mb-0 fs-12">{t("PAY NOW")}</Text></SuccessButton>

                    <Link to={`/dashboard/customer/show/${row.uid}`}>
                        <SuccessButton className="circle-btn mr-1">
                            <Eye size={16} />
                        </SuccessButton>
                    </Link>

                    <Link to={`/dashboard/customer/edit/${row.uid}`}>
                        <SuccessButton className="circle-btn mr-1">
                            <Edit2 size={16} />
                        </SuccessButton>
                    </Link>

                    <DangerButton
                        className="circle-btn"
                        onClick={() => {
                            setUid(row.uid)
                            setDelete({ value: row, show: true })
                        }}
                    >
                        <Trash2 size={16} />
                    </DangerButton>
                </div>
            ),
        },
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / customers")}
                message={t("Who are using this system.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/customer/create">
                            <GrayButton>
                                <Plus size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>
                                    {t("ADD CUSTOMER")}
                                </span>
                            </GrayButton>
                        </Link>
                        <GrayButton
                            type="button"
                            className="ml-2 mt-2 mt-sm-0"
                            onClick={() => console.log("Will print")}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t("PRINT")}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>
                {serverError ? <NetworkError message="Network Error." /> : null}

                {!serverError ?
                    <Container.Column>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            totalRows={totalRows}
                            handlePerRowsChange={handlePerRowsChange}
                            handlePageChange={handlePageChange}

                            noDataMessage="No customer available"
                            searchable
                            placeholder={"Search Customer"}
                            search={handleSearch}
                            searchLoading={searchLoading}
                            suggestion={handleSuggestion}
                            clearSearch={() => fetchCustomers(1)}
                        />
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Pay form modal */}
            <PrimaryModal
                show={payModal.show}
                onHide={() => setPayModal({ value: null, loading: false, show: false })}
                size="md"
                title="Pay Due"
            >
                <CustomerPayForm
                    loading={payModal.loading}
                    onSubmit={handlePaymentSubmission}
                    onHide={() => setPayModal({ value: null, loading: false, show: false })}
                />
            </PrimaryModal>

            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={
                    <Text className="fs-15 mb-0">
                        {t("Want to delete ")}{isDelete.value ? isDelete.value.email : null} ?
                    </Text>
                }
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
};

export default Index;
