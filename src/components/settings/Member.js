import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'react-feather'
import { Toastify } from '../toastify/Toastify'
import { Text } from '../text/Text'
import { DangerButton, PrimaryButton } from '../button/Index'
import { PrimaryModal } from '../modal/PrimaryModal'
import { DeleteModal } from '../modal/DeleteModal'
import { MemberForm } from '../form/MemberForm'
import { DataTable } from '../table/Index'
import { Requests } from '../../utils/Http/Index'

export const Member = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isCreate, setCreate] = useState({ show: false, loading: false })
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [memberDel, setMemberDel] = useState(null)

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Settings.DokanMembers(page, perPage)
        if (response.status === 200) {
            setData(response.data.data)
            setTotalRows(response.data.meta.total)
        }
        setLoading(false)
    }, [perPage])

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const res = await Requests.Settings.DokanMembers(page, perPage)

        setData(res.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    // Handle member create
    const handleCreateMember = async data => {
        try {
            setCreate({ ...isCreate, loading: true })
            const response = await Requests.Shop.DokanInvite(data)
            if (response && response.status === 200) {
                Toastify.Success('Member Invited Successfully')
            }
            setCreate({ show: false, loading: false })

        } catch (error) {
            if (error) {
                setCreate({ show: true, loading: false })

                if (error.response && error.response.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        Toastify.Error(error.response.data.errors[key][0])
                    })
                } else {
                    Toastify.Error("Network error.")
                }
            }
        }
    }

    // Handle delete
    const handleDelete = async () => {
        try {
            setDelete({ ...isDelete, loading: true })
            const response = await Requests.Settings.DokanMemberDelete(memberDel)
            if (response && response.status === 200) {
                Toastify.Success("Member Deleted Successfully")
            }
            setDelete({ value: null, show: false, loading: false })
        } catch (error) {
            if (error) {
                setDelete({ value: null, show: false, loading: false })
                Toastify.Error('Member Can\'t be Deleted')
            }
        }
    }

    // datatable columns
    const columns = [
        {
            name: t('Name'),
            selector: row => row.name || "N/A",
            sortable: true,
        },
        {
            name: t('E-mail'),
            selector: row => row.email || "N/A",
            sortable: true,
        },
        {
            name: t('Phone'),
            selector: row => row.phone_no || "N/A",
            sortable: true,
        },
        {
            name: t('Role'),
            selector: row => row.pivot && row.pivot.role === "admin" ? "Admin" : "Stuff",
            sortable: true,
        },
        {
            name: t('Action'),
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <DangerButton
                        className="danger-delete-circle"
                        onClick={() => {
                            setMemberDel(row.pivot.uid)
                            setDelete({ value: row, show: true })
                        }}
                    >
                        <Trash2 size={16} />
                    </DangerButton>
                </div>
        }
    ]

    return (
        <div>
            <div className="text-right mb-3">
                <PrimaryButton
                    type="button"
                    className="px-4"
                    onClick={() => setCreate({ show: true, loading: false })}
                >{t("Add Member")}</PrimaryButton>
            </div>

            {/* Member list table */}
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                totalRows={totalRows}
                handlePerRowsChange={handlePerRowsChange}
                handlePageChange={handlePageChange}
            />

            {/* Member creation modal */}
            <PrimaryModal
                show={isCreate.show}
                size="md"
                title="Create Member"
                onHide={() => setCreate({ show: false, loading: false })}
            >
                <MemberForm
                    loading={isCreate.loading}
                    onSubmit={data => handleCreateMember(data)}
                />
            </PrimaryModal>

            {/* Member delete confirmation modal */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<Text className="fs-14">{t("Want to delete")} {isDelete.value ? isDelete.value.email : null} ?</Text>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    )
}