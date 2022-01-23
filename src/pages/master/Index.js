import React, { useState } from 'react'
import './style.scss'
import { Switch, Route } from 'react-router-dom'
import { routes } from '../../routes/Index'

import Navbar from '../../components/navbar/Index'
import Drawer from '../../components/drawer/Index'
import FourOFour from '../fourOfour/Index'

const Index = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="master">
            <Navbar menu={true} drawer={() => setOpen(true)} />
            <Drawer show={open} onHide={() => setOpen(false)} />

            <div className="main">
                <Switch>

                    {routes && routes.map((item, i) =>
                        item.name && item.path ?
                            <Route
                                key={i}
                                exact={item.exact}
                                path={item.path}
                                component={item.component}
                            />
                            : item.children && item.children.length ? item.children.map((child, j) =>
                                child.path ?
                                    <Route
                                        key={j}
                                        exact={child.exact}
                                        path={child.path}
                                        component={child.component}
                                    />
                                    : child.children && child.children.length ? child.children.map((leaf, k) =>
                                        <Route
                                            key={k}
                                            exact={leaf.exact}
                                            path={leaf.path}
                                            component={leaf.component}
                                        />
                                    ) : null
                            )
                                : null
                    )}

                    <Route path="*">
                        <FourOFour mt={"-70px"} />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default Index;
