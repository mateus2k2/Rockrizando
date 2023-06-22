import axios from 'axios';

import React from 'react';
import { useSignIn } from 'react-auth-kit';

import { Button, Form, Input } from 'antd';

// https://authkit.arkadip.dev/integration/#import


const validatePassword = (_, value) => {
    // Define the regular expressions for each requirement
    const minLengthRegex = /^.{6,}$/;
    const specialCharRegex = /[@#]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    // Validate the password against all the requirements
    if (
      minLengthRegex.test(value) &&
      specialCharRegex.test(value) &&
      uppercaseRegex.test(value) &&
      numberRegex.test(value)
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      'Password must be at least 6 characters long, \n' +
      'contain at least one special character (@ or #), \n' +
      'one uppercase character, and one number.'
    );
  };

const Auth = () => {
    const signIn = useSignIn()

    const onFinish = async (values) => {
        console.log('Success:', values);

        let token

        const loginData = {
            email: values.email,
            password: values.password,
        };

        console.log(loginData);

        try {
            const response = await axios.post('http://localhost:5000/login', loginData);
            token = response.data.token;
            console.log(token);
        } 
        catch (error) {
            console.error('Login failed:', error);
        }
            
        try {
            signIn({
                token: token,
                expiresIn: 60,
                tokenType: 'Bearer',
                authState: { email: values.email },
            });

        }
         catch (error) {
            console.error('Error during sign-in:', error);
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <React.Fragment>
            <h1 className = "centerText">Auth</h1>
            <div className="center">
                <Form
                    name="basic"
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
                        {
                        type: "email",
                        message: 'Please input your Email!',
                        },
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
                        { validator: validatePassword },
                    ]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>

                </Form>
            </div>
        </React.Fragment>
    )
}

export default Auth 