import React, {useState} from 'react'
import { X } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GrayButton, PrimaryButton } from '../../button/Index'
import { FileUploader } from '../../fileUploader/Index'
import { Requests } from '../../../utils/Http/Index'
import Toast from '../../Toaster/Index'


const Update = (props) => {

    const { fetchBrands, brand } = props;
    const { t } = useTranslation()
    const { register, handleSubmit, setError, setValue, clearErrors, formState: { errors } } = useForm()
    const [updating, setUpdating] = useState(false);


    // Submit Form
    const onSubmit = async data => {

        let formData = new FormData()
        formData.append('dokan_uid', localStorage.getItem('dokanuid'))
        formData.append('name', data ? data.name : '')
        formData.append('_method', "PUT")
        formData.append('description',data ? data.description : '')
        formData.append('image', data.image ?? null)

        clearErrors();
        setUpdating(true);
        const res = await Requests.Inventory.Brand.DokanBrandUpdate(formData, brand.uid)
        if (res.status === 200) {
            setUpdating(false);
            Toast.fire({
                icon: 'success',
                title: 'Dokan Brand Updated Successfully'
            })
            fetchBrands()
            setUpdating(false);
            props.onHide(true)
        } else {

            if (!errors.image) {
                setValue('image', data.image)
            } else {
                setValue('image', '')
            }

            Object.keys(res.data.errors).forEach(key => {
                setError(key, {
                    type: "manual",
                    message: res.data.errors[key][0],
                });
            });
            setUpdating(false);
            props.onHide(true)
        }
    }

    return (
        <Modal
            show={props.show}
            size="lg"
            centered
            className="custom-modal"
            onHide={props.onHide}
        >
            <Modal.Header>
                <div className="d-flex">
                    <div><h6 className="mb-0">{t('Update Brand')}</h6></div>
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
                                    : <small>{t('Brand Name')}</small>}

                                <input
                                    type="text"
                                    className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                    placeholder={t("Enter Brand name")}
                                    defaultValue={props.branditem ? props.branditem.name : null}
                                    {...register("name", { required: t("Name is required") })}
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="col-12 col-lg-4">
                            <FileUploader
                                imageURL={brand.image}
                                error={errors.image ? errors.image.message : ""}
                                width={150}
                                height={150}
                                limit={100}
                                title={t("Brand Image / Logo")}
                                dataHandeller={(data) => setValue('image', data.image)}
                            />
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <div className="form-group mb-4">
                                <small>{t('Description')}</small>
                                <textarea
                                    rows={5}
                                    className="form-control shadow-none"
                                    placeholder={t("Enter brand description")}
                                    defaultValue={props.branditem ? props.branditem.description : null}
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
