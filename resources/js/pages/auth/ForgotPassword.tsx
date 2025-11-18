import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../hooks/useSettings';
import { getErrorMessage } from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const { forgotPassword, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const onFinish = async (values: { email: string }) => {
    try {
      await forgotPassword(values.email);
      setSentEmail(values.email);
      setEmailSent(true);
      message.success(t('auth.resetLinkSent'));
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  if (emailSent) {
    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Result
          status="success"
          title={t('auth.checkYourEmail')}
          subTitle={
            <Paragraph>
              {t('auth.resetLinkSentTo')} <strong>{sentEmail}</strong>.
              {' '}{t('auth.checkInboxInstructions')}
            </Paragraph>
          }
          extra={[
            <Link to="/auth/login" key="login">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                {t('auth.backToLogin')}
              </Button>
            </Link>,
            <Button
              key="resend"
              onClick={() => setEmailSent(false)}
            >
              {t('auth.sendAgain')}
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
          {t('auth.forgotPasswordTitle')}
        </Title>
        <Text type="secondary">
          {t('auth.forgotPasswordDescription')}
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
            { required: true, message: t('validation.emailRequired') },
            { type: 'email', message: t('validation.emailInvalid') }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('auth.emailAddress')}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            {t('auth.sendResetLink')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/login">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              {t('auth.backToLogin')}
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
