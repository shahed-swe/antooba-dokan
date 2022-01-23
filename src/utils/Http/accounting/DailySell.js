import Axios from "axios";
import { API } from "../../Api";


// for Daily Sell index
const DailySellIndex = async (perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-sells/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}`, config)
}

// for Daily Sell index search 
const DailySellSearch = async (query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/daily-sells/?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}

// Daily due index filter by from and to date
const FilterByFromDate = async (formDate, perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-sells/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}`, config)
}

// Daily due index filter by from and to date
const FilterByFromToDate = async (formDate, toDate, perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-sells/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}&to=${toDate}`, config)
}

const DailySell = {
    DailySellIndex,
    DailySellSearch,
    FilterByFromDate,
    FilterByFromToDate
}

export default DailySell