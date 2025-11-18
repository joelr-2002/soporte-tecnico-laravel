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

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, uploadPhoto, isLoading } = useAuthStore();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
      message.success('Profile updated successfully!');
      setFileList([]);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const onChangePassword = async (values: ChangePasswordData) => {
    try {
      await changePassword(values);
      message.success('Password changed successfully!');
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
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
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
        message.success('Photo uploaded successfully!');
        setFileList([]);
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Profile Information',
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
                  <Button icon={<CameraOutlined />}>Select Photo</Button>
                </Upload>
                {fileList.length > 0 && (
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={handlePhotoUpload}
                    loading={isLoading}
                  >
                    Upload
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
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email address" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone number (optional)" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'password',
      label: 'Change Password',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onChangePassword}
        >
          <Form.Item
            name="current_password"
            label="Current Password"
            rules={[
              { required: true, message: 'Please enter your current password' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Current password" />
          </Form.Item>

          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="New password" />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm New Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
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
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'account',
      label: 'Account Details',
      children: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="User ID">{user?.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Text style={{ textTransform: 'capitalize' }}>{user?.role}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{user?.phone || 'Not provided'}</Descriptions.Item>
          <Descriptions.Item label="Email Verified">
            {user?.email_verified_at ? (
              <Text type="success">Verified</Text>
            ) : (
              <Text type="warning">Not verified</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Two-Factor Auth">
            {user?.two_factor_enabled ? (
              <Text type="success">Enabled</Text>
            ) : (
              <Text type="secondary">Disabled</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            {user?.is_active ? (
              <Text type="success">Active</Text>
            ) : (
              <Text type="danger">Inactive</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
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
          My Profile
        </Title>
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default Profile;
