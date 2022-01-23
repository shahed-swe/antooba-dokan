import { API } from "../Api";
import Axios from "axios";


// installment index section
const Index = async(page, per_page) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/installments?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}$per_page=${per_page}`, config)
}

// Pay Installment
const Pay = async(uid,data) => {
    const config = {
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/installments/${uid}/pay`,data, config)
}

// view
const View = async(uid) => {
    const config = {
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/installments/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

const Installment = {
    Index,
    Pay,
    View,
}


export default Installment