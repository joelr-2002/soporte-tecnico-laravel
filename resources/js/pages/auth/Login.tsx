import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../hooks/useSettings';
import { getErrorMessage } from '../../services/api';
import { LoginCredentials } from '../../types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const onFinish = async (values: LoginCredentials) => {
    try {
      await login(values);
      message.success(t('auth.welcomeBackMessage'));
      navigate('/dashboard');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          {t('auth.welcomeBack')}
        </Title>
        <Text type="secondary">
          {t('auth.signInToAccount')}
        </Text>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('validation.emailRequired') },
            { type: 'email', message: t('validation.emailInvalid') }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('auth.emailAddress')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('validation.passwordRequired') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.password')}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{t('auth.rememberMe')}</Checkbox>
            </Form.Item>
            <Link to="/auth/forgot-password">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            {t('auth.signIn')}
          </Button>
        </Form.Item>

        <Divider plain>
          <Text type="secondary">{t('auth.dontHaveAccount')}</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/register">
            <Button type="link" size="large">
              {t('auth.createAccount')}
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
