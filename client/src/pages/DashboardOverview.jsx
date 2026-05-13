import React, { useEffect, useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Statistic, 
    Table, 
    DatePicker, 
    Badge, 
    Typography, 
    Space, 
    Avatar, 
    Button, 
    Empty,
    Spin,
    Divider,
    Tag,
    Modal
} from 'antd';
import { 
    UserOutlined, 
    ShoppingCartOutlined, 
    LineChartOutlined, 
    DatabaseOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    FilterOutlined,
    ArrowUpOutlined,
    TrophyOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { 
    FiUsers, 
    FiShoppingBag, 
    FiTrendingUp, 
    FiBox, 
    FiLayers, 
    FiDatabase 
} from 'react-icons/fi';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchStats = async (dates = []) => {
        try {
            setLoading(true);
            let url = SummaryApi.orderStats.url;
            if (dates.length === 2) {
                const start = dates[0].format('YYYY-MM-DD');
                const end = dates[1].format('YYYY-MM-DD');
                url += `?startDate=${start}&endDate=${end}`;
            }
            
            const response = await Axios({
                ...SummaryApi.orderStats,
                url: url
            });
            
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDateChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            fetchStats(dates);
        } else {
            fetchStats();
        }
    };

    const topProductsColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar shape="square" size={40} src={record.image[0]} />
                    <div style={{ maxWidth: 200 }}>
                        <Text strong ellipsis>{text}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>₹{record.price?.toLocaleString()}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Sold',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            sorter: (a, b) => a.totalQuantity - b.totalQuantity,
            render: (val) => <Tag color="blue">{val} units</Tag>
        },
        {
            title: 'Revenue',
            dataIndex: 'totalSales',
            key: 'totalSales',
            sorter: (a, b) => a.totalSales - b.totalSales,
            render: (val) => <Text strong>₹{val?.toLocaleString()}</Text>
        },
    ];

    const recentOrdersColumns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (id) => <Text copyable={{ text: id }}>#{id?.slice(-6)}</Text>
        },
        {
            title: 'Customer',
            dataIndex: 'userId',
            key: 'customer',
            render: (user) => user?.name || 'Guest'
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmt',
            key: 'totalAmt',
            render: (amt) => <Text strong>₹{amt?.toLocaleString()}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'tracking_status',
            key: 'status',
            render: (status) => {
                let color = 'gold';
                if (status === 'Delivered') color = 'green';
                if (status === 'Cancelled') color = 'red';
                return <Badge status={status === 'Delivered' ? 'success' : 'processing'} text={status} />;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Link to={`/order-details/${record._id}`}>
                    <Button type="link" size="small">Details</Button>
                </Link>
            )
        }
    ];
    
    const topProductsContent = (
        <div style={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
                {(stats?.topSellingProducts || []).map((product, index) => (
                    <Col xs={24} sm={12} key={product._id}>
                        <Card 
                            hoverable 
                            size="small" 
                            style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                            bodyStyle={{ padding: 12 }}
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <Badge count={index + 1} offset={[-5, 5]} color={index < 3 ? '#faad14' : '#d9d9d9'}>
                                    <Avatar shape="rounded" size={60} src={product.image[0]} />
                                </Badge>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <Text strong ellipsis style={{ display: 'block', fontSize: 13, lineHeight: '1.2' }} title={product.name}>
                                        {product.name}
                                    </Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{product.totalQuantity} Sales</Text>
                                        <Text strong style={{ fontSize: 11, color: '#1890ff' }}>₹{product.totalSales?.toLocaleString()}</Text>
                                    </div>
                                    <div style={{ marginTop: 6, height: 3, background: '#f5f5f5', borderRadius: 2 }}>
                                        <div 
                                            style={{ 
                                                height: '100%', 
                                                width: `${Math.min((product.totalQuantity / (stats?.topSellingProducts[0]?.totalQuantity || 1)) * 100, 100)}%`,
                                                background: index < 3 ? '#faad14' : '#1890ff',
                                                borderRadius: 2
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
                {(stats?.topSellingProducts?.length === 0) && (
                    <Col span={24}>
                        <Empty description="No top products found for this period" />
                    </Col>
                )}
            </Row>
        </div>
    );

    if (loading && !stats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip="Loading Analytics..." />
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ padding: '16px' }}>
            <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Title level={3} style={{ margin: 0 }}>Analytics Dashboard</Title>
                    <Text type="secondary">Monitor your store performance and sales trends</Text>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                    <Space direction="vertical" align="end" style={{ width: '100%' }}>
                        <RangePicker 
                            onChange={handleDateChange} 
                            style={{ borderRadius: 8, width: '100%', maxWidth: 320 }} 
                            placeholder={['Start Date', 'End Date']}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {dateRange?.length === 2 ? `Filtering: ${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D')}` : 'Showing All Time Data'}
                        </Text>
                    </Space>
                </Col>
            </Row>

            {/* Top Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable 
                        bordered={true} 
                        className="stat-card" 
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', cursor: 'default' }}
                    >
                        <Statistic
                            title={<Text type="secondary">Total Revenue</Text>}
                            value={stats?.totalRevenue}
                            precision={2}
                            prefix="₹"
                            valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Tag color="success" icon={<ArrowUpOutlined />}>Sales Insight</Tag>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable 
                        onClick={() => navigate('/dashboard/allorders')}
                        bordered={true} 
                        className="stat-card" 
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', cursor: 'pointer' }}
                    >
                        <Statistic
                            title={<Text type="secondary">Total Orders</Text>}
                            value={stats?.totalOrders}
                            valueStyle={{ fontWeight: 'bold' }}
                            prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary" size="small">{stats?.deliveredOrders} Delivered</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable 
                        onClick={() => navigate('/dashboard/users')}
                        bordered={true} 
                        className="stat-card" 
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', cursor: 'pointer' }}
                    >
                        <Statistic
                            title={<Text type="secondary">Customers</Text>}
                            value={stats?.totalUsers}
                            valueStyle={{ fontWeight: 'bold' }}
                            prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Badge status="processing" text="Platform Users" />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable 
                        onClick={() => navigate('/dashboard/allorders?status=Processing')}
                        bordered={true} 
                        className="stat-card" 
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', cursor: 'pointer' }}
                    >
                        <Statistic
                            title={<Text type="secondary">In Progress</Text>}
                            value={stats?.receivedOrders}
                            valueStyle={{ fontWeight: 'bold' }}
                            prefix={<ReloadOutlined style={{ color: '#fa8c16' }} />}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary">{stats?.canceledOrders} Cancelled</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Revenue Chart */}
                <Col xs={24} lg={15}>
                    <Card 
                        title={<Space><LineChartOutlined /> Revenue Analysis</Space>}
                       
                        bordered={true}
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', height: '100%' }}
                    >
                        <div style={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.monthlyStats || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#1890ff" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Top Selling Products - New Card Layout */}
                <Col xs={24} lg={9}>
                    <Card 
                        title={<Space><TrophyOutlined style={{ color: '#faad14' }} /> Top Selling Products</Space>}
                        bordered={true}
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb', height: '100%', overflow: 'hidden' }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                            {topProductsContent}
                        </div>
                    </Card>
                </Col>

            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                {/* Top Selling Products Graph Analysis */}
                <Col xs={24}>
                    <Card 
                        title={<Space><BarChartOutlined /> Top Selling Products: Graph Analysis</Space>}
                        bordered={true}
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}
                    >
                        <div style={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={stats?.topSellingProducts || []}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                    <XAxis type="number" axisLine={false} tickLine={false} />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        width={160}
                                        tick={(props) => {
                                            const { x, y, payload } = props;
                                            const product = stats?.topSellingProducts?.find(p => p.name === payload.value);
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <image
                                                        x={-150}
                                                        y={-15}
                                                        width={30}
                                                        height={30}
                                                        href={product?.image?.[0]}
                                                        style={{ borderRadius: '4px' }}
                                                    />
                                                    <text
                                                        x={-115}
                                                        y={5}
                                                        fill="#666"
                                                        style={{ fontSize: '10px', fontWeight: 500 }}
                                                    >
                                                        {payload.value.length > 20 ? `${payload.value.substring(0, 20)}...` : payload.value}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f9fafb' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const product = stats?.topSellingProducts?.find(p => p.name === label);
                                                return (
                                                    <div style={{ 
                                                        backgroundColor: '#fff', 
                                                        padding: '12px', 
                                                        border: 'none', 
                                                        borderRadius: '12px', 
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        <Avatar src={product?.image?.[0]} shape="square" size={40} />
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{label}</div>
                                                            <div style={{ fontSize: '12px', color: '#faad14' }}>Units Sold: <strong>{payload[0].value}</strong></div>
                                                            <div style={{ fontSize: '12px', color: '#1890ff' }}>Revenue: <strong>₹{payload[1].value?.toLocaleString()}</strong></div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar 
                                        dataKey="totalQuantity" 
                                        name="Units Sold"
                                        fill="#faad14" 
                                        radius={[0, 4, 4, 0]} 
                                        barSize={24}
                                        onClick={(data) => setSelectedProduct(data)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <Bar 
                                        dataKey="totalSales" 
                                        name="Total Sales (₹)"
                                        fill="#1890ff" 
                                        radius={[0, 4, 4, 0]} 
                                        barSize={12}
                                        onClick={(data) => setSelectedProduct(data)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Recent Orders */}
                <Col xs={24}>
                    <Card 
                        title={<Space><ShoppingCartOutlined /> Recent Transactions</Space>}
                        bordered={true}
                        style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}
                    >
                        <Table 
                            columns={recentOrdersColumns} 
                            dataSource={stats?.recentOrders || []} 
                            pagination={{ pageSize: 5 }}
                            rowKey="_id"
                            scroll={{ x: 800 }}
                            size="small"
                            onRow={(record) => ({
                                onClick: () => navigate('/dashboard/allorders'),
                                style: { cursor: 'pointer' }
                            })}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={<Space><TrophyOutlined style={{ color: '#faad14' }} /> Product Analytics: {selectedProduct?.name}</Space>}
                open={!!selectedProduct}
                onCancel={() => setSelectedProduct(null)}
                footer={[
                    <Space key="footer-actions" size="middle">
                        <Button onClick={() => setSelectedProduct(null)}>Close</Button>
                    </Space>
                ]}
                width={700}
                centered
            >
                {selectedProduct && (
                    <div style={{ padding: '10px 0' }}>
                        <Row gutter={[24, 24]}>
                            <Col span={8}>
                                <div style={{ textAlign: 'center', background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                                    <Avatar src={selectedProduct.image[0]} size={120} shape="square" style={{ borderRadius: '8px' }} />
                                    <div style={{ marginTop: 12 }}>
                                        <Badge status="success" text="In Stock" />
                                    </div>
                                </div>
                            </Col>
                            <Col span={16}>
                                <Title level={4}>{selectedProduct.name}</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Total Units Sold:</Text>
                                        <Text strong>{selectedProduct.totalQuantity} units</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Total Revenue Generated:</Text>
                                        <Text strong style={{ color: '#1890ff', fontSize: 18 }}>₹{selectedProduct.totalSales?.toLocaleString()}</Text>
                                    </div>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Revenue Contribution:</Text>
                                        <Text strong>{((selectedProduct.totalSales / stats?.totalRevenue) * 100).toFixed(2)}% of Store Sales</Text>
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                            <div 
                                                style={{ 
                                                    height: '100%', 
                                                    width: `${(selectedProduct.totalSales / stats?.totalRevenue) * 100}%`,
                                                    background: '#52c41a'
                                                }} 
                                            />
                                        </div>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                        
                        <div style={{ marginTop: 32 }}>
                            <Title level={5}><LineChartOutlined /> Sales Trend (Selected Period)</Title>
                            <div style={{ height: 250, width: '100%', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: 12 }}>
                                {selectedProduct.history?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={selectedProduct.history}>
                                            <defs>
                                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(str) => {
                                                    const d = new Date(str);
                                                    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                                                }}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="#1890ff" 
                                                strokeWidth={2}
                                                fillOpacity={1} 
                                                fill="url(#colorProd)" 
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="quantity" 
                                                stroke="#faad14" 
                                                strokeWidth={2}
                                                fill="transparent"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Empty description="No trend data available for the selected range" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 12 }}>
                                    <Space size="small"><div style={{ width: 10, height: 10, background: '#1890ff', borderRadius: 2 }}></div><Text style={{ fontSize: 11 }}>Revenue</Text></Space>
                                    <Space size="small"><div style={{ width: 10, height: 10, background: '#faad14', borderRadius: 2 }}></div><Text style={{ fontSize: 11 }}>Units Sold</Text></Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
                .dashboard-container {
                    padding: 16px;
                }
                .stat-card .ant-statistic-title {
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .stat-card .ant-statistic-content {
                    font-size: 22px;
                }
                .ant-card-head {
                    border-bottom: 1px solid #e5e7eb;
                    padding: 0 16px;
                }
                .ant-card-head-title {
                    font-weight: 700;
                    font-size: 16px;
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 12px;
                    }
                    .stat-card .ant-statistic-content {
                        font-size: 18px;
                    }
                    .ant-card-head-title {
                        font-size: 14px;
                    }
                }

                @media (max-width: 576px) {
                    .dashboard-container {
                        padding: 8px;
                    }
                    .ant-card-body {
                        padding: 12px;
                    }
                    .ant-table-cell {
                        padding: 8px !important;
                    }
                }

                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default DashboardOverview;
