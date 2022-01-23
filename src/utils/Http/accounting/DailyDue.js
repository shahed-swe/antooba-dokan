import Axios from "axios";
import { API } from "../../Api";


// for Daily Due index
const DailyDueIndex = async (perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-dues/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}`, config)
}

// for Daily Due index search 
const DailyDueSearch = async(query) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/daily-dues/?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}

// Daily due index filter by from date
const FilterByFromDate = async (formDate,perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-dues/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}`, config)
}


// Daily due index filter by from and to date
const FilterByFromToDate = async (formDate,toDate,perpage) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/daily-dues/?dokan_uid=${localStorage.getItem('dokanuid')}&per_page=${perpage}&from=${formDate}&to=${toDate}`, config)
}


const DailyDue = {
    DailyDueIndex,
    DailyDueSearch,
    FilterByFromDate,
    FilterByFromToDate
}

export default DailyDue;