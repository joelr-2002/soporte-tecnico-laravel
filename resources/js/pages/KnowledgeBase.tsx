import React, { useState } from 'react';
import {
  Card,
  Input,
  Typography,
  Row,
  Col,
  List,
  Tag,
  Space,
  Empty,
  Collapse,
  Breadcrumb,
  Button,
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  FolderOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  HomeOutlined,
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

const KnowledgeBase: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  // Sample data - this would come from API in production
  const categories = [
    {
      id: 1,
      name: t('knowledgeBase.gettingStarted'),
      icon: <BookOutlined />,
      description: t('knowledgeBase.gettingStartedDesc'),
      articleCount: 5,
    },
    {
      id: 2,
      name: t('knowledgeBase.accountBilling'),
      icon: <FolderOutlined />,
      description: t('knowledgeBase.accountBillingDesc'),
      articleCount: 8,
    },
    {
      id: 3,
      name: t('knowledgeBase.troubleshooting'),
      icon: <QuestionCircleOutlined />,
      description: t('knowledgeBase.troubleshootingDesc'),
      articleCount: 12,
    },
    {
      id: 4,
      name: t('knowledgeBase.featuresHowTo'),
      icon: <FileTextOutlined />,
      description: t('knowledgeBase.featuresHowToDesc'),
      articleCount: 15,
    },
  ];

  const popularArticles = [
    {
      id: 1,
      title: t('knowledgeBase.articleCreateTicket'),
      category: t('knowledgeBase.gettingStarted'),
      views: 1234,
    },
    {
      id: 2,
      title: t('knowledgeBase.articlePrioritiesSla'),
      category: t('knowledgeBase.gettingStarted'),
      views: 987,
    },
    {
      id: 3,
      title: t('knowledgeBase.articleResetPassword'),
      category: t('knowledgeBase.accountBilling'),
      views: 856,
    },
    {
      id: 4,
      title: t('knowledgeBase.articleLoginIssues'),
      category: t('knowledgeBase.troubleshooting'),
      views: 743,
    },
    {
      id: 5,
      title: t('knowledgeBase.articleAttachments'),
      category: t('knowledgeBase.featuresHowTo'),
      views: 621,
    },
  ];

  const faqItems = [
    {
      question: t('knowledgeBase.faqHowToSubmit'),
      answer: t('knowledgeBase.faqHowToSubmitAnswer'),
    },
    {
      question: t('knowledgeBase.faqResponseTime'),
      answer: t('knowledgeBase.faqResponseTimeAnswer'),
    },
    {
      question: t('knowledgeBase.faqTrackStatus'),
      answer: t('knowledgeBase.faqTrackStatusAnswer'),
    },
    {
      question: t('knowledgeBase.faqAddAttachment'),
      answer: t('knowledgeBase.faqAddAttachmentAnswer'),
    },
    {
      question: t('knowledgeBase.faqContactSupport'),
      answer: t('knowledgeBase.faqContactSupportAnswer'),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: Implement search API call
    console.log('Searching for:', value);
  };

  // Sample article content
  const sampleArticleContent = (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/knowledge-base">
          <HomeOutlined /> {t('knowledgeBase.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('knowledgeBase.gettingStarted')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('knowledgeBase.articleCreateTicket')}</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>{t('knowledgeBase.articleCreateTicket')}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Tag>{t('knowledgeBase.gettingStarted')}</Tag>
        <Text type="secondary"><EyeOutlined /> 1,234 {t('knowledgeBase.views')}</Text>
      </Space>

      <Paragraph>
        Creating a support ticket is the primary way to get help from our support team.
        Follow these steps to submit a new ticket:
      </Paragraph>

      <Title level={5}>Step 1: Navigate to the Ticket Creation Page</Title>
      <Paragraph>
        Click on the "New Ticket" button in the dashboard sidebar, or go to
        Tickets → Create New from the main menu.
      </Paragraph>

      <Title level={5}>Step 2: Fill in the Ticket Details</Title>
      <Paragraph>
        <ul>
          <li><strong>Title:</strong> Provide a brief, descriptive title for your issue</li>
          <li><strong>Description:</strong> Explain your issue in detail. Include any error messages, steps to reproduce, and what you've already tried</li>
          <li><strong>Category:</strong> Select the most appropriate category for your issue</li>
          <li><strong>Priority:</strong> Choose the urgency level based on the impact</li>
        </ul>
      </Paragraph>

      <Title level={5}>Step 3: Add Attachments (Optional)</Title>
      <Paragraph>
        If relevant, attach screenshots, log files, or other documents that may help
        us understand and resolve your issue faster.
      </Paragraph>

      <Title level={5}>Step 4: Submit the Ticket</Title>
      <Paragraph>
        Review your information and click "Submit". You'll receive a ticket number
        that you can use to track the status of your request.
      </Paragraph>

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <Text strong>{t('knowledgeBase.wasHelpful')}</Text>
        <div style={{ marginTop: 8 }}>
          <Space>
            <Button icon={<LikeOutlined />}>{t('common.yes')}</Button>
            <Button icon={<DislikeOutlined />}>{t('common.no')}</Button>
          </Space>
        </div>
      </div>
    </div>
  );

  if (selectedArticle) {
    return (
      <div>
        <Button
          type="link"
          onClick={() => setSelectedArticle(null)}
          style={{ padding: 0, marginBottom: 16 }}
        >
          ← Back to Knowledge Base
        </Button>
        <Card>{sampleArticleContent}</Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: 8 }} />
          {t('knowledgeBase.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {t('knowledgeBase.subtitle')}
        </Text>
      </div>

      {/* Search */}
      <Row justify="center" style={{ marginBottom: 32 }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Search
            placeholder={t('knowledgeBase.searchPlaceholder')}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {/* Categories */}
      <Title level={4}>{t('knowledgeBase.browseByCategory')}</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {categories.map(category => (
          <Col xs={24} sm={12} md={6} key={category.id}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              onClick={() => console.log('Category clicked:', category.id)}
            >
              <div style={{ fontSize: 32, marginBottom: 16, color: '#1890ff' }}>
                {category.icon}
              </div>
              <Title level={5} style={{ marginBottom: 8 }}>{category.name}</Title>
              <Text type="secondary">{category.description}</Text>
              <div style={{ marginTop: 12 }}>
                <Tag>{category.articleCount} {t('knowledgeBase.articles')}</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Articles */}
      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span>
                <FileTextOutlined style={{ marginRight: 8 }} />
                {t('knowledgeBase.popularArticles')}
              </span>
            }
          >
            <List
              dataSource={popularArticles}
              renderItem={article => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedArticle(article.id)}
                  actions={[
                    <Text type="secondary" key="views">
                      <EyeOutlined /> {article.views}
                    </Text>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                    title={article.title}
                    description={<Tag>{article.category}</Tag>}
                  />
                  <RightOutlined style={{ color: '#d9d9d9' }} />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* FAQ */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span>
                <QuestionCircleOutlined style={{ marginRight: 8 }} />
                {t('knowledgeBase.faq')}
              </span>
            }
          >
            <Collapse
              bordered={false}
              expandIconPosition="end"
              style={{ background: 'transparent' }}
            >
              {faqItems.map((item, index) => (
                <Panel
                  header={<Text strong>{item.question}</Text>}
                  key={index}
                  style={{ marginBottom: 8 }}
                >
                  <Paragraph style={{ marginBottom: 0 }}>{item.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>
      </Row>

      {/* No results state */}
      {searchQuery && (
        <Card style={{ marginTop: 24 }}>
          <Empty
            description={
              <span>
                {t('knowledgeBase.noArticlesFound')} "<strong>{searchQuery}</strong>"
              </span>
            }
          >
            <Button type="primary" onClick={() => setSearchQuery('')}>
              {t('knowledgeBase.clearSearch')}
            </Button>
          </Empty>
        </Card>
      )}

      {/* Contact Support */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Title level={5}>{t('knowledgeBase.cantFindAnswer')}</Title>
        <Paragraph type="secondary">
          {t('knowledgeBase.cantFindAnswerDesc')}
        </Paragraph>
        <Button type="primary" href="/tickets/create">
          {t('knowledgeBase.createSupportTicket')}
        </Button>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
