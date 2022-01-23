import React from 'react'
import './style.scss'
import { TreeMenu } from '../drawerMenu/Index'
import { routes } from '../../routes/Index'

const Index = (props) => {
    return (
        <div>
            <div className="drawer-container">
                <div
                    onClick={props.onHide}
                    className={props.show ? "backdrop d-lg-none open-backdrop" : "backdrop d-lg-none"}
                />

                {/* Drawer */}
                <div className={props.show ? "drawer open-drawer" : "drawer"}>
                    <div className="drawer-body">
                        <TreeMenu options={routes} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;
