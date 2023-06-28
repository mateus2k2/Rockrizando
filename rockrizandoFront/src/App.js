// import { DatePicker } from 'antd';
import React, { /* Fragment */ } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { Layout } from 'antd';

import Parties from './parties/Parties'
import NewParty from './parties/NewParty'
import Auth from './users/Auth'
import UserProfile from './users/UserProfile'
import CreateUser from './users/CreateUser'

import Sidebar from './shared/Navbar/Navbar'

import './App.css';

const {Content/* , Header, Footer, Sider */} = Layout;

function App() {
  return (

    <AuthProvider authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}>

      <Router>
        <Layout style={{ minHeight: '100vh' }}>

          <Sidebar />
          <Layout style={{ minHeight: '100vh' }}>


            <Content style={{ padding: '24px' }}>
              <Routes>

                <Route exact path="/" element={<Parties />} />

                <Route exact path="/auth" element={<Auth />} />
                <Route exact path="/createUser" element={<CreateUser />} />

                <Route exact path="/profile/" element={<UserProfile />} />
                <Route exact path="/newParty" element={<NewParty />} />

                <Route path={'/newParty'} element={
                  <RequireAuth loginPath={'/auth'}>
                    <NewParty />
                  </RequireAuth>
                } />

                <Route path={'/profile/'} element={
                  <RequireAuth loginPath={'/auth'}>
                    <UserProfile />
                  </RequireAuth>
                } />

                <Route path="*" element={<Navigate to="/auth" replace={true} />} />

              </Routes>
            </Content>
          </Layout>
        </Layout>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Router>

    </AuthProvider>
  );
}


export default App;