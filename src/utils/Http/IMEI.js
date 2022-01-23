import Axios from "axios";
import { API } from "../Api";

// Single product code
const SingleProductCode = async (page, per_page) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/single-code-products/${localStorage.getItem("dokanuid")}?page=${page || 0}&per_page=${per_page || 10}`, config)
}

// Separate product code
const SeparateProductCode = async (page, per_page) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/separate-code-products/${localStorage.getItem("dokanuid")}?page=${page || 0}&per_page=${per_page || 10}`, config)
}

// Search in single product code
const SearchSingleProductCode = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const dokanId = localStorage.getItem('dokanuid')
    return await Axios.get(`${API}/single-code-products/${dokanId}?q=${data}`, config)
}

// Search in separate product code
const SearchSeparateProductCode = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const dokanId = localStorage.getItem('dokanuid')
    return await Axios.get(`${API}/separate-code-products/${dokanId}?q=${data}`, config)
}

// Update single product code
const UpdateToSingleProductCode = async (data, uid) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/single-code-products/${uid}`, data, config)
}

// Update separate product code
const UpdateToSeparateProductCode = async (data, uid) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/separate-code-products/${uid}`, data, config)
}

const IMEI = {
    SingleProductCode,
    SeparateProductCode,
    SearchSingleProductCode,
    SearchSeparateProductCode,
    UpdateToSingleProductCode,
    UpdateToSeparateProductCode,
}

export default IMEI;