import Axios from "axios";
import { API } from "../../Api";

// for showing employee shift list
const EmployeeShiftList = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    const response = await Axios.get(`${API}/employeeshift?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
    return response
}

// for creating employee shift
const EmployeeShiftCreate = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/employeeshift`, data, config)

}


// for updating employee shift
const EmployeeShiftUpdate = async (data, uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/employeeshift/${uid}`, data, config)

}

// for deleteing employee shift
const EmployeeShiftDelete = async (uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/employeeshift/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

const Ledger = {
    EmployeeShiftList,
    EmployeeShiftCreate,
    EmployeeShiftUpdate,
    EmployeeShiftDelete
}


export default Ledger