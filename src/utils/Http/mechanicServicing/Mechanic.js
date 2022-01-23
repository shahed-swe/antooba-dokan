import Axios from 'axios'
import { API } from '../../Api'

// List of items
const Index = async (page, perpage) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/mechanics?dokan_uid=${localStorage.getItem('dokanuid')}&page=${page}&per_page=${perpage}`, config)
}

// Search items
const Search = async (query) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/mechanics?dokan_uid=${localStorage.getItem('dokanuid')}&q=${query}`, config)
}

// Show specific item
const Show = async (id) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/mechanics/${id}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

// Store new item
const Store = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/mechanics`, data, config)
}

// Update specific item
const Update = async (id, data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.post(`${API}/mechanics/${id}`, data, config)
}

// Destroy specific item
const Destroy = async (id) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/mechanics/${id}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

const Mechanic = {
    Index,
    Search,
    Show,
    Store,
    Update,
    Destroy
}


export default Mechanic;