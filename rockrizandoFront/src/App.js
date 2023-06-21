// import { DatePicker } from 'antd';
import React, {Fragment} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import Parties from './parties/Parties'
import NewParty from './parties/NewParty'
import Auth from './users/Auth'
import UserProfile from './users/UserProfile'

import './App.css';

function App() {
  return (
    <Router>
      <Fragment>
        {/* Navbar */}
        <Routes>
          <Route exact path="/" element={<Parties/>}/>
          <Route exact path="/profile/:userId/" element={<UserProfile/>}/>
          <Route exact path="/auth" element={<Auth/>}/>
          <Route exact path="/newParty" element={<NewParty/>}/>
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
        {/* Footer */}
      </Fragment>
    </Router>
  );
}    


export default App;

// https://stackoverflow.com/questions/69864165/error-privateroute-is-not-a-route-component-all-component-children-of-rou