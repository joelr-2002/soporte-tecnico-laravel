import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Tabs,
  Upload,
  Avatar,
  Descriptions,
  Divider,
  Space,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useAuthStore } from '../stores/authStore';
import { getErrorMessage } from '../services/api';
import { UpdateProfileData, ChangePasswordData } from '../types';
import { useTranslation } from '../i18n';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, uploadPhoto, isLoading } = useAuthStore();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t } = useTranslation();

  const onUpdateProfile = async (values: UpdateProfileData) => {
    try {
      const data: UpdateProfileData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.photo = fileList[0].originFileObj;
      }

      await updateProfile(data);
      message.success(t('profile.profileUpdated'));
      setFileList([]);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const onChangePassword = async (values: ChangePasswordData) => {
    try {
      await changePassword(values);
      message.success(t('profile.passwordChanged'));
      passwordForm.resetFields();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(t('profile.onlyImages'));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t('profile.imageTooLarge'));
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    listType: 'picture',
  };

  const handlePhotoUpload = async () => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      try {
        await uploadPhoto(fileList[0].originFileObj);
        message.success(t('profile.photoUploaded'));
        setFileList([]);
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    }
  };

  const items = [
    {
      key: 'profile',
      label: t('profile.profileInformation'),
      children: (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar
              size={100}
              src={user?.photo_url}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <div>
              <Space>
                <Upload {...uploadProps}>
                  <Button icon={<CameraOutlined />}>{t('profile.selectPhoto')}</Button>
                </Upload>
                {fileList.length > 0 && (
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={handlePhotoUpload}
                    loading={isLoading}
                  >
                    {t('profile.upload')}
                  </Button>
                )}
              </Space>
            </div>
          </div>

          <Divider />

          <Form
            form={profileForm}
            layout="vertical"
            onFinish={onUpdateProfile}
            initialValues={{
              name: user?.name,
              email: user?.email,
              phone: user?.phone,
            }}
          >
            <Form.Item
              name="name"
              label={t('profile.fullName')}
              rules={[
                { required: true, message: t('profile.enterName') },
                { min: 2, message: t('profile.nameMinLength') }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={t('placeholders.name')} />
            </Form.Item>

            <Form.Item
              name="email"
              label={t('profile.emailAddress')}
              rules={[
                { required: true, message: t('profile.enterEmail') },
                { type: 'email', message: t('profile.validEmail') }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder={t('placeholders.email')} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={t('profile.phoneNumber')}
            >
              <Input prefix={<PhoneOutlined />} placeholder={t('placeholders.phone')} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t('profile.updateProfile')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'password',
      label: t('profile.changePassword'),
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onChangePassword}
        >
          <Form.Item
            name="current_password"
            label={t('profile.currentPassword')}
            rules={[
              { required: true, message: t('profile.enterCurrentPassword') }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('placeholders.currentPassword')} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('profile.newPassword')}
            rules={[
              { required: true, message: t('profile.enterNewPassword') },
              { min: 8, message: t('profile.passwordMinLength') }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('placeholders.newPassword')} />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label={t('profile.confirmNewPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('profile.confirmNewPasswordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('profile.passwordsDoNotMatch')));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('placeholders.confirmPassword')} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {t('profile.changePassword')}
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'account',
      label: t('profile.accountDetails'),
      children: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('profile.userId')}>{user?.id}</Descriptions.Item>
          <Descriptions.Item label={t('auth.name')}>{user?.name}</Descriptions.Item>
          <Descriptions.Item label={t('auth.email')}>{user?.email}</Descriptions.Item>
          <Descriptions.Item label={t('users.role')}>
            <Text style={{ textTransform: 'capitalize' }}>{user?.role}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('auth.phone')}>{user?.phone || t('profile.notProvided')}</Descriptions.Item>
          <Descriptions.Item label={t('profile.emailVerified')}>
            {user?.email_verified_at ? (
              <Text type="success">{t('profile.verified')}</Text>
            ) : (
              <Text type="warning">{t('profile.notVerified')}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.twoFactorAuth')}>
            {user?.two_factor_enabled ? (
              <Text type="success">{t('profile.enabled')}</Text>
            ) : (
              <Text type="secondary">{t('profile.disabled')}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.accountStatus')}>
            {user?.is_active ? (
              <Text type="success">{t('users.active')}</Text>
            ) : (
              <Text type="danger">{t('users.inactive')}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('users.memberSince')}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>
          {t('profile.myProfile')}
        </Title>
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default Profile;
