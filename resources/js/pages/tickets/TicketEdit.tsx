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
  Spin,
  Empty,
  Popconfirm,
  Descriptions,
} from 'antd';
import {
  InboxOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  FileOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import api, { getErrorMessage, getValidationErrors } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import type { Ticket, Category, User, Attachment } from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const statusOptions = [
  { value: 'open', label: 'Open', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'processing' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

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

interface EditFormData {
  title: string;
  description: string;
  category_id: number;
  priority: string;
  status?: string;
  assigned_to?: number | null;
}

const TicketEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const canManage = isAdmin || isAgent;

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [deletedAttachments, setDeletedAttachments] = useState<number[]>([]);

  // Fetch ticket data
  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: Ticket }>(`/tickets/${id}`);
      const ticketData = response.data.data;

      // Check if user can edit this ticket
      if (!canManage && ticketData.user_id !== user?.id) {
        message.error('You do not have permission to edit this ticket');
        navigate('/tickets/list');
        return;
      }

      // Users can only edit open tickets
      if (!canManage && ticketData.status !== 'open') {
        message.error('You can only edit open tickets');
        navigate(`/tickets/${id}`);
        return;
      }

      setTicket(ticketData);
      setExistingAttachments(ticketData.attachments || []);

      // Set form values
      form.setFieldsValue({
        title: ticketData.title,
        description: ticketData.description,
        category_id: ticketData.category_id,
        priority: ticketData.priority,
        status: ticketData.status,
        assigned_to: ticketData.assigned_to,
      });
    } catch (error) {
      message.error(getErrorMessage(error));
      navigate('/tickets/list');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and agents
  const fetchFilters = async () => {
    try {
      const [categoriesRes, agentsRes] = await Promise.all([
        api.get<{ data: Category[] }>('/categories'),
        canManage ? api.get<{ data: User[] }>('/users/agents') : Promise.resolve({ data: { data: [] } }),
      ]);
      setCategories(categoriesRes.data.data || []);
      if (canManage) {
        setAgents(agentsRes.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchFilters();
    }
  }, [id]);

  // Handle form submission
  const onFinish = async (values: EditFormData) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category_id', String(values.category_id));
      formData.append('priority', values.priority);
      formData.append('_method', 'PUT');

      // Admin/Agent specific fields
      if (canManage) {
        if (values.status) {
          formData.append('status', values.status);
        }
        if (values.assigned_to !== undefined) {
          formData.append('assigned_to', values.assigned_to ? String(values.assigned_to) : '');
        }
      }

      // Append new files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('attachments[]', file.originFileObj);
        }
      });

      // Append deleted attachment IDs
      if (deletedAttachments.length > 0) {
        deletedAttachments.forEach((attachmentId) => {
          formData.append('delete_attachments[]', String(attachmentId));
        });
      }

      await api.post(`/tickets/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Ticket updated successfully');
      navigate(`/tickets/${id}`);
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
      setSaving(false);
    }
  };

  // File upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      if (file.size > MAX_FILE_SIZE) {
        message.error(`${file.name} is too large. Maximum size is 10MB.`);
        return Upload.LIST_IGNORE;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        message.error(`${file.name} is not a supported file type.`);
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    showUploadList: false,
  };

  // Delete existing attachment
  const handleDeleteAttachment = (attachmentId: number) => {
    setDeletedAttachments((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  // Download attachment
  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await api.get(`/attachments/${attachment.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!ticket) {
    return <Empty description="Ticket not found" />;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/tickets/${id}`)}
          style={{ marginBottom: 16 }}
        >
          Back to Ticket
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Edit Ticket #{ticket.ticket_number}
        </Title>
        <Text type="secondary">
          Update the ticket details below
        </Text>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
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
                  disabled={!canManage && ticket.status !== 'open'}
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
                  placeholder="Provide detailed information about your issue"
                  rows={8}
                  showCount
                  maxLength={5000}
                  disabled={!canManage && ticket.status !== 'open'}
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
                      disabled={!canManage && ticket.status !== 'open'}
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
                    <Select
                      placeholder="Select priority"
                      disabled={!canManage && ticket.status !== 'open'}
                    >
                      {priorityOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                          <Tag color={option.color}>{option.label}</Tag>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Admin/Agent specific fields */}
              {canManage && (
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="status"
                      label="Status"
                    >
                      <Select placeholder="Select status">
                        {statusOptions.map((option) => (
                          <Select.Option key={option.value} value={option.value}>
                            <Tag color={option.color}>{option.label}</Tag>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="assigned_to"
                      label="Assigned To"
                    >
                      <Select
                        placeholder="Select agent"
                        showSearch
                        optionFilterProp="children"
                        allowClear
                      >
                        {agents.map((agent) => (
                          <Select.Option key={agent.id} value={agent.id}>
                            {agent.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Divider>Attachments</Divider>

              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <>
                  <Text strong>Current Attachments</Text>
                  <List
                    size="small"
                    bordered
                    style={{ marginBottom: 16, marginTop: 8 }}
                    dataSource={existingAttachments}
                    renderItem={(attachment) => (
                      <List.Item
                        actions={[
                          <Button
                            key="download"
                            type="link"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(attachment)}
                          >
                            Download
                          </Button>,
                          <Popconfirm
                            key="delete"
                            title="Delete attachment?"
                            onConfirm={() => handleDeleteAttachment(attachment.id)}
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileOutlined />}
                          title={attachment.original_filename}
                          description={formatFileSize(attachment.size)}
                        />
                      </List.Item>
                    )}
                  />
                </>
              )}

              {/* New Attachments Upload */}
              <Text strong>Add New Attachments</Text>
              <Form.Item style={{ marginTop: 8 }}>
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

              {/* New File List */}
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={saving}
                    icon={<SaveOutlined />}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => navigate(`/tickets/${id}`)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Ticket Info */}
          <Card title="Ticket Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Ticket ID">
                {ticket.ticket_number}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {ticket.user?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(ticket.created_at).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {dayjs(ticket.updated_at).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              {ticket.assignee && (
                <Descriptions.Item label="Assigned To">
                  {ticket.assignee.name}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Edit Permissions Info */}
          {!canManage && (
            <Card title="Edit Permissions" style={{ marginTop: 16 }}>
              <Text type="secondary">
                As a user, you can only edit tickets that are in "Open" status.
                Once a ticket is being processed, you can only add comments.
              </Text>
            </Card>
          )}

          {/* Status Info */}
          {canManage && (
            <Card title="Status Information" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {statusOptions.map((option) => (
                  <div key={option.value}>
                    <Tag color={option.color}>{option.label}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {option.value === 'open' && ' - New ticket awaiting review'}
                      {option.value === 'in_progress' && ' - Being worked on'}
                      {option.value === 'pending' && ' - Waiting for user response'}
                      {option.value === 'resolved' && ' - Solution provided'}
                      {option.value === 'closed' && ' - Ticket completed'}
                    </Text>
                  </div>
                ))}
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TicketEdit;
