
import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit2, Plus, Printer, Trash2 } from 'react-feather'
import {
    GrayButton,
    SuccessButton,
    DangerButton
} from '../../../components/button/Index'
import { Text } from '../../../components/text/Text'
import { Layout, Main } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'
import { Container } from '../../../components/container/Index'
import { DeleteModal } from '../../../components/modal/DeleteModal'
import { Requests } from '../../../utils/Http/Index'
import { PrimaryModal } from '../../../components/modal/PrimaryModal'
import { BrandForm } from '../../../components/form/BrandForm'
import { Toastify } from '../../../components/toastify/Toastify'
import { NetworkError } from '../../../components/501/NetworkError'


const Brand = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchLoading, setsearchLoading] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [isCreate, setCreate] = useState({ show: false, loading: false })
    const [isUpdate, setUpdate] = useState({ value: null, show: false, loading: false })
    const [createError, setCreateError] = useState(null)
    const [updateError, setUpdateError] = useState(null)

    const fetchBrands = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Inventory.Brand.DokanBrandList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    // handle page change
    const handlePageChange = page => fetchBrands(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try{
            setLoading(true)
            const response = await Requests.Inventory.Brand.DokanBrandList(page, newPerPage)
            if(response.data && response.status === 200){
                setData(response.data.data)
                setPerPage(newPerPage)
                setLoading(false)
            }
        }catch(error){
            if(error){
                setLoading(false)
                setServerError(true)
            }
        }

        
    };

    useEffect(() => {
        fetchBrands(1)
    }, [fetchBrands])


    // Handle search
    const handleSearch = async data => {
        try{
            setsearchLoading(true)
            const response = await Requests.Inventory.Brand.DokanBrandSearch(data)
            if (response.data && response.status === 200) setData(response.data.data)
            setsearchLoading(false)
        }catch(error){
            if(error){
                setsearchLoading(false)
                setServerError(true)
            }
        }
        
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Inventory.Brand.DokanBrandSearch(value)


        if (response && response.data.data && response.data.data.length) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // handle create brand
    const handleBrandCreate = async (data) => {
        setCreate({ show: true, loading: true })
        try {
            const response = await Requests.Inventory.Brand.DokanBrandStore(data)
            if (response.status === 201) {
                setCreate({ show: false, loading: false })
                fetchBrands()
                Toastify.Success("Brand Created Successfully")
            }
        } catch (error) {
            setCreate({ show: true, loading: false })

            if (error && error.response && error.response.status === 422) {
                Toastify.Error("Brand Can't Be Created")
                setCreateError(error.response.data)
            } else {
                Toastify.Error("Network Error Occured")
            }
        }
    }

    // handle update brand
    const handleBrandUpdate = async (data) => {
        setUpdate({ show: true, loading: true })

        try {
            const response = await Requests.Inventory.Brand.DokanBrandUpdate(data, isUpdate.value.uid)
            if (response.status === 200) {

                setUpdate({ show: false, loading: false })
                fetchBrands()
                Toastify.Success("Brand Updated Successfully")
            }
        } catch (error) {
            setUpdate({ show: true, loading: false })

            if (error && error.response && error.response.status === 422) {
                Toastify.Error("Brand Can't Be Updated")
                setUpdateError(error.response.data)
            } else {
                Toastify.Error("Network Error Occured")

            }
        }
    }

    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })
        try {
            const res = await Requests.Inventory.Brand.DokanBrandDelete(parseInt(isDelete.value.uid))
            if (res.status === 200) {
                setTimeout(() => {
                    setDelete({ ...isDelete, show: false, loading: false })
                }, 1000)
                Toastify.Success("Brand Deleted Successfully")
                fetchBrands()
            } else {
                setTimeout(() => {
                    setDelete({ ...isDelete, show: false, loading: false })
                }, 1000)
                Toastify.Error("Brand Can't Be Deleted")
            }
        } catch (error) {
            if (error) {
                setDelete({ ...isDelete, show: false, loading: false })
            }
        }


    }

    // data table custom style
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    const columns = [
        {
            name: t('Image'),
            selector: row => row.image,
            cell: row => <img height="50px" width="50px" alt={row.name} src={row && row.image ? row.image : "N/A"} />,
        },
        {
            name: t('Brand Name'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('Description'),
            selector: row => row.description ? row.description : "N/A",
            sortable: true,
        },
        {
            name: t('Action'),
            minWidth: '150px',
            cell: row =>
                <div>
                    <SuccessButton
                        className="circle-btn mr-1"
                        onClick={() => setUpdate({ value: row, show: true, loading: false })}
                    ><Edit2 size={16} />
                    </SuccessButton>

                    <DangerButton
                        className="circle-btn"
                        onClick={() => setDelete({ value: row, show: true })}
                    ><Trash2 size={16} /></DangerButton>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page="inventory / brand list"
                message={t("Brand of product usually you sell.")}
                container="container-fluid"
                button={
                    <div>
                        <GrayButton onClick={() => setCreate({ ...isCreate, show: true })}>
                            <Plus size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }} >{t("ADD NEW")}</span>
                        </GrayButton>
                        <GrayButton className="ml-2 mt-2 mt-sm-0">
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t("PRINT")}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>

                {serverError ? <NetworkError message={t("Network Error.")} /> : null}

                { !serverError ?
                    <Container.Fluid>
                        <Container.Row>
                            <Container.Column>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    totalRows={totalRows}
                                    customStyles={customStyles}
                                    handlePerRowsChange={handlePerRowsChange}
                                    handlePageChange={handlePageChange}

                                    noDataMessage="No brand available"
                                    searchable
                                    placeholder={"Search brand"}
                                    search={handleSearch}
                                    suggestion={handleSuggestion}
                                    searchLoading={searchLoading}
                                    clearSearch={() => fetchBrands(1)}
                                />
                            </Container.Column>
                        </Container.Row>
                    </Container.Fluid>
                    : null
                }
            </Main>

            {/* Delete confirmation modal */}
            {isDelete.show ?
                <DeleteModal
                    show={isDelete.show}
                    loading={isDelete.loading}
                    message={
                        <div>
                            <Text className="fs-14">{t("Want to delete")} {isDelete.value ? isDelete.value.name : null} ?</Text>
                            {isDelete.value && isDelete.value.image ?
                                <img src={isDelete.value.image} className="img-fluid" alt="..." />
                                : null
                            }
                        </div>
                    }
                    onHide={() => setDelete({ value: null, show: false, loading: false })}
                    doDelete={handleDelete}
                /> : null
            }


            {/* create brand modal */}
            <PrimaryModal
                show={isCreate.show}
                onHide={() => setCreate({ show: false, loading: false })}
                title="Create Brand"
                size="md"
            >
                <BrandForm
                    submit={handleBrandCreate}
                    loading={isCreate.loading}
                    errors={createError}
                    create={true}
                />

            </PrimaryModal>


            {/* update brand modal */}
            <PrimaryModal
                show={isUpdate.show}
                onHide={() => setUpdate({ value: null, show: false, loading: false })}
                title="Update Brand"
                size="md"
            >
                <BrandForm
                    errors={updateError}
                    loading={isUpdate.loading}
                    data={isUpdate.value}
                    submit={handleBrandUpdate}
                />
            </PrimaryModal>

        </div>
    );
}

export default Brand;