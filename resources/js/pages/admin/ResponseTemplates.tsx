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
import { useTranslation } from '../../i18n';
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
  const { t } = useTranslation();
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
      message.success(t('templates.createdSuccessfully'));
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
      message.success(t('templates.updatedSuccessfully'));
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
      message.success(t('templates.deletedSuccessfully'));
      fetchTemplates();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Copy template content to clipboard
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success(t('templates.copiedToClipboard'));
    } catch {
      message.error(t('templates.failedToCopy'));
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
      title: t('templates.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('tickets.category'),
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: Category | undefined) => (
        category ? (
          <Tag color="blue">{category.name}</Tag>
        ) : (
          <Tag color="default">{t('templates.allCategories')}</Tag>
        )
      ),
    },
    {
      title: t('templates.contentPreview'),
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
      title: t('templates.actions'),
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title={t('templates.copy')}>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record.content)}
            />
          </Tooltip>
          <Tooltip title={t('templates.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Popconfirm
              title={t('templates.deleteTemplate')}
              description={t('templates.confirmDelete')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('common.delete')}
              okType="danger"
              cancelText={t('common.cancel')}
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
            <Title level={4} style={{ margin: 0 }}>{t('templates.title')}</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTemplates()}
              >
                {t('templates.refresh')}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  createForm.resetFields();
                  setCreateModalVisible(true);
                }}
              >
                {t('templates.newTemplate')}
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
              placeholder={t('templates.searchTemplates')}
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
              placeholder={t('templates.filterByCategory')}
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
        title={t('templates.create')}
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
            label={t('templates.name')}
            rules={[
              { required: true, message: 'Please enter template name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label={t('tickets.category')}
            tooltip="Leave empty to make this template available for all categories"
          >
            <Select
              placeholder={t('templates.selectCategoryOptional')}
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
            label={t('templates.content')}
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
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {t('templates.create')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={t('templates.edit')}
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
            label={t('templates.name')}
            rules={[
              { required: true, message: 'Please enter template name' },
              { max: 255, message: 'Name cannot exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label={t('tickets.category')}
            tooltip="Leave empty to make this template available for all categories"
          >
            <Select
              placeholder={t('templates.selectCategoryOptional')}
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
            label={t('templates.content')}
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
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {t('templates.update')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResponseTemplates;
