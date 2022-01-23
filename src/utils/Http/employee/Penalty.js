import Axios from "axios";
import { API } from "../../Api";


// for list of all penalty
const PenaltyList = async () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employeepenalty?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


// for penalty create
const PenaltyCreate = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/employeepenalty`, data, config)
}


// for penalty update
const PenaltyUpdate = async (data, uid) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/employeepenalty/${uid}`, data, config)
}


// for penalty delete
const PenaltyDelete = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/employeepenalty/${data}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


// for penalty detail
const PenaltyDetail = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employeepenalty/${data}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

// for penalty create
const AttendanceCreate = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/employee-attendance`, data, config)
}


const Penalty = {
    PenaltyList,
    PenaltyCreate,
    PenaltyUpdate,
    PenaltyDelete,
    PenaltyDetail,
    AttendanceCreate
}

export default Penalty