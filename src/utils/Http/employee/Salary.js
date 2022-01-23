import Axios from 'axios'
import {API} from '../../Api'


// for Filtering employee by salary
const EmployeeSalaryIndex = async (page=0, perpage=0) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/employee-salaries?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


// for seacching employeesalary 
const EmployeeSalarySearch = async (query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-salaries?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}

const EmployeeSalaryShow = async(id) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/employee-salaries/${id}`, config)
}


const Salary = {
    EmployeeSalaryIndex,
    EmployeeSalarySearch,
    EmployeeSalaryShow
}

export default Salary