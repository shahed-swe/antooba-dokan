import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import { FileUploader } from '../fileUploader/Index'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { MultiFileUploader } from '../fileUploader/MultiFileUploader'
import { PrimaryModal } from '../modal/PrimaryModal'
import { Container } from '../container/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'
import { useHistory } from 'react-router'
import { BrandForm } from './BrandForm'
import { CategoryForm } from './CategoryForm'
import { SupplierForm } from './SupplierForm'
import { Toastify } from '../toastify/Toastify'
import { SingleSelect, CreatableSelect } from '../select/Index'


const Product = (props) => {
    const { categories } = props
    const history = useHistory()
    const { t } = useTranslation()
    const { control, register, handleSubmit, setError, setValue, getValues,clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            brand: '',
            warranty_period: ''
        }
    })

    console.log(getValues('discount_amount'))

    const [show_brand_modal, setShowBrandModal] = useState(false);
    const [show_category_modal, setShowCategoryModal] = useState(false);
    const [show_subcategory_modal, setShowSubcategoryModal] = useState(false);
    const [show_supplier_modal, setShowSupplierModal] = useState(false);
    const [loading, setLoading] = useState(false)

    // const [quantity, setQuantity] = useState(0)
    const quantity = register('quantity', { required: t("Quantity Field is Required") })
    const [productImages, setProductImages] = useState([])
    const [product_image_error, setProductImageError] = useState("")
    const [lastpurchaseImage, setLastPurchaseImage] = useState({})
    const [return_applicable, setReturnApplicable] = useState(false)
    const [replacement_applicable, setreplacement_applicable] = useState(false)
    const [warranty_type, setWarrantyType] = useState('')
    const [separate_code, setSeparateCode] = useState(false)
    const [codes, setCodes] = useState([])
    const [discount_type, setDiscountType] = useState('taka')
    const [subcategories, setSubCategories] = useState([])

    const warranties = [
        { label: t("No warranty"), value: "No warranty" },
        { label: t("Days"), value: "Days" },
        { label: t("Monthly"), value: "Monthly" },
        { label: t("Lifetime"), value: "Lifetime" },
    ]

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
        formData.append('warranty_type', warranty_type)
        if (warranty_type === "No warranty" || warranty_type === "Lifetime") {
            formData.append('warranty_period', 0)
            formData.append('warranty_type', warranty_type)

        } else {
            formData.append('warranty_type', warranty_type ?? "")
            formData.append('warranty_period', data.warranty_period ?? 0)
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

        formData.append('keywords', data.keywords ?? "")
        formData.append('short_description', data.short_description)
        formData.append('long_description', data.long_description)
        formData.append('purchase_voucher_code_image', lastpurchaseImage.value)

        // console.log(...formData)
        setLoading(true)
        try {
            const response = await Requests.Inventory.Product.DokanProductAdd(formData)
            if (response.status === 201) {
                Toastify.Success(t("Product Added Successfully"))
                history.push('/dashboard/inventory/product/list')
            }
            setLoading(false)
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 422) {
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: error.response.data.errors[key][0],
                    });
                });
            } else {
                Toastify.Error(t("Network Error"))
            }
            setLoading(false)
        }
    }

    const handleProductImages = (file) => {
        if (productImages.length >= 3) {
            setProductImageError("Maximum 3 Image Allowed");
            return;
        }
        const newImages = [...productImages]
        newImages.push(file);
        setProductImages(newImages);
    }

    const handleLocalImageDelete = (i) => {


        const images = [...productImages]
        const newImages = images.filter((img, idx) => idx !== i)

        setProductImages(newImages);
        setProductImageError("")
    }

    // handle quantity
    const handleQuantiyChange = (e) => {
        setValue('quantity', e.target.value, { shouldValidate: true })
        const codes = [];
        for (let i = 0; i < parseInt(e.target.value); i++) {
            codes.push('');
        }
        setCodes(codes);
    }


    const handleChange = (e, i) => {
        const values = [...codes]
        values[i] = e.target.value;
        setCodes(values);
    }

    // sub category list
    const fetchSubCategories = async (data) => {
        const res = await Requests.Inventory.SubCategory.SubCategoryList(data)

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
    }


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
                    setShowSubcategoryModal(true)
                } else {
                    Toastify.Error(t('Category Can\'t Be Created'))
                    setShowCategoryModal(false)
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


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.name && errors.name.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.name && errors.name.message}</Text>
                                : <Text className="fs-13 mb-0">{t("Product Name")} <span className="text-danger">*</span></Text>}

                            <input
                                type="text"
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
                                <Text className="text-danger fs-13 mb-1">{errors.supplier && errors.supplier.message} <span className="brand-add" onClick={() => setShowSupplierModal(true)}> / {t("Add Supplier")}</span></Text>
                                : <Text className="fs-13 mb-0">{t("Supplier")} <span className="text-danger">*</span> <span className="brand-add" onClick={() => setShowSupplierModal(true)}> / {t("Add Supplier")}</span></Text>}

                            <Controller
                                name="supplier"
                                control={control}
                                rules={{ required: t("Supplier is Required") }}
                                render={({ field }) => <SingleSelect
                                    error={errors.supplier}
                                    placeholder="a supplier"
                                    options={props.suppliers}
                                    value={event => setValue('supplier', event.value, { shouldValidate: true })}
                                />}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Category */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.category && errors.category.message ?
                                <Text className="text-danger fs-13 mb-1">{errors.category && errors.category.message} <span className="text-danger ">*</span> <span className="brand-add" onClick={() => setShowCategoryModal(true)}> / {t("Add Category")}</span></Text>
                                : <Text className="fs-13 mb-0">{t("Category")} <span className="text-danger ">*</span><span className="brand-add" onClick={() => setShowCategoryModal(true)}> / {t("Add Category")}</span></Text>}

                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: t("Category is Required") }}
                                render={({ field }) => <SingleSelect
                                    error={errors.category}
                                    placeholder="a category"
                                    options={categories && categories.map(category => ({ label: category.name, value: category.uid }))}
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
                                value={event => { setValue('sub_category', event.value, { shouldValidate: false }); }}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Brand */}
                    <Container.Column>
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Brand")}<span className="brand-add" onClick={() => setShowBrandModal(true)}> / {t("Add Brand")}</span></Text>

                            <Controller
                                name="brand"
                                control={control}
                                render={({ field }) => <SingleSelect
                                    error={errors.category}
                                    placeholder="a brand"
                                    options={props.brands}
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
                                : <Text className="fs-13 mb-0">{t("Quantity")} <span className="text-danger">*</span></Text>}

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
                                : <Text className="fs-13 mb-0">{t('Unit')} <span className="text-danger">*</span></Text>}

                            <Controller
                                name="unit"
                                control={control}
                                rules={{ required: "Unit is Required" }}
                                render={({ field }) => <SingleSelect
                                    error={errors.unit}
                                    placeholder="a unit"
                                    options={props.units}
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
                                : <Text className="fs-13 mb-0">{t("Purchase price")} <span className="text-danger">*</span></Text>}

                            <input
                                type="number"
                                min="0"
                                step=".01"
                                className={errors.purchase_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Purchase price")}
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
                                {...register("selling_price", { required: t("Selling price is required") })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* seperate product code */}
                    {separate_code === true ?
                        <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Product Code")}</Text>

                                <input
                                    type="text"
                                    className={errors.product_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter product code")}
                                    disabled
                                />

                            </FormGroup>
                        </Container.Column> : <Container.Column className="col-lg-6">
                            <FormGroup>
                                <Text className="fs-13 mb-0">{t("Product Code")}</Text>

                                <input
                                    type="text"
                                    className={errors.product_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter product code")}
                                    {...register("product_code")} />

                            </FormGroup>
                        </Container.Column>}

                    {/* Last purchase boucher code */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Purchase Voucher code")}</Text>
                            <input
                                type="text"
                                className={errors.purchase_voucher_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                placeholder={t("Enter voucher code")}
                                {...register("purchase_voucher_code")}
                            />
                        </FormGroup>
                    </Container.Column>





                    {/* Warrenty Type and Warrenty Time*/}
                    <Container.Column className="col-lg-6">
                        {/* Warrenty Typed */}
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Warranty Type")}</Text>
                            <SingleSelect
                                placeholder="warranty type"
                                options={warranties ? warranties : null}
                                deafult={warranty_type}
                                value={event => setWarrantyType(event.value)}
                            />
                        </FormGroup>
                    </Container.Column>

                    {
                        (warranty_type === "Days" || warranty_type === "Monthly") &&
                        <Container.Column>
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
                                {...register("discount_amount")}
                            />

                        </FormGroup>
                    </Container.Column>

                    {/* Discount Type */}
                    <Container.Column className="col-xl-3 col-lg-3">
                        <FormGroup>
                            <Text className="fs-13 mb-0">{t("Discount Type")} {getValues('discount_amount') ? <span className="text-danger">*</span> : null}</Text>
                            <SingleSelect
                                placeholder="discount type"
                                options={props.discount}
                                value={event => setDiscountType(event.value)}
                            />
                        </FormGroup>
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
                                            <div class="input-group mb-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className={errors.return_within_time ? "form-control shadow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Return Applicable Time")}
                                                    {...register("return_within_time", { required: "Return Within Time is Required" })}
                                                />
                                                <div class="input-group-append">
                                                    <span class="input-group-text" id="basic-addon2">Days</span>
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
                                                : <Text className="fs-13 mb-0">{t("Replacement Within Time")} <span className="text-danger fs-13 mb-1">*</span></Text>}


                                            <div className="input-group mb-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className={errors.replacement_within_time ? "form-control shadhandleChangeBarCodeow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Replacement Time")}
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
                            {/* Product Image with multifile uploader */}
                            <MultiFileUploader
                                error={product_image_error}
                                images={productImages}
                                width={150}
                                height={150}
                                limit={100}
                                title={t("Image / Logo")}
                                dataHandeller={handleProductImages}
                                handleLocalImageDelete={handleLocalImageDelete}
                            />


                            {/* Image */}
                            <FileUploader
                                error={errors.image ? errors.image.message : ""}
                                width={150}
                                height={150}
                                limit={100}
                                title={t("Last Purchase Image")}
                                dataHandeller={(data) => {
                                    if (data.error) {
                                        setError("image", {
                                            type: "manual",
                                            message: data.error
                                        })
                                    }

                                    if (data.image) {
                                        clearErrors("image")
                                        setLastPurchaseImage({ ...lastpurchaseImage, value: data.image || null, error: data.error || null })
                                    }
                                }
                                }
                            />
                        </div>
                    </Container.Column>

                    <Container.Column className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={loading}
                        >
                            <span>{loading ? t("Creating ...") : t("Create")}</span>
                        </PrimaryButton>
                    </Container.Column>
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