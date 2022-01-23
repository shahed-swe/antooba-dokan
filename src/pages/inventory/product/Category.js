
import React, { useState, useEffect, useCallback } from 'react'
import { Edit2, Plus, Printer, ChevronRight } from 'react-feather'
import {
    GrayButton,
    SuccessButton,
} from '../../../components/button/Index'
import { Accordion, Card, Button } from 'react-bootstrap'
import { Layout, Main } from '../../../components/layout/Index'
import { CategoryForm } from '../../../components/form/CategoryForm'
import { CategoryUpdateForm } from '../../../components/form/CategoryUpdateForm'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { useTranslation } from 'react-i18next'
import { Loader } from '../../../components/loading/Index'
import { Text } from '../../../components/text/Text'
import { Requests } from '../../../utils/Http/Index'
import { Toastify } from '../../../components/toastify/Toastify'
import { NetworkError } from '../../../components/501/NetworkError'
import { NoContent } from '../../../components/204/NoContent'
import { Container } from '../../../components/container/Index'

const Category = () => {
    const { t } = useTranslation()
    const [categories, setCategories] = useState([])
    const [data_loading, setDataLoading] = useState(true)
    const [isCreate, setCreate] = useState({ show: false, loading: false })
    const [isUpdate, setUpdate] = useState({ value: {}, show: false, loading: false })
    const [activeKey, setActiveKey] = useState(null)
    const [error, setError] = useState(false)

    const fetchCategories = useCallback(async () => {
        try {
            const response = await Requests.Inventory.Category.CategoryList()
            console.log(response.data.data)
            if (response.status === 200) setCategories(response.data.data)
            setDataLoading(false)
        } catch (error) {
            if (error) {
                setError(true)
                setDataLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const toggleActive = key => {
        if (activeKey === key) {
            setActiveKey(null)
        } else {
            setActiveKey(key)
        }
    }

    const handleCategoryCreate = async (data) => {
        data.dokan_uid = localStorage.getItem('dokanuid')
        try {
            const response = await Requests.Inventory.Category.CategoryAdd(data)
            if (response.status === 201) {
                if (data.category_uid) {
                    Toastify.Success(t('Sub Category Created Successfully'))
                } else {
                    Toastify.Success(t('Category Created Successfully'))
                }

                fetchCategories()
            }
            setCreate({ show: false, loading: false })
        } catch (error) {
            if (error) {
                setCreate({ show: false, loading: false })
                if (error && error.response && error.response.status === 422) {
                    if (data.category_uid || data.category_uid === "") {
                        Toastify.Error(t('SubCategory Can\'t Be Created'))
                    } else {
                        Toastify.Error(t('Category Can\'t Be Created'))
                    }
                } else {
                    Toastify.Error(t('Network Error'))
                }
            }

        }

    }


    const handleCategoryUpdate = async (data) => {
        try {
            setUpdate({ ...isUpdate, loading: true })

            data.dokan_uid = localStorage.getItem('dokanuid')
            const response = await Requests.Inventory.Category.CategoryUpdate(data)
            if (response.status === 200) {
                setUpdate({ show: false, loading: false })
                fetchCategories()

                if (data.category_uid !== 0) {
                    Toastify.Success(t('Sub Category Updated Successfully'))
                } else {
                    Toastify.Success(t('Category Updated Successfully'))
                }
            }
        } catch (error) {
            setUpdate({ ...isUpdate, loading: false })
            if (error && error.response && error.response.status === 422) {
                if (data.category_uid !== 0) {
                    Toastify.Success(t('Sub Category Updated Successfully'))
                } else {
                    Toastify.Success(t('Category Updated Successfully'))
                }
            } else {
                Toastify.Error(t('Network Error'))
            }
        }
    }

    return (
        <div>
            <Layout
                page="inventory / category list"
                message={t("Category of product usually you sell.")}
                container="container-fluid"
                button={
                    <div>
                        <GrayButton onClick={() => setCreate({ show: true, loading: false })}>
                            <Plus size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t("ADD NEW")}</span>
                        </GrayButton>

                        <GrayButton className="ml-2 mt-2 mt-sm-0">
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t("PRINT")}</span>
                        </GrayButton>
                    </div>
                }
            />
            <Main>

                {data_loading && !categories.length && !error ? <Loader /> : null}
                {!data_loading && !categories.length && error ? <NetworkError message={t("Network error.")} /> : null}
                {!data_loading && !categories.length && !error ? <NoContent message={t("No category available.")} /> : null}

                {!data_loading && !error && categories.length ?
                    <Container.Column className="col-lg-10 mb-10">
                        <Accordion>
                            {categories && categories.map((item, i) =>
                                <Card className="rounded-2" key={i}>
                                    <Card.Header
                                        style={{ border: "none" }}
                                        className="px-2 bg-white"
                                        onClick={() => toggleActive(i)}
                                    >
                                        {item.subcategories.length > 0 ? (
                                            <div className="d-flex">
                                                <Accordion.Toggle as={Button} variant="text" eventKey={i + 1} className="w-100 shadow-none text-decoration-none text-dark" >
                                                    <div className="d-flex">
                                                        <div><Text className="fs-15 mb-0">{t(item.name)}</Text></div>
                                                    </div>
                                                </Accordion.Toggle>
                                                <div className="ml-auto">
                                                    <SuccessButton onClick={() => {
                                                        setUpdate({ value: item, show: true, loading: false })
                                                    }}
                                                        className="success-add-circle"
                                                    ><Edit2 size={18} /></SuccessButton>

                                                </div>
                                            </div>


                                        ) : (
                                            <div className="d-flex">
                                                <Accordion.Toggle as={Button} variant="text" className="w-100 shadow-none text-decoration-none text-dark">
                                                    <div className="d-flex">
                                                        <div><Text className="fs-15 mb-0">{t(item.name)}</Text></div>
                                                    </div>
                                                </Accordion.Toggle>
                                                <div className="ml-auto"><SuccessButton onClick={() => {
                                                    setUpdate({ value: item, show: true, loading: false })
                                                }}
                                                    className="success-add-circle"
                                                ><Edit2 size={18} /></SuccessButton></div>
                                            </div>
                                        )}

                                    </Card.Header>
                                    <Accordion.Collapse eventKey={i + 1}>
                                        <Card.Body>
                                            {item.subcategories.length > 0 ? <Text className="fs-14 font-weight-bold">Sub Categories</Text> : null}
                                            {item.subcategories && item.subcategories.map((subitem, j) => {
                                                return (
                                                    <div className="d-flex" key={j}>
                                                        <div><Text className="fs-13 mb-0"><ChevronRight size={15} />{t(subitem.name)}</Text></div>
                                                        <div className="ml-auto pb-1"><SuccessButton className="success-add-circle" onClick={() => {
                                                            setUpdate({ value: subitem, show: true, loading: false })
                                                        }
                                                        }><Edit2 size={18} /></SuccessButton></div>
                                                    </div>
                                                )
                                            })}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )}
                        </Accordion>
                    </Container.Column>
                    : null
                }
            </Main>

            {/* Product category create */}
            <PrimaryModal
                show={isCreate.show}
                onHide={() => setCreate({ show: false, loading: false })}
                title={t("Add New Category")}
                size="md"
            >
                <CategoryForm
                    submit={handleCategoryCreate}
                    categories={categories}
                    update={false}
                />
            </PrimaryModal>


            {/* Product category update */}
            {isUpdate.value && isUpdate.show ?
                <PrimaryModal
                    show={isUpdate.show}
                    onHide={() => setUpdate({ show: false, loading: false })}
                    title={isUpdate.value && isUpdate.value.category_uid === 0 ? t("Update Category") : t('Update SubCategory')}
                    size="md"
                >
                    <CategoryUpdateForm
                        loading={isUpdate.loading}
                        submit={handleCategoryUpdate}
                        categories={categories}
                        categorydata={isUpdate.value}
                        update={true}
                    />
                </PrimaryModal>
                : null
            }
        </div>
    );
}

export default Category;