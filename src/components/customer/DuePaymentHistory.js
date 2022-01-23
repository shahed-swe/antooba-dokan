import React, { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../container/Index'
import { DataTable } from '../table/Index'

export const NoticeHistory = () => {
    const { t } = useTranslation()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)

    // Fetch due payment history
    const fetchDuePaymentHistory = useCallback(async (page) => {
        setLoading(true)
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage);
            setData(response.data.data);
            setTotalRows(response.data.meta.total);
            setLoading(false);
            setServerError(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    const handlePageChange = (page) => fetchDuePaymentHistory(page)

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        try {
            const response = await Requests.Customer.AllCustomer(page, perPage)
            if (response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
                setLoading(false)
            }

        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    };

    useEffect(() => {
        fetchDuePaymentHistory(1)
    }, [fetchDuePaymentHistory])

    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null,
        };
        const response = await Requests.Customer.CustomerSearch(value)
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

    // Handle search
    const handleSearch = async (data) => {
        setsearchLoading(true);
        const response = await Requests.Customer.CustomerSearch(data);
        if (response.data) setData(response.data.data);
        setsearchLoading(false);
    }

    // Due payment history columns
    const columns = [
        {
            name: `${t('Date')}`,
            selector: row => row.name || "N/A",
            sortable: true,
            maxWidth: "300px"
        },
        {
            name: `${t('Payment')}`,
            selector: row => row.monthly_salary || "N/A",
            sortable: true,
            maxWidth: "300px"
        },
        {
            name: `${t('Note')}`,
            selector: row => <div
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={row.note || "N/A"}
                style={{ cursor: "pointer" }}
            >
                {row.description || "N/A"}
            </div>,
        },
    ]

    return (
        <div>
            {/* Due payment history table */}
            <Container.Column>
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}

                    noDataMessage="No due payement history available"
                    searchable
                    placeholder={"Search by date"}
                    search={handleSearch}
                    searchLoading={searchLoading}
                    suggestion={handleSuggestion}
                    clearSearch={() => fetchDuePaymentHistory(1)}
                />
            </Container.Column>
            
        </div>
    );
}
