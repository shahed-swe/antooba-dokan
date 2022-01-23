import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '../table/Index'
import { Requests } from '../../utils/Http/Index'
import { formatDateWithAMPM } from '../../utils/_heplers'

export const ActivityLogs = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.Settings.DokanActivityLog(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.meta.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }, [perPage])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle row change
    const handlePerRowsChange = async (newPerPage, page) => {
        try {
            setLoading(true)
            const response = await Requests.Settings.DokanActivityLog(page, perPage)
            if (response.status === 200) {
                setData(data)
                setPerPage(newPerPage)
            }
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // data columns
    const columns = [
        {
            name: t('Type of Operation'),
            selector: row => row.type ? row.type : "N/A",
            sortable: true
        },
        {
            name: t('Description'),
            selector: row => row.description ? row.description : "N/A",
            sortable: true
        },
        {
            name: t('Date & Time'),
            selector: row => row.date_time ? formatDateWithAMPM(row.date_time) : "N/A",
            sortable: true
        }
    ]

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                totalRows={totalRows}
                handlePerRowsChange={handlePerRowsChange}
                handlePageChange={handlePageChange}
            />
        </div>
    );
}