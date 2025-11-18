import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Upload,
  Space,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  List,
  Progress,
} from 'antd';
import {
  InboxOutlined,
  DeleteOutlined,
  FileOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import api, { getErrorMessage, getValidationErrors } from '../../services/api';
import type { Category, TicketFormData } from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'default' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
];

const TicketCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ data: Category[] }>('/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        message.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const onFinish = async (values: TicketFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category_id', String(values.category_id));
      formData.append('priority', values.priority);

      // Append files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('attachments[]', file.originFileObj);
        }
      });

      const response = await api.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Ticket created successfully');
      navigate(`/tickets/${response.data.data.id}`);
    } catch (error) {
      const validationErrors = getValidationErrors(error);
      if (Object.keys(validationErrors).length > 0) {
        const formErrors = Object.entries(validationErrors).map(([field, messages]) => ({
          name: field,
          errors: messages,
        }));
        form.setFields(formErrors);
      } else {
        message.error(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  // File upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        message.error(`${file.name} is too large. Maximum size is 10MB.`);
        return Upload.LIST_IGNORE;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        message.error(`${file.name} is not a supported file type.`);
        return Upload.LIST_IGNORE;
      }

      return false; // Don't auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    showUploadList: false,
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('zip')) return '📦';
    return '📎';
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tickets/list')}
          style={{ marginBottom: 16 }}
        >
          Back to Tickets
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Create New Ticket
        </Title>
        <Text type="secondary">
          Fill in the details below to create a new support ticket
        </Text>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                priority: 'medium',
              }}
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: 'Please enter a title' },
                  { min: 5, message: 'Title must be at least 5 characters' },
                  { max: 255, message: 'Title cannot exceed 255 characters' },
                ]}
              >
                <Input
                  placeholder="Brief summary of your issue"
                  maxLength={255}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter a description' },
                  { min: 20, message: 'Description must be at least 20 characters' },
                ]}
              >
                <TextArea
                  placeholder="Provide detailed information about your issue. Include any steps to reproduce, error messages, or relevant context."
                  rows={8}
                  showCount
                  maxLength={5000}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="category_id"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select
                      placeholder="Select category"
                      showSearch
                      optionFilterProp="children"
                    >
                      {categories.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select a priority' }]}
                  >
                    <Select placeholder="Select priority">
                      {priorityOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                          <Tag color={option.color}>{option.label}</Tag>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Attachments</Divider>

              <Form.Item>
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for images, PDFs, documents, and archives.
                    Maximum file size: 10MB per file.
                  </p>
                </Dragger>
              </Form.Item>

              {/* File List */}
              {fileList.length > 0 && (
                <List
                  size="small"
                  bordered
                  dataSource={fileList}
                  style={{ marginBottom: 24 }}
                  renderItem={(file) => (
                    <List.Item
                      actions={[
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            setFileList((prev) =>
                              prev.filter((f) => f.uid !== file.uid)
                            )
                          }
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <span style={{ fontSize: 24 }}>
                            {getFileIcon(file.type || '')}
                          </span>
                        }
                        title={file.name}
                        description={formatFileSize(file.size || 0)}
                      />
                    </List.Item>
                  )}
                />
              )}

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Create Ticket
                  </Button>
                  <Button onClick={() => navigate('/tickets/list')}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tips for Creating a Good Ticket">
            <List
              size="small"
              dataSource={[
                'Use a clear, descriptive title',
                'Provide detailed steps to reproduce the issue',
                'Include any error messages you see',
                'Attach screenshots if helpful',
                'Select the appropriate category and priority',
                'Check if a similar ticket already exists',
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text type="secondary">{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Priority Guidelines" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Tag color="default">Low</Tag>
                <Text type="secondary">General questions, minor issues</Text>
              </div>
              <div>
                <Tag color="blue">Medium</Tag>
                <Text type="secondary">Standard issues affecting work</Text>
              </div>
              <div>
                <Tag color="orange">High</Tag>
                <Text type="secondary">Important issues needing quick attention</Text>
              </div>
              <div>
                <Tag color="red">Urgent</Tag>
                <Text type="secondary">Critical issues blocking work</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TicketCreate;
