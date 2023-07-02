import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { Layout, theme } from 'antd';

import Parties from './parties/Parties'
import NewParty from './parties/NewParty'
import Login from './users/Login'
import Register from './users/Register'
import UserProfile from './users/UserProfile'
import People from './friends/People'
import Friends from './friends/Friends'
import Profile from './friends/Profile'

import Sidebar from './shared/Navegation/Sider'

import './App.css';

const { Content, Header, Footer} = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  return (

    <AuthProvider authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}>

      <Router>
        <Layout style={{ minHeight: '100vh' }}>

          <Sidebar />

          <Layout style={{ minHeight: '100vh' }}>

            <Header theme="dark" style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className = ".logo-text"> </Header>

            <Content style={{ padding: '24px' }}>
              <Routes>

                <Route exact path="/" element={<Parties />} />

                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/people" element={<People />} />

                <Route path={'/user/profile/'} element={
                  <RequireAuth loginPath={'/login'}>
                    <UserProfile />
                  </RequireAuth>
                } />

                <Route path={'/user/:userid/profile/'} element={
                  <RequireAuth loginPath={'/login'}>
                    <Profile />
                  </RequireAuth>
                } />

                <Route path={'/user/:userid/friends/'} element={
                  <RequireAuth loginPath={'/login'}>
                    <Friends />
                  </RequireAuth>
                } />  

                <Route path={'/user/:userid/purchases/'} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyPurchases/> */}
                  </RequireAuth>
                } />           

                <Route path={'/user/:userid/parties/'} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyParties/> */}
                  </RequireAuth>
                } />

                <Route path={'/user/:userid/'} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* <UserProfile /> */}
                  </RequireAuth>
                } />


                <Route path={'/party/new'} element={
                  <RequireAuth loginPath={'/login'}>
                    <NewParty />
                  </RequireAuth>
                } />


                <Route path={"/party/:partyId/"} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyDetail/> */}
                  </RequireAuth>
                } />

                <Route path={"/party/:partyId/check/"} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyCheck/> */}
                  </RequireAuth>
                } />

                <Route path={"/party/:partyId/update/"} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyUpdate/> */}
                  </RequireAuth>
                } />

                <Route path={"/party/:partyId/buy/"} element={
                  <RequireAuth loginPath={'/login'}>
                    {/* < PartyBuy/> */}
                  </RequireAuth>
                } />

                <Route path="*" element={<Navigate to="/" replace={true} />} />

              </Routes>
            </Content>

            <Footer style={{ textAlign: 'center' }}>  </Footer>
          
          </Layout>
        </Layout>
        </Router>

    </AuthProvider>
  );
}


export default App;