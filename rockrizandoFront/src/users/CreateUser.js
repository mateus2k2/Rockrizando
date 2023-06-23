import React, { useState } from 'react';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Fazer a lógica de criação de usuário aqui
      // Por exemplo, enviar os dados para o backend ou executar outra ação
      console.log('Formulário enviado:', formData);
      // Limpar o formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
      });
      setErrors({});
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
