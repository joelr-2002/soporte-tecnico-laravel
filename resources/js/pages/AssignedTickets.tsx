import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Input,
  Select,
  message,
  Tooltip,
  Badge,
  Statistic,
} from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Ticket } from '../types';
import api from '../services/api';
import { useTranslation } from '@/i18n';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const priorityColors: Record<string, string> = {
  low: 'blue',
  medium: 'cyan',
  high: 'orange',
  urgent: 'red',
};

const statusColors: Record<string, string> = {
  new: 'default',
  open: 'processing',
  in_progress: 'warning',
  on_hold: 'default',
  resolved: 'success',
  closed: 'default',
};

const AssignedTickets: React.FC = () => {
  const { t } = useTranslation();

  // Data states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    in_progress: 0,
    on_hold: 0,
  });

  // Pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tickets`,
  });

  // Fetch assigned tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.current),
        per_page: String(pagination.pageSize),
        assigned_to: 'me',
      });

      if (searchText) params.append('search', searchText);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const response = await api.get(`/tickets?${params.toString()}`);
      const data = response.data;

      setTickets(data.data);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));

      // Calculate stats from response
      const ticketData = data.data as Ticket[];
      setStats({
        total: data.total,
        new: ticketData.filter(t => t.status === 'new' || t.status === 'open').length,
        in_progress: ticketData.filter(t => t.status === 'in_progress').length,
        on_hold: ticketData.filter(t => t.status === 'on_hold').length,
      });
    } catch (error) {
      message.error('Failed to fetch assigned tickets');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle table change
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  // Get SLA status badge
  const getSlaStatusBadge = (ticket: Ticket) => {
    if (!ticket.sla_status) return null;

    const statusConfig = {
      ok: { status: 'success' as const, text: 'On Track' },
      at_risk: { status: 'warning' as const, text: 'At Risk' },
      breached: { status: 'error' as const, text: 'Breached' },
    };

    const config = statusConfig[ticket.sla_status];
    return config ? <Badge status={config.status} text={config.text} /> : null;
  };

  // Table columns
  const columns: ColumnsType<Ticket> = [
    {
      title: 'Ticket',
      key: 'ticket',
      width: 280,
      render: (_, record) => (
        <div>
          <Text strong>{record.ticket_number}</Text>
          <br />
          <Text ellipsis style={{ maxWidth: 250 }}>{record.title}</Text>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      align: 'center',
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'SLA',
      key: 'sla',
      width: 120,
      render: (_, record) => getSlaStatusBadge(record),
    },
    {
      title: 'Client',
      key: 'client',
      width: 150,
      render: (_, record) => (
        <Text ellipsis>{record.user?.name || '-'}</Text>
      ),
    },
    {
      title: 'Category',
      key: 'category',
      width: 130,
      render: (_, record) => (
        <Tag>{record.category?.name || '-'}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('MMM DD, YYYY HH:mm')}>
          <span>{dayjs(date).fromNow()}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="View Ticket">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.location.href = `/tickets/${record.id}`}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>My Assigned Tickets</Title>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTickets}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Assigned"
              value={stats.total}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="New/Open"
              value={stats.new}
              prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={stats.in_progress}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="On Hold"
              value={stats.on_hold}
              prefix={<CheckCircleOutlined style={{ color: '#8c8c8c' }} />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search tickets..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                setPagination(prev => ({ ...prev, current: 1 }));
                fetchTickets();
              }}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
            >
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="on_hold">On Hold</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={8}>
            <Select
              placeholder="Filter by priority"
              style={{ width: '100%' }}
              value={priorityFilter}
              onChange={(value) => {
                setPriorityFilter(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
            >
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Tickets Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
};

export default AssignedTickets;
