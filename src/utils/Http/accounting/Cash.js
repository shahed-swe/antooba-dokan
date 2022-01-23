import Axios from "axios";
import { API } from "../../Api";

// for penalty create
const AttendanceCreate = async (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/employee-attendance`, data, config)
}


// for fetching all attendance
const AttendanceList = async (date,page=0,perpage=0) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/employee-attendance?dokan_uid=${localStorage.getItem("dokanuid")}&attendance_date=${date}&page=${page}&per_page=${perpage}`, config)
}

// for filter employee with shift
const AttendanceListFilterByShift = async (date,shift,page,perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/employee-attendance?dokan_uid=${localStorage.getItem("dokanuid")}&attendance_date=${date}&shift=${shift}&page=${page}&per_page=${perpage}`, config)
}

// for Attendance index search 
const AttendanceSearch = async(date, query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-attendance?dokan_uid=${localStorage.getItem('dokanuid')}&attendance_date=${date}&q=${query}`, config)
}


const Cash = {
    AttendanceCreate,
    AttendanceList,
    AttendanceListFilterByShift,
    AttendanceSearch
}

export default Cash