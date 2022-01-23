import Axios from "axios";
import { API } from "../../Api";


const DokanSupplierAdd = async (data) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/suppliers`, data, config)

}

const DokanSupplierUpdate = async (data) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.put(`${API}/suppliers/${data.uid}`, data, config)

}


const DokanSupplierList = async (page, perpage) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const uid = localStorage.getItem("dokanuid")
    return await Axios.get(`${API}/suppliers?dokan_uid=${uid}&page=${page || 1}&per_page=${perpage || 10}`, config)
}

const DokanSupplierShow = async (uid) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/suppliers/${uid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)

}

const DokanSupplierDelete = async (data) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/suppliers/${data}?dokan_uid=${localStorage.getItem("dokanuid")}`, config)

}


const DokanSupplierSearch = async (search) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/suppliers?dokan_uid=${localStorage.getItem('dokanuid')}&q=${search}`, config)

}


const Supplier = {
    DokanSupplierAdd,
    DokanSupplierUpdate,
    DokanSupplierList,
    DokanSupplierShow,
    DokanSupplierDelete,
    DokanSupplierSearch
}

export default Supplier;