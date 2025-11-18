import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  List,
  Button,
  Space,
  Spin,
  message,
  Typography,
  Tooltip,
  Avatar,
} from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  EyeOutlined,
  RocketOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { Pie, Column, Line } from '@ant-design/charts';
import { Link } from 'react-router-dom';
import ticketService, { StatisticsResponse } from '../services/ticketService';
import { useAuthStore } from '../stores/authStore';
import { Ticket } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// Types for chart data
interface StatusChartData {
  status: string;
  count: number;
}

interface PriorityChartData {
  priority: string;
  count: number;
}

interface CategoryChartData {
  category: string;
  count: number;
}

interface TimeChartData {
  date: string;
  count: number;
}

interface AgentPerformance {
  agent_id: number;
  agent_name: string;
  assigned: number;
  resolved: number;
  avg_resolution_time: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsResponse['data'] | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [urgentTickets, setUrgentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const stats = await ticketService.getStatistics();
      setStatistics(stats);
      setRecentTickets(stats.recent_tickets || []);
      setUrgentTickets(stats.urgent_tickets || []);
    } catch (error) {
      message.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      open: 'blue',
      in_progress: 'orange',
      pending: 'gold',
      resolved: 'green',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  // Priority color mapping
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: 'green',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'default';
  };

  // Format status label
  const formatStatus = (status: string): string => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Table columns for recent tickets
  const ticketColumns: ColumnsType<Ticket> = [
    {
      title: 'Ticket #',
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      render: (text: string, record: Ticket) => (
        <Link to={`/tickets/${record.id}`}>
          <Text strong>{text}</Text>
        </Link>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Ticket) => (
        <Link to={`/tickets/${record.id}`}>
          <Button type="link" icon={<EyeOutlined />} size="small">
            View
          </Button>
        </Link>
      ),
    },
  ];

  // Pie chart config for status
  const statusPieConfig = {
    data: statistics?.tickets_by_status || [],
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} ({percentage})',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
    },
  };

  // Pie chart config for priority
  const priorityPieConfig = {
    data: statistics?.tickets_by_priority || [],
    angleField: 'count',
    colorField: 'priority',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} ({percentage})',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
    },
    color: ['#52c41a', '#1890ff', '#fa8c16', '#f5222d'],
  };

  // Bar chart config for categories
  const categoryBarConfig = {
    data: statistics?.tickets_by_category || [],
    xField: 'category',
    yField: 'count',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      category: { alias: 'Category' },
      count: { alias: 'Tickets' },
    },
  };

  // Line chart config for tickets over time
  const timeLineConfig = {
    data: statistics?.tickets_over_time || [],
    xField: 'date',
    yField: 'count',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
    },
    xAxis: {
      tickCount: 5,
    },
    meta: {
      date: { alias: 'Date' },
      count: { alias: 'Tickets Created' },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={statistics?.total_tickets || 0}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={statistics?.open_tickets || 0}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={statistics?.in_progress_tickets || 0}
              prefix={<SyncOutlined spin style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={statistics?.resolved_tickets || 0}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Agent-specific statistics */}
      {user?.role === 'agent' && statistics?.agent_stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="My Assigned Tickets"
                value={statistics.agent_stats.assigned_count}
                prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Resolved This Week"
                value={statistics.agent_stats.resolved_this_week}
                prefix={<RocketOutlined style={{ color: '#eb2f96' }} />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avg Resolution Time"
                value={statistics.agent_stats.avg_resolution_time}
                suffix="hours"
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Admin-specific statistics */}
      {user?.role === 'admin' && statistics?.admin_stats && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Unassigned Tickets"
                  value={statistics.admin_stats.unassigned_count}
                  prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={statistics.admin_stats.total_users}
                  prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Agents"
                  value={statistics.admin_stats.total_agents}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Agent Performance Summary */}
          {statistics.admin_stats.agent_performance && statistics.admin_stats.agent_performance.length > 0 && (
            <Card title="Agent Performance Summary" style={{ marginBottom: '24px' }}>
              <Table
                dataSource={statistics.admin_stats.agent_performance}
                rowKey="agent_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Agent',
                    dataIndex: 'agent_name',
                    key: 'agent_name',
                    render: (name: string) => (
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        {name}
                      </Space>
                    ),
                  },
                  {
                    title: 'Assigned',
                    dataIndex: 'assigned',
                    key: 'assigned',
                    align: 'center',
                  },
                  {
                    title: 'Resolved',
                    dataIndex: 'resolved',
                    key: 'resolved',
                    align: 'center',
                    render: (value: number) => (
                      <Text type="success">{value}</Text>
                    ),
                  },
                  {
                    title: 'Avg Resolution (hrs)',
                    dataIndex: 'avg_resolution_time',
                    key: 'avg_resolution_time',
                    align: 'center',
                    render: (value: number) => value.toFixed(1),
                  },
                ]}
              />
            </Card>
          )}
        </>
      )}

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Tickets by Status" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_status && statistics.tickets_by_status.length > 0 ? (
                <Pie {...statusPieConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">No data available</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tickets by Priority" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_priority && statistics.tickets_by_priority.length > 0 ? (
                <Pie {...priorityPieConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">No data available</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Tickets by Category" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_category && statistics.tickets_by_category.length > 0 ? (
                <Column {...categoryBarConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">No data available</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tickets Created (Last 30 Days)" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_over_time && statistics.tickets_over_time.length > 0 ? (
                <Line {...timeLineConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">No data available</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Tickets and Urgent Tickets */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title="Recent Tickets"
            extra={
              <Link to="/tickets">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            <Table
              dataSource={recentTickets}
              columns={ticketColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'No recent tickets' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <AlertOutlined style={{ color: '#f5222d' }} />
                Urgent Tickets
              </Space>
            }
            extra={
              <Link to="/tickets?priority=urgent,high">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            <List
              dataSource={urgentTickets}
              locale={{ emptyText: 'No urgent tickets' }}
              renderItem={(ticket: Ticket) => (
                <List.Item
                  actions={[
                    <Link key="view" to={`/tickets/${ticket.id}`}>
                      <Button type="primary" size="small" icon={<EyeOutlined />}>
                        View
                      </Button>
                    </Link>,
                    user?.role !== 'user' && (
                      <Link key="assign" to={`/tickets/${ticket.id}`}>
                        <Button size="small">Assign</Button>
                      </Link>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag color={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Tag>
                        <Text strong>{ticket.ticket_number}</Text>
                      </Space>
                    }
                    description={
                      <Tooltip title={ticket.title}>
                        <Text ellipsis style={{ maxWidth: '200px' }}>
                          {ticket.title}
                        </Text>
                      </Tooltip>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
