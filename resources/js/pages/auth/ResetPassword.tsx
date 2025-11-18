import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getErrorMessage } from '../../services/api';
import { ResetPasswordData } from '../../types';
import { useTranslation } from '../../i18n';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading } = useAuthStore();
  const { t } = useTranslation();

  // Get token and email from URL parameters
  const token = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const onFinish = async (values: Omit<ResetPasswordData, 'token'>) => {
    try {
      await resetPassword({
        token,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      message.success(t('auth.passwordResetSent'));
      navigate('/auth/login');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          {t('authPages.resetPasswordTitle')}
        </Title>
        <Text type="secondary">
          {t('authPages.resetPasswordSubtitle')}
        </Text>
      </div>

      <Form
        form={form}
        name="reset-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        initialValues={{ email: emailFromUrl }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('validation.emailRequired') },
            { type: 'email', message: t('validation.emailInvalid') }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('authPages.emailLabel')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('validation.passwordRequired') },
            { min: 8, message: t('validation.passwordMin', { min: 8 }) }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.newPassword')}
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: t('validation.required') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('errors.passwordMismatch')));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('authPages.confirmPasswordLabel')}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            {t('authPages.resetPasswordButton')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
