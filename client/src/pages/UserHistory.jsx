import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Table, Card, Tag, Avatar, Space, Button, Typography, 
    Row, Col, Statistic, Spin, Empty, Divider, Breadcrumb, 
    Descriptions, Tooltip as AntTooltip 
} from 'antd';
import { 
    UserOutlined, ShoppingCartOutlined, WalletOutlined, 
    CalendarOutlined, ArrowLeftOutlined, HomeOutlined, 
    LineChartOutlined, MailOutlined, PhoneOutlined,
    ClockCircleOutlined, CheckCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';

const { Title, Text, Paragraph } = Typography;

const UserHistory = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getUserHistory,
                url: `${SummaryApi.getUserHistory.url}/${userId}`
            });
            if (response.data.success) {
                setHistoryData(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch purchase history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserHistory();
        }
    }, [userId]);

    const historyColumns = [
        {
            title: 'ORDER INFO',
            key: 'orderInfo',
            width: 300,
            render: (_, record) => (
                <Space size="middle">
                    <Avatar 
                        shape="square" 
                        size={54} 
                        src={record.product_details?.image[0] || record.productId?.image[0]} 
                        icon={<ShoppingCartOutlined />} 
                        style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Text strong style={{ fontSize: '15px' }}>{record.product_details?.name || record.productId?.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.orderId}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'QUANTITY',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (qty) => (
                <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, display: 'inline-block' }}>
                    {qty} Units
                </div>
            )
        },
        {
            title: 'PAYMENT',
            key: 'payment',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ color: '#10b981', fontSize: '16px' }}>₹{record.totalAmt.toLocaleString()}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{record.payment_status}</Text>
                </div>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'tracking_status',
            key: 'tracking_status',
            render: (status) => {
                const colors = {
                    'Delivered': '#10b981',
                    'Processing': '#3b82f6',
                    'Pending': '#f59e0b',
                    'Shipped': '#8b5cf6',
                    'Cancelled': '#ef4444'
                };
                return (
                    <Tag 
                        color={colors[status] || 'default'} 
                        style={{ borderRadius: '6px', padding: '2px 10px', border: 'none', fontWeight: 600 }}
                    >
                        {status?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'PURCHASE DATE',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#94a3b8' }} />
                    <Text style={{ color: '#475569' }}>
                        {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div style={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text strong style={{ marginTop: 12, color: '#64748b' }}>Analyzing Customer Behavior...</Text>
                </Space>
            </div>
        );
    }

    const userData = historyData?.user || {};

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={{ marginBottom: 32 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space direction="vertical" size={4}>
                            <Breadcrumb style={{ marginBottom: 8 }}>
                                <Breadcrumb.Item href="/dashboard"><HomeOutlined /> Dashboard</Breadcrumb.Item>
                                <Breadcrumb.Item href="/dashboard/users">Users</Breadcrumb.Item>
                                <Breadcrumb.Item>Purchase History</Breadcrumb.Item>
                            </Breadcrumb>
                            <Space size={16}>
                                <Button 
                                    icon={<ArrowLeftOutlined />} 
                                    onClick={() => navigate(-1)} 
                                    shape="circle"
                                    style={{ border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                />
                                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Customer Analytics</Title>
                            </Space>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Button icon={<MailOutlined />} size="large" style={{ borderRadius: 10 }}>Email User</Button>
                            <Button type="primary" size="large" style={{ borderRadius: 10, background: '#4f46e5' }}>Edit Profile</Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Row gutter={[24, 24]}>
                {/* User Profile Info Card */}
                <Col xs={24}>
                    <Card 
                        bordered={false} 
                        style={{ borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', height: '100px' }} />
                        <div style={{ padding: '0 32px 32px', marginTop: '-40px' }}>
                            <Row gutter={32} align="bottom">
                                <Col>
                                    <Avatar 
                                        size={120} 
                                        src={userData.avatar} 
                                        icon={<UserOutlined />} 
                                        style={{ border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#f0f2f5' }} 
                                    />
                                </Col>
                                <Col flex="auto">
                                    <div style={{ marginBottom: 8 }}>
                                        <Space align="center" size={12}>
                                            <Title level={3} style={{ margin: 0 }}>{userData.name || "Customer Name"}</Title>
                                            <Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: 20 }}>Verified</Tag>
                                        </Space>
                                        <Paragraph type="secondary" style={{ margin: 0 }}>Customer since {new Date(userData.createdAt || Date.now()).toLocaleDateString()}</Paragraph>
                                    </div>
                                    <Row gutter={24}>
                                        <Col><Space><MailOutlined /> <Text>{userData.email}</Text></Space></Col>
                                        <Col><Space><PhoneOutlined /> <Text>{userData.mobile || "No Mobile Provided"}</Text></Space></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>

                {/* Statistics Cards */}
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <Statistic 
                            title="LIFETIME VALUE" 
                            value={historyData?.summary?.totalSpent || 0} 
                            prefix={<WalletOutlined style={{ color: '#4f46e5' }} />} 
                            suffix="₹"
                            valueStyle={{ color: '#1e293b', fontWeight: 800 }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Text type="secondary"><Text strong style={{ color: '#10b981' }}>+12%</Text> than average customer</Text>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <Statistic 
                            title="TOTAL ORDERS" 
                            value={historyData?.summary?.totalOrders || 0} 
                            prefix={<ShoppingCartOutlined style={{ color: '#10b981' }} />} 
                            valueStyle={{ color: '#1e293b', fontWeight: 800 }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Text type="secondary"><ClockCircleOutlined /> Last order {new Date(historyData?.orders?.[0]?.createdAt).toLocaleDateString()}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <Statistic 
                            title="ITEMS BOUGHT" 
                            value={historyData?.summary?.totalItems || 0} 
                            prefix={<LineChartOutlined style={{ color: '#f59e0b' }} />} 
                            valueStyle={{ color: '#1e293b', fontWeight: 800 }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Text type="secondary">Avg. {((historyData?.summary?.totalItems || 0) / (historyData?.summary?.totalOrders || 1)).toFixed(1)} items per order</Text>
                    </Card>
                </Col>                {/* Purchase Trend Chart - Full Width */}
                <Col xs={24}>
                    <Card 
                        title={<Title level={5} style={{ margin: 0 }}>Spending Journey</Title>}
                        extra={<Text type="secondary">Activity visualization over time</Text>}
                        bordered={false} 
                        style={{ borderRadius: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                    >
                        <div style={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData?.trends}>
                                    <defs>
                                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`₹${value}`, 'Spending']}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                {/* Transaction Table */}
                <Col xs={24}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0, padding: '16px 0' }}>Transaction History</Title>}
                        bordered={false} 
                        style={{ borderRadius: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                        bodyStyle={{ padding: '0 24px 24px' }}
                    >
                        <Table 
                            columns={historyColumns} 
                            dataSource={historyData?.orders} 
                            rowKey="_id"
                            pagination={{ pageSize: 10, hideOnSinglePage: true }}
                            style={{ borderRadius: 16, overflow: 'hidden' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserHistory;
