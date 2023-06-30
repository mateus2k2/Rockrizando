import React, { useState } from 'react';
import axios from 'axios';

import './UserProfile.css'; // Importando o arquivo CSS personalizado

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      const userData = new FormData();
      userData.append('name', formData.name);
      userData.append('email', formData.email);
      userData.append('password', formData.password);
      userData.append('confirmPassword', formData.confirmPassword);
      if (formData.profilePicture) {
        userData.append('profilePicture', formData.profilePicture);
      }

      try {
        const response = await axios.post('/api/update_user', userData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Dados do usuário atualizados:', response.data);
        setSuccessMessage('Dados do usuário atualizados com sucesso!');
        setErrorMessage('');
        setErrors({});
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        setErrorMessage('Erro ao atualizar dados do usuário. Por favor, tente novamente.');
        setSuccessMessage('');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.password.length > 0 && formData.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não correspondem';
    }
    return errors;
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-picture">
          <img src={formData.profilePicture} alt="Foto de Perfil" />
        </div>
        <h1>{formData.name}</h1>
      </div>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
        <div>
          <label>Foto de Perfil:</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Atualizar Perfil</button>
      </form>
      <div>
        <h2>Festas Participadas</h2>
        {/* Renderize aqui a lista de festas participadas pelo usuário */}
      </div>
    </div>
  );
};

export default UserProfile;
