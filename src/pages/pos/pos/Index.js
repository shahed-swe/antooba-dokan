import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Layout, Main } from '../../../components/layout/Index'
import { Requests } from '../../../utils/Http/Index'
import { useTranslation } from 'react-i18next'
import { Container } from '../../../components/container/Index'
import { Busket } from '../../../components/busket/Index';
import { Product } from '../../../components/product/Index'
import { SearchableSelect} from '../../../components/select/Index'
import { addToDatabaseCart, getDatabaseCart, removeFromDatabaseCart } from '../../../utils/utilities'
import { Loader } from '../../../components/loading/Index'
import { NoContent } from '../../../components/204/NoContent'
import { NetworkError } from '../../../components/501/NetworkError'
import { useQuery } from '../../../components/query/Index'
import { useHistory } from 'react-router-dom'

const Pos = () => {
    const { t } = useTranslation()
    const onClearRef = useRef()
    const history = useHistory()
    const queryParams = useQuery()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [busket, setBusket] = useState([])
    const [product, setProduct] = useState([])
    const savedCart = getDatabaseCart();
    const qnt = Object.keys(savedCart).length;
    const [changedId, setChangedId] = useState(null)
    const [quantity, setQuantity] = useState(qnt ?? 0)
    const [busketproduct, setBusketProd] = useState([])
    const [busketShake, setBusketShake] = useState(false)
    const [closeFilter, setCloseFilter] = useState(false)

    // for shaking busket of pos page
    const handleBusketShake = (product) => {
        handleChangeInputBusket(product.uid)
        setBusketShake(true)
        fetchProduct()
        setTimeout(() => {
            setBusketShake(false)
        }, 300)
    }

    // for fetching product list
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductList(page, 10)
            setData(response.data.data)
            setLoading(false)
            setError(false)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }, [])



    // ------------------------ Filter item ---------------
    const handleFilterByUrl = (field, value) => {
        let item = { [field]: value }
        let params = {
            ...queryParams,
            ...item,
        }

        if (params) {
            const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
            history.replace(`point-of-sell?${queryString}`)
            setCloseFilter(true)
        }
    }

    // handle filter category
    const handleFilterCategory = async (data) => {
        let results = []
        try {
            const response = await Requests.Inventory.Category.CategorySearch(data.query)
            if (response.data && response.data.data && response.status === 200) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    results.push({
                        value: element.uid,
                        label: element.name
                    })
                }
            }

        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                console.log("No Category found")
            }
        }
        return results
    }

    // handle filter brand
    const hadleFIlterBrand = async (data) => {
        let results = []
        try {
            const response = await Requests.Inventory.Brand.DokanBrandSearch(data.query)
            if (response.data && response.data.data && response.status === 200) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    results.push({
                        value: element.uid,
                        label: element.name
                    })
                }
            }
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                console.log("No Brand Found")
            }
        }
        return results
    }

    // handle fitler product
    const handleFilterProduct = async (data) => {
        let results = []
        try {
            const response = await Requests.Inventory.Product.DokanProductSearch(data.query)
            if (response.data && response.data.data && response.status === 200) {
                for (let i = 0; i < response.data.data.length; i++) {
                    const element = response.data.data[i]
                    results.push({
                        value: element.uid,
                        label: element.name
                    })
                }
            }
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                console.log("No Brand Found")
            }
        }
        return results
    }

    // discount calculation 
    const discountCalculate = (corePrice, discountType, discountAmount) => {
        let newPrice

        if (discountType && discountType === "taka") {
            newPrice = parseInt(corePrice) - parseInt(discountAmount)
        } else {
            const discount = (corePrice * discountAmount) / 100
            newPrice = parseInt(corePrice - discount)
        }

        return newPrice
    }

    // handle Busket
    const handleBusket = (product, price) => {
        console.log(product)
        const toBeAddedKey = product.uid;
        const sameProduct = busket.length > 0 && busket.find(productItem => productItem.uid === toBeAddedKey);

        let count = 1;
        let newCart;

        if (sameProduct) {
            count = sameProduct.quantity;
            sameProduct.quantity = count;
            const others = busket.filter(productItem => productItem.uid !== toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = 1;
            newCart = [...busket, product]
        }
        const selling_price = discountCalculate(product.selling_price, product.discount_type, product.discount_amount)

        addToDatabaseCart(JSON.stringify({ uid: product.uid, name: product.name, warranty_period: product.warranty_period, discount_type: product.discount_type, price: isNaN(price) !== true ? price : selling_price, featured_image: product.featured_image }), count);
        
        setBusket(newCart);
    }

    // for busket
    const handleChangeInputBusket = (id, event=null, types=null) => {
        const newInputFields = product.map((item) => {
            setChangedId(id)
            if (id === item.value) {
                item['product_uid'] = item.value
                if (types === "price") {
                    item['price'] = event.target.value
                }
                if (types === "quantity") {
                    item['quantity'] = event.target.value
                }
                if (types === "warrenty") {
                    item['warrenty'] = event.target.value ?? 0
                }
            }
            return item;
        })
        setBusketProd(newInputFields)
        
    }

    // fetch product
    const fetchProduct = useCallback(async () => {
        const product = []
        Object.keys(getDatabaseCart()).map(item => {
            const item2 = JSON.parse(item)
            product.push({
                value: item2.uid,
                label: item2.name,
                price: item2.price,
                quantity: 1,
                warrenty: parseInt(item2.warranty_period) ?? 0,
            })
            return product
        })
        setBusketProd(product)
        setProduct(product)
    }, [])




    // for deleting quantity
    const handleDeleteQuantity = (data) => {
        removeFromDatabaseCart(data)
        setQuantity(quantity - 1)
        fetchProduct()
    }

    


    useEffect(() => {
        if (queryParams) {
            let params = { ...queryParams }
            const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
            fetchData(queryString)
            setCloseFilter(true)
        }
        fetchProduct()
    }, [
        queryParams.product,
        queryParams.category,
        queryParams.brand,
        fetchData,
        fetchProduct
    ])



    return (
        <div>
            <Layout
                page="pos / point of sell"
                message={t("Product From Your Store.")}
                shorttext="All Products from your store is here"
                container="container-fluid"
            />

            <Main>
                {loading && !data.length ? <Loader /> : null}
                {!loading && error && !data.length ? <NetworkError message="Network Error." /> :
                    !loading && !data.length ? <NoContent message="No Content." /> :
                        <>
                            <Container.Fluid>
                                <Container.Row>
                                    <Container.Column className="col-xl-5 col-lg-4 md-sm-2 mb-2">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Product"
                                            isClearable={true}
                                            defaultValue={queryParams.product ? { label: queryParams.product, value: queryParams.product } : null}
                                            search={query => handleFilterProduct({ query, field: "product" })}
                                            values={event => handleFilterByUrl("product", event.label)}
                                        />
                                    </Container.Column>
                                    <Container.Column className="col-xl-3 col-lg-4 md-sm-2 mb-2">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Category"
                                            isClearable={true}
                                            defaultValue={queryParams.category ? { label: queryParams.category, value: queryParams.category } : null}
                                            search={query => handleFilterCategory({ query, field: "category" })}
                                            values={event => handleFilterByUrl("category", event.label)}
                                        />
                                    </Container.Column>
                                    <Container.Column className="col-xl-3 col-lg-4 md-sm-2 mb-2">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Brand"
                                            isClearable
                                            defaultValue={queryParams.brand ? { label: queryParams.brand, value: queryParams.brand } : null}
                                            search={query => hadleFIlterBrand({ query, field: "brand" })}
                                            values={event => handleFilterByUrl("brand", event.label)}
                                        />
                                    </Container.Column>
                                    <Container.Column className="pb-5 pt-4">
                                        {data.map((item, index) => {
                                            return <Product key={index} product={item} busketShake={handleBusketShake} handleProduct={handleBusket} />
                                        })}
                                    </Container.Column>
                                </Container.Row>
                            </Container.Fluid>
                            <Busket busket={busketShake} fetchProduct={fetchProduct} product={product} handleDeleteQuantity={handleDeleteQuantity} qnt={qnt} handleChangeInputBusket={handleChangeInputBusket} busketproduct={busketproduct} productid={changedId}/>
                        </>}
            </Main>
        </div>
    );
}

export default Pos;