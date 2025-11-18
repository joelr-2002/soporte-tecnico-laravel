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

// Sample data - this would come from API in production
const categories = [
  {
    id: 1,
    name: 'Getting Started',
    icon: <BookOutlined />,
    description: 'Learn the basics of using the support system',
    articleCount: 5,
  },
  {
    id: 2,
    name: 'Account & Billing',
    icon: <FolderOutlined />,
    description: 'Manage your account settings and billing information',
    articleCount: 8,
  },
  {
    id: 3,
    name: 'Troubleshooting',
    icon: <QuestionCircleOutlined />,
    description: 'Common issues and how to resolve them',
    articleCount: 12,
  },
  {
    id: 4,
    name: 'Features & How-To',
    icon: <FileTextOutlined />,
    description: 'Detailed guides on using specific features',
    articleCount: 15,
  },
];

const popularArticles = [
  {
    id: 1,
    title: 'How to create a new support ticket',
    category: 'Getting Started',
    views: 1234,
  },
  {
    id: 2,
    title: 'Understanding ticket priorities and SLAs',
    category: 'Getting Started',
    views: 987,
  },
  {
    id: 3,
    title: 'How to reset your password',
    category: 'Account & Billing',
    views: 856,
  },
  {
    id: 4,
    title: 'Troubleshooting login issues',
    category: 'Troubleshooting',
    views: 743,
  },
  {
    id: 5,
    title: 'Adding attachments to tickets',
    category: 'Features & How-To',
    views: 621,
  },
];

const faqItems = [
  {
    question: 'How do I create a new support ticket?',
    answer: 'To create a new ticket, click on the "New Ticket" button in the dashboard or navigate to Tickets > Create New. Fill in the required fields including title, description, category, and priority, then click Submit.',
  },
  {
    question: 'What do the different ticket priorities mean?',
    answer: 'Low: Non-urgent issues that can wait. Medium: Standard issues requiring attention within normal timeframes. High: Important issues that need prompt attention. Urgent: Critical issues requiring immediate response.',
  },
  {
    question: 'How can I track my ticket status?',
    answer: 'You can view all your tickets in the Tickets section. Each ticket displays its current status (New, Open, In Progress, On Hold, Resolved, Closed) along with the assigned agent and any updates.',
  },
  {
    question: 'How do SLA timers work?',
    answer: 'SLA (Service Level Agreement) timers track response and resolution times based on ticket priority. Response time measures how quickly an agent responds, while resolution time measures how long until the issue is fully resolved.',
  },
  {
    question: 'Can I add attachments to my tickets?',
    answer: 'Yes, you can attach files when creating a ticket or adding comments. Supported formats include images, PDFs, documents, and zip files up to 10MB each.',
  },
];

const KnowledgeBase: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

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
          <HomeOutlined /> Knowledge Base
        </Breadcrumb.Item>
        <Breadcrumb.Item>Getting Started</Breadcrumb.Item>
        <Breadcrumb.Item>How to create a new support ticket</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>How to create a new support ticket</Title>
      <Space style={{ marginBottom: 16 }}>
        <Tag>Getting Started</Tag>
        <Text type="secondary"><EyeOutlined /> 1,234 views</Text>
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
        <Text strong>Was this article helpful?</Text>
        <div style={{ marginTop: 8 }}>
          <Space>
            <Button icon={<LikeOutlined />}>Yes</Button>
            <Button icon={<DislikeOutlined />}>No</Button>
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
          Knowledge Base
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Find answers to common questions and learn how to use the system
        </Text>
      </div>

      {/* Search */}
      <Row justify="center" style={{ marginBottom: 32 }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Search
            placeholder="Search articles..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {/* Categories */}
      <Title level={4}>Browse by Category</Title>
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
                <Tag>{category.articleCount} articles</Tag>
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
                Popular Articles
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
                Frequently Asked Questions
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
                No articles found for "<strong>{searchQuery}</strong>"
              </span>
            }
          >
            <Button type="primary" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </Empty>
        </Card>
      )}

      {/* Contact Support */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Title level={5}>Can't find what you're looking for?</Title>
        <Paragraph type="secondary">
          If you couldn't find the answer to your question, our support team is here to help.
        </Paragraph>
        <Button type="primary" href="/tickets/create">
          Create a Support Ticket
        </Button>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
