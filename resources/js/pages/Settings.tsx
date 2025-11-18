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

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Translation strings
const translations = {
  es: {
    settings: 'Configuracion',
    appearance: 'Apariencia',
    language: 'Idioma',
    accessibility: 'Accesibilidad',
    account: 'Cuenta',
    theme: 'Tema',
    themeDescription: 'Selecciona el tema de la aplicacion',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    preview: 'Vista previa',
    currentTheme: 'Tema actual',
    selectLanguage: 'Seleccionar idioma',
    languageDescription: 'Elige el idioma de la interfaz',
    spanish: 'Espanol',
    english: 'Ingles',
    previewText: 'Este es un texto de ejemplo en el idioma seleccionado.',
    fontSize: 'Tamano de fuente',
    fontSizeDescription: 'Ajusta el tamano del texto en la aplicacion',
    small: 'Pequeno',
    medium: 'Mediano',
    large: 'Grande',
    xlarge: 'Extra Grande',
    highContrast: 'Alto contraste',
    highContrastDescription: 'Aumenta el contraste de colores para mejor visibilidad',
    reducedMotion: 'Reducir movimiento',
    reducedMotionDescription: 'Desactiva animaciones y transiciones',
    accessibilityPreview: 'Vista previa de accesibilidad',
    viewProfile: 'Ver perfil',
    changePassword: 'Cambiar contrasena',
    accountDescription: 'Gestiona tu informacion personal y seguridad',
    enabled: 'Activado',
    disabled: 'Desactivado',
  },
  en: {
    settings: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    accessibility: 'Accessibility',
    account: 'Account',
    theme: 'Theme',
    themeDescription: 'Select the application theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    preview: 'Preview',
    currentTheme: 'Current theme',
    selectLanguage: 'Select language',
    languageDescription: 'Choose the interface language',
    spanish: 'Spanish',
    english: 'English',
    previewText: 'This is a sample text in the selected language.',
    fontSize: 'Font size',
    fontSizeDescription: 'Adjust the text size in the application',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xlarge: 'Extra Large',
    highContrast: 'High contrast',
    highContrastDescription: 'Increase color contrast for better visibility',
    reducedMotion: 'Reduce motion',
    reducedMotionDescription: 'Disable animations and transitions',
    accessibilityPreview: 'Accessibility preview',
    viewProfile: 'View profile',
    changePassword: 'Change password',
    accountDescription: 'Manage your personal information and security',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
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

  const t = translations[language];

  const fontSizeMap: Record<FontSize, number> = {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
  };

  const fontSizeLabels: Record<FontSize, string> = {
    small: t.small,
    medium: t.medium,
    large: t.large,
    xlarge: t.xlarge,
  };

  // Appearance Tab
  const AppearanceTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>{t.theme}</Title>
        <Text type="secondary">{t.themeDescription}</Text>
        <div style={{ marginTop: 16 }}>
          <Radio.Group
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="light">
              <SunOutlined style={{ marginRight: 8 }} />
              {t.light}
            </Radio.Button>
            <Radio.Button value="dark">
              <MoonOutlined style={{ marginRight: 8 }} />
              {t.dark}
            </Radio.Button>
            <Radio.Button value="system">
              <DesktopOutlined style={{ marginRight: 8 }} />
              {t.system}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t.preview}</Title>
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
              {t.currentTheme}: {effectiveTheme === 'dark' ? t.dark : t.light}
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
                {t.previewText}
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
        <Title level={5}>{t.selectLanguage}</Title>
        <Text type="secondary">{t.languageDescription}</Text>
        <div style={{ marginTop: 16 }}>
          <Select
            value={language}
            onChange={(value: Language) => setLanguage(value)}
            style={{ width: 200 }}
            options={[
              { value: 'es', label: t.spanish },
              { value: 'en', label: t.english },
            ]}
          />
        </div>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t.preview}</Title>
        <Alert
          message={language === 'es' ? 'Espanol seleccionado' : 'English selected'}
          description={t.previewText}
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
          {t.fontSize}
        </Title>
        <Text type="secondary">{t.fontSizeDescription}</Text>
        <div style={{ marginTop: 16 }}>
          <Radio.Group
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as FontSize)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="small">{t.small}</Radio.Button>
            <Radio.Button value="medium">{t.medium}</Radio.Button>
            <Radio.Button value="large">{t.large}</Radio.Button>
            <Radio.Button value="xlarge">{t.xlarge}</Radio.Button>
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
                  <Title level={5} style={{ margin: 0 }}>{t.highContrast}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t.highContrastDescription}
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
                  <Title level={5} style={{ margin: 0 }}>{t.reducedMotion}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t.reducedMotionDescription}
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
        <Title level={5}>{t.accessibilityPreview}</Title>
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
            {t.previewText}
          </Paragraph>
          <Space>
            <Text style={{ fontSize: fontSizeMap[fontSize] }}>
              {t.fontSize}: {fontSizeLabels[fontSize]} ({fontSizeMap[fontSize]}px)
            </Text>
          </Space>
          <br />
          <Space style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: fontSizeMap[fontSize] - 2 }}>
              {t.highContrast}: {highContrast ? t.enabled : t.disabled}
            </Text>
            <Text type="secondary" style={{ fontSize: fontSizeMap[fontSize] - 2 }}>
              | {t.reducedMotion}: {reducedMotion ? t.enabled : t.disabled}
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
        <Title level={5}>{t.account}</Title>
        <Text type="secondary">{t.accountDescription}</Text>
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
          {t.viewProfile}
        </Button>
        <Button
          icon={<KeyOutlined />}
          size="large"
          block
          onClick={() => navigate('/profile')}
        >
          {t.changePassword}
        </Button>
      </Space>
    </Space>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>{t.settings}</Title>
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
                  {t.appearance}
                </span>
              ),
              children: <AppearanceTab />,
            },
            {
              key: 'language',
              label: (
                <span>
                  <GlobalOutlined />
                  {t.language}
                </span>
              ),
              children: <LanguageTab />,
            },
            {
              key: 'accessibility',
              label: (
                <span>
                  <EyeOutlined />
                  {t.accessibility}
                </span>
              ),
              children: <AccessibilityTab />,
            },
            {
              key: 'account',
              label: (
                <span>
                  <UserOutlined />
                  {t.account}
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
