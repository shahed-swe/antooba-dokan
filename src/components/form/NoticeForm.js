import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { dateFormate } from '../../utils/_heplers'
import { PrimaryButton } from '../button/Index'
import { Card } from '../card/Index'
import { Container } from '../container/Index'
import { DatePicker } from '../datePicker/Index'
import { FormGroup } from '../formGroup/FormGroup'
import { Text } from '../text/Text'

export const NoticeForm = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()
  const [activatedFabric, setActivatedFabric] = useState({ label: null, value: null })
  const [fabricOptions] = useState([
    { label: "All", value: 1 },
    { label: "Customers only", value: 2 },
    { label: "Employees only", value: 3 },
    { label: "Suppliers only", value: 4 }
  ])

  // Check fabric activation 
  const checkActivatedFabric = item => {
    if (item === activatedFabric.value) return true
    return false
  }

  // Handle fabric Option
  const handleFabricOption = async item => {
    setActivatedFabric({ label: item.label, value: item.value })
  }

  // Submit Form
  const onSubmit = async data => {

    clearErrors()
    const formData = {
      ...data,
    }
    props.data(formData)
    // props.onSubmit(formData)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Simple>
          <Card.Body className="">
            <Container.Column>
                <Container.Row>
                  {fabricOptions && fabricOptions.map((item, i) =>
                    <Container.Column className="col-md-6">
                      <Form.Check
                        key={i}
                        type="checkbox"
                        id={`fabric${item.value}`}
                        className="mb-0"
                        label={<Text className="fs-14 mb-1">{item.label}</Text>}
                        style={{ fontSize: 13, cursor: "pointer" }}
                        checked={checkActivatedFabric(item.value)}
                        onChange={() => handleFabricOption(item)}

                      />
                    </Container.Column>
                  )}
                </Container.Row>
            </Container.Column>

            <Container.Column className="col-lg-6">

            </Container.Column>

            <Container.Column className="col-lg-6">

            </Container.Column>

            <Container.Column className="col-lg-6">

            </Container.Column>
          </Card.Body>
        </Card.Simple>


        {/* Submit button */}
        <div className="text-right mt-2">
          <PrimaryButton
            type="submit"
            className="px-4"
            disabled={props.loading}
          >{props.loading ? "LOADING..." : "SUBMIT"}</PrimaryButton>
        </div>
      </form>
    </div>
  );
};
