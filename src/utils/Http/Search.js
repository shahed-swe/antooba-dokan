import Axios from 'axios'
import { API } from '../Api'

// search suggestions
const SearchSuggestion = async (data) => {
    try {
        const response = await Axios.get(`${API}users?username=${data}`)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) console.log(error)
    }
}

export const Search = {
    SearchSuggestion
}