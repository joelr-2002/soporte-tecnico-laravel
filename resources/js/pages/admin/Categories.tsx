import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Typography,
  Tag,
  Popconfirm,
  Tooltip,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import categoryService, { CategoryWithStats, CategoryFormData } from '../../services/categoryService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Categories: React.FC = () => {
  // Data states
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithStats | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: searchText || undefined,
      });
      setCategories(response.data);
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle table change
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Create category
  const handleCreate = async (values: CategoryFormData) => {
    setSubmitting(true);
    try {
      await categoryService.createCategory(values);
      message.success('Category created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchCategories();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  // Update category
  const handleUpdate = async (values: CategoryFormData) => {
    if (!editingCategory) return;

    setSubmitting(true);
    try {
      await categoryService.updateCategory(editingCategory.id, values);
      message.success('Category updated successfully');
      setEditModalVisible(false);
      setEditingCategory(null);
      editForm.resetFields();
      fetchCategories();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  // Toggle active status
  const handleToggleStatus = async (id: number) => {
    try {
      await categoryService.toggleStatus(id);
      message.success('Status updated successfully');
      fetchCategories();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Open edit modal
  const openEditModal = (category: CategoryWithStats) => {
    setEditingCategory(category);
    editForm.setFieldsValue({
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    });
    setEditModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<CategoryWithStats> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || <Text type="secondary">No description</Text>,
    },
    {
      title: 'Active Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      align: 'center',
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<CloseCircleOutlined />}
        />
      ),
    },
    {
      title: 'Ticket Count',
      dataIndex: 'tickets_count',
      key: 'tickets_count',
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.tickets_count || 0) - (b.tickets_count || 0),
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count || 0}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={(record.tickets_count || 0) > 0 ? 'Cannot delete: has tickets' : 'Delete'}>
            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
              disabled={(record.tickets_count || 0) > 0}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={(record.tickets_count || 0) > 0}
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
            <Title level={4} style={{ margin: 0 }}>Category Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchCategories()}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  createForm.resetFields();
                  createForm.setFieldsValue({ is_active: true });
                  setCreateModalVisible(true);
                }}
              >
                New Category
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                setPagination({ ...pagination, current: 1 });
                fetchCategories();
              }}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Categories Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create Category"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ is_active: true }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter category name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 1000, message: 'Description cannot exceed 1000 characters' },
            ]}
          >
            <TextArea
              placeholder="Enter category description"
              rows={4}
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Category"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCategory(null);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter category name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 1000, message: 'Description cannot exceed 1000 characters' },
            ]}
          >
            <TextArea
              placeholder="Enter category description"
              rows={4}
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                setEditingCategory(null);
                editForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
