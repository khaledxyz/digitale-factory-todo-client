import { Card, Button, Input, Space, Form } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/axios';

const Login = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) navigate('/');
    }, [user]);

    const handleSubmit = async ({ email }) => {
        try {
            const res = await axiosInstance.post('/api/auth', { email });
            if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
            console.log(res.data)
            return navigate('/');
        }
        catch (Error) {
            const message = (Error.response.data);
            console.log(message)
        };
    };

    return (
        <Card title='Login' bordered={false} style={{ width: 300 }}>
            <Form
                name='login'
                onFinish={handleSubmit}
                autoComplete='off'
            >
                <Form.Item
                    name='email'
                    rules={[{ required: true, message: '' }]}
                >
                    <Input type='email' placeholder='Email' />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' block>Log in</Button>
                </Form.Item>
                <Link to={'/register'}>Sign up</Link>
            </Form>
        </Card>
    );
};

export default Login;