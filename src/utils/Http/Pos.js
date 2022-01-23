import { API } from "../Api";
import Axios from 'axios'

const CreatePos = async(data) => {
    const config = {
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }

    return Axios.post(`${API}/orders?dokan_uid=${localStorage.getItem('dokanuid')}`, data, config)
}


const POS = {
    CreatePos,
}


export default POS