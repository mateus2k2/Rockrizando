import React from 'react';
import { useSignIn } from 'react-auth-kit';

import { Button, Form, Input } from 'antd';

// https://authkit.arkadip.dev/integration/#import



const Auth = () => {
    const signIn = useSignIn()

    const onFinish = async (values) => {
        console.log('Success:', values);

        const responseTokenMOCK =
            "ddfGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXJfaWQiOiIxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjI5MjU0NjQyLCJleHAiOjE";

        try {
            const returno = await signIn({
            token: responseTokenMOCK,
            expiresIn: 60, // 3 days
            tokenType: 'Bearer',
            authState: { username: values.username },
        });

        console.log(returno);
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
                    label="Username"
                    name="username"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your username!',
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