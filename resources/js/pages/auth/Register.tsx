import React from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getErrorMessage } from '../../services/api';
import { RegisterData } from '../../types';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const onFinish = async (values: RegisterData) => {
    try {
      await register(values);
      message.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Create Account
        </Title>
        <Text type="secondary">
          Sign up to get started with our support system
        </Text>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, message: 'Please enter your name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email address"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            Create Account
          </Button>
        </Form.Item>

        <Divider plain>
          <Text type="secondary">Already have an account?</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/login">
            <Button type="link" size="large">
              Sign in instead
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
