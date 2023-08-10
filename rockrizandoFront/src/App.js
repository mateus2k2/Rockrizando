import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { Layout, theme } from 'antd';

import Login from './users/Login'
import Register from './users/Register'
import UserProfile from './users/UserProfile'

import Parties from './parties/Parties'
import NewParty from './parties/NewParty'
import PartyDetails from './parties/PartyDetails'
import UserParties from './parties/UserParties'
import UserParty from './parties/UserParty'
import PartyPurchases from './parties/PartyPurchases';
import PartyUpdate from './parties/PartyUpdate';

import TicketSelection from './ticket/TicketSelection';
import UserTickts from './ticket/UserTickets';
import UserTickt from './ticket/UserTicket';
import TicketDetail from './ticket/TicketDetail';

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

          <Sidebar /> {/* Fazer logout */}
          

          <Layout style={{ minHeight: '100vh' }}>

            <Header theme="dark" style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className = ".logo-text"> </Header>

            <Content style={{ padding: '24px' }}>
              <Routes>

                <Route exact path="/" element={<Parties />} />

                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/party/:partyId/" element={<PartyDetails />} />

                <Route path={'/user/:userid/profile/'} element={
                  <RequireAuth loginPath={'/login'}>
                    <UserProfile />
                  </RequireAuth>
                } />

                {/* mostrar listas com as festas compradas pelo usuario. Linkar cada festa para a lista de tickets de cada usuario daquela festa */}
                <Route path={'/user/:userid/purchases/'} element={
                  <RequireAuth loginPath={'/login'}>
                    < PartyPurchases/>
                  </RequireAuth>
                } /> 

                {/* mostrar listas com os tickets de uma certa festa de um certo usuário */}
                <Route path={'/user/:userid/purchases/:partyid'} element={
                  <RequireAuth loginPath={'/login'}>
                    < UserTickts/>
                  </RequireAuth>
                } /> 

                {/* mostrar detalhes de um certo ingresso de uma certa festa de um certo cara*/}
                <Route path={'/user/:userid/ticket/:ticketid'} element={
                  <RequireAuth loginPath={'/login'}>
                    < UserTickt/>
                  </RequireAuth>
                } />           

                {/* mostra detalhe de um certo ingresso */}
                <Route path={'/tickets/:ticketUUID'} element={
                  <RequireAuth loginPath={'/login'}>
                    < TicketDetail/>
                  </RequireAuth>
                } />

                <Route path={'/user/:userid/parties/'} element={
                  <RequireAuth loginPath={'/login'}>
                    < UserParties/>
                  </RequireAuth>
                } />

                {/* Botao de deletar festa e editar festa */}
                <Route path={'/user/:userid/parties/:partyId'} element={
                  <RequireAuth loginPath={'/login'}>
                    < UserParty/>
                  </RequireAuth>
                } />

                {/* Editar Festa */}
                <Route path={'/user/:userid/party/:partyId/update'} element={
                  <RequireAuth loginPath={'/login'}>
                      < PartyUpdate/>
                  </RequireAuth>
                } />


                <Route path={'/party/new'} element={
                  <RequireAuth loginPath={'/login'}>
                    <NewParty />
                  </RequireAuth>
                } />

                <Route path={"/party/:partyId/buy/"} element={
                  <RequireAuth loginPath={'/login'}>
                    < TicketSelection/>
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