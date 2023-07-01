import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useIsAuthenticated } from 'react-auth-kit';
import jwt_decode from "jwt-decode";
import { Button, Form, Input, Spin, message } from 'antd';
import antIcon from '../shared/Spin.js';
import { validatePasswordPromise,validadeNamePromise, validadeEmailPromise, validatePassword, validadeEmail } from '../shared/Validators.js';


const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});

  // Redirect to home page if user is already logged in
  const handleRedirect = () => {
    if (isAuthenticated()) {
      navigate('/');
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    let token;

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      dateOfBirth: values.dateOfBirth,
    };

    // Send create user request
    try {
      setLoading(true);
      const response = await axios.post('/api/create_user', userData);
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
      setLoading(false);
      console.error('Erro ao criar usuário:', error);
      setErrorMessage('Erro ao criar usuário. Por favor, tente novamente.');
      setSuccessMessage('');
    }
  };

  // Handle form submission errors
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h1>Criação de Novo Usuário</h1>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <Form
        name="createUser"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o nome!',
            },
            { validator: validadeNamePromise }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o email!',
            },
            { validator: validadeEmailPromise },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a senha!',
            },
            { validator: validatePasswordPromise },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirme a Senha"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Por favor, confirme a senha!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('As senhas não correspondem!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Data de Nascimento"
          name="dateOfBirth"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a data de nascimento!',
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          shouldUpdate
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          {({ getFieldsValue }) => {
            const { name, email, password, confirmPassword, dateOfBirth } = getFieldsValue();
            const formIsComplete = name && validadeEmail(email) && validatePassword(password) && confirmPassword && dateOfBirth;

            return (
              <React.Fragment>
                <Button type="primary" htmlType="submit" disabled={!formIsComplete}>
                  Criar Usuário
                </Button>

                {loading && (
                  <div style={{ marginTop: '10px' }}>
                    <Spin indicator={antIcon} />
                  </div>
                )}
              </React.Fragment>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
