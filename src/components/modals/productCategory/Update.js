import React,{useState} from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { GrayButton } from '../../button/Index'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../../button/Index'
import { Requests } from '../../../utils/Http/Index'
import Toast from '../../Toaster/Index'

const Update = (props) => {

    const { t } = useTranslation()
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const [updating, setUpdating] = useState(false);
    const { categorydata, fetchCategories } = props;


    const onSubmit = async data => {

        data._method = "PUT";
        data.dokan_uid = localStorage.getItem('dokanuid');
        data.uid = categorydata.uid;
        data.category_uid = categorydata.category_uid;

        setUpdating(true);
        const response = await Requests.Inventory.Category.CategoryUpdate(data)
        console.log(response)
        if (response.status === 200) {
            Toast.fire({
                icon: 'success',
                title: 'Category Updated Successfully'
            })
            props.onHide(true);
            fetchCategories();

        } else {

            Object.keys(response.data.errors).forEach(key => {
                setError(key, {
                    type: "manual",
                    message: response.data.errors[key][0],
                });
            });

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
                    <div><h6 className="mb-0">Update category</h6></div>
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
                                    defaultValue={props.categorydata ? props.categorydata.name : null}
                                    {...register("name", { required: t("Name is required") })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <div className="form-group mb-4">
                                <small>{t('Description')}</small>
                                <textarea
                                    rows={5}
                                    className="form-control shadow-none"
                                    placeholder={t("Enter Category description")}
                                    defaultValue={props.categorydata ? props.categorydata.description : null}
                                    {...register("description")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <PrimaryButton
                            type="submit"
                            className="px-4"
                            disabled={updating}
                        >{updating ? t("Submitting ...") : t("Submit")}</PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Update;