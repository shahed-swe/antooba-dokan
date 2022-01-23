import React, { useState } from 'react'
import { Card } from '../card/Index'
import { Text } from '../text/Text'
import { Edit2, Trash2 } from 'react-feather'
import { DangerButton, GrayButton } from '../button/Index'

export const PenaltyCard = (props) => {
    const [sliceAmount, setSliceAmount] = useState(35)
    const styles = {
        customWidth: {
            width: 80
        }
    }
    return (
        <Card.Simple>
            <Card.Body>
                <Text className="fs-15">{props.data.name ? props.data.name : "N/A"}</Text>
                <Text className="fs-13 mb-0"> {props.data.title ? props.data.title : null} </Text>

                {/* data description with see more && see less */}
                <Text className="fs-13 mb-0"> {props.data.description && props.data.description.length > 35 ?
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
                <div className="d-flex">
                    <div style={styles.customWidth}>
                        <Text className="fs-13 mb-0">Fine Amount </Text>
                    </div>
                    <div>
                        <Text className="fs-13 mb-0">: {props.data.amount ? props.data.amount : 0} tk. </Text>
                    </div>
                </div>
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