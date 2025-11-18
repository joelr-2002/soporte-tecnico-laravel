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
import { useTranslation } from '../i18n';
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
  const { t } = useTranslation();
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
      message.error(t('dashboard.loadError'));
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
      title: t('dashboard.ticketNumber'),
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      render: (text: string, record: Ticket) => (
        <Link to={`/tickets/${record.id}`}>
          <Text strong>{text}</Text>
        </Link>
      ),
    },
    {
      title: t('dashboard.title'),
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
      title: t('dashboard.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
    {
      title: t('dashboard.priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: t('dashboard.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('dashboard.actions'),
      key: 'actions',
      render: (_: unknown, record: Ticket) => (
        <Link to={`/tickets/${record.id}`}>
          <Button type="link" icon={<EyeOutlined />} size="small">
            {t('common.view')}
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
      category: { alias: t('dashboard.category') },
      count: { alias: t('dashboard.tickets') },
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
      date: { alias: t('dashboard.date') },
      count: { alias: t('dashboard.ticketsCreated') },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip={t('dashboard.loading')} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{t('dashboard.title')}</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalTickets')}
              value={statistics?.total_tickets || 0}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.openTickets')}
              value={statistics?.open_tickets || 0}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.inProgress')}
              value={statistics?.in_progress_tickets || 0}
              prefix={<SyncOutlined spin style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.resolved')}
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
                title={t('dashboard.myAssignedTickets')}
                value={statistics.agent_stats.assigned_count}
                prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t('dashboard.resolvedThisWeek')}
                value={statistics.agent_stats.resolved_this_week}
                prefix={<RocketOutlined style={{ color: '#eb2f96' }} />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t('dashboard.avgResolutionTime')}
                value={statistics.agent_stats.avg_resolution_time}
                suffix={t('dashboard.hours')}
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
                  title={t('dashboard.unassignedTickets')}
                  value={statistics.admin_stats.unassigned_count}
                  prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title={t('dashboard.totalUsers')}
                  value={statistics.admin_stats.total_users}
                  prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title={t('dashboard.totalAgents')}
                  value={statistics.admin_stats.total_agents}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Agent Performance Summary */}
          {statistics.admin_stats.agent_performance && statistics.admin_stats.agent_performance.length > 0 && (
            <Card title={t('dashboard.agentPerformanceSummary')} style={{ marginBottom: '24px' }}>
              <Table
                dataSource={statistics.admin_stats.agent_performance}
                rowKey="agent_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: t('dashboard.agent'),
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
                    title: t('dashboard.assigned'),
                    dataIndex: 'assigned',
                    key: 'assigned',
                    align: 'center',
                  },
                  {
                    title: t('dashboard.resolved'),
                    dataIndex: 'resolved',
                    key: 'resolved',
                    align: 'center',
                    render: (value: number) => (
                      <Text type="success">{value}</Text>
                    ),
                  },
                  {
                    title: t('dashboard.avgResolutionHours'),
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
          <Card title={t('dashboard.ticketsByStatus')} extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_status && statistics.tickets_by_status.length > 0 ? (
                <Pie {...statusPieConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">{t('dashboard.noDataAvailable')}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.ticketsByPriority')} extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_priority && statistics.tickets_by_priority.length > 0 ? (
                <Pie {...priorityPieConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">{t('dashboard.noDataAvailable')}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.ticketsByCategory')} extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_by_category && statistics.tickets_by_category.length > 0 ? (
                <Column {...categoryBarConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">{t('dashboard.noDataAvailable')}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.ticketsCreatedLast30Days')} extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              {statistics?.tickets_over_time && statistics.tickets_over_time.length > 0 ? (
                <Line {...timeLineConfig} />
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                  <Text type="secondary">{t('dashboard.noDataAvailable')}</Text>
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
            title={t('dashboard.recentTickets')}
            extra={
              <Link to="/tickets">
                <Button type="link">{t('common.viewAll')}</Button>
              </Link>
            }
          >
            <Table
              dataSource={recentTickets}
              columns={ticketColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: t('dashboard.noRecentTickets') }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <AlertOutlined style={{ color: '#f5222d' }} />
                {t('dashboard.urgentTickets')}
              </Space>
            }
            extra={
              <Link to="/tickets?priority=urgent,high">
                <Button type="link">{t('common.viewAll')}</Button>
              </Link>
            }
          >
            <List
              dataSource={urgentTickets}
              locale={{ emptyText: t('dashboard.noUrgentTickets') }}
              renderItem={(ticket: Ticket) => (
                <List.Item
                  actions={[
                    <Link key="view" to={`/tickets/${ticket.id}`}>
                      <Button type="primary" size="small" icon={<EyeOutlined />}>
                        {t('common.view')}
                      </Button>
                    </Link>,
                    user?.role !== 'user' && (
                      <Link key="assign" to={`/tickets/${ticket.id}`}>
                        <Button size="small">{t('common.assign')}</Button>
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
