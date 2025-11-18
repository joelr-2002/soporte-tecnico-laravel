import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Radio,
  Select,
  Switch,
  Typography,
  Space,
  Divider,
  Button,
  Row,
  Col,
  Alert,
} from 'antd';
import {
  BgColorsOutlined,
  GlobalOutlined,
  EyeOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  FontSizeOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useSettingsStore, Theme, Language, FontSize } from '../stores/settingsStore';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    theme,
    language,
    fontSize,
    highContrast,
    reducedMotion,
    effectiveTheme,
    setTheme,
    setLanguage,
    setFontSize,
    setHighContrast,
    setReducedMotion,
  } = useSettingsStore();

  const fontSizeMap: Record<FontSize, number> = {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
  };

  const fontSizeLabels: Record<FontSize, string> = {
    small: t('userSettings.small'),
    medium: t('userSettings.medium'),
    large: t('userSettings.large'),
    xlarge: t('userSettings.extraLarge'),
  };

  // Appearance Tab
  const AppearanceTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>{t('userSettings.theme')}</Title>
        <Text type="secondary">{t('userSettings.selectTheme')}</Text>
        <div style={{ marginTop: 16 }}>
          <Radio.Group
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="light">
              <SunOutlined style={{ marginRight: 8 }} />
              {t('userSettings.light')}
            </Radio.Button>
            <Radio.Button value="dark">
              <MoonOutlined style={{ marginRight: 8 }} />
              {t('userSettings.dark')}
            </Radio.Button>
            <Radio.Button value="system">
              <DesktopOutlined style={{ marginRight: 8 }} />
              {t('userSettings.system')}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t('userSettings.textPreview')}</Title>
        <Card
          style={{
            background: effectiveTheme === 'dark' ? '#141414' : '#ffffff',
            borderColor: effectiveTheme === 'dark' ? '#434343' : '#d9d9d9',
          }}
        >
          <Space direction="vertical">
            <Text
              style={{
                color: effectiveTheme === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              {t('userSettings.theme')}: {effectiveTheme === 'dark' ? t('userSettings.dark') : t('userSettings.light')}
            </Text>
            <div
              style={{
                padding: '8px 16px',
                background: effectiveTheme === 'dark' ? '#1f1f1f' : '#f5f5f5',
                borderRadius: 4,
              }}
            >
              <Text
                type="secondary"
                style={{
                  color: effectiveTheme === 'dark' ? '#8c8c8c' : '#8c8c8c',
                }}
              >
                {t('userSettings.previewText')}
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </Space>
  );

  // Language Tab
  const LanguageTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>{t('userSettings.selectLanguage')}</Title>
        <Text type="secondary">{t('userSettings.language')}</Text>
        <div style={{ marginTop: 16 }}>
          <Select
            value={language}
            onChange={(value: Language) => setLanguage(value)}
            style={{ width: 200 }}
            options={[
              { value: 'es', label: t('userSettings.spanish') },
              { value: 'en', label: t('userSettings.english') },
            ]}
          />
        </div>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t('userSettings.textPreview')}</Title>
        <Alert
          message={language === 'es' ? 'Espanol seleccionado' : 'English selected'}
          description={t('userSettings.previewText')}
          type="info"
          showIcon
        />
      </div>
    </Space>
  );

  // Accessibility Tab
  const AccessibilityTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>
          <FontSizeOutlined style={{ marginRight: 8 }} />
          {t('userSettings.fontSize')}
        </Title>
        <Text type="secondary">{t('userSettings.fontSize')}</Text>
        <div style={{ marginTop: 16 }}>
          <Radio.Group
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as FontSize)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="small">{t('userSettings.small')}</Radio.Button>
            <Radio.Button value="medium">{t('userSettings.medium')}</Radio.Button>
            <Radio.Button value="large">{t('userSettings.large')}</Radio.Button>
            <Radio.Button value="xlarge">{t('userSettings.extraLarge')}</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{t('userSettings.highContrast')}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('userSettings.highContrastDesc')}
                  </Text>
                </div>
                <Switch
                  checked={highContrast}
                  onChange={setHighContrast}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{t('userSettings.reducedMotion')}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('userSettings.reducedMotionDesc')}
                  </Text>
                </div>
                <Switch
                  checked={reducedMotion}
                  onChange={setReducedMotion}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div>
        <Title level={5}>{t('userSettings.textPreview')}</Title>
        <Card
          style={{
            filter: highContrast ? 'contrast(1.25)' : 'none',
            transition: reducedMotion ? 'none' : 'all 0.3s ease',
          }}
        >
          <Paragraph
            style={{
              fontSize: fontSizeMap[fontSize],
              marginBottom: 8,
            }}
          >
            {t('userSettings.previewText')}
          </Paragraph>
          <Space>
            <Text style={{ fontSize: fontSizeMap[fontSize] }}>
              {t('userSettings.fontSize')}: {fontSizeLabels[fontSize]} ({fontSizeMap[fontSize]}px)
            </Text>
          </Space>
          <br />
          <Space style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: fontSizeMap[fontSize] - 2 }}>
              {t('userSettings.highContrast')}: {highContrast ? t('common.enabled') : t('common.disabled')}
            </Text>
            <Text type="secondary" style={{ fontSize: fontSizeMap[fontSize] - 2 }}>
              | {t('userSettings.reducedMotion')}: {reducedMotion ? t('common.enabled') : t('common.disabled')}
            </Text>
          </Space>
        </Card>
      </div>
    </Space>
  );

  // Account Tab
  const AccountTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>{t('userSettings.account')}</Title>
        <Text type="secondary">{t('userSettings.account')}</Text>
      </div>

      <Divider />

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button
          type="primary"
          icon={<UserOutlined />}
          size="large"
          block
          onClick={() => navigate('/profile')}
        >
          {t('common.viewProfile')}
        </Button>
        <Button
          icon={<KeyOutlined />}
          size="large"
          block
          onClick={() => navigate('/profile')}
        >
          {t('common.changePassword')}
        </Button>
      </Space>
    </Space>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>{t('userSettings.title')}</Title>
      <Card>
        <Tabs
          defaultActiveKey="appearance"
          tabPosition="left"
          items={[
            {
              key: 'appearance',
              label: (
                <span>
                  <BgColorsOutlined />
                  {t('userSettings.appearance')}
                </span>
              ),
              children: <AppearanceTab />,
            },
            {
              key: 'language',
              label: (
                <span>
                  <GlobalOutlined />
                  {t('userSettings.language')}
                </span>
              ),
              children: <LanguageTab />,
            },
            {
              key: 'accessibility',
              label: (
                <span>
                  <EyeOutlined />
                  {t('userSettings.accessibility')}
                </span>
              ),
              children: <AccessibilityTab />,
            },
            {
              key: 'account',
              label: (
                <span>
                  <UserOutlined />
                  {t('userSettings.account')}
                </span>
              ),
              children: <AccountTab />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Settings;
