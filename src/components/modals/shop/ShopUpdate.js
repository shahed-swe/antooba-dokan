import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../../button/Index'
import {Requests} from '../../../utils/Http/Index';
import { Toastify } from '../../toastify/Toastify'

let stepOneData = null

// ---- Step One ----
const EditStep1 = (props) => {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [shop_types, setShopTypes] = useState([]);


    useEffect(() => {
        Requests.Shop.ShopType()
        .then(res => setShopTypes(res.data));
    },[]);

    
    const onSubmit = async (data) => {
        stepOneData = data
        props.nextStep()
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Shop Name */}
                <div className="form-group mb-4">
                    {errors.shopName && errors.shopName.message ?
                        <small className="text-danger">{errors.shopName && errors.shopName.message}</small>
                        : <small style={{ textTransform: 'capitalize' }}>{t('shop name')}</small>}

                    <input
                        type="text"
                        defaultValue={props.shop ? props.shop.title : null}
                        className={errors.emailPhone ? "form-control shadow-none error" : "form-control shadow-none"}
                        {...register("shopName", { required: t('Shop name is required') })}
                        placeholder={t('Enter shop name')}
                    />
                </div>

                {/* Shop type */}
                <div className="form-group mb-4">
                    {errors.shopType && errors.shopType.message ?
                        <small className="text-danger">{errors.shopType && errors.shopType.message}</small>
                        : <small>{t('Shop Type')}</small>}

                    <select
                        className="form-control shadow-none"
                        {...register("shopType", { required: t('Shop type is required') })}
                    >
                        {props.shop ? <option value={props.shop.shoptype.uid}>{t(props.shop.shoptype.title)}</option>: <option value="">{t('Please select an option')}</option>}
                        
                        {shop_types && shop_types.map((data) =>
                                <option key={data.uid} value={data.uid}>{t(data.title)}</option>
                        )}
                    </select>
                </div>

                {/* Next step */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        style={{ padding: "8px 30px", borderRadius: "4px" }}
                    >{t('Next')}</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

// ---- Step Two ----
const EditStep2 = (props) => {
    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(false)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const [features, setFeatures] = useState([]);
    const [dokanfeatures, setDokanFeatures] = useState([]);
    const [allselected, setAllSelected] = useState(true);

    useEffect(() => {
        Requests.Shop.FeatureList()
        .then(res => setFeatures(res.data));
        setDokanFeatures(props.shop && props.shop.features ? props.shop.features : []);

    },[props]);


    
    // Submit data
    const onSubmit = async (data) => {
        const shopData = {
                ...stepOneData,
                ...data
        }
        try{
            const res = await Requests.Shop.UpdateShop(props.shop.uid,shopData)
            if(res.data) {
                setLoading(true)
                props.handleShop(res.data);
                setLoading(false)
                props.onHide()
                Toastify.Success(`${shopData.shopName} Updated Successfully`)

            } else if(res.message) {
                setLoading(false)
                Toastify.Error(`Network Error Occured.`)
            }
        }catch(err){
            setLoading(false)
            Toastify.Error(`${shopData.shopName} Can't Be Successfully`)
        }
        
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {errors.shopFeatures && errors.shopFeatures.message ?
                    <h6 className="text-danger mb-4">{errors.shopFeatures && errors.shopFeatures.message}</h6>
                    : <h6 className="mb-4">{t("Please choose one or more feature")}</h6>}

                {
                    allselected ?
                        <div className="mb-3">
                            <Form.Check
                                custom
                                id="all"
                                type="checkbox"
                                label={t("Unselect All")}
                                style={{ fontSize: 14 }}
                                defaultChecked={true}
                                onClick={function () {
                                    setValue("shopFeatures", []);
                                    setAllSelected(false);
                                }}
                            />
                        </div>
                        :
                        <div className="mb-3">
                            <Form.Check
                                custom
                                id="all"
                                type="checkbox"
                                label={t("Select All")}
                                style={{ fontSize: 14 }}
                                onClick={function () {
                                    let uids = features.map(feature => feature.uid);
                                    setValue("shopFeatures", uids);
                                    setAllSelected(true);
                                }}
                            />
                        </div>
                }

                {features && features.map((data) => {
                    dokanfeatures && dokanfeatures.map((item,j) => {
                        if(item.uid === data.uid){
                            data['enabled'] = true
                        }
                        return data
                    })
                    return(
                        <div key={data.uid} className="mb-3">
                            <Form.Check
                                custom
                                type="checkbox"
                                id={`custom-${data.uid}`}
                                label={t(data.title)}
                                value={data.uid}
                                defaultChecked={data.enabled}
                                style={{ fontSize: 14 }}
                                {...register("shopFeatures", { required: t("Please choose one or more feature") })}
                            />
                        </div>
                    )
                    
                    }
                    
                )}
                {/* Submit data */}
                <div className="text-right">
                    <PrimaryButton
                        type="submit"
                        disabled={isLoading}
                        style={{ padding: "4px 30px", borderRadius: "4px" }}
                    >{props.shop ? isLoading ? t("Updating ...") : t("Update") : isLoading ? t("Creating ...") : t("Create")}</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export { EditStep1, EditStep2 };
