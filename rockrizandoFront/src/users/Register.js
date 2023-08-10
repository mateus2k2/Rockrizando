import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import { Button, Form, Input, Spin, Upload, message, DatePicker, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import antIcon from '../shared/Spin.js';
import { validatePasswordPromise, validadeNamePromise, validadeEmailPromise, validatePassword, validadeEmail } from '../shared/Validators.js';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CreateUser = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const beforeUpload = (file) => {
    if (fileList.length >= 1) {
      message.error('You can only upload one file');
      return false;
    } else {
      setFileList([file]);
    }
    return false;
  };

  // Redirect to home page if user is already logged in
  const handleRedirect = () => {
    if (isAuthenticated()) {
      navigate('/');
    }
  };

  useEffect(() => {
    handleRedirect();
  });

  // Handle form submission
  const onFinish = async (values) => {
    const formattedPartyDate = `${values.dateOfBirth['$D'].toString().padStart(2, '0')}-${(
      values.dateOfBirth['$M'] + 1
    ).toString().padStart(2, '0')}-${values.dateOfBirth['$y']}`;

    const formData = new FormData();
    formData.append('profile_picture', fileList[0].originFileObj);
    formData.append('username', values.name);
    formData.append('email', values.email);
    formData.append('birth_date', formattedPartyDate);
    formData.append('password', values.password);

    try {
      setLoading(true);

      await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(response.data)
      message.success('User Registred! Redirecting...');
      navigate('/login');
    } catch (error) {
      setLoading(false);
      console.error('User Register failed:', error);
      message.error('Failed to User Register.');
      return false;
    }
  };

  // Handle form submission errors
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <React.Fragment>
      <h1 className="centerText">Register</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '-100vh',
        }}
      >
        <div
          style={{
            width: '80%',
            maxWidth: 600,
          }}
        >
          <Form
            name="createUser"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              width: '100%',
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col span={16}>
                <Form.Item
                  label="Nome"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira o nome!',
                    },
                    { validator: validadeNamePromise },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={16}>
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
              </Col>
            </Row>

            <Row>
              <Col span={16}>
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
              </Col>
              <Col span={16}>
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
              </Col>
            </Row>

            <Row>
              <Col span={17}>
                <Form.Item
                label="Data de nascimento"
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: 'Please input date Of Birth!',
                  },
                  { validator: validatePasswordPromise },
                ]}
              >
                <DatePicker />
              </Form.Item>
              </Col>
            </Row>      
            

            <Form.Item name="upload" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload
                action=""
                listType="picture-card"
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={handleChange}
                accept=".png,.jpg,.jpeg"
                multiple={false}
              >
                {fileList.length === 0 ? (
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                ) : null}
              </Upload>
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
                const formIsComplete =
                  name && validadeEmail(email) && validatePassword(password) && confirmPassword && dateOfBirth;

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
      </div>
    </React.Fragment>
  );
};

export default CreateUser;
