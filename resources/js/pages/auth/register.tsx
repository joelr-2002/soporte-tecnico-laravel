import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../i18n';

const { Title, Text } = Typography;

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('authPages.registerTitle')} - ${t('app.title')}`;
    }, [t]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values: RegisterFormValues) => {
        setLoading(true);
        try {
            await register({
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
            });
            message.success(t('messages.accountCreated'));
            navigate('/dashboard');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('errors.createFailed');
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>{t('authPages.registerTitle')}</Title>
                <Text type="secondary">{t('authPages.registerSubtitle')}</Text>
            </div>

            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: t('validation.required') }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder={t('authPages.nameLabel')}
                        autoComplete="name"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t('validation.required') },
                        { type: 'email', message: t('validation.email') },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder={t('authPages.emailLabel')}
                        autoComplete="email"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: t('validation.required') },
                        { min: 8, message: t('validation.min', { min: '8' }) },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t('authPages.passwordLabel')}
                        autoComplete="new-password"
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
                        autoComplete="new-password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        {t('authPages.registerButton')}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Text>
                        {t('authPages.hasAccountLink')}{' '}
                        <Link to="/auth/login">{t('authPages.loginLink')}</Link>
                    </Text>
                </div>
            </Form>
        </div>
    );
};

export default Register;
