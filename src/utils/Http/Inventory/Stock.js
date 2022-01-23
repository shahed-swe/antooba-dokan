import Axios from "axios";
import { API } from "../../Api";


// For adding new stock
const AddStock = async(data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    const response = await Axios.post(`${API}/stockin`, data, config)
    return response
}


// for removing stock from existing 
const StockOut = async(data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    const response = await Axios.post(`${API}/stockout`, data, config)
    return response
}

// for getting last batch id
const LastBatchIdStockIn = async() => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/last-batch-id?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
    
}


// stock in history index
const StockInHistory = async(page,perpage) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const response = await Axios.get(`${API}/stockin?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
    return response
}

// stock in history search
const StockInSearch = async(data) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    return Axios.get(`${API}/stockin?dokan_uid=${localStorage.getItem('dokanuid')}&q=${data}`, config)
}


// stock out history index
const StockOutHistory = async(page, perpage) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const response = await Axios.get(`${API}/stockout?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
    return response
}

// stock out history search
const StockOutSearch = async(data) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    return Axios.get(`${API}/stockout?dokan_uid=${localStorage.getItem('dokanuid')}&q=${data}`, config)
}


// Stock Delete 
const StockDelete = async(uid) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    return Axios.delete(`${API}/stockin/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


// stock status
const StockStatus = async(page, per_page) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    return Axios.get(`${API}/stock-status?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${per_page}`, config)
}

// stock status search
const StockStatusSearch = async(data) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    return Axios.get(`${API}/stock-status?dokan_uid=${localStorage.getItem('dokanuid')}&q=${data}`, config)
}

// stock status filter by category or brand
const StockStatusFilter = async(category=null, brand=null) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }
    if(category === null){
        return Axios.get(`${API}/stock-status?dokan_uid=${localStorage.getItem('dokanuid')}&brand_uid=${brand}`, config)
    }else if(brand === null){
        return Axios.get(`${API}/stock-status?dokan_uid=${localStorage.getItem('dokanuid')}&category_uid=${category}`, config)
    }else{
        return Axios.get(`${API}/stock-status?dokan_uid=${localStorage.getItem('dokanuid')}&category_uid=${category}&brand_uid=${brand}`, config)
    }
}

const Stock = {
    AddStock,
    StockOut,
    LastBatchIdStockIn,
    StockInHistory,
    StockInSearch,
    StockOutHistory,
    StockOutSearch,
    StockDelete,

    StockStatus,
    StockStatusSearch,
    StockStatusFilter,
}

export default Stock