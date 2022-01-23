import React, { useEffect, useState,useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { DailyExpenseForm } from '../../../components/form/DailyExpenseForm'
import { Toastify } from '../../../components/toastify/Toastify'
import { Container } from '../../../components/container/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { GrayButton } from '../../../components/button/Index'
import { Loader } from '../../../components/loading/Index'
import { Requests } from '../../../utils/Http/Index'

const Show = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [isCreateExpense, setCreateExpense] = useState({ show: false, loading: false })
    const [perPage, setPerPage] = useState(10)
    const [ledgerData, setLedgerData] = useState([])

    // fetch daily expense data
    const fetchDailyExpenseData = useCallback(async (page) => {
      try {
          setLoading(true)
          const response = await Requests.EmployeeAll.Employee.EmployeeList(page,perPage)
          if (response && response.status === 200) {
              setLedgerData([
                  { label: "First Ledger", value: 1 },
                  { label: "Second Ledger", value: 2 },
              ])
          }
          setLoading(false)
      } catch (error) {
          if (error) {
              setLoading(false)
          }
      }
  }, [perPage])

  useEffect(() => {
      fetchDailyExpenseData(1)
  }, [fetchDailyExpenseData])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    // Handle daily expense submission
    const handleDailyExpenseSubmission = async (data) => {
      try {
          setCreateExpense({ ...isCreateExpense, loading: true })
          console.log(data)

          setTimeout(() => {
              setCreateExpense({ value: null, loading: false, show: false })
              Toastify.Success("Successfully working in dummy.")
          }, 2000)
      } catch (error) {
          if (error) {
              setCreateExpense({ ...isCreateExpense, loading: false })
              Toastify.Error("Network Error.")
          }
      }
  }

    if (loading) return <Loader />

    return (
        <div>
            <Layout
                page={t("dashboard / accountng / daily expense / create")}
                message={t("Create Daily Expense")}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/accounting/daily-expense">
                            <GrayButton type="button">
                                <ChevronLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
              <Container.Column>
                <DailyExpenseForm
                    loading={isCreateExpense.loading}
                    ledgerData={ledgerData}
                    onSubmit={handleDailyExpenseSubmission}
                />
              </Container.Column>
            </Main>
        </div>
    );
}

export default Show;