import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Requests } from '../../../utils/Http/Index'
import { Container } from '../../../components/container/Index'
import { Loader } from "../../../components/loading/Index"
import { NoContent } from '../../../components/204/NoContent'
import { NetworkError } from "../../../components/501/NetworkError"
import { Toastify } from '../../../components/toastify/Toastify'
import { useHistory } from 'react-router'
import StockAddForm from '../../../components/form/StockAddForm'

const Index = () => {
    const history = useHistory()
    const [suppliers, setSuppliers] = useState([])
    const [products, setProducts] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    // Handle submit
    const handleStockAdd = async data => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Stock.AddStock(data)
            if (response && response.status === 201) {
                Toastify.Success("Stock Added Successfully")
                history.push('/dashboard/inventory/stock/in-history')
            }
            setLoading(false)
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 422) {
                Toastify.Error("Stock Can't Be Added")
            } else {
                Toastify.Error("Network Error.")
            }
            setLoading(false)
        }
    }


    const fetchSuppliers = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierList()

            const suppliers = response.data.data.map(supplier => {
                return { label: supplier.name, value: supplier.uid };
            });

            setSuppliers(suppliers)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])


    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await Requests.Inventory.Product.DokanProductList(0, 0)

            const products = response.data.data.map(product => {
                return { label: product.name, value: product.uid };
            });
            setLoading(false)
            setProducts(products)
            setError(false)
        } catch (error) {
            if (error) {
                setError(true)

            }
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        Promise.all([
            fetchSuppliers(),
            fetchProducts(),
        ]);
    }, [fetchSuppliers, fetchProducts])


    const handleChanges = (data) => {
        fetchProducts()
    }


    return (
        <div>
            <Layout
                page="inventory / add Stock"
                message="Add new product to your shop."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/inventory/stock/in-history">
                            <GrayButton type="button">
                                <ArrowLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !products.length ? <Loader /> : null}
                {!loading && error && !products.length ? <NetworkError message="Network Error." /> :
                    !loading && !products.length ? <NoContent message="No Product Available for Stock In" /> :
                        <Container.Column>
                            <StockAddForm
                                fetchSuppliers={fetchSuppliers}
                                products={products}
                                suppliers={suppliers}
                                submit={handleStockAdd}
                                loading={loading}
                                handleChanges={handleChanges}
                            />
                        </Container.Column>}
            </Main>
        </div>
    );
}

export default Index;