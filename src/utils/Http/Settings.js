import Axios from 'axios'
import { API } from '../Api'

// dokan setting data
const DokanSettingInformation = async () => {
    const header = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }

    const dokanuid = localStorage.getItem('dokanuid')
    const response = await Axios.get(`${API}/settings/${dokanuid}`, header)
    return response
}


// Store dokan general data
const DokanGeneral = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }
    const dokanuid = JSON.parse(localStorage.getItem('dokanuid'))


    return await Axios.post(`${API}/dokan/general/${dokanuid}`, data, config)

}

const UserInformationUpdate = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    const newdata = {
        name: data.name,
        email: data.email,
        phone_no: data.phone
    }

    const response = await Axios.put(`${API}/personalinfo`, newdata, config)
    return response
}


const DokanLocationUpdate = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/settings/${localStorage.getItem('dokanuid')}`, data, config)
}


const DokanNotificationUpdate = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/settings/${localStorage.getItem('dokanuid')}`, data, config)
}

const DokanMessageNotification = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/settings/${localStorage.getItem('dokanuid')}`, data, config)
}


const DokanAuthentication = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.put(`${API}/settings/${localStorage.getItem('dokanuid')}`, data, config)
}


const DokanInvoice = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}}`
        }
    }
    return await Axios.put(`${API}/settings/${localStorage.getItem('dokanuid')}`, data, config)
}

// for all dokan units
const AllUnits = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }


    return await Axios.get(`${API}/units`, config)

}

// for selected dokan measurements units
const DokanMeasurementsUnits = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    return await Axios.get(`${API}/measurement-units?dokan_uid=${localStorage.getItem('dokanuid')}`, config)

}

const DokanMeasurementsAdd = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}}`
        }
    }

    const body = JSON.stringify(data)

    return await Axios.post(`${API}/measurement-units`, body, config)

}

const DokanMeasurementsDelete = async (unituid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}}`
        }
    }

    return await Axios.delete(`${API}/measurement-units/${unituid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}

const DokanActivityLog = async (page, perpage) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.get(`${API}/dokan-activity-logs/${localStorage.getItem('dokanuid')}?page=${page}&per_page=${perpage}`, config)
}

const DokanMembers = async (page, perpage) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }


    return await Axios.get(`${API}/dokan-members/${localStorage.getItem('dokanuid')}?page=${page}&per_page=${perpage}`, config)

}


const DokanMemberDelete = async (memberuid) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }

    return await Axios.delete(`${API}/members/${memberuid}?dokan_uid=${localStorage.getItem('dokanuid')}`, config)
}


const Settings = {
    DokanSettingInformation,
    DokanGeneral,
    UserInformationUpdate,
    DokanLocationUpdate,
    DokanNotificationUpdate,
    DokanMessageNotification,
    DokanAuthentication,
    DokanInvoice,
    AllUnits,
    DokanMeasurementsUnits,
    DokanMeasurementsAdd,
    DokanMeasurementsDelete,
    DokanActivityLog,
    DokanMembers,
    DokanMemberDelete
}

export default Settings
