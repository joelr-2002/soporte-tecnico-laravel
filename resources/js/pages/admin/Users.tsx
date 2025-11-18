import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Typography,
  Tag,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import userService, { UserWithStats, UserCreateData, UserUpdateData } from '../../services/userService';
import { useTranslation } from '@/i18n';

const { Title, Text } = Typography;

const roleColors: Record<string, string> = {
  admin: 'red',
  agent: 'blue',
  user: 'default',
};

const Users: React.FC = () => {
  const { t } = useTranslation();

  const roleLabels: Record<string, string> = {
    admin: t('users.admin'),
    agent: t('users.agents'),
    user: t('users.user'),
  };

  // Data states
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Pagination - separate state for trigger values
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Pagination config for table
  const pagination: TablePaginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('users.title')}`,
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({
        page: currentPage,
        per_page: pageSize,
        search: searchText || undefined,
        role: roleFilter,
      });
      setUsers(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('users.failedToFetch'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, roleFilter, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle table change
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    if (newPagination.current) setCurrentPage(newPagination.current);
    if (newPagination.pageSize) setPageSize(newPagination.pageSize);
  };

  // Create user
  const handleCreate = async (values: UserCreateData) => {
    setSubmitting(true);
    try {
      await userService.createUser(values);
      message.success(t('users.createdSuccessfully'));
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('users.failedToCreate'));
    } finally {
      setSubmitting(false);
    }
  };

  // Update user
  const handleUpdate = async (values: UserUpdateData) => {
    if (!editingUser) return;

    // Remove password fields if empty
    if (!values.password) {
      delete values.password;
      delete values.password_confirmation;
    }

    setSubmitting(true);
    try {
      await userService.updateUser(editingUser.id, values);
      message.success(t('users.updatedSuccessfully'));
      setEditModalVisible(false);
      setEditingUser(null);
      editForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('users.failedToUpdate'));
    } finally {
      setSubmitting(false);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      message.success(t('users.deletedSuccessfully'));
      fetchUsers();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('users.failedToDelete'));
    }
  };

  // Change role
  const handleChangeRole = async (id: number, role: 'admin' | 'agent' | 'user') => {
    try {
      await userService.changeRole(id, role);
      message.success(t('users.roleUpdatedSuccessfully'));
      fetchUsers();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('users.failedToUpdateRole'));
    }
  };

  // Open edit modal
  const openEditModal = (user: UserWithStats) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      is_active: user.is_active,
    });
    setEditModalVisible(true);
  };

  // Get ticket count for user
  const getTicketCount = (user: UserWithStats): number => {
    return (user.tickets_count || 0) + (user.assigned_tickets_count || 0);
  };

  // Table columns
  const columns: ColumnsType<UserWithStats> = [
    {
      title: t('users.avatar'),
      key: 'avatar',
      width: 60,
      render: (_, record) => (
        <Avatar
          src={record.photo_url}
          icon={!record.photo_url ? <UserOutlined /> : undefined}
          size={40}
        />
      ),
    },
    {
      title: t('users.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('users.email'),
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: t('users.role'),
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string, record) => (
        <Select
          value={role}
          style={{ width: '100%' }}
          onChange={(newRole) => handleChangeRole(record.id, newRole as 'admin' | 'agent' | 'user')}
          bordered={false}
          size="small"
        >
          {Object.entries(roleLabels).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              <Tag color={roleColors[value]}>{label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: t('users.phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone) => phone || <Text type="secondary">-</Text>,
    },
    {
      title: t('users.tickets'),
      key: 'tickets_count',
      width: 100,
      align: 'center',
      sorter: (a, b) => getTicketCount(a) - getTicketCount(b),
      render: (_, record) => (
        <Tag color={getTicketCount(record) > 0 ? 'blue' : 'default'}>
          {getTicketCount(record)}
        </Tag>
      ),
    },
    {
      title: t('users.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={getTicketCount(record) > 0 ? t('users.cannotDeleteHasTickets') : t('common.delete')}>
            <Popconfirm
              title={t('users.deleteUser')}
              description={t('messages.confirmDelete')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('common.delete')}
              okType="danger"
              cancelText={t('common.cancel')}
              disabled={getTicketCount(record) > 0}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={getTicketCount(record) > 0}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>{t('users.management')}</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchUsers()}
              >
                {t('common.refresh')}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  createForm.resetFields();
                  createForm.setFieldsValue({ role: 'user', is_active: true });
                  setCreateModalVisible(true);
                }}
              >
                {t('users.newUser')}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder={t('users.search')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                setCurrentPage(1);
                fetchUsers();
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={t('users.filterByRole')}
              style={{ width: '100%' }}
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
              allowClear
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={roleColors[value]}>{label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title={t('users.create')}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={500}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ role: 'user', is_active: true }}
        >
          <Form.Item
            name="name"
            label={t('users.name')}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.name') }) },
              { max: 255, message: t('validation.maxLength', { field: t('users.name'), max: '255' }) },
            ]}
          >
            <Input placeholder={t('users.enterName')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('users.email')}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.email') }) },
              { type: 'email', message: t('validation.email') },
            ]}
          >
            <Input placeholder={t('users.enterEmail')} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t('users.role')}
            rules={[{ required: true, message: t('validation.required', { field: t('users.role') }) }]}
          >
            <Select placeholder={t('users.selectRole')}>
              {Object.entries(roleLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={roleColors[value]}>{label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label={t('users.password')}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.password') }) },
              { min: 8, message: t('validation.minLength', { field: t('users.password'), min: '8' }) },
            ]}
          >
            <Input.Password placeholder={t('users.enterPassword')} />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label={t('users.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.confirmPassword') }) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('validation.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t('users.confirmPasswordPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('users.phone')}
          >
            <Input placeholder={t('users.enterPhone')} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {t('common.create')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={t('users.edit')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingUser(null);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label={t('users.name')}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.name') }) },
              { max: 255, message: t('validation.maxLength', { field: t('users.name'), max: '255' }) },
            ]}
          >
            <Input placeholder={t('users.enterName')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('users.email')}
            rules={[
              { required: true, message: t('validation.required', { field: t('users.email') }) },
              { type: 'email', message: t('validation.email') },
            ]}
          >
            <Input placeholder={t('users.enterEmail')} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t('users.role')}
            rules={[{ required: true, message: t('validation.required', { field: t('users.role') }) }]}
          >
            <Select placeholder={t('users.selectRole')}>
              {Object.entries(roleLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={roleColors[value]}>{label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label={t('users.newPassword')}
            rules={[
              { min: 8, message: t('validation.minLength', { field: t('users.password'), min: '8' }) },
            ]}
          >
            <Input.Password placeholder={t('users.leaveBlankToKeep')} />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label={t('users.confirmNewPassword')}
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('password') || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('validation.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t('users.confirmNewPasswordPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('users.phone')}
          >
            <Input placeholder={t('users.enterPhone')} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('users.active')}
            valuePropName="checked"
          >
            <Switch checkedChildren={t('users.active')} unCheckedChildren={t('users.inactive')} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                setEditingUser(null);
                editForm.resetFields();
              }}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {t('common.update')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
