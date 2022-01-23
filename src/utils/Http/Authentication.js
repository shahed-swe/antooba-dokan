import Axios from 'axios'
import { API } from '../Api'

// Account Registration 
const Registration = async (data) => {
    const response = await Axios.post(`${API}/register`, data)
    return response
}

// Account verify
const VerifyPhone = async (data) => {
    const response = await Axios.post(`${API}/phone/verify`, data)
    return response
}

// resend verification code
const ResendPhoneVerificationCode = async (data) => {
    const response = await Axios.post(`${API}/phone-verification/resend`, data)
    return response
}

// Login to account
const Login = async (data) => {
    const response = await Axios.post(`${API}/login`, data)
    return response
}

const UserProfile = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }

    try {
        const res = await Axios.get(`${API}/profile`, config)
        return res
    } catch (err) {
        return err.response
    }
}

const UpdatePassword = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }
    return await Axios.put(`${API}/change-password`, data, config)
}


const RefreshToken = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }

    try {
        return await Axios.post(`${API}/refresh`, config)
    } catch (err) {
        return err.response
    }
}

// for sending reset token or code
const SendEmailOrPhoneForReset = async (data) => {
    const response = await Axios.post(`${API}/password/forgot`, data)
    return response
}

// for sending reset token or code
const CheckResetPasswordOtp = async (data) => {
    const response = await Axios.post(`${API}/reset/otp-check`, data)
    return response
}

// for sending reset token or code
const ResetPassword = async (data) => {
   const response = await Axios.post(`${API}/password/reset`, data)
   return response
}

// email verification
const EmailVerification = async(data) => {
    const response = await Axios.post(`${API}/email-verification/send`, data)
    return response
}


// verify email 
const VerifyEmail = async(data) => {
    return await Axios.post(`${API}/email/verify`, data)
}


// Security Login
const SecurityLogin = async (data) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }

    return await Axios.put(`${API}/security-login`, data, config)
}

// Pass two factor auth
const PassTwoFactor = async(data) => {
    return await Axios.post(`${API}/pass-two-factor-auth`, data)
}

const Auth = {
    Registration,
    Login,
    UserProfile,
    UpdatePassword,
    SendEmailOrPhoneForReset,
    RefreshToken,
    VerifyPhone,
    ResendPhoneVerificationCode,
    CheckResetPasswordOtp,
    ResetPassword,
    EmailVerification,
    VerifyEmail,
    SecurityLogin,
    PassTwoFactor
}

export default Auth