import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
    // Aqui você pode adicionar a lógica para salvar as alterações feitas pelo usuário
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    // Aqui você pode adicionar a lógica para cancelar as alterações
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-picture">
          {/* Aqui você pode renderizar a foto do perfil */}
          <img src="profile-picture.jpg" alt="Profile" />
        </div>
        <h1>{name}</h1>
      </div>
      {isEditMode ? (
        <form>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className="edit-buttons">
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </div>
  );
};

export default UserProfile;
