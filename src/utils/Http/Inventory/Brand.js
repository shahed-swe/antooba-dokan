import Axios from "axios";
import { API } from "../../Api";


const DokanBrandList = async (page = null, perpage = null) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }



    if (page == null && perpage == null) {
        return await Axios.get(`${API}/brands?dokan_uid=${localStorage.getItem("dokanuid")}`, config)
    }
    else return await Axios.get(`${API}/brands?dokan_uid=${localStorage.getItem("dokanuid")}&page=${page}&per_page=${perpage}`, config)

}

const DokanBrandSearch = async (search) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/brands?dokan_uid=${localStorage.getItem('dokanuid')}&q=${search}`, config)

}

const DokanBrandStore = async (data) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/brands`, data, config)

}


const DokanBrandUpdate = async (data, uid) => {

    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/brands/${uid}`, data, config)

}


const DokanBrandDelete = async (data) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/brands/${data}?dokan_uid=${localStorage.getItem("dokanuid")}`, config)

}


const Brand = {
    DokanBrandList,
    DokanBrandSearch,
    DokanBrandStore,
    DokanBrandUpdate,
    DokanBrandDelete
}

export default Brand