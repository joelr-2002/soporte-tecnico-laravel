import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import {
  Card,
  List,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Row,
  Col,
  Segmented,
  Empty,
  Spin,
  Badge,
  Avatar,
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import notificationService from '../services/notificationService';
import { Notification } from '../types';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

// Notification type icons and colors
const notificationConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  ticket_created: {
    icon: <BellOutlined />,
    color: '#1890ff',
  },
  ticket_assigned: {
    icon: <UserAddOutlined />,
    color: '#52c41a',
  },
  ticket_updated: {
    icon: <InfoCircleOutlined />,
    color: '#faad14',
  },
  ticket_resolved: {
    icon: <CheckCircleOutlined />,
    color: '#52c41a',
  },
  ticket_closed: {
    icon: <CheckOutlined />,
    color: '#d9d9d9',
  },
  comment_added: {
    icon: <CommentOutlined />,
    color: '#1890ff',
  },
  ticket_overdue: {
    icon: <ClockCircleOutlined />,
    color: '#ff4d4f',
  },
  priority_changed: {
    icon: <ExclamationCircleOutlined />,
    color: '#fa8c16',
  },
  default: {
    icon: <BellOutlined />,
    color: '#1890ff',
  },
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Data states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({
        page: pagination.current,
        per_page: pagination.pageSize,
        unread_only: filter === 'unread',
      });
      setNotifications(response.data);
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      message.success(t('notifications.markedAsRead'));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('notifications.failedToMark'));
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      message.success(t('notifications.allMarkedAsRead'));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('notifications.failedToMarkAll'));
    }
  };

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      message.success(t('notifications.deleted'));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('notifications.failedToDelete'));
    }
  };

  // Navigate to related ticket
  const handleNotificationClick = (notification: Notification) => {
    if (notification.data.ticket_id) {
      // Mark as read first
      if (!notification.read_at) {
        notificationService.markAsRead(notification.id);
      }
      navigate(`/tickets/${notification.data.ticket_id}`);
    } else if (notification.data.action_url) {
      window.location.href = notification.data.action_url;
    }
  };

  // Get notification icon and color
  const getNotificationStyle = (type: string) => {
    // Extract notification type from full class name
    const typeKey = type.split('\\').pop()?.replace('Notification', '').toLowerCase() || 'default';
    return notificationConfig[typeKey] || notificationConfig.default;
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={4} style={{ margin: 0 }}>{t('notifications.title')}</Title>
              {unreadCount > 0 && (
                <Badge count={unreadCount} style={{ marginLeft: 8 }} />
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchNotifications()}
              >
                {t('common.refresh')}
              </Button>
              <Button
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                {t('notifications.markAllRead')}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Segmented
          options={[
            { label: t('notifications.allNotifications'), value: 'all' },
            {
              label: (
                <Space>
                  {t('notifications.unread')}
                  {unreadCount > 0 && <Badge count={unreadCount} size="small" />}
                </Space>
              ),
              value: 'unread',
            },
          ]}
          value={filter}
          onChange={(value) => {
            setFilter(value as 'all' | 'unread');
            setPagination({ ...pagination, current: 1 });
          }}
        />
      </Card>

      {/* Notifications List */}
      <Card>
        <Spin spinning={loading}>
          {notifications.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                filter === 'unread' ? t('notifications.noUnreadNotifications') : t('notifications.noNotifications')
              }
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              pagination={{
                ...pagination,
                onChange: handlePaginationChange,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`,
              }}
              renderItem={(notification) => {
                const { icon, color } = getNotificationStyle(notification.type);
                const isUnread = !notification.read_at;

                return (
                  <List.Item
                    style={{
                      backgroundColor: isUnread ? '#f6ffed' : 'transparent',
                      padding: '12px 16px',
                      cursor: notification.data.ticket_id ? 'pointer' : 'default',
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    actions={[
                      !isUnread ? null : (
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          {t('notifications.markAsRead')}
                        </Button>
                      ),
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      />,
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: color }}
                          icon={icon}
                        />
                      }
                      title={
                        <Space>
                          <Text strong={isUnread}>{notification.data.title}</Text>
                          {isUnread && (
                            <Tag color="blue" style={{ margin: 0 }}>
                              {t('notifications.new')}
                            </Tag>
                          )}
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph
                            style={{ margin: 0, marginBottom: 4 }}
                            ellipsis={{ rows: 2 }}
                          >
                            {notification.data.message}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(notification.created_at).fromNow()}
                          </Text>
                          {notification.data.ticket_id && (
                            <Tag
                              color="default"
                              style={{ marginLeft: 8, fontSize: 11 }}
                            >
                              {t('notifications.ticketPrefix')} #{notification.data.ticket_id}
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default Notifications;
