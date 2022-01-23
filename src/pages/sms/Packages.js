import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Layout, Main } from '../../components/layout/Index'
import { Container } from '../../components/container/Index'
import { Loader } from '../../components/loading/Index'
import { NetworkError } from '../../components/501/NetworkError'
import { NoContent } from '../../components/204/NoContent'
import { SmsPackage } from '../../components/smsPackage/SmsPackage'
import { GrayButton } from '../../components/button/Index'
import { Requests } from '../../utils/Http/Index'

const Packages = () => {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)



    // fetch all sms packages
    const fetchSmsPackages = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.SMS.SMSPackage.SmsPackage();
            if(response && response.status === 200){
                setData(response.data.data);
            }
            setLoading(false);
            
        } catch (error) {
            if(error){
                setServerError(true)
            }
            setLoading(false)
        }
    },[])
    


    useEffect(() => {
        fetchSmsPackages();
    },[fetchSmsPackages])


    const handleSelect = (data) => {
        console.log(data)
    }


    return (
        <div>
            <Layout
                page="dashboard / sms / packages"
                message="SMS Packages."
                container="container-fluid"
                button={
                    <Link to="/dashboard/sms">
                        <GrayButton type="button">
                            <ChevronLeft size={15} className="mr-2" />
                            <span style={{ fontSize: 13 }}>BACK</span>
                        </GrayButton>
                    </Link>
                }
            />
            <Main>
                {isLoading && !data.length && !serverError ? <Loader /> : null}
                {!isLoading && !data.length && !serverError ? <NoContent message="No content available." /> : null}
                {!isLoading && !data.length && serverError ? <NetworkError message="Network error." /> : null}

                {!isLoading && !serverError && data.length ?
                    data.map((item, i) =>
                        <Container.Column className="col-sm-6 col-md-4 col-xl-3 p-2" key={i}>
                            <SmsPackage data={item}  setServerError={setServerError} handleSelect={handleSelect}/>
                        </Container.Column>
                    ) : null
                }
            </Main>
        </div>
    )
}

export default Packages;