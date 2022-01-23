import React, {useState} from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { GrayButton } from '../../button/Index'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../../button/Index'
import SingleSelect from '../../select/Single'
import { Requests } from '../../../utils/Http/Index'
import Toast from '../../Toaster/Index'


const Create = (props) => {


    const { fetchCategories } = props;
    const { t } = useTranslation()
    const { register, handleSubmit,setValue, setError, clearErrors, formState: { errors } } = useForm()

    const [subcateoption, setSubCatOption] = useState(false)
    const [category, setCategory] = useState(null)

    const [creating, setCreating] = useState(false);

    const newcategories = props.categories ? props.categories.map(item => {
        return {
            label: item.name,
            value: item.uid
        }
    }) : []


    const onSubmit = async data => {

        data.dokan_uid = localStorage.getItem('dokanuid');

        clearErrors()
        setCreating(true);
        if (!subcateoption) {
     
            const res = await Requests.Inventory.Category.CategoryAdd(data)
            setCreating(false);

            if (res.status === 201) {
                
                Toast.fire({
                    icon: 'success',
                    title: 'Category Created Successfully'
                })
                
                fetchCategories();
                setValue('name','')
                setValue('description','')
                props.onHide(true);
            
            } else {
                setCreating(false);
                Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
                });
            }

        } else {
            data.category_uid = category;
            const res = await Requests.Inventory.SubCategory.SubCategoryAdd(data)
            setCreating(false);
            if (res.status === 201) {
                Toast.fire({
                    icon: 'success',
                    title: 'Sub Category Created Successfully'
                })
                props.onHide(true);
                fetchCategories();
            } else {

                Object.keys(res.data.errors).forEach(key => {
                    setError(key, {
                        type: "manual",
                        message: res.data.errors[key][0],
                    });
                });
            }
        }

    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">{t("Create new product category")}</h6></div>
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        {/* Name */}
                        <div className="col-12 col-lg-12">
                            <div className="form-group mb-4">
                                {errors.name && errors.name.message ?
                                    <small className="text-danger">{errors.name && errors.name.message}</small>
                                    : <small>{t('Category Name')}</small>}

                                <input
                                    type="text"
                                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Category name")}
                                    {...register("name")}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <div className="form-group mb-4">
                                {errors.description && errors.description.message ?
                                    <small className="text-danger">{errors.description && errors.description.message}</small>
                                    : <small>{t('Description')}</small>}
                                <textarea
                                    rows={5}
                                    className={errors.description ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Category description")}
                                    {...register("description")}
                                />
                            </div>
                        </div>



                        
                        {/* sub category option */}
                        <div className="col-12 col-lg-12 return-applicable">
                            <div className="form-group mb-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={subcateoption?true:false}
                                        onChange={()=>{setSubCatOption(!subcateoption)}}
                                        style={{cursor: 'pointer'}} id="flexCheckDefault21"
                                    />
                                    <label className="form-check-label " htmlFor="flexCheckDefault21" style={{cursor: 'pointer'}}>
                                        {t("Category")}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* subcategory create */}
                        {subcateoption ? (
                            <div className="col-12 col-lg-12">
                                <div className="form-group mb-8">
                                    {/* <small>Return Time</small> */}
                                    <SingleSelect
                                        placeholder="a category"
                                        options={newcategories}
                                        value={event => setCategory(event.value)}
                                    />
                                </div>
                            </div>
                        ): null}
                    </div>



                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={creating}
                        >{creating ? t("Submitting ...") : t("Submit")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Create;