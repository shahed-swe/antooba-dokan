import Axios from 'axios'
import { API } from '../../Api'

// all sms package for users
const SmsPackage = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    const response = await Axios.get(`${API}/sms-packages`, config)
    return response
}


// for all features of sms
const SmsFeatures = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/sms-features`, config)
}


const SMSPackage = {
    SmsPackage,
    SmsFeatures
}


export default SMSPackage