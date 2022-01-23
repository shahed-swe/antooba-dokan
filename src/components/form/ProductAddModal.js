import React, { useState} from 'react'
import {  useForm, Controller } from 'react-hook-form'
import { PrimaryButton } from '../button/Index'
import SingleSelect from '../select/Single'
import { FileUploader } from '../fileUploader/Index'
import { useTranslation } from 'react-i18next'
import Toast from '../Toaster/Index'
import './style.scss'
import { Requests } from '../../utils/Http/Index'
import { Modal } from 'react-bootstrap'
import { MultiFileUploader } from '../fileUploader/MultiFileUploader'
import { GrayButton } from '../button/Index'
import { X } from 'react-feather'


const ProductModal = (props) => {

    const { categories, single } = props;
    const {t} = useTranslation()
    const { control, register, handleSubmit, setError, setValue, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            brand: '',
            warranty_period: ''
        }
    })



    const [loading, setLoading] = useState(false)

    // const [quantity, setQuantity] = useState(0)
    const quantity = register('quantity', { required: t("Quantity Field is Required")})
    
    const [productImages, setProductImages] = useState([])
    const [product_image_error,setProductImageError] = useState("")

    const [lastpurchaseImage, setLastPurchaseImage] = useState({})
    
    const [return_applicable, setReturnApplicable] = useState(false)
    const [replacement_applicable, setreplacement_applicable] = useState(false)
    
    const [separate_code, setSeparateCode] = useState(false)
    const [codes, setCodes] = useState([])
    const [discount_type, setDiscountType] = useState('taka')
    const [subcategories, setSubCategories] = useState([])
    
    const [warranty_type, setWarrantyType] = useState('')

    const warranties = [
        { label: t("No warranty"), value: "No warranty" },
        { label: t("Days"), value: "Days" },
        { label: t("Monthly"), value: "Monthly" },
        { label: t("Lifetime"), value: "Lifetime" },
    ]

    // Submit Form
    const onSubmit = async data => {
        clearErrors()
        let formData = new FormData()
        formData.append('name', data.name)
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('supplier', data.supplier)
        formData.append('category', data.category)
        formData.append('sub_category', data.subcategory)
        formData.append('brand', data.brand)
        formData.append('unit', data.unit)
        formData.append('quantity', data.quantity)
        formData.append('purchase_price', data.purchase_price)
        formData.append('selling_price', data.selling_price)
        formData.append('warranty_type', warranty_type)
        formData.append('warranty_period', data.warranty_period)
        
        if(separate_code === false){
            formData.append('is_code_separate', 0)
            formData.append('product_code', data.product_code)
        }else{
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
        if (return_applicable){
            formData.append('return_within_time', data.return_within_time)
        }

        formData.append('replacement_applicable', replacement_applicable ? 1 : 0)
        if(replacement_applicable){
            formData.append('replacement_within_time', data.replacement_within_time)
        }

        formData.append('keywords', data.keywords)
        formData.append('short_description', data.short_description)
        formData.append('long_description', data.long_description)
        formData.append('purchase_voucher_code',data.purchase_voucher_code)
        formData.append('purchase_voucher_code_image', lastpurchaseImage.value)

        setLoading(true)
        const res = await Requests.Inventory.Product.DokanProductAdd(formData)
        if (res.status === 201) {
            Toast.fire({
                icon: 'success',
                title: 'Product Added Successfully'
            })
            setLoading(false)
            props.onHide(true)
            setValue('name','')
            setValue('quantity','')
            setValue('purchase_price','')
            setValue('selling_price','')
            setValue('warranty_period','')
            setValue('product_code','')
            setValue('keywords','')
            setValue('short_description','')
            setValue('long_description','')
            setValue('purchase_voucher_code','')
            setValue('discount_amount','')
            setValue('return_within_time','')
            setValue('replacement_within_time','')
            setValue('supplier', {})
            setValue('category', {})
            setValue('subcategory', {})
            setValue('brand', {})
            setValue('unit', {})
            setValue('discount_type', {})
            setValue('warranty_type', {})
        } else {
            setLoading(false)
            if(res.status === 422){
                Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
                });
            }
        }
    }

    const handleProductImages = (file) => {

        if(productImages.length >= 3){
            setProductImageError("Maximum 3 Image Allowed");
            return;
        }

        const newImages = [...productImages]
        newImages.push(file);
        setProductImages(newImages);
    }

    // handle quantity
    const handleQuantiyChange =  (e) => {
        setValue('quantity', e.target.value, { shouldValidate: true })
        const codes = [];
        for(let i = 0; i < parseInt(e.target.value); i++){
            codes.push('');
        }
        setCodes(codes);
    }


    const handleChange = (e, i) => {
        const values= [...codes]
        values[i] = e.target.value;
        setCodes(values);
    }

    // sub category list
    const fetchSubCategories = async (data) => {


        const res = await Requests.Inventory.SubCategory.SubCategoryList(data)
        
        if(res.status === 200){
            
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
            
        }else{
            setSubCategories([])
            setValue('subcategory', null);
        }
    }


    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="xl"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">Create new product</h6></div>
                    <div className="ml-auto">
                        <GrayButton
                            type="button"
                            onClick={props.onHide}
                            style={{ padding: "7px 10px", borderRadius: "50%" }}
                        ><X size={16} /></GrayButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <>
                <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">

                            {/* Name */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    {errors.name && errors.name.message ?
                                        <small className="text-danger">{errors.name && errors.name.message}</small>
                                        : <small>{t("Product Name")} <span className="text-danger">*</span></small>}

                                    <input
                                        type="text"
                                        className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Enter product name")}
                                        {...register("name", { required: t("Name is required")})}
                                    />
                                </div>
                            </div>

                            {/* Supplier */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                        {errors.supplier && errors.supplier.message ?
                                            <small className="text-danger">{errors.supplier && errors.supplier.message}</small>
                                            : <small>{t("Supplier")} <span className="text-danger">*</span> </small>}
                                    

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
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                        {errors.category && errors.category.message ?
                                            <small className="text-danger">{errors.category && errors.category.message}</small>
                                        : <small>{t("Category")} <span className="text-danger">*</span></small>}

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
                                </div>
                            </div>

                            {/* Sub Category */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                        <small>{t("Sub Category")}</small>
                                        <SingleSelect
                                            placeholder="a subcategory"
                                            options={subcategories ? subcategories : [{ label: "No Sub Category", value: null }]}
                                            value={event => { setValue('subcategory', event.value, { shouldValidate: false }); }}
                                        />
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-4">
                                        <small>{t("Brand")}</small>

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
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="col-12 col-lg-4">
                                <div className="form-group mb-4">
                                    {errors.quantity && errors.quantity.message ?
                                        <small className="text-danger">{errors.quantity && errors.quantity.message}</small>
                                    : <small>{t("Quantity")} <span className="text-danger">*</span></small>}
                                
                                    <input
                                        type="number"
                                        className={errors.quantity ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Enter number of product")}
                                        onChange={handleQuantiyChange}
                                        ref={quantity.ref}
                                    />
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="col-12 col-lg-2">
                                <div className="form-group mb-4">
                                        {errors.unit && errors.unit.message ?
                                            <small className="text-danger">{errors.unit && errors.unit.message}</small>
                                            : <small>{t('Unit')} <span className="text-danger">*</span></small>}

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
                                </div>
                            </div>
                            
                            {/* Purchase Price */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    {errors.purchase_price && errors.purchase_price.message ?
                                        <small className="text-danger">{errors.purchase_price && errors.purchase_price.message}</small>
                                        : <small>{t("Purchase price")} <span className="text-danger">*</span></small>}

                                    <input
                                        type="text"
                                        className={errors.purchase_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Purchase price")}
                                        {...register("purchase_price", { required: t("Purchase price is required") })}
                                    />
                                </div>
                            </div>

                            {/* Image */}
                            <div className="col-12 col-lg-8">

                                    <MultiFileUploader
                                        error={product_image_error}
                                        images={productImages}
                                        width={150}
                                        height={150}
                                        limit={100}
                                        title={t("Image / Logo")}
                                        dataHandeller={handleProductImages}
                                    />

                            </div>



                            {/* Selling price and product code */}
                            <div className="col-12 col-lg-4">
                                {/* selling price */}
                                <div className="form-group mb-4">
                                        <small>{t("Selling Price")} </small>

                                    <input
                                        type="text"
                                        className={errors.selling_price ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Selling Price")}
                                        {...register("selling_price")}
                                    />
                                </div>
                                
                                {/* product code */}
                                {single === true ? 
                                <>
                                    <div className="form-group mb-4">
                                        <small>{t("Product Code")}</small>
                                        
                                        <input
                                            type="text"
                                            className={errors.product_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Enter product code")}
                                            {...register("product_code")}/>
                                        
                                    </div>
                                    
                                </>
                                : <div className="form-group mb-4">
                                        <small>{t("Purchase Voucher code")}</small>
                                        <input
                                            type="text"
                                            className={errors.purchase_voucher_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Enter voucher code")}
                                            {...register("purchase_voucher_code")}
                                        />
                                    </div>}
                            </div>


                            {/* Last purchase boucher code */}
                            {single === false ? null : 
                            
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-4">
                                    <small>{t("Purchase Voucher code")}</small>
                                    <input
                                        type="text"
                                        className={errors.purchase_voucher_code ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Enter voucher code")}
                                        {...register("purchase_voucher_code")}
                                    />
                                </div>
                            </div>}
                            
                            {/* Last Purchase Image */}
                            <div className="col-12 col-lg-4">
                                <FileUploader
                                    width={150}
                                    height={150}
                                    limit={100}
                                    title={t("Last Purchase Image")}
                                    dataHandeller={(data) => setLastPurchaseImage({ ...lastpurchaseImage, value: data.image || null, error: data.error || null })}
                                />
                            </div>

                            

                            {/* Warrenty Type and Warrenty Time*/}
                            <div className="col-12 col-lg-8">
                                {/* Warrenty Typed */}
                                <div className="form-group mb-4">
                                        <small>{t("Warranty Type")}</small>
                                        <SingleSelect
                                            placeholder="warranty type"
                                            options={warranties ? warranties : null}
                                            default={warranty_type}
                                            value={event => setWarrantyType(event.value)}
                                        />
                                </div>

                                {
                                    (warranty_type === "Days" || warranty_type === "Monthly") &&
                                    
                                    <div className="form-group mb-8">
                                        {
                                            errors.warranty_period && errors.warranty_period.message ?
                                                <small className="text-danger">{errors.warranty_period && errors.warranty_period.message}</small>
                                                : <small>{t("Warranty Period")} <span className="text-danger">*</span></small>
                                        }
                                        <input
                                            type="text"
                                            className={errors.warranty_period ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Warranty Period")}
                                            {...register("warranty_period", {required: t("Warranty Period is Required")})}
                                        />
                                    </div>
                                }
                                
                            </div>

                            {/* Discount */}
                            <div className="col-12 col-lg-10 col-md-10 col-sm-10">
                                
                                <div className="form-group mb-3">
                                        {errors.discount_amount && errors.discount_amount.message ?
                                            <small className="text-danger">{errors.discount_amount && errors.discount_amount.message}</small>
                                        : <small>{t("Discount")}</small>}
                                    <input
                                        type="text"
                                        className={errors.discount_amount ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Discount")}
                                        {...register("discount_amount")}
                                    />
                                    
                                </div>
                            </div>

                            
                            <div className="col-12 col-lg-2 col-md-2 col-sm-2">
                                <small>{t("Discount Type")}</small>
                                <SingleSelect
                                    placeholder="discount type"
                                    options={props.discount}
                                    value={event => setDiscountType(event.value)}
                                />
                            </div>
                            

                            {/* keywords */}
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-8">
                                        {errors.keywords && errors.keywords.message ?
                                            <small className="text-danger">{errors.keywords && errors.keywords.message}</small>
                                            : <small>{t("Keywords")}</small>}
                                    <input
                                        type="text"
                                        className={errors.keywords ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Keywords")}
                                            {...register("keywords")}
                                    />
                                </div>
                            </div>


                            {/* short description */}
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-8">
                                        {errors.short_description && errors.short_description.message ?
                                            <small className="text-danger">{errors.short_description && errors.short_description.message}</small>
                                            : <small>{t("Short Description")} </small>}
                                    <textarea
                                        rows="3"
                                        className={errors.short_description ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Short Description")}
                                            {...register("short_description")}
                                    />
                                </div>
                            </div>

                            {/* long description */}
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-8">
                                        {errors.long_description && errors.long_description.message ?
                                            <small className="text-danger">{errors.long_description && errors.long_description.message}</small>
                                            : <small>{t("Long Description")}</small>}
                                    <textarea
                                        rows="4"
                                            className={errors.long_description ? "form-control shadow-none error" : "form-control shadow-none"}
                                        placeholder={t("Long Description")}
                                            {...register("long_description")}
                                    />
                                </div>
                            </div>

                            {/* return applicable */}
                            <div className="col-12 col-lg-2 return-applicable">
                                <div className="form-group mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={return_applicable ? true : false}
                                            onChange={() => { setReturnApplicable(!return_applicable)}}
                                            style={{cursor: 'pointer'}} id="flexCheckDefault1"
                                        />
                                        <label className="form-check-label " htmlFor="flexCheckDefault1" style={{cursor: 'pointer'}}>
                                            {t("Return Applicable Within")}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* return applicable auto generated field */}
                            
                                <div className="col-12 col-lg-4">
                                    {
                                        return_applicable &&
                                        <div>
                                            <div className="form-group mb-8">
                                                {errors.return_within_time && errors.return_within_time.message ?
                                                    <small className="text-danger">{errors.return_within_time && errors.return_within_time.message}</small>
                                                    : <small>{t("Return Within Time")} <span className="text-danger">*</span></small>}
                                                {/* <small>Return Time</small> */}
                                                <input
                                                    type="text"
                                                    className={errors.return_within_time ? "form-control shadow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Return Applicable Time")}
                                                    {...register("return_within_time", {required: "Return Within Time is Required"})}
                                                />
                                            </div>
                                            <span className="another-day">{t("Days")}</span>
                                        </div>
                                    }
                                </div>


                            {/* replacement applicable */}
                            <div className="col-12 col-lg-2 return-applicable">
                                <div className="form-group mb-4">
                                    
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={replacement_applicable ? true : false}
                                            onChange={()=>{setreplacement_applicable(!replacement_applicable)}}
                                            style={{cursor: 'pointer'}} id="flexCheckDefault2"
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckDefault2" style={{cursor: 'pointer'}}>
                                            {t("Replacement Applicable Within")}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* replacement applicable auto generated field */}
                            <div className="col-12 col-lg-4">
                                {
                                    replacement_applicable && 
                                        <div>
                                            <div className="form-group mb-8">
                                                {errors.replacement_within_time && errors.replacement_within_time.message ?
                                                    <small className="text-danger">{errors.replacement_within_time && errors.replacement_within_time.message}</small>
                                                    : <small>{t("Replacement Within Time")} <span className="text-danger">*</span></small>}
                                                {/* <small>Replacement Time</small> */}

                                                <input
                                                    type="text"
                                                    className={errors.replacement_within_time ? "form-control shadhandleChangeBarCodeow-none error" : "form-control shadow-none"}
                                                    placeholder={t("Enter Replacement Time")}
                                                    {...register("replacement_within_time", {required: t("Replacement Within Time is Required")})}
                                                />
                                            </div>
                                            <span className="another-day">{t("Days")}</span>
                                        </div>
                                }
                            </div>

                        {single === false ? 
                            <>
                            {/* separate code / imei */}
                            <div className="col-12 col-lg-2 return-applicable">
                                <div className="form-group mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={separate_code ? true : false}
                                            onChange={()=>{setSeparateCode(!separate_code)}}
                                            style={{cursor: 'pointer'}} id="flexCheckDefault3"
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckDefault3" style={{cursor: 'pointer'}}>
                                            {t("Need Separate Code / IMEI")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            

                            {/* separate code */}
                            {
                                separate_code && codes.map((code, i) => <div className="col-12 col-lg-12" key={i}>
                                    <div className="form-group mb-4">
                                        <small>{t("Code")} {i+1}</small>

                                        <input
                                            type="text"
                                            className={errors.code ? "form-control shadow-none error" : "form-control shadow-none"}
                                            placeholder={t("Enter Code")}
                                            value={code}
                                            onChange={(e) => handleChange(e, i)}
                                        />
                                    </div>
                                </div>)
                            }
                            </> : null
                        }

                            <div className="col-12 text-right">
                                <PrimaryButton
                                    type="submit"
                                    className="px-4"
                                    disabled={loading}
                                >
                                    <span>{loading ? t("Creating ...") : t("Create")}</span>
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>


                </>
            </Modal.Body>
        </Modal>
    );
}

export default ProductModal;