import React from 'react'
import { Card } from '../card/Index'
import { Text } from '../text/Text'
import moment from 'moment'
import { Edit2, Trash2 } from 'react-feather'
import { DangerButton, GrayButton } from '../button/Index'

export const ShiftCard = (props) => {
    const styles = {
        customWidth: {
            width: 80
        }
    }
    const weekend = props.data && props.data.weekend ? props.data.weekend.split(',') : null;
    return (
        <Card.Simple>
            <Card.Body>
                <Text className="fs-15">{props.data.title ? props.data.title : "N/A"}</Text>
                <div className="d-flex">
                    <div style={styles.customWidth}>
                        <Text className="fs-13 mb-0">Start Time </Text>
                        <Text className="fs-13 mb-0">End Time </Text>
                        <Text className="fs-13 mb-0">Weekend </Text>
                    </div>
                    <div>
                        <Text className="fs-13 mb-0">: {moment(props.data.start_time ? props.data.start_time : "N/A", ['HH.mm']).format('hh:mm a')} </Text>
                        <Text className="fs-13 mb-0">: {moment(props.data.end_time ? props.data.end_time : "N/A", ['HH.mm']).format('hh:mm a')} </Text>
                        <Text className="fs-13 mb-0">: {
                            weekend ? weekend.map((item, i) => {
                                return <span key={i} className="badge badge-primary mr-1">{item}</span>
                            }) : "N/A"
                        }
                        </Text>
                    </div>
                </div>
                <div className='text-right'>
                    <GrayButton
                        className="circle-btn mr-1"
                        type="button"
                        onClick={() => props.updateEmployeeShift()}
                    >
                        <Edit2 size={15} />
                    </GrayButton>


                    <DangerButton
                        className="circle-btn"
                        onClick={() => props.shiftDelete()}
                    ><Trash2 size={15} />
                    </DangerButton>
                </div>
            </Card.Body>
        </Card.Simple>
    )
}