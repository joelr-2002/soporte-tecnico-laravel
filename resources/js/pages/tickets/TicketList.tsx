import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  DatePicker,
  Dropdown,
  Modal,
  message,
  Tooltip,
  Row,
  Col,
  Typography,
  Popconfirm,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import api, { getErrorMessage } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../i18n';
import type { Ticket, Category, User, PaginatedResponse } from '../../types';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
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

// Status and priority labels will be defined inside component to use translations

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const canManage = isAdmin || isAgent;

  // Translated labels
  const statusLabels: Record<string, string> = {
    open: t('status.open'),
    in_progress: t('status.inProgress'),
    pending: t('status.pending'),
    resolved: t('status.resolved'),
    closed: t('status.closed'),
  };

  const priorityLabels: Record<string, string> = {
    low: t('priority.low'),
    medium: t('priority.medium'),
    high: t('priority.high'),
    urgent: t('priority.urgent'),
  };

  // Data states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [assignedFilter, setAssignedFilter] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Table params
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tickets`,
    },
  });

  // Bulk action modal states
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkAssignee, setBulkAssignee] = useState<number | undefined>();
  const [bulkStatus, setBulkStatus] = useState<string | undefined>();

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: tableParams.pagination.current,
        per_page: tableParams.pagination.pageSize,
      };

      if (searchText) params.search = searchText;
      if (statusFilter.length > 0) params.status = statusFilter.join(',');
      if (priorityFilter.length > 0) params.priority = priorityFilter.join(',');
      if (categoryFilter) params.category_id = categoryFilter;
      if (assignedFilter) params.assigned_to = assignedFilter;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.date_from = dateRange[0].format('YYYY-MM-DD');
        params.date_to = dateRange[1].format('YYYY-MM-DD');
      }
      if (tableParams.sortField) {
        params.sort_by = tableParams.sortField;
        params.sort_order = tableParams.sortOrder || 'asc';
      }

      const response = await api.get<PaginatedResponse<Ticket>>('/tickets', { params });
      setTickets(response.data.data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.total,
        },
      });
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortField, tableParams.sortOrder, searchText, statusFilter, priorityFilter, categoryFilter, assignedFilter, dateRange]);

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
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchFilters();
  }, []);

  // Handle table change
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Ticket> | SorterResult<Ticket>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setTableParams({
      pagination,
      filters,
      sortField: singleSorter.field as string,
      sortOrder: singleSorter.order === 'ascend' ? 'asc' : singleSorter.order === 'descend' ? 'desc' : undefined,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setStatusFilter([]);
    setPriorityFilter([]);
    setCategoryFilter(undefined);
    setAssignedFilter(undefined);
    setDateRange(null);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  // Delete ticket
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tickets/${id}`);
      message.success(t('ticketList.ticketDeletedSuccessfully'));
      fetchTickets();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Quick status change
  const handleQuickStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      message.success(t('ticketList.statusUpdatedSuccessfully'));
      fetchTickets();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Bulk assign
  const handleBulkAssign = async () => {
    if (!bulkAssignee) {
      message.warning(t('ticketList.pleaseSelectAgent'));
      return;
    }
    try {
      await api.post('/tickets/bulk-assign', {
        ticket_ids: selectedRowKeys,
        assigned_to: bulkAssignee,
      });
      message.success(`${selectedRowKeys.length} ${t('ticketList.ticketsAssignedSuccessfully')}`);
      setBulkAssignModal(false);
      setBulkAssignee(undefined);
      setSelectedRowKeys([]);
      fetchTickets();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Bulk status change
  const handleBulkStatusChange = async () => {
    if (!bulkStatus) {
      message.warning(t('ticketList.pleaseSelectStatus'));
      return;
    }
    try {
      await api.post('/tickets/bulk-status', {
        ticket_ids: selectedRowKeys,
        status: bulkStatus,
      });
      message.success(`${selectedRowKeys.length} ${t('ticketList.ticketsUpdatedSuccessfully')}`);
      setBulkStatusModal(false);
      setBulkStatus(undefined);
      setSelectedRowKeys([]);
      fetchTickets();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    Modal.confirm({
      title: t('ticketList.deleteSelectedTickets'),
      icon: <ExclamationCircleOutlined />,
      content: t('ticketList.confirmBulkDelete', { count: selectedRowKeys.length }),
      okText: t('common.delete'),
      okType: 'danger',
      onOk: async () => {
        try {
          await api.post('/tickets/bulk-delete', {
            ticket_ids: selectedRowKeys,
          });
          message.success(`${selectedRowKeys.length} ${t('ticketList.ticketsDeletedSuccessfully')}`);
          setSelectedRowKeys([]);
          fetchTickets();
        } catch (error) {
          message.error(getErrorMessage(error));
        }
      },
    });
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      const params: Record<string, unknown> = {};
      if (searchText) params.search = searchText;
      if (statusFilter.length > 0) params.status = statusFilter.join(',');
      if (priorityFilter.length > 0) params.priority = priorityFilter.join(',');
      if (categoryFilter) params.category_id = categoryFilter;
      if (assignedFilter) params.assigned_to = assignedFilter;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.date_from = dateRange[0].format('YYYY-MM-DD');
        params.date_to = dateRange[1].format('YYYY-MM-DD');
      }

      const response = await api.get('/tickets/export', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tickets-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  // Action menu for each row
  const getActionMenu = (record: Ticket): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: t('ticketList.viewDetails'),
        onClick: () => navigate(`/tickets/${record.id}`),
      },
    ];

    if (canManage || record.user_id === user?.id) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: t('common.edit'),
        onClick: () => navigate(`/tickets/${record.id}/edit`),
      });
    }

    if (canManage) {
      items.push({
        type: 'divider',
      });
      items.push({
        key: 'status',
        label: t('ticketList.changeStatus'),
        children: Object.entries(statusLabels).map(([value, label]) => ({
          key: `status-${value}`,
          label,
          disabled: record.status === value,
          onClick: () => handleQuickStatusChange(record.id, value),
        })),
      });
    }

    if (isAdmin) {
      items.push({
        type: 'divider',
      });
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: t('common.delete'),
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: t('ticketList.deleteTicket'),
            icon: <ExclamationCircleOutlined />,
            content: t('ticketList.confirmDeleteTicket', { ticketNumber: record.ticket_number }),
            okText: t('common.delete'),
            okType: 'danger',
            onOk: () => handleDelete(record.id),
          });
        },
      });
    }

    return items;
  };

  // Table columns
  const columns: ColumnsType<Ticket> = [
    {
      title: t('tickets.ticketNumber'),
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      sorter: true,
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('tickets.title'),
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <a onClick={() => navigate(`/tickets/${record.id}`)}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: t('tickets.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      sorter: true,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: t('tickets.priority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      sorter: true,
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>
      ),
    },
    {
      title: t('tickets.category'),
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (category: Category) => category?.name || '-',
    },
    {
      title: t('tickets.createdBy'),
      dataIndex: 'user',
      key: 'user',
      width: 130,
      render: (ticketUser: User) => ticketUser?.name || '-',
    },
    {
      title: t('tickets.assignedTo'),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 130,
      render: (assignee: User) => (
        assignee ? (
          <Badge status="processing" text={assignee.name} />
        ) : (
          <Text type="secondary">{t('tickets.unassigned')}</Text>
        )
      ),
    },
    {
      title: t('tickets.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      sorter: true,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Row selection config
  const rowSelection = isAdmin
    ? {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
      }
    : undefined;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>{t('ticketList.title')}</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTickets()}
              >
                {t('common.refresh')}
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                {t('ticketList.exportCsv')}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/tickets/create')}
              >
                {t('ticketList.newTicket')}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder={t('ticketList.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => fetchTickets()}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              mode="multiple"
              placeholder={t('ticketList.filterByStatus')}
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              maxTagCount="responsive"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={statusColors[value]}>{label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              mode="multiple"
              placeholder={t('ticketList.filterByPriority')}
              style={{ width: '100%' }}
              value={priorityFilter}
              onChange={setPriorityFilter}
              allowClear
              maxTagCount="responsive"
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={priorityColors[value]}>{label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder={t('ticketList.filterByCategory')}
              style={{ width: '100%' }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          {canManage && (
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder={t('tickets.assignedTo')}
                style={{ width: '100%' }}
                value={assignedFilter}
                onChange={setAssignedFilter}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <Select.Option value={0}>{t('tickets.unassigned')}</Select.Option>
                {agents.map((agent) => (
                  <Select.Option key={agent.id} value={agent.id}>
                    {agent.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={2}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => fetchTickets()}
                type="primary"
              >
                {t('common.filter')}
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={clearFilters}
              >
                {t('common.clear')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {isAdmin && selectedRowKeys.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>{t('ticketList.ticketsSelected', { count: selectedRowKeys.length })}</Text>
            <Button onClick={() => setBulkAssignModal(true)}>
              {t('ticketList.bulkAssign')}
            </Button>
            <Button onClick={() => setBulkStatusModal(true)}>
              {t('ticketList.bulkChangeStatus')}
            </Button>
            <Button danger onClick={handleBulkDelete}>
              {t('common.delete')}
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>
              {t('ticketList.clearSelection')}
            </Button>
          </Space>
        </Card>
      )}

      {/* Tickets Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onClick: () => navigate(`/tickets/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* Bulk Assign Modal */}
      <Modal
        title={t('ticketList.bulkAssign')}
        open={bulkAssignModal}
        onOk={handleBulkAssign}
        onCancel={() => {
          setBulkAssignModal(false);
          setBulkAssignee(undefined);
        }}
      >
        <p>{t('ticketList.confirmBulkAssign', { count: selectedRowKeys.length })}</p>
        <Select
          placeholder={t('ticketList.selectAgent')}
          style={{ width: '100%' }}
          value={bulkAssignee}
          onChange={setBulkAssignee}
          showSearch
          optionFilterProp="children"
        >
          {agents.map((agent) => (
            <Select.Option key={agent.id} value={agent.id}>
              {agent.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Bulk Status Change Modal */}
      <Modal
        title={t('ticketList.bulkChangeStatus')}
        open={bulkStatusModal}
        onOk={handleBulkStatusChange}
        onCancel={() => {
          setBulkStatusModal(false);
          setBulkStatus(undefined);
        }}
      >
        <p>{t('ticketList.confirmBulkStatus', { count: selectedRowKeys.length })}</p>
        <Select
          placeholder={t('ticketList.selectStatus')}
          style={{ width: '100%' }}
          value={bulkStatus}
          onChange={setBulkStatus}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              <Tag color={statusColors[value]}>{label}</Tag>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default TicketList;
