import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getErrorMessage } from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const { forgotPassword, isLoading } = useAuthStore();

  const onFinish = async (values: { email: string }) => {
    try {
      await forgotPassword(values.email);
      setSentEmail(values.email);
      setEmailSent(true);
      message.success('Password reset link sent!');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  if (emailSent) {
    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Result
          status="success"
          title="Check Your Email"
          subTitle={
            <Paragraph>
              We've sent a password reset link to <strong>{sentEmail}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </Paragraph>
          }
          extra={[
            <Link to="/auth/login" key="login">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Back to Login
              </Button>
            </Link>,
            <Button
              key="resend"
              onClick={() => setEmailSent(false)}
            >
              Send Again
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Forgot Password?
        </Title>
        <Text type="secondary">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </div>

      <Form
        form={form}
        name="forgot-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            Send Reset Link
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/login">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              Back to Login
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
