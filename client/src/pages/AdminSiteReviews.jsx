import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import { 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    Rate, 
    Space, 
    Tag, 
    Avatar, 
    Popconfirm, 
    Typography,
    Card,
    Tooltip,
    Row,
    Col,
    Dropdown,
    Menu
} from 'antd';
import { 
    PlusOutlined, 
    DeleteOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    StarFilled,
    MoreOutlined,
    MessageOutlined,
    ClockCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import NoData from '../components/NoData';

const { Title, Text, Paragraph } = Typography;

const AdminSiteReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    
    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: false
    });

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getAllSiteReviews
            });
            if (response.data.success) {
                const dataWithKeys = response.data.data.map(item => ({
                    ...item,
                    key: item._id
                }));
                setReviews(dataWithKeys);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleVerifyToken = async (id, isVerified) => {
        try {
            const response = await Axios({
                url: `${SummaryApi.verifySiteReview.url}/${id}`,
                method: SummaryApi.verifySiteReview.method,
                data: { isVerified }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(prev => prev.map(r => r._id === id ? { ...r, isVerified } : r));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await Axios({
                url: `${SummaryApi.deleteSiteReview.url}/${id}`,
                method: SummaryApi.deleteSiteReview.method
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    };

    const handleAddReview = async (values) => {
        setSubmitting(true);
        try {
            const response = await Axios({
                ...SummaryApi.submitSiteReview,
                data: values
            });

            if (response.data.success) {
                toast.success("Review added successfully");
                setShowAddModal(false);
                form.resetFields();
                fetchAllReviews();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add review");
        } finally {
            setSubmitting(false);
        }
    };

    const stats = {
        total: reviews.length,
        approved: reviews.filter(r => r.isVerified).length,
        pending: reviews.filter(r => !r.isVerified).length
    };

    const columns = [
        {
            title: 'Date Received',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'bg-slate-50/50 font-medium',
            width: 200,
            render: (date) => (
                <div>
                    <Text strong>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'User Info',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>user</Text>
                </div>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <Space size={4}>
                    <StarFilled style={{ color: '#faad14' }} />
                    <Text strong>{rating}/5</Text>
                </Space>
            ),
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: 'Status',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (isVerified) => (
                <Tag 
                    color={isVerified ? '#f6ffed' : '#e6f7ff'} 
                    style={{ 
                        color: isVerified ? '#52c41a' : '#1890ff',
                        borderColor: 'transparent',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '6px'
                    }}
                >
                    {isVerified ? 'APPROVED' : 'PENDING'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            width: 120,
            render: (_, record, index) => {
                const items = [
                    {
                        key: 'view',
                        label: 'View Details',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            setSelectedReview(record);
                            setShowViewModal(true);
                        }
                    },
                    {
                        key: 'verify',
                        label: record.isVerified ? 'Unverify' : 'Approve',
                        icon: record.isVerified ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
                        onClick: () => handleVerifyToken(record._id, !record.isVerified)
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Delete Review',
                                content: 'Are you sure you want to delete this review?',
                                okText: 'Yes, Delete',
                                okType: 'danger',
                                cancelText: 'No',
                                centered: true,
                                onOk: () => handleDelete(record._id)
                            });
                        }
                    }
                ];
                return (
                    <div className="flex justify-end pr-4">
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                            <Button 
                                type="text" 
                                icon={<MoreOutlined style={{ fontSize: '24px', color: '#334155', fontWeight: 'bold' }} />} 
                                className={`flex items-center justify-center transition-all active:scale-95 `}
                            />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
                <Col>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Testimonials</Title>
                    <Text type="secondary">Review and manage user feedback appearing on the public website</Text>
                </Col>
                <Col>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setShowAddModal(true)}
                        size="large"
                        style={{ borderRadius: '8px', height: '44px', fontWeight: 600, display: 'flex', alignItems: 'center' }}
                    >
                        Add Testimonial
                    </Button>
                </Col>
            </Row>

            {/* Stats Cards */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} md={8}>
                    <Card bordered={true} className="shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl border-[#cacbcc94]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <MessageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Total Reviews</Text>
                                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{stats.total}</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={true} className="shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl border-[#cacbcc94]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Approved</Text>
                                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{stats.approved}</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={true} className="shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl border-[#cacbcc94]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Pending</Text>
                                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{stats.pending}</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Table Card */}
            <Card bordered={true} className="shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden border-[#cacbcc94]" bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={reviews} 
                    loading={loading}
                    pagination={{
                        ...pagination,
                        style: { margin: '16px 24px' }
                    }}
                    onChange={(p) => setPagination(p)}
                    locale={{ emptyText: <NoData /> }}
                    className="testimonial-table"
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* View Review Modal */}
            <Modal
                title={<Title level={4}>Review Details</Title>}
                open={showViewModal}
                onCancel={() => setShowViewModal(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                ]}
                centered
                destroyOnClose
            >
                {selectedReview && (
                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Customer</Text>
                                <Title level={4} style={{ margin: 0 }}>{selectedReview.name}</Title>
                            </div>
                            <Tag color={selectedReview.isVerified ? 'success' : 'warning'}>
                                {selectedReview.isVerified ? 'APPROVED' : 'PENDING'}
                            </Tag>
                        </div>
                        
                        <div>
                            <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Rating</Text>
                            <div className="mt-1">
                                <Rate disabled defaultValue={selectedReview.rating} />
                                <Text strong className="ml-2">{selectedReview.rating}/5</Text>
                            </div>
                        </div>

                        <div>
                            <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Comment</Text>
                            <Paragraph className="mt-1 text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {selectedReview.comment}
                            </Paragraph>
                        </div>

                        <div className="flex gap-8">
                            <div>
                                <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Date</Text>
                                <div className="mt-1 font-semibold">
                                    {new Date(selectedReview.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <div>
                                <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Time</Text>
                                <div className="mt-1 font-semibold">
                                    {new Date(selectedReview.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={<Title level={4}>New Review</Title>}
                open={showAddModal}
                onCancel={() => setShowAddModal(false)}
                footer={null}
                centered
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddReview}
                    initialValues={{ rating: 5 }}
                >
                    <Form.Item
                        name="name"
                        label="Customer Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="e.g. John Doe" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[{ required: true }]}
                    >
                        <Rate style={{ fontSize: 24 }} />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Comment"
                        rules={[
                            { required: true, message: 'Please enter comment' },
                            { max: 200, message: 'Comment cannot exceed 200 characters' }
                        ]}
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="What did the customer say?" 
                            showCount 
                            maxLength={200} 
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setShowAddModal(false)} size="large">
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={submitting} 
                                size="large"
                            >
                                Publish Review
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <style jsx>{`
                .testimonial-table :global(.ant-table-thead > tr > th) {
                    background: #ffffff;
                    color: #595959;
                    font-weight: 600;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 16px 24px;
                }
                .testimonial-table :global(.ant-table-tbody > tr > td) {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .testimonial-table :global(.ant-table-row:hover > td) {
                    background: #fafafa !important;
                }
                .testimonial-table :global(.bg-slate-50\/50) {
                    background-color: #f9fafb !important;
                }
            `}</style>
        </div>
    );
};

export default AdminSiteReviews;

