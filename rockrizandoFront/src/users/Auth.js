import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useIsAuthenticated } from 'react-auth-kit';
import jwt_decode from "jwt-decode";

import { Button, Form, Input, Spin, message } from 'antd';
import antIcon from '../shared/Spin.js'

import { validatePasswordPromise, validadeEmailPromise, validatePassword, validadeEmail } from '../shared/Validators.js'

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const signIn = useSignIn()
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

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
        let token

        const loginData = {
            email: values.email,
            password: values.password,
        };

        // Send login request
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:5000/login', loginData);
            token = response.data.token;
            message.success('Logged in successfully! Redirecting...');
            navigate('/');
        }
        catch (error) {
            setLoading(false)
            console.error('Login failed:', error);
            message.error('Failed to log in. Please check your credentials and try again.');
            return false;
        }

        // Decode token and get expiration date
        var decoded = jwt_decode(token);
        const now = new Date();
        const expiration = new Date(decoded.exp * 1000);
        const timeDeltaMinutes = Math.floor((expiration - now) / (1000 * 60));

        // Sign in user
        try {
            signIn({
                token: token,
                expiresIn: timeDeltaMinutes,
                tokenType: 'Bearer',
                authState: decoded.sub,
            });

        }
        catch (error) {
            console.error('Error during sign-in:', error);
        }

        setLoading(false)
        return true;
    };

    // Handle form submission errors
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    if(!isAuthenticated()){
        return (
            
            <React.Fragment>
                
                <h1 className="centerText">Auth</h1>

                <div className="center">
                    <Form
                        name="login"
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                                { validator: validadeEmailPromise },
                            ]}
                        >
                            <Input />

                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                { validator: validatePasswordPromise },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            shouldUpdate
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            {({ getFieldsValue }) => {
                                const { email, password } = getFieldsValue();
                                const formIsComplete = validadeEmail(email) && validatePassword(password);

                                return (
                                    <React.Fragment>
                                        <Button type="primary" htmlType="submit" disabled={!formIsComplete}>
                                            Log In
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
            </React.Fragment>
        );
    }
    else{
        message.error('You are already logged in. Redirecting...');
    }

}

export default Auth 