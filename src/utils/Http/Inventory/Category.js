import Axios from "axios";
import { API } from "../../Api";


// for category list
const CategoryList = async () => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/categories?dokan_uid=${localStorage.getItem("dokanuid")}`, config)

}

// for category add
const CategoryAdd = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const body = JSON.stringify(data)
    return await Axios.post(`${API}/categories`, body, config)

}


// for category update
const CategoryUpdate = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/categories/${data.uid}`, data, config)

}


// for category delete
const CategoryDelete = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/categories/${data.uid}?dokan_uid=${localStorage.getItem("dokanuid")}`, config)

}


// Search
const CategorySearch = async(data) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/categories?dokan_uid=${localStorage.getItem('dokanuid')}&q=${data}`, config)
}

const Category = {
    CategoryList,
    CategoryAdd,
    CategoryUpdate,
    CategoryDelete,
    CategorySearch,
}


export default Category