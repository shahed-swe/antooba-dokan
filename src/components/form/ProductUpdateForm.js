import React, { useState, useEffect,useCallback } from 'react'
import { useHistory } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { MultiFileUploader } from '../fileUploader/MultiFileUploader'

import { PrimaryModal } from '../modal/PrimaryModal'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { BrandForm } from './BrandForm'
import { CategoryForm } from './CategoryForm'
import { SupplierForm } from './SupplierForm'
import { Toastify } from '../toastify/Toastify'
import { SingleSelect, CreatableSelect } from '../select/Index'

const Product = (props) => {

    const history = useHistory()
    const { categories, units, product } = props;
    const { t } = useTranslation()
    const { control, register, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        defaultValues: {
            supplier: product.supplier_uid,
            category: product.category_uid,
            unit: product.unit_uid,
            discount_amount: product.discount_amount,
            keywords: product.keywords,
            quantity: product.quantity,
        }
    })

    const [show_brand_modal, setShowBrandModal] = useState(false);
    const [show_category_modal, setShowCategoryModal] = useState(false);
    const [show_supplier_modal, setShowSupplierModal] = useState(false);
    const [show_subcategory_modal, setShowSubcategoryModal] = useState(false);


    const [updating, setUpdating] = useState(false)
    const [loading, setLoading] = useState(false)
    const quantity = register('quantity', { required: t("Quantity Field is Required") })

    const [productImages, setProductImages] = useState([])
    const [product_image_error, setProductImageError] = useState("")


    const [return_applicable, setReturnApplicable] = useState(product.return_applicable === 0 ? false : true)
    const [replacement_applicable, setreplacement_applicable] = useState(product.replacement_applicable === 0 ? false : true)

    const [separate_code, setSeparateCode] = useState(product.is_code_separate === 0 ? false : true)
    const [codes, setCodes] = useState([])

    if (codes.length === 0) {
        for (let i = 0; i < product.codes.length; i++) {
            codes.push(product.codes[i].code);
        }
    }

    const [discount_type, setDiscountType] = useState(product.discount_type)
    const [subcategories, setSubCategories] = useState([])

    const [warranty_type, setWarrantyType] = useState(product.warranty_type)

    const warranties = [
        { label: t("No warranty"), value: "No warranty" },
        { label: t("Days"), value: "Days" },
        { label: t("Monthly"), value: "Monthly" },
        { label: t("Lifetime"), value: "Lifetime" },
    ]

    const [deleteServerImages, setDeleteServerImages] = useState([])
    const [images_urls, setImageUrls] = useState(product.images)




    // Submit Form
    const onSubmit = async data => {

        let formData = new FormData()

        formData.append('name', data.name)
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('supplier', data.supplier)
        formData.append('category', data.category)
        formData.append('sub_category', data.sub_category)
        formData.append('brand', data.brand)
        formData.append('unit', data.unit)
        formData.append('quantity', data.quantity)
        formData.append('purchase_price', data.purchase_price)
        formData.append('selling_price', data.selling_price)
        if (warranty_type === "No warranty" || warranty_type === "Lifetime") {
            formData.append('warranty_period', 0)
            formData.append('warranty_type', warranty_type)

        } else {
            formData.append('warranty_type', warranty_type)
            formData.append('warranty_period', data.warranty_period)
        }


        if (separate_code === false) {
            formData.append('is_code_separate', 0)
            formData.append('product_code', data.product_code)
        } else {
            formData.append('is_code_separate', 1)
            for (let i = 0; i < codes.length; i++) {
                formData.append('codes[]', codes[i]);
            }
        }

        for (const file of productImages) {
            formData.append('product_images[]', file);
        }


        for (const image_uid of deleteServerImages) {
            formData.append('delete_images[]', image_uid);
        }


        formData.append('discount_type', discount_type)
        formData.append('discount_amount', data.discount_amount)

        formData.append('return_applicable', return_applicable ? 1 : 0)
        if (return_applicable) {
            formData.append('return_within_time', data.return_within_time)
        }

        formData.append('replacement_applicable', replacement_applicable ? 1 : 0)
        if (replacement_applicable) {
            formData.append('replacement_within_time', data.replacement_within_time)
        }
        formData.append('purchase_voucher_code', data.purchase_voucher_code)
        formData.append('keywords', data.keywords)
        formData.append('short_description', data.short_description)
        formData.append('long_description', data.long_description)

        formData.append("_method", "PUT")

        setUpdating(true)

        try {
            const response = await Requests.Inventory.Product.DokanProductUpdate(formData, product.uid)
            if (response.status === 200) {
                Toastify.Success(t("Product updated successfully"))
            }
            setUpdating(true)
            history.push('/dashboard/inventory/product/list')

        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 422) {
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: error.response.data.errors[key][0],
                    });
                });
                setUpdating(true)
            } else {
                Toastify.Error(t("Network Error"))
            }
            setUpdating(false)
        }
    }

    // for product image error handle
    const handleProductImages = (file) => {
        console.log(product.images.length, images_urls.length)
        let length = 0
        if(product.images.length === 2 || product.images.length === 1){
            length = 3
        }
        else{
            length = 0
        }

        const imageLength = (length !== 0 ? length : product.images.length === 0 ? 3 : product.images.length) - images_urls.length
        if (productImages.length >= imageLength) {
            setProductImageError("Maximum 3 Image Allowed");
            return;
        }

        const newImages = [...productImages]
        newImages.push(file);
        setProductImages(newImages);
    }

    // for deleting product image
    const handleLocalImageDelete = (i) => {

        const images = [...productImages]
        const newImages = images.filter((img, idx) => idx !== i)

        setProductImages(newImages);
        setProductImageError(null);
    }

    // for deleting product images coming from server
    const handleServerImageDelete = (uid) => {
        const images = [...deleteServerImages];
        images.push(uid);

        const imagesUrls = [...images_urls];
        const newImageURLs = imagesUrls.filter(image => image.uid !== uid);
        setImageUrls(newImageURLs);
        setDeleteServerImages(images);
        setProductImageError(null);
    }

    // handle quantity
    const handleQuantiyChange = (e) => {
        setValue('quantity', e.target.value, { shouldValidate: true })
        const codes = [];
        for (let i = 0; i < parseInt(e.target.value) ; i++) {
            codes.push('');
        }
        setCodes(codes);
    }

    // handleChange
    useEffect(() => {
        const codes = []
        for(let i = 0; i < parseInt(product.quantity);i++){
            if(product.product_code !== "" && product.codes.length === 0){
                codes.push('')
            }
        }
        setCodes(codes)
    },[product])

    const handleChange = (e, i) => {
        const values = [...codes]
        values[i] = e.target.value;
        setCodes(values);
    }

    // sub category list
    const fetchSubCategories = useCallback(async (data) => {


        const res = await Requests.Inventory.SubCategory.SubCategoryList(data ? data : product.category && product.category.uid ? product.category.uid : null)

        if (res.status === 200) {

            const data = []
            if (res.data.data.length > 0) {
                for (let i = 0; i < res.data.data.length; i++) {
                    data.push({
                        label: res.data.data[i].name,
                        value: res.data.data[i].uid
                    })
                    setSubCategories(data)
                }
            } else {
                setSubCategories([])
                setValue('subcategory', null);
            }

        } else {
            setSubCategories([])
            setValue('subcategory', null);
        }
    },[product, setValue])

    // handle brand create
    const handleBrandCreate = async (data) => {
        setLoading(true)
        try {
            const response = await Requests.Inventory.Brand.DokanBrandStore(data)
            if (response.status === 201) {
                props.fetchBrands()
                Toastify.Success("Brand Created Successfully")
            }
            setLoading(false)
            setShowBrandModal(false)
        } catch (error) {
            if (error.response && error.response.status === 422) {
                Toastify.Error("Brand Can't Be Created")
            } else {
                Toastify.Error("Network Error Occured")
            }
            setLoading(false)
            setShowBrandModal(false)
        }
    }

    // handle category create
    const handleCategoryCreate = async (data) => {
        setLoading(true)
        data.dokan_uid = localStorage.getItem('dokanuid')
        try {
            const response = await Requests.Inventory.Category.CategoryAdd(data)
            if (response.status === 201) {
                if (data.category_uid) {
                    Toastify.Success(t('Sub Category Created Successfully'))
                    setShowSubcategoryModal(false)
                    fetchSubCategories()
                } else {
                    Toastify.Success(t('Category Created Successfully'))
                    setShowCategoryModal(false)
                }
                props.fetchCategories()
            }
            setLoading(false)

        } catch (error) {
            if (error.response && error.response.status === 422) {
                if (data.category_uid || data.category_uid === "") {
                    Toastify.Error(t('SubCategory Can\'t Be Created'))
                    setShowSubcategoryModal(false)
                } else {
                    Toastify.Error(t('Category Can\'t Be Created'))
                }
            } else {
                Toastify.Error(t('Network Error'))
                setShowCategoryModal(false)
            }
            setLoading(false)

        }

    }


    // handle supplier create
    const handleSupplierCreate = async data => {
        setLoading(true)
        const newdata = {
            ...data,
            dokan_uid: localStorage.getItem('dokanuid')
        }
        try {
            const res = await Requests.Inventory.Supplier.DokanSupplierAdd(newdata)
            if (res.status === 201) {

                Toastify.Success(t('Supplier Created Successfully'))
            } else {

                Toastify.Error(t('Something went wrong'))
            }
            props.fetchSuppliers()
            setLoading(false)
            setShowSupplierModal(false)
        } catch (error) {
            if (error.response.status === 422) {
                Toastify.Error("Supplier Can't be created")
            } else {
                Toastify.Error("Network Error Occured.")
            }
            setLoading(false)
            setShowSupplierModal(false)

        }
    }


// fetching subs
    useEffect(() => {
        fetchSubCategories()
    },[fetchSubCategories])



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.name && errors.name.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Product Name")}<span className="text-danger fs-13 mb-1">*</span></Text>}

                            <input
                                type="text"
                                defaultValue={product.name && product.name}
                                className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter product name")}
                                {...register("name", { required: t("Name is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Supplier */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.supplier && errors.supplier.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.supplier && errors.supplier.message} <span className="text-danger">*</span></Text>
                                : <Text className="fs-13 mb-0">{t("Supplier")} <span className="text-danger">*</span> <span className="brand-add" onClick={() => setShowSupplierModal(true)}> / {t("Add Supplier")}</span></Text>}


                            <Controller
                                name="supplier"
                                control={control}
                                rules={{ required: t("Supplier is Required") }}
                                render={({ field }) => <SingleSelect
                                    error={errors.supplier}
                                    placeholder="a supplier"
                                    options={props.suppliers}
                                    deafult={product.supplier ? { label: product.supplier.name, value: product.supplier.uid } : null}
                                    value={event => setValue('supplier', event.value, { shouldValidate: true })}
                                />}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Category */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.category && errors.category.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.category && errors.category.message} <span className="brand-add" onClick={() => setShowCategoryModal(true)}> / {t("Add Category")}</span></Text>
                                : <Text className="fs-13 mb-0">{t("Category")} <span className="text-danger fs-13 mb-1">*</span><span className="brand-add" onClick={() => setShowCategoryModal(true)}> / {t("Add Category")}</span></Text>}

                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: t("Category is Required") }}
                                render={({ field }) => <SingleSelect
                                    error={errors.category}
                                    placeholder="a category"
                                    deafult={product.category ? { label: product.category.name, value: product.category.uid } : null}
                                    options={categories.map(category => ({ label: category.name, value: category.uid }))}
                                    value={event => { setValue('category', event.value, { shouldValidate: true }); fetchSubCategories(event.value) }}
                                />}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Sub Category */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Sub Category")} <span className="brand-add" onClick={() => setShowSubcategoryModal(true)}> / {t("Add SubCategory")}</span></Text>
                            <SingleSelect
                                placeholder="a subcategory"
                                options={subcategories ? subcategories : [{ label: "No Sub Category", value: null }]}
                                deafult={product.category ? { label: product.sub_category && product.sub_category.name ? product.sub_category.name: null , value: product.sub_category ? product.sub_category.uid : null } : null}
                                value={event => { setValue('sub_category', event.value, { shouldValidate: false }); }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Brand */}
                    <Container.Column>
                        <FormGroup>
                            {errors.brand && errors.brand.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.brand && errors.brand.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Brand")}<span className="brand-add" onClick={() => setShowBrandModal(true)}> / {t("Add Brand")}</span></Text>}


                            <Controller
                                name="brand"
                                control={control}
                                render={({ field }) => <SingleSelect
                                    error={errors.brand}
                                    placeholder="a brand"
                                    options={props.brands}
                                    deafult={product.brand ? { label: product.brand.name, value: product.brand.uid } : null}
                                    value={event => setValue('brand', event.value, { shouldValidate: true })}
                                />}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Quantity */}
                    <Container.Column className="col-lg-3">
                        <FormGroup>
                            {errors.quantity && errors.quantity.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.quantity && errors.quantity.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Quantity")} <span className="text-danger fs-13 mb-1">*</span></Text>}

                            <input
                                type="number"
                                min="0"
                                className={errors.quantity ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter number of product")}
                                onChange={handleQuantiyChange}
                                ref={quantity.ref}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Unit */}
                    <Container.Column className="col-lg-3">
                        <FormGroup>
                            {errors.unit && errors.unit.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.unit && errors.unit.message}</Text>
                                : <Text className="fs-13 mb-0">{t('Unit')} <span className="text-danger fs-13 mb-1">*</span></Text>}

                            <Controller
                                name="unit"
                                control={control}
                                rules={{ required: "Unit is Required" }}
                                render={({ field }) => <SingleSelect
                                    error={errors.unit}
                                    placeholder="a unit"
                                    options={units}
                                    deafult={product.unit ? { label: product.unit.title, value: product.unit.uid } : null}
                                    value={event => setValue('unit', event.value, { shouldValidate: true })}
                                />}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Purchase Price */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.purchase_price && errors.purchase_price.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.purchase_price && errors.purchase_price.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Purchase price")} <span className="text-danger fs-13 mb-1">*</span></Text>}

                            <input
                                type="number"
                                min="0"
                                step=".01"
                                className={errors.purchase_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Purchase price")}
                                defaultValue={product.purchase_price}
                                {...register("purchase_price", { required: t("Purchase price is required") })}
                            />
                        </FormGroup>
                    </Container.Column>





                    {/* Selling price and product code */}
                    <Container.Column className="col-lg-6">
                        {/* selling price */}
                        <FormGroup>
                            {errors.selling_price && errors.selling_price.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.selling_price && errors.selling_price.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Selling price")} <span className="text-danger">*</span></Text>}

                            <input
                                type="number"
                                min="0"
                                step=".01"
                                className={errors.selling_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Selling Price")}
                                defaultValue={product.selling_price}
                                {...register("selling_price", { required: t("Selling price is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* seperate product code */}
                    {separate_code ?
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Product Code")}</Text>

                                <input
                                    type="text"
                                    className={errors.product_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter product code")}
                                    defaultValue={product.product_code}
                                    disabled
                                />

                            </FormGroup>
                        </Container.Column> : <Container.Column className="col-lg-6">
                            {/* product code */}
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Product Code")}</Text>

                                <input
                                    type="text"
                                    className={errors.product_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter product code")}
                                    defaultValue={product.product_code}
                                    {...register("product_code")} />

                            </FormGroup>
                        </Container.Column>}


                    {/* Warrenty Type and Warrenty Time*/}
                    {warranty_type === "Days" || warranty_type === "Monthly" ? 
                    <Container.Column className="col-lg-6">
                        {/* Warrenty Typed */}
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Warranty Type")}</Text>
                            <SingleSelect
                                placeholder="warranty type"
                                options={warranties ? warranties : null}
                                deafult={product.warranty_type !== "null" ? { label: product.warranty_type, value: product.warranty_type } : { label: warranties[0].label, value: warranties[0].value }}
                                value={event => setWarrantyType(event.value)}
                            />
                        </FormGroup>
                        </Container.Column> : <Container.Column className="col-lg-12">
                            {/* Warrenty Typed */}
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Warranty Type")}</Text>
                                <SingleSelect
                                    placeholder="warranty type"
                                    options={warranties ? warranties : null}
                                    deafult={product.warranty_type !== "null" ? { label: product.warranty_type, value: product.warranty_type } : { label: warranties[0].label, value: warranties[0].value }}
                                    value={event => setWarrantyType(event.value)}
                                />
                            </FormGroup>
                        </Container.Column>}

                    {
                        (warranty_type === "Days" || warranty_type === "Monthly") &&
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                {
                                    errors.warranty_period && errors.warranty_period.message ?
                                        <Text className="text-danger fs-13 mb-1">{errors.warranty_period && errors.warranty_period.message}</Text>
                                        : <Text className="fs-13 mb-0">{t("Warranty Period")} <span className="text-danger fs-13 mb-1">*</span></Text>
                                }
                                <input
                                    type="text"
                                    className={errors.warranty_period ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Warranty Period")}
                                    defaultValue={product.warranty_period !== "undefined" ? product.warranty_period : ""}
                                    {...register("warranty_period", { required: t("Warranty Period is Required") })}
                                />
                            </FormGroup>
                        </Container.Column>
                    }

                    {/* Discount */}
                    <Container.Column className="col-lg-9">

                        <FormGroup>
                            {errors.discount_amount && errors.discount_amount.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.discount_amount && errors.discount_amount.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Discount")}</Text>}
                            <input
                                type="number"
                                min="0"
                                step=".01"
                                className={errors.discount_amount ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Discount")}
                                defaultValue={product.discount_amount}
                                {...register("discount_amount")}
                            />

                        </FormGroup>
                    </Container.Column>

                    {/* Discount type */}
                    <Container.Column className="col-xl-3 col-lg-3">
                        <Text className="fs-13 mb-0">{t("Discount Type")}</Text>
                        <SingleSelect
                            placeholder="discount type"
                            options={props.discount}
                            deafult={{ label: product.discount_type, value: product.discount_type }}
                            value={event => setDiscountType(event.value)}
                        />
                    </Container.Column>


                    {/* keywords */}
                    <Container.Column>
                        <FormGroup>
                            {errors.keywords && errors.keywords.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.keywords && errors.keywords.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Keywords")}</Text>}
                            <CreatableSelect
                                placeholder={t("Keywords")}
                                value={event => {
                                    const val = []
                                    event.map(item => {
                                        val.push(item.value)
                                        return val
                                    })
                                    setValue('keywords', val)
                                }}
                                deafult={product.keywords && product.keywords !== "null" ? product.keywords.split(",").map(item => {
                                    return { label: item, value: item }
                                }) : null}
                            />
                        </FormGroup>
                    </Container.Column>


                    {/* short description */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.short_description && errors.short_description.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.short_description && errors.short_description.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Short Description")} </Text>}
                            <textarea
                                rows="3"
                                className={errors.short_description ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Short Description")}
                                defaultValue={product.short_description}
                                {...register("short_description")}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* long description */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.long_description && errors.long_description.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.long_description && errors.long_description.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Long Description")}</Text>}
                            <textarea
                                rows="3"
                                className={errors.long_description ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Long Description")}
                                defaultValue={product.long_description}
                                {...register("long_description")}
                            />
                        </FormGroup>
                    </Container.Column>

                    <Container.Fluid className="col-xl-6">
                        <Container.Row>
                            {/* return applicable */}
                            <Container.Column>
                                <FormGroup>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={return_applicable ? true : false}
                                            onChange={() => { setReturnApplicable(!return_applicable) }}
                                            style={{ cursor: 'pointer' }} id="flexCheckDefault1"
                                        />
                                        <label className="form-check-label " htmlFor="flexCheckDefault1" style={{ cursor: 'pointer' }}>
                                            {t("Return Applicable Within")}
                                        </label>
                                    </div>
                                </FormGroup>
                            </Container.Column>

                            {/* return applicable auto generated field */}

                            <Container.Column>
                                {
                                    return_applicable &&
                                    <div>
                                        <FormGroup>
                                            {errors.return_within_time && errors.return_within_time.message ?
                                                <Text className="text-danger fs-13 mb-1">{errors.return_within_time && errors.return_within_time.message}</Text>
                                                : <Text className="fs-13 mb-0">{t("Return Within Time")} <span className="text-danger fs-13 mb-1">*</span></Text>}
                                            {/* <Text>Return Time</Text> */}
                                            <div className="input-group mb-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className={errors.return_within_time ? "form-control shadow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Return Applicable Time")}
                                                    defaultValue={product.return_within_time}
                                                    {...register("return_within_time", { required: "Return Within Time is Required" })}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text" id="basic-addon2">Days</span>
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                }
                            </Container.Column>
                        </Container.Row>
                    </Container.Fluid>


                    {/* replacement applicable */}
                    <Container.Fluid className="col-xl-6">
                        <Container.Row>


                            <Container.Column>
                                <FormGroup>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={replacement_applicable ? true : false}
                                            onChange={() => { setreplacement_applicable(!replacement_applicable) }}
                                            style={{ cursor: 'pointer' }} id="flexCheckDefault2"
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckDefault2" style={{ cursor: 'pointer' }}>
                                            {t("Replacement Applicable Within")}
                                        </label>
                                    </div>
                                </FormGroup>
                            </Container.Column>

                            {/* replacement applicable auto generated field */}
                            <Container.Column>
                                {
                                    replacement_applicable &&
                                    <div>
                                        <FormGroup>
                                            {errors.replacement_within_time && errors.replacement_within_time.message ?
                                                <Text className="text-danger fs-13 mb-1">{errors.replacement_within_time && errors.replacement_within_time.message}</Text>
                                                : <Text className="fs-13 mb-0">{t("Replacement Within Time")} <span className="text-danger">*</span></Text>}

                                            <div className="input-group mb-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className={errors.replacement_within_time ? "form-control shadhandleChangeBarCodeow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Replacement Time")}
                                                    defaultValue={product.replacement_within_time}
                                                    {...register("replacement_within_time", { required: t("Replacement Within Time is Required") })}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text" id="basic-addon2">Days</span>
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                }
                            </Container.Column>
                        </Container.Row>
                    </Container.Fluid>


                    {/* separate code / imei */}
                    <Container.Column>
                        <FormGroup>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={separate_code ? true : false}
                                    onChange={() => { setSeparateCode(!separate_code) }}
                                    style={{ cursor: 'pointer' }} id="flexCheckDefault3"
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault3" style={{ cursor: 'pointer' }}>
                                    {t("Need Separate Code / IMEI")}
                                </label>
                            </div>
                        </FormGroup>
                    </Container.Column>


                    {/* separate code */}
                    {
                        separate_code && codes.map((code, i) => <Container.Column key={i}>
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Code")} {i + 1}</Text>

                                <input
                                    type="text"
                                    className={errors.code ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Code")}
                                    value={code}
                                    onChange={(e) => handleChange(e, i)}
                                />
                            </FormGroup>
                        </Container.Column>)
                    }


                    {/* All Images */}
                    <Container.Column>
                        <div className="d-lg-flex">
                            {/* Product Image */}
                            <MultiFileUploader
                                imageURLS={images_urls}
                                error={product_image_error}
                                images={productImages}
                                width={150}
                                height={150}
                                limit={100}
                                title={t("Image / Logo")}
                                dataHandeller={handleProductImages}
                                handleLocalImageDelete={handleLocalImageDelete}
                                handleServerImageDelete={handleServerImageDelete}
                            />
                        </div>
                    </Container.Column>

                    <div className="col-12 text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={updating}
                        >
                            <span>{updating ? t("Updating ...") : t("Update")}</span>
                        </PrimaryButton>
                    </div>
                </Container.Row>
            </form>

            {/* Create Brand Modal */}
            <PrimaryModal
                show={show_brand_modal}
                onHide={() => setShowBrandModal(false)}
                title="Create Brand"
                size="md"
            >
                <BrandForm
                    submit={handleBrandCreate}
                    loading={loading}
                    create={true}
                />
            </PrimaryModal>



            {/* Create Supplier modal */}
            <PrimaryModal
                show={show_supplier_modal}
                onHide={() => setShowSupplierModal(false)}
                title="Create Supplier"
                size="xl"
            >
                <SupplierForm
                    submit={handleSupplierCreate}
                    loading={loading}
                    create={true}
                />
            </PrimaryModal>


            {/* Create Category Modal */}
            <PrimaryModal
                show={show_category_modal}
                onHide={() => setShowCategoryModal(false)}
                title="Create Category"
                size="md"
            >
                <CategoryForm
                    submit={handleCategoryCreate}
                    loading={loading}
                    create={true}
                    categories={categories}
                    onlyCategory={true}
                />
            </PrimaryModal>

            {/* Create SubCategory Modal */}
            <PrimaryModal
                show={show_subcategory_modal}
                onHide={() => setShowSubcategoryModal(false)}
                title="Create Sub Category"
                size="md"
            >
                <CategoryForm
                    submit={handleCategoryCreate}
                    loading={loading}
                    create={true}
                    categories={categories}
                    onlyCategory={false}
                    subcat={true}
                />
            </PrimaryModal>

        </>
    );

}

export default Product;