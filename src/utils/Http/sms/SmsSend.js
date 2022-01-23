import Axios from 'axios'
import { API } from '../../Api'



// for all user for sending sms
const AllSmsUser = async (query) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/customer-suppliers?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}


// for sending sms to single user
const SendSms = async(data) =>{
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/dokan-sms-single`, data, config)
}

// for sending bulk sms
const SendBulkSms = async(data, tosend) =>{
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/dokan-sms?dokan_uid=${localStorage.getItem('dokanuid')}&to=${tosend}`, data, config)
}


// for sms history
const SmsHistory = async(page, perpage) =>{
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/sms-history?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
}

//  dokan user sms details
const SMSDetails = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/dokan-sms?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


const SMSSend = {
    AllSmsUser,
    SendSms,
    SendBulkSms,
    SmsHistory,
    SMSDetails
}


export default SMSSend