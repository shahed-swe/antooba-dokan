import Axios from "axios";
import { API } from "../../Api";


// for adding product
const DokanProductAdd = async (data) => {

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/products`, data, config)

}


const DokanProductList = async (page = 0, perpage=0) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/products?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)

}

const DokanProductUpdate = async (data, uid) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/products/${uid}`, data, config)

}


const DokanSingleProductShow = async (uid) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/products/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)

}

const DokanProductDelete = async (uid) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/products/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)

}


const DokanProductSearch = async (search) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/products?dokan_uid=${localStorage.getItem('dokanuid')}&q=${search}`, config)

}


const Product = {
    DokanProductAdd,
    DokanProductList,
    DokanProductUpdate,
    DokanSingleProductShow,
    DokanProductDelete,
    DokanProductSearch
}

export default Product;