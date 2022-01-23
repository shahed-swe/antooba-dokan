import Axios from 'axios';
import { API } from '../Api'


// for all customer list
const AllCustomer = async (page, perpage) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/customers?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
}



// for adding customer
const AddCustomer = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/customers`, data, config)


}


// for updating customer
const UpdateCustomer = async (data, uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/customers/${uid}`, data, config)


}


// for deleting customer
const DeleteCustomer = async (uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }



    return await Axios.delete(`${API}/customers/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)


}


// for showing single customer
const ShowCustomer = async (uid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/customers/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)


}


const CustomerSearch = async (search) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/customers?dokan_uid=${localStorage.getItem('dokanuid')}&q=${search}`, config)

}

const Customer = {
    AllCustomer,
    AddCustomer,
    UpdateCustomer,
    DeleteCustomer,
    ShowCustomer,
    CustomerSearch
}


export default Customer;