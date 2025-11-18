import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../i18n';

const { Title, Text } = Typography;

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('authPages.loginTitle')} - ${t('app.title')}`;
    }, [t]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            await login({
                email: values.email,
                password: values.password,
                remember: values.remember,
            });
            message.success(t('messages.welcomeBack'));
            navigate('/dashboard');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('errors.invalidCredentials');
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>{t('authPages.loginTitle')}</Title>
                <Text type="secondary">{t('authPages.loginSubtitle')}</Text>
            </div>

            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t('validation.required') },
                        { type: 'email', message: t('validation.email') },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder={t('authPages.emailLabel')}
                        autoComplete="email"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: t('validation.required') }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t('authPages.passwordLabel')}
                        autoComplete="current-password"
                    />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t('authPages.rememberMe')}</Checkbox>
                        </Form.Item>
                        <Link to="/auth/forgot-password">
                            {t('authPages.forgotPasswordLink')}
                        </Link>
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        {t('authPages.loginButton')}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Text>
                        {t('authPages.noAccountLink')}{' '}
                        <Link to="/auth/register">{t('authPages.signUpLink')}</Link>
                    </Text>
                </div>
            </Form>
        </div>
    );
};

export default Login;
