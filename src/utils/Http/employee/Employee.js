import Axios from "axios";
import { API } from "../../Api";

// for showing employee list
const EmployeeList = async (page, perpage) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employees?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
}


// for filtering employee list

const EmployeeFilter = async(shift=null, date=null) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employees?dokan_uid=${localStorage.getItem('dokanuid')}&shift=${shift}&date=${date}`, config)
}

// for adding employee
const EmployeeAdd = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/employees`, data, config)

}


// for updating employee
const EmployeeUpdate = async (data, uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/employees/${uid}`, data, config)

}


// for deleteing employee
const EmployeeDelete = async (uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.delete(`${API}/employees/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)

}


// for searching employee
const EmployeeSearch = async (search) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/employees?dokan_uid=${localStorage.getItem('dokanuid')}&q=${search}`, config)

}


// for showing employee single show
const EmployeeShow = async (uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employees/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


const Employee = {
    EmployeeList,
    EmployeeAdd,
    EmployeeUpdate,
    EmployeeDelete,
    EmployeeSearch,
    EmployeeShow,
    EmployeeFilter
}


export default Employee