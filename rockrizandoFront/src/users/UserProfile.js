import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import axios from 'axios';

const UserProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const auth = useAuthUser();
  const authHeader = useAuthHeader()

  useEffect(() => {
    // Fetch initial user information from the backend
    fetchUserInfo();
  });

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${auth().user}`, {
        headers: {
          Authorization: authHeader(),
        },
      });
      const userData = response.data;
      setName(userData.username);
      setEmail(userData.email);
      setBirthdate(userData.birth_date);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
    // Logic to save the changes made by the user
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    // Logic to cancel the changes
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

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-picture">
          {/* Render the profile picture here */}
          <img src={`http://localhost:5000/files/user/profile_picture_${auth().user}.jpg`} alt="Profile" />
        </div>
        <h1>{name}</h1>
      </div>
      {isEditMode ? (
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          <label htmlFor="birthdate">Birthdate:</label>
          <input type="date" id="birthdate" value={birthdate} onChange={handleBirthdateChange} />
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
