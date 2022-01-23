import Axios from 'axios';
import { API } from '../Api'

// Shop List Rendering
const ShopList = async () => {
    const config = {
        headers: {
            'Accpet': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }

    return await Axios.get(`${API}/dokans/`, config)


}

// for creating new shop
const CreateShop = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }

    const serializeddata = {
        title: data.shopName,
        shop_type: data.shopType,
        features: data.shopFeatures,
    }

    const body = JSON.stringify(serializeddata)

    return await Axios.post(`${API}/dokans/`, body, config)

}

// for updating new shop
const UpdateShop = async (shopid, data) => {

    const config = {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    const serializedupdatedata = {
        title: data.shopName,
        shop_type: data.shopType,
        features: data.shopFeatures,
    }
    const body = JSON.stringify(serializedupdatedata)

    return await Axios.put(`${API}/dokans/${shopid}`, body, config)

}

// for deleting new shop
const DeleteShop = async (shopid) => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.delete(`${API}/dokans/${shopid}`, config)

}

const FeatureList = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/features/`, config);
}

const ShopType = async () => {
    const config = {
        headers: {
            'Accpet': 'application/json',
            'Content-Type': 'application/json',
        }
    }
    return await Axios.get(`${API}/types/`, config);
}


const DokanShopType = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/dokans/`, config)
}

const DokanInvite = async (data) => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    const newdata = {
        ...data,
        dokan_uid: localStorage.getItem('dokanuid')
    }
    return await Axios.post(`${API}/invite-to-dokan`, newdata, config)
}


const CheckInvite = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        }
    }


    return await Axios.get(`${API}/check-invitation/${data}`, config)

}

const AcceptInvite = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.post(`${API}/accept-invitation`, data, config)

}


const Shop = {
    ShopType,
    CreateShop,
    UpdateShop,
    DeleteShop,
    ShopList,
    FeatureList,
    DokanShopType,
    DokanInvite,
    CheckInvite,
    AcceptInvite
}

export default Shop