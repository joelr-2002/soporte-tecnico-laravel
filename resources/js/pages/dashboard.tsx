import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from '../i18n';

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `Dashboard - ${t('app.title')}`;
    }, [t]);

    // TODO: Replace with actual data from API
    const stats = {
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0,
        pendingTickets: 0,
    };

    return (
        <div>
            <Title level={2}>{t('menu.dashboard')}</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('dashboard.totalTickets')}
                            value={stats.totalTickets}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('dashboard.openTickets')}
                            value={stats.openTickets}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('dashboard.resolvedTickets')}
                            value={stats.resolvedTickets}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('dashboard.pendingTickets')}
                            value={stats.pendingTickets}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
