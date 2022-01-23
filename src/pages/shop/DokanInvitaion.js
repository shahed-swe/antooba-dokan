import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Toast from '../../components/Toaster/Index'
import { Link } from 'react-router-dom'

import { Images } from '../../utils/Images'
import { PrimaryButton, PrimaryOutlineButton } from '../../components/button/Index'
import { Image } from '../../components/image/Index'
import { Requests } from '../../utils/Http/Index';
import { Loader } from '../../components/loading/Index'
import { isValidEmail, isValidPhone } from '../../utils/_heplers'

const ResetPasswordConfirm = ({ match }) => {
    const { t } = useTranslation()
    const history = useHistory()
    const [accept, setAccept] = useState(false)
    const [isAccepting, setAccepting] = useState(false)
    const [isLoading, setLoading] = useState(false)


    useEffect(() => {
        // check if logged in
        const token = localStorage.getItem('token')
        if (!token) {
            localStorage.setItem("invitation", match.params.uid)
            history.push('/')
        }
    }, [history, match])


    const fetchData = useCallback(async () => {

        setLoading(true)

        const usertoken = match.params.uid
        const resinvite = await Requests.Shop.CheckInvite(usertoken)

        if (resinvite.status === 200) {

            const resuser = await Requests.Auth.UserProfile()

            if (resuser.status === 200) {

                let user_uid = resuser.data.data.uid;
                let useremail = resuser.data.data.email;
                let userphone = resuser.data.data.phone_no;

                let invited_by = resinvite.data.invited_by;
                let invitation_to = resinvite.data.invitation_to;

                if (user_uid === invited_by) {
                    history.push('/invitation/error')
                } else if (invitation_to.match(isValidEmail) && useremail === invitation_to) {
                    history.push('/invitation/error')
                } else if (invitation_to.match(isValidPhone) && userphone === invitation_to) {
                    history.push('/invitation/error')
                } else {
                    setAccept(true)
                    setLoading(false)
                }

            }

        } else {
            setLoading(false)
            history.push('/invitation/error')

        }
    }, [history, match.params.uid])


    useEffect(() => {
        fetchData()
    }, [fetchData])


    if (isLoading) {
        return <Loader signal={'true'} />
    }



    const handleAccept = async () => {

        setAccepting(true)
        const res = await Requests.Shop.AcceptInvite({ invitation_uid: match.params.uid })
        console.log(res)

        if (res.status === 200) {
            Toast.fire({
                icon: 'success',
                title: 'Dokan Invitation Accepted Successfully'
            })
            history.push('/')
            setAccepting(false)
        } else {
            setAccepting(false)
        }
    }


    const handleReject = () => {
        setLoading(false)
        history.push('/shop')
    }




    return (
        <div>
            {accept ? (
                <div className="auth-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-none border-0">
                                    <div className="card-header bg-white px-0 border-0">
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
                                    <div className="card-body px-0 pt-0" style={{}}>
                                        <div className="d-flex justify-content-center">
                                            <PrimaryOutlineButton
                                                type="submit"
                                                style={{ width: "40%" }}
                                                disabled={isAccepting}
                                                className="px-5 mr-2"
                                                onClick={handleReject}
                                            >{t("Reject")}</PrimaryOutlineButton>

                                            <PrimaryButton
                                                type="submit"
                                                style={{ width: "40%" }}
                                                disabled={isAccepting}
                                                className="px-5 mr-3"
                                                onClick={handleAccept}
                                            >{isAccepting ? t("Accepting...") : t("Accept")}</PrimaryButton>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="four-o-four" style={{ marginTop: "20px" }}>
                    <div className="flex-center flex-column px-4">
                        <img src={Images.FourZeroZero} className="img-fluid" alt="Page not found" />
                        <p>You were not invited or not Signed In! Please check your invitation link again</p>
                        <Link to="/">
                            <PrimaryButton style={{ padding: "8px 30px" }}>Go Back</PrimaryButton>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResetPasswordConfirm;
