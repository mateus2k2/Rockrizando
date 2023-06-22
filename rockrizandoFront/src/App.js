// import { DatePicker } from 'antd';
import React, {Fragment} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import { AuthProvider,RequireAuth } from 'react-auth-kit'

import Parties from './parties/Parties'
import NewParty from './parties/NewParty'
import Auth from './users/Auth'
import UserProfile from './users/UserProfile'

import './App.css';

function App() {
  return (

    <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain = {window.location.hostname}
                  cookieSecure = {window.location.protocol === "https:"}>
      
      <Router>
        <Fragment>
          {/* Navbar */}
          <Routes>


            <Route exact path="/" element={<Parties/>}/>
            <Route exact path="/profile/:userId/" element={<UserProfile/>}/>
            <Route exact path="/auth" element={<Auth/>}/>
            <Route exact path="/newParty" element={<NewParty/>}/>
            
            
            {/* Exemplo rota segura que so pode ser acessada caso o usuário esteja logado */}
            <Route path={'/secure'} element={
            <RequireAuth loginPath={'/auth'}>
              <div>
                Secure
              </div>
            </RequireAuth>
            }/>
            
            <Route path="*" element={<Navigate to="/auth" replace={true} />} />
          
          
          </Routes>
          {/* Footer */}
        </Fragment>
      </Router>

    </AuthProvider>
  );
}    


export default App;