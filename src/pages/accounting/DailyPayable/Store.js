import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { GrayButton } from '../../../components/button/Index'
import { Layout, Main } from '../../../components/layout/Index'
import { Loader } from '../../../components/loading/Index'
import { Container } from '../../../components/container/Index'
import { Requests } from '../../../utils/Http/Index'
import { Toastify } from '../../../components/toastify/Toastify'
import { DailyExpenseForm } from '../../../components/form/DailyExpenseForm'

const Show = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [isCreatePayable, setCreatePayable] = useState({ show: false, loading: false })
  const [perPage, setPerPage] = useState(10)
  const [ledgerData, setLedgerData] = useState([])

  // fetch daily payable data
  const fetchDailyPayableData = useCallback(async (page) => {
    try {
      setLoading(true)
      const response = await Requests.EmployeeAll.Employee.EmployeeList(page, perPage)
      if (response && response.status === 200) {
        setLedgerData([
          { label: "First Ledger for payable", value: 1 },
          { label: "Second Ledger for payable", value: 2 },
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
    fetchDailyPayableData(1)
  }, [fetchDailyPayableData])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // Handle daily payable submission
  const handleDailyPayableSubmission = async (data) => {
    try {
      setCreatePayable({ ...isCreatePayable, loading: true })
      console.log(data)

      setTimeout(() => {
        setCreatePayable({ value: null, loading: false, show: false })
        Toastify.Success("Successfully working in dummy.")
      }, 2000)
    } catch (error) {
      if (error) {
        setCreatePayable({ ...isCreatePayable, loading: false })
        Toastify.Error("Network Error.")
      }
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <Layout
        page={t("dashboard / accountng / daily payable / create")}
        message={t("Create Daily Payable")}
        container="container-fluid"
        button={
          <div>
            <Link to="/dashboard/accounting/daily-payable">
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
            loading={isCreatePayable.loading}
            ledgerData={ledgerData}
            onSubmit={handleDailyPayableSubmission}
          />
        </Container.Column>
      </Main>
    </div>
  );
}

export default Show;