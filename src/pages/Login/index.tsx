import React from 'react';
import { Button, Form, Input, message } from 'antd';
import './index.css'

import { useHistory } from 'react-router-dom';

import { reqLogin } from '../../api';

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

// interface resultsType {
//     [x: string]: string | Object | number;
// }

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const onReset = () => {
        form.resetFields();
    };
    // 用户登录
    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const { username, password } = values;

        let result = await reqLogin({ username, password })
        if (result.status === 200 && result.token) {
            localStorage.setItem('token', result.token)
            history.push('/')
        } else {
            message.error('账号或密码错误，请重新输入')
            form.resetFields();
        }

    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="账号"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
    ;

export default Login;