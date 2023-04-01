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
            const res = await axiosInstance.post('/api/users', { email });
            return navigate('/login');
        }
        catch (Error) {
            const message = (Error.response.data);
            console.log(message)
        };
    };

    return (
        <Card title='Sign up' bordered={false} style={{ width: 300 }}>
            <Form
                name='signUp'
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
                    <Button type='primary' htmlType='submit' block>Sign up</Button>
                </Form.Item>
                <Link to={'/login'}>Log in</Link>
            </Form>
        </Card>
    );
};

export default Login;