
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Edit2, Printer, Trash } from 'react-feather'
import {
    DangerButton,
    GrayButton,
    SuccessButton
} from '../../../components/button/Index'
import { Layout } from '../../../components/layout/Index'
import { DataTable } from '../../../components/table/Index'

const Index = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searching, setSearching] = useState(false)

    const fetchUsers = useCallback(async (page) => {
        setLoading(true)
        const response = await axios.get(
            `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,
        )

        setData(response.data.data)
        setTotalRows(response.data.total)
        setLoading(false)
    }, [perPage])

    const handlePageChange = page => {
        fetchUsers(page)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)

        const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`)

        setData(response.data.data)
        setPerPage(newPerPage)
        setLoading(false)
    };

    useEffect(() => {
        fetchUsers(1)
    }, [fetchUsers])

    const columns = [
        {
            name: 'Code',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Mechanic Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Device Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Device Model',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Recived Date',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Delivery Date',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Free / Service Charge',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Advance Payment',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Action',
            minWidth: '160px',
            cell: row =>
                <div>
                    <GrayButton
                        icon={<Printer size={16} />}
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => handleAction(row)}
                    />
                    <SuccessButton
                        icon={<Edit2 size={16} />}
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => handleAction(row)}
                    />
                    <DangerButton
                        icon={<Trash size={16} />}
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => handleAction(row)}
                    />
                </div>
        }
    ]

    // Handle action
    const handleAction = value => console.log(value);

    // Handle search
    const handleSearch = async query => {
        setSearching(true)
        console.log(query)

        setTimeout(() => {
            setSearching(false)
        }, 2000);
    }

    return (
        <div>
            <Layout
                page="pos / servicing"
                message="All service work without product price is here."
                container="container-fluid"
                printable
                printData={"No data"}
                otherPage
                pageLink="/dashboard/inventory/product/new"
            >
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                    search={handleSearch}
                    searching={searching}
                />
            </Layout>
        </div>
    );
}

export default Index;