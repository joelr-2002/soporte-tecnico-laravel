import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Space,
  Table,
  Typography,
  Statistic,
  message,
  Checkbox,
  Modal,
  Spin,
  Segmented,
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import reportService, {
  TicketsByStatusData,
  TicketsByPriorityData,
  TicketsByCategoryData,
  AgentPerformanceData,
  TicketsByPeriodData,
  ReportFilters,
} from '../services/reportService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Chart colors
const statusColors = ['#1890ff', '#faad14', '#52c41a', '#d9d9d9', '#ff4d4f'];
const priorityColors = ['#d9d9d9', '#1890ff', '#fa8c16', '#ff4d4f'];
const categoryColors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96', '#fa541c'];


// Simple pie chart component
const SimplePieChart: React.FC<{
  data: { name: string; value: number; color: string }[];
  title: string;
}> = ({ data, title }) => {
  const { t } = useTranslation();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <Title level={5} style={{ textAlign: 'center', marginBottom: 16 }}>
        <PieChartOutlined style={{ marginRight: 8 }} />
        {title}
      </Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Text strong>{item.value}</Text>
              <Text type="secondary">({percentage}%)</Text>
            </div>
          );
        })}
        {data.length === 0 && (
          <Text type="secondary" style={{ textAlign: 'center' }}>{t('reports.noDataAvailable')}</Text>
        )}
      </div>
    </div>
  );
};

// Simple bar chart component
const SimpleBarChart: React.FC<{
  data: { name: string; value: number; color: string }[];
  title: string;
}> = ({ data, title }) => {
  const { t } = useTranslation();
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div>
      <Title level={5} style={{ textAlign: 'center', marginBottom: 16 }}>
        <BarChartOutlined style={{ marginRight: 8 }} />
        {title}
      </Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((item, index) => (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text ellipsis style={{ maxWidth: '60%' }}>{item.name}</Text>
              <Text strong>{item.value}</Text>
            </div>
            <div
              style={{
                height: 20,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  height: '100%',
                  backgroundColor: item.color,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <Text type="secondary" style={{ textAlign: 'center' }}>{t('reports.noDataAvailable')}</Text>
        )}
      </div>
    </div>
  );
};

// Simple line chart component
const SimpleLineChart: React.FC<{
  data: TicketsByPeriodData[];
  title: string;
}> = ({ data, title }) => {
  const { t } = useTranslation();
  const maxValue = Math.max(...data.map((item) => item.count), 1);
  const height = 200;
  const width = 100;

  return (
    <div>
      <Title level={5} style={{ textAlign: 'center', marginBottom: 16 }}>
        <LineChartOutlined style={{ marginRight: 8 }} />
        {title}
      </Title>
      {data.length > 0 ? (
        <div style={{ position: 'relative', height }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: '100%' }}
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#1890ff"
              strokeWidth="2"
              points={data
                .map((item, index) => {
                  const x = (index / (data.length - 1 || 1)) * width;
                  const y = height - (item.count / maxValue) * (height - 20);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1 || 1)) * width;
              const y = height - (item.count / maxValue) * (height - 20);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#1890ff"
                />
              );
            })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {data.length > 0 && (
              <>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {data[0].period}
                </Text>
                {data.length > 1 && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {data[data.length - 1].period}
                  </Text>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          {t('reports.noDataAvailable')}
        </Text>
      )}
    </div>
  );
};

const Reports: React.FC = () => {
  const { t } = useTranslation();

  // Quick date range options with translations
  const quickRanges = [
    { label: t('reports.today'), value: 'today' },
    { label: t('reports.thisWeek'), value: 'week' },
    { label: t('reports.thisMonth'), value: 'month' },
    { label: t('reports.thisQuarter'), value: 'quarter' },
    { label: t('reports.thisYear'), value: 'year' },
    { label: t('reports.custom'), value: 'custom' },
  ];

  // Date range states
  const [quickRange, setQuickRange] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Data states
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<TicketsByStatusData[]>([]);
  const [priorityData, setPriorityData] = useState<TicketsByPriorityData[]>([]);
  const [categoryData, setCategoryData] = useState<TicketsByCategoryData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TicketsByPeriodData[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformanceData[]>([]);
  const [resolutionStats, setResolutionStats] = useState<{
    avg_hours: number;
    median_hours: number;
    by_priority: { priority: string; avg_hours: number }[];
  }>({
    avg_hours: 0,
    median_hours: 0,
    by_priority: [],
  });

  // Export modal state
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportColumns, setExportColumns] = useState<string[]>([
    'ticket_number',
    'title',
    'status',
    'priority',
    'created_at',
  ]);
  const [exporting, setExporting] = useState(false);

  // Available export columns
  const availableColumns = [
    { label: t('reports.ticketNumber'), value: 'ticket_number' },
    { label: t('tickets.title'), value: 'title' },
    { label: t('reports.description'), value: 'description' },
    { label: t('tickets.status'), value: 'status' },
    { label: t('tickets.priority'), value: 'priority' },
    { label: t('tickets.category'), value: 'category' },
    { label: t('reports.createdBy'), value: 'user' },
    { label: t('reports.assignedTo'), value: 'assignee' },
    { label: t('reports.createdAt'), value: 'created_at' },
    { label: t('reports.updatedAt'), value: 'updated_at' },
    { label: t('reports.resolvedAt'), value: 'resolved_at' },
  ];

  // Update date range based on quick selection
  useEffect(() => {
    const now = dayjs();
    let start: dayjs.Dayjs;
    let end: dayjs.Dayjs = now;

    switch (quickRange) {
      case 'today':
        start = now.startOf('day');
        end = now.endOf('day');
        break;
      case 'week':
        start = now.startOf('week');
        end = now.endOf('week');
        break;
      case 'month':
        start = now.startOf('month');
        end = now.endOf('month');
        break;
      case 'quarter':
        start = now.startOf('quarter');
        end = now.endOf('quarter');
        break;
      case 'year':
        start = now.startOf('year');
        end = now.endOf('year');
        break;
      default:
        return;
    }

    setDateRange([start, end]);
  }, [quickRange]);

  // Fetch all report data
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: ReportFilters = {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
      };

      const [
        statusRes,
        priorityRes,
        categoryRes,
        timeSeriesRes,
        performanceRes,
        resolutionRes,
      ] = await Promise.all([
        reportService.getTicketsByStatus(filters),
        reportService.getTicketsByPriority(filters),
        reportService.getTicketsByCategory(filters),
        reportService.getTicketsByPeriod(
          dateRange[0].format('YYYY-MM-DD'),
          dateRange[1].format('YYYY-MM-DD'),
          groupBy
        ),
        reportService.getAgentPerformance(filters),
        reportService.getAverageResolutionTime(filters),
      ]);

      setStatusData(statusRes);
      setPriorityData(priorityRes);
      setCategoryData(categoryRes);
      setTimeSeriesData(timeSeriesRes);
      setAgentPerformance(performanceRes);

      // Process resolution stats
      if (resolutionRes && resolutionRes.length > 0) {
        const avgHours = resolutionRes.reduce((sum, r) => sum + r.avg_hours, 0) / resolutionRes.length;
        setResolutionStats({
          avg_hours: avgHours,
          median_hours: resolutionRes[Math.floor(resolutionRes.length / 2)]?.avg_hours || 0,
          by_priority: [],
        });
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('reports.failedToFetch'));
    } finally {
      setLoading(false);
    }
  }, [dateRange, groupBy, t]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Handle export
  const handleExport = async () => {
    if (exportColumns.length === 0) {
      message.warning(t('reports.selectAtLeastOneColumn'));
      return;
    }

    setExporting(true);
    try {
      const blob = await reportService.exportToCsv({
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        report_type: 'tickets',
      });
      reportService.downloadCsv(
        blob,
        `tickets-report-${dateRange[0].format('YYYY-MM-DD')}-to-${dateRange[1].format('YYYY-MM-DD')}.csv`
      );
      message.success(t('reports.exportedSuccessfully'));
      setExportModalVisible(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('reports.failedToExport'));
    } finally {
      setExporting(false);
    }
  };

  // Agent performance table columns
  const agentColumns: ColumnsType<AgentPerformanceData> = [
    {
      title: t('reports.agent'),
      dataIndex: 'agent_name',
      key: 'agent_name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('reports.totalAssigned'),
      dataIndex: 'total_assigned',
      key: 'total_assigned',
      align: 'center',
      sorter: (a, b) => a.total_assigned - b.total_assigned,
    },
    {
      title: t('reports.totalResolved'),
      dataIndex: 'total_resolved',
      key: 'total_resolved',
      align: 'center',
      sorter: (a, b) => a.total_resolved - b.total_resolved,
    },
    {
      title: t('reports.avgResolutionTime'),
      dataIndex: 'avg_resolution_time_hours',
      key: 'avg_resolution_time_hours',
      align: 'center',
      sorter: (a, b) => a.avg_resolution_time_hours - b.avg_resolution_time_hours,
      render: (hours: number) => {
        if (hours < 1) {
          return `${Math.round(hours * 60)} min`;
        }
        return `${hours.toFixed(1)} hrs`;
      },
    },
    {
      title: t('reports.resolutionRate'),
      dataIndex: 'resolution_rate',
      key: 'resolution_rate',
      align: 'center',
      sorter: (a, b) => a.resolution_rate - b.resolution_rate,
      render: (rate: number) => (
        <Text type={rate >= 80 ? 'success' : rate >= 60 ? 'warning' : undefined}>
          {rate.toFixed(1)}%
        </Text>
      ),
    },
  ];

  // Format status data for chart
  const formattedStatusData = statusData.map((item, index) => ({
    name: item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' '),
    value: item.count,
    color: statusColors[index % statusColors.length],
  }));

  // Format priority data for chart
  const formattedPriorityData = priorityData.map((item, index) => ({
    name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    value: item.count,
    color: priorityColors[index % priorityColors.length],
  }));

  // Format category data for chart
  const formattedCategoryData = categoryData.map((item, index) => ({
    name: item.category_name,
    value: item.count,
    color: categoryColors[index % categoryColors.length],
  }));

  return (
    <Spin spinning={loading} size="large">
      <div>
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>{t('reports.title')}</Title>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchReportData()}
                >
                  {t('common.refresh')}
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => setExportModalVisible(true)}
                >
                  {t('reports.exportCSV')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Date Range Selector */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Space wrap>
                <Text strong>{t('reports.quickRange')}</Text>
                <Segmented
                  options={quickRanges}
                  value={quickRange}
                  onChange={(value) => setQuickRange(value as string)}
                />
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space wrap>
                <Text strong>{t('reports.customRange')}</Text>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                      setQuickRange('custom');
                    }
                  }}
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Charts Row 1: Status and Priority */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Card>
              <SimplePieChart
                data={formattedStatusData}
                title={t('reports.ticketsByStatus')}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <SimplePieChart
                data={formattedPriorityData}
                title={t('reports.ticketsByPriority')}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2: Category and Time Series */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Card>
              <SimpleBarChart
                data={formattedCategoryData}
                title={t('reports.ticketsByCategory')}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Select
                  value={groupBy}
                  onChange={setGroupBy}
                  style={{ width: 120 }}
                  size="small"
                >
                  <Select.Option value="day">{t('reports.daily')}</Select.Option>
                  <Select.Option value="week">{t('reports.weekly')}</Select.Option>
                  <Select.Option value="month">{t('reports.monthly')}</Select.Option>
                </Select>
              </div>
              <SimpleLineChart
                data={timeSeriesData}
                title={t('reports.ticketsOverTime')}
              />
            </Card>
          </Col>
        </Row>

        {/* Agent Performance Table */}
        <Card style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 16 }}>{t('reports.agentPerformance')}</Title>
          <Table
            columns={agentColumns}
            dataSource={agentPerformance}
            rowKey="agent_id"
            pagination={false}
            size="middle"
          />
        </Card>

        {/* Resolution Time Stats */}
        <Card style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 16 }}>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {t('reports.resolutionTimeStats')}
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <Statistic
                title={t('reports.averageResolutionTime')}
                value={resolutionStats.avg_hours}
                precision={1}
                suffix="hours"
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={t('reports.medianResolutionTime')}
                value={resolutionStats.median_hours}
                precision={1}
                suffix="hours"
              />
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                {t('reports.byPriority')}
              </Text>
              <Space wrap>
                {['low', 'medium', 'high', 'urgent'].map((priority) => {
                  const stats = resolutionStats.by_priority.find(
                    (p) => p.priority === priority
                  );
                  return (
                    <Card key={priority} size="small" style={{ minWidth: 100 }}>
                      <Statistic
                        title={priority.charAt(0).toUpperCase() + priority.slice(1)}
                        value={stats?.avg_hours || 0}
                        precision={1}
                        suffix="hrs"
                        valueStyle={{ fontSize: 16 }}
                      />
                    </Card>
                  );
                })}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Export Modal */}
        <Modal
          title={t('reports.exportReport')}
          open={exportModalVisible}
          onCancel={() => setExportModalVisible(false)}
          onOk={handleExport}
          okText={t('reports.export')}
          cancelText={t('common.cancel')}
          confirmLoading={exporting}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>{t('reports.dateRange')}</Text>
            <Text style={{ marginLeft: 8 }}>
              {dateRange[0].format('MMM DD, YYYY')} - {dateRange[1].format('MMM DD, YYYY')}
            </Text>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('reports.selectColumnsToExport')}
            </Text>
            <Checkbox.Group
              options={availableColumns}
              value={exportColumns}
              onChange={(values) => setExportColumns(values as string[])}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            />
          </div>
        </Modal>
      </div>
    </Spin>
  );
};

export default Reports;
