import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Eye, Printer } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { DataTable } from '../../components/table/Index'
import { Requests } from '../../utils/Http/Index'
import { Container } from '../../components/container/Index'
import { GrayButton, SuccessButton } from '../../components/button/Index'
import { FormGroup } from '../../components/formGroup/FormGroup'
import { Loader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'

const ProductReturnAndReplacement = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [searchLoading, setSearchLoading] = useState(false)
    const [shifts, setShifts] = useState([])

    // fetch employee data
    const fetchEmployee = useCallback(async (page) => {
        try {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalRows(response.data.total)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [perPage])

    useEffect(() => {
        fetchEmployee(1)
    }, [fetchEmployee])

    // handle paginate page change
    const handlePageChange = page => fetchEmployee(page)

    // handle paginate row change
    const handlePerRowsChange = async (newPerPage, page) => {
            setLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeList(page, newPerPage)
            if (response && response.status === 200) {
                setData(response.data.data)
                setPerPage(newPerPage)
            }
            setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        try {
            setSearchLoading(true)
            const response = await Requests.EmployeeAll.Employee.EmployeeSearch(data)
            if (response && response.status === 200) setData(response.data.data)
            setSearchLoading(false)
        } catch (error) {
            if (error) {
                setSearchLoading(false)  
            }
        }
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.EmployeeAll.Employee.EmployeeSearch(value)

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

    // Filter by shift
    const handleShiftFilter = async (data) => {
        if (data !== "default") {
            try {
                const response = await Requests.EmployeeAll.Attendance.EmployeeFilterByShift(data)
                if (response && response.status === 200) setData(response.data.data)
            } catch (error) {
                if (error) setServerError(true)
            }
        } else {
            fetchEmployee()
        }
    }

    // data columns
    const columns = [
        {
            name: `${t('Name')}`,
            selector: row => row.name ? row.name : "N/A",
            sortable: true
        },
        {
            name: `${t('Invoice')}`,
            selector: row => row.uid ? row.uid : "N/A",
            sortable: true,
        },
        {
            name: `${t('Date')}`,
            selector: row => row.date ? row.date : "12/12/21",
            sortable: true,
        },
        {
            name: `${t('Paid')}`,
            selector: row => row.advance_taken ? row.advance_taken : "0",
            sortable: true,
        },
        {
            name: `${t('Due')}`,
            selector: row => row.monthly_salary ? row.monthly_salary : "0",
            sortable: true,
        },
        {
            name: `${t('Action')}`,
            grow: 0,
            minWidth: "150px",
            cell: row =>
                <div>
                    <Link to={`/dashboard/product-return-replacement/show/${row.uid}`}>
                        <SuccessButton
                            type="button"
                            style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        // onClick={() => handleAction(row)}
                        ><Eye size={16} />
                        </SuccessButton>
                    </Link>
                </div>
        }
    ]

    return (
        <div>
            <Layout
                page={t("dashboard / return & replacement / all")}
                message={t("Customer list those are eligible to product return and replace")}
                container="container-fluid"
                button={
                    <div>
                        <GrayButton
                            type="button"
                            className="mt-2 mt-sm-0"
                            onClick={() => console.log("Will print")}
                        >
                            <Printer size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>{t('PRINT')}</span>
                        </GrayButton>
                    </div>
                }
            />

            <Main>

                {loading && !data.length && !serverError ? <Loader /> : null}
                {!loading && !data.length && !serverError ? <NoContent message={t("No products available.")} /> : null}
                {!loading && !data.length && serverError ? <NetworkError message={t("Network Error!!!")} /> : null}

                {!loading && data.length && !serverError ?
                    <div className='w-100'>
                        <Container.Column>
                            <FormGroup className="mb-0">
                                <select
                                    className="form-control shadow-none rounded-pill ml-auto"
                                    style={{ width: 250 }}
                                    onChange={(event) => { handleShiftFilter(event.target.value) }}
                                >
                                    <option value="default">{t("Select Invoice")}</option>
                                    {shifts && shifts.map((item, i) =>
                                        <option
                                            key={i}
                                            value={item.uid}
                                        >{item.title}</option>
                                    )}
                                </select>
                            </FormGroup>
                        </Container.Column>

                        {/* Data table */}
                        <Container.Column>
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                totalRows={totalRows}
                                handlePerRowsChange={handlePerRowsChange}
                                handlePageChange={handlePageChange}
                                searchable
                                placeholder={t("Search Customer")}
                                search={handleSearch}
                                suggestion={handleSuggestion}
                                searchLoading={searchLoading}
                                clearSearch={() => fetchEmployee(1)}
                            />
                        </Container.Column>
                    </div>
                    : null
                }
            </Main>
        </div>
    );
}

export default ProductReturnAndReplacement;
