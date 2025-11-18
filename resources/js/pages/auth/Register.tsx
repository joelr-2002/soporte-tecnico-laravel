import React from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../hooks/useSettings';
import { getErrorMessage } from '../../services/api';
import { RegisterData } from '../../types';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const onFinish = async (values: RegisterData) => {
    try {
      await register(values);
      message.success(t('auth.accountCreatedSuccess'));
      navigate('/dashboard');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          {t('auth.createAccount')}
        </Title>
        <Text type="secondary">
          {t('auth.signUpToGetStarted')}
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
            { required: true, message: t('validation.nameRequired') },
            { min: 2, message: t('validation.nameMinLength') }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('auth.fullName')}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('validation.emailRequired') },
            { type: 'email', message: t('validation.emailInvalid') }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('auth.emailAddress')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('validation.passwordRequired') },
            { min: 8, message: t('validation.passwordMinLength') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.password')}
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: t('validation.confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('validation.passwordsDoNotMatch')));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.confirmPassword')}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            {t('auth.createAccount')}
          </Button>
        </Form.Item>

        <Divider plain>
          <Text type="secondary">{t('auth.alreadyHaveAccount')}</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/login">
            <Button type="link" size="large">
              {t('auth.signInInstead')}
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
