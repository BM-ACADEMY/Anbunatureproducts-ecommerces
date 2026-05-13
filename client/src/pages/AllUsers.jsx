import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Avatar, Input, Space, Button, Typography, Row, Col, Statistic, Badge } from 'antd';
import { UserOutlined, SearchOutlined, ReloadOutlined, MailOutlined, PhoneOutlined, EyeOutlined } from '@ant-design/icons';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';

const { Title, Text } = Typography;

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await Axios(SummaryApi.getAllUsers);
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.mobile?.includes(searchText)
    );

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar 
                        src={record.avatar} 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#f0f0f0', border: '1px solid #e5e7eb' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: '14px' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record._id.slice(-8).toUpperCase()}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Contact Details',
            key: 'contact',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Space size={4}>
                        <MailOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                        <Text style={{ fontSize: '13px' }}>{record.email}</Text>
                    </Space>
                    {record.mobile && (
                        <Space size={4}>
                            <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                            <Text style={{ fontSize: '13px' }}>{record.mobile}</Text>
                        </Space>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'success' : 'error'} style={{ borderRadius: '6px', fontWeight: 'bold' }}>
                    {status?.toUpperCase() || 'ACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Verification',
            key: 'verification',
            render: (_, record) => (
                <Badge 
                    status={record.verify_email ? "success" : "default"} 
                    text={record.verify_email ? "Verified" : "Pending"} 
                />
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    icon={<EyeOutlined />} 
                    onClick={() => navigate(`/dashboard/user-history/${record._id}`)}
                    style={{ borderRadius: 8, background: '#4f46e5' }}
                >
                    View History
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Platform Users</Title>
                    <Text type="secondary">Manage and view all registered customers on your platform.</Text>
                </div>
                <Button 
                    icon={<ReloadOutlined />} 
                    onClick={fetchUsers}
                    loading={loading}
                    style={{ borderRadius: 10, fontWeight: 600 }}
                >
                    Refresh
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={true} style={{ borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e0e1e1' }}>
                        <Statistic 
                            title="Total Users" 
                            value={users.length} 
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={true} style={{ borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e0e1e1' }}>
                        <Statistic 
                            title="Verified Users" 
                            value={users.filter(u => u.verify_email).length} 
                            prefix={<Badge status="success" />} 
                        />
                    </Card>
                </Col>
            </Row>

            <Card 
                bordered={true} 
                style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e0e1e1' }}
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input
                        placeholder="Search users by name, email or mobile..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ maxWidth: 400, borderRadius: 10, padding: '8px 12px' }}
                    />
                </div>
                <Table 
                    columns={columns} 
                    dataSource={filteredUsers} 
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    scroll={{ x: 800 }}
                    style={{ padding: '0 8px' }}
                />
            </Card>
        </div>
    );
};

export default AllUsers;
