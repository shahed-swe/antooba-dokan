import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/button/Index'
import { Images } from '../../utils/Images'

const Index = (props) => {
    return (
        <div className="four-o-four" style={{ marginTop: "20px" }}>
                    <div className="flex-center flex-column px-4">
                        <img src={Images.FourZeroZero} className="img-fluid" alt="Page not found" />
                        <p>You were not invited! Please check your invitation link again</p>
                        <Link to="/">
                            <PrimaryButton style={{ padding: "8px 30px" }}>Go Back</PrimaryButton>
                        </Link>
                    </div>
                </div>
    );
}

export default Index;