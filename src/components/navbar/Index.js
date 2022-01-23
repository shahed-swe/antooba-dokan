import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
// import { Link } from 'react-router-dom'
import { Menu } from 'react-feather'
import Dropdown from './Dropdown'
import { Image } from '../image/Index'

import { Images } from '../../utils/Images'
// import { NotificationButton } from '../button/Index'
import { Notification } from '../../components/notification/Index'
import LanguageSelector from '../../components/languageSelector/Index'
// import { englishToBengali } from '../../utils/_heplers'
import { Requests } from '../../utils/Http/Index'
import { useHistory } from 'react-router'

const Index = (props) => {
    const [data, setData] = useState(null)
    const history = useHistory();

    const fetchData = useCallback(async () => {
        if (history.location.pathname !== "/shop") {
            try {
                const response = await Requests.Settings.DokanSettingInformation()
                if (response.status === 200) setData(response.data)
            } catch (error) {
                if (error) console.log(error)
            }
        }
    }, [history])

    useEffect(() => {
        fetchData()
    }, [fetchData])



    const dokantitle = data ? data.dokan.title : 'Antooba Dokan'

    const LogoSrc = data ? data.dokan.logo : Images.Logo
    return (
        <div className="navbar-container">
            <div className="d-flex">
                <div><Image src={LogoSrc ? LogoSrc : Images.Logo} alt="Company logo" x={42} y={42} /></div>
                <div><h6 className="text-capitalize mb-0">{dokantitle ? dokantitle : 'Antooba Dokan'}</h6></div>
                <div className="ml-auto">
                    {/* <Link to="/shop/">
                        <NotificationButton
                            type="button"
                            className="mr-2 mt-1"
                            badgeValue={englishToBengali(9)}
                        >
                            <Bell size={20} />
                        </NotificationButton>
                    </Link> */}
                    <Notification
                        total={10}
                        items={[
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' },
                            { name: 'mamun' }
                        ]}
                    />
                </div>
                <div><LanguageSelector /></div>
                <div><Dropdown /></div>

                {props.menu &&
                    <div className="d-lg-none pl-2">
                        <button
                            type="button"
                            className="btn shadow-none rounded-circle"
                            onClick={props.drawer}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Index;