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
  InputNumber,
  Switch,
  message,
  Typography,
  Tag,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Statistic,
  Progress,
  Tabs,
  List,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import slaService, { AtRiskTicket, BreachedTicket } from '../../services/slaService';
import { Sla, SlaFormData, SlaComplianceStats } from '../../types';
import { useTranslation } from '../../i18n';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Slas: React.FC = () => {
  const { t } = useTranslation();

  // Data states
  const [slas, setSlas] = useState<Sla[]>([]);
  const [complianceStats, setComplianceStats] = useState<SlaComplianceStats | null>(null);
  const [atRiskTickets, setAtRiskTickets] = useState<AtRiskTicket[]>([]);
  const [breachedTickets, setBreachedTickets] = useState<BreachedTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSla, setEditingSla] = useState<Sla | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Active tab
  const [activeTab, setActiveTab] = useState('slas');

  // Fetch SLAs
  const fetchSlas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await slaService.getSlas();
      setSlas(response);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch SLAs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch compliance stats
  const fetchComplianceStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const stats = await slaService.getComplianceStats();
      setComplianceStats(stats);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch compliance stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch at-risk tickets
  const fetchAtRiskTickets = useCallback(async () => {
    try {
      const tickets = await slaService.getAtRiskTickets(60);
      setAtRiskTickets(tickets);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch at-risk tickets');
    }
  }, []);

  // Fetch breached tickets
  const fetchBreachedTickets = useCallback(async () => {
    try {
      const response = await slaService.getBreachedTickets();
      setBreachedTickets(response.data);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch breached tickets');
    }
  }, []);

  useEffect(() => {
    fetchSlas();
    fetchComplianceStats();
    fetchAtRiskTickets();
    fetchBreachedTickets();
  }, [fetchSlas, fetchComplianceStats, fetchAtRiskTickets, fetchBreachedTickets]);

  // Create SLA
  const handleCreate = async (values: SlaFormData) => {
    setSubmitting(true);
    try {
      await slaService.createSla(values);
      message.success('SLA created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchSlas();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create SLA');
    } finally {
      setSubmitting(false);
    }
  };

  // Update SLA
  const handleUpdate = async (values: Partial<SlaFormData>) => {
    if (!editingSla) return;

    setSubmitting(true);
    try {
      await slaService.updateSla(editingSla.id, values);
      message.success('SLA updated successfully');
      setEditModalVisible(false);
      setEditingSla(null);
      editForm.resetFields();
      fetchSlas();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update SLA');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete SLA
  const handleDelete = async (id: number) => {
    try {
      await slaService.deleteSla(id);
      message.success('SLA deleted successfully');
      fetchSlas();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to delete SLA');
    }
  };

  // Open edit modal
  const openEditModal = (sla: Sla) => {
    setEditingSla(sla);
    editForm.setFieldsValue({
      name: sla.name,
      description: sla.description,
      priority: sla.priority,
      response_time: sla.response_time,
      resolution_time: sla.resolution_time,
      is_active: sla.is_active,
    });
    setEditModalVisible(true);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'blue';
      case 'medium': return 'cyan';
      case 'high': return 'orange';
      case 'urgent': return 'red';
      default: return 'default';
    }
  };

  // Table columns for SLAs
  const columns: ColumnsType<Sla> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      align: 'center',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Response Time',
      dataIndex: 'formatted_response_time',
      key: 'response_time',
      width: 130,
      align: 'center',
      render: (text) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Resolution Time',
      dataIndex: 'formatted_resolution_time',
      key: 'resolution_time',
      width: 140,
      align: 'center',
      render: (text) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      align: 'center',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Tickets',
      dataIndex: 'tickets_count',
      key: 'tickets_count',
      width: 100,
      align: 'center',
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
              title="Delete SLA"
              description="Are you sure you want to delete this SLA?"
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

  // Form component (reused for create and edit)
  const SlaForm = ({ form, onFinish, initialValues }: {
    form: ReturnType<typeof Form.useForm>[0];
    onFinish: (values: SlaFormData) => void;
    initialValues?: Partial<SlaFormData>;
  }) => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Please enter SLA name' },
          { max: 255, message: 'Name cannot exceed 255 characters' },
        ]}
      >
        <Input placeholder="Enter SLA name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea
          placeholder="Enter SLA description"
          rows={3}
        />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: 'Please select priority' }]}
      >
        <Select placeholder="Select priority">
          <Select.Option value="low">Low</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="high">High</Select.Option>
          <Select.Option value="urgent">Urgent</Select.Option>
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="response_time"
            label="Response Time (minutes)"
            rules={[
              { required: true, message: 'Please enter response time' },
              { type: 'number', min: 1, message: 'Must be at least 1 minute' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="e.g., 60"
              min={1}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="resolution_time"
            label="Resolution Time (minutes)"
            rules={[
              { required: true, message: 'Please enter resolution time' },
              { type: 'number', min: 1, message: 'Must be at least 1 minute' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="e.g., 480"
              min={1}
            />
          </Form.Item>
        </Col>
      </Row>

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
            form.resetFields();
            setCreateModalVisible(false);
            setEditModalVisible(false);
          }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {editingSla ? 'Update' : 'Create'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  // Compliance dashboard
  const ComplianceDashboard = () => (
    <div>
      {/* Overall Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Tickets with SLA"
              value={complianceStats?.total_tickets_with_sla || 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Response Compliance"
              value={complianceStats?.response.compliance_rate || 100}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: (complianceStats?.response.compliance_rate || 100) >= 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Resolution Compliance"
              value={complianceStats?.resolution.compliance_rate || 100}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: (complianceStats?.resolution.compliance_rate || 100) >= 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="At Risk"
              value={(complianceStats?.response.at_risk || 0) + (complianceStats?.resolution.at_risk || 0)}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Compliance Progress */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Response Time Compliance">
            <Progress
              percent={complianceStats?.response.compliance_rate || 100}
              status={(complianceStats?.response.compliance_rate || 100) >= 90 ? 'success' : 'exception'}
              strokeColor={(complianceStats?.response.compliance_rate || 100) >= 90 ? '#52c41a' : '#ff4d4f'}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Statistic
                  title="Compliant"
                  value={complianceStats?.response.compliant || 0}
                  valueStyle={{ color: '#52c41a', fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Breached"
                  value={complianceStats?.response.breached || 0}
                  valueStyle={{ color: '#ff4d4f', fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="At Risk"
                  value={complianceStats?.response.at_risk || 0}
                  valueStyle={{ color: '#faad14', fontSize: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Resolution Time Compliance">
            <Progress
              percent={complianceStats?.resolution.compliance_rate || 100}
              status={(complianceStats?.resolution.compliance_rate || 100) >= 90 ? 'success' : 'exception'}
              strokeColor={(complianceStats?.resolution.compliance_rate || 100) >= 90 ? '#52c41a' : '#ff4d4f'}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Statistic
                  title="Compliant"
                  value={complianceStats?.resolution.compliant || 0}
                  valueStyle={{ color: '#52c41a', fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Breached"
                  value={complianceStats?.resolution.breached || 0}
                  valueStyle={{ color: '#ff4d4f', fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="At Risk"
                  value={complianceStats?.resolution.at_risk || 0}
                  valueStyle={{ color: '#faad14', fontSize: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* At Risk Tickets */}
      <Card
        title={
          <span>
            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
            At Risk Tickets
          </span>
        }
        style={{ marginBottom: 24 }}
        extra={
          <Badge count={atRiskTickets.length} style={{ backgroundColor: '#faad14' }} />
        }
      >
        {atRiskTickets.length > 0 ? (
          <List
            size="small"
            dataSource={atRiskTickets}
            renderItem={(ticket) => (
              <List.Item
                actions={[
                  <a key="view" href={`/tickets/${ticket.id}`}>View</a>
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
                      {ticket.ticket_number} - {ticket.title}
                    </span>
                  }
                  description={
                    <Space>
                      {ticket.response_time_remaining !== null && (
                        <Text type="warning">
                          Response: {slaService.formatMinutes(ticket.response_time_remaining)}
                        </Text>
                      )}
                      {ticket.resolution_time_remaining !== null && (
                        <Text type="warning">
                          Resolution: {slaService.formatMinutes(ticket.resolution_time_remaining)}
                        </Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No tickets at risk</Text>
        )}
      </Card>

      {/* Breached Tickets */}
      <Card
        title={
          <span>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            Breached Tickets
          </span>
        }
        extra={
          <Badge count={breachedTickets.length} style={{ backgroundColor: '#ff4d4f' }} />
        }
      >
        {breachedTickets.length > 0 ? (
          <List
            size="small"
            dataSource={breachedTickets}
            renderItem={(ticket) => (
              <List.Item
                actions={[
                  <a key="view" href={`/tickets/${ticket.id}`}>View</a>
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
                      {ticket.ticket_number} - {ticket.title}
                    </span>
                  }
                  description={
                    <Space>
                      {ticket.sla_response_breached && (
                        <Tag color="red">Response Breached</Tag>
                      )}
                      {ticket.sla_resolution_breached && (
                        <Tag color="red">Resolution Breached</Tag>
                      )}
                      <Text type="secondary">
                        Created: {dayjs(ticket.created_at).format('MMM D, YYYY HH:mm')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No breached tickets</Text>
        )}
      </Card>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>SLA Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchSlas();
                  fetchComplianceStats();
                  fetchAtRiskTickets();
                  fetchBreachedTickets();
                }}
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
                New SLA
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="SLA Policies" key="slas">
          <Card>
            <Table
              columns={columns}
              dataSource={slas}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="Compliance Dashboard" key="compliance">
          <ComplianceDashboard />
        </TabPane>
      </Tabs>

      {/* Create Modal */}
      <Modal
        title="Create SLA"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <SlaForm
          form={createForm}
          onFinish={handleCreate}
          initialValues={{ is_active: true }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit SLA"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingSla(null);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <SlaForm
          form={editForm}
          onFinish={handleUpdate}
        />
      </Modal>
    </div>
  );
};

export default Slas;
