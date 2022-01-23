
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Edit2, Eye, Gift } from 'react-feather'
import {
    SuccessButton,
    DangerButton,
} from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Loader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import { PrimaryModal } from '../../components/modal/PrimaryModal'
import { Container } from '../../components/container/Index'
import { Product } from '../../components/product/Index'
import { Requests } from '../../utils/Http/Index'
import { Link } from 'react-router-dom'

const Index = () => {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState(false)
    const [show_product_modal, setShowProductModal] = useState(false)

    const fetchUsers = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,)
            if (response.data.data) {
                setData(response.data.data)
                setLoading(false)
                setTotalRows(response.data.total)
            }

        } catch (error) {
            if (error.response && error.response.message) {

                setError(true)
            }
            setLoading(false)
        }



    }, [perPage])

    const handlePageChange = page => {
        fetchUsers(page)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)

        const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`)

        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    };


    const fetchData = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductList(page, 10)
            setProducts(response.data.data)
            setLoading(false)
            setError(false)
        } catch (error) {
            setLoading(false)
            setError(true)
        }

    }, [])


    useEffect(() => {
        fetchUsers()
        fetchData()
    }, [fetchUsers, fetchData])

    const columns = [
        {
            name: 'Notice Id',
            selector: row => row.id,
            maxWidth: '100px',
            sortable: true,
        },
        {
            name: 'Notice Description',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '100px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/notice/${row.id}`}>
                        <SuccessButton
                            type="button"
                            style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                            onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>
                    <SuccessButton
                        type="button"
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => handleAction(row)}
                    ><Edit2 size={16} />
                    </SuccessButton>

                </div>
        }
    ]

    // Handle action
    const handleAction = value => console.log(value);

    // Handle search
    const handleSearch = async query => {
        setSearching(true)
        console.log(query)

        setTimeout(() => {
            setSearching(false)
        }, 2000);
    }

    return (
        <div>
            <Layout
                page="notice / index"
                message="All orders you & your customers made is here."
                container="container-fluid"
                printable
                printData={"No data"}
                otherPage
                pageLink="/dashboard/inventory/product/new"
            >
                <Main>
                    <Container.Column>
                        {loading && !data.length ? <Loader /> : null}
                        {!loading && error && !data.length ? <NetworkError message="Network Error." /> :
                            !loading && !data.length ? <NoContent message="No Content." /> :
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    totalRows={totalRows}
                                    handlePerRowsChange={handlePerRowsChange}
                                    handlePageChange={handlePageChange}
                                    search={handleSearch}
                                    searching={searching}
                                />}
                    </Container.Column>
                </Main>
            </Layout>

            {/* Product Show Modal */}
            <PrimaryModal
                show={show_product_modal}
                onHide={() => setShowProductModal(false)}
                size="xl"
                title="Ordered Product"
            >
                {loading && !error && !products.length ? <Loader /> : null}
                {!loading && error && !products.length ? <NetworkError message="Network Error." /> :
                    !loading && !error && !products.length ? <NoContent message="No Content." /> :
                        <Container.Column className="pb-5 pt-4">
                            {products.map((item, index) => {
                                return <Product key={index} product={item} order={true} height={230} />
                            })}
                        </Container.Column>
                }
            </PrimaryModal>
        </div>
    );
}

export default Index;