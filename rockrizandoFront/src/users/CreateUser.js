import React, { useState } from 'react';
import axios from 'axios';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      try {
        const response = await axios.post('/api/create_user', formData);
        console.log('Usuário criado com sucesso:', response.data);
        setSuccessMessage('Usuário criado com sucesso!');
        setErrorMessage('');
      
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          dateOfBirth: '',
        });
        setErrors({});
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        setErrorMessage('Erro ao criar usuário. Por favor, tente novamente.');
        setSuccessMessage('');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não correspondem';
    }
    return errors;
  };

  return (
    <div>
      <h1>Criação de Novo Usuário</h1>
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
            required
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
            required
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Criar Usuário</button>
      </form>
    </div>
  );
};

export default CreateUserPage;
