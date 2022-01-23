import { Text } from '../text/Text'
import './style.scss'

export const Calender = (props) => {
    const { date, choose } = props

    const styles = {
        absent: {
            backgroundColor: "#fc5e5e"
        },
        present: {
            backgroundColor: "#5a8bff"
        },
        holiday: {
            backgroundColor: "#5fe872"
        },
        presentPenalty: {
            backgroundColor: "#FF5FFF"
        }
    }

    let style = null

    if (choose === "holiday") {
        style = styles.holiday
    } else if (choose === "present") {
        style = styles.present
    } else if (choose === "absent") {
        style = styles.absent
    } else {
        style = styles.presentPenalty
    }

    return (
        <div className="text-center rounded custom" style={style}>
            <Text className="fs-16 pt-3 mb-0">{date}</Text>
        </div>
    )
}