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
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import api, { getErrorMessage } from '../../services/api';
import categoryService from '../../services/categoryService';
import { Category } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Response template type
interface ResponseTemplate {
  id: number;
  name: string;
  content: string;
  category_id: number | null;
  category?: Category;
  created_at: string;
  updated_at: string;
}

// Template form data
interface TemplateFormData {
  name: string;
  content: string;
  category_id?: number | null;
}

const ResponseTemplates: React.FC = () => {
  // Data states
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} templates`,
  });

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pagination.current));
      params.append('per_page', String(pagination.pageSize));
      if (searchText) params.append('search', searchText);
      if (categoryFilter) params.append('category_id', String(categoryFilter));

      const response = await api.get(`/response-templates?${params.toString()}`);
      setTemplates(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, categoryFilter]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getActiveCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle table change
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Create template
  const handleCreate = async (values: TemplateFormData) => {
    setSubmitting(true);
    try {
      await api.post('/response-templates', values);
      message.success('Template created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchTemplates();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Update template
  const handleUpdate = async (values: TemplateFormData) => {
    if (!editingTemplate) return;

    setSubmitting(true);
    try {
      await api.put(`/response-templates/${editingTemplate.id}`, values);
      message.success('Template updated successfully');
      setEditModalVisible(false);
      setEditingTemplate(null);
      editForm.resetFields();
      fetchTemplates();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Delete template
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/response-templates/${id}`);
      message.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Copy template content to clipboard
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('Template copied to clipboard');
    } catch {
      message.error('Failed to copy template');
    }
  };

  // Open edit modal
  const openEditModal = (template: ResponseTemplate) => {
    setEditingTemplate(template);
    editForm.setFieldsValue({
      name: template.name,
      content: template.content,
      category_id: template.category_id,
    });
    setEditModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<ResponseTemplate> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: Category | undefined) => (
        category ? (
          <Tag color="blue">{category.name}</Tag>
        ) : (
          <Tag color="default">All Categories</Tag>
        )
      ),
    },
    {
      title: 'Content Preview',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => (
        <Tooltip title={content}>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ margin: 0, maxWidth: 400 }}
          >
            {content}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Copy">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record.content)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Template"
              description="Are you sure you want to delete this template?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
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
            <Title level={4} style={{ margin: 0 }}>Response Templates</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTemplates()}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  createForm.resetFields();
                  setCreateModalVisible(true);
                }}
              >
                New Template
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
              placeholder="Search templates..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                setPagination({ ...pagination, current: 1 });
                fetchTemplates();
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by category"
              style={{ width: '100%' }}
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setPagination({ ...pagination, current: 1 });
              }}
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Templates Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create Template"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter template name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Category"
            tooltip="Leave empty to make this template available for all categories"
          >
            <Select
              placeholder="Select category (optional)"
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: 'Please enter template content' },
            ]}
          >
            <TextArea
              placeholder="Enter template content"
              rows={8}
              showCount
            />
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
        title="Edit Template"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingTemplate(null);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
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
              { required: true, message: 'Please enter template name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Category"
            tooltip="Leave empty to make this template available for all categories"
          >
            <Select
              placeholder="Select category (optional)"
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: 'Please enter template content' },
            ]}
          >
            <TextArea
              placeholder="Enter template content"
              rows={8}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                setEditingTemplate(null);
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

export default ResponseTemplates;
