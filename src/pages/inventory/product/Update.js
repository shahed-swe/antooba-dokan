import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import ProductUpdateForm from '../../../components/form/ProductUpdateForm'
import { Requests } from '../../../utils/Http/Index'
import { useTranslation } from 'react-i18next'
import { discount } from '../../../utils/data'
import { Container } from '../../../components/container/Index'
import { useParams } from 'react-router'
import { Loader } from '../../../components/loading/Index'
import { NetworkError } from '../../../components/501/NetworkError'
import { NoContent } from '../../../components/204/NoContent'

const Index = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [units, setUnits] = useState([])
    const [product, setProduct] = useState(null)
    const [pageLoading, setPageLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchBrands = useCallback(async () => {
        try{
            const response = await Requests.Inventory.Brand.DokanBrandList()
            if (response && response.status === 200) {
                const data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    data.push({
                        value: response.data.data[i].uid,
                        label: response.data.data[i].name
                    })
                }
                setBrands(data)
            }
        }catch(error){
            if(error){
                setError(true)
            }
        }
        

    }, [])

    const fetchUnits = useCallback(async () => {
        try {
            const response = await Requests.Settings.AllUnits();
            const response2 = await Requests.Settings.DokanMeasurementsUnits();

            const units = [];
            response.data.forEach(unit => {
                response2.data.data && response2.data.data.length > 0 ? response2.data.data.forEach(dokanunit => {
                    if (unit.uid === dokanunit.unit_uid) {
                        units.push({ label: unit.title, value: unit.uid });
                    }
                }) : units.push({ label: unit.title, value: unit.uid });
            });

            setUnits(units)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])

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

    const fetchCategories = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Category.CategoryList()

            setCategories(response.data.data)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [])

    const fetchProduct = useCallback(async (uid) => {
        console.log(uid)
        setPageLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanSingleProductShow(uid)
            setProduct(response.data.data)
            setPageLoading(false)
            console.log(response)
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 404) {
                setProduct(null)
                setError(false)
            } else {
                setError(true)
            }
            setPageLoading(false)
        }
    }, [])

    useEffect(() => {
        Promise.all([
            fetchProduct(id),
            fetchBrands(),
            fetchSuppliers(),
            fetchCategories(),
            fetchUnits()
        ]);

    }, [id, fetchProduct, fetchBrands, fetchSuppliers, fetchCategories, fetchUnits])


    return (
        <div>
            <Layout
                page="inventory / update product"
                message={t("Add new product to your shop.")}
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/inventory/product/list">
                            <GrayButton type="button">
                                <ArrowLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>{t("BACK")}</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {pageLoading && !product ? <Loader /> : null}
                {!pageLoading && error && !product ? <NetworkError message="Network Error" /> : null}
                {!pageLoading && !error && !product ? <NoContent message="Content Not Found" /> :
                    <Container.Column>
                        {
                            product && <ProductUpdateForm
                                product={product}
                                brands={brands}
                                units={units}
                                suppliers={suppliers}
                                categories={categories}
                                discount={discount}
                                fetchBrands={fetchBrands}
                                fetchCategories={fetchCategories}
                                fetchSuppliers={fetchSuppliers}
                            />
                        }
                    </Container.Column>}
            </Main>
        </div>
    );
}

export default Index;