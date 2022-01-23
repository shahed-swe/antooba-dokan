import React, { useState, useEffect, useCallback } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import StepWizard from 'react-step-wizard'
import { Edit, Plus, ShoppingCart, Trash2 } from 'react-feather';
import { Layout, Main } from '../../components/layout/Index';
import { FloatButton } from '../../components/help/Index';
import { englishToBengali } from '../../utils/_heplers';
import { DangerButton, GrayButton, PrimaryOutlineBadgeButton } from '../../components/button/Index';
import { useTranslation } from 'react-i18next';
import { Requests } from '../../utils/Http/Index';
import { Loader } from '../../components/loading/Index';
import { Container } from '../../components/container/Index';
import { DeleteModal } from '../../components/modal/DeleteModal';

import Navbar from '../../components/navbar/Index';
import { Toastify } from '../../components/toastify/Toastify';
import { PrimaryModal } from '../../components/modal/PrimaryModal';
import { Step1, Step2 } from '../../components/modals/shop/ShopCreate';
import { EditStep1, EditStep2 } from '../../components/modals/shop/ShopUpdate';



const Index = () => {
    localStorage.removeItem('dokanuid');
    const { t } = useTranslation()
    const [show, setShow] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [isEdit, setEdit] = useState({ value: null, show: false, loading: false })
    const [shops, setShops] = useState([]);
    const [shop, setShop] = useState([]);
    const [isLoading, setLoading] = useState(true)
    const [has_ecommerce, setHasEcommerce] = useState(false)

    const checkIfHasEcommerce = (shops) => {
        let i = 0;
        for (i = 0; i < shops.length; i++) {
            if (parseInt(shops[i].has_ecommerce) === 1) {
                setHasEcommerce(true);
                break;
            }
        }

        if (i === shops.length) {
            setHasEcommerce(false);
        }
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Shop.ShopList()
            if (response.status === 200) {
                setLoading(false)
                setShops(response.data.data)
                checkIfHasEcommerce(response.data.data);
            }

        } catch (error) {
            if (error) console.log(error)
        }
    }, [])


    useEffect(() => {
        fetchData()
    }, [fetchData])


    if (isLoading) return <Loader signal={'true'} />


    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })
        try {
            const response = await Requests.Shop.DeleteShop(isDelete.value.uid)
            if (response.status === 200) {
                setDelete({ ...isDelete, show: false, loading: false })
                Toastify.Success("Shop Deleted Successfully")
            }
            fetchData()
        } catch (error) {
            Toastify.Success(`${isDelete.value.title} shop can't be Deleted.`)
        }

    }


    const handleShopCreate = async (data) => {
        fetchData()
    }

    const handleShopUpdate = async (data) => {
        fetchData()
    }

    const handleShopid = (uid, name) => {
        localStorage.setItem('dokanuid', uid)
        localStorage.setItem('dokanname', name)
    }


    return (
        <div className="shop-container">
            <Navbar menu={false} />
            <div style={{ paddingTop: 63 }} />
            <Layout
                page={t('shop list')}
                message={t('Welcome to shop list')}
                container="container"
                button={
                    has_ecommerce ?
                        <div className="print-hidden">
                            <Link to="/shop">
                                <PrimaryOutlineBadgeButton
                                    type="button"
                                    className="px-4"
                                    badgeValue={englishToBengali(15)}
                                >
                                    <ShoppingCart size={17} style={{ marginRight: 5 }} />
                                    <span style={{ fontSize: 13 }}>{t('E-COMMERCE')}</span>
                                </PrimaryOutlineBadgeButton>
                            </Link>
                        </div>
                        :
                        null
                }
            />
            <Main>
                <Container.Basic>
                    <Container.Row>
                        <Container.Column>

                            {shops && shops.length ?
                                shops.map((shop) =>
                                    <div className="card item-card" key={shop.uid}>
                                        <div className="card-body">
                                            <Link to={`/dashboard/`}><h5 className="text-capitalize mb-2" onClick={event => handleShopid(shop.uid, shop.title)}>{shop.title}</h5></Link>
                                            <p className="text-uppercase mb-0">{t('shop id')}: {englishToBengali(shop.uid)}</p>
                                            <div className="text-right">
                                                <DangerButton
                                                    type="button"
                                                    style={{ padding: "7px 10px", borderRadius: "50%", marginRight: 5 }}
                                                    onClick={() => setDelete({ value: shop, show: true })}
                                                ><Trash2 size={16} /></DangerButton>

                                                <GrayButton
                                                    type="button"
                                                    style={{ padding: "7px 10px", borderRadius: "50%" }}
                                                    onClick={() => setEdit({ value: shop, show: true })}
                                                ><Edit size={16} onClick={() => setShop(shop)} /></GrayButton>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                            <div className="card item-card create-card" onClick={() => setShow(true)}>
                                <div className="card-body flex-center flex-column">
                                    <Plus size={18} />
                                </div>
                            </div>

                        </Container.Column>
                    </Container.Row>
                </Container.Basic>
            </Main>

            {/* Create shop */}
            <PrimaryModal
                title={t('Create Shop')}
                show={show}
                onHide={() => setShow(false)}
            >
                <div style={{ overflow: "hidden" }}>
                    <StepWizard>
                        <Step1 initialStep={1} />
                        <Step2 onHide={() => setShow(false)} handleShop={handleShopCreate} />
                    </StepWizard>
                </div>
            </PrimaryModal>

            {/* Edit shop */}
            <PrimaryModal
                title={t('Edit Shop')}
                show={isEdit.show}
                onHide={() => setEdit({ value: null, loading: false, show: false })}
            >
                <div style={{ overflow: "hidden" }}>
                    <StepWizard>
                        <EditStep1
                            initialStep={1}
                            shop={isEdit.value}
                            shopDetail={shop}
                        />
                        <EditStep2
                            shop={isEdit.value}
                            onHide={() => setEdit({ value: null, loading: false, show: false })}
                            handleShop={handleShopUpdate}
                            shopDetail={shop}

                        />
                    </StepWizard>
                </div>
            </PrimaryModal>

            {/* Delete confirmation modal */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<h6>{t("Want to delete shop?", { shop_name: isDelete.value ? isDelete.value.name : null })}</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />

            <FloatButton />
        </div>
    );
}

export default Index;
