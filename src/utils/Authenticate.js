import jwtDecode from 'jwt-decode'

export const isLoggedin = (requestedRole) => {
    try{
        const token = localStorage.getItem("token")
        if (token) {
            let segments = token.split('.')
            atob(segments[0])
            let newtoken = jwtDecode(token)
            if(!newtoken || newtoken.exp * 1000 < Date.now() - (60 * 1000)) {
                localStorage.removeItem("token")
                return false
            }
            else{
                return true
            }

        }
        return false
    } catch (err) {
        localStorage.removeItem("token")
        return false;
    }
    
};