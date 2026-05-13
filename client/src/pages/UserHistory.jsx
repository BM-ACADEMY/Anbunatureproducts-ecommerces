// c:\Users\ADMIN\Desktop\Anbu\client\src\pages\UserHistory.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Table, Card, Tag, Avatar, Space, Button, Typography, 
    Row, Col, Statistic, Spin, Divider, Breadcrumb, 
    Tooltip as AntTooltip 
} from 'antd';
import { 
    UserOutlined, ShoppingCartOutlined, WalletOutlined, 
    CalendarOutlined, ArrowLeftOutlined, HomeOutlined, 
    LineChartOutlined, MailOutlined, PhoneOutlined,
    ClockCircleOutlined, CheckCircleOutlined, GlobalOutlined,
    SafetyCertificateOutlined,
    MoreOutlined
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
            title: 'PRODUCT DETAILS',
            key: 'orderInfo',
            width: 350,
            render: (_, record) => (
                <Space size="middle">
                    <div style={{ position: 'relative' }}>
                        <Avatar 
                            shape="square" 
                            size={64} 
                            src={record.product_details?.image[0] || record.productId?.image[0]} 
                            icon={<ShoppingCartOutlined />} 
                            style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#fff' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Text strong style={{ fontSize: '15px', color: '#1e293b' }}>
                            {record.product_details?.name || record.productId?.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                            #{record.orderId.slice(-8).toUpperCase()}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'QTY',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (qty) => <Text strong style={{ color: '#475569' }}>{qty}</Text>
        },
        {
            title: 'AMOUNT',
            key: 'payment',
            render: (_, record) => (
                <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ color: '#0f172a', fontSize: '16px' }}>₹{record.totalAmt.toLocaleString()}</Text>
                    <br/>
                    <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{record.payment_status}</Text>
                </div>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'tracking_status',
            key: 'tracking_status',
            render: (status) => {
                const configs = {
                    'Delivered': { color: '#10b981', bg: '#f0fdf4' },
                    'Processing': { color: '#3b82f6', bg: '#eff6ff' },
                    'Pending': { color: '#f59e0b', bg: '#fffbeb' },
                    'Shipped': { color: '#8b5cf6', bg: '#f5f3ff' },
                    'Cancelled': { color: '#ef4444', bg: '#fef2f2' }
                };
                const config = configs[status] || { color: '#64748b', bg: '#f8fafc' };
                return (
                    <Tag style={{ 
                        borderRadius: '8px', 
                        padding: '4px 12px', 
                        border: 'none', 
                        fontWeight: 700,
                        color: config.color,
                        background: config.bg,
                        fontSize: '11px'
                    }}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'DATE',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text style={{ color: '#64748b', fontSize: '13px' }}>
                    {new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
            )
        }
    ];

    if (loading) {
        return (
            <div style={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text strong style={{ marginTop: 12, color: '#64748b', letterSpacing: '1px' }}>LOADING ANALYTICS...</Text>
                </Space>
            </div>
        );
    }

    const userData = historyData?.user || {};

    // Ensure a line is drawn even for a single data point
    const processedTrends = historyData?.trends?.length === 1 
        ? [
            { ...historyData.trends[0], amount: 0, date: 'Start' }, 
            historyData.trends[0]
          ] 
        : historyData?.trends;

    return (
        <div style={{ padding: '24px 40px', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Action Bar */}
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
                                <Title level={2} style={{ margin: 0, fontWeight: 600 }}>Customer Analytics</Title>
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
                {/* Modern User Header */}
                <Col xs={24}>
                    <Card 
                        bordered={false} 
                        style={{ 
                            borderRadius: 24, 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
                            background: '#fff',
                            border: '1px solid #e0e1e1'
                        }}
                    >
                        <Row gutter={40} align="middle">
                            <Col>
                                <Avatar 
                                    size={110} 
                                    src={userData.avatar} 
                                    icon={<UserOutlined />} 
                                    style={{ 
                                        border: '4px solid #fff', 
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        backgroundColor: '#f1f5f9' 
                                    }} 
                                />
                            </Col>
                            <Col flex="auto">
                                <Space direction="vertical" size={2}>
                                    <Space align="center">
                                        <Title level={2} style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>
                                            {userData.name || "Unknown Customer"}
                                        </Title>
                                    </Space>
                                    <Paragraph style={{ color: '#64748b', fontSize: '15px', marginBottom: 12 }}>
                                        Registered on {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </Paragraph>
                                    <Row gutter={32}>
                                        <Col><Space><MailOutlined style={{ color: '#94a3b8' }}/> <Text strong>{userData.email}</Text></Space></Col>
                                        <Col><Space><PhoneOutlined style={{ color: '#94a3b8' }}/> <Text strong>{userData.mobile || "N/A"}</Text></Space></Col>
                                    </Row>
                                </Space>
                            </Col>
                            <Col>
                                <div style={{ textAlign: 'right', padding: '0 20px' }}>
                                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Status</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag color="success" style={{ borderRadius: 20, padding: '2px 12px' }}>ACTIVE</Tag>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Key Metrics */}
                {[
                    { label: 'LIFETIME VALUE', value: historyData?.summary?.totalSpent, icon: <WalletOutlined />, color: '#6366f1', suffix: '₹' },
                    { label: 'TOTAL ORDERS', value: historyData?.summary?.totalOrders, icon: <ShoppingCartOutlined />, color: '#10b981', suffix: '' },
                    { label: 'AVERAGE TICKET', value: Math.round(historyData?.summary?.totalSpent / historyData?.summary?.totalOrders), icon: <LineChartOutlined />, color: '#f59e0b', suffix: '₹' }
                ].map((stat, idx) => (
                    <Col xs={24} md={8} key={idx}>
                        <Card bordered={true} style={{ borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e0e1e1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Statistic 
                                    title={<Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>{stat.label}</Text>}
                                    value={stat.value || 0} 
                                    suffix={stat.suffix}
                                    valueStyle={{ color: '#0f172a', fontWeight: 900, fontSize: '28px' }}
                                />
                                <div style={{ 
                                    padding: '12px', 
                                    borderRadius: '16px', 
                                    background: `${stat.color}10`, 
                                    color: stat.color,
                                    fontSize: '20px'
                                }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}

                {/* Visualization and History */}
                <Col xs={24}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0, color: '#0f172a' }}>Spending Analysis</Title>}
                        bordered={true} 
                        style={{ borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%', border: '1px solid #e0e1e1' }}
                    >
                        <div style={{ height: 350, marginTop: 20 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={processedTrends}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>



                <Col xs={24}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={4} style={{ margin: 0 }}>Full Transaction Log</Title>
                                <Button icon={<MoreOutlined />} type="text" />
                            </div>
                        }
                        bordered={true} 
                        style={{ borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e0e1e1' }}
                        bodyStyle={{ padding: '0 24px 24px' }}
                    >
                        <Table 
                            columns={historyColumns} 
                            dataSource={historyData?.orders} 
                            rowKey="_id"
                            pagination={{ 
                                pageSize: 8, 
                                hideOnSinglePage: true,
                                position: ['bottomCenter']
                            }}
                            className="custom-admin-table"
                            style={{ marginTop: 12 }}
                        />
                    </Card>
                </Col>
            </Row>

            <style>{`
                .custom-admin-table .ant-table-thead > tr > th {
                    background: transparent;
                    color: #94a3b8;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .custom-admin-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f8fafc;
                    padding: 16px 12px;
                }
                .custom-admin-table .ant-table-tbody > tr:hover > td {
                    background: #f8fafc !important;
                }
            `}</style>
        </div>
    );
};

export default UserHistory;
