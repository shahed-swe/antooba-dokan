import React, { useState, useEffect } from 'react'
import './style.scss'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { Images } from '../../utils/Images'
import { PrimaryButton } from '../../components/button/Index'
import Image from '../../components/image/Index'
import { Requests } from '../../utils/Http/Index';

const ResetPasswordConfirm = ({match}) => {
    const { t } = useTranslation()
    const { handleSubmit } = useForm()
    const [isChecking, setChecking] = useState(false)
    const history = useHistory()


    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) history.push('/')
    }, [history])

    const onSubmit = async (data) => {
        const usertoken = match.params.uid

        let useremail = ""
        let invitationemail = ""
        setChecking(true)

        const resuser = await Requests.Auth.UserProfile()
        if(resuser.status === 200 ){
            useremail = resuser.data.data.email
        }else{
            console.log(resuser)
        }

        const resinvite = await Requests.Shop.CheckInvite(usertoken)
        if(resinvite.status === 200){
            invitationemail = resinvite.data.invitation_to
        }else{
            console.log(resuser)
        }

        if(useremail !== invitationemail){
            console.log("You are not invited to this dokan")
        }else{
            console.log("You are invited to this dokan")
        }
    
    }

    return (
        <div className="auth-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-none border-0">
                            <div className="card-header bg-white px-0">
                                <div className="text-center mb-4">
                                    <Image
                                        x={90}
                                        y={90}
                                        src={Images.Logo}
                                        alt="Company Logo"
                                    />
                                </div>
                                <h4 className="mb-2 text-center">{t("Dokan Invitation")}</h4>
                                <p className="mb-0 text-center">{t("It's free to check invitation and only takes some seconds.")}</p>
                            </div>
                            <div className="card-body px-0">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    <PrimaryButton
                                        type="submit"
                                        style={{ width: "100%" }}
                                        disabled={isChecking}
                                    >{isChecking ? t("Checking invitation") + ' ...' : t("Check Invitaiton")}</PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordConfirm;
