import React, { useState, useEffect,useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { dateFormate } from '../../utils/_heplers'
import { PrimaryButton } from '../button/Index'
import { Card } from '../card/Index'
import { Container } from '../container/Index'
import { DatePicker } from '../datePicker/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const BonusForm = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
  const bonus = props.bonus ? props.bonus : []
  const employee = props.employee ? props.employee : []
  const [bonusPercentage, setBonusPercentage] = useState(null)
  const [employeeData, setEmployeeData] = useState(null)
  const [date, setDate] = useState(new Date());
  const [totalBonus, setTotalBonus] = useState(null)

  const handleBonus = useCallback(() => {
    if (bonusPercentage && bonusPercentage.type === "Percentage") {
      setTotalBonus(((employeeData && employeeData.monthly_salary ? employeeData.monthly_salary : 0) * (bonusPercentage && bonusPercentage.amount ? bonusPercentage.amount : 0)) / 100)
    }
    else {
      setTotalBonus(bonusPercentage && bonusPercentage.amount ? bonusPercentage.amount : 0)
    }
  },[bonusPercentage,employeeData])

  useEffect(() => {
    handleBonus()
  }, [handleBonus])

  // Submit Form
  const onSubmit = async data => {
    if (!date) {
      setError("date",
        {
          type:"manaul",
          message: "Date is required"
        })
    }
    const allData = {
      employee_id: employeeData.uid,
      date: dateFormate(date),
      current_salary: employeeData.monthly_salary,
      bonus_amount: totalBonus

    }
    if (date) console.log(allData)
    //props.submit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container.Row>

        {/* Select employee */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.employee && errors.employee.message ?
              <Text className="text-danger fs-13 mb-1">{errors.employee && errors.employee.message}</Text> :
              <Text className="text-capitalize fs-13 mb-1">{t('Select employee')} <span className="text-danger"> *</span></Text>
            }
            <select
              className="form-control shadow-none border-0 bg-light fs-13"
              onClick={event => setEmployeeData(JSON.parse(event.target.value))}
              {...register("employee", { required: "Empolyee is required" })}
            >
              <option value="">Select Employee</option>
              {employee && employee.map((item, i) =>
                <option
                  key={i}
                  value={JSON.stringify(item)}
                >{item.name}</option>
              )}
            </select>
          </FormGroup>
        </Container.Column>

        {/* Select bonus type */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.bonusType && errors.bonusType.message ?
              <Text className="text-danger fs-13 mb-1">{errors.bonusType && errors.bonusType.message}</Text> :
              <Text className="text-capitalize fs-13 mb-1">{t('Bonus Type')} <span className="text-danger"> *</span></Text>
            }
            <select
              className="form-control shadow-none border-0 bg-light fs-13"
              onClick={event => setBonusPercentage(JSON.parse(event.target.value))}
              {...register("bonusType", { required: "Bonus Type is required." })}
            >
              <option value="">Select bonus type</option>
              {bonus && bonus.map((item, i) =>
                <option
                  key={i}
                  value={JSON.stringify(item)}
                >{item.title}</option>
              )}
            </select>
          </FormGroup>
        </Container.Column>

        {/* Bonus Type */}
        <Container.Column className="col-lg-6">
          <div className='d-flex'>
            <FormGroup className="flex-fill">
              <Text className="fs-13 mb-1">{t('Bonus Amount')}</Text>

              <input
                type="number"
                step=".01"
                min={0}
                className="form-control shadow-none"
                defaultValue={bonusPercentage && bonusPercentage.amount ? bonusPercentage.amount : null}
                disabled
              />
            </FormGroup>
            <FormGroup className="pl-1">
              <Text className="fs-13 mb-4"></Text>
              <input
                type="text"
                className="form-control shadow-none"
                defaultValue={bonusPercentage && bonusPercentage.type ? bonusPercentage.type === "Tk" ? "Tk" : "%" : null}
                disabled
              />
            </FormGroup>
          </div>

        </Container.Column>

        {/* Date */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.date && errors.date.message ?
              <Text className="text-danger fs-13 mb-1">{errors.date && errors.date.message}</Text> :
              <Text className="text-capitalize fs-13 mb-1">{t('Join Date')}</Text>
            }
            <DatePicker
              selected={data => { setDate(data); clearErrors() }}
              deafultValue={date}
            // {...register("bonusType", { required: "Bonus Type is required." })}
            />
          </FormGroup>
        </Container.Column>

        {/* Bonus cards */}
        <Container.Column>
          <Container.Row className="px-3 mb-3">

            {/* Salary card */}
            <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
              <Card.Simple>
                <Card.Body className="px-0">
                  <Text className="fs-16 mb-0"> Current Salary</Text>
                  <Text className="fs-16 font-weight-bold mb-0"> {employeeData && employeeData.monthly_salary ? employeeData.monthly_salary : 0} Tk</Text>
                </Card.Body>
              </Card.Simple>
            </Container.Column>

            {/* Bonus card */}
            <Container.Column className="col-sm-6 col-md-3 col-xl-2 text-center p-1">
              <Card.Simple>
                <Card.Body className="px-0">
                  <Text className="fs-16 mb-0"> Bonus Amount</Text>
                  <Text className="fs-16 font-weight-bold mb-0">
                    {totalBonus ? totalBonus : 0} Tk</Text>
                </Card.Body>
              </Card.Simple>
            </Container.Column>

          </Container.Row>
        </Container.Column>

        {/* Submit button */}
        <Container.Column className="text-right">
          <PrimaryButton
            type="submit"
            className="px-4"
            disabled={props.loading}
          >{props.loading ? t("Creating...") : t("Create")}</PrimaryButton>
        </Container.Column>
      </Container.Row>
    </form>
  );
}