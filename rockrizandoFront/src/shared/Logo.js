import React from 'react';
import './Logo.css';

const Logo = ({ collapsed }) => {
  return (
    <div className={`logo-container ${collapsed ? 'logo-collapsed' : ''}`}>
      <h1 className="logo-text">{collapsed ? 'R' : 'Rockrizando'}</h1>
    </div>
  );
};

export default Logo;