import React from 'react'
import './App.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetRequest from './pages/auth/Reset'
import ShopIndex from './pages/shop/Index'
import DokanInvitation from './pages/shop/DokanInvitaion'
import InvitationError from './pages/shop/InvitationError'
import MasterIndex from './pages/master/Index'
import Messenger from './pages/messenger/Index'
import FourOFour from './pages/fourOfour/Index'

import ScrollToTop from './components/scrollTop/Index'
import RoleBaseRoute from './components/privateRoute/Index'

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/reset" component={ResetRequest} />
            <Route exact path="/invitation/:uid" component={DokanInvitation} />
            <Route exact path="/invitation/error" component={InvitationError} />
            <RoleBaseRoute path="/shop" role="admin" component={ShopIndex} />
            <RoleBaseRoute path="/dashboard" role="admin" component={MasterIndex} />
            <RoleBaseRoute path="/messenger" role="admin" component={Messenger} />
            <Route path="*" component={FourOFour} />
          </Switch>
        </ScrollToTop>
      </Router>
    </div>
  );
}

export default App;
