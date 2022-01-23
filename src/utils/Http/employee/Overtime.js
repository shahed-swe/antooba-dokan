import Axios from "axios";
import { API } from "../../Api";


// for overtime index
const OvertimeIndex = async (date, page=0, perpage=0) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-overtime?dokan_uid=${localStorage.getItem('dokanuid')}&overtime_date=${date}&page=${page}&per_page=${perpage}`, config)
}

// for overtime index search 
const OvertimeSearch = async(date, query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-overtime?dokan_uid=${localStorage.getItem('dokanuid')}&overtime_date=${date}&q=${query}`, config)
}

// for filter by shift
const EmployeeOvertimeFilterShift = async (date, shift) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-overtime?dokan_uid=${localStorage.getItem('dokanuid')}&overtime_date=${date}&shift=${shift}`, config)
}


// for overtime create
const OvertimeCreate = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/employee-overtime`, data, config)
}



const Overtime = {
    OvertimeIndex,
    OvertimeSearch,
    EmployeeOvertimeFilterShift,
    OvertimeCreate
}

export default Overtime;