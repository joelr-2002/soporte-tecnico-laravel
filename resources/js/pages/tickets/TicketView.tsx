import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Avatar,
  Divider,
  Timeline,
  List,
  Input,
  Select,
  Upload,
  Modal,
  message,
  Popconfirm,
  Row,
  Col,
  Tooltip,
  Badge,
  Dropdown,
  Spin,
  Empty,
  Switch,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  FileOutlined,
  LockOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import api, { getErrorMessage } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import type { Ticket, Comment, User, Attachment } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface StatusHistory {
  id: number;
  ticket_id: number;
  old_status: string | null;
  new_status: string;
  changed_by: User;
  created_at: string;
}

interface ResponseTemplate {
  id: number;
  name: string;
  content: string;
}

const statusColors: Record<string, string> = {
  open: 'blue',
  in_progress: 'processing',
  pending: 'warning',
  resolved: 'success',
  closed: 'default',
};

const priorityColors: Record<string, string> = {
  low: 'default',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending: 'Pending',
  resolved: 'Resolved',
  closed: 'Closed',
};

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <ClockCircleOutlined />,
  in_progress: <SyncOutlined spin />,
  pending: <MinusCircleOutlined />,
  resolved: <CheckCircleOutlined />,
  closed: <CloseCircleOutlined />,
};

const TicketView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const canManage = isAdmin || isAgent;

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  // Comment form state
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [commentFiles, setCommentFiles] = useState<UploadFile[]>([]);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Fetch ticket data
  const fetchTicket = async () => {
    setLoading(true);
    try {
      const [ticketRes, historyRes] = await Promise.all([
        api.get<{ data: Ticket }>(`/tickets/${id}`),
        api.get<{ data: StatusHistory[] }>(`/tickets/${id}/history`),
      ]);
      setTicket(ticketRes.data.data);
      setStatusHistory(historyRes.data.data || []);
    } catch (error) {
      message.error(getErrorMessage(error));
      navigate('/tickets/list');
    } finally {
      setLoading(false);
    }
  };

  // Fetch agents and templates
  const fetchSupportData = async () => {
    if (!canManage) return;
    try {
      const [agentsRes, templatesRes] = await Promise.all([
        api.get<{ data: User[] }>('/users/agents'),
        api.get<{ data: ResponseTemplate[] }>('/response-templates'),
      ]);
      setAgents(agentsRes.data.data || []);
      setTemplates(templatesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch support data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchSupportData();
    }
  }, [id]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: newStatus });
      message.success('Status updated successfully');
      fetchTicket();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Handle assign
  const handleAssign = async (assigneeId: number) => {
    try {
      await api.patch(`/tickets/${id}/assign`, { assigned_to: assigneeId });
      message.success('Ticket assigned successfully');
      fetchTicket();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Handle delete ticket
  const handleDelete = async () => {
    try {
      await api.delete(`/tickets/${id}`);
      message.success('Ticket deleted successfully');
      navigate('/tickets/list');
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    setCommentLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', newComment);
      formData.append('is_internal', String(isInternal));
      commentFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append('attachments[]', file.originFileObj);
        }
      });

      await api.post(`/tickets/${id}/comments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Comment added successfully');
      setNewComment('');
      setIsInternal(false);
      setCommentFiles([]);
      fetchTicket();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: number) => {
    if (!editCommentText.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    try {
      await api.put(`/comments/${commentId}`, { content: editCommentText });
      message.success('Comment updated successfully');
      setEditingComment(null);
      setEditCommentText('');
      fetchTicket();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      message.success('Comment deleted successfully');
      fetchTicket();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Insert template
  const handleInsertTemplate = (template: ResponseTemplate) => {
    setNewComment((prev) => prev + (prev ? '\n\n' : '') + template.content);
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

  // Comment upload props
  const commentUploadProps: UploadProps = {
    multiple: true,
    fileList: commentFiles,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      setCommentFiles(info.fileList);
    },
    onRemove: (file) => {
      setCommentFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  // Check if user can edit comment (within 15 minutes)
  const canEditComment = (comment: Comment): boolean => {
    if (comment.user_id !== user?.id) return false;
    const createdAt = dayjs(comment.created_at);
    const now = dayjs();
    return now.diff(createdAt, 'minute') <= 15;
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
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tickets/list')}
          style={{ marginBottom: 16 }}
        >
          Back to Tickets
        </Button>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                #{ticket.ticket_number}
              </Title>
              <Tag color={statusColors[ticket.status]}>
                {statusIcons[ticket.status]} {statusLabels[ticket.status]}
              </Tag>
              <Tag color={priorityColors[ticket.priority]}>
                {priorityLabels[ticket.priority]}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              {(canManage || ticket.user_id === user?.id) && (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/tickets/${id}/edit`)}
                >
                  Edit
                </Button>
              )}
              {isAdmin && (
                <Popconfirm
                  title="Delete Ticket"
                  description="Are you sure you want to delete this ticket?"
                  onConfirm={handleDelete}
                  okText="Delete"
                  okType="danger"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>
        <Text type="secondary">
          Created {dayjs(ticket.created_at).format('MMM DD, YYYY [at] HH:mm')} ({dayjs(ticket.created_at).fromNow()})
          {ticket.updated_at !== ticket.created_at && (
            <> - Last updated {dayjs(ticket.updated_at).fromNow()}</>
          )}
        </Text>
      </div>

      <Row gutter={24}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Ticket Info */}
          <Card style={{ marginBottom: 16 }}>
            <Title level={5}>{ticket.title}</Title>
            <Divider />
            <div
              style={{ marginBottom: 16 }}
              dangerouslySetInnerHTML={{ __html: ticket.description }}
            />

            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Category">
                {ticket.category?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                <Space>
                  <Avatar
                    size="small"
                    src={ticket.user?.photo_url}
                    icon={<UserOutlined />}
                  />
                  {ticket.user?.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                {ticket.assignee ? (
                  <Space>
                    <Avatar
                      size="small"
                      src={ticket.assignee.photo_url}
                      icon={<UserOutlined />}
                    />
                    {ticket.assignee.name}
                    {canManage && (
                      <Dropdown
                        menu={{
                          items: agents.map((agent) => ({
                            key: agent.id,
                            label: agent.name,
                            onClick: () => handleAssign(agent.id),
                          })),
                        }}
                        trigger={['click']}
                      >
                        <Button type="link" size="small">
                          Reassign
                        </Button>
                      </Dropdown>
                    )}
                  </Space>
                ) : (
                  <Space>
                    <Text type="secondary">Unassigned</Text>
                    {canManage && (
                      <Dropdown
                        menu={{
                          items: agents.map((agent) => ({
                            key: agent.id,
                            label: agent.name,
                            onClick: () => handleAssign(agent.id),
                          })),
                        }}
                        trigger={['click']}
                      >
                        <Button type="link" size="small">
                          Assign
                        </Button>
                      </Dropdown>
                    )}
                  </Space>
                )}
              </Descriptions.Item>
            </Descriptions>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <>
                <Divider orientation="left">
                  <PaperClipOutlined /> Attachments ({ticket.attachments.length})
                </Divider>
                <List
                  size="small"
                  dataSource={ticket.attachments}
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
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileOutlined />}
                        title={attachment.original_filename}
                        description={`${(attachment.size / 1024).toFixed(2)} KB`}
                      />
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>

          {/* Status Timeline */}
          <Card title="Status History" style={{ marginBottom: 16 }}>
            {statusHistory.length > 0 ? (
              <Timeline
                items={statusHistory.map((history) => ({
                  color: statusColors[history.new_status],
                  dot: statusIcons[history.new_status],
                  children: (
                    <div>
                      <Text strong>
                        {history.old_status
                          ? `${statusLabels[history.old_status]} → ${statusLabels[history.new_status]}`
                          : `Created as ${statusLabels[history.new_status]}`}
                      </Text>
                      <br />
                      <Text type="secondary">
                        by {history.changed_by?.name || 'System'} -{' '}
                        {dayjs(history.created_at).format('MMM DD, YYYY HH:mm')}
                      </Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description="No status history" />
            )}
          </Card>

          {/* Comments Section */}
          <Card title={`Comments (${ticket.comments?.length || 0})`}>
            {/* Comment List */}
            {ticket.comments && ticket.comments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={ticket.comments}
                renderItem={(comment) => {
                  const isOwn = comment.user_id === user?.id;
                  const isAgentComment = comment.user?.role !== 'user';

                  return (
                    <List.Item
                      style={{
                        background: comment.is_internal
                          ? '#fff7e6'
                          : isAgentComment
                          ? '#f6ffed'
                          : '#f5f5f5',
                        padding: '12px 16px',
                        marginBottom: 8,
                        borderRadius: 8,
                        border: comment.is_internal
                          ? '1px solid #ffd591'
                          : '1px solid #e8e8e8',
                      }}
                      actions={
                        canEditComment(comment)
                          ? [
                              <Button
                                key="edit"
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditingComment(comment.id);
                                  setEditCommentText(comment.content);
                                }}
                              />,
                              <Popconfirm
                                key="delete"
                                title="Delete comment?"
                                onConfirm={() => handleDeleteComment(comment.id)}
                              >
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>,
                            ]
                          : undefined
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={comment.user?.photo_url}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>{comment.user?.name}</Text>
                            {comment.is_internal && (
                              <Tag color="orange" icon={<LockOutlined />}>
                                Internal Note
                              </Tag>
                            )}
                            {isAgentComment && !comment.is_internal && (
                              <Tag color="green">Support</Tag>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(comment.created_at).fromNow()}
                            </Text>
                          </Space>
                        }
                        description={
                          editingComment === comment.id ? (
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <TextArea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                rows={3}
                              />
                              <Space>
                                <Button
                                  size="small"
                                  type="primary"
                                  onClick={() => handleEditComment(comment.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditCommentText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Space>
                            </Space>
                          ) : (
                            <>
                              <div
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                              />
                              {comment.attachments && comment.attachments.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                  {comment.attachments.map((att) => (
                                    <Button
                                      key={att.id}
                                      size="small"
                                      type="link"
                                      icon={<PaperClipOutlined />}
                                      onClick={() => handleDownload(att)}
                                    >
                                      {att.original_filename}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </>
                          )
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty description="No comments yet" />
            )}

            {/* Add Comment Form */}
            <Divider />
            <div>
              <TextArea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                style={{ marginBottom: 16 }}
              />
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Upload {...commentUploadProps}>
                      <Button icon={<PaperClipOutlined />}>Attach Files</Button>
                    </Upload>
                    {canManage && (
                      <Space>
                        <Switch
                          checked={isInternal}
                          onChange={setIsInternal}
                          size="small"
                        />
                        <Text type="secondary">
                          <LockOutlined /> Internal Note
                        </Text>
                      </Space>
                    )}
                  </Space>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleAddComment}
                    loading={commentLoading}
                  >
                    Send
                  </Button>
                </Col>
              </Row>
              {commentFiles.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {commentFiles.map((file) => (
                    <Tag
                      key={file.uid}
                      closable
                      onClose={() =>
                        setCommentFiles((prev) =>
                          prev.filter((f) => f.uid !== file.uid)
                        )
                      }
                    >
                      {file.name}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Quick Status Change */}
          {canManage && (
            <Card title="Quick Actions" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Change Status</Text>
                <Space wrap>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Button
                      key={value}
                      size="small"
                      type={ticket.status === value ? 'primary' : 'default'}
                      onClick={() => handleStatusChange(value)}
                      disabled={ticket.status === value}
                    >
                      {label}
                    </Button>
                  ))}
                </Space>

                <Divider />

                <Text strong>Assign To</Text>
                <Select
                  placeholder="Select agent"
                  style={{ width: '100%' }}
                  value={ticket.assigned_to || undefined}
                  onChange={handleAssign}
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
              </Space>
            </Card>
          )}

          {/* Response Templates */}
          {canManage && templates.length > 0 && (
            <Card title="Response Templates" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={templates}
                renderItem={(template) => (
                  <List.Item
                    actions={[
                      <Button
                        key="insert"
                        type="link"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleInsertTemplate(template)}
                      >
                        Insert
                      </Button>,
                    ]}
                  >
                    <Text>{template.name}</Text>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Ticket Info Summary */}
          <Card title="Ticket Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Ticket ID">
                {ticket.ticket_number}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[ticket.status]}>
                  {statusLabels[ticket.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={priorityColors[ticket.priority]}>
                  {priorityLabels[ticket.priority]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {ticket.category?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(ticket.created_at).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              {ticket.resolved_at && (
                <Descriptions.Item label="Resolved">
                  {dayjs(ticket.resolved_at).format('MMM DD, YYYY HH:mm')}
                </Descriptions.Item>
              )}
              {ticket.closed_at && (
                <Descriptions.Item label="Closed">
                  {dayjs(ticket.closed_at).format('MMM DD, YYYY HH:mm')}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TicketView;
