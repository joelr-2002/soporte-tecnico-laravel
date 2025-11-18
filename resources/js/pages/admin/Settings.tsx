import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Tabs,
  Typography,
  Row,
  Col,
  InputNumber,
  Select,
  Divider,
  message,
  Space,
} from 'antd';
import {
  SettingOutlined,
  MailOutlined,
  BellOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Form instances
  const [generalForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [slaForm] = Form.useForm();

  // Handle save (placeholder - implement API calls)
  const handleSave = async (section: string, values: Record<string, unknown>) => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      console.log(`Saving ${section} settings:`, values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      message.success(`${section} settings saved successfully`);
    } catch (error) {
      message.error(`Failed to save ${section} settings`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          {t('adminSettings.title')}
        </Title>
        <Text type="secondary">{t('adminSettings.description')}</Text>
      </div>

      <Tabs defaultActiveKey="general" tabPosition="left">
        {/* General Settings */}
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              {t('adminSettings.general')}
            </span>
          }
          key="general"
        >
          <Card title={t('adminSettings.generalSettings')}>
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={(values) => handleSave('General', values)}
              initialValues={{
                site_name: 'Support Ticket System',
                site_description: 'Technical support ticket management system',
                default_language: 'en',
                timezone: 'UTC',
                date_format: 'YYYY-MM-DD',
                time_format: 'HH:mm',
                tickets_per_page: 15,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="site_name"
                    label={t('adminSettings.siteName')}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder={t('adminSettings.enterSiteName')} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="default_language"
                    label={t('adminSettings.defaultLanguage')}
                  >
                    <Select>
                      <Select.Option value="en">{t('settings.english')}</Select.Option>
                      <Select.Option value="es">{t('settings.spanish')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="site_description"
                label={t('adminSettings.siteDescription')}
              >
                <TextArea rows={3} placeholder={t('adminSettings.enterSiteDescription')} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="timezone"
                    label={t('adminSettings.timezone')}
                  >
                    <Select>
                      <Select.Option value="UTC">UTC</Select.Option>
                      <Select.Option value="America/New_York">Eastern Time</Select.Option>
                      <Select.Option value="America/Chicago">Central Time</Select.Option>
                      <Select.Option value="America/Denver">Mountain Time</Select.Option>
                      <Select.Option value="America/Los_Angeles">Pacific Time</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="date_format"
                    label={t('adminSettings.dateFormat')}
                  >
                    <Select>
                      <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
                      <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
                      <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="tickets_per_page"
                    label="Tickets Per Page"
                  >
                    <InputNumber min={5} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t('adminSettings.saveGeneralSettings')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Email Settings */}
        <TabPane
          tab={
            <span>
              <MailOutlined />
              {t('adminSettings.email')}
            </span>
          }
          key="email"
        >
          <Card title={t('adminSettings.emailConfiguration')}>
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={(values) => handleSave('Email', values)}
              initialValues={{
                mail_driver: 'smtp',
                mail_host: '',
                mail_port: 587,
                mail_encryption: 'tls',
                mail_from_name: 'Support Team',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="mail_driver"
                    label={t('adminSettings.mailDriver')}
                  >
                    <Select>
                      <Select.Option value="smtp">SMTP</Select.Option>
                      <Select.Option value="sendmail">Sendmail</Select.Option>
                      <Select.Option value="mailgun">Mailgun</Select.Option>
                      <Select.Option value="ses">Amazon SES</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="mail_from_name"
                    label={t('adminSettings.fromName')}
                  >
                    <Input placeholder="Support Team" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="mail_host"
                    label={t('adminSettings.smtpHost')}
                  >
                    <Input placeholder="smtp.example.com" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="mail_port"
                    label={t('adminSettings.smtpPort')}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="mail_encryption"
                    label={t('adminSettings.mailEncryption')}
                  >
                    <Select>
                      <Select.Option value="tls">TLS</Select.Option>
                      <Select.Option value="ssl">SSL</Select.Option>
                      <Select.Option value="">None</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="mail_username"
                    label={t('adminSettings.smtpUsername')}
                  >
                    <Input placeholder="username" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="mail_password"
                    label={t('adminSettings.smtpPassword')}
                  >
                    <Input.Password placeholder="password" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="mail_from_address"
                label={t('adminSettings.fromAddress')}
              >
                <Input placeholder="support@example.com" type="email" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {t('adminSettings.saveEmailSettings')}
                  </Button>
                  <Button>{t('adminSettings.testEmailConnection')}</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Notification Settings */}
        <TabPane
          tab={
            <span>
              <BellOutlined />
              {t('adminSettings.notifications')}
            </span>
          }
          key="notifications"
        >
          <Card title={t('adminSettings.notificationSettings')}>
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={(values) => handleSave('Notification', values)}
              initialValues={{
                notify_new_ticket: true,
                notify_ticket_assigned: true,
                notify_ticket_updated: true,
                notify_ticket_resolved: true,
                notify_new_comment: true,
                notify_sla_warning: true,
                notify_sla_breach: true,
              }}
            >
              <Paragraph type="secondary">
                {t('adminSettings.configureNotifications')}
              </Paragraph>
              <Divider />

              <Title level={5}>{t('adminSettings.ticketNotifications')}</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="notify_new_ticket"
                    label={t('adminSettings.newTicketCreated')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notify_ticket_assigned"
                    label={t('adminSettings.ticketAssigned')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notify_ticket_updated"
                    label={t('adminSettings.ticketStatusChanged')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notify_ticket_resolved"
                    label={t('adminSettings.ticketResolved')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notify_new_comment"
                    label={t('adminSettings.newCommentAdded')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              <Title level={5}>{t('adminSettings.slaNotifications')}</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="notify_sla_warning"
                    label={t('adminSettings.slaWarning')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notify_sla_breach"
                    label={t('adminSettings.slaBreach')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t('adminSettings.saveNotificationSettings')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Security Settings */}
        <TabPane
          tab={
            <span>
              <SafetyOutlined />
              {t('adminSettings.security')}
            </span>
          }
          key="security"
        >
          <Card title={t('adminSettings.securitySettings')}>
            <Form
              form={securityForm}
              layout="vertical"
              onFinish={(values) => handleSave('Security', values)}
              initialValues={{
                require_2fa: false,
                session_lifetime: 120,
                password_min_length: 8,
                password_require_uppercase: true,
                password_require_numbers: true,
                password_require_symbols: false,
                max_login_attempts: 5,
                lockout_duration: 15,
              }}
            >
              <Title level={5}>{t('adminSettings.twoFactorAuth')}</Title>
              <Form.Item
                name="require_2fa"
                label={t('adminSettings.require2FA')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />
              <Title level={5}>{t('adminSettings.sessionSettings')}</Title>
              <Form.Item
                name="session_lifetime"
                label={t('adminSettings.sessionTimeout')}
              >
                <InputNumber min={5} max={1440} style={{ width: 200 }} />
              </Form.Item>

              <Divider />
              <Title level={5}>{t('adminSettings.passwordPolicy')}</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="password_min_length"
                    label={t('adminSettings.minPasswordLength')}
                  >
                    <InputNumber min={6} max={32} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="password_require_uppercase"
                    label={t('adminSettings.requireUppercase')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="password_require_numbers"
                    label={t('adminSettings.requireNumber')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              <Title level={5}>{t('adminSettings.loginProtection')}</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="max_login_attempts"
                    label={t('adminSettings.maxLoginAttempts')}
                  >
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lockout_duration"
                    label={t('adminSettings.lockoutDuration')}
                  >
                    <InputNumber min={5} max={60} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t('adminSettings.saveSecuritySettings')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* SLA Default Settings */}
        <TabPane
          tab={
            <span>
              <ClockCircleOutlined />
              {t('adminSettings.slaDefaults')}
            </span>
          }
          key="sla"
        >
          <Card title={t('adminSettings.defaultSlaSettings')}>
            <Form
              form={slaForm}
              layout="vertical"
              onFinish={(values) => handleSave('SLA', values)}
              initialValues={{
                auto_assign_sla: true,
                sla_warning_threshold: 30,
                business_hours_only: false,
                business_hours_start: '09:00',
                business_hours_end: '18:00',
              }}
            >
              <Form.Item
                name="auto_assign_sla"
                label="Automatically assign SLA based on priority"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sla_warning_threshold"
                label="SLA Warning Threshold (%)"
                extra="Percentage of time remaining when ticket is marked as 'at risk'"
              >
                <InputNumber min={10} max={50} style={{ width: 200 }} addonAfter="%" />
              </Form.Item>

              <Divider />
              <Title level={5}>{t('adminSettings.businessHours')}</Title>
              <Form.Item
                name="business_hours_only"
                label="Calculate SLA during business hours only"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="business_hours_start"
                    label={t('adminSettings.startTime')}
                  >
                    <Input type="time" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="business_hours_end"
                    label={t('adminSettings.endTime')}
                  >
                    <Input type="time" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t('adminSettings.saveSlaSettings')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Settings;
