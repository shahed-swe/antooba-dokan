import React, { useState } from 'react'
import { Card } from '../card/Index'
import { Text } from '../text/Text'
import { Edit2, Trash2 } from 'react-feather'
import { DangerButton, GrayButton } from '../button/Index'

export const BonusCard = (props) => {
  const [sliceAmount, setSliceAmount] = useState(35)
  const styles = {
    customWidth: {
      width: 80
    }
  }
  return (
    <Card.Simple>
      <Card.Body>
        <Text className="fs-15"> {props.data & props.data.title ? props.data.title : "N/A"} </Text>

        <div className="d-flex">
          <div style={styles.customWidth}>
            <Text className="fs-13 mb-0">Bonus Amount </Text>
            <Text className="fs-13 mb-0">Bonus Type </Text>
          </div>
          <div>
            <Text className="fs-13 mb-0">: {props.data & props.data.amount ? props.data.amount : 0} tk. </Text>
            <Text className="fs-13 mb-0">: {props.data & props.data.type ? props.data.type : "N/A"} </Text>
          </div>
        </div>

        {/* data description with see more && see less */}
        <Text className="fs-13 mb-0"> {props.data & props.data.description && props.data.description.length > 35 ?
          <span>
            {props.data.description.slice(0, sliceAmount)}
            {props.data.description.length > sliceAmount ?
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setSliceAmount(props.data.description.length)}
              >...See More</span>
              :
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setSliceAmount(35)}
              >  See Less</span>
            }
          </span> :
          props.data.description
        }
        </Text>

        <div className='text-right'>
          <GrayButton
            className="circle-btn mr-1"
            onClick={() => props.updateEmployeePenalty()}
          ><Edit2 size={15} />
          </GrayButton>
          <DangerButton
            className="circle-btn"
            onClick={() => props.penaltyDelete()}
          ><Trash2 size={15} />
          </DangerButton>
        </div>
      </Card.Body>
    </Card.Simple>
  )
}