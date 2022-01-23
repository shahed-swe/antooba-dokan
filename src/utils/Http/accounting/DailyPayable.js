import Axios from "axios";
import { API } from "../../Api";


// for list of all Daily payable
const DailyPayableIndex = async (perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-payables/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}`, config)
}


// for Daily payable index search 
const DailyPayableSearch = async(query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/daily-payables/?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}

// Daily payable index filter by from date
const FilterByFromDate = async (formDate,perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-payables/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}`, config)
}


// Daily payable index filter by from and to date
const FilterByFromToDate = async (formDate,toDate,perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-payables/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}&to=${toDate}`, config)
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


const DailyPayable = {
    DailyPayableIndex,
    DailyPayableSearch,
    FilterByFromDate,
    FilterByFromToDate,
    PenaltyCreate,
    PenaltyUpdate,
    PenaltyDelete,
    PenaltyDetail,
    AttendanceCreate
}

export default DailyPayable