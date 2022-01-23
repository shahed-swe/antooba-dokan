import { API } from "../Api";
import Axios from "axios";


const Index = async(page,perPage) => {
    const config = {
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/customer-dues?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_pag=${perPage}`, config)
}


const Search = async(query) => {
    const config = {
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/customer-dues?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}


const PayDue = async(customeruid,data) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/customer-dues/${customeruid}/pay`, data, config)
}


const Dues = {
    Index,
    Search,
    PayDue
}


export default Dues