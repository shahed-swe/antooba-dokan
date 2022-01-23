import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { ChevronLeft } from "react-feather";
import { useTranslation } from "react-i18next";
import { GrayButton } from "../../../components/button/Index";
import { Layout, Main } from "../../../components/layout/Index";
import { Loader } from "../../../components/loading/Index";
import { ShortName } from "../../../components/shortName/Index";
import { Text } from "../../../components/text/Text";
import { Requests } from "../../../utils/Http/Index";
import { Container } from "../../../components/container/Index";
import { NetworkError } from "../../../components/501/NetworkError";
import { useParams } from "react-router";
import { NoContent } from "../../../components/204/NoContent";
import { DataTable } from '../../../components/table/Index'

const Show = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [stockindata, setStockinData] = useState([])
    const [stockoutdata, setStockoutData] = useState([])
    const [notice, setNotice] = useState([])
    const [update, setUpdate] = useState(false);
    const [error, setError] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierShow(id)
            setLoading(false);
            setData(response.data.data);
            setUpdate(true);
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                setUpdate(false);
                setError(true)
            }
            setLoading(false)
        }
    }, [id])

    const fetchStockIn = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, perPage)

            if (response && response.status === 200) {
                setStockinData(response.data.data)
                setTotalRows(response.data.meta.total)
                setError(false)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setError(true)
            }
        }
    }, [perPage])

    const fetchStockOut = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, perPage)

            if (response && response.status === 200) {
                setStockoutData(response.data.data)
                setTotalRows(response.data.meta.total)
                setError(false)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
            setError(true)
        }
    }, [perPage])

    const fetchNotice = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, perPage)
            if (response && response.status === 200) {
                setNotice(response.data.data)
                setTotalRows(response.data.meta.total)
                setError(false)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
            setError(true)
        }

    }, [perPage])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        fetchStockIn()
    }, [fetchStockIn])

    useEffect(() => {
        fetchStockOut()
    }, [fetchStockOut])

    useEffect(() => {
        fetchNotice()
    }, [fetchNotice])

    // handle page change for stock in
    const handlePageChangeStockIn = page => fetchData(page)

    // handle row change for stock in
    const handlePerRowsChangeStockIn = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, newPerPage)

            setData(response.data.data)
            setPerPage(newPerPage)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    };

    // handle page change for stock in
    const handlePageChangeStockOut = page => fetchData(page)

    // handle row change for stock in
    const handlePerRowsChangeStockOut = async (newPerPage, page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, newPerPage)

            setData(response.data.data)
            setPerPage(newPerPage)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    };

    // handle page change for stock in
    const handlePageChangeNotice = page => fetchData(page)

    // handle row change for stock in
    const handlePerRowsChangeNotice = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Supplier.DokanSupplierList(page, newPerPage)

            setData(response.data.data)
            setPerPage(newPerPage)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    };

    // styles
    const styles = {
        name: {
            width: 80,
        },
        td: {
            width: 100,
        },
    };

    // for stock in
    const stockincolumns = [
        {
            name: 'Product',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Codes',
            selector: row => row.note,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.address,
            sortable: true,
        },
    ]

    // for stock out
    const stockoutcolumns = [
        {
            name: 'Product',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Codes',
            selector: row => row.note,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.address,
            sortable: true,
        },
    ]

    // for notice
    const noticecolumns = [
        {
            name: 'Product',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Codes',
            selector: row => row.note,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.address,
            sortable: true,
        },
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / supplier")}
                message={t("Supplier's information.")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/inventory/supplier/list">
                            <GrayButton type="button">
                                <ChevronLeft
                                    size={15}
                                    style={{ marginRight: 5 }}
                                />
                                <span>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />
            {loading && !data && !update ? <Loader /> : null}
            {!loading && !error && !data && !update ? <NetworkError message="Network Error" /> : null}
            {!loading && data && update ? (
                <Main>
                    {/* Basic information of customer */}
                    <Container.Column>
                        <div className="d-lg-flex">

                            {/* Vector */}
                            <div style={styles.name}>
                                <ShortName
                                    x={70}
                                    y={70}
                                    size={35}
                                    name={data.name}
                                />
                            </div>

                            {/* Personal info */}
                            <div className="ml-lg-4 mt-4 mt-lg-0 mb-0 pb-0">
                                <Text className="text-capitalize fs-17 font-weight-bold">
                                    {data.name}
                                </Text>
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    E-mail
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-lowercase fs-13 mb-0">
                                                    : {data.email || <span className="text-uppercase">N/A</span>}
                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Phone
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.phone || "N/A"}
                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Street Address
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.street_line1 || data.street_line2 ? data.street_line1 ? data.street_line1 : " " + data.street_line2 ? data.street_line2 : "" : " N/A"}
                                                </Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Sales info */}
                            <div className="ml-lg-4 mt-lg-4 pt-lg-3">
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Total Purchase
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.total_purchase || 0} tk.{" "}

                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Total due
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.total_due || 0} tk.{" "}
                                                </Text>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Total Paid
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.total_paid || 0} tk.{" "}
                                                </Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="ml-lg-4 mt-xl-4 pt-xl-3">
                                <table className="table table-sm table-borderless">
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    Advance Taken
                                                </Text>
                                            </td>
                                            <td>
                                                <Text className="text-capitalized fs-13 mb-0">
                                                    : {data.total_advance_taken || 0} tk.{" "}
                                                </Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Container.Column>

                    {/* Selected items */}
                    <Container.Column>
                        {/* History tabs */}
                        <div>
                            <Tabs
                                defaultActiveKey="stockin"
                                id="uncontrolled-tab"
                                className="mb-3 mt-4"
                            >
                                <Tab eventKey="stockin" title="Stock In History">
                                    <DataTable
                                        columns={stockincolumns}
                                        data={stockindata}
                                        loading={loading}
                                        totalRows={totalRows}
                                        handlePerRowsChange={handlePerRowsChangeStockIn}
                                        handlePageChange={handlePageChangeStockIn}
                                    />
                                </Tab>
                                <Tab eventKey="stockout" title="Stock Out History">
                                    <DataTable
                                        columns={stockoutcolumns}
                                        data={stockoutdata}
                                        loading={loading}
                                        totalRows={totalRows}
                                        handlePerRowsChange={handlePerRowsChangeStockOut}
                                        handlePageChange={handlePageChangeStockOut}
                                    />
                                </Tab>
                                <Tab eventKey="notice" title="Notice">
                                    <DataTable
                                        columns={noticecolumns}
                                        data={notice}
                                        loading={loading}
                                        totalRows={totalRows}
                                        handlePerRowsChange={handlePerRowsChangeNotice}
                                        handlePageChange={handlePageChangeNotice}
                                    />
                                </Tab>
                            </Tabs>
                        </div>

                    </Container.Column>
                </Main>
            ) : (
                !loading && error ? <NoContent message="No Content." /> : null
            )}
        </div>
    );
};

export default Show;
