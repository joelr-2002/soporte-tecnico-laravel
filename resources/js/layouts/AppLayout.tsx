import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Typography,
  Button,
  Space,
  theme,
} from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  PlusOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Menu items based on user role
  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/tickets',
        icon: <FileTextOutlined />,
        label: 'Tickets',
        children: [
          {
            key: '/tickets/list',
            label: 'All Tickets',
          },
          {
            key: '/tickets/create',
            icon: <PlusOutlined />,
            label: 'Create Ticket',
          },
        ],
      },
    ];

    // Admin and Agent specific menu items
    if (user?.role === 'admin' || user?.role === 'agent') {
      items.push({
        key: '/assigned',
        icon: <TeamOutlined />,
        label: 'Assigned to Me',
      });
    }

    // Admin specific menu items
    if (user?.role === 'admin') {
      items.push(
        {
          key: '/admin',
          icon: <SettingOutlined />,
          label: 'Administration',
          children: [
            {
              key: '/admin/users',
              icon: <TeamOutlined />,
              label: 'Users',
            },
            {
              key: '/admin/categories',
              icon: <AppstoreOutlined />,
              label: 'Categories',
            },
            {
              key: '/admin/departments',
              label: 'Departments',
            },
            {
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: 'Settings',
            },
          ],
        }
      );
    }

    // Knowledge base (for all users)
    items.push({
      key: '/knowledge-base',
      icon: <QuestionCircleOutlined />,
      label: 'Knowledge Base',
    });

    return items;
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: async () => {
        await logout();
        navigate('/auth/login');
      },
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // Find the selected key based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };

  // Find the open keys for nested menus
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/tickets')) return ['/tickets'];
    if (path.startsWith('/admin')) return ['/admin'];
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography.Title
            level={4}
            style={{
              color: '#fff',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {collapsed ? 'ST' : 'Support Tickets'}
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={getMenuItems()}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          <Space size="middle">
            <Badge count={notificationCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => navigate('/notifications')}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src={user?.photo_url}
                  icon={<UserOutlined />}
                />
                <Text>{user?.name}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
