import Axios from "axios";
import { API } from "../../Api";


// for all subcategory list
const SubCategoryList = async (uid) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/subcategories/${uid}?dokan_uid=${localStorage.getItem("dokanuid")}`, config)

}


// for adding sub category
const SubCategoryAdd = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const body = JSON.stringify(data);

    return await Axios.post(`${API}/categories`, body, config)

}


// for updating sub category
const SubCategoryUpdate = async (data) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }


    const newData = {
        name: data.name,
        description: data.description,
        dokan_uid: localStorage.getItem('dokanuid'),
        category_uid: data.category_uid,
        _method: "PUT"
    }

    const body = JSON.stringify(newData);

    return await Axios.post(`${API}/categories/${data.subcategory_uid}`, body, config)

}

const SubCategory = {
    SubCategoryList,
    SubCategoryAdd,
    SubCategoryUpdate
}

export default SubCategory;