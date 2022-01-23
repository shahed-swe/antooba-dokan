import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import ProductForm from '../../../components/form/ProductCreateForm'
import { discount } from '../../../utils/data'
import { Requests } from '../../../utils/Http/Index'
import { useTranslation } from 'react-i18next'
import { Container } from '../../../components/container/Index'
import { NetworkError } from '../../../components/501/NetworkError'
import { Loader } from '../../../components/loading/Index'

const Index = () => {

    const { t } = useTranslation()
    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [units, setUnits] = useState([])
    const [pageloading, setPageLoading] = useState(true)
    const [pageError, setPageError] = useState(false)

    const fetchBrands = useCallback(async () => {
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

    }, [])

    const fetchUnits = useCallback(async () => {
        setPageLoading(true)
        try {
            const response = await Requests.Settings.AllUnits();
            const response2 = await Requests.Settings.DokanMeasurementsUnits();
            console.log('response', response, response2)

            const units = [];

            response.data.forEach(unit => {
                response2.data.data && response2.data.data.length > 0 ? response2.data.data.forEach(dokanunit => {
                    if (unit.uid === dokanunit.unit_uid) {
                        units.push({ label: unit.title, value: unit.uid });
                    }
                }) : units.push({ label: unit.title, value: unit.uid });
            });
            setUnits(units)
            setPageError(false)
            setPageLoading(false)
        } catch (error) {
            if (error) setPageError(true); setPageLoading(false)
        }
    }, [])

    const fetchSuppliers = useCallback(async () => {
        setPageLoading(true)
        try {
            const response = await Requests.Inventory.Supplier.DokanSupplierList()

            const suppliers = response.data.data.map(supplier => {
                return { label: supplier.name, value: supplier.uid };
            });
            setPageError(false)
            setSuppliers(suppliers)
            setPageLoading(false)
        } catch (error) {
            if (error) setPageError(true); setPageLoading(false)
        }
    }, [])

    const fetchCategories = useCallback(async () => {
        setPageLoading(true)
        try {
            const response = await Requests.Inventory.Category.CategoryList()
            setCategories(response.data.data)
            setPageError(false)
            setPageLoading(false)
        } catch (error) {
            if (error) setPageError(true); setPageLoading(false)
        }
    }, [])

    useEffect(() => {
        Promise.all([
            fetchBrands(),
            fetchSuppliers(),
            fetchCategories(),
            fetchUnits()
        ]);
    }, [fetchBrands, fetchSuppliers, fetchCategories, fetchUnits])


    return (
        <div>
            <Layout
                page="inventory / create product"
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
                {pageloading && !pageError ? <Loader /> : null}
                {!pageloading && pageError ? <NetworkError message="Network Error." /> :
                    <Container.Column>
                        <ProductForm
                            brands={brands}
                            units={units}
                            suppliers={suppliers}
                            categories={categories}
                            discount={discount}
                            fetchBrands={fetchBrands}
                            fetchCategories={fetchCategories}
                            fetchSuppliers={fetchSuppliers}
                        />
                    </Container.Column>}
            </Main>
        </div>
    );
}

export default Index;